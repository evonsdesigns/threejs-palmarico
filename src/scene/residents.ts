import * as THREE from "three";
import { buildings, GameSnapshot, planResidents, ResidentPlan } from "../logic/game";
import { findWalkPathFromStarts, footprintIntersectsCircle, GRID_TILE_SIZE, GridFootprint, GridTile, residentStep, WalkBounds, walkSegmentClear, walkSegmentClearOfBounds } from "../logic/grid";

const WALK_TILE_SIZE = 2;
const RESIDENT_CLEARANCE = 0.6;

interface Resident {
  model: THREE.Group;
  limbs: THREE.Group[];
  plan: ResidentPlan;
  step: number;
  wait: number;
  stride: number;
  path: GridTile[] | null;
  unreachable: Set<number>;
  hat: THREE.Group;
  speed: number;
  blockedTime: number;
  avoiding: boolean;
  retreating: boolean;
  inside: number | null;
}

export class Residents {
  private readonly people: Resident[] = [];
  private lastPlaced: GameSnapshot["placed"] | null = null;
  private lastPopulation = -1;
  private bounds: WalkBounds[] = [];
  private readonly terrain = new Map<string, boolean>();
  private readonly reportedUnreachable = new Set<number>();
  private readonly head = new THREE.SphereGeometry(0.22, 12, 10);
  private readonly hair = new THREE.SphereGeometry(0.225, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.55);
  private readonly neck = new THREE.CylinderGeometry(0.085, 0.1, 0.16, 10);
  private readonly torso = new THREE.CylinderGeometry(0.27, 0.2, 0.66, 12);
  private readonly arm = new THREE.CylinderGeometry(0.085, 0.065, 0.52, 8);
  private readonly sleeve = new THREE.CylinderGeometry(0.1, 0.085, 0.18, 10);
  private readonly leg = new THREE.CylinderGeometry(0.1, 0.075, 0.58, 8);
  private readonly skirt = new THREE.CylinderGeometry(0.2, 0.31, 0.58, 12);
  private readonly hand = new THREE.SphereGeometry(0.065, 8, 6);
  private readonly shoe = new THREE.SphereGeometry(0.1, 8, 6);
  private readonly faceDetail = new THREE.SphereGeometry(0.022, 8, 6);
  private readonly hatBrim = new THREE.CylinderGeometry(0.4, 0.4, 0.045, 16);
  private readonly hatCrown = new THREE.CylinderGeometry(0.15, 0.2, 0.2, 12);
  private readonly hatBand = new THREE.CylinderGeometry(0.19, 0.19, 0.045, 12);
  private readonly skin = [0x6f4936, 0xa86d4d, 0xd49d70].map((color) => new THREE.MeshStandardMaterial({ color }));
  private readonly clothes = [0xd6c285, 0x7197a0, 0xe4ddca, 0xa7644f, 0x818e71].map((color) => new THREE.MeshStandardMaterial({ color }));
  private readonly trousers = new THREE.MeshStandardMaterial({ color: 0x4d463a });
  private readonly hairMaterial = new THREE.MeshStandardMaterial({ color: 0x30251e });
  private readonly eyes = new THREE.MeshStandardMaterial({ color: 0x33231b });
  private readonly straw = new THREE.MeshStandardMaterial({ color: 0xcbb475 });
  private readonly hatBandMaterial = new THREE.MeshStandardMaterial({ color: 0x76513a });

  constructor(
    private readonly scene: THREE.Scene,
    private readonly heightAt: (x: number, z: number) => number | null,
    private readonly trees: THREE.Vector2[],
    private readonly buildingModel: (index: number) => THREE.Object3D,
  ) {}

