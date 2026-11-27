import * as THREE from "three";
import type { Kit } from "./kit";
import { INDUSTRY as C, barrel, barrelCluster, chimney, crate, floor, lamp, loadingDoor, pipe, shed } from "./industry-parts";

export function buildCigarFactory(kit: Kit) {
  const { box, solid } = kit;
  floor(kit, 15.6, 15.6, 0xaaa18d);
  const hall = shed(kit, -0.45, -1.05, 10.1, 9.5, 4.3, C.brick, C.roof, 2.1);
  box(C.stone, -0.45, 0.38, -1.05, 10.35, 0.38, 9.75);
  for (const x of [-4.45, 3.55]) box(C.paleStone, x, 2.5, hall.front + 0.11, 0.35, 4.3, 0.24);
  loadingDoor(kit, -0.45, 0.65, hall.front + 0.16, 2.5, 3.25, C.timber);
  for (const x of [-4.2, -2.3, 1.4, 3.3]) {
    kit.frontWindow(x, 2.8, hall.front + 0.1, 0.9, 1.55);
    box(C.brickDark, x, 4.03, hall.front + 0.18, 1.15, 0.12, 0.12);
  }
  for (const x of [-3.2, 2.3]) {
    const vent = solid(new THREE.CylinderGeometry(0.38, 0.38, 0.11, 12), C.steel, x, 5.7, hall.front + 0.09);
    vent.rotation.x = Math.PI / 2;
    box(C.shadow, x, 5.7, hall.front + 0.17, 0.24, 0.05, 0.03);
  }
  for (const side of [-1, 1]) {
    for (const y of [2.4, 3.7, 5.0]) box(C.green, side * 5.7, y, -1.05, 0.16, 0.16, 9.9);
    for (const z of [-5.4, -1.0, 3.3]) box(C.green, -0.45, 5.7, z, 10.2, 0.16, 0.16);
  }
  for (const x of [-5.2, 5.7]) chimney(kit, x, -2.2, x < 0 ? 8.6 : 6.7, C.brickDark);
  for (const x of [-5.1, 4.1]) {
    box(C.steel, x, 0.65, 4.8, 3.0, 1.3, 1.0);
    for (let dx = -1.25; dx <= 1.25; dx += 0.5) box(C.steelLight, x + dx, 0.72, 5.33, 0.06, 1.0, 0.06);
    box(C.steelLight, x, 1.32, 5.33, 3.1, 0.08, 0.08);
  }
  barrelCluster(kit, -3.1, 4.0, 6, C.wood);
  barrelCluster(kit, 2.4, 4.0, 3, C.wood);
  for (let i = 0; i < 5; i++) {
    box(C.timber, -5.8 + i * 0.55, 0.18, -6.5, 0.48, 0.32, 0.55);
    box(C.timberLight, -5.8 + i * 0.55, 0.37, -6.5, 0.48, 0.05, 0.55);
  }
  crate(kit, 5.8, 4.3, 0, 0.75, 0.72, 0.72, true);
  crate(kit, 6.0, 5.05, 0, 0.75, 0.72, 0.72);
  pipe(kit, [[-5.8, 2.4, 2.9], [-5.8, 4.9, 2.9], [-4.3, 4.9, 2.9], [-4.3, 5.5, 2.9]], C.steel, 0.07);
  for (const x of [-6.3, -0.1, 6.4]) lamp(kit, x, 6.4);
  box(C.brickDark, -0.45, 0.45, 6.15, 9.8, 0.6, 0.18);
  for (const x of [-5.7, -3.0, -0.45, 2.1, 4.8]) box(C.stone, x, 0.85, 6.15, 0.22, 1.7, 0.22);
  box(C.steel, -0.45, 1.7, 6.15, 9.8, 0.12, 0.18);
  for (const x of [-3.8, -0.45, 2.9]) barrel(kit, x, 6.8, 0, 0.8, C.woodLight);
}
