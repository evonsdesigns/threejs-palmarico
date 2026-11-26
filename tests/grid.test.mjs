import { test } from "node:test";
import assert from "node:assert/strict";
import { avoidResidents, findWalkPath, findWalkPathFromStarts, footprintAt, footprintCenter, footprintIntersectsCircle, footprintsOverlap, residentStep, rotatedTiles, walkSegmentClear, walkSegmentClearOfBounds } from "../src/logic/grid.ts";

test("footprints snap to whole tiles on both sides of the origin", () => {
  const odd = footprintAt(-0.1, 0.1, 3, 3);
  assert.deepEqual(odd, { minX: -2, minZ: -1, sizeX: 3, sizeZ: 3 });
  assert.deepEqual(footprintCenter(odd), { x: -2, z: 2 });
  assert.deepEqual(footprintAt(-2, 2, 3, 3), odd);
  const even = footprintAt(0.1, -0.1, 4, 4);
  assert.deepEqual(even, { minX: -2, minZ: -3, sizeX: 4, sizeZ: 4 });
  assert.deepEqual(footprintCenter(even), { x: 0, z: -4 });
  assert.deepEqual(footprintAt(0, -4, 4, 4), even);
});

test("rectangular footprints swap width and length when rotated a quarter turn", () => {
  assert.deepEqual(rotatedTiles([3, 2], 0), [3, 2]);
  assert.deepEqual(rotatedTiles([3, 2], 1), [2, 3]);
  assert.deepEqual(rotatedTiles([3, 2], 2), [3, 2]);
  assert.deepEqual(rotatedTiles([3, 2], 3), [2, 3]);
  const wide = footprintAt(0, 0, 3, 2);
  assert.deepEqual(wide, { minX: -1, minZ: -1, sizeX: 3, sizeZ: 2 });
  assert.deepEqual(footprintCenter(wide), { x: 2, z: 0 });
  assert.deepEqual(footprintAt(2, 0, 3, 2), wide);
  assert.equal(footprintsOverlap(wide, footprintAt(14, 0, 2, 3)), false);
  assert.equal(footprintsOverlap(wide, footprintAt(6, 0, 2, 3)), true);
  assert.throws(() => footprintAt(0, 0, 1.5, 2), /whole tiles/);
});

test("footprints can share edges but not tiles", () => {
  const a = { minX: -2, minZ: 0, sizeX: 3, sizeZ: 3 };
  assert.equal(footprintsOverlap(a, { minX: 1, minZ: 0, sizeX: 2, sizeZ: 2 }), false);
  assert.equal(footprintsOverlap(a, { minX: 0, minZ: 2, sizeX: 2, sizeZ: 2 }), true);
  assert.equal(footprintsOverlap(a, { minX: 0, minZ: 3, sizeX: 2, sizeZ: 2 }), false);
});

test("trees obstruct the tiles they intersect, including at a corner", () => {
  const footprint = { minX: 0, minZ: 0, sizeX: 2, sizeZ: 2 };
  assert.equal(footprintIntersectsCircle(footprint, 4, 4, 2), true);
  assert.equal(footprintIntersectsCircle(footprint, 9, 9, 2), true);
  assert.equal(footprintIntersectsCircle(footprint, 10, 10, 2), false);
});

test("walking paths go around blocked tiles to a reachable entrance", () => {
  const blocked = new Set(["1,0", "1,1"]);
  const walkable = ({ x, z }) => x >= 0 && x <= 3 && z >= 0 && z <= 3 && !blocked.has(`${x},${z}`);
  const path = findWalkPath({ x: 0, z: 0 }, [{ x: 2, z: 0 }], walkable);
  assert.ok(path);
  assert.deepEqual(path[0], { x: 0, z: 0 });
  assert.deepEqual(path.at(-1), { x: 2, z: 0 });
  assert.ok(path.every(walkable));
  assert.ok(path.every((tile, i) => i === 0 || Math.abs(tile.x - path[i - 1].x) + Math.abs(tile.z - path[i - 1].z) === 1));
  assert.equal(path.length, 7);
});

test("walking paths reject blocked or unreachable starts and destinations", () => {
  const walkable = ({ x, z }) => x >= 0 && x <= 2 && z >= 0 && z <= 2 && x !== 1;
  assert.equal(findWalkPath({ x: 1, z: 0 }, [{ x: 0, z: 0 }], walkable), null);
  assert.equal(findWalkPath({ x: 0, z: 0 }, [{ x: 2, z: 0 }], walkable), null);
  assert.equal(findWalkPath({ x: 0, z: 0 }, [], walkable), null);
});

test("walking paths can start from an accessible nearby point", () => {
  const walkable = ({ x, z }) => x >= 0 && x <= 3 && z >= 0 && z <= 2 && !(x === 1 && z === 1);
  const path = findWalkPathFromStarts([{ x: 1, z: 1 }, { x: 0, z: 1 }], [{ x: 3, z: 1 }], walkable);
  assert.ok(path);
  assert.deepEqual(path[0], { x: 0, z: 1 });
  assert.deepEqual(path.at(-1), { x: 3, z: 1 });
});

