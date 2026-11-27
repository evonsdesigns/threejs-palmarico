import { GRID_TILE_SIZE, type GridFootprint, type Rotation } from "./grid";

/**
 * Tropico-style land: a height at every tile corner plus one terrain type per tile.
 * Tile (tx, tz) covers world x ∈ [tx·4, (tx+1)·4) and z ∈ [tz·4, (tz+1)·4); tiles run
 * from -half to half-1 on both axes. Each tile is rendered as two triangles split along
 * its (0,0)–(1,1) diagonal, and `heightAt` interpolates the same way.
 */
/** Unit vector of a building's front (+z at rotation 0) after quarter turns. */
export function frontDirection(rotation: Rotation): [number, number] {
  return [[0, 1], [1, 0], [0, -1], [-1, 0]][rotation] as [number, number];
}

export const terrainTypes = ["water", "sand", "grass", "jungle", "dirt", "rock"] as const;
export type TerrainType = typeof terrainTypes[number];

/** Highest corner-to-corner rise construction workers will grade inside one footprint. */
export const MAX_GRADE = 3;
/** Corners lower than this are sea or wet shoreline. */
export const DRY_HEIGHT = 0.6;
const GRADE_SKIRT = 2;

export interface TerrainSite {
  height: number;
  error: string | null;
}

export interface CornerBounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

function mulberry32(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createNoise(seed: number) {
  const random = mulberry32(seed);
  const permutation = Array.from({ length: 256 }, (_, index) => index);
  for (let index = 255; index > 0; index--) {
    const swap = Math.floor(random() * (index + 1));
    [permutation[index], permutation[swap]] = [permutation[swap], permutation[index]];
  }
  const table = [...permutation, ...permutation];
  const gradient = (hash: number, x: number, y: number) => {
    const angle = (hash / 256) * Math.PI * 2;
    return Math.cos(angle) * x + Math.sin(angle) * y;
  };
  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const noise = (x: number, y: number) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;
    const a = table[(xi & 255) + table[yi & 255]];
    const b = table[((xi + 1) & 255) + table[yi & 255]];
    const c = table[(xi & 255) + table[(yi + 1) & 255]];
    const d = table[((xi + 1) & 255) + table[(yi + 1) & 255]];
    const u = fade(xf);
    const v = fade(yf);
    const top = gradient(a, xf, yf) + (gradient(b, xf - 1, yf) - gradient(a, xf, yf)) * u;
    const bottom = gradient(c, xf, yf - 1) + (gradient(d, xf - 1, yf - 1) - gradient(c, xf, yf - 1)) * u;
    return top + (bottom - top) * v;
  };
  return (x: number, y: number, octaves = 1) => {
    let total = 0;
    let amplitude = 1;
    let frequency = 1;
    let range = 0;
    for (let octave = 0; octave < octaves; octave++) {
      total += noise(x * frequency, y * frequency) * amplitude;
      range += amplitude;
      amplitude *= 0.5;
      frequency *= 2;
    }
    return total / range;
  };
}