  sync(state: GameSnapshot) {
    if (this.lastPlaced === state.placed && this.lastPopulation === state.population) return;
    const changedBuildings = this.lastPlaced !== state.placed;
    if (changedBuildings) {
      this.reportedUnreachable.clear();
      this.bounds = state.placed.map((_, index) => {
        const model = this.buildingModel(index);
        model.updateWorldMatrix(true, true);
        const box = new THREE.Box3().setFromObject(model);
        if (box.isEmpty()) throw new Error(`Building ${index} has no bounds for resident navigation.`);
        return { minX: box.min.x, maxX: box.max.x, minZ: box.min.z, maxZ: box.max.z };
      });
    }
    this.lastPlaced = state.placed;
    this.lastPopulation = state.population;
    const plans = planResidents(state.placed, state.population);
    while (this.people.length > plans.length) {
      const person = this.people.pop()!;
      this.scene.remove(person.model);
    }
    plans.forEach((plan, index) => {
      let person = this.people[index];
      if (!person) {
        person = this.createPerson(index, plan);
        this.people.push(person);
        this.scene.add(person.model);
      }
      if (plan.home === null) person.inside = null;
      if (!person.model.visible && person.inside === null && plan.home !== null) {
        const point = this.spawnPoint(state, plan.home);
        person.model.position.set(point.x, this.ground(point.x, point.z), point.z);
      }
      person.model.visible = plan.home !== null && person.inside === null;
      person.plan = plan;
      person.hat.visible = plan.work !== null && state.placed[plan.work].type === "farm";
      person.path = null;
      person.avoiding = false;
      person.retreating = false;
      person.blockedTime = 0;
      if (changedBuildings) person.unreachable.clear();
    });
  }

  blocksFootprint(footprint: GridFootprint) {
    return this.people.some((person) => person.model.visible
      && footprintIntersectsCircle(footprint, person.model.position.x, person.model.position.z, 0.86));
  }

  /** How many residents are currently inside each building, keyed by building index. */
  insideCounts() {
    const counts = new Map<number, number>();
    for (const person of this.people) {
      if (person.inside !== null) counts.set(person.inside, (counts.get(person.inside) ?? 0) + 1);
    }
    return counts;
  }

