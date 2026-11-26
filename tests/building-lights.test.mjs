import { test } from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import { BuildingLights } from "../src/scene/building-lights.ts";
import { createKit } from "../src/scene/models/kit.ts";

test("only designated building fixtures glow, and previews remain unlit", () => {
  const kit = createKit(false);
  kit.box(0x526e6b, 0, 0, 0, 1, 1, 1);
  kit.litBox(0x526e6b, 2, 0, 0, 1, 1, 1);
  const model = kit.finish();
  const scene = new THREE.Scene();
  const lights = new BuildingLights(scene);
  lights.add(model, 1);
  const ordinary = model.children.find((mesh) => !mesh.material.userData.nightLight);
  const fixture = model.children.find((mesh) => mesh.material.userData.nightLight);
  lights.update(0, new THREE.Vector3());
  assert.equal(ordinary.material.emissiveIntensity, 1);
  assert.equal(ordinary.material.emissive.getHex(), 0);
  assert.equal(fixture.material.emissiveIntensity, 0.9);
  lights.update(1, new THREE.Vector3());
  assert.equal(fixture.material.emissiveIntensity, 0);

  const preview = createKit(true);
  preview.litBox(0x526e6b, 0, 0, 0, 1, 1, 1);
  assert.equal(preview.finish().children[0].material.userData.nightLight, undefined);
});

test("nearby exterior lights follow dusk, rotations, replacement and the camera", () => {
  const scene = new THREE.Scene();
  const lights = new BuildingLights(scene);
  const buildings = Array.from({ length: 7 }, (_, index) => {
    const model = new THREE.Group();
    model.position.set(index * 20, 0, 0);
    model.rotation.y = Math.PI / 2;
    lights.add(model, 2);
    return model;
  });
  const pointLights = scene.children.filter((child) => child instanceof THREE.PointLight);
  lights.update(0.5, new THREE.Vector3());
  assert.equal(pointLights.filter((light) => light.intensity > 0).length, 6);
  assert.equal(pointLights[0].intensity, 12.5);
  assert.ok(Math.abs(pointLights[0].position.x - 2) < 1e-10);
  lights.remove(buildings[0]);
  lights.update(0, new THREE.Vector3(120, 0, 0));
  assert.ok(Math.abs(pointLights[0].position.x - 122) < 1e-10);
  assert.equal(pointLights.filter((light) => light.intensity > 0).length, 6);
  lights.update(1, new THREE.Vector3());
  assert.equal(pointLights.filter((light) => light.intensity > 0).length, 0);
});
