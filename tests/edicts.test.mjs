import { test } from "node:test";
import assert from "node:assert/strict";
import { buildings, GameState, buildingCost, planCitizens } from "../src/logic/game.ts";
import { citizenStatus } from "../src/logic/citizens.ts";
import { currentMonthIndex } from "../src/logic/edicts.ts";

function showcase() {
  const game = new GameState();
  game.initializeShowcase(buildings.map((building, index) => ({ type: building.id, x: index * 40, z: 0 })));
  return game;
}

function arrive(game, citizenId) {
  const order = game.getSnapshot().citizenOrders.find((entry) => entry.citizenId === citizenId);
  assert.ok(order, "A dispatched order must exist before its officer arrives.");
  assert.equal(game.completeCitizenOrder(order.id), null);
}

test("edict requirements block unavailable actions and costs are charged on issue", () => {
  const game = new GameState();
  assert.match(game.selectEdictTarget("bribe"), /bank/i);
  assert.match(game.issueEdict("bribe", game.getSnapshot().citizenIds[0]), /bank/i);
  assert.equal(game.getSnapshot().money, 3000);

  const available = showcase();
  const citizenId = available.getSnapshot().citizenIds[0];
  assert.equal(available.selectEdictTarget("bribe"), null);
  assert.equal(available.getSnapshot().money, 3000);
  assert.equal(available.getSnapshot().targetingEdict, "bribe");
  assert.equal(available.issueEdict("bribe", citizenId), null);
  assert.equal(available.getSnapshot().money, 2000);
  assert.equal(available.getSnapshot().targetingEdict, null);
  assert.deepEqual(available.getSnapshot().lastCitizenEdict, { id: "bribe", citizenId });
  assert.equal(available.getSnapshot().activeEdicts.some((edict) => edict.id === "bribe" && edict.citizenId === citizenId), true);
});

test("people edicts require a real citizen and rejected targets never charge or activate", () => {
  const game = showcase();
  for (const id of ["bribe", "arrest", "capture", "heretic", "eliminate"]) {
    const before = game.getSnapshot();
    assert.match(game.issueEdict(id), /choose a citizen/i);
    for (const citizenId of [-1, 1.5, NaN, 99999]) {
      assert.match(game.issueEdict(id, citizenId), /no longer on the island/i);
    }
    assert.equal(game.getSnapshot(), before);
  }
  assert.match(game.issueEdict("tax-cut", game.getSnapshot().citizenIds[0]), /does not target/i);
});

test("targeting can be cancelled or replaced by construction without paying", () => {
  const game = showcase();
  assert.equal(game.selectEdictTarget("bribe"), null);
  assert.equal(game.selectEdictTarget(null), null);
  assert.equal(game.getSnapshot().targetingEdict, null);
  assert.equal(game.getSnapshot().money, 3000);
  assert.equal(game.getSnapshot().lastCitizenEdict, null);
  assert.equal(game.selectEdictTarget("bribe"), null);
  game.select("house");
  assert.equal(game.getSnapshot().targetingEdict, null);
  assert.equal(game.getSnapshot().money, 3000);
  assert.equal(game.selectEdictTarget("bribe"), null);
  assert.equal(game.getSnapshot().selected, null);
  assert.match(game.selectEdictTarget("tax-cut"), /people edict/i);
});

test("bribes are limited per citizen rather than blocking every citizen", () => {
  const game = showcase();
  const [first, second] = game.getSnapshot().citizenIds;
  assert.equal(game.issueEdict("bribe", first), null);
  assert.match(game.issueEdict("bribe", first), /already active/i);
  assert.equal(game.getSnapshot().money, 2000);
  assert.equal(game.selectEdictTarget("bribe"), null);
  assert.equal(game.issueEdict("bribe", second), null);
  assert.equal(game.getSnapshot().money, 1000);
  assert.deepEqual(game.getSnapshot().activeEdicts.filter((edict) => edict.id === "bribe").map((edict) => edict.citizenId), [first, second]);
});