  update(delta: number, state: GameSnapshot) {
    this.people.forEach((person) => {
      const { home, work, service } = person.plan;
      if (home === null) return;
      const route = [home, work ?? home, home, service ?? home];
      if (person.wait > 0) {
        person.wait -= delta;
        person.limbs.forEach((limb) => { limb.rotation.x = 0; });
        return;
      }
      if (person.inside !== null && !this.exitBuilding(person, state)) {
        person.wait = 0.3;
        return;
      }
      if (person.path === null) {
        const buildingIndex = route[person.step];
        const roaming = (person.step === 1 && work === null) || (person.step === 3 && service === null);
        if (!roaming && person.unreachable.has(buildingIndex)) {
          person.step = (person.step + 1) % route.length;
          person.wait = 1;
          return;
        }
        const building = state.placed[buildingIndex];
        const definition = buildings.find((item) => item.id === building.type)!;
        const bounds = this.bounds[buildingIndex];
        const min = this.tileAt(bounds.minX, bounds.minZ);
        const max = this.tileAt(bounds.maxX, bounds.maxZ);
        const goals: GridTile[] = [];
        for (let x = min.x; x <= max.x; x++) {
          goals.push({ x, z: min.z - 1 }, { x, z: max.z + 1 });
        }
        for (let z = min.z; z <= max.z; z++) {
          goals.push({ x: min.x - 1, z }, { x: max.x + 1, z });
        }
        const current = this.tileAt(person.model.position.x, person.model.position.z);
        const occupied = new Set(this.people.filter((other) => other !== person && other.model.visible)
          .map((other) => {
            const tile = this.tileAt(other.model.position.x, other.model.position.z);
            return `${tile.x},${tile.z}`;
          }));
        const occupiedClear = (tile: GridTile) => {
          if (!occupied.has(`${tile.x},${tile.z}`)) return true;
          const minX = tile.x * WALK_TILE_SIZE;
          const minZ = tile.z * WALK_TILE_SIZE;
          const { x, z } = person.model.position;
          return x >= minX - RESIDENT_CLEARANCE && x <= minX + WALK_TILE_SIZE + RESIDENT_CLEARANCE
            && z >= minZ - RESIDENT_CLEARANCE && z <= minZ + WALK_TILE_SIZE + RESIDENT_CLEARANCE;
        };
        const walkable = (tile: GridTile) => this.walkable(tile)
          && (!person.avoiding || occupiedClear(tile));
        const clear = (from: GridTile, to: GridTile) => this.clear(from, to)
          && (!person.avoiding || walkSegmentClear(from, to, RESIDENT_CLEARANCE, occupiedClear, WALK_TILE_SIZE));
        const canStep = (from: GridTile, to: GridTile) => clear(this.center(from), this.center(to));
        const starts: GridTile[] = [];
        for (let x = -2; x <= 2; x++) {
          for (let z = -2; z <= 2; z++) {
            const tile = { x: current.x + x, z: current.z + z };
            if (walkable(tile) && clear(person.model.position, this.center(tile))) starts.push(tile);
          }
        }
        starts.sort((a, b) => {
          const pa = this.center(a);
          const pb = this.center(b);
          return Math.hypot(pa.x - person.model.position.x, pa.z - person.model.position.z)
            - Math.hypot(pb.x - person.model.position.x, pb.z - person.model.position.z);
        });
        const available = goals.filter((tile) => walkable(tile) && (!roaming || tile.x !== current.x || tile.z !== current.z));
        if (available.length) {
          const nearest = Math.min(...available.map((tile) => Math.hypot(tile.x - current.x, tile.z - current.z)));
          const nearby = available.filter((tile) => Math.hypot(tile.x - current.x, tile.z - current.z) <= nearest + 1.5);
          const chosen = nearby[Math.floor(Math.random() * nearby.length)];
          person.path = clear(person.model.position, this.center(chosen))
            ? [chosen]
            : findWalkPathFromStarts(starts, available, walkable, canStep);
        }
        if (person.path === null) {
          if (person.avoiding) {
            const neighbors = starts.filter((tile) => !occupied.has(`${tile.x},${tile.z}`));
            const closest = this.people.filter((other) => other !== person && other.model.visible)
              .sort((a, b) => a.model.position.distanceToSquared(person.model.position) - b.model.position.distanceToSquared(person.model.position))[0];
            if (closest) neighbors.sort((a, b) => {
              const pa = this.center(a);
              const pb = this.center(b);
              return Math.hypot(pb.x - closest.model.position.x, pb.z - closest.model.position.z)
                - Math.hypot(pa.x - closest.model.position.x, pa.z - closest.model.position.z);
            });
            if (neighbors.length) {
              person.path = [neighbors[0]];
              person.retreating = true;
            } else {
              person.wait = 0.4 + Math.random() * 0.4;
              return;
            }
          } else {
            if (!roaming && !this.reportedUnreachable.has(buildingIndex)) {
              console.warn(`Residents cannot reach ${definition.name} at (${building.x}, ${building.z}).`);
              this.reportedUnreachable.add(buildingIndex);
            }
            if (!roaming) person.unreachable.add(buildingIndex);
            person.step = (person.step + 1) % route.length;
            person.wait = 1;
            return;
          }
        }
        person.path = this.shortenPath(person.model.position, person.path, clear);
      }
      const target = this.center(person.path[0]);
      const dx = target.x - person.model.position.x;
      const dz = target.z - person.model.position.z;
      const distance = Math.hypot(dx, dz);
      const desiredTravel = Math.min(distance, person.speed * delta);
      let travel = 0;
      if (distance > 0.001) {
        const position = person.model.position;
        const others = this.people.filter((other) => other !== person && other.model.visible).map((other) => other.model.position);
        const next = residentStep(position, target, desiredTravel, others, (start, end) => this.clear(start, end));
        const moveX = next.x - position.x;
        const moveZ = next.z - position.z;
        travel = Math.hypot(moveX, moveZ);
        if (travel < desiredTravel * 0.1) {
          person.blockedTime += delta;
          if (person.blockedTime >= 0.7) {
            person.path = null;
            person.avoiding = true;
            person.retreating = false;
            person.blockedTime = 0;
          }
        } else {
          person.blockedTime = 0;
        }
        person.model.position.x = next.x;
        person.model.position.z = next.z;
        person.model.position.y = this.ground(person.model.position.x, person.model.position.z);
        if (travel > 0.001) person.model.rotation.y = Math.atan2(moveX, moveZ);
        person.stride += travel * 3;
        person.limbs.forEach((limb, i) => {
          limb.rotation.x = Math.sin(person.stride) * (i % 2 ? -0.5 : 0.5) * (i >= 2 ? -1 : 1);
        });
      }
      if (person.path && Math.hypot(target.x - person.model.position.x, target.z - person.model.position.z) <= 0.001) {
        person.path.shift();
        if (person.path.length === 0) {
          person.path = null;
          if (person.retreating) {
            person.retreating = false;
          } else {
            const arrivedAt = route[person.step];
            const roaming = (person.step === 1 && work === null) || (person.step === 3 && service === null);
            const housing = buildings.find((item) => item.id === state.placed[arrivedAt].type)!.housing > 0;
            const canEnter = !roaming && (arrivedAt === home ? housing : !housing);
            person.step = (person.step + 1) % route.length;
            person.avoiding = false;
            if (!canEnter) {
              person.wait = 0.6 + Math.random() * 1.4;
            } else {
              person.inside = arrivedAt;
              person.model.visible = false;
              const [min, max] = arrivedAt === work ? [5, 9] : arrivedAt === home ? [3, 6] : [2, 4];
              person.wait = min + Math.random() * (max - min);
            }
          }
        }
      }
    });
  }

