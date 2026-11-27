import * as THREE from "three";
import type { Kit } from "./kit";
import { detailedWindow, door, face, plant, wallLamp } from "./services-parts";
import { sign, stripedAwning } from "./tourism-a-parts";

const CREAM = 0xe7dcb9;
const PALE = 0xf3edda;
const GOLD = 0xcaa752;
const BLUE = 0x4c7776;

export function buildDutyFreeShop(kit: Kit) {
  const { box, solid } = kit;
  box(0xc9b998, 0, 0.035, 0, 7.8, 0.07, 7.8);
  box(0xe0d4b8, 0, 0.09, 2.0, 7.5, 0.04, 3.25);
  for (let x = -3.5; x <= 3.5; x += 0.55) box(0xb9a982, x, 0.12, 2.0, 0.025, 0.012, 3.2);

  box(0x9d8e6e, 0, 0.28, -0.55, 6.35, 0.42, 5.45);
  box(CREAM, 0, 2.2, -0.55, 6.0, 3.5, 5.1);
  box(0xc4b88e, 0, 0.68, -0.55, 6.08, 0.42, 5.18);
  box(PALE, 0, 4.03, -0.55, 6.25, 0.22, 5.35);
  box(0xe8dfc7, 0, 4.28, -0.55, 6.32, 0.16, 5.42);
  box(CREAM, 0, 4.62, 1.99, 6.0, 0.84, 0.2);
  box(CREAM, -2.92, 4.62, 1.4, 0.2, 0.84, 1.0);
  box(CREAM, 2.92, 4.62, 1.4, 0.2, 0.84, 1.0);
  box(PALE, 0, 5.07, 1.98, 6.2, 0.1, 0.22);
  box(0xb6a77e, 0, 0.25, -0.55, 6.5, 0.18, 5.6);

  const F = face(kit, 0, 2.01, 0);
  detailedWindow(F, -2.05, 2.0, 1.32, 1.65, { lintel: PALE });
  detailedWindow(F, 2.05, 2.0, 1.32, 1.65, { lintel: PALE });
  door(F, 0, 0.38, 1.36, 2.35, { leaf: 0x343936, frame: GOLD, trim: 0x40382e, handle: GOLD, double: true, glazed: true, glass: BLUE });
  for (const lat of [-2.05, 2.05]) {
    F.put(0x413b30, lat, 2.0, 0.22, 1.15, 1.48, 0.025);
    F.put(0xb4d0c6, lat, 2.0, 0.24, 0.93, 1.18, 0.025);
    F.put(0x514535, lat, 1.34, 0.3, 1.25, 0.18, 0.36);
    F.put(0xd2a958, lat, 1.46, 0.33, 1.1, 0.06, 0.29);
    for (let i = 0; i < 5; i++) F.put([0xc74737, 0x4f9851, 0x307aa2, 0xe6bf51, 0xe4e0d1][i], lat - 0.45 + i * 0.22, 1.75 + (i % 2) * 0.18, 0.31, 0.14, 0.22, 0.16);
  }
  stripedAwning(kit, 0, 3.25, 2.05, 6.2, 0.9, 0.32, 0x3e5554, 0xf2e5c7);
  box(0x554633, 0, 4.77, 2.14, 4.05, 0.62, 0.12);
  box(0xd7c48a, 0, 4.77, 2.22, 3.86, 0.46, 0.04);
  sign(kit, "DUTY FREE", 0, 4.78, 2.25, 0.075, 0x9a3e34, 0xd7c48a);
  box(0x9c3d32, 0, 4.38, 2.19, 1.6, 0.06, 0.03);
  for (const side of [-1, 1]) {
    const x = side * 3.01;
    box(0xd7c48a, x, 3.25, -0.45, 0.05, 0.68, 3.15);
    box(0x726247, x + side * 0.04, 3.25, -0.45, 0.025, 0.46, 2.75);
    box(0xb44335, x + side * 0.06, 3.25, -0.45, 0.02, 0.08, 2.45);
    box(0x47756a, x + side * 0.08, 3.85, 1.8, 0.06, 0.35, 0.62);
    for (const y of [0.93, 1.08, 1.23]) box(0x71624a, x + side * 0.1, y, -0.7, 0.04, 0.035, 0.65);
  }
  for (const x of [-2.38, 2.38]) {
    box(0x8c633e, x, 0.42, 3.05, 1.32, 0.12, 0.66);
    for (const dx of [-0.52, 0.52]) for (const z of [2.83, 3.27]) box(0x755338, x + dx, 0.25, z, 0.07, 0.36, 0.07);
    box(0x547b70, x, 0.52, 3.05, 1.25, 0.08, 0.58);
    for (let i = 0; i < 5; i++) {
      const col = [0xe1ad43, 0xc84b36, 0x3d7b79, 0x527f46, 0xd7c28d][i];
      box(col, x - 0.48 + i * 0.24, 0.81 + (i % 2) * 0.08, 3.03, 0.2, 0.42, 0.22);
      box(0xf0dda8, x - 0.48 + i * 0.24, 1.04 + (i % 2) * 0.08, 3.15, 0.1, 0.035, 0.02);
    }
  }
  for (const x of [-3.35, 3.35]) {
    plant(kit, x, 2.95, 0.12, 0x9a553b, [0xd95540, 0xe3c556, 0xf4eee1], 0.78);
    wallLamp(face(kit, x < 0 ? -3.01 : 3.01, -0.55, x < 0 ? -Math.PI / 2 : Math.PI / 2), 0.3, 3.15);
  }
  const B = face(kit, 0, -3.11, Math.PI);
  door(B, -1.7, 0.35, 0.9, 2.2, { leaf: 0x756047, frame: PALE, trim: 0x514331 });
  for (const x of [-2.4, 2.4]) {
    box(0x8e8d81, x, 4.42, -1.5, 0.8, 0.16, 0.75);
    for (let i = -2; i <= 2; i++) box(0x55584f, x + i * 0.12, 4.53, -1.5, 0.035, 0.04, 0.55);
  }
  box(0x49654f, 2.45, 0.5, -2.3, 0.92, 0.9, 0.75);
  box(0x323d32, 2.45, 0.97, -2.3, 1.0, 0.08, 0.83);
  solid(new THREE.CylinderGeometry(0.1, 0.1, 0.35, 8), 0x323d32, 2.8, 0.12, -2.55);
}
