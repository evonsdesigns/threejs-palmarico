import * as THREE from "three";
import type { Kit } from "./kit";
import { bench, beam, face, plant, wallLamp } from "./services-parts";
import { archedDoor, cross, windowBay } from "./human-services-parts";

const WALL = 0xe9e0ca;
const TRIM = 0xf1ead8;
const BLUE = 0x66869a;
const DARK = 0x353c3d;

export function buildHighSchool(kit: Kit) {
  const { box, solid } = kit;
  box(0xc9bb9e, 0, 0.045, 0, 15.7, 0.09, 11.7);
  box(0xd7c9a9, 0, 0.1, 0.3, 14.8, 0.035, 5.2);
  for (let x = -7.3; x <= 7.3; x += 0.65) box(0xc5b58f, x, 0.125, 0.3, 0.025, 0.012, 5.2);
  for (let z = -2.15; z <= 2.8; z += 0.65) box(0xc5b58f, 0, 0.125, z, 14.8, 0.012, 0.025);
  box(0xb9ac91, 0, 0.12, -3.6, 14.7, 0.04, 4.1);
  for (let z = -5.35; z <= -1.6; z += 0.62) box(0xa89878, 0, 0.145, z, 14.7, 0.012, 0.035);

  const academicBlock = (x: number, z: number, w: number, d: number, frontZ: number, rearZ: number) => {
    box(0xb4a68a, x, 0.33, z, w + 0.2, 0.55, d + 0.2);
    box(WALL, x, 3.62, z, w, 6.0, d);
    box(BLUE, x, 0.82, z, w + 0.08, 0.38, d + 0.08);
    box(TRIM, x, 6.68, z, w + 0.2, 0.24, d + 0.2);
    box(0x69716e, x, 6.86, z, w + 0.38, 0.1, d + 0.38);
    box(DARK, x, 6.96, z, w - 0.25, 0.12, d - 0.25);
    box(WALL, x, 7.2, frontZ + 0.12, w + 0.12, 0.5, 0.24);
    box(WALL, x, 7.2, rearZ - 0.12, w + 0.12, 0.5, 0.24);
    for (const y of [2.05, 5.0]) {
      const F = face(kit, x, frontZ + 0.03, 0);
      for (let px = -w / 2 + 0.9; px < w / 2 - 0.4; px += 1.65) {
        windowBay(F, px, y, 0.95, 1.45, BLUE, 0x4c7181);
      }
      const B = face(kit, x, rearZ - 0.03, Math.PI);
      for (let px = -w / 2 + 0.9; px < w / 2 - 0.4; px += 1.65) windowBay(B, -px, y, 0.95, 1.45, BLUE, 0x4c7181);
    }
    for (const side of [-1, 1]) {
      const X = x + side * (w / 2 + 0.03);
      const F = face(kit, X, z, side > 0 ? Math.PI / 2 : -Math.PI / 2);
      for (const yy of [2.05, 5.0]) {
        for (let pz = -d / 2 + 0.85; pz < d / 2 - 0.35; pz += 1.5) windowBay(F, -pz, yy, 0.85, 1.4, BLUE, 0x4c7181);
      }
      for (const pz of [-d / 2 + 0.15, d / 2 - 0.15]) box(TRIM, X, 3.62, z + pz, 0.28, 5.85, 0.28);
    }
  };

  academicBlock(0, -3.35, 12.2, 4.15, -1.275, -5.425);
  academicBlock(-5.0, 0.0, 2.35, 3.0, 1.5, -1.5);
  academicBlock(5.0, 0.0, 2.35, 3.0, 1.5, -1.5);

  const entry = face(kit, 0, 1.55, 0);
  box(0x9a8b70, 0, 0.38, 1.68, 3.3, 0.62, 1.0);
  archedDoor(entry, 0, 0.55, 1.65, 2.35, 0x48515a, TRIM);
  box(BLUE, 0, 3.25, 1.68, 2.9, 0.22, 0.38);
  box(TRIM, 0, 3.53, 1.68, 3.25, 0.12, 0.48);
  for (const x of [-1.22, 1.22]) {
    box(TRIM, x, 1.8, 1.75, 0.2, 2.8, 0.32);
    box(BLUE, x, 3.27, 1.75, 0.34, 0.16, 0.42);
  }
  for (const x of [-3.65, 3.65]) {
    box(TRIM, x, 3.7, 1.25, 0.3, 6.8, 0.34);
    box(BLUE, x, 0.92, 1.25, 0.42, 0.36, 0.46);
    box(TRIM, x, 6.95, 1.25, 0.48, 0.18, 0.5);
  }
  for (const x of [-5.0, 5.0]) {
    const F = face(kit, x, 1.52, x < 0 ? -Math.PI / 2 : Math.PI / 2);
    wallLamp(F, 0, 3.0);
  }

  box(0x969184, 0, 0.11, 3.5, 12.8, 0.06, 3.8);
  box(0x6a8b92, 0, 0.15, 3.5, 11.6, 0.02, 2.8);
  for (const x of [-5.2, 5.2]) for (const z of [2.15, 4.85]) box(0xece7da, x, 0.45, z, 0.13, 0.8, 0.13);
  box(0xece7da, 0, 0.82, 2.15, 10.4, 0.08, 0.08);
  box(0xece7da, 0, 0.82, 4.85, 10.4, 0.08, 0.08);
  for (const x of [-4.3, 4.3]) {
    box(0x4b4340, x, 0.1, 3.4, 0.16, 0.16, 0.3);
    box(0x4b4340, x, 3.15, 3.4, 0.16, 0.16, 0.3);
  }
  box(0xf2eee3, 0, 0.11, 3.5, 0.18, 0.02, 2.1);
  box(0xf2eee3, 0, 0.11, 3.5, 10.1, 0.02, 0.18);
  for (const x of [-2.1, 2.1]) box(0xf2eee3, x, 0.11, 3.5, 0.14, 0.02, 2.7);

  box(0x7d6040, -5.7, 0.48, 2.95, 1.5, 0.95, 0.6);
  box(0xc4a36a, -5.7, 0.98, 2.95, 1.58, 0.08, 0.65);
  solid(new THREE.CylinderGeometry(0.06, 0.08, 3.4, 7), 0x72736c, 5.8, 1.85, 2.35);
  box(0x325a91, 5.25, 3.1, 2.3, 0.95, 0.72, 0.03);
  box(0xffffff, 5.25, 3.1, 2.28, 0.06, 0.72, 0.045);
  box(0xc83d36, 5.25, 3.1, 2.28, 0.95, 0.07, 0.045);
  for (const x of [-6.9, 6.9]) {
    box(0x887252, x, 0.45, 0.45, 0.72, 0.9, 0.72);
    box(0x5d8050, x, 1.15, 0.45, 0.9, 0.55, 0.9);
  }
  bench(kit, -2.5, 0.0, 0.12, 1.8);
  bench(kit, 2.5, 0.0, 0.12, 1.8);
  plant(kit, -7.15, -4.95, 0.16, 0x985e3b, [0xd9534f, 0xe1b64e], 0.65);
  plant(kit, 7.15, -4.95, 0.16, 0x985e3b, [0xd9534f, 0xe1b64e], 0.65);
  beam(kit, 0x756348, [-3.4, 6.9, -3.4], [3.4, 6.9, -3.4], 0.08);
  for (const x of [-3.4, 3.4]) box(0x777b79, x, 7.35, -3.4, 0.14, 0.9, 0.14);
  cross(kit, 0, 7.4, -3.4, 0.8, 0xc4ad66, 0.08);
  return kit.finish();
}
