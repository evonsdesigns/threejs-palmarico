import * as THREE from "three";
import { GRID_TILE_SIZE } from "../logic/grid";
import { Terrain, terrainTypes, type CornerBounds } from "../logic/terrain";

// Per-tile blend weights (R sand, G jungle, B dirt, A rock); grass shows wherever all are zero.
const weights: Record<typeof terrainTypes[number], [number, number, number, number]> = {
  water: [255, 0, 0, 0],
  sand: [255, 0, 0, 0],
  grass: [0, 0, 0, 0],
  jungle: [0, 255, 0, 0],
  dirt: [0, 0, 255, 0],
  rock: [0, 0, 0, 255],
};

/** Renders a {@link Terrain} with one vertex per tile corner, so the mesh follows the tile grid exactly. */
export class TerrainMesh {
  readonly mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>;
  private readonly typeTexture: THREE.DataTexture;
  private readonly gridMode = { value: 0 };

  constructor(private readonly terrain: Terrain, groundTexture: THREE.Texture) {
    const corners = terrain.size + 1;
    const positions = new Float32Array(corners * corners * 3);
    const indices: number[] = [];
    for (let cz = -terrain.half; cz <= terrain.half; cz++) {
      for (let cx = -terrain.half; cx <= terrain.half; cx++) {
        const index = terrain.cornerIndex(cx, cz);
        positions[index * 3] = cx * GRID_TILE_SIZE;
        positions[index * 3 + 1] = terrain.cornerHeight(cx, cz);
        positions[index * 3 + 2] = cz * GRID_TILE_SIZE;
      }
    }
    // Two triangles per tile, split along the (0,0)–(1,1) diagonal to match Terrain.heightAt.
    for (let tz = -terrain.half; tz < terrain.half; tz++) {
      for (let tx = -terrain.half; tx < terrain.half; tx++) {
        const a = terrain.cornerIndex(tx, tz);
        const b = terrain.cornerIndex(tx + 1, tz);
        const c = terrain.cornerIndex(tx, tz + 1);
        const d = terrain.cornerIndex(tx + 1, tz + 1);
        indices.push(a, d, b, a, c, d);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();

    this.typeTexture = new THREE.DataTexture(new Uint8Array(terrain.size * terrain.size * 4), terrain.size, terrain.size, THREE.RGBAFormat);
    this.typeTexture.magFilter = this.typeTexture.minFilter = THREE.LinearFilter;
    this.writeTypes({ minX: -terrain.half, maxX: terrain.half, minZ: -terrain.half, maxZ: terrain.half });

    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.colorSpace = THREE.SRGBColorSpace;
    groundTexture.anisotropy = 4;
    groundTexture.repeat.set(terrain.size / 4, terrain.size / 4);
    const material = new THREE.MeshStandardMaterial({ map: groundTexture, roughness: 0.95 });
    material.onBeforeCompile = (shader) => {
      shader.uniforms.terrainTypes = { value: this.typeTexture };
      shader.uniforms.terrainWorldSize = { value: terrain.worldSize };
      shader.uniforms.gridMode = this.gridMode;
      shader.vertexShader = shader.vertexShader
        .replace("void main() {", "varying vec3 vTerrainPosition;\nvoid main() {")
        .replace("#include <worldpos_vertex>", "#include <worldpos_vertex>\nvTerrainPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;");
      shader.fragmentShader = shader.fragmentShader
        .replace("void main() {", `
          varying vec3 vTerrainPosition;
          uniform sampler2D terrainTypes;
          uniform float terrainWorldSize;
          uniform float gridMode;
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
          float gridLines(vec2 cells) {
            vec2 distance = abs(fract(cells + 0.5) - 0.5) / max(fwidth(cells), vec2(0.0001));
            return 1.0 - min(min(distance.x, distance.y), 1.0);
          }
          void main() {`)
        .replace("#include <map_fragment>", `#include <map_fragment>
          vec2 ground = vTerrainPosition.xz;
          // Jitter the lookup so tile-type borders look hand-painted rather than bilinear.
          vec2 jitter = (vec2(terrainNoise(ground * 0.45), terrainNoise(ground * 0.45 + 17.0)) - 0.5) * ${(GRID_TILE_SIZE * 0.55).toFixed(2)};
          vec4 types = texture2D(terrainTypes, (ground + jitter) / terrainWorldSize + 0.5);
          float patches = terrainNoise(ground * 0.075);
          float flecks = terrainNoise(ground * 1.4);
          vec3 grass = diffuseColor.rgb * vec3(0.84, 1.04, 0.7) * mix(0.84, 1.14, patches);
          grass = mix(grass, vec3(0.16, 0.22, 0.09), (1.0 - flecks) * 0.14);
          vec3 jungle = diffuseColor.rgb * vec3(0.5, 0.74, 0.44) * mix(0.8, 1.1, terrainNoise(ground * 0.3));
          float grains = terrainNoise(ground * 4.5);
          vec3 sand = mix(vec3(0.6, 0.5, 0.31), vec3(0.86, 0.77, 0.53), grains) * mix(0.9, 1.06, terrainNoise(ground * 0.25));
          sand = mix(sand * vec3(0.72, 0.68, 0.6), sand, smoothstep(-0.6, 0.4, vTerrainPosition.y));
          vec3 dirt = mix(vec3(0.34, 0.24, 0.14), vec3(0.47, 0.35, 0.22), terrainNoise(ground * 2.2));
          vec3 rock = mix(vec3(0.3, 0.28, 0.24), vec3(0.46, 0.42, 0.35), terrainNoise(ground * 1.1 + 3.0));
          rock = mix(rock, rock * 0.72, smoothstep(0.55, 0.8, terrainNoise(ground * 3.1)));
          float edge = (terrainNoise(ground * 0.9) - 0.5) * 0.35;
          vec3 color = grass;
          color = mix(color, jungle, smoothstep(0.25, 0.75, types.g + edge));
          color = mix(color, dirt, smoothstep(0.25, 0.75, types.b + edge));
          color = mix(color, rock, smoothstep(0.25, 0.75, types.a + edge));
          color = mix(color, sand, smoothstep(0.3, 0.7, types.r + edge));
          diffuseColor.rgb = color;
          float tileGrid = gridLines(ground / ${GRID_TILE_SIZE.toFixed(1)});
          float macroGrid = gridLines(ground / ${(GRID_TILE_SIZE * 8).toFixed(1)});
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.12, 0.15, 0.1), tileGrid * (gridMode == 1.0 ? 0.45 : 0.05));
          if (gridMode == 2.0) diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.95, 0.85, 0.25), macroGrid * 0.75);`);
    };
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.receiveShadow = true;
    terrain.onChange((bounds) => this.update(bounds));
  }

  /** 0 = faint tile lines, 1 = full tile grid (G), 2 = macro planning grid (C). */
  setGridMode(mode: 0 | 1 | 2) {
    this.gridMode.value = mode;
  }

  get grid() {
    return this.gridMode.value as 0 | 1 | 2;
  }

  private writeTypes(bounds: CornerBounds) {
    const data = this.typeTexture.image.data as unknown as Uint8Array;
    for (let tz = Math.max(bounds.minZ, -this.terrain.half); tz < Math.min(bounds.maxZ, this.terrain.half); tz++) {
      for (let tx = Math.max(bounds.minX, -this.terrain.half); tx < Math.min(bounds.maxX, this.terrain.half); tx++) {
        data.set(weights[this.terrain.tileType(tx, tz)!], this.terrain.tileIndex(tx, tz) * 4);
      }
    }
    this.typeTexture.needsUpdate = true;
  }

  private update(bounds: CornerBounds) {
    const position = this.mesh.geometry.getAttribute("position") as THREE.BufferAttribute;
    for (let cz = bounds.minZ; cz <= bounds.maxZ; cz++) {
      for (let cx = bounds.minX; cx <= bounds.maxX; cx++) {
        const index = this.terrain.cornerIndex(cx, cz);
        position.setY(index, this.terrain.heights[index]);
      }
    }
    position.needsUpdate = true;
    this.mesh.geometry.computeVertexNormals();
    this.writeTypes(bounds);
  }
}
