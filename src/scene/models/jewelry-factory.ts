import * as THREE from "three";
import type { Kit } from "./kit";
import { INDUSTRY as C, crate, floor, lamp, loadingDoor, pipe, shed } from "./industry-parts";

export function buildJewelryFactory(kit: Kit) {
  const { box, solid } = kit;
  floor(kit, 11.6, 11.6, 0xb9ad91);
  const hall = shed(kit, -0.35, -1.15, 7.3, 7.1, 3.8, C.cream, C.steel, 1.7);
  loadingDoor(kit, -0.35, 0.65, hall.front + 0.1, 1.8, 2.75, C.green);
  for (const x of [-2.4, 1.7]) {
    box(C.stone, x, 0.2, 3.15, 1.1, 0.3, 1.25);
    box(C.gold, x, 0.43, 3.15, 0.75, 0.18, 0.9);
    box(C.gold, x - 0.19, 0.57, 3.15, 0.34, 0.1, 0.38, 0, Math.PI / 4);
    box(C.copper, x + 0.2, 0.59, 3.15, 0.26, 0.18, 0.3);
  }
  for (const x of [-2.6, -0.35, 1.9]) {
    box(C.steelLight, x, 4.95, -1.5, 1.4, 0.11, 1.0);
    box(0xacc3b0, x, 5.02, -1.5, 0.95, 0.05, 0.62);
    for (const dx of [-0.48, 0.48]) box(C.steel, x + dx, 5.12, -1.5, 0.08, 0.1, 0.72);
  }
  const forge = shed(kit, 4.1, -2.0, 2.3, 3.3, 2.5, C.brick, C.roof, 1.1);
  box(C.shadow, 4.1, 1.35, forge.front + 0.1, 0.85, 1.5, 0.12);
  for (const z of [-2.8, -1.1]) {
    box(C.steel, 4.25, 2.6, z, 0.8, 0.45, 0.7);
    solid(new THREE.CylinderGeometry(0.35, 0.35, 0.28, 8), C.copper, 4.25, 2.9, z);
  }
  for (let x = -5.2; x <= 5.2; x += 1.3) {
    box(C.steel, x, 0.72, 5.4, 0.08, 1.3, 0.08);
    box(C.steelLight, x, 1.4, 5.4, 0.12, 0.08, 0.12);
  }
  box(C.steel, 0, 0.82, 5.4, 10.4, 0.08, 0.08);
  for (const [x, z] of [[-4.3, 4.2], [4.1, 4.2], [-5.2, -4.8], [5.1, -4.8]]) lamp(kit, x, z);
  crate(kit, -4.9, 2.7, 0, 0.7, 0.62, 0.7, true);
  crate(kit, 4.9, 2.7, 0, 0.7, 0.62, 0.7, true);
  pipe(kit, [[-4.2, 3.7, -4.5], [-4.2, 4.8, -4.5], [-3.1, 4.8, -4.5]], C.steel, 0.07);
  box(C.cream, 4.1, 3.85, forge.front + 0.23, 1.25, 0.48, 0.08);
  box(C.gold, 4.1, 3.85, forge.front + 0.29, 0.28, 0.16, 0.03);
  box(C.green, 0.35, 0.56, 5.63, 2.4, 0.45, 0.08);
  box(C.cream, 0.35, 0.56, 5.69, 1.8, 0.12, 0.025);
}

