import { MeshStandardMaterial, PlaneGeometry, Mesh, Vector3 } from "three";
import GameEntity from "../entities/GameEntity";
import ResourceManager from "../utils/ResourceManager";
import { Noise } from "noisejs";
import * as THREE from "three";

class GameMap extends GameEntity {
  private _size: number;
  protected _mesh: Mesh = null!;
  private _noise = new Noise(Math.random());

  constructor(position: Vector3, size: number) {
    super(position);
    this._size = size;
  }

  // More natural height function using Perlin noise
  private getHeight(i: number, j: number): number {
    const scale = 0.05;
    const amplitude = 2;
    const noise = this._noise.perlin2(i * scale, j * scale) * amplitude;

    // Radial falloff: center is high, edges are low
    const cx = this._size / 2;
    const cy = this._size / 2;
    const dx = i - cx;
    const dy = j - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = Math.sqrt(2) * (this._size / 2);
    const falloff = 1 - (dist / maxDist); // 1 at center, 0 at edge

    // Make the center much higher and the edge much lower (below 0)
    return noise * falloff + 10 * Math.pow(falloff, 3) - 5 * (1 - falloff);
  }

  // load the tiles and add them to this map mesh object
  public load = async () => {
    const tileTexture = ResourceManager.instance.getGroundTextures()[0];
    tileTexture.wrapS = tileTexture.wrapT = THREE.RepeatWrapping;
    tileTexture.repeat.set(64, 64); // Repeat texture across the map

    const geometry = new PlaneGeometry(this._size, this._size, this._size - 1, this._size - 1);
    const position = geometry.attributes.position;
    for (let i = 0; i < this._size; i++) {
      for (let j = 0; j < this._size; j++) {
        const idx = i * this._size + j;
        const height = this.getHeight(i, j);
        position.setZ(idx, height);
      }
    }
    geometry.computeVertexNormals();
    const material = new MeshStandardMaterial({ map: tileTexture });
    this._mesh = new Mesh(geometry, material);
    this._mesh.rotation.x = -Math.PI / 2; // rotate to face up
    this._mesh.position.z = 2; // raise above water
  };

  public getHeightAt(x: number, z: number): number {
    // Convert world x,z to grid i,j
    const half = this._size / 2;
    const i = Math.round(x + half);
    const j = Math.round(z + half);
    if (i < 0 || i >= this._size || j < 0 || j >= this._size) return 0;
    return this.getHeight(i, j);
  }
}

export default GameMap;
