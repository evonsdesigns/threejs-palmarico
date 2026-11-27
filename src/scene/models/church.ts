import * as THREE from "three";
import type { Kit } from "./kit";
import { bench, face, plant, wallLamp } from "./services-parts";
import { arch, archedDoor, cross, gableRoof, windowBay } from "./human-services-parts";

const WALL = 0xe9e3d3;
const TRIM = 0xf6f0df;
const STONE = 0xb9a98b;
const TILE = 0xa64f32;

export function buildChurch(kit: Kit) {
  const { box, solid } = kit;
  box(0xc8b995, 0, 0.06, 0, 15.7, 0.12, 11.7);
  box(0xd8c9a9, 0, 0.13, 3.2, 14.8, 0.06, 4.8);
  for (let x = -7.3; x <= 7.3; x += 0.72) box(0xc5b58f, x, 0.17, 3.15, 0.035, 0.012, 4.65);
  for (let z = 0.95; z <= 5.35; z += 0.72) box(0xc5b58f, 0, 0.17, z, 14.8, 0.012, 0.035);
  for (let x = -7.4; x <= 7.4; x += 1.4) {
    box(0xb9a884, x, 0.28, 5.55, 0.12, 0.5, 0.12);
    box(STONE, x, 0.57, 5.55, 0.24, 0.12, 0.24);
  }
  box(STONE, 0, 0.25, 5.55, 14.8, 0.34, 0.16);
  box(STONE, 0, 0.47, 5.55, 14.8, 0.08, 0.2);

  box(STONE, 0, 0.35, -1.15, 10.1, 0.55, 9.0);
  box(WALL, 0, 3.2, -1.15, 9.6, 5.2, 8.6);
  box(TRIM, 0, 5.85, -1.15, 9.9, 0.26, 8.9);
  box(0xd9d0bc, 0, 0.76, -1.15, 9.76, 0.22, 8.75);
  gableRoof(kit, 0, -5.55, 3.05, 5.05, 5.95, 2.35, TILE, 0x87432e);
  for (const z of [-5.45, 2.95]) {
    box(TRIM, 0, 6.0, z, 10.2, 0.26, 0.24);
    for (const x of [-4.6, -2.4, 0, 2.4, 4.6]) box(STONE, x, 3.15, z + (z > 0 ? 0.08 : -0.08), 0.2, 4.7, 0.18);
  }
  box(WALL, 0, 6.5, 2.87, 4.0, 0.85, 0.18);
  for (let x = -1.85; x <= 1.85; x += 0.3) {
    const h = 0.9 * (1 - Math.abs(x) / 2);
    if (h > 0.1) box(WALL, x, 6.9 + h / 2, 2.87, 0.32, h, 0.18);
  }
  box(TRIM, 0, 6.92, 3.0, 4.2, 0.16, 0.3);

  const front = face(kit, 0, 3.18, 0);
  for (const x of [-4.05, 4.05]) {
    front.put(STONE, x, 3.25, 0.08, 0.56, 5.2, 0.38);
    for (let y = 0.95; y < 5.8; y += 0.8) front.put(TRIM, x, y, 0.29, 0.66, 0.12, 0.46);
  }
  archedDoor(front, 0, 0.45, 2.1, 2.55, 0x543a2d, STONE);
  arch(front, 0, 3.0, 1.2, 0.18, TRIM, 0.22);
  windowBay(front, -2.55, 2.6, 0.9, 1.65, STONE, 0x567b7c);
  windowBay(front, 2.55, 2.6, 0.9, 1.65, STONE, 0x567b7c);
  wallLamp(front, -1.6, 2.65);
  wallLamp(front, 1.6, 2.65);
  box(TRIM, 0, 3.35, 3.29, 0.22, 0.18, 0.15);
  for (const x of [-3.25, 3.25]) {
    box(STONE, x, 0.85, 3.38, 0.36, 1.0, 0.45);
    box(TRIM, x, 1.39, 3.38, 0.56, 0.12, 0.55);
  }
  cross(kit, 0, 4.35, 3.22, 1.35, 0xc3a65c, 0.12);

  for (const side of [-1, 1]) {
    const F = face(kit, side * 4.84, -1.15, side > 0 ? Math.PI / 2 : -Math.PI / 2);
    for (const z of [-4.2, -2.0, 0.2, 2.0]) {
      windowBay(F, z + 1.15, 3.15, 0.85, 1.5, STONE, 0x547b80);
      box(STONE, z + 1.15, 0.88, 0.18, 1.05, 0.2, 0.32);
    }
    for (const z of [-5.0, -2.9, -0.75, 1.45]) F.put(TRIM, z + 1.15, 3.2, 0.07, 0.18, 5.1, 0.22);
  }
  const back = face(kit, 0, -5.55, Math.PI);
  windowBay(back, -2.1, 3.0, 1.05, 1.55, STONE, 0x547b80);
  windowBay(back, 2.1, 3.0, 1.05, 1.55, STONE, 0x547b80);

  const tx = -4.55, tz = 2.05;
  box(STONE, tx, 0.56, tz, 3.25, 1.12, 3.25);
  box(WALL, tx, 3.05, tz, 2.75, 4.0, 2.75);
  box(TRIM, tx, 5.1, tz, 3.0, 0.2, 3.0);
  for (const side of [-1, 1]) {
    const F = face(kit, tx + side * 1.39, tz, side > 0 ? Math.PI / 2 : -Math.PI / 2);
    F.put(STONE, 0, 3.0, 0.08, 0.82, 2.4, 0.16);
    F.put(0x413b32, 0, 3.0, 0.19, 0.52, 1.95, 0.08);
    F.put(TRIM, 0, 4.27, 0.22, 0.86, 0.16, 0.24);
    F.put(TRIM, 0, 1.72, 0.22, 0.86, 0.16, 0.24);
  }
  for (const y of [5.45, 8.65, 12.35]) {
    const w = y > 10 ? 2.2 : 2.95;
    const d = y > 10 ? 2.2 : 2.95;
    box(WALL, tx, y + 1.35, tz, w, 2.7, d);
    box(TRIM, tx, y, tz, w + 0.3, 0.22, d + 0.3);
    for (const side of [-1, 1]) for (const f of [0, Math.PI / 2]) {
      const F = face(kit, tx + side * (f === 0 ? w / 2 + 0.04 : 0), tz + side * (f === 0 ? 0 : d / 2 + 0.04), f === 0 ? side * Math.PI / 2 : (side > 0 ? 0 : Math.PI));
      F.put(TRIM, 0, y + 1.32, 0.1, 0.62, 2.1, 0.16);
      F.put(0x403b33, 0, y + 1.32, 0.2, 0.34, 1.75, 0.06);
      F.put(STONE, 0, y + 2.45, 0.24, 0.7, 0.15, 0.22);
    }
  }
  solid(new THREE.CylinderGeometry(1.05, 1.18, 0.5, 10), TILE, tx, 15.05, tz);
  solid(new THREE.ConeGeometry(1.02, 1.3, 8), 0x46534c, tx, 15.9, tz);
  solid(new THREE.CylinderGeometry(0.13, 0.13, 1.05, 6), 0xc9bd9e, tx, 16.02, tz);
  cross(kit, tx, 16.55, tz, 0.78, 0xc9bd9e, 0.12);

  for (const [x, z] of [[-6.7, 4.45], [6.7, 4.45], [-6.9, -4.7], [6.9, -4.7]]) plant(kit, x, z, 0.16, 0x9a6242, [0xe1b64e, 0xd55c50, 0xe7d59b], 0.75);
  bench(kit, -2.1, 4.7, 0.18, 2.2);
  bench(kit, 2.1, 4.7, 0.18, 2.2);
  return kit.finish();
}
