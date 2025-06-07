import {
  HemisphereLight,
  PerspectiveCamera,
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

  // three js scene
  private readonly _scene = new Scene();

  // game entities array
  private _gameEntities: GameEntity[] = [];
  private _placingBuilding = false;

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
  }

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
    // this._gizmo.update();

    if (this.lastElevation < 1) {
      this._sunTime += 0.001;
    } else {
      this._sunTime += 0.01;
    }
    const elevation = 45 + 45 * Math.sin(this._sunTime); // 0 to 90 degrees


    const azimuth = (this._sunTime * 30) % 360; // Slowly rotate azimuth
    this._skySun.setParameters(elevation, azimuth);
    this._skySun.updateFade(elevation);
    this.lastElevation = elevation
  };

  public enableBuildingPlacement() {
    this._placingBuilding = true;
    window.addEventListener('pointerdown', this._onPointerDown);
  }

  public disableBuildingPlacement() {
    this._placingBuilding = false;
    window.removeEventListener('pointerdown', this._onPointerDown);
  }

  private _onPointerDown = (event: PointerEvent) => {
    if (!this._placingBuilding) return;

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

    // Place a building at the intersection point
    const x = intersection.x;
    const z = intersection.z;
    const y = this._gameMap.getHeightAt(x, z); // <-- get height from map

    const buildingPosition = new THREE.Vector3(x, y, z);
    const building = new House1(buildingPosition);
    this._scene.add(building.mesh);
    this._gameEntities.push(building);
  };
}

export default GameScene;
