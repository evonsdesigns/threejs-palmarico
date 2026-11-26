import { test } from "node:test";
import assert from "node:assert/strict";
import { DAY_LENGTH, daylightAt } from "../src/scene/daylight.ts";
import { GameState } from "../src/logic/game.ts";

test("the visual cycle moves from day through night and back", () => {
  const noon = daylightAt(0);
  const sunset = daylightAt(DAY_LENGTH / 4);
  const midnight = daylightAt(DAY_LENGTH / 2);
  const sunrise = daylightAt(DAY_LENGTH * 3 / 4);
  assert.equal(noon.daylight, 1);
  assert.equal(midnight.daylight, 0);
  assert.ok(noon.elevation > 0 && midnight.elevation < 0);
  assert.ok(sunset.daylight > 0 && sunset.daylight < 1);
  assert.ok(sunrise.daylight > 0 && sunrise.daylight < 1);
  assert.notEqual(sunset.azimuth, sunrise.azimuth);
  assert.deepEqual(daylightAt(DAY_LENGTH), noon);
});

test("the visual cycle follows simulation speed and pause", () => {
  const game = new GameState();
  let elapsed = game.advanceTime(10);
  game.setSpeed(5);
  elapsed += game.advanceTime(10);
  assert.equal(daylightAt(elapsed).daylight, 0);
  game.togglePause();
  const paused = daylightAt(elapsed);
  elapsed += game.advanceTime(10);
  assert.deepEqual(daylightAt(elapsed), paused);
});
