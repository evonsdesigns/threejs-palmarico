import * as THREE from "three";
import type { Kit } from "./kit";
import { bench, detailedWindow, door, face, plant, wallLamp } from "./services-parts";
import { beam, sign } from "./tourism-a-parts";

const WHITE = 0xf1eee4;
const RED = 0x9f4338;

export function buildPool(kit: Kit) {
  const { box, solid } = kit;
  box(0x78914d, 0, 0.035, 0, 11.8, 0.07, 7.8);
  box(RED, 0, 0.11, 0, 10.8, 0.12, 6.85);
  box(0xf1ead7, 0, 0.18, 0, 10.4, 0.035, 6.45);
  box(RED, 0, 0.21, 0, 10.12, 0.035, 6.18);
  for (let x = -4.9; x <= 4.9; x += 0.58) box(0xb85e4d, x, 0.24, 0, 0.025, 0.012, 6.05);
  for (let z = -2.9; z <= 2.9; z += 0.52) box(0xb85e4d, 0, 0.24, z, 10.0, 0.012, 0.025);

  const coping = solid(new THREE.CylinderGeometry(1, 1, 0.34, 16), 0xe9e3d3, -0.55, 0.35, 0.15);
  coping.scale.set(2.93, 1, 1.92);
  const lip = solid(new THREE.CylinderGeometry(1, 1, 0.12, 16), 0x8f9994, -0.55, 0.5, 0.15);
  lip.scale.set(2.65, 1, 1.66);
  const basin = solid(new THREE.CylinderGeometry(1, 1, 0.08, 16), 0x206b8a, -0.55, 0.51, 0.15);
  basin.scale.set(2.53, 1, 1.55);
  const water = solid(new THREE.CylinderGeometry(1, 1, 0.035, 16), 0x56b6d2, -0.55, 0.57, 0.15);
  water.scale.set(2.43, 1, 1.48);
  for (const [x, z, w] of [[-1.9, -0.1, 0.65], [-1.0, 0.88, 0.92], [0.2, -0.65, 0.74], [0.95, 0.48, 0.6], [1.0, -0.45, 0.48]]) {
    box(0x9be2e2, x, 0.592, z, w, 0.014, 0.045);
  }
  for (const x of [1.65, 2.05]) {
    box(0xd6d5ca, x, 0.96, 1.44, 0.055, 0.84, 0.055);
    box(0xd6d5ca, x, 1.34, 1.24, 0.055, 0.055, 0.45);
    box(0xd6d5ca, x, 1.34, 1.64, 0.055, 0.055, 0.45);
  }
  for (const z of [-0.75, -0.5, -0.25]) box(0xb4e4e6, 1.95, 0.55, z, 0.5, 0.035, 0.05);

  const fence = (x1: number, x2: number, z: number) => {
    box(WHITE, (x1 + x2) / 2, 1.66, z, x2 - x1, 0.1, 0.1);
    box(WHITE, (x1 + x2) / 2, 0.49, z, x2 - x1, 0.1, 0.1);
    for (let x = x1; x <= x2 + 0.001; x += 0.72) {
      box(WHITE, x, 1.05, z, 0.08, 1.2, 0.08);
      box(0xe5e1d7, x, 1.71, z, 0.16, 0.12, 0.16);
    }
    for (let x = x1; x < x2 - 0.35; x += 0.72) {
      beam(kit, WHITE, [x, 0.56, z], [x + 0.68, 1.58, z], 0.035);
      beam(kit, WHITE, [x, 1.58, z], [x + 0.68, 0.56, z], 0.035);
    }
    for (const cx of [x1 + 1.15, (x1 + x2) / 2, x2 - 1.15]) {
      const medallion = solid(new THREE.TorusGeometry(0.37, 0.045, 6, 16), WHITE, cx, 1.08, z + 0.08);
      box(0xece7dc, cx, 1.08, z + 0.015, 0.08, 0.08, 0.05);
      void medallion;
    }
  };
  const sideFence = (x: number, z1: number, z2: number) => {
    box(WHITE, x, 1.66, (z1 + z2) / 2, 0.1, 0.1, z2 - z1);
    box(WHITE, x, 0.49, (z1 + z2) / 2, 0.1, 0.1, z2 - z1);
    for (let z = z1; z <= z2 + 0.001; z += 0.72) box(WHITE, x, 1.05, z, 0.08, 1.2, 0.08);
    for (let z = z1; z < z2 - 0.35; z += 0.72) {
      beam(kit, WHITE, [x, 0.56, z], [x, 1.58, z + 0.68], 0.035);
      beam(kit, WHITE, [x, 1.58, z], [x, 0.56, z + 0.68], 0.035);
    }
    const ring = solid(new THREE.TorusGeometry(0.37, 0.045, 6, 16), WHITE, x + 0.08, 1.08, (z1 + z2) / 2);
    ring.rotation.y = Math.PI / 2;
  };
  fence(-5.35, 5.35, -3.45);
  fence(-5.35, -0.82, 3.45);
  fence(0.82, 5.35, 3.45);
  sideFence(-5.35, -3.45, 3.45);
  sideFence(5.35, -3.45, 3.45);
  for (const x of [-5.35, -0.82, 0.82, 5.35]) {
    box(WHITE, x, 0.95, 3.45, 0.22, 1.9, 0.22);
    box(0xe4ddcf, x, 1.96, 3.45, 0.32, 0.12, 0.32);
  }

  box(0xcfc3ab, 3.15, 0.24, -2.45, 3.6, 0.35, 1.65);
  box(WHITE, 3.15, 1.57, -2.45, 3.3, 2.35, 1.42);
  box(0xe5dfd1, 3.15, 2.82, -2.45, 3.52, 0.16, 1.68);
  box(0xd3c9b8, 3.15, 2.96, -2.45, 3.66, 0.12, 1.82);
  for (const x of [1.85, 3.15, 4.45]) {
    box(WHITE, x, 1.46, -1.67, 0.16, 2.25, 0.16);
    box(0xd1c9b9, x, 2.59, -1.67, 0.28, 0.14, 0.24);
  }
  const CF = face(kit, 3.15, -1.72, 0);
  door(CF, -0.84, 0.37, 0.78, 2.0, { leaf: 0x687874, frame: WHITE, trim: 0x655a4a });
  door(CF, 0.84, 0.37, 0.78, 2.0, { leaf: 0x687874, frame: WHITE, trim: 0x655a4a });
  for (const x of [2.4, 3.9]) detailedWindow(CF, x - 3.15, 1.85, 0.58, 0.86);
  sign(kit, "POOL", 3.15, 2.45, -1.62, 0.075, 0x39747b, 0xe1d6c1);
  box(0xead8b1, 3.15, 2.35, -0.92, 3.8, 0.12, 1.05);
  for (const x of [1.45, 4.85]) box(0xe8e0d0, x, 1.25, -0.45, 0.14, 2.35, 0.14);
  for (let i = 0; i < 4; i++) {
    box(0xd8cebc, 3.15, 0.18 + i * 0.15, -1.2 + i * 0.22, 2.8, 0.12, 0.34);
  }
  wallLamp(CF, -1.28, 2.13);
  wallLamp(CF, 1.28, 2.13);

  box(0xddd8cc, -4.05, 0.42, -0.05, 0.82, 0.76, 0.82);
  box(0xaea797, -4.05, 0.88, -0.05, 0.72, 0.12, 0.72);
  for (let i = 0; i < 4; i++) box(0xece9df, -4.05, 0.18 + i * 0.2, 0.58 + i * 0.23, 0.76, 0.12, 0.28);
  for (const x of [-4.35, -3.95]) {
    box(0xc4c4bd, x, 1.05, -0.05, 0.055, 0.5, 0.055);
    box(0xc4c4bd, x, 1.31, -0.33, 0.055, 0.055, 0.62);
  }
  box(WHITE, -3.42, 1.5, 0.15, 1.2, 0.12, 0.42);
  box(0xd0c9b8, -3.42, 1.42, -0.02, 1.0, 0.07, 0.06);
  for (const x of [-4.45, 4.45]) {
    const lounger = x < 0 ? x : x;
    box(0x5e6f67, lounger, 0.28, 2.15, 0.72, 0.12, 1.15);
    box(0xf2eee3, lounger, 0.42, 1.77, 0.68, 0.1, 0.48, -0.55);
    box(0xf2eee3, lounger, 0.18, 2.15, 0.62, 0.08, 0.98);
    for (const dx of [-0.28, 0.28]) for (const z of [1.72, 2.58]) box(0x5e6f67, lounger + dx, 0.13, z, 0.04, 0.26, 0.04);
    box(0x6e624d, lounger, 1.32, 2.45, 0.06, 2.3, 0.06);
    const umbrella = solid(new THREE.ConeGeometry(0.8, 0.36, 8), x < 0 ? 0xd04339 : 0xf4eee1, lounger, 2.52, 2.45);
    umbrella.rotation.y = Math.PI / 8;
    for (let i = 0; i < 8; i++) beam(kit, i % 2 ? 0xf1e8d8 : 0xd04339, [lounger, 2.32, 2.45], [lounger + Math.cos(i * Math.PI / 4) * 0.74, 2.52, 2.45 + Math.sin(i * Math.PI / 4) * 0.74], 0.03);
  }
  bench(kit, 0, 3.0, 0.25, 1.7, 0, 0x9a8967);
  for (const x of [-2.2, 2.2]) plant(kit, x, -2.75, 0.2, 0x96714e, [0xe8cf56, 0xd6574b], 0.65);
  for (let i = 0; i < 4; i++) box([0xe5d6b7, 0x4c99a5, 0xf0e8d6, 0xd75343][i], 4.95, 1.42 + i * 0.22, -2.25, 0.08, 0.18, 0.55);
}
