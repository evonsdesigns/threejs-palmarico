import { test } from "node:test";
import assert from "node:assert/strict";
import { calculatePower } from "../src/logic/power.ts";

const building = (type, x = 0, z = 0) => ({ type, x, z });

test("staffing scales generation and facility demand without reserving load for closed buildings", () => {
  const placed = [building("electric-power-plant"), building("hospital", 40), building("casino", 48)];
  const { power, powered } = calculatePower(placed, [0.5, 0.5, 0], 0);
  assert.equal(power.generation, 50);
  assert.equal(power.demand, 7.5);
  assert.equal(power.supplied, 7.5);
  assert.equal(powered[1], true);
});

test("a grid supplies exactly its capacity and rejects an additional load", () => {
  const placed = [
    building("electric-power-plant"), building("casino", 20),
    building("hospital", 24), building("radio-station", 28), building("movie-theater", 32),
  ];
  const { power, powered } = calculatePower(placed, [0.5, 1, 1, 1, 1], 0);
  assert.equal(power.generation, 50);
  assert.equal(power.demand, 52);
  assert.equal(power.supplied, 50);
  assert.deepEqual(powered, [true, true, true, true, false]);
  assert.equal(power.coverage[4], true, "an overload is not a coverage outage");
});

test("blackouts rotate monthly, stay stable within a month, and recover when generation rises", () => {
  const placed = [building("electric-power-plant"), building("casino", 20), building("casino", 40)];
  const january = calculatePower(placed, [0.25, 1, 1], 0);
  const february = calculatePower(placed, [0.25, 1, 1], 1);
  assert.deepEqual(january.powered, [true, true, false]);
  assert.deepEqual(february.powered, [true, false, true]);
  assert.deepEqual(calculatePower(placed, [0.25, 1, 1], 0), january);
  assert.deepEqual(calculatePower(placed, [0.5, 1, 1], 1).powered, [true, true, true]);
});

test("overlapping grids pool generation, but a distant surplus cannot cover a local shortage", () => {
  const separated = [building("electric-power-plant"), building("electric-power-plant", 400), building("casino", 40)];
  const isolated = calculatePower(separated, [0.1, 1, 1], 0);
  assert.equal(isolated.power.generation, 110);
  assert.equal(isolated.power.demand, 25);
  assert.equal(isolated.powered[2], false);
  assert.equal(isolated.power.grids.length, 2);
  assert.equal(isolated.power.grids[0].generation, 10);
  const linked = calculatePower([separated[0], building("electric-power-plant", 160), separated[2]], [0.1, 1, 1], 0);
  assert.equal(linked.power.grids.length, 1);
  assert.equal(linked.powered[2], true);
  assert.equal(linked.power.supplied, 25);
});

test("substation chains carry a grid's capacity but do not create generation", () => {
  const placed = [
    building("electric-power-plant"), building("electric-substation", 136),
    building("electric-substation", 96), building("sports-complex", 176),
    building("hospital", 176.01),
  ];
  const state = calculatePower(placed, [0.2, 1, 1, 1, 1], 0);
  assert.equal(state.power.generation, 20);
  assert.equal(state.power.demand, 35);
  assert.equal(state.power.grids[0].demand, 20);
  assert.equal(state.power.supplied, 20);
  assert.deepEqual(state.powered, [true, true, true, true, false]);
  assert.equal(state.power.coverage[4], false);
  const disabled = calculatePower(placed, [0.2, 1, 0, 1, 1], 0);
  assert.equal(disabled.powered[3], false, "closing the middle relay should sever the chain");
});

test("zero generation and undersized grids never supply loads they cannot support", () => {
  const placed = [building("electric-power-plant"), building("casino", 40)];
  const stopped = calculatePower(placed, [0, 1], 0);
  assert.equal(stopped.power.generation, 0);
  assert.equal(stopped.power.supplied, 0);
  assert.equal(stopped.powered[1], false);
  for (const month of [0, 1, 2]) {
    const undersized = calculatePower(placed, [0.1, 1], month);
    assert.equal(undersized.powered[1], false);
    assert.equal(undersized.power.supplied, 0);
  }
});
