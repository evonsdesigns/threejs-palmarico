import * as THREE from "three";
import { MapControls } from "three/examples/jsm/controls/MapControls.js";
import { TerrainMesh } from "../map/TerrainMesh";
import { Terrain } from "../logic/terrain";
import ResourceManager from "../utils/ResourceManager";
import { buildingFootprint, buildings, BuildingDefinition, BuildingType, game, PlacedBuilding, starterBuildings } from "../logic/game";
import { footprintAt, footprintCenter, footprintIntersectsCircle, footprintsOverlap, GRID_TILE_SIZE, GridFootprint, Rotation, rotatedTiles } from "../logic/grid";
import { createKit } from "./models/kit";
import { buildCropField, CropTile } from "./models/crop-field";
import { WaterScene } from "./water";
import { createCamera } from "./camera";
import { SkySunController } from "./SkySunController";
import { createMapControls } from "./controls";
import { createBuilding } from "./buildings";
import { Residents } from "./residents";
import { InteriorOccupants } from "./interior-occupants";
import { createTreeGrove, treeKindForTerrain, type TreePosition } from "./palms";
import { daylightAt } from "./daylight";
import { BuildingLights } from "./building-lights";

const FARM_FIELD_REACH = 2;
const FARM_FIELD_TILES = 24;

class GameScene {
  private static _instance = new GameScene();
  public static get instance() { return this._instance; }

  private readonly scene = new THREE.Scene();
  private readonly buildingLights = new BuildingLights(this.scene);
  private readonly interiors = new InteriorOccupants(this.scene);
  private readonly renderer = new THREE.WebGLRenderer({ antialias: true });
  private readonly camera = createCamera();
  private readonly controls: MapControls;
  private readonly sky: SkySunController;
  private readonly ambientLight = new THREE.HemisphereLight(0xfff2d5, 0x4c6650, 1.5);
  private readonly dayAmbient = new THREE.Color(0xfff2d5);
  private readonly nightAmbient = new THREE.Color(0x9caec9);
  private readonly dayGround = new THREE.Color(0x4c6650);
  private readonly nightGround = new THREE.Color(0x536273);
  private readonly terrain = Terrain.generate();
  private terrainMesh!: TerrainMesh;
  private water!: WaterScene;
  private readonly raycaster = new THREE.Raycaster();
  private readonly clock = new THREE.Clock();
  private ghost: THREE.Group | null = null;
  private readonly footprintOutline = new THREE.LineSegments(
    new THREE.BufferGeometry(),
    new THREE.LineBasicMaterial({ color: 0x8be4b0, depthWrite: false, transparent: true, opacity: 0.8 }),
  );
  private ghostType: BuildingType | null = null;
  private ghostCrop: string | null = null;
  private ghostRotation: Rotation = 0;
  private lastPointer: { clientX: number; clientY: number } | null = null;
  private readonly cropFields: THREE.Group[] = [];
  private fieldTiles = new Set<string>();
  private lastFieldPlaced: PlacedBuilding[] | null = null;
  private placement: THREE.Vector3 | null = null;
  private readonly trees: THREE.Vector2[] = [];
  private readonly treeSlots = new WeakMap<THREE.Vector2, { instance: number; tileX: number; tileZ: number }>();
  private treeGrove: ReturnType<typeof createTreeGrove> | null = null;
  private readonly placedModels: THREE.Group[] = [];
  private readonly residents = new Residents(this.scene, (x, z) => this.terrainHeight(x, z), this.trees, (index) => this.placedModels[index]);
  private pointerDown: { x: number; y: number } | null = null;
  private ready = false;
  private settlementReady = false;
  private syncingShacks = false;
  private dayElapsed = 0;
  private shadowElapsed = 0;

