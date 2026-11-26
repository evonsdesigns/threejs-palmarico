import * as THREE from "three";
import { buildingTexture } from "../building-textures";
import { Kit } from "./kit";

export function buildRestaurant(kit: Kit) {
  const { box, window, frontWindow, backWindow, leftWindow, solid } = kit;
  const cz = -4;
  box(0xcdbf9f, 0, 0.12, 0, 19.2, 0.24, 19.2);
  box(0xece7da, 0, 2.34, cz, 15, 4.2, 9);
  box(0x6f9cc4, 0, 0.5, cz, 15.12, 0.45, 9.12);
  box(0xf2eee2, 0, 4.4, cz, 15.3, 0.25, 9.3);
  box(0xece7da, 0, 5, cz, 9.6, 1.2, 4.2);
  box(0x52554e, 0, 5.62, cz, 9.8, 0.12, 4.4);

  const tile = 0xb06a42;
  const eave = 4.45;
  const rise = 1.15;
  const frontRun = 3.15;
  const sideRun = 3.45;
  const outer = [[-8.25, 1.25], [8.25, 1.25], [8.25, -9.25], [-8.25, -9.25]];
  const inner = [[-4.8, -1.9], [4.8, -1.9], [4.8, -6.1], [-4.8, -6.1]];
  const roofPoints: number[] = [];
  for (let k = 0; k < 4; k++) {
    const n = (k + 1) % 4;
    const a = [outer[k][0], eave, outer[k][1]];
    const b = [outer[n][0], eave, outer[n][1]];
    const c = [inner[n][0], eave + rise, inner[n][1]];
    const d = [inner[k][0], eave + rise, inner[k][1]];
    roofPoints.push(...a, ...b, ...c, ...a, ...c, ...d);
  }
  const roof = new THREE.BufferGeometry();
  roof.setAttribute("position", new THREE.Float32BufferAttribute(roofPoints, 3));
  const roofUv: number[] = [];
  for (let p = 0; p < roofPoints.length; p += 3) roofUv.push(roofPoints[p] / 3, roofPoints[p + 2] / 3);
  roof.setAttribute("uv", new THREE.Float32BufferAttribute(roofUv, 2));
  roof.computeVertexNormals();
  solid(roof, tile, 0, 0, 0, buildingTexture("tile"));
  for (const side of [-1, 1]) {
    const outerZ = side > 0 ? 1.25 : -9.25;
    box(0x8f4a2c, 0, eave - 0.06, outerZ, 16.6, 0.16, 0.12);
    box(0x8f4a2c, side * 8.25, eave - 0.06, cz, 0.12, 0.16, 10.6);
    for (let t = 0.2; t < 0.9; t += 0.2) {
      const y = eave + rise * t + 0.03;
      box(0x8f4a2c, 0, y, outerZ - side * frontRun * t, 2 * (8.25 - sideRun * t), 0.05, 0.08);
      box(0x8f4a2c, side * (8.25 - sideRun * t), y, cz, 0.08, 0.05, 10.5 - 2 * frontRun * t);
    }
    const frontAngle = Math.atan2(rise, frontRun);
    for (let i = 0; i < 10; i++) {
      const t = (i % 3) * 0.3 + 0.12;
      box(i % 2 ? 0xd08a45 : 0xc0612f, -6.3 + i * 1.4, eave + rise * t + 0.03, outerZ - side * frontRun * t, 1.2, 0.04, 0.9, side * frontAngle);
    }
  }
  for (let x = -4.8; x <= 4.8; x += 0.6) {
    for (const z of [cz - 2.2, cz + 2.2]) box(0xf4f1e8, x, 5.92, z, 0.12, 0.5, 0.12);
  }
  for (let z = cz - 2.2; z <= cz + 2.2; z += 0.55) {
    for (const x of [-4.9, 4.9]) box(0xf4f1e8, x, 5.92, z, 0.12, 0.5, 0.12);
  }
  for (const z of [cz - 2.2, cz + 2.2]) box(0xf4f1e8, 0, 6.2, z, 9.95, 0.1, 0.18);
  for (const x of [-4.9, 4.9]) box(0xf4f1e8, x, 6.2, cz, 0.18, 0.1, 4.55);
  for (const x of [-0.7, 0.2]) {
    solid(new THREE.CylinderGeometry(0.3, 0.3, 1.5, 10), 0xa34e35, x, 6.4, -5.4);
    solid(new THREE.CylinderGeometry(0.36, 0.36, 0.16, 10), 0x7a3a28, x, 7.2, -5.4);
  }

  for (const x of [-6, 6]) {
    box(0x3e4a52, x, 1.65, 0.53, 1.7, 2.6, 0.08);
    for (const dx of [-0.95, 0.95]) box(0x6f9cc4, x + dx, 1.75, 0.58, 0.22, 2.9, 0.14);
    box(0x6f9cc4, x, 3.2, 0.58, 2.12, 0.26, 0.14);
    box(0xf2eee2, x, 3.55, 0.58, 1.4, 0.35, 0.12);
  }
  for (const x of [-1.2, 2.8]) {
    frontWindow(x, 2.25, 0.58, 1.8, 1.3);
    for (let i = 0; i < 6; i++) box(i % 2 ? 0xf1efe3 : 0x4c8b55, x - 0.875 + i * 0.35, 3.3, 0.98, 0.35, 0.08, 0.95, 0.45);
    box(0x4c8b55, x, 3.05, 1.42, 2.1, 0.22, 0.05);
  }
  const sign = solid(new THREE.CylinderGeometry(0.8, 0.8, 0.12, 20), 0xf3efe2, -3.6, 3, 0.62);
  sign.rotation.x = Math.PI / 2;
  box(0x4f8040, -3.6, 3, 0.7, 1.1, 0.5, 0.05);
  for (const [dx, dy] of [[-0.3, 0.1], [0.05, -0.12], [0.35, 0.12]]) box(0xc0392b, -3.6 + dx, 3 + dy, 0.74, 0.24, 0.24, 0.05);
  for (const z of [-6.5, -1.5]) {
    window(7.56, 2.3, z, 1.2, 1.3, Math.PI / 2);
    leftWindow(-7.56, 2.3, z, 1.2, 1.3);
  }
  for (const x of [-4.5, 0, 4.5]) backWindow(x, 2.3, -8.56, 1.2, 1.3);
  for (const [x, z] of [[-7.3, 1.1], [-4.6, 1.1], [7.3, 1.1], [7.3, -8.9]]) {
    box(0x9c5b3b, x, 0.55, z, 0.55, 0.6, 0.55);
    box(0x5f8f45, x, 1.05, z, 0.65, 0.4, 0.65);
    for (const dx of [-0.18, 0.18]) box(0xe3c53e, x + dx, 1.3, z, 0.18, 0.14, 0.18);
  }

  box(0xd9ccb0, 0, 0.3, 5.4, 18, 0.12, 7.6);
  for (const [x, z, color] of [[-5, 4.2, 0x2f8fd6], [0.3, 7.2, 0xf2cf2b], [5.2, 4.4, 0x2f8fd6]] as const) {
    solid(new THREE.CylinderGeometry(0.85, 0.85, 0.1, 16), 0xf4f2ea, x, 1.15, z);
    box(0xd8d6cc, x, 0.75, z, 0.12, 0.8, 0.12);
    box(0xefefe8, x, 2.15, z, 0.1, 2.3, 0.1);
    for (let k = 0; k < 8; k++) {
      solid(new THREE.ConeGeometry(1.75, 0.65, 2, 1, true, k * Math.PI / 4, Math.PI / 4), k % 2 ? 0xf6f4ec : color, x, 3.4, z);
    }
    box(0xefefe8, x, 3.8, z, 0.14, 0.14, 0.14);
    for (let k = 0; k < 4; k++) {
      const angle = Math.PI / 4 + k * Math.PI / 2;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      box(0xe9e7de, x + cos * 1.3, 0.75, z + sin * 1.3, 0.5, 0.08, 0.5, 0, Math.PI / 2 - angle);
      box(0xe9e7de, x + cos * 1.3, 0.52, z + sin * 1.3, 0.06, 0.45, 0.06);
      box(0xe9e7de, x + cos * 1.58, 1.1, z + sin * 1.58, 0.5, 0.65, 0.07, 0, Math.PI / 2 - angle);
    }
  }
}
