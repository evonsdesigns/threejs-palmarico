import { test } from "node:test";
import assert from "node:assert/strict";
import { buildingFootprint, GameState, planResidents, starterBuildings } from "../src/logic/game.ts";

test("the starting settlement adds housing and production without construction charges", () => {
  const game = new GameState();
  const placed = starterBuildings.map((type, index) => ({ type, x: index * 30, z: 0 }));
  game.initializeIsland(placed);
  for (let i = 0; i < 4; i++) assert.equal(game.addShack(i * 12, 30), true);
  const state = game.getSnapshot();
  assert.deepEqual(state.placed.map((item) => item.type), ["palace", "farm", "shack", "shack", "shack", "shack"]);
  assert.equal(state.money, 3000);
  assert.equal(state.housing, state.population);
  assert.equal(state.food, 16);
  assert.equal(state.jobs, 4);
  assert.equal(state.approval, 85);
  assert.equal(game.place("palace", 200, 0), false);
  assert.equal(game.place("shack", 200, 0), false);
  assert.equal(game.addShack(200, 0), false);
  assert.throws(() => game.initializeIsland(placed), /already been initialized/);
});

test("construction charges the treasury and rejects unaffordable buildings", () => {
  const game = new GameState();
  assert.equal(game.place("house", 0, 0), true);
  assert.equal(game.getSnapshot().money, 2600);
  assert.equal(game.getSnapshot().housing, 8);
  for (let i = 0; i < 2; i++) game.place("farm", i * 20, 0);
  assert.equal(game.getSnapshot().money, 600);
  assert.equal(game.place("farm", 100, 0), false);
  assert.equal(game.getSnapshot().placed.length, 3);
  assert.match(game.getSnapshot().notice, /Not enough/);
});

test("monthly simulation supports growth, income, pause, and year rollover", () => {
  const game = new GameState();
  game.place("house", 0, 0);
  game.place("house", 20, 0);
  game.place("farm", 40, 0);
  game.place("market", 60, 0);
  game.place("market", 80, 0);
  const before = game.getSnapshot();
  assert.equal(before.food, 10);
  assert.equal(before.approval, 85);
  game.togglePause();
  game.advanceMonth();
  assert.equal(game.getSnapshot().month, 1);
  assert.equal(game.getSnapshot().money, before.money);
  game.togglePause();
  game.advanceMonth();
  assert.equal(game.getSnapshot().population, 9);
  assert.equal(game.getSnapshot().money, before.money + before.balance);
  for (let i = 0; i < 11; i++) game.advanceMonth();
  assert.equal(game.getSnapshot().year, 1951);
  assert.equal(game.getSnapshot().month, 1);
  assert.equal(game.getSnapshot().population, 12);
});

test("speed controls scale elapsed simulation time while preserving pause and partial months", () => {
  const game = new GameState();
  assert.equal(game.getSnapshot().speed, 1);
  assert.equal(game.advanceTime(0.5), 0.5);
  game.setSpeed(2);
  assert.equal(game.advanceTime(2.25), 4.5);
  assert.equal(game.getSnapshot().month, 2);
  game.togglePause();
  game.setSpeed(5);
  assert.equal(game.advanceTime(10), 0);
  assert.equal(game.getSnapshot().month, 2);
  game.togglePause();
  assert.equal(game.advanceTime(2), 10);
  assert.equal(game.getSnapshot().month, 4);
  assert.throws(() => game.setSpeed(0), /Invalid game speed/);
  assert.throws(() => game.advanceTime(-1), /Invalid elapsed time/);
});

test("residents leave when their needs are neglected", () => {
  const game = new GameState();
  game.advanceMonth();
  assert.equal(game.getSnapshot().population, 7);
});

test("new buildings charge the treasury and contribute their intended capacities", () => {
  const cases = [
    ["apartment", 1200, 24, 0, 0],
    ["tenement", 800, 32, 0, 0],
    ["condominium", 1600, 16, 0, 0],
    ["luxury-house", 1000, 4, 0, 0],
    ["bunkhouse", 300, 12, 0, 0],
    ["country-house", 250, 4, 0, 0],
    ["ranch", 650, 0, 12, 4],
    ["bungalow", 300, 0, 0, 0],
    ["pub", 800, 0, 0, 2],
    ["restaurant", 2000, 0, 0, 2],
    ["teamsters-office", 2000, 0, 0, 8],
  ];
  for (const [type, cost, housing, food, jobs] of cases) {
    const game = new GameState();
    assert.equal(game.place(type, 0, 0), true);
    const state = game.getSnapshot();
    assert.equal(state.money, 3000 - cost, type);
    assert.equal(state.housing, housing, type);
    assert.equal(state.food, food, type);
    assert.equal(state.jobs, jobs, type);
    assert.equal(state.slushFund, 0, type);
  }
});

