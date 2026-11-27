import * as THREE from "three";
import type { Kit } from "./kit";
import { INDUSTRY as C, crate, floor, lamp, loadingDoor, pipe, shed } from "./industry-parts";

export function buildLumberMill(kit: Kit) {
  const { box, solid } = kit;
  floor(kit, 19.6, 15.6, 0xb8a886);
  const mill = shed(kit, -1.35, -1.0, 10.7, 8.4, 4.0, C.timber, C.roof, 1.95);
  loadingDoor(kit, -1.35, 0.65, mill.front + 0.12, 2.45, 2.95, C.timber);
  for (const x of [-5.5, -3.4, 1.0, 3.0]) {
    box(C.steel, x, 2.9, mill.front + 0.16, 1.4, 1.45, 0.15);
    box(C.glass, x, 2.9, mill.front + 0.25, 1.1, 1.12, 0.04);
    for (const dx of [-0.5, 0, 0.5]) box(C.steelLight, x + dx, 2.9, mill.front + 0.3, 0.04, 1.1, 0.03);
  }
  for (let i = 0; i < 8; i++) {
    const x = -5.7 + i * 0.58;
    box(C.steel, x, 3.55, -0.8, 0.12, 4.9, 0.12);
    box(C.steel, x + 0.24, 1.1, -0.8, 0.08, 2.0, 0.08);
    box(C.steelLight, x, 5.95, -0.8, 0.45, 0.12, 0.13);
  }
  for (const z of [-3.7, -1.9, -0.1, 1.7]) {
    box(C.steel, -1.2, 0.34, z, 8.8, 0.14, 0.14);
    for (let x = -5.4; x <= 3.0; x += 0.6) {
      box(C.steelLight, x, 0.48, z, 0.06, 0.12, 0.42);
      box(C.woodLight, x, 0.63, z, 0.44, 0.16, 0.52);
    }
  }
  for (const x of [-6.5, 5.0, 6.6]) {
    for (let i = 0; i < 5; i++) {
      const log = solid(new THREE.CylinderGeometry(0.32, 0.36, 3.8, 8), C.timber, x + (i % 2) * 0.18, 0.43 + Math.floor(i / 2) * 0.65, -3.4 + (i % 2) * 0.45);
      log.rotation.z = Math.PI / 2;
      log.rotation.y = (i % 2) * 0.08;
      box(C.timberLight, x + (i % 2) * 0.18 + 1.9, 0.43 + Math.floor(i / 2) * 0.65, -3.4 + (i % 2) * 0.45, 0.045, 0.05, 0.05);
    }
  }
  for (let i = 0; i < 6; i++) {
    const x = 4.4 + (i % 3) * 0.82;
    const z = 2.8 + Math.floor(i / 3) * 0.62;
    box(C.wood, x, 0.24, z, 0.72, 0.42, 1.35, 0, (i % 2) * 0.15);
    for (const y of [0.5, 0.75]) box(C.woodLight, x, y, z, 0.75, 0.07, 1.38, 0, (i % 2) * 0.15);
  }
  for (const x of [-5.9, -4.7, 3.9, 5.3]) {
    box(C.steel, x, 0.72, 5.5, 0.12, 1.4, 0.12);
    box(C.steel, x + 0.75, 0.72, 5.5, 0.12, 1.4, 0.12);
    box(C.steelLight, x + 0.37, 1.48, 5.5, 0.95, 0.12, 0.15);
    crate(kit, x + 0.37, 5.5, 0.0, 0.7, 0.68, 0.65);
  }
  pipe(kit, [[-6.3, 3.5, -4.1], [-6.3, 4.5, -4.1], [-4.7, 4.5, -4.1]], C.steel, 0.07);
  const stack = solid(new THREE.CylinderGeometry(0.32, 0.4, 5.5, 10), C.brick, 3.7, 3.15, -3.2);
  stack.rotation.z = Math.PI / 2;
  box(C.steel, 3.7, 5.95, -3.2, 0.9, 0.2, 0.9);
  for (const x of [-8.7, -2.5, 3.2, 8.5]) lamp(kit, x, 6.4);
  for (const x of [-8.8, 8.8]) {
    for (const z of [-6.8, -4.5, -2.2, 0.1, 2.4, 4.7, 6.8]) box(C.steel, x, 0.68, z, 0.12, 1.3, 0.12);
    box(C.steelLight, x, 1.33, 0, 0.08, 0.06, 13.6);
  }
  box(C.steel, -0.2, 0.2, 6.9, 16.8, 0.3, 0.15);
}
