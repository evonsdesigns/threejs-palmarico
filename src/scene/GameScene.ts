import * as THREE from "three";
import { MapControls } from "three/examples/jsm/controls/MapControls.js";
import GameMap from "../map/GameMap";
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

const FARM_FIELD_REACH = 2;
const FARM_FIELD_TILES = 24;

class GameScene {
  private static _instance = new GameScene();
  public static get instance() { return this._instance; }

  private readonly scene = new THREE.Scene();
  private readonly renderer = new THREE.WebGLRenderer({ antialias: true });
  private readonly camera = createCamera();
  private readonly controls: MapControls;
  private readonly map = new GameMap(new THREE.Vector3(), 1024);
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
  private readonly placedModels: THREE.Group[] = [];
  private readonly residents = new Residents(this.scene, (x, z) => this.terrainHeight(x, z), this.trees, (index) => this.placedModels[index]);
  private pointerDown: { x: number; y: number } | null = null;
  private ready = false;
  private settlementReady = false;
  private syncingShacks = false;

  private constructor() {
    const target = document.querySelector<HTMLDivElement>("#app");
    if (!target) throw new Error("Unable to find game container");
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    target.appendChild(this.renderer.domElement);
    this.controls = createMapControls(this.camera, this.renderer);
    const sky = new SkySunController(this.scene);
    sky.setParameters(50, 180);
    this.scene.add(new THREE.HemisphereLight(0xfff2d5, 0x4c6650, 1.5));
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
    await this.map.load();
    this.scene.add(this.map.mesh);
    this.map.mesh.updateMatrixWorld();
    this.water = new WaterScene(this.scene, (x, z) => this.map.sampleHeight(x, z), 1024);
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
    if (simulationDelta > 0) this.residents.update(simulationDelta, game.getSnapshot());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  public zoom(factor: number) {
    this.camera.zoom = THREE.MathUtils.clamp(this.camera.zoom * factor, this.controls.minZoom, this.controls.maxZoom);
    this.camera.updateProjectionMatrix();
    this.controls.update();
  }

  public rotate(angle: number) {
    const offset = this.camera.position.clone().sub(this.controls.target);
    offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
    this.camera.position.copy(this.controls.target).add(offset);
    this.controls.update();
  }

  public getMapHeight(x: number, z: number) {
    return this.map.getHeightAt(x, z);
  }

  private resize = () => {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  private syncResidents = () => {
    const state = game.getSnapshot();
    if (this.ready && state.placed.every((_, index) => this.placedModels[index])) this.residents.sync(state);
  };

  private syncGhost = () => {
    const { selected, farmCrop } = game.getSnapshot();
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
    if (!game.getSnapshot().selected) return;
    event.preventDefault();
    game.rotatePlacement(1);
  };

  private onKeyDown = (event: KeyboardEvent) => {
    if ((event.key === "[" || event.key === "]") && game.getSnapshot().selected) game.rotatePlacement(event.key === "]" ? 1 : -1);
    else if (event.key === "Escape" && game.getSnapshot().selected) game.select(null);
    else if (event.key === "Escape" && game.getSnapshot().inspectedBuilding !== null) game.inspectBuilding(null);
  };

  private terrainHeight(x: number, z: number): number | null {
    return this.map.sampleHeight(x, z);
  }

  private addPlacedModel(index: number, building: PlacedBuilding, site: THREE.Vector3) {
    const model = createBuilding(building.type, false, building.crop);
    model.position.copy(site);
    model.rotation.y = (building.rotation ?? 0) * Math.PI / 2;
    model.userData.buildingIndex = index;
    model.userData.crop = building.crop;
    this.placedModels[index] = model;
    this.scene.add(model);
  }

  private syncPlacedModels = () => {
    game.getSnapshot().placed.forEach((building, index) => {
      const model = this.placedModels[index];
      if (!model || building.type !== "farm" || model.userData.crop === building.crop) return;
      this.scene.remove(model);
      this.addPlacedModel(index, building, model.position);
      this.disposeBuilding(model);
    });
  };

  private createStartingSettlement() {
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

  private findSite(definition: BuildingDefinition, placed: PlacedBuilding[]): THREE.Vector3 {
    for (let ring = 0; ring <= 48; ring++) {
      for (let x = -ring; x <= ring; x++) {
        for (let z = -ring; z <= ring; z++) {
          if (Math.max(Math.abs(x), Math.abs(z)) !== ring) continue;
          const center = footprintCenter(footprintAt(x * GRID_TILE_SIZE, z * GRID_TILE_SIZE, ...definition.tiles));
          const height = this.terrainHeight(center.x, center.z);
          if (height === null) continue;
          const candidate = new THREE.Vector3(center.x, height, center.z);
          if (!this.validate(candidate, definition, 0, placed, true)) return candidate;
        }
      }
    }
    throw new Error(`Unable to find dry, level land for ${definition.name}.`);
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

  private addTrees() {
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x806344 });
    const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x398055 });
    for (let x = -100; x <= 100; x += 22) {
      for (let z = -100; z <= 100; z += 22) {
        const seed = Math.abs(Math.sin(x * 12.9898 + z * 78.233) * 43758.5453) % 1;
        if (seed < 0.53 || Math.hypot(x, z) < 30) continue;
        const px = x + (seed - 0.5) * 8;
        const pz = z + (0.5 - seed) * 8;
        if (game.getSnapshot().placed.some((placed) => {
          return footprintIntersectsCircle(buildingFootprint(placed), px, pz, 2);
        })) continue;
        const height = this.terrainHeight(px, pz);
        if (height === null || height < 2) continue;
        const tree = new THREE.Group();
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.6, 6, 6), trunkMaterial);
        trunk.position.y = 3;
        tree.add(trunk);
        for (let i = 0; i < 5; i++) {
          const leaf = new THREE.Mesh(new THREE.ConeGeometry(1.1, 5, 4), leafMaterial);
          const angle = i * Math.PI * 2 / 5;
          leaf.position.set(Math.sin(angle) * 1.6, 6.2, Math.cos(angle) * 1.6);
          leaf.rotation.set(Math.cos(angle) * 1.05, 0, -Math.sin(angle) * 1.05);
          tree.add(leaf);
        }
        tree.position.set(px, height, pz);
        this.scene.add(tree);
        this.trees.push(new THREE.Vector2(px, pz));
      }
    }
  }

  private validate(point: THREE.Vector3, definition: BuildingDefinition, rotation: Rotation, placedBuildings = game.getSnapshot().placed, avoidFields = false): string | null {
    const footprint = footprintAt(point.x, point.z, ...rotatedTiles(definition.tiles, rotation));
    for (let x = 0; x <= footprint.sizeX; x++) {
      for (let z = 0; z <= footprint.sizeZ; z++) {
        const height = this.terrainHeight((footprint.minX + x) * GRID_TILE_SIZE, (footprint.minZ + z) * GRID_TILE_SIZE);
        if (height === null || height < 1 || point.y < 1) return "Buildings must be placed on dry land.";
        if (Math.abs(height - point.y) > 2) return "Choose flatter ground for this building.";
      }
    }
    if (this.trees.some((tree) => footprintIntersectsCircle(footprint, tree.x, tree.y, 2))) return "A tree is in the way.";
    if (this.residents.blocksFootprint(footprint)) return "A resident is in the way.";
    if (placedBuildings.some((placed) => footprintsOverlap(footprint, buildingFootprint(placed)))) return "There is another building in the way.";
    if (avoidFields) {
      for (let x = footprint.minX; x < footprint.minX + footprint.sizeX; x++) {
        for (let z = footprint.minZ; z < footprint.minZ + footprint.sizeZ; z++) {
          if (this.fieldTiles.has(`${x},${z}`)) return "Farm crops are planted here.";
        }
      }
    }
    if (definition.cost > 0 && game.getSnapshot().money < definition.cost) return "Not enough treasury funds.";
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
    const hit = this.raycaster.intersectObject(this.map.mesh)[0];
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
    const height = this.terrainHeight(center.x, center.z);
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
    const type = game.getSnapshot().selected;
    if (!type) {
      const mouse = new THREE.Vector2(event.clientX / window.innerWidth * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
      this.raycaster.setFromCamera(mouse, this.camera);
      const hit = this.raycaster.intersectObjects(this.placedModels, true)[0];
      const ground = this.raycaster.intersectObject(this.map.mesh)[0];
      let object: THREE.Object3D | null = hit && (!ground || hit.distance < ground.distance) ? hit.object : null;
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