test("farms and pubs retain their chosen settings when later selections change", () => {
  const game = new GameState();
  game.selectFarmCrop("tobacco");
  assert.equal(game.place("farm", 0, 0), true);
  game.selectFarmCrop("coffee");
  assert.equal(game.place("farm", 40, 0), true);
  game.selectPubDressCode("upscale");
  assert.equal(game.place("pub", 80, 0), true);
  game.selectFarmCrop("corn");
  game.selectPubDressCode("none");
  const state = game.getSnapshot();
  assert.deepEqual(state.placed.map((building) => building.crop ?? building.dressCode), ["tobacco", "coffee", "upscale"]);
  assert.equal(state.money, 200);
  assert.equal(state.jobs, 10);
  assert.equal(state.balance, 100 + Math.round((320 + 300) * 0.8 - 30 * 2 - 25) + 4 * 15);
});

test("crop choices change food and income immediately and scale with staffing", () => {
  const game = new GameState();
  game.place("farm", 0, 0);
  game.place("farm", 40, 0);
  game.place("pub", 80, 0);
  const before = game.getSnapshot();
  assert.equal(before.food, 25);
  game.setBuildingCrop(0, "tobacco");
  let state = game.getSnapshot();
  assert.equal(state.food, 12);
  assert.equal(state.balance, 100 + Math.round((320 + 180) * 0.8 - 30 * 2 - 25) + 6 * 15);
  assert.equal(state.placed[1].crop, "corn");
  game.advanceMonth();
  assert.equal(game.getSnapshot().money, before.money + state.balance);
  game.setBuildingCrop(0, "corn");
  state = game.getSnapshot();
  assert.equal(state.food, 25);
  assert.equal(state.balance, before.balance);
});

test("pubs share resident demand, respect dress codes and earn visitor charges", () => {
  const game = new GameState();
  game.place("pub", 0, 0);
  game.selectPubDressCode("upscale");
  game.place("pub", 40, 0);
  game.place("pub", 80, 0);
  let state = game.getSnapshot();
  assert.deepEqual(state.pubVisitors, [4, 4, 0]);
  assert.equal(state.pubStaffedCapacity, 8);
  assert.equal(state.balance, 100 + 8 * 15 - 3 * 25);
  game.setBuildingDressCode(0, "upscale");
  state = game.getSnapshot();
  assert.deepEqual(state.pubVisitors, [4, 0, 0]);
  assert.equal(state.balance, 100 + 4 * 15 - 3 * 25);
  game.advanceMonth();
  assert.equal(game.getSnapshot().money, state.money + state.balance);
});

test("pub visitor capacity falls with staffing and no residents means no revenue", () => {
  const game = new GameState();
  game.place("farm", 0, 0);
  game.place("farm", 40, 0);
  game.place("pub", 80, 0);
  assert.equal(game.getSnapshot().pubStaffedCapacity, 6);
  assert.equal(game.getSnapshot().pubVisitors[2], 6);

  const empty = new GameState();
  for (let i = 0; i < 8; i++) empty.advanceMonth();
  assert.equal(empty.getSnapshot().population, 0);
  empty.place("pub", 0, 0);
  assert.equal(empty.getSnapshot().pubStaffedCapacity, 0);
  assert.equal(empty.getSnapshot().pubVisitors[0], 0);
  assert.equal(empty.getSnapshot().balance, 100 - 25);
});

test("resident routines assign housing and jobs within capacity and respect pub dress codes", () => {
  const placed = [
    { type: "palace", x: 0, z: 0 },
    { type: "shack", x: 20, z: 0 },
    { type: "house", x: 40, z: 0 },
    { type: "farm", x: 60, z: 0 },
    { type: "pub", x: 80, z: 0, dressCode: "upscale" },
  ];
  const plans = planResidents(placed, 10);
  assert.equal(plans.length, 10);
  assert.equal(plans.filter((plan) => plan.home === 2).length, 8);
  assert.equal(plans.filter((plan) => plan.home === 1).length, 2);
  assert.equal(plans.filter((plan) => plan.work === 3).length, 4);
  assert.equal(plans.filter((plan) => plan.work === 4).length, 2);
  assert.equal(plans.filter((plan) => plan.work === null).length, 4);
  assert.equal(plans.filter((plan) => plan.service === 4).length, 5);
  placed[4].dressCode = "none";
  assert.equal(planResidents(placed, 10).filter((plan) => plan.service === 4).length, 10);
  assert.deepEqual(planResidents([], 0), []);
});

