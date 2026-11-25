import * as THREE from "three";
import { Water } from "three/examples/jsm/objects/Water.js";
import { SkySunController } from "./SkySunController";

export class WaterScene {
  private water: Water;

  constructor(scene: THREE.Scene, skySun: SkySunController) {
    const normals = new THREE.TextureLoader().load("textures/waternormals.jpg");
    normals.wrapS = normals.wrapT = THREE.RepeatWrapping;
    this.water = new Water(new THREE.PlaneGeometry(2048, 2048), {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: normals,
      sunDirection: skySun.getSunDirection(),
      sunColor: 0xffffff,
      waterColor: 0x126b6b,
      distortionScale: 2,
    });
    this.water.rotation.x = -Math.PI / 2;
    scene.add(this.water);
  }

  update(delta: number) {
    this.water.material.uniforms.time.value += delta;
  }
}
