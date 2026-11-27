import * as THREE from "three";
import type { Kit } from "./kit";
import { bench, detailedWindow, door, face, hipRoof, palm, plant, wallLamp } from "./services-parts";
import { beam, sign } from "./tourism-a-parts";

const WALL = 0xe9e3d2;
const TRIM = 0xf3eee2;
const WOOD = 0x826145;
const TILE = 0x984632;

export function buildSpa(kit: Kit) {
  const { box, solid } = kit;
  box(0x68884a, 0, 0.035, 0, 11.8, 0.07, 7.8);
  box(0xd7c9ae, 0, 0.085, 1.15, 11.4, 0.04, 5.25);
  for (let x = -5.2; x < 5.2; x += 0.48) box(0xc5b99f, x, 0.11, 1.1, 0.025, 0.01, 5.0);

  box(0xa89b81, -1.45, 0.25, -1.92, 7.45, 0.38, 3.65);
  box(WALL, -1.45, 1.98, -1.92, 7.08, 3.08, 3.3);
  box(0xe4ddca, -1.45, 0.52, -1.92, 7.2, 0.34, 3.42);
  box(TRIM, -1.45, 3.56, -1.92, 7.34, 0.2, 3.62);
  hipRoof(kit, { x0: -5.25, x1: 2.35, z0: -3.92, z1: 0.08, eave: 3.66, rise: 1.25, runX: 1.75, runZ: 1.45, color: TILE, rib: 0x783c2f, course: 0x6d352b, cap: 0xa4553a, fascia: 0x694634, ribStep: 0.33, courses: 6, patches: [0xb85e3c, 0x863c2e] });
  for (const x of [-4.6, -2.55, -0.35, 1.75]) {
    box(TRIM, x, 1.73, 0.12, 0.2, 2.85, 0.2);
    box(0xd8cfbd, x, 0.32, 0.12, 0.4, 0.16, 0.4);
    box(TRIM, x, 3.08, 0.12, 0.32, 0.16, 0.32);
  }
  box(TRIM, -1.45, 3.19, 0.24, 6.55, 0.18, 0.98);
  for (let x = -4.4; x <= 1.5; x += 0.3) box(0xe5dfcf, x, 0.85, 0.58, 0.055, 0.92, 0.055);
  box(0xe3dccb, -1.45, 1.28, 0.58, 6.25, 0.06, 0.12);
  const F = face(kit, -1.45, -0.27, 0);
  door(F, 0, 0.38, 1.38, 2.34, { leaf: 0x7f553b, frame: TRIM, trim: 0x51392b, handle: 0xd0b26d, double: true, glazed: true, glass: 0x6e8f8b });
  for (const x of [-2.7, 2.7]) detailedWindow(F, x, 1.95, 1.0, 1.35, { shutter: 0x597c70, lintel: TRIM });
  for (const x of [-4.85, 1.95]) wallLamp(face(kit, -1.45, -0.27, 0), x < 0 ? -3.4 : 3.4, 2.45, 0xffd77d);
  sign(kit, "SPA", -1.45, 3.02, 0.3, 0.09, 0x47756c, 0xf0dfbb);
  const R = face(kit, 2.1, -1.92, Math.PI / 2);
  for (const z of [-2.9, -1.1]) detailedWindow(R, z + 1.92, 1.92, 0.82, 1.35, { shutter: 0x597c70 });
  const L = face(kit, -5.0, -1.92, -Math.PI / 2);
  for (const z of [-2.9, -1.1]) detailedWindow(L, z + 1.92, 1.92, 0.82, 1.35, { shutter: 0x597c70 });
  const B = face(kit, -1.45, -3.57, Math.PI);
  door(B, -2.4, 0.36, 0.9, 2.18, { leaf: WOOD, frame: TRIM, trim: 0x503b2b });
  detailedWindow(B, 1.6, 1.95, 0.9, 1.25);

  box(TILE, 3.2, 0.13, 0.88, 3.25, 0.16, 3.0);
  const basin = solid(new THREE.CylinderGeometry(1, 1, 0.66, 12), 0xddd4c2, 3.2, 0.56, 0.88);
  basin.scale.set(1.43, 1, 1.28);
  const rim = solid(new THREE.CylinderGeometry(1, 1, 0.16, 12), 0xbaa98c, 3.2, 0.96, 0.88);
  rim.scale.set(1.5, 1, 1.34);
  const water = solid(new THREE.CylinderGeometry(1, 1, 0.055, 12), 0x62bdc6, 3.2, 0.9, 0.88);
  water.scale.set(1.34, 1, 1.18);
  for (const [x, z] of [[2.55, 0.52], [3.15, 1.2], [3.82, 0.57], [2.94, 0.64]]) box(0xb7e6dc, x, 0.936, z, 0.28, 0.012, 0.04);
  for (const x of [2.42, 2.8]) {
    box(0xb49153, x, 0.92, 2.0, 0.055, 1.22, 0.055);
    box(0xb49153, x, 1.54, 1.78, 0.055, 0.055, 0.5);
  }
  box(0xb49153, 2.61, 1.52, 1.8, 0.44, 0.055, 0.055);

  for (const x of [-4.55, -3.9, -3.25]) {
    box(0x8c6847, x, 1.12, 2.35, 0.12, 2.15, 0.12);
    box(0xa4815a, x, 2.2, 2.35, 0.22, 0.12, 0.22);
  }
  for (let z = 1.1; z < 3.6; z += 0.32) box(0x8d6949, -3.9, 2.13, z, 0.1, 0.1, 0.1);
  for (const z of [1.25, 3.4]) box(0x8d6949, -3.9, 2.0, z, 1.55, 0.1, 0.1);
  bench(kit, -2.35, 2.1, 0.15, 1.65, 0, 0x9a8967);
  bench(kit, -0.1, 2.1, 0.15, 1.65, 0, 0x9a8967);
  for (const x of [-2.6, -0.2]) {
    box(0xede8dc, x, 0.24, 1.18, 0.76, 0.14, 1.28);
    box(0xf3f0e9, x, 0.38, 0.82, 0.73, 0.12, 0.52, -0.36);
    box(0x87a9a0, x, 0.45, 1.35, 0.64, 0.05, 0.48);
    for (const dx of [-0.28, 0.28]) for (const z of [0.65, 1.7]) box(0x9a927f, x + dx, 0.13, z, 0.045, 0.26, 0.045);
    box(0x896948, x, 1.0, 1.2, 0.07, 1.9, 0.07);
    const shade = solid(new THREE.ConeGeometry(0.7, 0.28, 8), x < 0 ? 0x52877c : 0xe0c66c, x, 1.98, 1.2);
    shade.rotation.y = Math.PI / 8;
    for (let i = 0; i < 8; i++) beam(kit, i % 2 ? 0xf1ead9 : 0x52877c, [x, 1.83, 1.2], [x + Math.cos(i * Math.PI / 4) * 0.66, 1.98, 1.2 + Math.sin(i * Math.PI / 4) * 0.66], 0.025);
  }
  for (let z = -0.05; z < 1.95; z += 0.5) {
    box(0xe8dfce, 0.85, 0.12, z, 0.86, 0.08, 0.38);
    box(0xcfc2a9, 0.85, 0.17, z, 0.78, 0.025, 0.31);
  }
  for (const x of [-5.0, 5.1]) {
    palm(kit, x < 0 ? -4.5 : 4.5, 1.7, 0.08, 1.08);
    plant(kit, x, -0.4, 0.13, 0x9b6244, [0xf0d056, 0xd94e4a], 0.76);
  }
  for (const x of [-4.9, -3.8, 4.1, 5.0]) {
    box(0x7d583d, x, 0.24, -2.9, 0.62, 0.42, 0.55);
    plant(kit, x, -2.9, 0.45, 0x7d583d, [0xe8c452, 0xd8534c], 0.58);
  }
  for (const x of [4.25, 4.78]) {
    const jar = solid(new THREE.CylinderGeometry(0.25, 0.32, 0.7, 10), 0x9e573d, x, 0.45, -1.75);
    jar.rotation.z = 0.02;
    box(0x704536, x, 0.82, -1.75, 0.32, 0.07, 0.32);
  }
}
