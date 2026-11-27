import { test } from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import { buildings, GameState } from "../src/logic/game.ts";
import { Residents } from "../src/scene/residents.ts";

test("citizen picking returns the nearest visible person's stable identity, never hidden residents", () => {
  const game = new GameState();
  game.place("house", 0, 0);
  const scene = new THREE.Scene();
  const house = new THREE.Mesh(new THREE.BoxGeometry(8, 3, 8));
  const residents = new Residents(scene, () => 2, [], () => house);
  residents.sync(game.getSnapshot());
  const models = scene.children.filter((model) => model.userData.citizenId !== undefined);
  models.forEach((model, index) => model.position.set(20 + index * 3, 2, 0));
  const [first, second] = models;
  first.position.set(0, 2, 0);
  second.position.set(0, 2, -5);
  const raycaster = new THREE.Raycaster(new THREE.Vector3(0, 3.3, 10), new THREE.Vector3(0, 0, -1));
  assert.equal(residents.pick(raycaster).citizenId, game.getSnapshot().citizenIds[0]);
  first.visible = false;
  assert.equal(residents.pick(raycaster).citizenId, game.getSnapshot().citizenIds[1]);
  second.visible = false;
  assert.equal(residents.pick(raycaster), null);
});

test("detention and release hide and restore the same citizen model, and elimination preserves everyone else's identity", () => {
  const game = new GameState();
  game.initializeShowcase(buildings.map((building, index) => ({ type: building.id, x: index * 40, z: 0 })));
  game.setSimulationModifiers({ approvalModifier: 100, populationGrowthMultiplier: 0, monthlyIncome: 5000 });
  const scene = new THREE.Scene();
  const buildingModels = game.getSnapshot().placed.map((building) => {
    const model = new THREE.Mesh(new THREE.BoxGeometry(8, 3, 8));
    model.position.set(building.x, 2, building.z);
    return model;
  });
  const residents = new Residents(scene, () => 2, [], (index) => buildingModels[index]);
  residents.sync(game.getSnapshot());
  const models = new Map(scene.children.filter((model) => model.userData.citizenId !== undefined).map((model) => [model.userData.citizenId, model]));
  const ids = game.getSnapshot().citizenIds;
  const detained = ids[2];
  const eliminated = ids[4];
  assert.equal(game.issueEdict("capture", detained), null);
  assert.equal(models.get(detained).visible, true);
  assert.equal(game.completeCitizenOrder(game.getSnapshot().citizenOrders[0].id), null);
  residents.sync(game.getSnapshot());
  assert.equal(models.get(detained).visible, false);
  const cellPosition = models.get(detained).position.clone();
  residents.update(0.1, game.getSnapshot());
  assert.deepEqual(models.get(detained).position, cellPosition);
  assert.equal(game.issueEdict("eliminate", eliminated), null);
  assert.equal(game.completeCitizenOrder(game.getSnapshot().citizenOrders[0].id), null);
  residents.sync(game.getSnapshot());
  assert.equal(scene.children.includes(models.get(eliminated)), false);
  for (const id of game.getSnapshot().citizenIds) {
    assert.equal(scene.children.find((model) => model.userData.citizenId === id), models.get(id));
  }
  for (let month = 0; month < 36; month++) game.advanceMonth();
  assert.equal(game.getSnapshot().gameOver, null);
  residents.sync(game.getSnapshot());
  assert.equal(scene.children.includes(models.get(detained)), true);
  assert.equal(models.get(detained).visible, true);
});

test("the citizen selection ring follows the selected resident and hides indoors", () => {
  const game = new GameState();
  game.place("house", 0, 0);
  const scene = new THREE.Scene();
  const residents = new Residents(scene, () => 2, [], () => new THREE.Mesh(new THREE.BoxGeometry(8, 3, 8)));
  residents.sync(game.getSnapshot());
  const id = game.getSnapshot().citizenIds[0];
  const model = scene.children.find((entry) => entry.userData.citizenId === id);
  const ring = scene.children.find((entry) => entry.geometry?.type === "RingGeometry");
  assert.equal(ring.visible, false);
  game.inspectCitizen(id);
  residents.sync(game.getSnapshot());
  assert.equal(ring.visible, true);
  model.position.x += 4;
  residents.update(0, game.getSnapshot());
  assert.equal(ring.position.x, model.position.x);
  model.visible = false;
  residents.update(0, game.getSnapshot());
  assert.equal(ring.visible, false);
  game.inspectBuilding(0);
  assert.equal(game.getSnapshot().inspectedCitizen, null);
});

