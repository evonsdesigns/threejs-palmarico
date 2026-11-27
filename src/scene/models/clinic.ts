import * as THREE from "three";
import type { Kit } from "./kit";
import { beam, bench, detailedWindow, face, stain, wallLamp, type Face } from "./services-parts";

const WALL = 0xe9c98d;
const TRIM = 0xd8c58e;
const RED = 0xa5423e;
const ROOF = 0x55574a;

function cross(F: Face, lat: number, y: number, size: number) {
  F.put(0xd8d0a6, lat, y, 0.035, size * 1.65, size * 1.65, 0.035);
  for (let row = -3; row <= 3; row++) {
    F.put(0xa6a383, lat, y + row * size * 0.21, 0.06, size * 1.5, 0.025, 0.025);
  }
  F.put(RED, lat, y, 0.085, size, size * 0.31, 0.035);
  F.put(RED, lat, y, 0.085, size * 0.31, size, 0.035);
}

export function buildClinic(kit: Kit) {
  const { box, solid } = kit;
  box(0xa59a7d, 0, 0.04, 0, 11.9, 0.08, 7.9);
  box(0xb9ac8e, 0, 0.095, 0, 11.65, 0.03, 7.65);

  const wing = (x: number, z: number, w: number, d: number, height: number) => {
    box(0x9e8a65, x, 0.22, z, w + 0.12, 0.3, d + 0.12);
    box(WALL, x, height / 2 + 0.14, z, w, height - 0.28, d);
    box(RED, x, 0.47, z, w + 0.04, 0.64, d + 0.04);
    box(0xc5ac77, x, height - 0.35, z, w + 0.18, 0.18, d + 0.18);
    box(TRIM, x, height - 0.16, z, w + 0.3, 0.22, d + 0.3);
    box(ROOF, x, height + 0.015, z, w - 0.22, 0.08, d - 0.22);
    for (const pz of [z - d / 2, z + d / 2]) {
      box(WALL, x, height + 0.27, pz, w + 0.14, 0.5, 0.18);
      box(TRIM, x, height + 0.55, pz, w + 0.26, 0.1, 0.28);
    }
    for (const px of [x - w / 2, x + w / 2]) {
      box(WALL, px, height + 0.27, z, 0.18, 0.5, d);
      box(TRIM, px, height + 0.55, z, 0.28, 0.1, d + 0.2);
      for (const pz of [z - d / 2, z + d / 2]) {
        box(0xcab984, px, height + 0.59, pz, 0.31, 0.16, 0.31);
        box(RED, px, height + 0.73, pz, 0.14, 0.15, 0.14);
        for (let y = 0.85; y < height - 0.4; y += 0.48) {
          box(y % 0.96 < 0.5 ? TRIM : 0xbbaa7f, px, y, pz, 0.3, 0.23, 0.3);
        }
      }
    }
    for (let pz = z - d / 2 + 0.45; pz < z + d / 2 - 0.3; pz += 0.7) {
      box(0x63634d, x, height + 0.065, pz, w - 0.4, 0.02, 0.025);
    }
    for (let i = 0; i < 16; i++) {
      const px = x + Math.sin(i * 5.17) * (w / 2 - 0.4);
      const pz = z + Math.cos(i * 3.71) * (d / 2 - 0.4);
      box(i % 2 ? 0x666651 : 0x454b41, px, height + 0.07, pz, 0.18 + i % 3 * 0.12, 0.015, 0.1 + i % 4 * 0.1);
    }
  };

  // A taller, deep entrance block and a lower treatment wing form the recessed forecourt.
  wing(-3.45, -0.3, 3.65, 6.35, 4.65);
  wing(1.75, -1.02, 6.75, 4.9, 3.35);

  const entry = face(kit, -3.45, 2.88, 0);
  cross(entry, 0, 3.37, 0.9);
  for (const lat of [-1.4, -0.7, 0, 0.7, 1.4]) {
    beam(kit, 0x9c895d, [-3.45 + lat, 4.05, 2.98], [-3.45 + lat, 4.4, 3.18], 0.09, 0.12);
  }
  entry.put(0x383c31, -0.2, 1.63, 0.035, 1.28, 2.25, 0.05);
  for (const dx of [-0.88, 0.5]) entry.put(TRIM, dx, 1.65, 0.1, 0.14, 2.5, 0.16);
  entry.put(0xc3a574, -0.19, 2.94, 0.16, 1.6, 0.17, 0.45);
  for (let x = -0.82; x < 0.5; x += 0.18) {
    entry.put(x < -0.3 ? 0xa76d40 : 0x825a36, x, 2.98, 0.3, 0.17, 0.12, 0.48);
  }
  box(0x7d603c, -3.0, 1.59, 3.33, 0.1, 2.15, 0.88, 0, -0.3);
  entry.put(0x557064, -1.22, 1.85, 0.09, 0.42, 0.85, 0.07);
  for (const dx of [-1.4, -1.05]) entry.put(0xc6b785, dx, 1.85, 0.14, 0.045, 0.88, 0.04);
  for (const y of [1.5, 1.68, 1.86, 2.04, 2.22]) entry.put(0xa4a78a, -1.22, y, 0.15, 0.42, 0.035, 0.04);
  box(0xc8bc98, -3.65, 0.19, 3.23, 1.8, 0.18, 0.7);
  const mat = solid(new THREE.CylinderGeometry(0.35, 0.35, 0.025, 24), 0x737e65, -3.7, 0.295, 3.45);
  mat.scale.z = 0.68;

  const front = face(kit, 1.75, 1.46, 0);
  for (const lat of [0, 2.25]) detailedWindow(front, lat, 1.85, 0.77, 1.75, { lintel: TRIM });
  cross(front, -2.25, 2.08, 0.55);
  for (let x = -1.25; x < 4.9; x += 0.63) {
    beam(kit, 0x9c895d, [x, 2.62, 1.58], [x, 3.09, 1.86], 0.1, 0.12);
  }
  front.put(TRIM, 0, 3.14, 0.13, 6.4, 0.12, 0.25);
  const right = face(kit, 5.14, -1.02, Math.PI / 2);
  cross(right, 0, 1.85, 1.15);
  const left = face(kit, -5.3, -0.3, -Math.PI / 2);
  for (const lat of [-1.65, 0.3, 1.85]) detailedWindow(left, lat, 2.2, 0.7, 1.35, { louvers: 0xbdbd9a, lintel: TRIM });
  const back = face(kit, 0, -3.5, Math.PI);
  for (const lat of [-3.6, -1.5, 0.7, 3.45]) detailedWindow(back, lat, 1.85, 0.75, 1.2, { louvers: 0xbdbd9a, lintel: TRIM });
  for (const F of [entry, front, right, left, back]) {
    for (let i = 0; i < 10; i++) {
      const lat = (i / 9 - 0.5) * (F === front ? 5.8 : F === back ? 8.6 : F === left ? 4.5 : 2.6);
      stain(F, lat, 0.87 + (i % 4) * 0.52, 0.13 + i % 3 * 0.14, 0.08 + i % 2 * 0.16, i % 3 ? 0xcbb27c : 0xae9b6b);
    }
  }

  solid(new THREE.CylinderGeometry(0.3, 0.33, 0.38, 12), 0x74776b, 1.5, 3.58, -0.9);
  solid(new THREE.CylinderGeometry(0.24, 0.24, 0.03, 12), 0x303a33, 1.5, 3.79, -0.9);
  for (let i = 0; i < 4; i++) {
    box(0x777b6d, 1.5, 3.82, -0.9, 0.48, 0.035, 0.035, 0, i * Math.PI / 4);
  }
  solid(new THREE.CylinderGeometry(0.1, 0.12, 0.38, 10), 0x929686, -3.4, 4.88, -0.1);
  solid(new THREE.ConeGeometry(0.2, 0.13, 12), 0x626e64, -3.4, 5.14, -0.1);

  bench(kit, -1.23, 2.63, 0.13, 1.65, -Math.PI / 2, 0xd7d8bd, 0x9b9f86);
  bench(kit, 2.0, 2.0, 0.13, 1.65, 0, 0xa9692f, 0x6a654a);
  solid(new THREE.CylinderGeometry(0.27, 0.24, 0.81, 12), 0x596453, -0.25, 0.53, 2.15);
  solid(new THREE.CylinderGeometry(0.29, 0.29, 0.07, 12), 0x424e42, -0.25, 0.97, 2.15);
  wallLamp(entry, 1.15, 2.58);
  wallLamp(front, 1.06, 2.65);
}
