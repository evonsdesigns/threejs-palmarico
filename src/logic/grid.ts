export const GRID_TILE_SIZE = 4;

export interface GridFootprint {
  minX: number;
  minZ: number;
  sizeX: number;
  sizeZ: number;
}

export type Rotation = 0 | 1 | 2 | 3;

/** Tile size along x and z after turning a W x L footprint by quarter turns; odd turns swap W and L. */
export function rotatedTiles(tiles: readonly [number, number], rotation: Rotation): [number, number] {
  return rotation % 2 ? [tiles[1], tiles[0]] : [tiles[0], tiles[1]];
}

export interface GridTile {
  x: number;
  z: number;
}

export interface WalkBounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export function findWalkPath(
  start: GridTile, goals: GridTile[], walkable: (tile: GridTile) => boolean,
  canStep: (from: GridTile, to: GridTile) => boolean = () => true,
): GridTile[] | null {
  return findWalkPathFromStarts([start], goals, walkable, canStep);
}

export function findWalkPathFromStarts(
  starts: GridTile[], goals: GridTile[], walkable: (tile: GridTile) => boolean,
  canStep: (from: GridTile, to: GridTile) => boolean = () => true,
): GridTile[] | null {
  if (goals.length === 0) return null;
  const key = (tile: GridTile) => `${tile.x},${tile.z}`;
  const goalKeys = new Set(goals.map(key));
  const distance = (tile: GridTile) => Math.min(...goals.map((goal) => {
    const dx = Math.abs(tile.x - goal.x);
    const dz = Math.abs(tile.z - goal.z);
    return Math.max(dx, dz) + (Math.SQRT2 - 1) * Math.min(dx, dz);
  }));
  const open: { tile: GridTile; cost: number; score: number }[] = [];
  const push = (node: typeof open[number]) => {
    open.push(node);
    let index = open.length - 1;
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (open[parent].score <= node.score) break;
      open[index] = open[parent];
      index = parent;
    }
    open[index] = node;
  };
  const pop = () => {
    const first = open[0];
    const last = open.pop()!;
    if (open.length) {
      let index = 0;
      while (index * 2 + 1 < open.length) {
        let child = index * 2 + 1;
        if (child + 1 < open.length && open[child + 1].score < open[child].score) child++;
        if (last.score <= open[child].score) break;
        open[index] = open[child];
        index = child;
      }
      open[index] = last;
    }
    return first;
  };
  const costs = new Map<string, number>();
  const previous = new Map<string, GridTile>();
  for (const start of starts) {
    if (!walkable(start) || costs.has(key(start))) continue;
    costs.set(key(start), 0);
    push({ tile: start, cost: 0, score: distance(start) });
  }
  while (open.length) {
    const current = pop();
    const currentKey = key(current.tile);
    if (current.cost !== costs.get(currentKey)) continue;
    if (goalKeys.has(currentKey)) {
      const path = [current.tile];
      while (previous.has(key(path[0]))) path.unshift(previous.get(key(path[0]))!);
      return path;
    }
    for (const [dx, dz] of [[1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [-1, 1], [-1, -1], [1, -1]]) {
      const next = { x: current.tile.x + dx, z: current.tile.z + dz };
      const nextKey = key(next);
      const cost = current.cost + (dx && dz ? Math.SQRT2 : 1);
      if (!walkable(next) || (dx && dz && (!walkable({ x: current.tile.x + dx, z: current.tile.z }) || !walkable({ x: current.tile.x, z: current.tile.z + dz }))) || !canStep(current.tile, next) || cost >= (costs.get(nextKey) ?? Infinity)) continue;
      costs.set(nextKey, cost);
      previous.set(nextKey, current.tile);
      push({ tile: next, cost, score: cost + distance(next) });
    }
  }
  return null;
}

function segmentIntersectsBounds(start: GridTile, end: GridTile, bounds: WalkBounds, radius: number): boolean {
  let enter = 0;
  let exit = 1;
  for (const [origin, direction, min, max] of [
    [start.x, end.x - start.x, bounds.minX - radius, bounds.maxX + radius],
    [start.z, end.z - start.z, bounds.minZ - radius, bounds.maxZ + radius],
  ]) {
    if (direction === 0) {
      if (origin < min || origin > max) return false;
    } else {
      const a = (min - origin) / direction;
      const b = (max - origin) / direction;
      enter = Math.max(enter, Math.min(a, b));
      exit = Math.min(exit, Math.max(a, b));
    }
  }
  return enter <= exit;
}

export function walkSegmentClearOfBounds(start: GridTile, end: GridTile, radius: number, bounds: readonly WalkBounds[]): boolean {
  return !bounds.some((box) => segmentIntersectsBounds(start, end, box, radius));
}