  private exitBuilding(person: Resident, state: GameSnapshot) {
    const position = person.model.position;
    const crowded = (x: number, z: number) => this.people.some((other) => other !== person && other.model.visible
      && Math.hypot(other.model.position.x - x, other.model.position.z - z) < 1.3);
    if (!this.clear(position, position) || crowded(position.x, position.z)) {
      const point = this.spawnPoint(state, person.inside!);
      if (crowded(point.x, point.z)) return false;
      position.set(point.x, this.ground(point.x, point.z), point.z);
    }
    person.inside = null;
    person.model.visible = true;
    return true;
  }

  private shortenPath(position: GridTile, path: GridTile[], clear: (from: GridTile, to: GridTile) => boolean) {
    const result: GridTile[] = [];
    let point = { x: position.x, z: position.z };
    let from = 0;
    while (from < path.length) {
      let next = path.length - 1;
      while (next > from && !clear(point, this.center(path[next]))) next--;
      if (!clear(point, this.center(path[next]))) {
        throw new Error("Unable to create a safe resident path.");
      }
      result.push(path[next]);
      point = this.center(path[next]);
      from = next + 1;
    }
    return result;
  }

  private ground(x: number, z: number) {
    const height = this.heightAt(x, z);
    if (height === null) throw new Error("A resident walked beyond the island terrain.");
    return height;
  }

  private tileAt(x: number, z: number): GridTile {
    return { x: Math.floor(x / WALK_TILE_SIZE), z: Math.floor(z / WALK_TILE_SIZE) };
  }

  private center(tile: GridTile) {
    return { x: (tile.x + 0.5) * WALK_TILE_SIZE, z: (tile.z + 0.5) * WALK_TILE_SIZE };
  }

  private walkable(tile: GridTile) {
    const center = this.center(tile);
    return this.clear(center, center);
  }

  private clear(start: GridTile, end: GridTile) {
    return walkSegmentClearOfBounds(start, end, RESIDENT_CLEARANCE, this.bounds)
      && walkSegmentClear(start, end, RESIDENT_CLEARANCE, (tile) => this.terrainWalkable(tile));
  }

  private terrainWalkable(tile: GridTile) {
    const key = `${tile.x},${tile.z}`;
    if (!this.terrain.has(key)) {
      const footprint = { minX: tile.x, minZ: tile.z, sizeX: 1, sizeZ: 1 };
      const tree = this.trees.some((position) => footprintIntersectsCircle(footprint, position.x, position.y, 0.7));
      const center = { x: (tile.x + 0.5) * GRID_TILE_SIZE, z: (tile.z + 0.5) * GRID_TILE_SIZE };
      const samples = [[0, 0], [-2, -2], [-2, 2], [2, -2], [2, 2]];
      const dry = samples.every(([x, z]) => {
        const height = this.heightAt(center.x + x, center.z + z);
        return height !== null && height >= 1;
      });
      this.terrain.set(key, !tree && dry);
    }
    return this.terrain.get(key)!;
  }

