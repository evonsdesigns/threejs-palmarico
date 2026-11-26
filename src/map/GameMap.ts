import { MeshStandardMaterial, PlaneGeometry, Mesh, Vector3 } from "three";
import GameEntity from "../entities/GameEntity";
import ResourceManager from "../utils/ResourceManager";
import { Noise } from "noisejs";
import * as THREE from "three";
import { GRID_TILE_SIZE } from "../logic/grid";

const TERRAIN_SEGMENTS = 128;

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
    tileTexture.colorSpace = THREE.SRGBColorSpace;
    tileTexture.anisotropy = 4;
    tileTexture.repeat.set(64, 64);

    const segments = TERRAIN_SEGMENTS;
    const geometry = new PlaneGeometry(this._size, this._size, segments, segments);
    const position = geometry.attributes.position;
    for (let i = 0; i <= segments; i++) {
      for (let j = 0; j <= segments; j++) {
        const idx = i * (segments + 1) + j;
        const height = this.getHeight(j * this._size / segments, i * this._size / segments);
        position.setZ(idx, height);
      }
    }
    geometry.computeVertexNormals();
    const material = new MeshStandardMaterial({ map: tileTexture });
    material.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader
        .replace("void main() {", "varying vec3 vTerrainPosition;\nvoid main() {")
        .replace("#include <worldpos_vertex>", "#include <worldpos_vertex>\nvTerrainPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;");
      shader.fragmentShader = shader.fragmentShader
        .replace("void main() {", `
          varying vec3 vTerrainPosition;
          float terrainHash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
          }
          float terrainNoise(vec2 p) {
            vec2 cell = floor(p);
            vec2 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            return mix(
              mix(terrainHash(cell), terrainHash(cell + vec2(1.0, 0.0)), f.x),
              mix(terrainHash(cell + vec2(0.0, 1.0)), terrainHash(cell + vec2(1.0, 1.0)), f.x), f.y
            );
          }
          void main() {`)
        .replace("#include <map_fragment>", `#include <map_fragment>
          vec2 ground = vTerrainPosition.xz;
          float patches = terrainNoise(ground * 0.075);
          float flecks = terrainNoise(ground * 1.4);
          vec3 grass = diffuseColor.rgb * vec3(0.8, 1.05, 0.72);
          grass *= mix(0.82, 1.18, patches);
          grass = mix(grass, vec3(0.13, 0.19, 0.08), (1.0 - flecks) * 0.16);
          float grains = terrainNoise(ground * 4.5);
          vec3 sand = mix(vec3(0.48, 0.37, 0.21), vec3(0.78, 0.67, 0.44), grains);
          sand *= mix(0.88, 1.1, terrainNoise(ground * 0.25));
          float shore = vTerrainPosition.y + (terrainNoise(ground * 0.17) - 0.5) * 0.25;
          float grassCover = smoothstep(0.1, 0.7, shore);
          diffuseColor.rgb = mix(sand, grass, grassCover);
          vec2 grid = abs(fract(ground / ${GRID_TILE_SIZE.toFixed(1)} + 0.5) - 0.5);
          vec2 gridWidth = max(fwidth(ground / ${GRID_TILE_SIZE.toFixed(1)}), vec2(0.001));
          float gridLine = 1.0 - min(min(grid.x / gridWidth.x, grid.y / gridWidth.y), 1.0);
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.15, 0.18, 0.12), gridLine * 0.06);`);
    };
    this._mesh = new Mesh(geometry, material);
    this._mesh.rotation.x = -Math.PI / 2; // rotate to face up
  };

  public sampleHeight(x: number, z: number): number | null {
    const half = this._size / 2;
    if (x < -half || x > half || z < -half || z > half) return null;
    const step = this._size / TERRAIN_SEGMENTS;
    const gx = (x + half) / step;
    const gz = (z + half) / step;
    const col = Math.min(Math.floor(gx), TERRAIN_SEGMENTS - 1);
    const row = Math.min(Math.floor(gz), TERRAIN_SEGMENTS - 1);
    const dx = gx - col;
    const dz = gz - row;
    const positions = this._mesh.geometry.getAttribute("position");
    const topLeft = row * (TERRAIN_SEGMENTS + 1) + col;
    const a = positions.getZ(topLeft);
    const b = positions.getZ(topLeft + TERRAIN_SEGMENTS + 1);
    const c = positions.getZ(topLeft + TERRAIN_SEGMENTS + 2);
    const d = positions.getZ(topLeft + 1);
    return dx + dz <= 1
      ? a + (d - a) * dx + (b - a) * dz
      : c + (b - c) * (1 - dx) + (d - c) * (1 - dz);
  }

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