const smoothstep = (edge0: number, edge1: number, value: number) => {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

export class Terrain {
  /** Tiles per side. */
  readonly size: number;
  readonly half: number;
  readonly heights: Float32Array;
  readonly types: Uint8Array;
  /** 0 free, 1 held by a tree (skirts leave it alone), 2 part of a graded building pad. */
  private readonly locked: Uint8Array;
  private readonly listeners = new Set<(bounds: CornerBounds) => void>();

  constructor(size: number) {
    if (!Number.isInteger(size) || size < 2 || size % 2) throw new Error("Terrain size must be an even number of tiles.");
    this.size = size;
    this.half = size / 2;
    this.heights = new Float32Array((size + 1) * (size + 1));
    this.types = new Uint8Array(size * size);
    this.locked = new Uint8Array((size + 1) * (size + 1));
  }

  /** A deterministic island: sandy rim, rolling interior, jungle patches and a rocky north-western massif. */
  static generate(seed = 1959, size = 256): Terrain {
    const terrain = new Terrain(size);
    const noise = createNoise(seed);
    const radius = size * 0.39;
    for (let cz = -terrain.half; cz <= terrain.half; cz++) {
      for (let cx = -terrain.half; cx <= terrain.half; cx++) {
        const coast = noise(cx * 0.025 + 11.3, cz * 0.025 - 4.7, 3) * 0.16;
        const r = Math.hypot(cx, cz * 1.12) / radius + coast;
        const land = smoothstep(1.02, 0.95, r);
        const rise = 1.7 + 2.2 * smoothstep(0.95, 0.45, r);
        const hills = noise(cx * 0.045, cz * 0.045, 3) * 2.4 * smoothstep(0.95, 0.6, r);
        // Ridged noise gives the volcanic massif gullies and crags instead of a smooth dome.
        const crags = 1 - Math.abs(noise(cx * 0.07 + 3.1, cz * 0.07, 3));
        const massif = Math.exp(-((cx + 58) ** 2 + (cz + 52) ** 2) / (18 ** 2)) * (20 + 22 * crags * crags);
        const ridge = Math.exp(-((cx - 62) ** 2 + (cz + 58) ** 2) / (13 ** 2)) * (8 + 8 * crags);
        const seaFloor = -4 - 2.5 * smoothstep(1.02, 1.4, r);
        terrain.heights[terrain.cornerIndex(cx, cz)] = seaFloor + (rise + Math.max(0, hills) * 0.8 + hills * 0.2 + massif + ridge - seaFloor) * land;
      }
    }
    for (let tz = -terrain.half; tz < terrain.half; tz++) {
      for (let tx = -terrain.half; tx < terrain.half; tx++) {
        const corners = terrain.tileCorners(tx, tz);
        const low = Math.min(...corners);
        const high = Math.max(...corners);
        const average = corners.reduce((sum, height) => sum + height, 0) / 4;
        const rim = Math.hypot(tx + 0.5, (tz + 0.5) * 1.12) / radius + noise(tx * 0.025 + 11.3, tz * 0.025 - 4.7, 3) * 0.16;
        let type: TerrainType = "grass";
        if (average < 0) type = "water";
        else if (low < DRY_HEIGHT + 0.9 || rim > 0.93 + noise(tx * 0.2, tz * 0.2) * 0.02) type = "sand";
        else if (high - low > 2.4 || average > 22 + noise(tx * 0.3, tz * 0.3) * 4) type = "rock";
        else if (noise(tx * 0.06 - 7.7, tz * 0.06 + 2.9, 2) > 0.12 - Math.min(average, 8) * 0.025) type = "jungle";
        else if (noise(tx * 0.15 + 5.1, tz * 0.15 + 8.3) > 0.42) type = "dirt";
        terrain.types[terrain.tileIndex(tx, tz)] = terrainTypes.indexOf(type);
      }
    }
    return terrain;
  }

  get worldSize() {
    return this.size * GRID_TILE_SIZE;
  }

  cornerIndex(cx: number, cz: number) {
    return (cz + this.half) * (this.size + 1) + cx + this.half;
  }

  tileIndex(tx: number, tz: number) {
    return (tz + this.half) * this.size + tx + this.half;
  }

  containsTile(tx: number, tz: number) {
    return tx >= -this.half && tx < this.half && tz >= -this.half && tz < this.half;
  }

  cornerHeight(cx: number, cz: number) {
    return this.heights[this.cornerIndex(cx, cz)];
  }

  tileCorners(tx: number, tz: number): [number, number, number, number] {
    return [this.cornerHeight(tx, tz), this.cornerHeight(tx + 1, tz), this.cornerHeight(tx, tz + 1), this.cornerHeight(tx + 1, tz + 1)];
  }

  tileType(tx: number, tz: number): TerrainType | null {
    return this.containsTile(tx, tz) ? terrainTypes[this.types[this.tileIndex(tx, tz)]] : null;
  }

  setTileType(tx: number, tz: number, type: TerrainType) {
    this.types[this.tileIndex(tx, tz)] = terrainTypes.indexOf(type);
  }

  /** Ground height at a world position, or null beyond the map edge. */
  heightAt(x: number, z: number): number | null {
    const gx = x / GRID_TILE_SIZE;
    const gz = z / GRID_TILE_SIZE;
    if (gx < -this.half || gx > this.half || gz < -this.half || gz > this.half) return null;
    const tx = Math.min(Math.floor(gx), this.half - 1);
    const tz = Math.min(Math.floor(gz), this.half - 1);
    const fx = gx - tx;
    const fz = gz - tz;
    const [h00, h10, h01, h11] = this.tileCorners(tx, tz);
    return fx >= fz
      ? h00 + (h10 - h00) * fx + (h11 - h10) * fz
      : h00 + (h01 - h00) * fz + (h11 - h01) * fx;
  }

  /** Marks corners that grading skirts must not move (under buildings, trees and fields). */
  lockTile(tx: number, tz: number) {
    for (const [dx, dz] of [[0, 0], [1, 0], [0, 1], [1, 1]]) {
      if (this.containsTile(tx, tz)) {
        const index = this.cornerIndex(tx + dx, tz + dz);
        this.locked[index] = Math.max(this.locked[index], 1);
      }
    }
  }

  // Releases tree locks once a tile's trees are cleared; building pads stay locked.
  unlockTile(tx: number, tz: number) {
    if (!this.containsTile(tx, tz)) return;
    for (const [dx, dz] of [[0, 0], [1, 0], [0, 1], [1, 1]]) {
      const index = this.cornerIndex(tx + dx, tz + dz);
      if (this.locked[index] === 1) this.locked[index] = 0;
    }
  }

  /** Can a building go here, and at what ground level will workers grade it? */
  evaluate(footprint: GridFootprint, rotation: Rotation, coastal: boolean): TerrainSite {
    const corners: { x: number; z: number; h: number; pad: boolean }[] = [];
    for (let z = footprint.minZ; z <= footprint.minZ + footprint.sizeZ; z++) {
      for (let x = footprint.minX; x <= footprint.minX + footprint.sizeX; x++) {
        if (x < -this.half || x > this.half || z < -this.half || z > this.half) return { height: 0, error: "That is beyond the edge of the island." };
        corners.push({ x, z, h: this.cornerHeight(x, z), pad: this.locked[this.cornerIndex(x, z)] === 2 });
      }
    }
    for (let z = footprint.minZ; z < footprint.minZ + footprint.sizeZ; z++) {
      for (let x = footprint.minX; x < footprint.minX + footprint.sizeX; x++) {
        if (this.tileType(x, z) === "rock") return { height: 0, error: "Rocky cliffs cannot be built on." };
      }
    }
    if (!coastal) {
      if (corners.some(({ h }) => h < DRY_HEIGHT)) return { height: 0, error: "Buildings must be placed on dry land." };
      const heights = corners.map(({ h }) => h);
      const low = Math.min(...heights);
      const high = Math.max(...heights);
      // Touching an existing pad continues its level, like a terrace of neighbouring lots.
      const pads = corners.filter(({ pad }) => pad).map(({ h }) => h);
      const height = pads.length ? Math.max(...pads)
        : Math.max(DRY_HEIGHT + 0.4, Math.round(heights.reduce((sum, h) => sum + h, 0) / heights.length * 4) / 4);
      if (high - low > MAX_GRADE || high - height > MAX_GRADE || height - low > MAX_GRADE) return { height, error: "The ground is too steep to grade here." };
      return { height, error: null };
    }
    const [fx, fz] = frontDirection(rotation);
    const cx = footprint.minX + footprint.sizeX / 2;
    const cz = footprint.minZ + footprint.sizeZ / 2;
    const halfDepth = (fx ? footprint.sizeX : footprint.sizeZ) / 2;
    const along = ({ x, z }: { x: number; z: number }) => ((x - cx) * fx + (z - cz) * fz) / halfDepth;
    const back = corners.filter((corner) => along(corner) < 0);
    const front = corners.filter((corner) => along(corner) > 0.99);
    const coastError = "Build this along the shore with its front over the water.";
    if (back.some(({ h }) => h < DRY_HEIGHT)) return { height: 0, error: coastError };
    const height = Math.max(1, ...back.map(({ h }) => h));
    if (back.some(({ h }) => height - h > MAX_GRADE)) return { height, error: "The ground is too steep to grade here." };
    if (front.some(({ h }) => h >= 0)) return { height, error: coastError };
    if (corners.some(({ h }) => h > height + 0.5)) return { height, error: coastError };
    return { height, error: null };
  }

  /**
   * Flattens a footprint to the given height like Tropico's construction workers do, easing
   * a skirt of surrounding corners towards it. Sea corners, existing pads and trees are left alone.
   */
  grade(footprint: GridFootprint, height: number, coastal = false): CornerBounds {
    const bounds = {
      minX: Math.max(-this.half, footprint.minX - GRADE_SKIRT),
      maxX: Math.min(this.half, footprint.minX + footprint.sizeX + GRADE_SKIRT),
      minZ: Math.max(-this.half, footprint.minZ - GRADE_SKIRT),
      maxZ: Math.min(this.half, footprint.minZ + footprint.sizeZ + GRADE_SKIRT),
    };
    for (let z = bounds.minZ; z <= bounds.maxZ; z++) {
      for (let x = bounds.minX; x <= bounds.maxX; x++) {
        const index = this.cornerIndex(x, z);
        const current = this.heights[index];
        const distance = Math.max(
          footprint.minX - x, x - (footprint.minX + footprint.sizeX),
          footprint.minZ - z, z - (footprint.minZ + footprint.sizeZ), 0,
        );
        if (distance === 0) {
          if ((coastal && current < 0) || this.locked[index] === 2) continue;
          this.heights[index] = height;
          this.locked[index] = 2;
        } else if (!this.locked[index] && current >= 0) {
          this.heights[index] = current + (height - current) * (1 - distance / (GRADE_SKIRT + 1));
        }
      }
    }
    for (let z = footprint.minZ; z < footprint.minZ + footprint.sizeZ; z++) {
      for (let x = footprint.minX; x < footprint.minX + footprint.sizeX; x++) {
        if (this.containsTile(x, z) && this.tileType(x, z) !== "water") this.setTileType(x, z, "dirt");
      }
    }
    this.listeners.forEach((listener) => listener(bounds));
    return bounds;
  }

  onChange(listener: (bounds: CornerBounds) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /** Marches a ray over the height field; returns the first ground hit distance or null. */
  raycast(origin: { x: number; y: number; z: number }, direction: { x: number; y: number; z: number }, maxDistance = 4000): number | null {
    const step = GRID_TILE_SIZE / 4;
    let previous = 0;
    for (let t = 0; t <= maxDistance; t += step) {
      const height = this.heightAt(origin.x + direction.x * t, origin.z + direction.z * t);
      if (height === null) {
        previous = t;
        continue;
      }
      if (origin.y + direction.y * t <= height) {
        let low = previous;
        let high = t;
        for (let iteration = 0; iteration < 12; iteration++) {
          const mid = (low + high) / 2;
          const ground = this.heightAt(origin.x + direction.x * mid, origin.z + direction.z * mid) ?? -Infinity;
          if (origin.y + direction.y * mid <= ground) high = mid;
          else low = mid;
        }
        return high;
      }
      previous = t;
    }
    return null;
  }
}
