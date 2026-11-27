import * as THREE from "three";
import type { Kit } from "./kit";
import { INDUSTRY as C, crate, floor, lamp, loadingDoor, pipe, shed } from "./industry-parts";

export function buildFurnitureFactory(kit: Kit) {
  const { box, solid } = kit;
  floor(kit, 15.6, 11.6, 0xb5a587);
  const hall = shed(kit, -2.0, -1.05, 9.4, 7.4, 4.0, C.timber, C.roof, 1.8);
  loadingDoor(kit, -2.0, 0.65, hall.front + 0.08, 2.2, 2.9, C.timber);
  for (const x of [-5.0, 1.0]) {
    box(C.cream, x, 0.18, 3.55, 2.2, 0.28, 1.1);
    for (let i = 0; i < 8; i++) box(C.woodLight, x, 0.4 + i * 0.18, 3.35 + (i % 2) * 0.34, 1.85, 0.13, 0.82);
    for (const z of [3.0, 3.75]) box(C.wood, x, 0.83, z, 0.08, 1.55, 0.08);
  }
  for (const [x, z] of [[-5.8, -4.8], [-4.7, -4.8], [5.1, 3.6], [6.4, 3.6]]) {
    box(C.wood, x, 0.65, z, 0.7, 1.2, 0.09, 0, Math.PI / 2);
    box(C.woodLight, x, 1.3, z, 0.76, 0.08, 0.13);
    for (const dx of [-0.22, 0, 0.22]) box(C.timber, x + dx, 0.65, z + 0.07, 0.035, 1.05, 0.03);
  }
  for (const x of [-5.5, 0.4]) {
    box(C.steel, x, 0.4, 4.75, 0.12, 0.8, 0.12);
    box(C.steel, x + 1.1, 0.4, 4.75, 0.12, 0.8, 0.12);
    box(C.steelLight, x + 0.55, 0.8, 4.75, 1.3, 0.13, 0.16);
    for (let i = 0; i < 5; i++) box(C.woodLight, x + 0.15 + i * 0.2, 0.93, 4.75, 0.16, 0.08, 0.24);
  }
  const finishing = shed(kit, 5.1, -1.4, 3.8, 5.5, 3.2, C.brick, C.green, 1.25);
  loadingDoor(kit, 5.1, 0.65, finishing.front + 0.08, 1.5, 2.35, C.green);
  for (const x of [4.1, 5.1, 6.1]) {
    box(C.timber, x, 2.3, finishing.front + 0.35, 0.42, 0.65, 0.06);
    box(C.woodLight, x, 2.6, finishing.front + 0.39, 0.32, 0.08, 0.04);
    box(C.woodLight, x, 2.14, finishing.front + 0.39, 0.36, 0.08, 0.04);
  }
  for (const z of [-3.4, -1.6]) {
    const gear = new THREE.CylinderGeometry(0.35, 0.35, 0.09, 12);
    const wheel = solid(gear, C.steel, 5.1, 1.35, z);
    wheel.rotation.z = Math.PI / 2;
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4;
      box(C.steelLight, 5.1 + Math.cos(a) * 0.3, 1.35 + Math.sin(a) * 0.3, z, 0.06, 0.06, 0.08);
    }
  }
  crate(kit, 7.35, 2.1, 0, 0.75, 0.68, 0.7, true);
  crate(kit, 7.35, 2.9, 0.02, 0.75, 0.68, 0.7);
  pipe(kit, [[-6.1, 4.2, -4.7], [-6.1, 5.1, -4.7], [-4.1, 5.1, -4.7]], C.steel, 0.07);
  for (const x of [-6.8, -1.8, 3.2, 7.1]) lamp(kit, x, -4.95);
  box(C.cream, -2.0, 5.2, -1.0, 3.0, 0.2, 1.15);
  for (const x of [-3.0, -2.0, -1.0]) box(C.steelLight, x, 5.34, -1.0, 0.08, 0.08, 0.8);
}