  private constructor() {
    const target = document.querySelector<HTMLDivElement>("#app");
    if (!target) throw new Error("Unable to find game container");
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.shadowMap.autoUpdate = false;
    target.appendChild(this.renderer.domElement);
    this.controls = createMapControls(this.camera, this.renderer);
    this.sky = new SkySunController(this.scene);
    this.scene.add(this.ambientLight);
    this.updateDaylight(0);
    this.footprintOutline.visible = false;
    this.footprintOutline.renderOrder = 1;
    this.scene.add(this.footprintOutline);

    window.addEventListener("resize", this.resize);
    window.addEventListener("keydown", this.onKeyDown);
    this.renderer.domElement.addEventListener("pointermove", this.onPointerMove);
    this.renderer.domElement.addEventListener("pointerdown", this.onPointerDown);
    this.renderer.domElement.addEventListener("pointerup", this.onPointerUp);
    this.renderer.domElement.addEventListener("pointerleave", this.onPointerLeave);
    this.renderer.domElement.addEventListener("contextmenu", this.onContextMenu);
    game.subscribe(this.syncGhost);
    game.subscribe(this.syncShacks);
    game.subscribe(this.syncPlacedModels);
    game.subscribe(this.syncResidents);
    game.subscribe(this.syncCropFields);
    game.subscribe(this.syncRotation);
  }

  public load = async () => {
    await ResourceManager.instance.load();
    this.terrainMesh = new TerrainMesh(this.terrain, ResourceManager.instance.getGroundTextures()[0]);
    this.scene.add(this.terrainMesh.mesh);
    this.terrain.onChange(() => this.residents.invalidateTerrain());
    this.water = new WaterScene(this.scene, (x, z) => this.terrain.heightAt(x, z), this.terrain.worldSize);
    this.createStartingSettlement();
    this.settlementReady = true;
    this.syncShacks();
    this.addTrees();
    this.ready = true;
    this.syncCropFields();
    this.syncGhost();
    this.syncResidents();
    this.renderer.domElement.dataset.ready = "true";
  };

  public render = () => {
    requestAnimationFrame(this.render);
    const delta = Math.min(this.clock.getDelta(), 0.1);
    this.water.update(delta);
    const simulationDelta = game.advanceTime(delta);
    if (simulationDelta > 0) {
      for (const event of this.residents.update(simulationDelta, game.getSnapshot())) {
        const error = event.type === "arrived" ? game.completeCitizenOrder(event.orderId)
          : game.setCitizenOrderStatus(event.orderId, event.status);
        if (error) game.notify(error);
      }
    }
    this.controls.update();
    this.updateDaylight(simulationDelta);
    this.shadowElapsed += delta;
    if (this.shadowElapsed >= 0.1) {
      this.renderer.shadowMap.needsUpdate = true;
      this.shadowElapsed = 0;
    }
    this.renderer.render(this.scene, this.camera);
  };

  private updateDaylight(delta: number) {
    this.dayElapsed += delta;
    const { elevation, azimuth, daylight } = daylightAt(this.dayElapsed);
    this.sky.setParameters(elevation, azimuth);
    this.sky.setTarget(this.controls.target);
    this.sky.setShadowExtent(Math.max(120, Math.hypot(this.camera.right, this.camera.top * 1.8) / this.camera.zoom));
    this.sky.sunlight.intensity = 1.2 * daylight;
    this.ambientLight.intensity = 0.8 + 0.7 * daylight;
    this.ambientLight.color.copy(this.nightAmbient).lerp(this.dayAmbient, daylight);
    this.ambientLight.groundColor.copy(this.nightGround).lerp(this.dayGround, daylight);
    this.buildingLights.update(daylight, this.controls.target);
    this.interiors.update(delta, this.residents.insideCounts(), game.getSnapshot().placed, (index) => this.placedModels[index], daylight);
    if (this.water) this.water.setDaylight(daylight);
  }

  public zoom(factor: number) {
    this.camera.zoom = THREE.MathUtils.clamp(this.camera.zoom * factor, this.controls.minZoom, this.controls.maxZoom);
    this.camera.updateProjectionMatrix();
    this.controls.update();
    this.controls.dispatchEvent({ type: "change" });
  }

