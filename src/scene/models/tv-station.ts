import * as THREE from "three";
import type { Kit } from "./kit";
import { beam, detailedWindow, door, face, wallLamp } from "./services-parts";

const WALL = 0xd5d3c8;
const TRIM = 0xe9e5d7;
const BLUE = 0x315e80;
const RED = 0xc63e37;
const STEEL = 0x626963;

export function buildTvStation(kit: Kit) {
  const { box, solid } = kit;
  box(0x9c9788, 0, 0.07, 0, 11.7, 0.14, 11.7);
  box(0xc8c0ab, -0.8, 0.15, 3.5, 7.5, 0.08, 3.8);
  for (let x = -4.4; x < 3.2; x += 0.5) box(0xb4a991, x, 0.2, 3.5, 0.025, 0.015, 3.75);

  // Broadcast house: technical studio windows, bright red piers, parapet and rooftop plant.
  box(0x77746b, -0.7, 0.32, -0.2, 8.9, 0.38, 7.0);
  box(WALL, -0.7, 2.25, -0.2, 8.35, 3.7, 6.5);
  box(0xaaa79c, -0.7, 0.62, -0.2, 8.55, 0.42, 6.7);
  box(0x393c39, -0.7, 4.18, -0.2, 8.65, 0.22, 6.8);
  box(TRIM, -0.7, 4.34, -0.2, 8.82, 0.12, 6.92);
  // Long grid-glazed studio bays on the front and wrapped side walls.
  const F = face(kit, -0.7, 3.06, 0);
  for (const x of [-3.85, -2.55, -1.25, 0.05, 1.35, 2.45]) {
    box(RED, x, 2.36, 3.1, 0.19, 3.55, 0.18);
    box(0xd4cabb, x, 0.76, 3.22, 0.26, 0.16, 0.32);
  }
  for (const y of [1.32, 2.18, 3.03]) {
    box(0x5d7275, -0.68, y, 3.12, 6.42, 0.12, 0.08);
  }
  for (const x of [-3.5, -2.2, -0.9, 0.4, 1.7]) {
    box(0x26373c, x, 2.45, 3.18, 1.02, 2.2, 0.1);
    kit.litBox(0x4c777e, x, 2.45, 3.24, 0.87, 2.02, 0.04);
    box(0xafa99a, x, 2.45, 3.28, 0.07, 2.02, 0.04);
    box(0xafa99a, x, 2.45, 3.29, 0.87, 0.07, 0.04);
  }
  door(F, -0.7, 0.55, 1.25, 2.35, { leaf: BLUE, frame: TRIM, trim: 0x252e34, double: true, glazed: true, glass: 0x4b737d });
  box(0x343936, -0.7, 3.91, 3.42, 2.2, 0.42, 0.08);
  box(0x376b8a, -0.7, 3.9, 3.47, 2.02, 0.27, 0.03);
  for (const x of [-1.4, -0.7, 0, 0.7]) box(0xd7e2db, x, 3.9, 3.5, 0.06, 0.23, 0.02);
  wallLamp(F, -2.1, 2.65);
  wallLamp(F, 0.8, 2.65);
  const B = face(kit, -0.7, -3.46, Math.PI);
  for (const x of [-3.35, -1.2, 1.0, 2.0]) detailedWindow(B, x, 2.32, 1.05, 1.3);
  for (const side of [-1, 1]) {
    const X = side < 0 ? face(kit, -4.88, -0.2, -Math.PI / 2) : face(kit, 3.48, -0.2, Math.PI / 2);
    for (const z of [-2.2, 0, 2.2]) detailedWindow(X, z, 2.35, 0.9, 1.3);
  }

  // Rooftop broadcast console, parabolic dishes and direction-finding mast.
  box(0x4c514d, -0.6, 4.55, -0.45, 6.7, 0.26, 5.3);
  box(0x70766e, -0.6, 4.72, -0.45, 6.5, 0.08, 5.1);
  for (const [x, z] of [[-2.65, -1.7], [-0.8, -1.8], [1.55, -1.7]]) {
    box(0x363a36, x, 4.98, z, 0.12, 0.5, 0.12);
    const dish = solid(new THREE.CylinderGeometry(0.95, 0.95, 0.14, 16, 1, true), 0xb9bdb7, x, 5.5, z);
    dish.rotation.x = Math.PI / 2.9;
    box(STEEL, x, 5.16, z + 0.3, 0.09, 0.75, 0.09);
    beam(kit, 0xc8cbc3, [x, 5.6, z - 0.55], [x, 5.28, z + 0.36], 0.035);
    box(0x535953, x, 5.44, z + 0.46, 0.12, 0.12, 0.12);
  }
  box(STEEL, 1.7, 5.05, -2.5, 0.08, 0.58, 0.08);
  box(0xbfc6bf, 1.7, 5.37, -2.5, 0.54, 0.05, 0.05);

  // Four-legged, cross-braced transmission mast; the narrow top aerial reaches 25.7 units.
  const towerX = 4.25;
  const towerZ = -2.85;
  const corners = [[-0.82, -0.82], [0.82, -0.82], [0.82, 0.82], [-0.82, 0.82]] as const;
  for (let i = 0; i < 4; i++) {
    const [dx, dz] = corners[i];
    const [tx, tz] = corners[(i + 1) % 4];
    beam(kit, STEEL, [towerX + dx, 0.25, towerZ + dz], [towerX + dx * 0.15, 19.2, towerZ + dz * 0.15], 0.12);
    for (let y = 2.0; y <= 18; y += 2.2) {
      box(0x414944, towerX + dx * (1 - y / 22), y, towerZ + dz * (1 - y / 22), 0.18, 0.1, 0.18);
    }
    for (let y = 1.1; y < 18.5; y += 2.2) {
      const ya = y;
      const yb = Math.min(y + 2.2, 19.2);
      const wa = 0.82 * (1 - ya / 22);
      const wb = 0.82 * (1 - yb / 22);
      beam(kit, 0x969b91, [towerX + dx * wa, ya, towerZ + dz * wa], [towerX + tx * wb, yb, towerZ + tz * wb], 0.07);
      beam(kit, 0x777e76, [towerX + tx * wa, ya, towerZ + tz * wa], [towerX + dx * wb, yb, towerZ + dz * wb], 0.06);
    }
    beam(kit, 0x68706a, [towerX + dx * 0.82, 0.4, towerZ + dz * 0.82], [towerX + dx * 0.82, 1.0, towerZ + dz * 0.82], 0.24);
  }
  for (let y = 4; y <= 18; y += 4.4) {
    const w = 0.82 * (1 - y / 22);
    for (const dx of [-w, w]) for (const dz of [-w, w]) box(0xb3b6ad, towerX + dx, y, towerZ + dz, 0.09, 0.08, 0.09);
  }
  box(0x727a72, towerX, 19.25, towerZ, 0.55, 0.2, 0.55);
  box(0x757d78, towerX, 22.45, towerZ, 0.13, 6.0, 0.13);
  for (const y of [20.3, 21.2, 22.1, 23.0, 23.9, 24.8]) box(0xd0d0c4, towerX, y, towerZ, 0.36, 0.045, 0.045);
  for (const y of [19.9, 21.8, 23.7]) {
    box(0xadb4b0, towerX, y, towerZ, 0.09, 0.05, 2.0);
    box(0xadb4b0, towerX, y, towerZ, 2.0, 0.05, 0.09);
  }
  box(0xc9473c, towerX, 25.6, towerZ, 0.28, 0.18, 0.28);
  box(0x313530, towerX, 0.16, towerZ, 2.3, 0.3, 2.3);
  box(0xd1c4a4, 0, 0.12, 5.4, 4.4, 0.06, 0.7);
  box(0x4b4c45, -0.7, 0.35, 3.8, 5.4, 0.3, 0.12);
}
