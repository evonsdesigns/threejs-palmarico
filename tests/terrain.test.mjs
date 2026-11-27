import assert from "node:assert/strict";
import test from "node:test";
import { footprintAt } from "../src/logic/grid.ts";
import { Terrain, DRY_HEIGHT } from "../src/logic/terrain.ts";

function flat(height, size = 16) {
  const terrain = new Terrain(size);
  terrain.heights.fill(height);
  terrain.types.fill(2);
  return terrain;
}

// Land for x < 2 tiles (corner height 3), sea beyond (corner height -3).
function shore() {
  const terrain = flat(3);
  for (let cz = -8; cz <= 8; cz++) {
    for (let cx = 2; cx <= 8; cx++) terrain.heights[terrain.cornerIndex(cx, cz)] = -3;
  }
  return terrain;
}

test("generation is deterministic and makes a ringed island", () => {
  const a = Terrain.generate(7, 64);
  const b = Terrain.generate(7, 64);
  assert.deepEqual(a.heights, b.heights);
  assert.deepEqual(a.types, b.types);
  assert.equal(a.tileType(-32, -32), "water");
  assert.ok(a.heightAt(0, 0) > DRY_HEIGHT);
  assert.notDeepEqual(Terrain.generate(8, 64).heights, a.heights);
});

test("heights interpolate between tile corners on the grid", () => {
  const terrain = flat(0);
  terrain.heights[terrain.cornerIndex(1, 0)] = 4;
  assert.equal(terrain.heightAt(4, 0), 4);
  assert.equal(terrain.heightAt(0, 0), 0);
  assert.equal(terrain.heightAt(2, 0), 2);
  assert.equal(terrain.heightAt(1000, 0), null);
});

test("land buildings need dry, gradable, non-rock ground", () => {
  const terrain = flat(3);
  assert.deepEqual(terrain.evaluate(footprintAt(0, 0, 2, 2), 0, false), { height: 3, error: null });
  terrain.heights[terrain.cornerIndex(0, 0)] = 0;
  assert.match(terrain.evaluate(footprintAt(0, 0, 2, 2), 0, false).error, /dry land/);
  terrain.heights[terrain.cornerIndex(0, 0)] = 7;
  assert.match(terrain.evaluate(footprintAt(0, 0, 2, 2), 0, false).error, /steep/);
  terrain.heights[terrain.cornerIndex(0, 0)] = 3;
  terrain.setTileType(0, 0, "rock");
  assert.match(terrain.evaluate(footprintAt(0, 0, 2, 2), 0, false).error, /Rocky/);
});

test("coastal buildings keep their back on land and front in the sea", () => {
  const terrain = shore();
  // 3×4 rotated to face +x: tiles x 0..3, back half on land, front edge at the sea.
  assert.equal(terrain.evaluate(footprintAt(8, 0, 4, 3), 1, true).error, null);
  assert.match(terrain.evaluate(footprintAt(8, 0, 4, 3), 3, true).error, /shore/);
  assert.match(terrain.evaluate(footprintAt(-20, 0, 4, 3), 1, true).error, /shore/);
});

test("grading levels and locks the footprint and blends a skirt", () => {
  const terrain = flat(3);
  terrain.heights[terrain.cornerIndex(0, 0)] = 4.5;
  terrain.heights[terrain.cornerIndex(-2, 0)] = 5;
  const changes = [];
  terrain.onChange((bounds) => changes.push(bounds));
  const footprint = footprintAt(4, 4, 2, 2);
  const site = terrain.evaluate(footprint, 0, false);
  terrain.grade(footprint, site.height);
  for (let z = 0; z <= 2; z++) {
    for (let x = 0; x <= 2; x++) assert.equal(terrain.cornerHeight(x, z), site.height);
  }
  assert.ok(terrain.cornerHeight(-2, 0) < 5 && terrain.cornerHeight(-2, 0) > site.height);
  assert.equal(terrain.tileType(0, 0), "dirt");
  assert.equal(changes.length, 1);
  // A neighbour graded to another level must not disturb the locked shared edge.
  terrain.grade(footprintAt(12, 4, 2, 2), 1);
  assert.equal(terrain.cornerHeight(2, 1), site.height);
  assert.equal(terrain.evaluate(footprintAt(12, 12, 2, 2), 0, false).height, site.height);
});

test("clearing trees lets the grading skirt reach the tile but keeps pads locked", () => {
  const terrain = flat(3);
  terrain.grade(footprintAt(4, 4, 2, 2), 3);
  terrain.lockTile(-2, 0);
  terrain.lockTile(1, 0);
  terrain.unlockTile(-2, 0);
  terrain.unlockTile(1, 0);
  terrain.heights[terrain.cornerIndex(-2, 0)] = 5;
  terrain.grade(footprintAt(-20, 4, 2, 2), 3);
  assert.ok(terrain.cornerHeight(-2, 0) < 5);
  assert.equal(terrain.locked[terrain.cornerIndex(2, 0)], 2);
});

test("raycasts hit the height field", () => {
  const terrain = flat(2);
  const distance = terrain.raycast({ x: 0, y: 12, z: 0 }, { x: 0, y: -1, z: 0 });
  assert.ok(Math.abs(distance - 10) < 0.01);
  assert.equal(terrain.raycast({ x: 0, y: 12, z: 0 }, { x: 0, y: 1, z: 0 }, 50), null);
});
