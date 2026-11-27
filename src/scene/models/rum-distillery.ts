import * as THREE from "three";
import type { Kit } from "./kit";
import { INDUSTRY as C, barrelCluster, chimney, crate, floor, lamp, loadingDoor, pipe, shed, tank } from "./industry-parts";

export function buildRumDistillery(kit: Kit) {
  const { box, solid } = kit;
  floor(kit, 15.6, 15.6, 0xb9a98a);
  const hall = shed(kit, -1.15, -1.0, 9.2, 8.0, 4.1, C.brick, C.green, 2.0);
  loadingDoor(kit, -1.15, 0.7, hall.front + 0.1, 2.1, 3.0, C.green);
  for (const x of [-4.3, -2.5, 0.2, 2.0]) {
    box(C.green, x, 3.9, hall.front + 0.15, 1.1, 0.11, 0.08);
    box(C.steelLight, x, 4.9, hall.front + 0.12, 0.08, 0.12, 0.08);
  }
  chimney(kit, -6.1, -2.3, 10.1, C.brickDark);
  for (const [x, z, r, h] of [[4.25, -3.1, 0.68, 3.0], [6.15, -3.0, 0.75, 2.5], [4.25, -0.9, 0.7, 2.2]]) {
    tank(kit, x, z, 0.05, r, h, C.steelLight, "dome");
    box(C.copper, x, 0.55, z + r + 0.15, r * 1.8, 0.12, 0.14);
  }
  for (const [x, z] of [[-5.0, 3.5], [-2.4, 3.5], [0.2, 3.5]]) {
    solid(new THREE.CylinderGeometry(0.58, 0.72, 1.7, 10), C.copper, x, 0.98, z);
    solid(new THREE.CylinderGeometry(0.72, 0.58, 0.25, 10), C.copperLight, x, 1.95, z);
    solid(new THREE.CylinderGeometry(0.22, 0.42, 0.55, 10), C.copper, x, 2.32, z);
    box(C.steel, x, 0.25, z, 1.55, 0.22, 1.55);
    for (const y of [0.5, 1.2, 1.85]) box(C.copperLight, x, y, z, 1.38, 0.055, 1.38);
    pipe(kit, [[x, 2.58, z], [x, 3.6, z], [x + 0.7, 3.6, z], [x + 0.7, 3.2, z - 0.3]], C.copper, 0.08);
  }
  for (const z of [-3.6, -1.9, -0.2]) {
    box(C.steel, 3.1, 0.35, z, 0.16, 0.7, 0.16);
    box(C.steel, 7.0, 0.35, z, 0.16, 0.7, 0.16);
    box(C.copper, 5.05, 0.78, z, 4.2, 0.18, 0.58);
    for (let x = 3.5; x < 6.9; x += 0.4) box(C.steelLight, x, 0.9, z, 0.08, 0.08, 0.58);
  }
  pipe(kit, [[3.5, 3.3, -3.1], [3.5, 4.5, -3.1], [5.0, 4.5, -3.1], [5.0, 3.3, -3.1], [6.1, 3.3, -3.0]], C.copper, 0.09);
  barrelCluster(kit, -4.4, 5.0, 6, C.wood);
  barrelCluster(kit, 1.2, 5.0, 6, C.woodLight);
  crate(kit, 6.1, 4.8, 0, 0.8, 0.76, 0.8, true);
  crate(kit, 7.0, 4.8, 0, 0.8, 0.76, 0.8);
  for (const x of [-7.0, -3.0, 1.0, 6.9]) lamp(kit, x, 6.7);
  for (const x of [-7.4, 7.4]) {
    for (let z = -6.4; z <= 6.4; z += 1.6) box(C.shadow, x, 0.62, z, 0.13, 1.2, 0.13);
    box(C.steel, x, 1.24, 0, 0.1, 0.08, 12.8);
  }
  for (const z of [-6.4, 6.4]) {
    for (let x = -7.4; x <= 7.4; x += 1.6) box(C.shadow, x, 0.62, z, 0.13, 1.2, 0.13);
    box(C.steel, 0, 1.24, z, 14.8, 0.08, 0.1);
  }
  box(C.cream, 5.0, 4.3, 0.6, 3.6, 0.28, 0.6);
  for (const x of [3.5, 4.5, 5.5, 6.5]) box(C.green, x, 4.45, 0.6, 0.12, 0.08, 0.5);
}