  private spawnPoint(state: GameSnapshot, index: number) {
    const building = state.placed[index];
    const origin = this.tileAt(building.x, building.z);
    const occupied = new Set(this.people.filter((person) => person.model.visible)
      .map((person) => {
        const tile = this.tileAt(person.model.position.x, person.model.position.z);
        return `${tile.x},${tile.z}`;
      }));
    for (let ring = 1; ring <= 512; ring++) {
      const candidates: GridTile[] = [];
      for (let x = -ring; x <= ring; x++) {
        for (let z = -ring; z <= ring; z++) {
          if (Math.max(Math.abs(x), Math.abs(z)) !== ring) continue;
          const tile = { x: origin.x + x, z: origin.z + z };
          const center = this.center(tile);
          if (!occupied.has(`${tile.x},${tile.z}`) && this.walkable(tile)
            && this.people.every((person) => !person.model.visible || Math.hypot(person.model.position.x - center.x, person.model.position.z - center.z) >= 1.3)) candidates.push(tile);
        }
      }
      if (candidates.length) {
        candidates.sort((a, b) => b.x + b.z - a.x - a.z);
        return this.center(candidates[0]);
      }
    }
    throw new Error("Unable to find open land for a resident.");
  }

  private createPerson(index: number, plan: ResidentPlan): Resident {
    const model = new THREE.Group();
    model.visible = false;
    model.scale.setScalar(1.3);
    const torso = new THREE.Mesh(this.torso, this.clothes[index % this.clothes.length]);
    torso.position.y = 1.05;
    torso.scale.z = 0.7;
    model.add(torso);
    const neck = new THREE.Mesh(this.neck, this.skin[index % this.skin.length]);
    neck.position.y = 1.4;
    model.add(neck);
    const head = new THREE.Mesh(this.head, this.skin[index % this.skin.length]);
    head.position.y = 1.58;
    head.scale.set(0.9, 1.12, 0.9);
    model.add(head);
    for (const side of [-1, 1]) {
      const eye = new THREE.Mesh(this.faceDetail, this.eyes);
      eye.position.set(side * 0.07, 1.62, 0.187);
      model.add(eye);
    }
    const nose = new THREE.Mesh(this.hand, this.skin[index % this.skin.length]);
    nose.scale.set(0.6, 0.75, 0.7);
    nose.position.set(0, 1.55, 0.2);
    model.add(nose);
    const hair = new THREE.Mesh(this.hair, this.hairMaterial);
    hair.position.y = 1.64;
    hair.scale.set(0.94, 1.05, 0.94);
    model.add(hair);
    const hat = new THREE.Group();
    hat.position.y = 1.78;
    const brim = new THREE.Mesh(this.hatBrim, this.straw);
    const crown = new THREE.Mesh(this.hatCrown, this.straw);
    crown.position.y = 0.12;
    const band = new THREE.Mesh(this.hatBand, this.hatBandMaterial);
    band.position.y = 0.055;
    hat.add(brim, crown, band);
    model.add(hat);
    if (index % 3 === 1) {
      const skirt = new THREE.Mesh(this.skirt, this.clothes[index % this.clothes.length]);
      skirt.position.y = 0.62;
      skirt.scale.z = 0.8;
      model.add(skirt);
    }
    const limbs: THREE.Group[] = [];
    for (let i = 0; i < 4; i++) {
      const arm = i >= 2;
      const pivot = new THREE.Group();
      pivot.position.set((i % 2 ? 1 : -1) * (arm ? 0.31 : 0.12), arm ? 1.28 : 0.73, 0);
      const mesh = new THREE.Mesh(arm ? this.arm : this.leg, arm ? this.skin[index % this.skin.length] : this.trousers);
      mesh.position.y = arm ? -0.26 : -0.29;
      pivot.add(mesh);
      if (arm) {
        const sleeve = new THREE.Mesh(this.sleeve, this.clothes[index % this.clothes.length]);
        sleeve.position.y = -0.09;
        pivot.add(sleeve);
      }
      const end = new THREE.Mesh(arm ? this.hand : this.shoe, arm ? this.skin[index % this.skin.length] : this.trousers);
      end.position.set(0, arm ? -0.54 : -0.61, arm ? 0 : 0.05);
      if (!arm) end.scale.set(1, 0.65, 1.5);
      pivot.add(end);
      model.add(pivot);
      limbs.push(pivot);
    }
    return { model, limbs, plan, step: index % 4, wait: Math.random(), stride: index, path: null, unreachable: new Set(), hat,
      speed: 2.6 + Math.random() * 0.8, blockedTime: 0, avoiding: false, retreating: false, inside: null };
  }
}
