import * as THREE from "three";
import { MapControls } from "three/examples/jsm/controls/MapControls.js";
import GameMap from "../map/GameMap";
import ResourceManager from "../utils/ResourceManager";
import { buildings, BuildingDefinition, BuildingType, game, PlacedBuilding, starterBuildings } from "../logic/game";
import { WaterScene } from "./water";
import { createCamera } from "./camera";
import { SkySunController } from "./SkySunController";
import { createMapControls } from "./controls";
import { createBuilding } from "./buildings";

class GameScene {
  private static _instance = new GameScene();
  public static get instance() { return this._instance; }

  private readonly scene = new THREE.Scene();
  private readonly renderer = new THREE.WebGLRenderer({ antialias: true });
  private readonly camera = createCamera();
  private readonly controls: MapControls;
  private readonly map = new GameMap(new THREE.Vector3(), 1024);
  private readonly water: WaterScene;
  private readonly raycaster = new THREE.Raycaster();
  private readonly clock = new THREE.Clock();
  private ghost: THREE.Group | null = null;
  private ghostType: BuildingType | null = null;
  private placement: THREE.Vector3 | null = null;
  private readonly trees: THREE.Vector2[] = [];
  private pointerDown: { x: number; y: number } | null = null;
  private elapsed = 0;
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
    this.water = new WaterScene(this.scene, sky);
    this.scene.add(new THREE.HemisphereLight(0xfff2d5, 0x4c6650, 1.5));