export function walkSegmentClear(start: GridTile, end: GridTile, radius: number, walkable: (tile: GridTile) => boolean, tileSize = GRID_TILE_SIZE): boolean {
  const minX = Math.floor((Math.min(start.x, end.x) - radius) / tileSize);
  const maxX = Math.floor((Math.max(start.x, end.x) + radius) / tileSize);
  const minZ = Math.floor((Math.min(start.z, end.z) - radius) / tileSize);
  const maxZ = Math.floor((Math.max(start.z, end.z) + radius) / tileSize);
  for (let x = minX; x <= maxX; x++) {
    for (let z = minZ; z <= maxZ; z++) {
      if (walkable({ x, z })) continue;
      if (segmentIntersectsBounds(start, end, {
        minX: x * tileSize, maxX: (x + 1) * tileSize,
        minZ: z * tileSize, maxZ: (z + 1) * tileSize,
      }, radius)) return false;
    }
  }
  return true;
}

export function avoidResidents(start: GridTile, end: GridTile, others: GridTile[], separation: number): number {
  const dx = end.x - start.x;
  const dz = end.z - start.z;
  const distanceSquared = dx * dx + dz * dz;
  if (distanceSquared === 0) return 1;
  let fraction = 1;
  for (const other of others) {
    const ox = start.x - other.x;
    const oz = start.z - other.z;
    const projection = ox * dx + oz * dz;
    const clearance = ox * ox + oz * oz - separation * separation;
    if (clearance <= 0) {
      if (projection < 0) fraction = 0;
      continue;
    }
    const discriminant = projection * projection - distanceSquared * clearance;
    if (projection >= 0 || discriminant <= 0) continue;
    const hit = (-projection - Math.sqrt(discriminant)) / distanceSquared;
    if (hit >= 0 && hit <= fraction) fraction = Math.max(0, hit - 0.001 / Math.sqrt(distanceSquared));
  }
  return fraction;
}

export function residentStep(
  start: GridTile, target: GridTile, distance: number, others: GridTile[],
  clear: (start: GridTile, end: GridTile) => boolean,
): GridTile {
  const dx = target.x - start.x;
  const dz = target.z - start.z;
  const length = Math.hypot(dx, dz);
  if (length === 0 || distance === 0) return start;
  const forward = { x: dx / length, z: dz / length };
  const right = { x: forward.z, z: -forward.x };
  let bias = 0;
  for (const other of others) {
    const ox = other.x - start.x;
    const oz = other.z - start.z;
    const ahead = ox * forward.x + oz * forward.z;
    const side = Math.abs(ox * right.x + oz * right.z);
    if (ahead > 0 && ahead < 5 && side < 2) {
      bias = Math.max(bias, 2 * (1 - ahead / 5) * (1 - side / 2));
    }
  }
  const options = bias > 0 ? [bias, 1.5, 3, 0, -0.75, -1.5, -3] : [0, 1, 2, -1, -2];
  let best = start;
  let bestDistance = 0;
  for (const side of options) {
    const vx = forward.x + right.x * side;
    const vz = forward.z + right.z * side;
    const magnitude = Math.hypot(vx, vz);
    const end = { x: start.x + vx / magnitude * distance, z: start.z + vz / magnitude * distance };
    const fraction = avoidResidents(start, end, others, 1.3);
    const safe = { x: start.x + (end.x - start.x) * fraction, z: start.z + (end.z - start.z) * fraction };
    if (!clear(start, safe)) continue;
    if (fraction >= 0.999) return safe;
    if (fraction > bestDistance) {
      best = safe;
      bestDistance = fraction;
    }
  }
  return best;
}

export function footprintAt(x: number, z: number, sizeX: number, sizeZ: number): GridFootprint {
  if (!Number.isInteger(sizeX) || !Number.isInteger(sizeZ) || sizeX < 1 || sizeZ < 1) throw new Error("Footprints must cover whole tiles.");
  return {
    minX: Math.floor(x / GRID_TILE_SIZE) - Math.floor(sizeX / 2),
    minZ: Math.floor(z / GRID_TILE_SIZE) - Math.floor(sizeZ / 2),
    sizeX,
    sizeZ,
  };
}

export function footprintCenter(footprint: GridFootprint) {
  return {
    x: (footprint.minX + footprint.sizeX / 2) * GRID_TILE_SIZE,
    z: (footprint.minZ + footprint.sizeZ / 2) * GRID_TILE_SIZE,
  };
}

export function footprintsOverlap(a: GridFootprint, b: GridFootprint): boolean {
  return a.minX < b.minX + b.sizeX && a.minX + a.sizeX > b.minX
    && a.minZ < b.minZ + b.sizeZ && a.minZ + a.sizeZ > b.minZ;
}

export function footprintIntersectsCircle(footprint: GridFootprint, x: number, z: number, radius: number): boolean {
  const minX = footprint.minX * GRID_TILE_SIZE;
  const minZ = footprint.minZ * GRID_TILE_SIZE;
  const maxX = (footprint.minX + footprint.sizeX) * GRID_TILE_SIZE;
  const maxZ = (footprint.minZ + footprint.sizeZ) * GRID_TILE_SIZE;
  const nearestX = Math.max(minX, Math.min(x, maxX));
  const nearestZ = Math.max(minZ, Math.min(z, maxZ));
  return Math.hypot(x - nearestX, z - nearestZ) < radius;
}