function dispatchFixture(heightAt = () => 2) {
  const game = new GameState();
  const locations = {
    house: [0, 0], farm: [10, 12], "police-station": [40, 0],
    "guard-station": [60, 0], "colonial-fort": [80, 0],
  };
  game.initializeShowcase(buildings.map((building, index) => {
    const [x, z] = locations[building.id] ?? [400 + index * 40, 0];
    return { type: building.id, x, z };
  }));
  const scene = new THREE.Scene();
  const models = game.getSnapshot().placed.map((building) => {
    const model = new THREE.Mesh(new THREE.BoxGeometry(8, 3, 8));
    model.position.set(building.x, 2, building.z);
    return model;
  });
  const residents = new Residents(scene, heightAt, [], (index) => models[index]);
  residents.sync(game.getSnapshot());
  residents.people.forEach((person, index) => {
    person.model.position.set(-20 - index * 3, 2, 20);
    person.wait = 10000;
  });
  const tick = (delta = 0.1) => {
    const events = residents.update(delta, game.getSnapshot());
    for (const event of events) {
      if (event.type === "arrived") {
        const order = game.getSnapshot().citizenOrders.find((entry) => entry.id === event.orderId);
        const officer = scene.children.find((model) => model.userData.citizenOrderId === event.orderId);
        const target = scene.children.find((model) => model.userData.citizenId === order.citizenId);
        const prisoner = game.getSnapshot().prisoners.find((entry) => entry.citizenId === order.citizenId);
        if (prisoner) {
          const facility = game.getSnapshot().placed[prisoner.buildingIndex];
          assert.ok(Math.hypot(officer.position.x - facility.x, officer.position.z - facility.z) < 12);
        } else {
          assert.ok(target.visible);
          assert.ok(officer.position.distanceTo(target.position) <= 1.6, "Effects require real contact, not just an elapsed timer.");
        }
        assert.equal(game.completeCitizenOrder(event.orderId), null);
      } else {
        assert.equal(game.setCitizenOrderStatus(event.orderId, event.status), null);
      }
    }
    residents.sync(game.getSnapshot());
    return events;
  };
  return { game, scene, residents, tick };
}

for (const action of ["capture", "eliminate"]) {
  test(`${action} dispatches a visible unit from the correct facility and walks around buildings before affecting the exact target`, () => {
    const { game, scene, tick } = dispatchFixture();
    const ids = game.getSnapshot().citizenIds;
    assert.equal(game.issueEdict(action, ids[0]), null);
    const order = game.getSnapshot().citizenOrders[0];
    const source = game.getSnapshot().placed[order.source];
    assert.equal(source.type, action === "capture" ? "police-station" : "guard-station");
    tick();
    const officer = scene.children.find((model) => model.userData.citizenOrderId === order.id);
    assert.ok(officer?.visible);
    assert.ok(Math.hypot(officer.position.x - source.x, officer.position.z - source.z) < 12);
    assert.equal(game.getSnapshot().population, 8);
    assert.equal(game.getSnapshot().jailUsed, 0);
    let steps = 0;
    while (game.getSnapshot().citizenOrders.length && steps++ < 600) {
      const previous = officer.position.clone();
      tick();
      assert.ok(officer.position.distanceTo(previous) <= 0.400001, "Dispatch must walk, not teleport.");
      assert.equal(officer.position.x > 6 && officer.position.x < 14 && officer.position.z > 8 && officer.position.z < 16, false, "Dispatch must not cross the intervening building.");
    }
    assert.ok(steps > 5 && steps < 600);
    assert.equal(game.getSnapshot().citizenOrders.length, 0);
    assert.equal(scene.children.includes(officer), false);
    if (action === "capture") {
      assert.equal(game.getSnapshot().prisoners[0].citizenId, ids[0]);
      assert.equal(game.getSnapshot().population, 8);
    } else {
      assert.deepEqual(game.getSnapshot().citizenIds, ids.slice(1));
    }
  });
}