  public rotate(angle: number) {
    const offset = this.camera.position.clone().sub(this.controls.target);
    offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
    this.camera.position.copy(this.controls.target).add(offset);
    this.controls.update();
  }

  public moveCameraTo(x: number, z: number) {
    const half = this.terrain.worldSize / 2;
    const targetX = THREE.MathUtils.clamp(x, -half, half);
    const targetZ = THREE.MathUtils.clamp(z, -half, half);
    const target = new THREE.Vector3(targetX, Math.max(0, this.terrain.heightAt(targetX, targetZ) ?? 0), targetZ);
    this.camera.position.add(target.clone().sub(this.controls.target));
    this.controls.target.copy(target);
    this.controls.update();
  }

  public locateCitizen(citizenId: number) {
    const position = this.residents.positionOf(citizenId);
    if (!position) {
      game.notify("This citizen has no known location on the map.");
      return;
    }
    this.moveCameraTo(position.x, position.z);
  }

  public get cameraView() {
    return this.camera;
  }

  public get cameraTarget() {
    return this.controls.target.clone();
  }

  public onCameraChange(listener: () => void) {
    this.controls.addEventListener("change", listener);
    window.addEventListener("resize", listener);
    return () => {
      this.controls.removeEventListener("change", listener);
      window.removeEventListener("resize", listener);
    };
  }

  public get island() {
    return this.terrain;
  }

