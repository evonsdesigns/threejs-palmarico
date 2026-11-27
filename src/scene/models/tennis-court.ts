import * as THREE from "three";
import type { Kit } from "./kit";
import { bench, detailedWindow, door, face, plant, wallLamp } from "./services-parts";
import { beam, sign } from "./tourism-a-parts";

const CLAY = 0xb76c4c;
const GRASS = 0x587044;
const LINE = 0xe9dfbd;
const TIMBER = 0x49332b;
const PLASTER = 0xd8d3ba;

export function buildTennisCourt(kit: Kit) {
  const { box, solid } = kit;
  box(0x67734b, 0, 0.06, 0, 15.8, 0.12, 15.8);
  box(0x9d947b, 0, 0.15, 0, 14.8, 0.16, 14.8);
  box(0xb9ac8c, 0, 0.25, 0, 14.45, 0.06, 14.45);

  // Two long courts share a central access aisle and a low perimeter fence.
  for (const cx of [-3.45, 3.45]) {
    box(GRASS, cx, 0.3, 1.9, 6.35, 0.07, 8.95);
    box(CLAY, cx, 0.345, 1.9, 5.4, 0.025, 7.85);
    for (const x of [cx - 2.45, cx + 2.45, cx - 1.83, cx + 1.83]) {
      box(LINE, x, 0.365, 1.9, 0.035, 0.018, 7.35);
    }
    for (const z of [-1.77, 5.57]) box(LINE, cx, 0.365, z, 4.93, 0.018, 0.035);
    for (const z of [-0.38, 4.18]) box(LINE, cx, 0.365, z, 3.68, 0.018, 0.035);
    box(LINE, cx, 0.365, 1.9, 0.035, 0.018, 4.56);
    for (const z of [-1.87, 5.67]) box(LINE, cx, 0.365, z, 0.035, 0.018, 0.2);

    for (const x of [cx - 2.7, cx + 2.7]) {
      box(0x4d5548, x, 0.87, 1.9, 0.075, 1.1, 0.075);
      box(0xd1c7ac, x, 1.44, 1.9, 0.11, 0.06, 0.11);
    }
    for (let x = cx - 2.65; x <= cx + 2.66; x += 0.15) {
      const top = 1.39 - 0.12 * (1 - Math.abs(x - cx) / 2.7);
      box(0x484c40, x, (top + 0.56) / 2, 1.9, 0.014, top - 0.56, 0.016);
    }
    for (let y = 0.6; y < 1.25; y += 0.13) box(0x484c40, cx, y, 1.9, 5.3, 0.014, 0.016);
    for (const side of [-1, 1]) {
      beam(kit, LINE, [cx, 1.27, 1.9], [cx + side * 2.7, 1.4, 1.9], 0.045);
    }
    box(LINE, cx, 0.91, 1.9, 0.035, 0.72, 0.03);
    solid(new THREE.SphereGeometry(0.065, 8, 6), 0xc6cb78, cx + 1.1, 0.43, 3.4);
  }

  const fence = (a: [number, number, number], b: [number, number, number]) => {
    const length = Math.hypot(b[0] - a[0], b[2] - a[2]);
    const dx = (b[0] - a[0]) / length;
    const dz = (b[2] - a[2]) / length;
    const point = (t: number, y: number): [number, number, number] => [a[0] + dx * t, y, a[2] + dz * t];
    beam(kit, 0x53604c, point(0, 1.72), point(length, 1.72), 0.045);
    beam(kit, 0x65705a, point(0, 0.42), point(length, 0.42), 0.035);
    const posts = Math.ceil(length / 1.5);
    for (let i = 0; i <= posts; i++) {
      const p = point(length * i / posts, 1);
      box(0x626b55, p[0], p[1], p[2], 0.065, 1.48, 0.065);
    }
    for (let t = 0; t < length - 0.24; t += 0.28) {
      beam(kit, 0x7b846b, point(t, 0.44), point(t + 0.24, 1.69), 0.012);
      beam(kit, 0x7b846b, point(t, 1.69), point(t + 0.24, 0.44), 0.012);
    }
  };
  fence([-6.72, 0, -2.7], [-6.72, 0, 6.5]);
  fence([6.72, 0, -2.7], [6.72, 0, 6.5]);
  fence([-6.72, 0, 6.5], [-0.65, 0, 6.5]);
  fence([0.65, 0, 6.5], [6.72, 0, 6.5]);
  fence([0, 0, -2.7], [0, 0, 0.8]);
  fence([0, 0, 3], [0, 0, 6.5]);

  // The reference clubhouse has a tall central gable and smaller gabled wings.
  const gable = (x: number, z: number, width: number, depth: number, eave: number, rise: number) => {
    const half = width / 2;
    const vertices = [
      -half, 0, -depth / 2, half, 0, -depth / 2, 0, rise, -depth / 2,
      half, 0, depth / 2, -half, 0, depth / 2, 0, rise, depth / 2,
      -half, 0, -depth / 2, 0, rise, -depth / 2, 0, rise, depth / 2,
      -half, 0, -depth / 2, 0, rise, depth / 2, -half, 0, depth / 2,
      0, rise, -depth / 2, half, 0, -depth / 2, half, 0, depth / 2,
      0, rise, -depth / 2, half, 0, depth / 2, 0, rise, depth / 2,
    ];
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();
    solid(geometry, 0x652c27, x, eave, z);
    for (const side of [-1, 1]) {
      for (let course = 1; course <= 7; course++) {
        const t = course / 8;
        beam(kit, course % 2 ? 0x783c30 : 0x512d28,
          [x + side * half * t, eave + rise * (1 - t) + 0.025, z - depth / 2],
          [x + side * half * t, eave + rise * (1 - t) + 0.025, z + depth / 2], 0.035);
      }
      for (const end of [-1, 1]) {
        beam(kit, 0xddd4ba, [x, eave + rise + 0.05, z + end * depth / 2],
          [x + side * half, eave, z + end * depth / 2], 0.11);
      }
    }
    beam(kit, TIMBER, [x, eave + rise + 0.06, z - depth / 2], [x, eave + rise + 0.06, z + depth / 2], 0.1);
  };

  box(0x87836c, 0, 0.43, -4.95, 12.15, 0.32, 3.5);
  box(PLASTER, 0, 1.62, -5.15, 11.6, 2.18, 2.9);
  for (const x of [-4.25, 4.25]) {
    gable(x, -5.15, 3.45, 3.35, 2.77, 1.68);
    const f = face(kit, x, -3.68, 0);
    detailedWindow(f, 0, 1.75, 0.9, 1.12, { shutter: 0x52654d, lintel: 0xe9e0ca });
    box(TIMBER, x, 2.68, -3.63, 3.05, 0.12, 0.09);
    for (const dx of [-1.4, 1.4]) box(TIMBER, x + dx, 1.6, -3.63, 0.1, 2.1, 0.09);
  }
  box(PLASTER, 0, 2.1, -5.05, 4.45, 3.14, 3.15);
  gable(0, -5.05, 4.9, 3.65, 3.7, 2.25);
  const front = face(kit, 0, -3.43, 0);
  door(front, 0, 0.59, 1.18, 2.24, { leaf: TIMBER, frame: 0xe8dec4, trim: 0x746347, glazed: true, glass: 0x536963, double: true });
  for (const x of [-1.45, 1.45]) detailedWindow(front, x, 2.18, 0.63, 1.04, { shutter: 0x4e614d });
  detailedWindow(face(kit, 0, -3.2, 0), 0, 4.2, 0.58, 0.82, { lintel: 0xe7ddc7 });
  for (const x of [-2.15, 2.15]) box(TIMBER, x, 2.1, -3.41, 0.12, 3.05, 0.12);
  box(TIMBER, 0, 3.55, -3.4, 4.4, 0.14, 0.12);
  sign(kit, "TENNIS", 0, 3.12, -3.32, 0.065, 0xe1d3a9, 0x3f5038);
  for (const x of [-0.95, 0.95]) wallLamp(front, x, 2.65);
  for (const side of [-1, 1]) {
    const end = face(kit, side * 5.81, -5.15, side * Math.PI / 2);
    detailedWindow(end, 0, 1.7, 0.9, 1.12, { shutter: 0x52654d });
  }
  const rear = face(kit, 0, -6.62, Math.PI);
  for (const x of [-4.25, -1.3, 1.3, 4.25]) detailedWindow(rear, x, 1.7, 0.8, 1.08, { shutter: 0x52654d });
  for (let i = 0; i < 3; i++) box(0xc8b99a, 0, 0.31 + i * 0.1, -2.82 - i * 0.19, 2.3, 0.12, 0.55);

  for (const x of [-4.4, 4.4]) bench(kit, x, -2.95, 0.31, 1.7, 0, 0x8c7453);
  for (const x of [-7.1, 7.1]) {
    for (const z of [-6.65, 6.85]) plant(kit, x, z, 0.28, 0x8e7958, [0xd4c178, 0xb25e48], 0.65);
  }
  for (const x of [-7.42, 7.42]) box(0x46603c, x, 0.53, 0, 0.32, 0.5, 14.6);
  box(0x46603c, 0, 0.53, -7.42, 14.8, 0.5, 0.32);
  for (const x of [-4, 4]) box(0x46603c, x, 0.53, 7.42, 6.8, 0.5, 0.32);
}
