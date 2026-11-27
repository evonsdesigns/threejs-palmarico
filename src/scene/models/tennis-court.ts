import * as THREE from "three";
import type { Kit } from "./kit";
import { bench, detailedWindow, door, face, hipRoof, plant, wallLamp } from "./services-parts";
import { beam, sign } from "./tourism-a-parts";

const LINE = 0xf2f1e8;
const GREEN = 0x3d8350;
const RED = 0x994b37;
const PLASTER = 0xe6e1d4;

export function buildTennisCourt(kit: Kit) {
  const { box, solid } = kit;
  box(0x75914c, 0, 0.035, 0, 11.8, 0.07, 7.8);
  box(0xc7b99c, 0, 0.09, -0.85, 11.3, 0.04, 5.7);

  for (const cx of [-2.62, 2.62]) {
    box(RED, cx, 0.14, -0.86, 4.75, 0.1, 4.45);
    box(GREEN, cx, 0.205, -0.86, 4.2, 0.035, 3.94);
    box(LINE, cx, 0.24, -0.86, 0.045, 0.018, 3.8);
    for (const z of [-2.72, 1.0]) box(LINE, cx, 0.24, z, 4.05, 0.018, 0.045);
    for (const z of [-2.15, 0.43]) box(LINE, cx, 0.24, z, 3.95, 0.018, 0.035);
    box(LINE, cx, 0.24, -0.86, 0.035, 0.018, 1.9);
    for (const x of [cx - 1.48, cx + 1.48]) box(LINE, x, 0.24, -0.86, 0.035, 0.018, 1.9);
    for (const x of [cx - 0.72, cx + 0.72]) box(LINE, x, 0.25, -0.86, 0.025, 0.015, 1.86);
    box(LINE, cx, 0.25, 0.99, 0.18, 0.02, 0.06);
    box(LINE, cx, 0.25, -2.71, 0.18, 0.02, 0.06);

    for (const x of [cx - 2.46, cx + 2.46]) {
      for (let z = -3.42; z <= 1.7; z += 0.62) {
        box(0x515b55, x, 1.38, z, 0.065, 2.6, 0.065);
        box(0x7e8a7f, x, 2.72, z, 0.13, 0.08, 0.13);
      }
      box(0x59645b, x, 2.52, -0.86, 0.045, 0.04, 5.1);
      box(0x67776a, x, 0.98, -0.86, 0.035, 0.04, 5.1);
      for (let z = -3.18; z < 1.45; z += 0.42) {
        beam(kit, 0x65736a, [x, 0.98, z], [x, 2.5, z + 0.42], 0.018);
        beam(kit, 0x65736a, [x, 2.5, z], [x, 0.98, z + 0.42], 0.018);
      }
    }
    for (const z of [-3.42, 1.7]) {
      for (let x = cx - 2.46; x <= cx + 2.46; x += 0.62) box(0x515b55, x, 1.38, z, 0.065, 2.6, 0.065);
      box(0x59645b, cx, 2.52, z, 4.9, 0.04, 0.04);
      for (let x = cx - 2.28; x < cx + 2.2; x += 0.4) {
        beam(kit, 0x65736a, [x, 0.98, z], [x + 0.4, 2.5, z], 0.018);
        beam(kit, 0x65736a, [x, 2.5, z], [x + 0.4, 0.98, z], 0.018);
      }
    }
    box(0x696b65, cx, 0.2, -0.86, 0.12, 0.3, 0.12);
    for (const x of [cx - 2.16, cx + 2.16]) {
      box(0x516058, x, 0.8, -0.86, 0.08, 1.45, 0.08);
      box(0xbdb9aa, x, 1.52, -0.86, 0.13, 0.08, 0.13);
    }
    box(0xf0eee4, cx, 1.18, -0.86, 4.28, 0.78, 0.035);
    box(LINE, cx, 1.61, -0.86, 4.3, 0.055, 0.045);
    for (let x = cx - 2.04; x <= cx + 2.04; x += 0.18) box(0xb7b9b0, x, 1.16, -0.86, 0.018, 0.72, 0.018);
  }

  box(0x72816e, 0, 1.42, -0.86, 0.14, 2.55, 5.0);
  box(0x566857, 0, 2.73, -0.86, 0.2, 0.08, 5.15);
  bench(kit, 0, 1.72, 0.12, 2.2, 0, 0x9b8968, 0x414844);
  for (const x of [-0.92, 0.92]) {
    box(0x896849, x, 0.55, 1.75, 0.44, 0.08, 0.35);
    for (let i = 0; i < 3; i++) {
      box(0x6f5136, x - 0.16 + i * 0.16, 0.98, 1.75, 0.035, 0.85, 0.035, 0, (i - 1) * 0.22);
      const hoop = solid(new THREE.TorusGeometry(0.17, 0.025, 4, 10), [0xd94a3f, 0xe3d5a5, 0x477bb0][i], x - 0.16 + i * 0.16, 1.42, 1.75);
      hoop.rotation.x = Math.PI / 2;
    }
  }
  for (let i = 0; i < 5; i++) {
    const ball = solid(new THREE.SphereGeometry(0.09, 8, 6), 0xc5d64d, -0.34 + i * 0.16, 0.32, 1.85);
    ball.scale.set(1, 0.85, 1);
  }

  box(0xbab09b, 0, 0.25, 2.72, 10.65, 0.35, 1.68);
  box(PLASTER, 0, 1.83, 2.72, 10.2, 2.85, 1.42);
  box(0xd3c9b8, 0, 0.55, 2.72, 10.3, 0.34, 1.5);
  box(0xf1ece0, 0, 3.29, 2.72, 10.4, 0.2, 1.58);
  hipRoof(kit, { x0: -5.38, x1: 5.38, z0: 1.82, z1: 3.62, eave: 3.41, rise: 0.78, runX: 1.2, runZ: 0.65, color: 0x8b3f31, rib: 0x74362d, course: 0x6b3229, cap: 0xaa5239, fascia: 0x604735, ribStep: 0.34, courses: 5, patches: [0xa64e37, 0x79382d] });
  const F = face(kit, 0, 3.44, 0);
  door(F, 0, 0.4, 1.26, 2.25, { leaf: 0x79553a, frame: 0xf3eee2, trim: 0x523d2d, handle: 0xc9a852, double: true, glazed: true, glass: 0x6d8d85 });
  for (const x of [-3.9, -2.25, 2.25, 3.9]) detailedWindow(F, x, 1.98, 0.92, 1.46, { lintel: 0xf3eee2, shutter: 0x557c70 });
  sign(kit, "TENNIS", 0, 3.0, 3.54, 0.07, 0x396b50, 0xe8d7b4);
  wallLamp(F, -1.15, 2.35);
  wallLamp(F, 1.15, 2.35);
  for (let i = 0; i < 4; i++) box(0xe4d8c2, 0, 0.18 + i * 0.16, 3.62 + i * 0.12, 2.45, 0.13, 0.38);
  for (const x of [-4.7, -1.55, 1.55, 4.7]) {
    box(0xf3eee2, x, 1.52, 3.55, 0.2, 2.85, 0.2);
    box(0xd4c9b6, x, 0.34, 3.55, 0.4, 0.16, 0.4);
    box(0xf3eee2, x, 2.97, 3.55, 0.38, 0.18, 0.38);
  }
  const R = face(kit, 5.1, 2.72, Math.PI / 2);
  detailedWindow(R, 0, 1.9, 0.9, 1.3, { shutter: 0x557c70 });
  const B = face(kit, 0, 2.0, Math.PI);
  door(B, -3.7, 0.38, 0.85, 2.15, { leaf: 0x79553a, frame: 0xf3eee2, trim: 0x523d2d });
  for (const x of [-2.2, 2.2]) detailedWindow(B, x, 1.9, 0.9, 1.3);

  for (const x of [-4.8, 4.8]) {
    box(0x77583e, x, 1.0, -0.7, 0.14, 1.8, 0.14);
    box(0x8c6947, x, 1.95, -0.7, 0.72, 0.12, 0.58);
    box(0x77583e, x, 2.35, -0.96, 0.7, 0.85, 0.09);
    for (const z of [-1.6, -0.35]) box(0x72583f, x, 0.13, z, 0.8, 0.18, 0.14);
  }
  for (const x of [-5.4, 5.4]) {
    box(0x3d4540, x, 3.35, -0.8, 0.1, 6.7, 0.1);
    box(0xffe6a3, x, 3.52, -0.8, 0.24, 0.3, 0.24);
    box(0x3d4540, x, 3.69, -0.8, 0.32, 0.06, 0.32);
  }
  bench(kit, -3.0, 1.72, 0.15, 1.8, 0, 0x927c5d);
  bench(kit, 3.0, 1.72, 0.15, 1.8, 0, 0x927c5d);
  for (const x of [-4.9, 4.9]) plant(kit, x, 3.78, 0.14, 0x8c6445, [0xe2c44f, 0xd74e46], 0.72);
  for (const x of [-5.15, -3.7, 3.7, 5.15]) {
    box(0x857451, x, 0.24, -3.55, 0.54, 0.38, 0.42);
    plant(kit, x, -3.55, 0.42, 0x857451, [0xe5c84f], 0.5);
  }
}