test("restaurant table settings change upkeep and quality, and diners prefer better restaurants", () => {
  const game = new GameState();
  game.place("house", 0, 0);
  game.place("farm", 40, 0);
  const saveForRestaurant = () => { while (game.getSnapshot().money < 2000) game.advanceMonth(); };
  saveForRestaurant();
  game.selectRestaurantTableSetting("paper");
  assert.equal(game.place("restaurant", 80, 0), true);
  saveForRestaurant();
  game.selectRestaurantTableSetting("linen");
  assert.equal(game.place("restaurant", 120, 0), true);
  let state = game.getSnapshot();
  assert.equal(state.population, 8);
  assert.deepEqual(state.placed.map((building) => building.tableSetting), [undefined, undefined, "paper", "linen"]);
  assert.deepEqual(state.restaurantVisitors, [0, 0, 0, 8]);
  assert.equal(state.restaurantStaffedCapacity, 10);
  assert.equal(state.balance, 100 + 180 - 30 - 10 - 20 - 60 + 8 * 20);
  assert.ok(planResidents(state.placed, 8).every((plan) => plan.service === 2 || plan.service === 3));

  game.setBuildingTableSetting(3, "paper");
  state = game.getSnapshot();
  assert.deepEqual(state.restaurantVisitors, [0, 0, 8, 0]);
  assert.equal(state.balance, 100 + 180 - 30 - 10 - 20 - 20 + 8 * 20);
  game.setBuildingTableSetting(2, "cloth");
  assert.equal(game.getSnapshot().balance, 100 + 180 - 30 - 10 - 40 - 20 + 8 * 20);
  assert.throws(() => game.setBuildingTableSetting(0, "linen"), /non-restaurant/);
});

test("placed buildings keep their rotation and occupy their rotated tile footprints", () => {
  const game = new GameState();
  game.rotatePlacement(1);
  assert.equal(game.place("house", 0, 0), true);
  game.rotatePlacement(-1);
  assert.equal(game.place("house", 40, 0), true);
  const [rotated, upright] = game.getSnapshot().placed;
  assert.equal(rotated.rotation, 1);
  assert.equal(upright.rotation, 0);
  assert.deepEqual(buildingFootprint(rotated), { minX: -1, minZ: -1, sizeX: 3, sizeZ: 2 });
  assert.deepEqual(buildingFootprint(upright), { minX: 9, minZ: -1, sizeX: 2, sizeZ: 3 });
  game.rotatePlacement(-1);
  assert.equal(game.getSnapshot().placementRotation, 3);
});

test("teamster work hours trade farm and ranch hauling against approval", () => {
  const game = new GameState();
  game.place("farm", 0, 0);
  game.place("teamsters-office", 40, 0);
  let state = game.getSnapshot();
  assert.equal(state.placed[1].workMode, "normal");
  assert.equal(state.balance, 100 + 158 - 100);
  assert.equal(state.approval, 55);
  game.setBuildingWorkMode(1, "sweatshop");
  state = game.getSnapshot();
  assert.ok(Math.abs(state.haulingBonus - 0.1) < 1e-9);
  assert.equal(state.balance, 162);
  assert.equal(state.approval, 52);
  game.setBuildingWorkMode(1, "easy");
  state = game.getSnapshot();
  assert.equal(state.balance, 156);
  assert.equal(state.approval, 57);
  assert.throws(() => game.setBuildingWorkMode(0, "easy"), /non-teamster/);
});

test("inspecting buildings allows changing only the selected farm or pub", () => {
  const game = new GameState();
  game.place("farm", 0, 0);
  game.place("farm", 40, 0);
  game.place("pub", 80, 0);
  game.inspectBuilding(0);
  game.setBuildingCrop(0, "bananas");
  game.setBuildingDressCode(2, "upscale");
  assert.deepEqual(game.getSnapshot().placed.map((building) => building.crop ?? building.dressCode), ["bananas", "corn", "upscale"]);
  assert.equal(game.getSnapshot().inspectedBuilding, 0);
  assert.throws(() => game.setBuildingCrop(2, "corn"), /non-farm/);
  assert.throws(() => game.setBuildingDressCode(0, "none"), /non-pub/);
  assert.throws(() => game.inspectBuilding(10), /missing/);
  game.select("house");
  assert.equal(game.getSnapshot().inspectedBuilding, null);
});
