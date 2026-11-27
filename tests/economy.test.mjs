import test from "node:test";
import assert from "node:assert/strict";
import { GameState, buildings } from "../src/logic/game.ts";

test("showcase upkeep is scaled to its low staffed capacity", () => {
  const game = new GameState();
  game.initializeShowcase(buildings.map((building, index) => ({ type: building.id, x: index * 40, z: 0 })));
  const snapshot = game.getSnapshot();

  assert.equal(Number.isInteger(snapshot.balance), true);
  assert.ok(snapshot.balance > -2000, `unexpected monthly balance: ${snapshot.balance}`);
  assert.ok(snapshot.balance < 1000, `unexpected monthly surplus: ${snapshot.balance}`);

  game.advanceMonth();
  assert.equal(Number.isInteger(game.getSnapshot().money), true);
  assert.ok(game.getSnapshot().money > 1000, `unexpected treasury after one month: ${game.getSnapshot().money}`);
});
