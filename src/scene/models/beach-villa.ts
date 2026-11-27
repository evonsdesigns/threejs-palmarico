import * as THREE from "three";
import type { Kit } from "./kit";
import { bench, detailedWindow, door, face, hipRoof, palm, plant, wallLamp } from "./services-parts";
import { beam } from "./tourism-a-parts";

const WALL = 0xe9e4d5;
const TRIM = 0xf5f0e2;
const ROOF = 0x873a2e;

export function buildBeachVilla(kit: Kit) {
  const { box, solid } = kit;
  box(0x788c45, 0, 0.035, 0, 11.8, 0.07, 7.8);
  box(0xc8b68d, 0, 0.08, 1.15, 11.3, 0.04, 5.3);
  for (let x = -5.3; x <= 5.3; x += 0.55) box(0xb7a57d, x, 0.11, 1.1, 0.025, 0.015, 5.1);

  box(0xa99a7c, 0, 0.26, -1.35, 9.55, 0.4, 4.12);
  box(WALL, 0, 1.95, -1.35, 9.15, 3.0, 3.78);
  box(0xe4ddca, 0, 0.55, -1.35, 9.28, 0.4, 3.9);
  box(TRIM, 0, 3.52, -1.35, 9.45, 0.2, 4.0);
  for (const x of [-4.25, -2.2, 0, 2.2, 4.25]) {
    box(0xe9e3d3, x, 1.76, 0.78, 0.18, 2.95, 0.18);
    box(0xddd4c0, x, 0.34, 0.78, 0.38, 0.18, 0.38);
    box(TRIM, x, 3.23, 0.78, 0.32, 0.17, 0.32);
  }
  box(0xf0ebdc, 0, 3.28, 1.1, 9.3, 0.2, 1.2);
  for (let x = -4.15; x < 4.2; x += 0.3) {
    box(0xf2eee3, x, 0.88, 1.55, 0.06, 1.05, 0.06);
    box(0xe6dfcd, x, 1.34, 1.55, 0.06, 0.05, 0.06);
  }
  box(0xf2eee3, 0, 1.4, 1.55, 8.6, 0.08, 0.12);

  const F = face(kit, 0, 0.56, 0);
  for (const x of [-3.35, -1.55, 1.55, 3.35]) {
    detailedWindow(F, x, 1.95, 0.96, 1.45, { shutter: 0x527f78, lintel: TRIM, flowers: [0xd84e57, 0xf0cf53] });
    box(0x5b4836, x, 2.0, 0.76, 0.07, 1.42, 0.05);
  }
  door(F, 0, 0.42, 1.42, 2.35, { leaf: 0x684733, frame: TRIM, trim: 0x44362a, handle: 0xd5b15c, double: true, glazed: true, glass: 0x6f9996 });
  wallLamp(F, -0.98, 2.45, 0xffd77e);
  wallLamp(F, 0.98, 2.45, 0xffd77e);
  for (const x of [-4.45, 4.45]) {
    box(0xe4ddca, x, 2.04, 0.52, 0.3, 2.86, 0.32);
    for (let y = 0.8; y < 3.0; y += 0.55) box(0xd0c8b7, x, y, 0.71, 0.18, 0.035, 0.02);
  }
  hipRoof(kit, { x0: -4.86, x1: 4.86, z0: -3.45, z1: 0.73, eave: 3.62, rise: 1.32, runX: 2.05, runZ: 1.65, color: ROOF, rib: 0x76362e, course: 0x6d332b, cap: 0x9a4935, fascia: 0x654534, ribStep: 0.36, courses: 6, patches: [0x9e4935, 0x79362b, 0xa6553c] });
  for (const x of [-2.8, 2.8]) {
    const tower = solid(new THREE.CylinderGeometry(0.72, 0.82, 1.15, 8), 0xddd7c8, x, 4.17, -1.45);
    tower.rotation.y = Math.PI / 8;
    box(0x766f61, x, 4.17, -1.45, 1.2, 0.5, 0.04);
    for (let i = 0; i < 6; i++) {
      const a = i * Math.PI / 3;
      box(0x77766d, x + Math.cos(a) * 0.44, 4.17, -1.45 + Math.sin(a) * 0.44, 0.05, 0.63, 0.05);
    }
    const cap = solid(new THREE.ConeGeometry(1.0, 0.72, 8), ROOF, x, 5.1, -1.45);
    cap.rotation.y = Math.PI / 8;
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4;
      beam(kit, 0x72332b, [x, 4.77, -1.45], [x + Math.cos(a) * 0.96, 5.35, -1.45 + Math.sin(a) * 0.96], 0.055);
    }
    box(0xd3c394, x, 5.52, -1.45, 0.34, 0.16, 0.34);
  }
  box(0x9c3c32, 0, 0.1, 2.72, 5.25, 0.14, 2.28);
  const coping = solid(new THREE.CylinderGeometry(1.0, 1.0, 0.28, 12), 0xe8e4d8, 0, 0.28, 2.72);
  coping.scale.set(2.55, 1, 1.08);
  const basin = solid(new THREE.CylinderGeometry(1.0, 1.0, 0.1, 12), 0x257d9b, 0, 0.31, 2.72);
  basin.scale.set(2.36, 1, 0.92);
  const water = solid(new THREE.CylinderGeometry(1.0, 1.0, 0.035, 12), 0x62c5d6, 0, 0.37, 2.72);
  water.scale.set(2.25, 1, 0.84);
  for (const [x, z, w] of [[-1.1, 2.5, 0.55], [0.1, 2.95, 0.75], [1.05, 2.55, 0.45]]) box(0xa1e6e5, x, 0.395, z, w, 0.015, 0.06);
  for (let x = -2.25; x <= 2.25; x += 0.3) box(0xf1eddf, x, 0.34, 1.54, 0.06, 0.03, 0.08);

  for (const side of [-1, 1]) {
    const x = side * 5.0;
    for (let z = 0.6; z <= 3.7; z += 0.55) {
      box(0xeae6da, x, 0.9, z, 0.08, 1.65, 0.08);
      box(0xd7d1c3, x, 1.76, z, 0.13, 0.1, 0.13);
    }
    box(0xf4f0e5, x, 1.53, 2.12, 0.08, 0.08, 3.2);
    box(0xf4f0e5, x, 0.37, 2.12, 0.08, 0.08, 3.2);
    for (let z = 0.9; z < 3.5; z += 0.75) {
      beam(kit, 0xe7e2d6, [x, 0.45, z], [x, 1.45, z + 0.68], 0.035);
      beam(kit, 0xe7e2d6, [x, 1.45, z], [x, 0.45, z + 0.68], 0.035);
    }
  }
  for (const x of [-4.75, -3.8, 3.8, 4.75]) {
    box(0xeae6da, x, 0.9, 3.65, 0.08, 1.65, 0.08);
    box(0xf4f0e5, x, 1.53, 3.65, 0.95, 0.08, 0.08);
    box(0xf4f0e5, x, 0.37, 3.65, 0.95, 0.08, 0.08);
  }
  for (const x of [-4.7, -3.9, 3.9, 4.7]) {
    box(0xf4f0e5, x, 0.9, 0.65, 0.08, 1.65, 0.08);
    box(0xf4f0e5, x, 1.53, 0.65, 0.8, 0.08, 0.08);
    box(0xf4f0e5, x, 0.37, 0.65, 0.8, 0.08, 0.08);
  }
  for (const x of [-3.4, 3.4]) {
    box(0x4e4941, x, 0.26, 2.02, 0.62, 0.12, 0.9);
    box(0xeee9dc, x, 0.4, 2.02, 0.58, 0.1, 0.85);
    box(0x4e4941, x, 0.73, 1.78, 0.58, 0.62, 0.08, -0.55);
    for (const dx of [-0.24, 0.24]) for (const z of [1.7, 2.35]) box(0x969184, x + dx, 0.14, z, 0.045, 0.28, 0.045);
    const shade = solid(new THREE.ConeGeometry(0.78, 0.38, 8), 0xc8443b, x, 2.35, 2.72);
    shade.rotation.y = Math.PI / 8;
    box(0x8a6c45, x, 1.34, 2.72, 0.06, 2.0, 0.06);
    for (let i = 0; i < 8; i++) beam(kit, i % 2 ? 0xf1e6d3 : 0xb83c36, [x, 2.16, 2.72], [x + Math.cos(i * Math.PI / 4) * 0.72, 2.35, 2.72 + Math.sin(i * Math.PI / 4) * 0.72], 0.035);
  }
  for (const x of [-5.25, 5.25]) palm(kit, x, 2.0, 0.08, 1.1);
  for (const x of [-4.5, 4.5]) plant(kit, x, 0.35, 0.11, 0x9a5c3c, [0xe8c84a, 0xd34b4c], 0.7);
  bench(kit, 0, 0.95, 0.12, 1.8, 0, 0x927c5d);

  const B = face(kit, 0, -3.25, Math.PI);
  door(B, 0, 0.4, 1.0, 2.25, { leaf: 0x6a4833, frame: TRIM, trim: 0x51402f });
  const R = face(kit, 4.58, -1.35, Math.PI / 2);
  for (const z of [-2.2, -0.4]) detailedWindow(R, z + 1.35, 2.0, 0.78, 1.25, { shutter: 0x527f78 });
  wallLamp(R, 0.1, 2.45);
  const L = face(kit, -4.58, -1.35, -Math.PI / 2);
  for (const z of [-2.2, -0.4]) detailedWindow(L, z + 1.35, 2.0, 0.78, 1.25, { shutter: 0x527f78 });
}
