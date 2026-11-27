import * as THREE from "three";
import type { Kit } from "./kit";
import { bench, plant } from "./services-parts";
import { beam, sign } from "./tourism-a-parts";

const STONE = 0xaaa18d;
const WOOD = 0x76513a;
const TILE = 0x914333;

export function buildScenicOutlook(kit: Kit) {
  const { box, solid } = kit;
  box(0xd0bc91, 0, 0.035, 0, 7.8, 0.07, 7.8);
  solid(new THREE.CylinderGeometry(3.55, 3.7, 0.22, 12), 0xb9aa8e, 0, 0.16, -0.05);
  solid(new THREE.CylinderGeometry(3.32, 3.32, 0.1, 12), 0xceb797, 0, 0.31, -0.05);
  for (let x = -2.6; x <= 2.6; x += 0.55) for (let z = -2.3; z <= 2.3; z += 0.58) {
    if (x * x + z * z > 9.5) continue;
    box((Math.round((x + z) * 10) % 2) ? 0xd7c5a5 : 0xc6b18f, x, 0.38, z - 0.05, 0.5, 0.025, 0.52);
  }
  for (let i = 0; i < 9; i++) {
    const a = Math.PI * 0.18 + i * Math.PI * 0.08;
    const x = Math.sin(a) * 3.25;
    const z = Math.cos(a) * 3.25 + 0.1;
    const yaw = -a;
    box(STONE, x, 0.67, z, 0.74, 0.62, 0.46, 0, yaw);
    box(0xc8beaa, x, 1.0, z, 0.82, 0.08, 0.5, 0, yaw);
    box(0x898273, x, 0.38, z, 0.76, 0.08, 0.48, 0, yaw);
  }
  for (const x of [-1.25, 1.25]) for (const z of [-1.35, 1.0]) {
    box(WOOD, x, 1.92, z, 0.24, 3.12, 0.24);
    box(0x9b7049, x, 0.49, z, 0.48, 0.18, 0.48);
    box(0x9b7049, x, 3.36, z, 0.42, 0.16, 0.42);
  }
  box(0x936748, 0, 3.42, -0.18, 3.05, 0.2, 2.8);
  const gazeboRoof = solid(new THREE.ConeGeometry(2.15, 1.15, 4), TILE, 0, 4.05, -0.18);
  gazeboRoof.rotation.y = Math.PI / 4;
  for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4;
    beam(kit, i % 2 ? 0x783a2d : 0xb35a3d, [0, 3.57, -0.18], [Math.cos(a) * 2.05, 4.48, -0.18 + Math.sin(a) * 2.05], 0.08);
  }
  for (const x of [-1.28, 1.28]) {
    box(0xc8b287, x, 2.0, -0.15, 0.08, 1.25, 0.08);
    box(WOOD, x, 2.62, -0.15, 0.58, 0.1, 0.62);
    box(0x6c4835, x, 2.22, 0.17, 0.58, 0.66, 0.08);
  }
  box(0xbba77f, 0, 4.62, -0.18, 0.7, 0.16, 0.7);
  bench(kit, 0, 1.83, 0.4, 1.5, Math.PI, 0x8b5940);
  bench(kit, -2.55, -0.35, 0.4, 1.4, Math.PI / 2, 0x8b5940);
  sign(kit, "VIEW", 0, 2.55, 1.17, 0.08, 0x355d59, 0xe4d2a6);
  sign(kit, "SCENIC", 0, 1.9, -1.49, 0.065, 0x355d59, 0xe4d2a6, Math.PI);

  for (const x of [-2.05, 2.05]) {
    box(0x807d72, x, 0.57, 2.16, 0.52, 0.28, 0.5);
    box(0x474b49, x, 1.38, 2.16, 0.14, 1.45, 0.14);
    box(0x9a9a8b, x, 1.4, 2.16, 0.24, 0.12, 0.24);
    box(0xb89c55, x, 1.93, 2.48, 0.22, 0.2, 0.48, -0.35);
    box(0x6c706c, x, 2.05, 2.68, 0.18, 0.22, 0.16, -0.35);
    for (const dx of [-0.09, 0.09]) {
      const lens = solid(new THREE.CylinderGeometry(0.085, 0.085, 0.12, 10), 0x42565a, x + dx, 2.04, 2.78);
      lens.rotation.x = Math.PI / 2;
    }
    box(0xd9bd6c, x + 0.22, 1.63, 2.13, 0.12, 0.22, 0.12);
    box(0x8c7854, x + 0.22, 1.64, 2.21, 0.3, 0.08, 0.08);
  }
  for (const side of [-1, 1]) {
    for (let z = -1.7; z <= 2.0; z += 0.55) {
      box(0x665a48, side * 3.0, 0.96, z, 0.08, 1.0, 0.08);
      box(0xe7dcbf, side * 3.0, 1.48, z, 0.11, 0.08, 0.11);
    }
    box(0x6f604d, side * 3.0, 1.42, 0.0, 0.08, 0.08, 3.9);
    box(0x6f604d, side * 3.0, 0.56, 0.0, 0.08, 0.08, 3.9);
  }
  for (let x = -2.8; x <= 2.8; x += 0.56) {
    if (Math.abs(x) < 1.65) continue;
    box(0x665a48, x, 0.96, 2.82, 0.08, 1.0, 0.08);
    box(0x6f604d, x, 1.42, 2.82, 0.56, 0.08, 0.08);
    box(0x6f604d, x, 0.56, 2.82, 0.56, 0.08, 0.08);
  }
  for (const x of [-3.1, 3.1]) {
    box(0x96836a, x, 0.56, 0.2, 0.66, 0.44, 0.66);
    plant(kit, x, 0.2, 0.81, 0x9d6841, [0xf0ce49, 0xd94e48], 0.7);
  }
  box(0xb8a37e, 0, 0.1, 3.35, 1.5, 0.2, 0.48);
  for (let z = 2.6; z < 3.6; z += 0.23) box(0xcdbb97, 0, 0.22, z, 1.25, 0.04, 0.06);
}