test("target confirmation rechecks funds and staffing after the edict was selected", () => {
  const game = showcase();
  const citizenId = game.getSnapshot().citizenIds[0];
  assert.equal(game.selectEdictTarget("bribe"), null);
  assert.equal(game.place("farm", 10000, 0), true);
  assert.equal(game.place("farm", 10040, 0), true);
  assert.equal(game.place("house", 10080, 0), true);
  assert.ok(game.getSnapshot().money < 1000);
  assert.equal(game.getSnapshot().targetingEdict, "bribe");
  const before = game.getSnapshot();
  assert.match(game.issueEdict("bribe", citizenId), /requires \$1,000/i);
  assert.equal(game.getSnapshot(), before);

  const staffing = showcase();
  assert.equal(staffing.selectEdictTarget("bribe"), null);
  staffing.setSimulationModifiers({ closedBuildingTypes: ["bank"] });
  const afterClosure = staffing.getSnapshot();
  assert.match(staffing.issueEdict("bribe", afterClosure.citizenIds[0]), /staffed bank/i);
  assert.equal(staffing.getSnapshot(), afterClosure);
});

test("departed citizen identities cannot be reused when population regrows", () => {
  const game = new GameState();
  const original = game.getSnapshot().citizenIds;
  const departed = original.at(-1);
  game.advanceMonth();
  assert.equal(game.getSnapshot().population, 7);
  assert.deepEqual(game.getSnapshot().citizenIds, original.slice(0, -1));
  game.place("house", 0, 0);
  game.place("house", 20, 0);
  game.place("farm", 40, 0);
  game.place("market", 60, 0);
  game.place("market", 80, 0);
  game.advanceMonth();
  assert.equal(game.getSnapshot().population, 8);
  assert.equal(game.getSnapshot().citizenIds.includes(departed), false);
  assert.match(game.issueEdict("bribe", departed), /no longer on the island/i);
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

test("personal bribes decline over three years without a blanket loyalist bonus", () => {
  const game = showcase();
  game.setSimulationModifiers({ approvalModifier: 100, populationGrowthMultiplier: 0, monthlyIncome: 5000 });
  const [first, second] = game.getSnapshot().citizenIds;
  const before = game.getSnapshot().factions.loyalists;
  assert.equal(game.issueEdict("bribe", first), null);
  assert.deepEqual(game.getSnapshot().factions.loyalists, before);
  assert.equal(citizenStatus(game.getSnapshot(), first).respectAdjustment, 25);
  assert.equal(citizenStatus(game.getSnapshot(), second).bribeBenefit, 0);
  for (let month = 0; month < 18; month++) game.advanceMonth();
  assert.equal(game.getSnapshot().gameOver, null);
  assert.equal(citizenStatus(game.getSnapshot(), first).bribeMonths, 18);
  assert.equal(citizenStatus(game.getSnapshot(), first).bribeBenefit, 500);
  for (let month = 0; month < 18; month++) game.advanceMonth();
  assert.equal(citizenStatus(game.getSnapshot(), first).respectAdjustment, 0);
  assert.equal(game.getSnapshot().activeEdicts.some((edict) => edict.id === "bribe"), false);
});

test("heresy is permanent, personal, and cannot be charged twice for the same citizen", () => {
  const game = showcase();
  const [first, second] = game.getSnapshot().citizenIds;
  const religious = game.getSnapshot().factions.religious;
  assert.equal(game.issueEdict("heretic", first), null);
  assert.equal(citizenStatus(game.getSnapshot(), first).heretic, true);
  assert.equal(citizenStatus(game.getSnapshot(), first).respectAdjustment, -25);
  assert.equal(citizenStatus(game.getSnapshot(), second).heretic, false);
  assert.deepEqual(game.getSnapshot().factions.religious, religious);
  const before = game.getSnapshot();
  assert.match(game.issueEdict("heretic", first), /already active/i);
  assert.equal(game.getSnapshot(), before);
  assert.equal(game.getSnapshot().activeEdicts.find((entry) => entry.id === "heretic").expiresAt, null);
});

test("capture occupies a specific dungeon cell, excludes work, rejects repeat detention and releases after 36 months", () => {
  const game = showcase();
  game.setSimulationModifiers({ approvalModifier: 100, populationGrowthMultiplier: 0, monthlyIncome: 5000 });
  const citizenId = game.getSnapshot().citizenIds[2];
  const before = game.getSnapshot();
  const farm = before.placed.findIndex((building) => building.type === "farm");
  assert.equal(game.issueEdict("capture", citizenId), null);
  assert.equal(game.getSnapshot().jailUsed, 0);
  assert.equal(game.getSnapshot().buildingStaffing[farm], before.buildingStaffing[farm]);
  assert.equal(game.getSnapshot().citizenOrders[0].citizenId, citizenId);
  arrive(game, citizenId);
  assert.equal(game.getSnapshot().population, 8);
  assert.equal(game.getSnapshot().jailUsed, 1);
  assert.equal(game.getSnapshot().prisoners[0].citizenId, citizenId);
  assert.equal(game.getSnapshot().placed[game.getSnapshot().prisoners[0].buildingIndex].type, "colonial-fort");
  assert.equal(game.getSnapshot().jailReleases[0], currentMonthIndex(before) + 36);
  assert.equal(planCitizens(game.getSnapshot())[2].work, null);
  assert.ok(game.getSnapshot().buildingStaffing[farm] < before.buildingStaffing[farm]);
  const imprisoned = game.getSnapshot();
  assert.match(game.issueEdict("arrest", citizenId), /already detained/i);
  assert.match(game.issueEdict("capture", citizenId), /already detained/i);
  assert.equal(game.getSnapshot(), imprisoned);
  for (let month = 0; month < 35; month++) game.advanceMonth();
  assert.equal(game.getSnapshot().gameOver, null);
  assert.equal(game.getSnapshot().jailUsed, 1);
  game.advanceMonth();
  assert.equal(game.getSnapshot().jailUsed, 0);
  assert.equal(game.getSnapshot().prisoners.length, 0);
  assert.equal(game.getSnapshot().jailReleases.length, 0);
  assert.notEqual(planCitizens(game.getSnapshot())[2].work, null);
  assert.equal(game.getSnapshot().citizenIds.includes(citizenId), true);
});

test("pending captures reserve the fort's four cells without borrowing prison capacity", () => {
  const game = showcase();
  const ids = game.getSnapshot().citizenIds;
  for (const id of ids.slice(0, 4)) assert.equal(game.issueEdict("capture", id), null);
  assert.equal(game.getSnapshot().jailUsed, 0);
  assert.equal(game.getSnapshot().citizenOrders.length, 4);
  const before = game.getSnapshot();
  assert.match(game.issueEdict("capture", ids[4]), /free dungeon cell/i);
  assert.equal(game.getSnapshot(), before);
});

test("arrest uses a staffed prison and the manual's seven-year term", () => {
  const game = new GameState();
  const ordered = [...buildings].sort((a, b) => Number(b.id === "prison") - Number(a.id === "prison"));
  game.initializeShowcase(ordered.map((building, index) => ({ type: building.id, x: index * 40, z: 0 })));
  game.setSimulationModifiers({
    closedBuildingTypes: buildings.filter((building) => !["prison", "police-station", "palace", "house", "farm"].includes(building.id)).map((building) => building.id),
  });
  const before = game.getSnapshot();
  assert.equal(game.issueEdict("arrest", before.citizenIds[1]), null);
  assert.equal(game.getSnapshot().prisoners.length, 0);
  arrive(game, before.citizenIds[1]);
  const prisoner = game.getSnapshot().prisoners[0];
  assert.equal(game.getSnapshot().placed[prisoner.buildingIndex].type, "prison");
  assert.equal(prisoner.releaseAt, currentMonthIndex(before) + 84);
});

test("elimination removes exactly the chosen identity and clears its inspection and personal effects", () => {
  const game = showcase();
  const ids = game.getSnapshot().citizenIds;
  const citizenId = ids[2];
  assert.equal(game.issueEdict("bribe", citizenId), null);
  game.inspectCitizen(citizenId);
  assert.equal(game.issueEdict("eliminate", citizenId), null);
  assert.equal(game.getSnapshot().population, 8);
  assert.equal(game.getSnapshot().citizenIds.includes(citizenId), true);
  arrive(game, citizenId);
  assert.equal(game.getSnapshot().population, 7);
  assert.deepEqual(game.getSnapshot().citizenIds, ids.filter((id) => id !== citizenId));
  assert.equal(game.getSnapshot().inspectedCitizen, null);
  assert.equal(game.getSnapshot().activeEdicts.some((entry) => entry.citizenId === citizenId), false);
  assert.equal(citizenStatus(game.getSnapshot(), citizenId), null);
});

test("Open the Jails exiles only actual detainees and removes their effects", () => {
  const game = showcase();
  game.setSimulationModifiers({ approvalModifier: 100, populationGrowthMultiplier: 0, monthlyIncome: 5000 });
  game.advanceMonth();
  const ids = game.getSnapshot().citizenIds;
  const detainees = [ids[1], ids[4]];
  assert.equal(game.issueEdict("bribe", detainees[0]), null);
  for (const id of detainees) {
    assert.equal(game.issueEdict("capture", id), null);
    arrive(game, id);
  }
  assert.equal(game.issueEdict("open-jails"), null);
  assert.equal(game.getSnapshot().population, 6);
  assert.deepEqual(game.getSnapshot().citizenIds, ids.filter((id) => !detainees.includes(id)));
  assert.equal(game.getSnapshot().jailUsed, 0);
  assert.equal(game.getSnapshot().activeEdicts.some((entry) => detainees.includes(entry.citizenId)), false);
});

test("detained citizens cannot emigrate in place of a free resident", () => {
  const game = showcase();
  game.setSimulationModifiers({ approvalModifier: -200, populationGrowthMultiplier: 0 });
  const ids = game.getSnapshot().citizenIds;
  assert.equal(game.issueEdict("capture", ids[7]), null);
  arrive(game, ids[7]);
  game.advanceMonth();
  assert.equal(game.getSnapshot().population, 7);
  assert.equal(game.getSnapshot().citizenIds.includes(ids[7]), true);
  assert.equal(game.getSnapshot().citizenIds.includes(ids[6]), false);
  assert.equal(game.getSnapshot().prisoners[0].citizenId, ids[7]);
});

test("a personal bribe influences the election instead of only changing the inspector", () => {
  const control = showcase();
  const bribed = showcase();
  for (const game of [control, bribed]) {
    game.setSimulationModifiers({ approvalModifier: 100, populationGrowthMultiplier: 0 });
    assert.equal(game.issueEdict("early-elections"), null);
  }
  assert.equal(bribed.issueEdict("bribe", bribed.getSnapshot().citizenIds[0]), null);
  control.advanceMonth();
  bribed.advanceMonth();
  const controlVote = Number(control.getSnapshot().notice.match(/Election won with (\d+)%/)[1]);
  const bribedVote = Number(bribed.getSnapshot().notice.match(/Election won with (\d+)%/)[1]);
  assert.ok(bribedVote > controlVote);
});

test("capture needs police and elimination needs a staffed guard tower, not just another military building", () => {
  for (const [action, type, reason] of [
    ["capture", "police-station", /staffed police/i],
    ["eliminate", "guard-station", /staffed guard/i],
  ]) {
    const game = showcase();
    game.setSimulationModifiers({ closedBuildingTypes: [type] });
    const before = game.getSnapshot();
    assert.match(game.issueEdict(action, before.citizenIds[0]), reason);
    assert.equal(game.getSnapshot(), before);
    if (action === "eliminate") {
      assert.ok(before.placed.some((building, index) => building.type === "armory" && before.buildingStaffing[index] > 0));
    }
  }
});

test("pending orders cannot be doubled or charged twice, and cancellation refunds the reservation without a Swiss skim exploit", () => {
  const game = showcase();
  assert.equal(game.issueEdict("special-building-permit"), null);
  const before = game.getSnapshot();
  const id = before.citizenIds[0];
  assert.equal(game.issueEdict("capture", id), null);
  const pending = game.getSnapshot();
  assert.equal(pending.money, before.money - 500);
  assert.equal(pending.slushFund, before.slushFund);
  assert.equal(citizenStatus(pending, id).order.action, "capture");
  assert.match(game.issueEdict("capture", id), /already pending/i);
  assert.match(game.issueEdict("eliminate", id), /already pending/i);
  assert.equal(game.getSnapshot(), pending);
  assert.equal(game.cancelCitizenOrder(pending.citizenOrders[0].id), null);
  assert.equal(game.getSnapshot().money, before.money);
  assert.equal(game.getSnapshot().slushFund, before.slushFund);
  assert.equal(citizenStatus(game.getSnapshot(), id).order, undefined);
  assert.match(game.cancelCitizenOrder(pending.citizenOrders[0].id), /no longer exists/i);
});

test("security orders wait for staff and actual arrival; sentences start at completion, with no second payment", () => {
  const game = showcase();
  const modifiers = { approvalModifier: 100, populationGrowthMultiplier: 0, monthlyIncome: 5000 };
  game.setSimulationModifiers(modifiers);
  const citizenId = game.getSnapshot().citizenIds[0];
  assert.equal(game.issueEdict("capture", citizenId), null);
  const order = game.getSnapshot().citizenOrders[0];
  for (let month = 0; month < 3; month++) game.advanceMonth();
  assert.equal(game.getSnapshot().jailUsed, 0, "Advancing the calendar must not substitute for officer arrival.");
  assert.equal(game.getSnapshot().citizenOrders.length, 1);
  game.setSimulationModifiers({ ...modifiers, closedBuildingTypes: ["police-station"] });
  assert.match(game.completeCitizenOrder(order.id), /waiting for security staff/i);
  assert.equal(game.getSnapshot().jailUsed, 0);
  game.setSimulationModifiers({ ...modifiers, closedBuildingTypes: [] });
  game.togglePause();
  assert.match(game.completeCitizenOrder(order.id), /stopped/i);
  game.togglePause();
  const before = game.getSnapshot();
  arrive(game, citizenId);
  assert.equal(game.getSnapshot().money, before.money);
  assert.equal(game.getSnapshot().prisoners[0].releaseAt, currentMonthIndex(before) + 36);
  assert.equal(game.getSnapshot().citizenOrders.length, 0);
  assert.match(game.completeCitizenOrder(order.id), /no longer exists/i);
  assert.equal(game.getSnapshot().prisoners.length, 1);
});

test("a departed target cancels its pending order and refunds reserved money", () => {
  const game = showcase();
  const control = showcase();
  for (const island of [game, control]) island.setSimulationModifiers({ approvalModifier: -200, populationGrowthMultiplier: 0, monthlyIncome: 5000 });
  const citizenId = game.getSnapshot().citizenIds.at(-1);
  assert.equal(game.issueEdict("capture", citizenId), null);
  game.advanceMonth();
  control.advanceMonth();
  assert.equal(game.getSnapshot().citizenIds.includes(citizenId), false);
  assert.equal(game.getSnapshot().citizenOrders.length, 0);
  assert.equal(game.getSnapshot().money, control.getSnapshot().money);
  assert.match(game.getSnapshot().notice, /targets left.*refunded/i);
});

test("additional staffed police stations receive orders instead of leaving all work at the first station", () => {
  const game = showcase();
  game.setSimulationModifiers({ approvalModifier: 100, populationGrowthMultiplier: 0, monthlyIncome: 5000 });
  game.advanceMonth();
  assert.equal(game.place("police-station", 10000, 0), true);
  const [first, second] = game.getSnapshot().citizenIds;
  assert.equal(game.issueEdict("capture", first), null);
  assert.equal(game.issueEdict("capture", second), null);
  const orders = game.getSnapshot().citizenOrders;
  assert.notEqual(orders[0].source, orders[1].source);
  for (const order of orders) assert.equal(game.getSnapshot().placed[order.source].type, "police-station");
});