test("walking paths take diagonals in open ground without cutting building corners", () => {
  const bounds = ({ x, z }) => x >= 0 && x <= 2 && z >= 0 && z <= 2;
  assert.deepEqual(findWalkPath({ x: 0, z: 0 }, [{ x: 2, z: 2 }], bounds), [
    { x: 0, z: 0 }, { x: 1, z: 1 }, { x: 2, z: 2 },
  ]);
  const blockedCorner = (tile) => bounds(tile) && !(tile.x === 1 && tile.z === 0);
  const path = findWalkPath({ x: 0, z: 0 }, [{ x: 1, z: 1 }], blockedCorner);
  assert.deepEqual(path, [{ x: 0, z: 0 }, { x: 0, z: 1 }, { x: 1, z: 1 }]);
});

test("direct walking shortcuts respect clearance from blocked tiles", () => {
  const walkable = ({ x, z }) => !(x === 1 && z === 0);
  assert.equal(walkSegmentClear({ x: 2, z: 2 }, { x: 10, z: 2 }, 0.6, walkable), false);
  assert.equal(walkSegmentClear({ x: 2, z: 6 }, { x: 10, z: 6 }, 0.6, walkable), true);
  assert.equal(walkSegmentClear({ x: 2, z: 6 }, { x: 6, z: 2 }, 0.6, walkable), false);
});

test("residents can route through the open gap between adjacent building footprints", () => {
  const buildings = [
    { minX: -2.7, maxX: 2.7, minZ: -2.25, maxZ: 2.35 },
    { minX: -2.7, maxX: 2.7, minZ: 5.75, maxZ: 10.35 },
  ];
  const center = ({ x, z }) => ({ x: (x + 0.5) * 2, z: (z + 0.5) * 2 });
  const walkable = (tile) => Math.abs(tile.x) <= 5 && tile.z >= -2 && tile.z <= 6
    && walkSegmentClearOfBounds(center(tile), center(tile), 0.6, buildings);
  const canStep = (from, to) => walkSegmentClearOfBounds(center(from), center(to), 0.6, buildings);
  const path = findWalkPath({ x: -4, z: 1 }, [{ x: 3, z: 1 }], walkable, canStep);
  assert.ok(path);
  assert.ok(path.every((tile) => tile.z === 1));
  assert.ok(path.slice(1).every((tile, index) => canStep(path[index], tile)));
  assert.equal(walkSegmentClearOfBounds({ x: -5, z: 1 }, { x: 5, z: 1 }, 0.6, buildings), false);
  assert.equal(walkSegmentClearOfBounds({ x: -5, z: 4 }, { x: 5, z: 4 }, 0.6, buildings), true);
});

test("building clearance rejects a gap too narrow for a resident", () => {
  const buildings = [
    { minX: 0, maxX: 4, minZ: 0, maxZ: 3.5 },
    { minX: 0, maxX: 4, minZ: 4.5, maxZ: 8 },
  ];
  assert.equal(walkSegmentClearOfBounds({ x: -2, z: 4 }, { x: 6, z: 4 }, 0.6, buildings), false);
});

test("resident movement cannot cross another person, including at high speed", () => {
  const start = { x: 0, z: 0 };
  const end = { x: 10, z: 0 };
  const fraction = avoidResidents(start, end, [{ x: 5, z: 0 }], 1.3);
  assert.ok(fraction > 0 && fraction < 0.37);
  assert.equal(avoidResidents(start, end, [{ x: 5, z: 2 }], 1.3), 1);
  assert.equal(avoidResidents({ x: 0, z: 0 }, { x: -1, z: 0 }, [{ x: 1.3, z: 0 }], 1.3), 1);
});

test("residents approaching head-on pass on their right without stopping or overlapping", () => {
  let a = { x: -6, z: 0 };
  let b = { x: 6, z: 0 };
  let rightA = false;
  let rightB = false;
  for (let i = 0; i < 80 && (a.x < 5 || b.x > -5); i++) {
    const nextA = residentStep(a, { x: 8, z: 0 }, 0.2, [b], () => true);
    const nextB = residentStep(b, { x: -8, z: 0 }, 0.2, [nextA], () => true);
    assert.ok(Math.hypot(nextA.x - a.x, nextA.z - a.z) > 0.19);
    assert.ok(Math.hypot(nextB.x - b.x, nextB.z - b.z) > 0.19);
    assert.ok(Math.hypot(nextA.x - nextB.x, nextA.z - nextB.z) >= 1.3);
    rightA ||= nextA.z < -0.1;
    rightB ||= nextB.z > 0.1;
    a = nextA;
    b = nextB;
  }
  assert.ok(a.x > 5 && b.x < -5);
  assert.ok(rightA && rightB);
});
