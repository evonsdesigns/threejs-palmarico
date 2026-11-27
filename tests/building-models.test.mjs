import { test } from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";

// Models paint canvas textures; geometry is all this test checks, so drawing calls are no-ops.
const noop = () => {};
const context = new Proxy({}, {
  get: (_, key) => key === "createLinearGradient" || key === "createRadialGradient" || key === "createPattern"
    ? () => ({ addColorStop: noop })
    : key === "getImageData" || key === "createImageData"
      ? (_x, _y, w = 1, h = 1) => ({ data: new Uint8ClampedArray(Math.max(1, w * h * 4)), width: w, height: h })
      : key === "measureText" ? () => ({ width: 10 }) : noop,
  set: () => true,
});
globalThis.document ??= {
  createElement: () => ({ width: 1, height: 1, style: {}, getContext: () => context, addEventListener: noop }),
  createElementNS: () => ({ width: 1, height: 1, style: {}, getContext: () => context, addEventListener: noop }),
};

const { buildings } = await import("../src/logic/game.ts");
const { GRID_TILE_SIZE } = await import("../src/logic/grid.ts");
const { createSettlementBuilding } = await import("../src/scene/settlement-buildings.ts");
const { findWindowAnchors } = await import("../src/scene/interior-occupants.ts");

const coastal = new Set(["dock", "fishermans-wharf", "marina", "beach-site"]);
const only = process.env.BUILDING ? process.env.BUILDING.split(",") : null;

for (const definition of buildings) {
  if (definition.id === "palace" || (only && !only.includes(definition.id))) continue;
  test(`${definition.name} model stays inside its ${definition.tiles.join("×")} tile footprint`, () => {
    const model = createSettlementBuilding(definition.id);
    model.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(model);
    const halfX = definition.tiles[0] * GRID_TILE_SIZE / 2 + 0.25;
    const halfZ = definition.tiles[1] * GRID_TILE_SIZE / 2 + 0.25;
    assert.ok(bounds.min.x >= -halfX && bounds.max.x <= halfX, `x extent ${bounds.min.x.toFixed(2)}..${bounds.max.x.toFixed(2)} exceeds ±${halfX}`);
    assert.ok(bounds.min.z >= -halfZ && bounds.max.z <= halfZ, `z extent ${bounds.min.z.toFixed(2)}..${bounds.max.z.toFixed(2)} exceeds ±${halfZ}`);
    assert.ok(bounds.min.y >= (coastal.has(definition.id) ? -3.5 : -0.5), `model sinks to y=${bounds.min.y.toFixed(2)}`);
    assert.ok(bounds.max.y <= 30, `model rises to y=${bounds.max.y.toFixed(2)}`);
  });
}

for (const [type, xEdge, zEdge] of [["hotel", 9, 6.8], ["luxury-hotel", 9, 6.6]]) {
  if (only && !only.includes(type)) continue;
  test(`${type} windows support night lights and interior silhouettes on every exterior face`, () => {
    const anchors = findWindowAnchors(createSettlementBuilding(type));
    for (const [axis, side, edge] of [["x", -1, xEdge], ["x", 1, xEdge], ["z", -1, zEdge], ["z", 1, zEdge]]) {
      assert.ok(anchors.some(({ position, normal }) => side * position[axis] >= edge && side * normal[axis] > 0.9),
        `missing illuminated windows on ${side > 0 ? "+" : "-"}${axis}`);
    }
  });
}

if (!only || only.includes("cabaret")) {
  test("cabaret has illuminated sign bulbs and windows for interior silhouettes", () => {
    const model = createSettlementBuilding("cabaret");
    const windows = findWindowAnchors(model);
    assert.ok(windows.some(({ normal }) => normal.z > 0.9));
    assert.ok(windows.some(({ normal }) => normal.x < -0.9));
    let signBulbs = 0;
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const rotation = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    model.traverse((child) => {
      if (!(child instanceof THREE.InstancedMesh) || !child.material.userData.nightLight) return;
      for (let i = 0; i < child.count; i++) {
        child.getMatrixAt(i, matrix);
        matrix.decompose(position, rotation, scale);
        if (position.z > 3.6 && position.y > 4 && scale.x < 0.15 && scale.y < 0.15) signBulbs++;
      }
    });
    assert.ok(signBulbs > 0, "missing illuminated vertical sign");
  });
}

if (!only || only.includes("casino")) {
  test("casino corner standards light up at night", () => {
    const model = createSettlementBuilding("casino");
    const positions = [];
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const rotation = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    model.traverse((child) => {
      if (!(child instanceof THREE.InstancedMesh) || !child.material.userData.nightLight) return;
      for (let i = 0; i < child.count; i++) {
        child.getMatrixAt(i, matrix);
        matrix.decompose(position, rotation, scale);
        if (position.y > 7 && Math.abs(position.x) > 6 && Math.abs(position.z) > 4) positions.push(position.clone());
      }
    });
    assert.equal(positions.length, 4);
  });
}

if (!only || only.includes("dock")) {
  test("dock warehouse windows support night lights and interior silhouettes", () => {
    const windows = findWindowAnchors(createSettlementBuilding("dock"));
    assert.ok(windows.some(({ position, normal }) => position.z < 0 && normal.z > 0.9));
    assert.ok(windows.some(({ position, normal }) => position.z < 0 && normal.x > 0.9));
  });
}
