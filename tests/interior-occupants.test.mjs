import { test } from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import { allocateOccupants, findWindowAnchors, InteriorOccupants } from "../src/scene/interior-occupants.ts";
import { createKit } from "../src/scene/models/kit.ts";
import { TENEMENT_DOORS, tenementStairRoute } from "../src/scene/models/tenement.ts";

function windowedHouse() {
  const kit = createKit(false);
  kit.box(0x999999, 0, 1.5, 0, 6, 3, 6);
  for (const x of [-2, 0, 2]) kit.window(x, 1.6, 3, 1, 1.2);
  kit.window(3, 1.6, 0, 1, 1.2, Math.PI / 2);
  kit.litBox(0xf5e7a8, 0, 2.8, 3.2, 0.1, 0.1, 0.1);
  return kit.finish();
}

test("occupant figures never outnumber the residents inside", () => {
  for (let inside = 0; inside <= 20; inside++) {
    for (const windows of [0, 1, 4, 30]) {
      for (const stairs of [false, true]) {
        const { climbers, silhouettes } = allocateOccupants(inside, windows, stairs);
        assert.ok(climbers + silhouettes <= inside);
        assert.ok(silhouettes <= windows);
      }
    }
  }
  assert.deepEqual(allocateOccupants(0, 10, true), { climbers: 0, silhouettes: 0 });
});

test("window shadows sit on outward glass panes and follow the actual occupancy", () => {
  const model = windowedHouse();
  model.position.set(40, 0, 10);
  model.rotation.y = Math.PI / 2;
  const anchors = findWindowAnchors(model);
  assert.equal(anchors.length, 4);
  assert.ok(anchors.every((anchor) => anchor.normal.x * anchor.position.x + anchor.normal.z * anchor.position.z > 0));

  const occupants = new InteriorOccupants(new THREE.Scene());
  const placed = [{ type: "house" }];
  const at = () => model;
  occupants.update(0.5, new Map([[0, 2]]), placed, at, 0);
  assert.equal(occupants.shown(0), 2);
  assert.equal(occupants.shadows.count, 2);
  occupants.update(0.5, new Map([[0, 9]]), placed, at, 0);
  assert.equal(occupants.shown(0), 4);
  occupants.update(0.5, new Map([[0, 1]]), placed, at, 1);
  assert.equal(occupants.shown(0), 1);
  occupants.update(0.5, new Map(), placed, at, 1);
  assert.equal(occupants.shown(0), 0);
  assert.equal(occupants.shadows.count, 0);
});

test("tenement residents climb the stairs without exceeding those inside", () => {
  const occupants = new InteriorOccupants(new THREE.Scene());
  const model = new THREE.Group();
  for (let frame = 0; frame < 200; frame++) {
    const inside = frame < 100 ? 3 : 1;
    occupants.update(0.2, new Map([[0, inside]]), [{ type: "tenement" }], () => model, 0);
    assert.ok(occupants.shown(0) <= inside);
    assert.ok(occupants.bodies.count <= inside);
  }
  const route = tenementStairRoute(1, TENEMENT_DOORS[1][0], TENEMENT_DOORS[2][2]);
  assert.equal(route[0][1], 3.35);
  assert.equal(route.at(-1)[1], 6.35);
  assert.ok(route.every(([, y], i) => i === 0 || y >= route[i - 1][1]));
});
