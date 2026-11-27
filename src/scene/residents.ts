import * as THREE from "three";
import { buildings, type GameSnapshot, planCitizens, type ResidentPlan } from "../logic/game";
import { citizenOrderBlock, type CitizenOrderEvent, type CitizenOrderStatus } from "../logic/citizens";
import { findWalkPathFromStarts, footprintIntersectsCircle, GRID_TILE_SIZE, type GridFootprint, type GridTile, residentStep, type WalkBounds, walkSegmentClear, walkSegmentClearOfBounds } from "../logic/grid";

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
  detained: boolean;
  tag: THREE.Mesh;
}

export class Residents {
  private readonly scene: THREE.Scene;
  private readonly heightAt: (x: number, z: number) => number | null;
  private readonly trees: THREE.Vector2[];
  private readonly buildingModel: (index: number) => THREE.Object3D;
  private readonly people: Resident[] = [];
  private lastPlaced: GameSnapshot["placed"] | null = null;
  private lastPopulation = -1;
  private lastCitizenIds: number[] | null = null;
  private lastPrisoners: GameSnapshot["prisoners"] | null = null;
  private lastEdicts: GameSnapshot["activeEdicts"] | null = null;
  private lastOrders: GameSnapshot["citizenOrders"] | null = null;
  private readonly officers = new Map<number, { person: Resident; retry: number }>();
  private inspectedCitizen: number | null = null;
  private readonly tagGeometry = new THREE.OctahedronGeometry(0.23);
  private readonly bribeTag = new THREE.MeshBasicMaterial({ color: 0xffd75a });
  private readonly hereticTag = new THREE.MeshBasicMaterial({ color: 0xc98bdb });
  private readonly orderTag = new THREE.MeshBasicMaterial({ color: 0xe59a43 });
  private readonly policeUniform = new THREE.MeshStandardMaterial({ color: 0x315e86 });
  private readonly soldierUniform = new THREE.MeshStandardMaterial({ color: 0x536844 });
  private readonly selection = new THREE.Mesh(
    new THREE.RingGeometry(0.75, 0.95, 24),
    new THREE.MeshBasicMaterial({ color: 0xffe399, side: THREE.DoubleSide, depthWrite: false }),
  );
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
    scene: THREE.Scene,
    heightAt: (x: number, z: number) => number | null,
    trees: THREE.Vector2[],
    buildingModel: (index: number) => THREE.Object3D,
  ) {
    this.scene = scene;
    this.heightAt = heightAt;
    this.trees = trees;
    this.buildingModel = buildingModel;
    this.selection.rotation.x = -Math.PI / 2;
    this.selection.visible = false;
    this.scene.add(this.selection);
  }

  sync(state: GameSnapshot) {
    this.inspectedCitizen = state.inspectedCitizen;
    this.syncSelection();
    if (this.lastPlaced === state.placed && this.lastPopulation === state.population
      && this.lastCitizenIds === state.citizenIds && this.lastPrisoners === state.prisoners && this.lastEdicts === state.activeEdicts && this.lastOrders === state.citizenOrders) return;
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
    this.lastCitizenIds = state.citizenIds;
    this.lastPrisoners = state.prisoners;
    this.lastEdicts = state.activeEdicts;
    this.lastOrders = state.citizenOrders;
    for (const [id, officer] of this.officers) {
      if (!state.citizenOrders.some((order) => order.id === id)) {
        this.scene.remove(officer.person.model);
        this.officers.delete(id);
      } else if (changedBuildings) {
        officer.person.path = null;
        officer.retry = 0;
      }
    }
    const plans = planCitizens(state);
    const living = new Set(state.citizenIds);
    for (let index = this.people.length - 1; index >= 0; index--) {
      if (!living.has(this.people[index].model.userData.citizenId)) {
        this.scene.remove(this.people[index].model);
        this.people.splice(index, 1);
      }
    }
    const existing = new Map(this.people.map((person) => [person.model.userData.citizenId, person]));
    plans.forEach((plan, index) => {
      const citizenId = state.citizenIds[index];
      let person = existing.get(citizenId);
      if (!person) {
        person = this.createPerson(citizenId - 1, plan);
        this.scene.add(person.model);
      }
      this.people[index] = person;
      person.model.userData.citizenId = citizenId;
      const prisoner = state.prisoners.find((entry) => entry.citizenId === citizenId);
      person.detained = Boolean(prisoner);
      if (plan.home === null || prisoner) person.inside = null;
      if (prisoner) {
        const building = state.placed[prisoner.buildingIndex];
        person.model.position.set(building.x, this.ground(building.x, building.z), building.z);
      } else if (!person.model.visible && person.inside === null && plan.home !== null) {
        const point = this.spawnPoint(state, plan.home);
        person.model.position.set(point.x, this.ground(point.x, point.z), point.z);
      }
      person.model.visible = !prisoner && plan.home !== null && person.inside === null;
      const effects = state.activeEdicts.filter((entry) => entry.citizenId === citizenId);
      const heretic = effects.some((entry) => entry.id === "heretic");
      const ordered = state.citizenOrders.some((order) => order.citizenId === citizenId);
      person.tag.visible = ordered || heretic || effects.some((entry) => entry.id === "bribe");
      person.tag.material = ordered ? this.orderTag : heretic ? this.hereticTag : this.bribeTag;
      person.plan = plan;
      person.hat.visible = plan.work !== null && state.placed[plan.work].type === "farm";
      person.path = null;
      person.avoiding = false;
      person.retreating = false;
      person.blockedTime = 0;
      if (changedBuildings) person.unreachable.clear();
    });
    this.syncSelection();
  }

  positionOf(citizenId: number): THREE.Vector3 | null {
    const person = this.people.find((entry) => entry.model.userData.citizenId === citizenId);
    if (!person || (person.plan.home === null && !person.detained)) return null;
    return person.inside === null ? person.model.position.clone()
      : this.buildingModel(person.inside).getWorldPosition(new THREE.Vector3());
  }

  private syncSelection() {
    const person = this.people.find((entry) => entry.model.userData.citizenId === this.inspectedCitizen);
    this.selection.visible = Boolean(person?.model.visible);
    if (person) {
      this.selection.position.copy(person.model.position);
      this.selection.position.y += 0.08;
    }
  }

  blocksFootprint(footprint: GridFootprint) {
    return [...this.people, ...Array.from(this.officers.values(), (officer) => officer.person)].some((person) => person.model.visible
      && footprintIntersectsCircle(footprint, person.model.position.x, person.model.position.z, 0.86));
  }

  pick(raycaster: THREE.Raycaster): { citizenId: number; distance: number } | null {
    const models = this.people.filter((person) => person.model.visible).map((person) => person.model);
    models.forEach((model) => model.updateWorldMatrix(true, true));
    const hit = raycaster.intersectObjects(models, true).find((intersection) => {
      let object: THREE.Object3D | null = intersection.object;
      while (object) {
        if (!object.visible) return false;
        object = object.parent;
      }
      return true;
    });
    if (!hit) return null;
    let object: THREE.Object3D | null = hit.object;
    while (object && object.userData.citizenId === undefined) object = object.parent;
    if (!object) throw new Error("Picked resident has no citizen identity.");
    return { citizenId: object.userData.citizenId, distance: hit.distance };
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
    if (delta <= 0 || state.paused || state.gameOver) {
      this.syncSelection();
      return [];
    }
    this.people.forEach((person) => {
      if (person.detained) return;
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
        const others = this.people.filter((other) => other !== person && other.model.visible).map((other) => other.model.position);
        travel = this.movePerson(person, target, delta, others);
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
    const events = this.updateOrders(delta, state);
    this.syncSelection();
    return events;
  }

  private movePerson(person: Resident, target: GridTile, delta: number, others: GridTile[]) {
    const position = person.model.position;
    const desired = Math.min(Math.hypot(target.x - position.x, target.z - position.z), person.speed * delta);
    const next = residentStep(position, target, desired, others, (start, end) => this.clear(start, end));
    const dx = next.x - position.x;
    const dz = next.z - position.z;
    const travel = Math.hypot(dx, dz);
    position.set(next.x, this.ground(next.x, next.z), next.z);
    if (travel > 0.001) person.model.rotation.y = Math.atan2(dx, dz);
    person.stride += travel * 3;
    person.limbs.forEach((limb, i) => {
      limb.rotation.x = Math.sin(person.stride) * (i % 2 ? -0.5 : 0.5) * (i >= 2 ? -1 : 1);
    });
    return travel;
  }

  private updateOrders(delta: number, state: GameSnapshot): CitizenOrderEvent[] {
    const events: CitizenOrderEvent[] = [];
    if (delta <= 0 || state.paused || state.gameOver) return events;
    const busy = new Set<number>();
    for (const order of state.citizenOrders) {
      const status = (value: CitizenOrderStatus) => {
        if (order.status !== value) events.push({ type: "status", orderId: order.id, status: value });
      };
      if (busy.has(order.source)) { status("queued"); continue; }
      busy.add(order.source);
      const blocked = citizenOrderBlock(state, order);
      if (blocked) { status(blocked); continue; }
      const target = this.people.find((person) => person.model.userData.citizenId === order.citizenId);
      if (!target) throw new Error("A security order targets a missing resident.");
      const prisoner = state.prisoners.find((entry) => entry.citizenId === order.citizenId);
      if (target.plan.home === null && !prisoner) { status("waiting-for-target"); continue; }
      let officer = this.officers.get(order.id);
      if (!officer) {
        const point = this.findSpawnPoint(state, order.source, 32);
        if (!point) { status("blocked"); continue; }
        const person = this.createPerson(order.id, target.plan, order.action === "eliminate" ? this.soldierUniform : this.policeUniform);
        person.model.userData.citizenOrderId = order.id;
        person.model.position.set(point.x, this.ground(point.x, point.z), point.z);
        person.model.visible = true;
        person.hat.visible = true;
        person.speed = 4;
        officer = { person, retry: 0 };
        this.officers.set(order.id, officer);
        this.scene.add(person.model);
      }
      const person = officer.person;
      person.limbs.forEach((limb) => { limb.rotation.x = 0; });
      const goal = prisoner ? this.findSpawnPoint(state, prisoner.buildingIndex, 32) : target.model.position;
      if (!goal) { status("blocked"); continue; }
      const distance = Math.hypot(goal.x - person.model.position.x, goal.z - person.model.position.z);
      if (distance <= 1.6 && this.clear(person.model.position, goal)) {
        if (target.model.visible || prisoner) events.push({ type: "arrived", orderId: order.id });
        else status("waiting-for-target");
        continue;
      }
      officer.retry -= delta;
      if (officer.retry <= 0) {
        officer.retry = 1;
        const tile = this.tileAt(person.model.position.x, person.model.position.z);
        const destination = this.tileAt(goal.x, goal.z);
        const starts: GridTile[] = [];
        const goals: GridTile[] = [];
        for (let x = -2; x <= 2; x++) {
          for (let z = -2; z <= 2; z++) {
            const start = { x: tile.x + x, z: tile.z + z };
            if (this.walkable(start) && this.clear(person.model.position, this.center(start))) starts.push(start);
          }
          for (let x = -1; x <= 1; x++) {
            for (let z = -1; z <= 1; z++) {
              const end = { x: destination.x + x, z: destination.z + z };
              if (this.walkable(end) && this.clear(this.center(end), goal)) goals.push(end);
            }
          }
        }
        starts.sort((a, b) => Math.hypot(a.x - tile.x, a.z - tile.z) - Math.hypot(b.x - tile.x, b.z - tile.z));
        person.path = this.clear(person.model.position, goal) ? []
          : findWalkPathFromStarts(starts, goals, (point) => this.walkable(point), (a, b) => this.clear(this.center(a), this.center(b)));
        if (person.path) person.path = this.shortenPath(person.model.position, person.path, (a, b) => this.clear(a, b));
      }
      if (person.path === null) { status("blocked"); continue; }
      const waypoint = person.path.length ? this.center(person.path[0]) : goal;
      const others = [...this.people.filter((entry) => entry !== target && entry.model.visible),
        ...Array.from(this.officers.values(), (entry) => entry.person).filter((entry) => entry !== person)]
        .map((entry) => entry.model.position);
      const travel = this.movePerson(person, waypoint, delta, others);
      person.blockedTime = travel < 0.001 ? person.blockedTime + delta : 0;
      if (person.path.length && Math.hypot(waypoint.x - person.model.position.x, waypoint.z - person.model.position.z) < 0.01) person.path.shift();
      status(person.blockedTime > 2 ? "blocked" : "en-route");
    }
    return events;
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

  /** Forget cached walkability after the ground under some tiles was graded. */
  invalidateTerrain() {
    this.terrain.clear();
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
    const point = this.findSpawnPoint(state, index, 512);
    if (!point) throw new Error("Unable to find open land for a resident.");
    return point;
  }

  private findSpawnPoint(state: GameSnapshot, index: number, maxRing: number) {
    const building = state.placed[index];
    const origin = this.tileAt(building.x, building.z);
    const occupied = new Set(this.people.filter((person) => person.model.visible)
      .map((person) => {
        const tile = this.tileAt(person.model.position.x, person.model.position.z);
        return `${tile.x},${tile.z}`;
      }));
    for (let ring = 1; ring <= maxRing; ring++) {
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
    return null;
  }

  private createPerson(index: number, plan: ResidentPlan, uniform?: THREE.Material): Resident {
    const model = new THREE.Group();
    const tag = new THREE.Mesh(this.tagGeometry, this.bribeTag);
    tag.position.y = 2.6;
    tag.visible = false;
    model.add(tag);
    model.visible = false;
    model.scale.setScalar(1.3);
    const clothing = uniform ?? this.clothes[index % this.clothes.length];
    const torso = new THREE.Mesh(this.torso, clothing);
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
    const brim = new THREE.Mesh(this.hatBrim, uniform ?? this.straw);
    const crown = new THREE.Mesh(this.hatCrown, uniform ?? this.straw);
    crown.position.y = 0.12;
    const band = new THREE.Mesh(this.hatBand, this.hatBandMaterial);
    band.position.y = 0.055;
    hat.add(brim, crown, band);
    model.add(hat);
    if (index % 3 === 1) {
      const skirt = new THREE.Mesh(this.skirt, clothing);
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
        const sleeve = new THREE.Mesh(this.sleeve, clothing);
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
      speed: 2.6 + Math.random() * 0.8, blockedTime: 0, avoiding: false, retreating: false, inside: null, detained: false, tag };
  }
}