test("one officer serves each station's queue; cancellation removes the officer and releases the next order", () => {
  const { game, scene, residents, tick } = dispatchFixture();
  const [first, second] = game.getSnapshot().citizenIds;
  assert.equal(game.issueEdict("capture", first), null);
  assert.equal(game.issueEdict("capture", second), null);
  const [one, two] = game.getSnapshot().citizenOrders;
  tick();
  const officers = () => scene.children.filter((model) => model.userData.citizenOrderId !== undefined);
  assert.deepEqual(officers().map((model) => model.userData.citizenOrderId), [one.id]);
  const beforeClosure = officers()[0].position.clone();
  game.setSimulationModifiers({ closedBuildingTypes: ["police-station"] });
  tick(1);
  assert.equal(game.getSnapshot().citizenOrders[0].status, "waiting-for-staff");
  assert.deepEqual(officers()[0].position, beforeClosure);
  game.setSimulationModifiers({ closedBuildingTypes: [] });
  game.togglePause();
  const stopped = officers()[0].position.clone();
  assert.deepEqual(tick(10), []);
  assert.deepEqual(officers()[0].position, stopped);
  game.togglePause();
  assert.equal(game.cancelCitizenOrder(one.id), null);
  residents.sync(game.getSnapshot());
  assert.equal(officers().length, 0);
  tick();
  assert.deepEqual(officers().map((model) => model.userData.citizenOrderId), [two.id]);
  assert.equal(game.getSnapshot().jailUsed, 0);
});

test("police wait for an indoor target instead of capturing someone through the building", () => {
  const { game, scene, residents, tick } = dispatchFixture();
  const target = residents.people[0];
  target.inside = target.plan.home;
  target.model.visible = false;
  assert.equal(game.issueEdict("capture", target.model.userData.citizenId), null);
  for (let step = 0; step < 300; step++) tick();
  assert.equal(game.getSnapshot().jailUsed, 0);
  assert.equal(game.getSnapshot().citizenOrders[0].status, "waiting-for-target");
  target.inside = null;
  target.model.visible = true;
  tick();
  assert.equal(game.getSnapshot().jailUsed, 1);
  assert.equal(scene.children.some((model) => model.userData.citizenOrderId !== undefined), false);
});

test("an unreachable target leaves a visible blocked order; restoring the walking route allows completion", () => {
  let river = false;
  const { game, residents, tick } = dispatchFixture((x, z) => {
    if (!river) return 2;
    if (Math.abs(x) > 100 || Math.abs(z) > 100) return null;
    return x >= 0 && x <= 20 ? 0 : 2;
  });
  river = true;
  residents.invalidateTerrain();
  const id = game.getSnapshot().citizenIds[0];
  assert.equal(game.issueEdict("capture", id), null);
  tick();
  assert.equal(game.getSnapshot().citizenOrders[0].status, "blocked");
  assert.equal(game.getSnapshot().jailUsed, 0);
  assert.match(game.getSnapshot().notice, /no safe walking route/i);
  river = false;
  residents.invalidateTerrain();
  for (let step = 0; step < 600 && game.getSnapshot().citizenOrders.length; step++) tick();
  assert.equal(game.getSnapshot().prisoners[0]?.citizenId, id);
});

test("a soldier visits a detained target's facility instead of waiting years for that citizen to reappear outside", () => {
  const { game, tick } = dispatchFixture();
  const id = game.getSnapshot().citizenIds[0];
  assert.equal(game.issueEdict("capture", id), null);
  assert.equal(game.completeCitizenOrder(game.getSnapshot().citizenOrders[0].id), null);
  assert.equal(game.issueEdict("eliminate", id), null);
  assert.equal(game.getSnapshot().population, 8);
  for (let step = 0; step < 300 && game.getSnapshot().citizenOrders.length; step++) tick();
  assert.equal(game.getSnapshot().citizenOrders.length, 0);
  assert.equal(game.getSnapshot().citizenIds.includes(id), false);
  assert.equal(game.getSnapshot().jailUsed, 0);
});
