import { test } from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import { createTreeGrove, treeKindForTerrain } from "../src/scene/palms.ts";

test("terrain distributes palms, fan palms and broadleaf trees", () => {
  const kinds = new Set(Array.from({ length: 100 }, (_, i) => treeKindForTerrain("jungle", i / 100)));
  assert.deepEqual(kinds, new Set(["palm", "fan-palm", "broadleaf", "tall-broadleaf"]));
  assert.equal(treeKindForTerrain("sand", 0.1), "palm");
  assert.equal(treeKindForTerrain("sand", 0.9), "fan-palm");
});

test("clearing a tree hides only its own instances, regardless of species", () => {
  const grove = createTreeGrove([
    { kind: "broadleaf", x: 1, y: 0, z: 2, seed: 0.2 },
    { kind: "palm", x: 3, y: 0, z: 4, seed: 0.4 },
    { kind: "broadleaf", x: 5, y: 0, z: 6, seed: 0.6 },
    { kind: "fan-palm", x: 7, y: 0, z: 8, seed: 0.8 },
    { kind: "tall-broadleaf", x: 9, y: 0, z: 10, seed: 0.3 },
  ]);
  const mesh = grove.group.children.find((child) => child instanceof THREE.InstancedMesh && child.count === 2);
  assert.ok(mesh);
  assert.ok(grove.group.children.every((child) => child.castShadow));
  const before = new THREE.Matrix4();
  mesh.getMatrixAt(1, before);
  grove.remove(0);
  const removed = new THREE.Matrix4();
  const other = new THREE.Matrix4();
  mesh.getMatrixAt(0, removed);
  mesh.getMatrixAt(1, other);
  assert.equal(removed.determinant(), 0);
  assert.deepEqual(other.elements, before.elements);
  for (const index of [1, 3, 4]) grove.remove(index);
  const meshes = grove.group.children.filter((child) => child instanceof THREE.InstancedMesh);
  for (const single of meshes.filter((child) => child.count === 1)) {
    single.getMatrixAt(0, removed);
    assert.equal(removed.determinant(), 0);
  }
  mesh.getMatrixAt(1, other);
  assert.deepEqual(other.elements, before.elements);
  assert.throws(() => grove.remove(99), /missing tree/);
});
