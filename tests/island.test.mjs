import { test } from "node:test";
import assert from "node:assert/strict";
import { buildings, GameState, starterBuildings, buildingCost } from "../src/logic/game.ts";
import { relationLabel, atLeast } from "../src/logic/island.ts";

function showcase() {
  const game = new GameState();
  game.initializeShowcase(buildings.map((item, index) => ({ type: item.id, x: index * 40, z: 0 })));
  return game;
}

test("legacy-only islands keep approval, balance, food, and population growth unchanged", () => {
  const game = new GameState();
  game.initializeIsland(starterBuildings.map((type, index) => ({ type, x: index * 30, z: 0 })));
  for (let i = 0; i < 4; i++) game.addShack(i * 12, 30);
  const before = game.getSnapshot();
  assert.equal(before.approval, 85);
  assert.equal(before.balance, 250);
  assert.equal(before.food, 16);
  assert.equal(before.ratings.health, 0);
  assert.equal(before.tourists, 0);
  game.advanceMonth();
  assert.equal(game.getSnapshot().population, 8);
});

test("farms feed value-added production chains and report processed goods", () => {
  const game = showcase();
  const farm = game.getSnapshot().placed.findIndex((building) => building.type === "farm");
  const distillery = game.getSnapshot().placed.findIndex((building) => building.type === "rum-distillery");
  game.setBuildingCrop(farm, "sugar");
  const state = game.getSnapshot();
  assert.ok(state.goods.sugar.produced > 0);
  assert.ok(state.goods.sugar.processed > 0);
  assert.ok(state.buildingIncome[distillery] > 0);
});

test("mine resource selection updates exports and jewelry inputs without changing other mines", () => {
  const game = showcase();
  const mine = game.getSnapshot().placed.findIndex((building) => building.type === "mine");
  const jewelry = game.getSnapshot().placed.findIndex((building) => building.type === "jewelry-factory");
  const gold = game.getSnapshot();
  assert.ok(gold.goods.gold.produced > 0);
  assert.ok(gold.goods.gold.processed > 0);
  assert.ok(gold.buildingIncome[jewelry] > 0);

  game.setBuildingMineResource(mine, "iron");
  const iron = game.getSnapshot();
  assert.equal(iron.goods.gold.produced, 0);
  assert.equal(iron.goods.gold.processed, 0);
  assert.equal(iron.goods.iron.produced, gold.goods.gold.produced);
  assert.equal(iron.buildingIncome[jewelry], 0);
  assert.ok(Math.abs(iron.buildingIncome[mine] / gold.buildingIncome[mine] - 160 / 260) < 1e-10);

  game.setBuildingMineResource(mine, "bauxite");
  const bauxite = game.getSnapshot();
  assert.equal(bauxite.goods.iron.produced, 0);
  assert.equal(bauxite.goods.bauxite.produced, gold.goods.gold.produced);
  assert.ok(Math.abs(bauxite.buildingIncome[mine] / gold.buildingIncome[mine] - 200 / 260) < 1e-10);
  game.setBuildingMineResource(mine, "gold");
  assert.equal(game.getSnapshot().buildingIncome[jewelry], gold.buildingIncome[jewelry]);
  assert.throws(() => game.setBuildingMineResource(mine, "copper"), /Invalid mine resource/);
  assert.throws(() => game.setBuildingMineResource(jewelry, "gold"), /non-mine/);
});

test("mines keep independent resource choices", () => {
  const game = new GameState();
  game.setSimulationModifiers({ monthlyIncome: 10000 });
  game.advanceMonth();
  assert.equal(game.place("mine", 0, 0), true);
  assert.equal(game.place("mine", 40, 0), true);
  game.setBuildingMineResource(1, "bauxite");
  const state = game.getSnapshot();
  assert.equal(state.placed[0].mineResource, undefined);
  assert.equal(state.placed[1].mineResource, "bauxite");
  assert.ok(state.goods.gold.produced > 0);
  assert.equal(state.goods.gold.produced, state.goods.bauxite.produced);
  game.advanceMonth();
  assert.equal(game.getSnapshot().money, state.money + state.balance);
});