    window.addEventListener("resize", this.resize);
    window.addEventListener("keydown", this.onKeyDown);
    this.renderer.domElement.addEventListener("pointermove", this.onPointerMove);
    this.renderer.domElement.addEventListener("pointerdown", this.onPointerDown);
    this.renderer.domElement.addEventListener("pointerup", this.onPointerUp);
    this.renderer.domElement.addEventListener("pointerleave", this.onPointerLeave);
    game.subscribe(this.syncGhost);
    game.subscribe(this.syncShacks);
  }

  public load = async () => {
    await ResourceManager.instance.load();
    await this.map.load();
    this.scene.add(this.map.mesh);
    this.map.mesh.updateMatrixWorld();
    this.createStartingSettlement();
    this.settlementReady = true;
    this.syncShacks();
    this.addTrees();
    this.ready = true;
    this.syncGhost();
    this.renderer.domElement.dataset.ready = "true";
  };

  public render = () => {
    requestAnimationFrame(this.render);
    const delta = Math.min(this.clock.getDelta(), 0.1);
    this.water.update(delta);
    if (!game.getSnapshot().paused) {
      this.elapsed += delta;
      if (this.elapsed >= 5) {
        this.elapsed -= 5;
        game.advanceMonth();
      }
    }
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

  private syncGhost = () => {
    const selected = game.getSnapshot().selected;
    if (!this.ready || selected === this.ghostType) return;
    if (this.ghost) {
      this.scene.remove(this.ghost);
      this.disposeBuilding(this.ghost);
      this.ghost = null;
    }
    this.ghostType = selected;
    this.placement = null;
    if (selected) {
      this.ghost = createBuilding(selected, true);
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

  private onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && game.getSnapshot().selected) game.select(null);
  };

  private terrainHeight(x: number, z: number): number | null {
    this.raycaster.set(new THREE.Vector3(x, 100, z), new THREE.Vector3(0, -1, 0));
    return this.raycaster.intersectObject(this.map.mesh)[0]?.point.y ?? null;
  }

  private createStartingSettlement() {
    const placed: PlacedBuilding[] = [];
    for (const type of starterBuildings) {
      const definition = buildings.find((item) => item.id === type)!;
      const site = this.findSite(definition, placed);
      placed.push({ type, x: site.x, z: site.z });
      const model = createBuilding(type);
      model.position.copy(site);
      this.scene.add(model);
    }
    game.initializeIsland(placed);
  }

  private findSite(definition: BuildingDefinition, placed: PlacedBuilding[]): THREE.Vector3 {
    for (let ring = 0; ring <= 16; ring++) {
      for (let x = -ring; x <= ring; x++) {
        for (let z = -ring; z <= ring; z++) {
          if (Math.max(Math.abs(x), Math.abs(z)) !== ring) continue;
          const px = x * 12;
          const pz = z * 12;
          const height = this.terrainHeight(px, pz);
          if (height === null) continue;
          const candidate = new THREE.Vector3(px, height, pz);
          if (!this.validate(candidate, definition, placed)) return candidate;
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
        const model = createBuilding("shack");
        model.position.copy(site);
        this.scene.add(model);
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
          const definition = buildings.find((item) => item.id === placed.type)!;
          return Math.hypot(px - placed.x, pz - placed.z) < definition.radius + 2;
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

  private validate(point: THREE.Vector3, definition: BuildingDefinition, placedBuildings = game.getSnapshot().placed): string | null {
    const radius = definition.radius;
    const heights = [
      this.terrainHeight(point.x - radius, point.z - radius),
      this.terrainHeight(point.x + radius, point.z - radius),
      this.terrainHeight(point.x - radius, point.z + radius),
      this.terrainHeight(point.x + radius, point.z + radius),
    ];
    if (point.y < 1 || heights.some((height) => height === null || height < 1)) return "Buildings must be placed on dry land.";
    if (heights.some((height) => height !== null && Math.abs(height - point.y) > 2)) return "Choose flatter ground for this building.";
    if (this.trees.some((tree) => Math.hypot(point.x - tree.x, point.z - tree.y) < radius + 2)) return "A tree is in the way.";
    if (placedBuildings.some((placed) => {
      const other = buildings.find((item) => item.id === placed.type)!;
      return Math.hypot(point.x - placed.x, point.z - placed.z) < radius + other.radius;
    })) return "There is another building too close.";
    if (game.getSnapshot().money < definition.cost) return "Not enough treasury funds.";
    return null;
  }

  private onPointerMove = (event: PointerEvent) => {
    if (!this.ready || !this.ghost || !this.ghostType) return;
    const mouse = new THREE.Vector2(event.clientX / window.innerWidth * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
    this.raycaster.setFromCamera(mouse, this.camera);
    const hit = this.raycaster.intersectObject(this.map.mesh)[0];
    if (!hit) {
      this.ghost.visible = false;
      this.placement = null;
      return;
    }
    this.placement = hit.point;
    this.ghost.visible = true;
    this.ghost.position.copy(hit.point);
    const definition = buildings.find((item) => item.id === this.ghostType)!;
    const invalid = this.validate(hit.point, definition);
    this.ghost.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        child.material.color.set(invalid ? 0xe45a45 : 0x8be4b0);
      }
    });
  };

  private onPointerDown = (event: PointerEvent) => {
    if (event.button === 0) this.pointerDown = { x: event.clientX, y: event.clientY };
  };

  private onPointerUp = (event: PointerEvent) => {
    const down = this.pointerDown;
    this.pointerDown = null;
    if (!down || event.button !== 0 || Math.hypot(event.clientX - down.x, event.clientY - down.y) > 5) return;
    const type = game.getSnapshot().selected;
    if (!type || !this.placement) return;
    const definition = buildings.find((item) => item.id === type)!;
    const invalid = this.validate(this.placement, definition);
    if (invalid) {
      game.notify(invalid);
      return;
    }
    if (game.place(type, this.placement.x, this.placement.z)) {
      const model = createBuilding(type);
      model.position.copy(this.placement);
      this.scene.add(model);
      this.onPointerMove(event);
    }
  };

  private onPointerLeave = () => {
    this.pointerDown = null;
    this.placement = null;
    if (this.ghost) this.ghost.visible = false;
  };
}

export default GameScene;
