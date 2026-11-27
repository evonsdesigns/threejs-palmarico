import * as THREE from "three";
import type { Kit } from "./kit";
import { bench, beam, face, plant, wallLamp } from "./services-parts";
import { archedDoor, cross, stairs, windowBay } from "./human-services-parts";

const WALL = 0xe9e9df;
const TRIM = 0xf6f4eb;
const BLUE = 0x73949a;
const RED = 0xb83432;
const CONCRETE = 0xbcb9af;

export function buildHospital(kit: Kit) {
  const { box, solid } = kit;
  box(0xc8bea7, 0, 0.045, 0, 15.7, 0.09, 15.7);
  box(0xd4cbb7, 0, 0.1, 0, 14.8, 0.035, 14.8);
  for (let x = -7.3; x <= 7.3; x += 0.7) box(0xc2b69a, x, 0.12, 0, 0.025, 0.012, 14.8);
  for (let z = -7.3; z <= 7.3; z += 0.7) box(0xc2b69a, 0, 0.12, z, 14.8, 0.012, 0.025);
  box(0x929087, 2.4, 0.14, 4.85, 8.4, 0.06, 3.3);
  for (const x of [-1.4, 6.2]) for (const z of [3.4, 6.25]) box(0xe4ddca, x, 0.17, z, 0.12, 0.02, 0.12);
  for (const x of [0.2, 1.5, 2.8, 4.1, 5.4]) box(0xf0eee7, x, 0.18, 4.86, 0.08, 0.025, 3.15);

  const cx = -0.5, cz = -2.35, w = 11.4, d = 8.5, zFront = cz + d / 2, zBack = cz - d / 2;
  box(CONCRETE, cx, 0.32, cz, w + 0.28, 0.55, d + 0.28);
  box(WALL, cx, 4.95, cz, w, 8.75, d);
  for (const y of [0.88, 3.72, 6.6, 9.5]) box(BLUE, cx, y, cz, w + 0.12, 0.26, d + 0.12);
  for (const y of [3.28, 6.16, 9.03]) box(TRIM, cx, y, cz, w + 0.18, 0.14, d + 0.18);
  box(WALL, cx, 9.78, cz, w + 0.24, 0.34, d + 0.24);
  box(0xd0cec6, cx, 10.02, cz, w + 0.48, 0.16, d + 0.48);
  box(0x777b79, cx, 10.12, cz, w - 0.7, 0.1, d - 0.7);
  for (const z of [zFront - 0.25, zBack + 0.25]) box(WALL, cx, 10.32, z, w + 0.6, 0.46, 0.25);
  for (const x of [cx - w / 2 + 0.25, cx + w / 2 - 0.25]) box(WALL, x, 10.32, cz, 0.25, 0.46, d - 0.5);

  for (const y of [2.05, 4.9, 7.76]) {
    const F = face(kit, cx, zFront + 0.04, 0);
    for (let x = -4.7; x <= 4.1; x += 1.48) {
      if (y === 2.05 && Math.abs(x) < 1.2) continue;
      windowBay(F, x, y, 0.88, 1.45, BLUE, 0x507987);
    }
    const B = face(kit, cx, zBack - 0.04, Math.PI);
    for (let x = -4.4; x <= 4.0; x += 1.45) windowBay(B, -x, y, 0.86, 1.4, BLUE, 0x507987);
  }
  for (const side of [-1, 1]) {
    const x = cx + side * (w / 2 + 0.04);
    const F = face(kit, x, cz, side > 0 ? Math.PI / 2 : -Math.PI / 2);
    for (const y of [2.05, 4.9, 7.76]) for (const z of [-4.2, -2.7, -0.4]) windowBay(F, -z, y, 0.9, 1.45, BLUE, 0x507987);
    for (let yy = 1.2; yy < 9.0; yy += 2.84) box(TRIM, x, yy, cz, 0.25, 0.12, d + 0.12);
  }

  const front = face(kit, cx, zFront + 0.04, 0);
  archedDoor(front, 0, 0.52, 1.8, 2.45, 0x567174, TRIM);
  box(TRIM, cx, 3.2, zFront + 0.28, 4.1, 0.3, 0.62);
  box(BLUE, cx, 3.02, zFront + 0.38, 4.5, 0.1, 0.78);
  for (const x of [-2.4, 2.4]) {
    box(TRIM, x, 1.6, zFront + 0.48, 0.2, 2.75, 0.2);
    wallLamp(face(kit, x, zFront + 0.06, 0), 0, 3.05, 0xffe6a3);
  }
  stairs(kit, cx, zFront + 0.95, 4.8, 4, 0.2, 0.3, CONCRETE);
  for (const x of [-2.55, -1.3, 0, 1.3, 2.55]) {
    box(TRIM, x, 3.75, zFront + 0.93, 0.16, 2.8, 0.16);
    box(BLUE, x, 5.18, zFront + 0.93, 0.18, 0.12, 0.18);
  }
  box(TRIM, 0, 5.18, zFront + 0.93, 5.2, 0.18, 0.18);
  box(TRIM, 0, 5.18, zFront + 1.82, 5.2, 0.2, 2.1);
  box(WALL, 0, 5.28, zFront + 1.82, 4.5, 0.12, 1.8);
  cross(kit, 0, 7.7, zFront + 0.15, 1.55, RED, 0.19);
  box(TRIM, 0, 6.8, zFront + 0.28, 1.55, 0.2, 0.22);
  for (const x of [-4.6, 4.7]) {
    box(TRIM, x, 1.7, zFront + 0.15, 0.18, 2.6, 0.2);
    box(BLUE, x, 3.0, zFront + 0.2, 0.35, 0.16, 0.3);
  }

  for (const x of [-4.7, 4.1]) {
    const ax = x;
    box(WALL, ax, 1.8, 2.0, 3.2, 3.0, 3.4);
    box(BLUE, ax, 0.7, 2.0, 3.3, 0.3, 3.5);
    box(TRIM, ax, 3.36, 2.0, 3.4, 0.18, 3.6);
    box(0xd1c9b8, ax, 3.48, 2.0, 3.2, 0.08, 3.4);
    for (const side of [-1, 1]) {
      const F = face(kit, ax + side * 1.62, 2.0, side > 0 ? Math.PI / 2 : -Math.PI / 2);
      windowBay(F, 0, 2.0, 0.95, 1.4, BLUE, 0x507987);
    }
    const F = face(kit, ax, 3.7, 0);
    windowBay(F, 0, 1.85, 0.9, 1.3, BLUE, 0x507987);
  }

  const ambulanceX = 4.75, ambulanceZ = 5.25;
  box(0xdddcd4, ambulanceX, 0.86, ambulanceZ, 3.35, 1.38, 1.65);
  box(0xf2f1e9, ambulanceX - 0.72, 1.62, ambulanceZ, 1.9, 0.32, 1.63);
  box(0xe7e6de, ambulanceX + 0.52, 1.58, ambulanceZ, 1.05, 0.85, 1.6);
  box(0x567c8c, ambulanceX + 0.53, 1.65, ambulanceZ + 0.82, 0.8, 0.58, 0.05);
  box(0x567c8c, ambulanceX + 0.53, 1.65, ambulanceZ - 0.82, 0.8, 0.58, 0.05);
  box(RED, ambulanceX - 0.15, 0.94, ambulanceZ + 0.85, 1.25, 0.38, 0.07);
  box(RED, ambulanceX - 0.15, 0.94, ambulanceZ - 0.85, 1.25, 0.38, 0.07);
  cross(kit, ambulanceX - 0.18, 0.84, ambulanceZ + 0.9, 0.72, 0xffffff, 0.12);
  cross(kit, ambulanceX - 0.18, 0.84, ambulanceZ - 0.9, 0.72, 0xffffff, 0.12);
  box(0xece9df, ambulanceX + 0.54, 2.1, ambulanceZ, 0.88, 0.13, 0.22);
  box(RED, ambulanceX + 0.54, 2.21, ambulanceZ, 0.2, 0.1, 0.2);
  for (const x of [ambulanceX - 0.95, ambulanceX + 1.05]) {
    for (const side of [-1, 1]) {
      solid(new THREE.CylinderGeometry(0.39, 0.39, 0.24, 12), 0x323535, x, 0.48, ambulanceZ + side * 0.72).rotation.z = Math.PI / 2;
      solid(new THREE.CylinderGeometry(0.2, 0.2, 0.26, 10), 0xaaa99f, x, 0.48, ambulanceZ + side * 0.73).rotation.z = Math.PI / 2;
    }
  }
  box(0x343b3c, ambulanceX - 1.69, 0.72, ambulanceZ, 0.1, 0.22, 1.4);
  for (const x of [-6.6, 0.4]) {
    plant(kit, x, 4.45, 0.13, 0x975e3c, [0xd95249, 0xe7c34a], 0.72);
    box(0x8e8d82, x, 0.45, 4.0, 0.3, 0.9, 0.3);
  }
  bench(kit, -3.1, 4.6, 0.14, 2.0);
  for (const x of [-6.8, 6.8]) {
    box(0x81765f, x, 0.28, -5.9, 0.55, 0.56, 0.55);
    box(0x4c7a4c, x, 0.75, -5.9, 0.72, 0.45, 0.72);
  }
  beam(kit, 0xc3b89f, [-7.2, 0.25, 6.8], [-7.2, 0.25, -6.8], 0.13);
  beam(kit, 0xc3b89f, [7.2, 0.25, 6.8], [7.2, 0.25, -6.8], 0.13);
  return kit.finish();
}
