import { test } from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import { cameraGroundOutline, minimapPoint } from "../src/hud/minimap/minimap-math.ts";

test("clicks on the rotated map convert to world-aligned coordinates", () => {
  const rect = { left: 10, top: 20, width: 200, height: 200 };
  assert.deepEqual(minimapPoint(110, 120, rect), { x: 0.5, z: 0.5 });
  assert.deepEqual(minimapPoint(110, 20, rect), { x: 0, z: 0 });
  assert.deepEqual(minimapPoint(210, 120, rect), { x: 1, z: 0 });
  assert.deepEqual(minimapPoint(110, 220, rect), { x: 1, z: 1 });
});

test("the camera outline follows pan, zoom and rotation", () => {
  const camera = new THREE.OrthographicCamera(-40, 40, 30, -30, -3000, 5000);
  camera.position.set(70, 70, 70);
  camera.lookAt(0, 0, 0);
  const initial = cameraGroundOutline(camera, 1000);
  camera.position.x += 50;
  const moved = cameraGroundOutline(camera, 1000);
  initial.forEach((point, index) => {
    assert.ok(Math.abs(moved[index].x - point.x - 0.05) < 1e-10);
    assert.ok(Math.abs(moved[index].z - point.z) < 1e-10);
  });
  camera.zoom = 2;
  camera.updateProjectionMatrix();
  const zoomed = cameraGroundOutline(camera, 1000);
  assert.ok(Math.hypot(zoomed[1].x - zoomed[0].x, zoomed[1].z - zoomed[0].z)
    < Math.hypot(moved[1].x - moved[0].x, moved[1].z - moved[0].z));
  camera.position.set(120, 70, 0);
  camera.lookAt(50, 0, 0);
  const rotated = cameraGroundOutline(camera, 1000);
  assert.notDeepEqual(rotated, zoomed);
});

test("the outline remains valid at the widest zoom", () => {
  const camera = new THREE.OrthographicCamera(-100, 100, 40, -40, -3000, 5000);
  camera.position.set(70, 70, 70);
  camera.lookAt(0, 5, 0);
  camera.zoom = 0.2;
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(new THREE.Vector2(-1, -1), camera);
  assert.equal(raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), new THREE.Vector3()), null);
  const outline = cameraGroundOutline(camera, 1024);
  assert.equal(outline.length, 4);
  assert.ok(outline.every((point) => Number.isFinite(point.x) && Number.isFinite(point.z)));
  assert.ok(Math.hypot(outline[1].x - outline[0].x, outline[1].z - outline[0].z) > 0.9);
});
