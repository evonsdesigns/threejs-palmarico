import { test } from "node:test";
import assert from "node:assert/strict";
import { GameState, starterBuildings } from "../src/logic/game.ts";

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
  assert.equal(state.jobs, 6);
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
  for (let i = 0; i < 4; i++) game.place("farm", i * 20, 0);
  assert.equal(game.getSnapshot().money, 200);
  assert.equal(game.place("farm", 100, 0), false);
  assert.equal(game.getSnapshot().placed.length, 5);
  assert.match(game.getSnapshot().notice, /Not enough/);
});

test("monthly simulation supports growth, income, pause, and year rollover", () => {
  const game = new GameState();
  game.place("house", 0, 0);
  game.place("house", 20, 0);
  game.place("farm", 40, 0);
  game.place("market", 60, 0);
  const before = game.getSnapshot();
  assert.equal(before.food, 12);
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
  assert.equal(game.getSnapshot().population, 10);
});

test("residents leave when their needs are neglected", () => {
  const game = new GameState();
  game.advanceMonth();
  assert.equal(game.getSnapshot().population, 7);
});

test("new buildings charge the treasury and contribute their intended capacities", () => {
  const cases = [
    ["apartment", 1200, 24, 0, 0],
    ["condominium", 1600, 16, 0, 0],
    ["luxury-house", 1000, 4, 0, 0],
    ["bunkhouse", 300, 12, 0, 0],
    ["country-house", 250, 4, 0, 0],
    ["ranch", 650, 0, 12, 4],
    ["bungalow", 300, 0, 0, 0],
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