test("power plant radius and connected substations extend coverage", () => {
  const game = new GameState();
  const placed = buildings.map((item, index) => ({ type: item.id, x: index * 40, z: 0 }));
  const index = (type) => placed.findIndex((building) => building.type === type);
  placed[index("electric-power-plant")].x = 0;
  placed[index("electric-substation")].x = 80;
  placed[index("hotel")].x = 96;
  placed[index("hospital")].x = 120;
  placed[index("tv-station")].x = 164;
  game.initializeShowcase(placed);
  const state = game.getSnapshot();
  assert.equal(state.powered[index("hotel")], true);
  assert.equal(state.powered[index("hospital")], true);
  assert.equal(state.powered[index("tv-station")], false);
});

test("tourist beds produce no visitors without a staffed gateway", () => {
  const game = new GameState();
  assert.equal(game.place("bungalow", 0, 0), true);
  assert.equal(game.getSnapshot().tourists, 0);
  assert.equal(game.place("dock", 40, 0), true);
  assert.ok(game.getSnapshot().tourists > 0);
  assert.ok(game.getSnapshot().tourismIncome > 0);
});

test("staffed schools graduate residents and colleges promote graduates", () => {
  const game = showcase();
  const beforeState = game.getSnapshot();
  const hospitalIndex = beforeState.placed.findIndex((building) => building.type === "hospital");
  assert.ok(beforeState.buildingStaffing[hospitalIndex] < beforeState.population / beforeState.jobs);
  const before = beforeState.educated;
  game.advanceMonth();
  const after = game.getSnapshot().educated;
  assert.ok(after.highSchool + after.college > before.highSchool + before.college);
  assert.ok(after.highSchool + after.college <= game.getSnapshot().population);
});

test("elections can be won or lost and forced election hooks are one-shot", () => {
  const winner = new GameState();
  winner.initializeIsland(starterBuildings.map((type, index) => ({ type, x: index * 30, z: 0 })));
  for (let i = 0; i < 4; i++) winner.addShack(i * 12, 30);
  winner.setSimulationModifiers({ electionTrigger: true });
  winner.advanceMonth();
  assert.equal(winner.getSnapshot().gameOver, null);
  assert.match(winner.getSnapshot().notice, /Election won/);
  assert.equal(winner.getSnapshot().modifiers.electionTrigger, false);

  const loser = new GameState();
  loser.initializeIsland(starterBuildings.map((type, index) => ({ type, x: index * 30, z: 0 })));
  loser.setSimulationModifiers({ electionTrigger: true, approvalModifier: -100 });
  loser.advanceMonth();
  assert.match(loser.getSnapshot().gameOver, /lost the election/);
  assert.equal(loser.getSnapshot().paused, true);
});

test("superpowers drift and hostile relations trigger invasion", () => {
  const drifting = new GameState();
  drifting.advanceMonth();
  assert.notEqual(drifting.getSnapshot().superpowers.us, 50);

  const invaded = new GameState();
  invaded.setSimulationModifiers({ superpowerAdjustments: { us: -50 } });
  invaded.advanceMonth();
  assert.match(invaded.getSnapshot().gameOver, /invaded/);
  assert.equal(invaded.getSnapshot().paused, true);
});

test("construction offices discount placement costs and prerequisites are enforced", () => {
  const game = new GameState();
  assert.equal(game.place("construction-office", 0, 0), true);
  assert.equal(buildingCost("house", game.getSnapshot()), 380);
  assert.equal(game.place("house", 40, 0), true);
  assert.equal(game.getSnapshot().money, 1620);

  const blocked = new GameState();
  assert.equal(blocked.place("hospital", 0, 0), false);
  assert.match(blocked.getSnapshot().notice, /Requires a Clinic/);
  assert.equal(blocked.place("beach-site", 20, 0), false);
  assert.match(blocked.getSnapshot().notice, /Requires a hotel/);
});

test("relations use the documented label thresholds", () => {
  assert.equal(relationLabel(14), "Hostile");
  assert.equal(relationLabel(15), "Cold");
  assert.equal(relationLabel(56), "Cordial");
  assert.equal(relationLabel(85), "Allied");
  assert.equal(atLeast(56, "Cordial"), true);
  assert.equal(atLeast(55, "Cordial"), false);
});
