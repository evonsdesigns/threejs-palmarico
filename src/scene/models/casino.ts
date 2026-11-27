import * as THREE from "three";
import type { Kit } from "./kit";
import { door, face, hipRoof } from "./services-parts";

export function buildCasino(kit: Kit) {
  const { box, litBox, solid } = kit;
  const wall = 0xd4d3c7;
  const trim = 0xe7e5d7;
  const shadow = 0xa2a89f;
  const red = 0xb44b2a;

  // A low, symmetrical masonry hall on a landscaped plot.
  box(0xb9b59f, 0, 0.08, 0, 15.6, 0.16, 11.6);
  box(0x9eae83, 0, 0.17, 0, 15.1, 0.08, 11.1);
  box(0xb0aaa0, 0, 0.31, 0, 11.65, 0.32, 8.45);
  box(wall, 0, 2.45, 0, 11.2, 4.1, 8.0);
  box(trim, 0, 0.55, 0, 11.4, 0.18, 8.2);
  box(trim, 0, 3.92, 0, 11.5, 0.19, 8.3);
  box(shadow, 0, 4.06, 0, 11.6, 0.09, 8.4);

  // The roof is hipped around a broad, gridded glass skylight.
  hipRoof(kit, {
    x0: -5.9, x1: 5.9, z0: -4.3, z1: 4.3,
    eave: 4.15, rise: 1.15, runX: 1.7, runZ: 1.4,
    color: red, rib: 0x9e3923, course: 0xbd5330, cap: 0x8e3524, fascia: 0x843d2b,
    ribStep: 0.42, courses: 5,
  });
  box(0x778783, 0, 5.28, 0, 8.35, 0.12, 5.65);
  box(0x5c737c, 0, 5.36, 0, 8.05, 0.06, 5.35);
  for (let x = -3.55; x <= 3.55; x += 0.8) {
    for (let z = -2.25; z <= 2.25; z += 0.75) {
      box((Math.round((x + 3.55) / 0.8) + Math.round((z + 2.25) / 0.75)) % 2 ? 0x879a9a : 0x718b90,
        x, 5.4, z, 0.68, 0.03, 0.62);
      box(0xa6b6ac, x - 0.12, 5.42, z - 0.12, 0.2, 0.01, 0.08);
    }
  }
  for (const x of [-4.18, 4.18]) box(trim, x, 5.42, 0, 0.14, 0.18, 5.8);
  for (const z of [-2.83, 2.83]) box(trim, 0, 5.42, z, 8.5, 0.18, 0.14);

  // Recessed bays, pale pilasters and smaller clerestory windows.
  const facade = (f: number, x: number, z: number, bays: number[], entrance = false) => {
    const F = face(kit, x, z, f);
    for (const lat of bays) {
      if (entrance && Math.abs(lat) < 1.15) continue;
      F.put(shadow, lat, 2.05, 0.025, 1.05, 2.55, 0.07);
      F.put(trim, lat, 2.05, 0.08, 0.94, 2.45, 0.08);
      F.win(lat, 1.95, 0.62, 1.55, 0.14);
      F.put(trim, lat, 3.03, 0.15, 0.9, 0.13, 0.14);
      F.put(shadow, lat, 3.43, 0.06, 0.64, 0.42, 0.06);
      F.put(0xdce3da, lat, 3.43, 0.1, 0.48, 0.28, 0.06);
      F.put(trim, lat, 3.66, 0.13, 0.69, 0.1, 0.14);
    }
    const limit = Math.max(...bays.map(Math.abs)) + 0.82;
    for (const lat of [-limit, ...bays.slice(0, -1).map((value, i) => (value + bays[i + 1]) / 2), limit]) {
      F.put(trim, lat, 2.2, 0.1, 0.16, 3.45, 0.14);
      F.put(trim, lat, 0.53, 0.16, 0.3, 0.13, 0.25);
      F.put(trim, lat, 3.84, 0.16, 0.3, 0.14, 0.25);
    }
    F.put(shadow, 0, 3.21, 0.09, limit * 2, 0.08, 0.12);
  };
  facade(0, 0, 4.02, [-4.4, -2.8, -1.2, 0.4, 2, 3.6], true);
  facade(Math.PI, 0, -4.02, [-4.4, -2.8, -1.2, 0.4, 2, 3.6]);
  facade(Math.PI / 2, 5.62, 0, [-2.9, -1.45, 0, 1.45, 2.9]);
  facade(-Math.PI / 2, -5.62, 0, [-2.9, -1.45, 0, 1.45, 2.9]);

  // A modest projecting entrance pavilion and shallow stone steps.
  const front = face(kit, 0, 4.15, 0);
  door(front, 0, 0.35, 1.7, 2.65, {
    leaf: 0x66766d, frame: trim, trim: 0xa3b1a2, handle: 0xd7c27c,
    double: true, glazed: true, glass: 0x647d81,
  });
  for (const x of [-1.25, 1.25]) {
    box(trim, x, 2.0, 4.43, 0.24, 3.2, 0.24);
    box(trim, x, 0.52, 4.43, 0.4, 0.16, 0.42);
    box(trim, x, 3.56, 4.43, 0.4, 0.17, 0.42);
  }
  box(trim, 0, 3.68, 4.43, 2.9, 0.22, 0.52);
  box(shadow, 0, 3.82, 4.43, 3.0, 0.09, 0.6);
  for (const [y, z, depth] of [[0.38, 4.38, 0.5], [0.27, 4.68, 0.55], [0.16, 4.98, 0.6]]) {
    box(trim, 0, y, z, 2.9, 0.12, depth);
  }

  // Four high corner standards are the distinctive illuminated roofline.
  for (const x of [-6.25, 6.25]) {
    for (const z of [-4.65, 4.65]) {
      solid(new THREE.CylinderGeometry(0.13, 0.17, 7.3, 10), 0xb7b9ac, x, 3.85, z);
      solid(new THREE.CylinderGeometry(0.25, 0.29, 0.2, 10), trim, x, 0.28, z);
      solid(new THREE.CylinderGeometry(0.31, 0.23, 0.13, 12), 0xd4cbbc, x, 7.55, z);
      litBox(0xffdf9c, x, 7.7, z, 0.42, 0.22, 0.42);
      solid(new THREE.CylinderGeometry(0.26, 0.32, 0.1, 12), trim, x, 7.85, z);
    }
  }

  // Low hedges frame the walls without obscuring the entrance.
  for (const x of [-4.45, 4.45]) {
    box(0x4c673e, x, 0.49, 4.35, 2.0, 0.55, 0.65);
    for (const dx of [-0.65, 0, 0.65]) box(0x63814d, x + dx, 0.75, 4.35, 0.72, 0.3, 0.7);
  }
  for (const side of [-1, 1]) {
    for (const z of [-2.6, 0, 2.6]) {
      box(0x4c673e, side * 5.9, 0.49, z, 0.65, 0.55, 1.8);
      for (const dz of [-0.55, 0, 0.55]) box(0x63814d, side * 5.9, 0.75, z + dz, 0.7, 0.3, 0.62);
    }
  }
}