  private resize = () => {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  private syncResidents = () => {
    const state = game.getSnapshot();
    if (this.ready && state.placed.every((_, index) => this.placedModels[index])) this.residents.sync(state);
  };

  private syncGhost = () => {
    const { selected, farmCrop, targetingEdict } = game.getSnapshot();
    this.renderer.domElement.style.cursor = targetingEdict ? "crosshair" : "";
    const crop = selected === "farm" ? farmCrop : null;
    if (!this.ready || (selected === this.ghostType && crop === this.ghostCrop)) return;
    if (this.ghost) {
      this.scene.remove(this.ghost);
      this.disposeBuilding(this.ghost);
      this.ghost = null;
    }
    this.ghostType = selected;
    this.ghostCrop = crop;
    this.placement = null;
    this.footprintOutline.visible = false;
    if (selected) {
      this.ghost = createBuilding(selected, true, farmCrop);
      this.ghost.visible = false;
      this.scene.add(this.ghost);
    }
  };

  private disposeBuilding(group: THREE.Group) {
    group.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((material) => material.dispose());
      }
    });
  }

  private syncRotation = () => {
    const { placementRotation } = game.getSnapshot();
    if (placementRotation === this.ghostRotation) return;
    this.ghostRotation = placementRotation;
    if (this.lastPointer) this.updatePlacement(this.lastPointer);
  };

  private onContextMenu = (event: MouseEvent) => {
    if (game.getSnapshot().targetingEdict) {
      event.preventDefault();
      game.selectEdictTarget(null);
      return;
    }
    if (!game.getSnapshot().selected) return;
    event.preventDefault();
    game.rotatePlacement(1);
  };

  private onKeyDown = (event: KeyboardEvent) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) return;
    if (event.key === "g" || event.key === "G") this.terrainMesh?.setGridMode(this.terrainMesh.grid === 1 ? 0 : 1);
    else if (event.key === "c" || event.key === "C") this.terrainMesh?.setGridMode(this.terrainMesh.grid === 2 ? 0 : 2);
    else if ((event.key === "[" || event.key === "]") && game.getSnapshot().selected) game.rotatePlacement(event.key === "]" ? 1 : -1);
    else if (event.key === "Escape" && game.getSnapshot().targetingEdict) game.selectEdictTarget(null);
    else if (event.key === "Escape" && game.getSnapshot().selected) game.select(null);
    else if (event.key === "Escape" && game.getSnapshot().inspectedCitizen !== null) game.inspectCitizen(null);
    else if (event.key === "Escape" && game.getSnapshot().inspectedBuilding !== null) game.inspectBuilding(null);
  };

  private terrainHeight(x: number, z: number): number | null {
    return this.terrain.heightAt(x, z);
  }

  /** Grades the ground under a new building and locks it so later grading leaves it level. */
  private gradeSite(building: PlacedBuilding, height: number) {
    const definition = buildings.find((item) => item.id === building.type)!;
    this.terrain.grade(buildingFootprint(building), height, !!definition.coastal);
  }

  private groundHit(ray: THREE.Ray) {
    const distance = this.terrain.raycast(ray.origin, ray.direction);
    return distance === null ? null : { distance, point: ray.at(distance, new THREE.Vector3()) };
  }

  private addPlacedModel(index: number, building: PlacedBuilding, site: THREE.Vector3) {
    if (!this.placedModels[index]) this.gradeSite(building, site.y);
    const model = createBuilding(building.type, false, building.crop);
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    model.position.copy(site);
    model.rotation.y = (building.rotation ?? 0) * Math.PI / 2;
    model.userData.buildingIndex = index;
    model.userData.crop = building.crop;
    this.placedModels[index] = model;
    this.scene.add(model);
    const definition = buildings.find((item) => item.id === building.type)!;
    this.buildingLights.add(model, definition.tiles[1] * GRID_TILE_SIZE / 2 - 0.6);
  }

  private syncPlacedModels = () => {
    game.getSnapshot().placed.forEach((building, index) => {
      const model = this.placedModels[index];
      if (!model || building.type !== "farm" || model.userData.crop === building.crop) return;
      this.scene.remove(model);
      this.buildingLights.remove(model);
      this.addPlacedModel(index, building, model.position);
      this.disposeBuilding(model);
    });
  };

  private createStartingSettlement() {
    if (import.meta.env.DEV && !new URLSearchParams(window.location.search).has("normal-start")) {
      this.createShowcase();
      return;
    }
    const placed: PlacedBuilding[] = [];
    for (const type of starterBuildings) {
      const definition = buildings.find((item) => item.id === type)!;
      const site = this.findSite(definition, placed);
      const building: PlacedBuilding = type === "farm"
        ? { type, x: site.x, z: site.z, crop: "corn" }
        : { type, x: site.x, z: site.z };
      placed.push(building);
      this.addPlacedModel(placed.length - 1, building, site);
    }
    game.initializeIsland(placed);
  }

  // Lays out one of every building in packed rows; coastal buildings go on the eastern shore, facing the sea.
  private createShowcase() {
    const rows: BuildingType[][] = [
      ["palace", "colonial-fort", "farm", "ranch", "market", "clinic", "logging-camp", "mine"],
      ["shack", "country-house", "house", "bungalow", "bunkhouse", "luxury-house", "condominium", "apartment", "tenement"],
      ["pub", "restaurant", "gourmet-restaurant", "cabaret", "movie-theater", "nightclub", "casino", "conservatory"],
      ["el-prez-home", "sports-complex", "archaeological-site", "small-fountain", "large-fountain", "statue", "church", "cathedral"],
      ["high-school", "college", "hospital", "teamsters-office", "construction-office", "bank", "electric-substation", "electric-power-plant"],
      ["guard-station", "immigration-office", "newspaper", "radio-station", "police-station", "diplomatic-ministry", "tv-station"],
      ["armory", "prison", "army-base", "jewelry-factory", "furniture-factory", "cigar-factory"],
      ["rum-distillery", "lumber-mill", "cannery", "duty-free-shop", "souvenir-shop", "scenic-outlook", "beach-villa"],
      ["pool", "spa", "tennis-court", "cheap-motel", "miniature-golf", "nature-preserve", "hotel", "luxury-hotel"],
      ["airport"],
    ];
    const coastal = buildings.filter((item) => item.coastal).map((item) => item.id);
    const missing = buildings.filter((item) => !item.coastal && !rows.flat().includes(item.id));
    if (missing.length) rows.push(missing.map((item) => item.id));
    const gap = 3;
    const tilesOf = (type: BuildingType) => buildings.find((item) => item.id === type)!.tiles;
    const depths = rows.map((row) => Math.max(...row.map((type) => tilesOf(type)[1])));
    const totalDepth = depths.reduce((sum, depth) => sum + depth + gap, -gap);
    const placed: PlacedBuilding[] = [];
    const add = (type: BuildingType, site: THREE.Vector3, rotation: Rotation) => {
      const building: PlacedBuilding = { type, x: site.x, z: site.z, rotation };
      if (type === "farm") building.crop = "corn";
      placed.push(building);
      this.addPlacedModel(placed.length - 1, building, site);
    };
    let rowZ = -totalDepth / 2;
    rows.forEach((row, rowIndex) => {
      const width = row.reduce((sum, type) => sum + tilesOf(type)[0] + gap, -gap);
      let columnX = -width / 2;
      const centerZ = rowZ + depths[rowIndex] / 2;
      for (const type of row) {
        const definition = buildings.find((item) => item.id === type)!;
        add(type, this.findSite(definition, placed, Math.round(columnX + definition.tiles[0] / 2), Math.round(centerZ), 6), 0);
        columnX += definition.tiles[0] + gap;
      }
      rowZ += depths[rowIndex] + gap;
    });
    // Walk east from the centre to the waterline, then line the coastal buildings up along that shore.
    let shoreX = 0;
    while ((this.terrainHeight(shoreX, 0) ?? -1) >= 0) shoreX += GRID_TILE_SIZE;
    let shoreZ = -((coastal.length - 1) * 8) / 2;
    for (const type of coastal) {
      const definition = buildings.find((item) => item.id === type)!;
      add(type, this.findSite(definition, placed, Math.round(shoreX / GRID_TILE_SIZE), Math.round(shoreZ), 16, 1), 1);
      shoreZ += 8;
    }
    game.initializeShowcase(placed);
  }

  private findSite(definition: BuildingDefinition, placed: PlacedBuilding[], originX = 0, originZ = 0, maxRing = 48, rotation: Rotation = 0): THREE.Vector3 {
    for (let ring = 0; ring <= maxRing; ring++) {
      for (let x = -ring; x <= ring; x++) {
        for (let z = -ring; z <= ring; z++) {
          if (Math.max(Math.abs(x), Math.abs(z)) !== ring) continue;
          const footprint = footprintAt((originX + x) * GRID_TILE_SIZE, (originZ + z) * GRID_TILE_SIZE, ...rotatedTiles(definition.tiles, rotation));
          const center = footprintCenter(footprint);
          if (this.terrainHeight(center.x, center.z) === null) continue;
          const height = this.terrain.evaluate(footprint, rotation, !!definition.coastal).height;
          const candidate = new THREE.Vector3(center.x, height, center.z);
          if (!this.validate(candidate, definition, rotation, placed, true, true)) return candidate;
        }
      }
    }
    throw new Error(`Unable to find buildable land for ${definition.name}.`);
  }

  private syncShacks = () => {
    if (this.syncingShacks || !this.settlementReady) return;
    if (game.getSnapshot().housing >= game.getSnapshot().population) return;
    this.syncingShacks = true;
    try {
      const definition = buildings.find((item) => item.id === "shack")!;
      while (game.getSnapshot().housing < game.getSnapshot().population) {
        const site = this.findSite(definition, game.getSnapshot().placed);
        this.addPlacedModel(game.getSnapshot().placed.length, { type: "shack", x: site.x, z: site.z }, site);
        game.addShack(site.x, site.z);
      }
    } finally {
      this.syncingShacks = false;
    }
  };

  // Trees grow by terrain type: dense in jungle, scattered on grass and along the beach.
  private addTrees() {
    const trees: TreePosition[] = [];
    const density = { jungle: 0.34, grass: 0.03, sand: 0.05 } as Partial<Record<string, number>>;
    const footprints = game.getSnapshot().placed.map(buildingFootprint);
    for (let tz = -this.terrain.half; tz < this.terrain.half; tz++) {
      for (let tx = -this.terrain.half; tx < this.terrain.half; tx++) {
        const terrain = this.terrain.tileType(tx, tz);
        const chance = density[terrain!] ?? 0;
        const seed = Math.abs(Math.sin(tx * 12.9898 + tz * 78.233) * 43758.5453) % 1;
        if (seed >= chance) continue;
        const jitter = seed / chance;
        const px = (tx + 0.2 + jitter * 0.6) * GRID_TILE_SIZE;
        const pz = (tz + 0.8 - jitter * 0.6) * GRID_TILE_SIZE;
        if (Math.hypot(px, pz) < 30) continue;
        if (footprints.some((footprint) => footprintIntersectsCircle(footprint, px, pz, 3))) continue;
        const height = this.terrainHeight(px, pz);
        if (height === null || height < 1.2) continue;
        this.terrain.lockTile(tx, tz);
        const tree = new THREE.Vector2(px, pz);
        this.treeSlots.set(tree, { instance: trees.length, tileX: tx, tileZ: tz });
        const variety = Math.abs(Math.sin(tx * 47.317 + tz * 13.771 + 4.3) * 31718.927) % 1;
        trees.push({ x: px, y: height, z: pz, seed: jitter, kind: treeKindForTerrain(terrain!, variety) });
        this.trees.push(tree);
      }
    }
    this.treeGrove = createTreeGrove(trees);
    this.scene.add(this.treeGrove.group);
  }

  // Construction crews clear trees standing on the new building's footprint.
  private clearTrees(footprint: GridFootprint) {
    for (let index = this.trees.length - 1; index >= 0; index--) {
      const tree = this.trees[index];
      if (!footprintIntersectsCircle(footprint, tree.x, tree.y, 2)) continue;
      const slot = this.treeSlots.get(tree)!;
      if (this.treeGrove) this.treeGrove.remove(slot.instance);
      this.terrain.unlockTile(slot.tileX, slot.tileZ);
      this.trees.splice(index, 1);
    }
  }

  private validate(point: THREE.Vector3, definition: BuildingDefinition, rotation: Rotation, placedBuildings = game.getSnapshot().placed, avoidFields = false, free = false): string | null {
    const footprint = footprintAt(point.x, point.z, ...rotatedTiles(definition.tiles, rotation));
    const site = this.terrain.evaluate(footprint, rotation, !!definition.coastal);
    if (site.error) return site.error;
    // Automatic placement keeps to open ground; the player's construction crews clear trees instead.
    if (free && this.trees.some((tree) => footprintIntersectsCircle(footprint, tree.x, tree.y, 2))) return "A tree is in the way.";
    if (this.residents.blocksFootprint(footprint)) return "A resident is in the way.";
    if (placedBuildings.some((placed) => footprintsOverlap(footprint, buildingFootprint(placed)))) return "There is another building in the way.";
    if (avoidFields) {
      for (let x = footprint.minX; x < footprint.minX + footprint.sizeX; x++) {
        for (let z = footprint.minZ; z < footprint.minZ + footprint.sizeZ; z++) {
          if (this.fieldTiles.has(`${x},${z}`)) return "Farm crops are planted here.";
        }
      }
    }
    if (!free && definition.cost > 0 && game.getSnapshot().money < definition.cost) return "Not enough treasury funds.";
    return null;
  }

  // Farms plant their crops on nearby open tiles, giving way to any building later placed over them.
  private syncCropFields = () => {
    const { placed } = game.getSnapshot();
    if (!this.ready || placed === this.lastFieldPlaced) return;
    this.lastFieldPlaced = placed;
    for (const field of this.cropFields.splice(0)) {
      this.scene.remove(field);
      this.disposeBuilding(field);
    }
    const occupied = new Set<string>();
    for (const building of placed) {
      const footprint = buildingFootprint(building);
      for (let x = footprint.minX; x < footprint.minX + footprint.sizeX; x++) {
        for (let z = footprint.minZ; z < footprint.minZ + footprint.sizeZ; z++) occupied.add(`${x},${z}`);
      }
    }
    const claimed = new Set<string>();
    placed.forEach((building) => {
      if (building.type !== "farm") return;
      const footprint = buildingFootprint(building);
      const candidates: { tile: CropTile; key: string; distance: number }[] = [];
      for (let x = footprint.minX - FARM_FIELD_REACH; x < footprint.minX + footprint.sizeX + FARM_FIELD_REACH; x++) {
        for (let z = footprint.minZ - FARM_FIELD_REACH; z < footprint.minZ + footprint.sizeZ + FARM_FIELD_REACH; z++) {
          const key = `${x},${z}`;
          if (occupied.has(key) || claimed.has(key) || !this.plantable(x, z)) continue;
          const tile = { x: (x + 0.5) * GRID_TILE_SIZE, z: (z + 0.5) * GRID_TILE_SIZE };
          candidates.push({ tile, key, distance: Math.hypot(tile.x - building.x, tile.z - building.z) });
        }
      }
      candidates.sort((a, b) => a.distance - b.distance || a.tile.x - b.tile.x || a.tile.z - b.tile.z);
      const tiles = candidates.slice(0, FARM_FIELD_TILES);
      tiles.forEach(({ key }) => claimed.add(key));
      if (!tiles.length) return;
      const kit = createKit(false);
      buildCropField(kit, building.crop ?? "corn", tiles.map(({ tile }) => tile), (x, z) => {
        const height = this.terrainHeight(x, z);
        if (height === null) throw new Error("A crop tile extends beyond the island terrain.");
        return height;
      });
      const field = kit.finish();
      this.cropFields.push(field);
      this.scene.add(field);
    });
    this.fieldTiles = claimed;
  };

  private plantable(tileX: number, tileZ: number) {
    const heights = [[0, 0], [1, 0], [0, 1], [1, 1]]
      .map(([dx, dz]) => this.terrainHeight((tileX + dx) * GRID_TILE_SIZE, (tileZ + dz) * GRID_TILE_SIZE));
    if (heights.some((height) => height === null || height < 1)) return false;
    const values = heights as number[];
    if (Math.max(...values) - Math.min(...values) > 1.5) return false;
    return !this.trees.some((tree) => footprintIntersectsCircle({ minX: tileX, minZ: tileZ, sizeX: 1, sizeZ: 1 }, tree.x, tree.y, 1.5));
  }

  private showFootprint(footprint: GridFootprint, invalid: boolean) {
    const points: number[] = [];
    const position = (x: number, z: number) => {
      const worldX = (footprint.minX + x) * GRID_TILE_SIZE;
      const worldZ = (footprint.minZ + z) * GRID_TILE_SIZE;
      return [worldX, (this.terrainHeight(worldX, worldZ) ?? 0) + 0.12, worldZ];
    };
    for (let x = 0; x <= footprint.sizeX; x++) {
      for (let z = 0; z < footprint.sizeZ; z++) points.push(...position(x, z), ...position(x, z + 1));
    }
    for (let z = 0; z <= footprint.sizeZ; z++) {
      for (let x = 0; x < footprint.sizeX; x++) points.push(...position(x, z), ...position(x + 1, z));
    }
    const geometry = this.footprintOutline.geometry;
    const previous = geometry.getAttribute("position");
    if (previous && previous.count === points.length / 3) {
      previous.array.set(points);
      previous.needsUpdate = true;
    } else {
      geometry.dispose();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    }
    this.footprintOutline.geometry.computeBoundingSphere();
    this.footprintOutline.material.color.set(invalid ? 0xe45a45 : 0x8be4b0);
    this.footprintOutline.visible = true;
  }

  private onPointerMove = (event: PointerEvent) => {
    this.lastPointer = { clientX: event.clientX, clientY: event.clientY };
    this.updatePlacement(this.lastPointer);
  };

  private updatePlacement(pointer: { clientX: number; clientY: number }) {
    if (!this.ready || !this.ghost || !this.ghostType) return;
    const mouse = new THREE.Vector2(pointer.clientX / window.innerWidth * 2 - 1, -(pointer.clientY / window.innerHeight) * 2 + 1);
    this.raycaster.setFromCamera(mouse, this.camera);
    const hit = this.groundHit(this.raycaster.ray);
    if (!hit) {
      this.ghost.visible = false;
      this.placement = null;
      this.footprintOutline.visible = false;
      return;
    }
    const definition = buildings.find((item) => item.id === this.ghostType)!;
    const rotation = game.getSnapshot().placementRotation;
    const footprint = footprintAt(hit.point.x, hit.point.z, ...rotatedTiles(definition.tiles, rotation));
    const center = footprintCenter(footprint);
    const height = this.terrainHeight(center.x, center.z) === null ? null
      : this.terrain.evaluate(footprint, rotation, !!definition.coastal).height;
    if (height === null) {
      this.ghost.visible = false;
      this.placement = null;
      this.footprintOutline.visible = false;
      return;
    }
    this.placement = new THREE.Vector3(center.x, height, center.z);
    this.ghost.visible = true;
    this.ghost.position.copy(this.placement);
    this.ghost.rotation.y = rotation * Math.PI / 2;
    const invalid = this.validate(this.placement, definition, rotation);
    this.showFootprint(footprint, invalid !== null);
    this.ghost.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        child.material.color.set(invalid ? 0xe45a45 : 0x8be4b0);
      }
    });
  }

  private onPointerDown = (event: PointerEvent) => {
    if (event.button === 0) this.pointerDown = { x: event.clientX, y: event.clientY };
  };

  private onPointerUp = (event: PointerEvent) => {
    const down = this.pointerDown;
    this.pointerDown = null;
    if (!down || event.button !== 0 || Math.hypot(event.clientX - down.x, event.clientY - down.y) > 5) return;
    const { selected: type, targetingEdict } = game.getSnapshot();
    if (targetingEdict || !type) {
      const mouse = new THREE.Vector2(event.clientX / window.innerWidth * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
      this.raycaster.setFromCamera(mouse, this.camera);
      const person = this.residents.pick(this.raycaster);
      const building = this.raycaster.intersectObjects(this.placedModels, true)[0];
      const ground = this.groundHit(this.raycaster.ray);
      const visiblePerson = person && (!building || building.distance > person.distance) && (!ground || ground.distance > person.distance);
      if (targetingEdict) {
        if (!visiblePerson) game.notify("Click a visible citizen, not the ground or a building. Esc cancels without payment.");
        else {
          const error = game.issueEdict(targetingEdict, person.citizenId);
          if (error) game.notify(error);
        }
        return;
      }
      if (visiblePerson) {
        game.inspectCitizen(person.citizenId);
        return;
      }
      let object: THREE.Object3D | null = building && (!ground || building.distance < ground.distance) ? building.object : null;
      while (object && object.userData.buildingIndex === undefined) object = object.parent;
      game.inspectBuilding(object ? object.userData.buildingIndex : null);
      return;
    }
    if (!this.placement) return;
    const definition = buildings.find((item) => item.id === type)!;
    const invalid = this.validate(this.placement, definition, game.getSnapshot().placementRotation);
    if (invalid) {
      game.notify(invalid);
      return;
    }
    const index = game.getSnapshot().placed.length;
    if (game.place(type, this.placement.x, this.placement.z)) {
      this.clearTrees(footprintAt(this.placement.x, this.placement.z, ...rotatedTiles(definition.tiles, game.getSnapshot().placementRotation)));
      this.addPlacedModel(index, game.getSnapshot().placed[index], this.placement);
      this.syncResidents();
      this.onPointerMove(event);
    }
  };

  private onPointerLeave = () => {
    this.pointerDown = null;
    this.placement = null;
    if (this.ghost) this.ghost.visible = false;
    this.footprintOutline.visible = false;
  };
}

export default GameScene;
