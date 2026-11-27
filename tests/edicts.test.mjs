import { test } from "node:test";
import assert from "node:assert/strict";
import { buildings, GameState, buildingCost } from "../src/logic/game.ts";

function showcase() {
  const game = new GameState();
  game.initializeShowcase(buildings.map((building, index) => ({ type: building.id, x: index * 40, z: 0 })));
  return game;
}

test("edict requirements block unavailable actions and costs are charged on issue", () => {
  const game = new GameState();
  assert.match(game.issueEdict("bribe"), /bank/i);
  assert.equal(game.getSnapshot().money, 3000);

  const available = showcase();
  assert.equal(available.issueEdict("bribe"), null);
  assert.equal(available.getSnapshot().money, 2000);
  assert.equal(available.getSnapshot().activeEdicts.some((edict) => edict.id === "bribe"), true);
});

test("praise edicts share a three-year cooldown", () => {
  const game = showcase();
  const monthIndex = game.getSnapshot().year * 12 + game.getSnapshot().month - 1;
  assert.equal(game.issueEdict("praise-us"), null);
  assert.equal(game.getSnapshot().edictCooldowns.praise, monthIndex + 36);
  assert.match(game.issueEdict("praise-ussr"), /available in 3 years/i);
});

test("once-only edicts cannot be repeated", () => {
  const game = showcase();
  assert.equal(game.issueEdict("open-jails"), null);
  assert.equal(game.getSnapshot().issuedOnce["open-jails"], true);
  assert.match(game.issueEdict("open-jails"), /only be issued once/i);
});

test("toggle edicts apply modifiers and can be cancelled", () => {
  const game = showcase();
  const before = buildingCost("house", game.getSnapshot());
  assert.equal(game.issueEdict("special-building-permit"), null);
  assert.ok(buildingCost("house", game.getSnapshot()) > before);
  assert.equal(game.getSnapshot().modifiers.swissSkimRate, 0.1);
  assert.equal(game.cancelEdict("special-building-permit"), null);
  assert.equal(buildingCost("house", game.getSnapshot()), before);
  assert.equal(game.getSnapshot().modifiers.swissSkimRate, 0);
});

test("duration edicts expire and cooldown remains in force", () => {
  const game = new GameState();
  assert.equal(game.issueEdict("tax-cut"), null);
  assert.equal(game.getSnapshot().modifiers.approvalModifier, 8);
  for (let month = 0; month < 12; month++) game.advanceMonth();
  assert.equal(game.getSnapshot().activeEdicts.some((edict) => edict.id === "tax-cut"), false);
  assert.equal(game.getSnapshot().modifiers.approvalModifier, 0);
  assert.match(game.issueEdict("tax-cut"), /available in 2 years/i);
});


test("development aid permanently halves its eligible construction costs", () => {
  const game = showcase();
  const before = buildingCost("airport", game.getSnapshot());
  assert.equal(game.issueEdict("us-aid"), null);
  assert.ok(buildingCost("airport", game.getSnapshot()) <= Math.ceil(before / 2));
  assert.equal(game.getSnapshot().activeEdicts.some((edict) => edict.id === "us-aid"), true);
});


test("Prohibition closes affected buildings until the toggle is cancelled", () => {
  const game = showcase();
  const pub = game.getSnapshot().placed.findIndex((building) => building.type === "pub");
  assert.ok(game.getSnapshot().buildingStaffing[pub] > 0);
  assert.equal(game.issueEdict("prohibition"), null);
  assert.equal(game.getSnapshot().buildingStaffing[pub], 0);
  assert.equal(game.getSnapshot().modifiers.crimeMultiplier, 2);
  assert.equal(game.cancelEdict("prohibition"), null);
  assert.ok(game.getSnapshot().buildingStaffing[pub] > 0);
});
