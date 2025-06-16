import {
  HemisphereLight,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import * as THREE from "three";
import GameEntity from "../entities/GameEntity";
import GameMap from "../map/GameMap";
import ResourceManager from "../utils/ResourceManager";
import { MapControls } from "three/examples/jsm/Addons";
import { WaterScene } from './water';
import { createCamera } from "./camera";
import { SkySunController } from './SkySunController';
import House1 from "../entities/house1";
import { createMapControls } from "./controls";
import HouseTenement from "../entities/HouseTenement";


class GameScene {
  private static _instance = new GameScene();
  public static get instance() {
    return this._instance;
  }
  private _width: number;
  private _height: number;
  private _renderer: WebGLRenderer;
  private _camera: THREE.OrthographicCamera;
  private _controls: MapControls;
  private _skySun: SkySunController;
  private _gameMap: GameMap;
  private _sunTime = 0;
  public lastElevation = 0;
  private isBuildingPlacementEnabled = false;
  private readonly _scene = new Scene();
  private _gameEntities: GameEntity[] = [];
  private _placingBuilding = false;
  private _ghostBuilding: House1 | null = null;
  private _buildingTypeChoice = '';

  private constructor() {
    this._width = window.innerWidth;
    this._height = window.innerHeight;

    this._renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    this._renderer.setPixelRatio(window.devicePixelRatio);
    this._renderer.setSize(this._width, this._height);
    // find the target html element
    const targetElement = document.querySelector<HTMLDivElement>("#app");
    if (!targetElement) {
      throw "unable to find target element";
    }
    targetElement.appendChild(this._renderer.domElement);
    this._camera = createCamera();

    this._controls = createMapControls(
      this._camera,
      this._renderer
    );
    this._skySun = new SkySunController(this._scene, this._renderer);

    const waterScene = new WaterScene(
      'app',
      this._camera,
      this._renderer,
      this._scene,
      this._skySun
    );
    waterScene.init();
    waterScene.animate();

    // listen to size change
    window.addEventListener("resize", this.resize, false);

    // add the game map
    this._gameMap = new GameMap(new Vector3(0, 0, 0), 1024);
    this._gameEntities.push(this._gameMap);

    const placeBtn = document.getElementById('build');
    if (placeBtn) {
      placeBtn.addEventListener('click', () => {
        if (!this.isBuildingPlacementEnabled) {
          this.isBuildingPlacementEnabled = true;
          GameScene.instance.enableBuildingPlacement();
        } else {
          this.isBuildingPlacementEnabled = false;
          GameScene.instance.disableBuildingPlacement();
        }
      });
    }

    document.getElementById('build-house')?.addEventListener('click', () => {
      this._buildingTypeChoice = 'house1';
      this.updateGhostBuilding();
    });
    document.getElementById('build-tenant')?.addEventListener('click', () => {
      this._buildingTypeChoice = 'tenant';
      this.updateGhostBuilding();
    });
    window.addEventListener('keydown', (event) => {
      if (event.key === 'b') {
        console.log("Enabling building placement from shortcut B");
        if (!this.isBuildingPlacementEnabled) {
          this.isBuildingPlacementEnabled = true;
          this.enableBuildingPlacement();
        } else {
          console.log("disabling building placement from shortcut B");
          this.isBuildingPlacementEnabled = false;
          this.disableBuildingPlacement();
        }
      }
    });
  }

  public toggleBuildingPlacement(buildingTypeId?: string) {
    if (this.isBuildingPlacementEnabled && buildingTypeId === this._buildingTypeChoice) {
      this.disableBuildingPlacement();
    } else {
      this.enableBuildingPlacement();
    }
  }
  

  public setBuildingType = (buildingTypeId: string) => {
    this._buildingTypeChoice = buildingTypeId;
    this.updateGhostBuilding();
  }

  private getBuildingType = () => {
    switch (this._buildingTypeChoice) {
      case 'house1':
        return House1;
      case 'tenement':
        return HouseTenement;
      default:
        console.warn(`Unknown building type: ${this._buildingTypeChoice}`);
        return House1; // Default to House1 if unknown
    }
  };

  private resize = () => {
    this._width = window.innerWidth;
    this._height = window.innerHeight;
    this._renderer.setSize(this._width, this._height);
    this._camera.aspect = this._width / this._height;
    this._camera.updateProjectionMatrix();
    this._controls.update();
  };

  public load = async () => {
    // load game resources
    await ResourceManager.instance.load();

    // load game entities
    for (let index = 0; index < this._gameEntities.length; index++) {
      const element = this._gameEntities[index];
      await element.load();
      this._scene.add(element.mesh);
    }
    // add a light to the scene
    const light = new HemisphereLight(0xffffbb, 0x080820, 1);
    this._scene.add(light);
  };

  public render = () => {
    requestAnimationFrame(this.render);
    this._renderer.render(this._scene, this._camera);
    this._controls.update();

    if (this.lastElevation < 1) {
      this._sunTime += 0.001;
    } else {
      this._sunTime += 0.01;
    }
    const elevation = 45 + 45 * Math.sin(this._sunTime); // 0 to 90 degrees


    const azimuth = (this._sunTime * 30) % 360; // Slowly rotate azimuth
    this._skySun.setParameters(elevation, azimuth);
    this._skySun.updateFade(elevation);
    this.lastElevation = elevation;
  };

  // public update ghost building
  public updateGhostBuilding() {
    // remove the existing ghost building mesh if it exists
    if (this._ghostBuilding) {
      this._scene.remove(this._ghostBuilding.mesh);
    }
    const SelectedBuilding = this.getBuildingType();

    console.log('bldg type:', this._buildingTypeChoice);

    this._ghostBuilding = new SelectedBuilding(new THREE.Vector3(0, 0, 0));
    this._ghostBuilding.mesh.traverse((child: any) => {
      if (child.isMesh) {
        child.material = child.material.clone();
        child.material.transparent = true;
        child.material.opacity = 0.5;
        child.material.color.set(0xffff00);
      }
    });
    this._scene.add(this._ghostBuilding.mesh);
  }

  public enableBuildingPlacement() {
    this._placingBuilding = true;
    window.addEventListener('pointerdown', this._onPointerDown);
    window.addEventListener('pointermove', this._onPointerMove);
    this.updateGhostBuilding();
  }

  public disableBuildingPlacement() {
    this._placingBuilding = false;
    window.removeEventListener('pointerdown', this._onPointerDown);
    window.removeEventListener('pointermove', this._onPointerMove);
    // Remove ghost building
    if (this._ghostBuilding) {
      this._scene.remove(this._ghostBuilding.mesh);
      this._ghostBuilding = null;
    }
    this._buildingTypeChoice = ''; // Reset building type choice
  }

  private getMouseXYZ = (event: MouseEvent) => {
    // Convert screen coordinates to world coordinates
    const mouse = new THREE.Vector2(
      (event.clientX / this._width) * 2 - 1,
      -(event.clientY / this._height) * 2 + 1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this._camera);

    // Use the controls' target for the ground plane height
    const groundY = this._controls.target.y;
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -groundY);
    const intersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersection);

    // Offset the ghost building to the right and down
    const offsetX = 15; // increase this value for more rightward offset
    const offsetZ = 15; // increase this value for more downward offset

    const x = intersection.x + offsetX;
    const z = intersection.z + offsetZ;
    const y = this._gameMap.getHeightAt(x, z);

    return { x, y, z };
  }


  private _onPointerMove = (event: PointerEvent) => {
    if (!this._placingBuilding || !this._ghostBuilding) return;
    const { x, y, z } = this.getMouseXYZ(event);
    this._ghostBuilding.mesh.position.set(x, y, z);
  };

  private _onPointerDown = (event: PointerEvent) => {
    if (!this._placingBuilding) return;
    const { x, y, z } = this.getMouseXYZ(event);
    const SelectedBuilding = this.getBuildingType();


    const buildingPosition = new THREE.Vector3(x, y, z);
    console.log("Placing building at:", buildingPosition);
    const building = new SelectedBuilding(buildingPosition);
    this._scene.add(building.mesh);
    this._gameEntities.push(building);
    //this._gameMap.flattenTerrain(x, z, 5);
  };
}

export default GameScene;
