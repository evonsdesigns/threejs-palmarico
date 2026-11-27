import * as THREE from "three";
import type { Kit } from "./kit";
import { beam, door, face, pixelText } from "./services-parts";

export function buildCabaret(kit: Kit) {
  const { box, litBox, solid } = kit;
  const blue = 0x9bd3e6;
  const trim = 0xe9e5d7;
  const cream = 0xd8d1bf;
  const red = 0xb94f3d;
  const metal = 0x777e79;

  box(0xc9bea8, 0, 0.08, 0, 11.7, 0.16, 11.7);
  box(0xdcd6c7, 0, 1.15, -0.75, 9.0, 2.15, 8.0);
  box(blue, 0, 5.6, -0.75, 9.0, 6.85, 8.0);
  box(0xb7d8df, 0, 8.99, -0.75, 9.12, 0.15, 8.1);
  box(0x3a3b3a, 0, 9.17, -0.75, 10.1, 0.28, 9.1);
  box(0x282b2a, 0, 9.33, -0.75, 10.1, 0.06, 9.1);

  // Tar roof seams, patches, two vents and chimney pipes.
  for (let x = -4.5; x <= 4.5; x += 1.5) box(0x494a48, x, 9.37, -0.75, 0.025, 0.018, 8.5);
  for (let z = -4.5; z <= 3.1; z += 1.5) box(0x494a48, 0, 9.37, z, 9.7, 0.018, 0.025);
  for (const [x, z, w, d] of [[-2.6, -2.6, 1.2, 0.8], [1.5, 1.3, 1.6, 0.65], [2.4, -3.4, 1, 0.55]]) {
    box(0x333533, x, 9.39, z, w, 0.035, d);
  }
  for (const [x, z] of [[-2.7, 0.1], [1.8, -3.1]]) {
    box(0x404240, x, 9.48, z, 1.0, 0.22, 0.65);
    box(0x303230, x, 9.61, z, 1.1, 0.06, 0.75);
  }
  for (const x of [-3.35, -3.05]) {
    solid(new THREE.CylinderGeometry(0.08, 0.08, 0.95, 8), 0x242726, x, 9.78, -3.9);
  }

  // Restrained sash windows and small square vents on the pale-blue walls.
  for (const y of [5.0, 7.3]) {
    for (const z of [-3.7, 2.1]) kit.window(-4.52, y, z, 0.95, 1.35, -Math.PI / 2);
    for (const z of [-2.7, 0.1, 2.2]) kit.window(4.52, y, z, 0.8, 1.2, Math.PI / 2);
    for (const x of [-3.4, -1.6, 0.2, 3.7]) kit.window(x, y, -4.76, 0.8, 1.2, Math.PI);
  }
  for (const y of [5.55, 7.85]) {
    for (const z of [-1.4, -0.35]) kit.window(-4.52, y, z, 0.32, 0.35, -Math.PI / 2);
  }
  for (const x of [-3.45, -1.9, -0.35, 1.25, 3.15]) {
    for (const y of [5.05, 7.35]) kit.window(x, y, 3.26, 0.73, 1.25);
  }

  // The arched ground-floor openings have brick surrounds and grilles.
  const left = face(kit, -4.52, 0, -Math.PI / 2);
  for (const lat of [-2.9, 0.4]) {
    left.put(0xb37c6c, lat, 1.18, 0.05, 1.12, 1.85, 0.1);
    left.put(0xd6d0bf, lat, 1.15, 0.11, 0.91, 1.65, 0.08);
    for (let i = -2; i <= 2; i++) left.put(0x92958f, lat + i * 0.14, 1.15, 0.17, 0.035, 1.5, 0.03);
    for (const y of [0.65, 1.15, 1.65]) left.put(0x92958f, lat, y, 0.17, 0.85, 0.035, 0.03);
    left.put(red, lat, 2.12, 0.14, 0.7, 0.1, 0.12);
    for (const side of [-1, 1]) left.put(red, lat + side * 0.43, 2.04, 0.14, 0.17, 0.18, 0.12);
  }
  left.put(red, 0, 2.33, 0.04, 7.9, 0.1, 0.1);
  box(red, 0, 2.33, -4.77, 9.05, 0.1, 0.09);

  // A rounded balcony runs across the entrance and turns around its corner.
  const outline = new THREE.Shape();
  outline.moveTo(-4.4, 3.15);
  outline.lineTo(3.9, 3.15);
  outline.lineTo(4.75, 3.45);
  outline.quadraticCurveTo(5.25, 3.8, 5.15, 4.2);
  outline.quadraticCurveTo(5.05, 4.72, 4.35, 4.75);
  outline.lineTo(-4.4, 4.75);
  outline.closePath();
  const balcony = solid(new THREE.ExtrudeGeometry(outline, { depth: 0.2, bevelEnabled: false, curveSegments: 8 }), cream, 0, 3.13, 0);
  balcony.rotation.x = Math.PI / 2;
  const railPath: [number, number][] = [[-4.35, 4.7], [3.95, 4.7], [4.45, 4.68], [4.84, 4.52], [5.04, 4.2], [4.96, 3.83], [4.7, 3.58]];
  for (let i = 0; i < railPath.length - 1; i++) {
    const [x0, z0] = railPath[i];
    const [x1, z1] = railPath[i + 1];
    beam(kit, metal, [x0, 3.89, z0], [x1, 3.89, z1], 0.08);
    beam(kit, trim, [x0, 3.25, z0], [x1, 3.25, z1], 0.08);
    const count = Math.max(1, Math.ceil(Math.hypot(x1 - x0, z1 - z0) / 0.28));
    for (let j = 0; j <= count; j++) {
      const t = j / count;
      box(trim, x0 + (x1 - x0) * t, 3.57, z0 + (z1 - z0) * t, 0.045, 0.62, 0.045);
    }
  }
  for (const x of [-4.1, -2.25, 0.05, 2.25, 4.25]) {
    box(0xa6c8c9, x, 1.53, 4.62, 0.16, 2.9, 0.16);
    box(trim, x, 0.15, 4.62, 0.34, 0.18, 0.34);
    box(trim, x, 2.92, 4.62, 0.3, 0.15, 0.3);
  }
  const front = face(kit, 0, 3.27, 0);
  door(front, 0.1, 0.18, 1.55, 2.35, { leaf: 0x6a4838, frame: trim, trim: red, handle: 0xe4c46c, double: true, glazed: true, glass: 0x607a7d });
  for (const x of [-2.9, 2.85]) {
    front.put(0x9c5e45, x, 1.5, 0.08, 1.35, 1.9, 0.12);
    front.put(0xe4d8ba, x, 1.5, 0.16, 1.12, 1.65, 0.06);
    front.put(x < 0 ? 0x8c7188 : 0x7796a4, x, 1.5, 0.21, 0.85, 1.36, 0.04);
    front.put(0xefd591, x, 1.92, 0.24, 0.7, 0.1, 0.03);
    front.put(red, x, 1.17, 0.24, 0.56, 0.08, 0.03);
  }

  // The narrow vertical theatre sign carries lettering, bulbs and a dancer.
  box(0x282f32, 2.25, 6.25, 3.48, 0.72, 4.25, 0.24);
  box(0x855b3d, 2.25, 6.25, 3.63, 0.54, 4.02, 0.08);
  const sign = face(kit, 0, 3.71, 0);
  for (let i = 0; i < 7; i++) pixelText(sign, "CABARET"[i], 2.25, 7.67 - i * 0.49, 0, 0.065, 0xf0cd75);
  for (let y = 4.32; y <= 8.2; y += 0.25) {
    for (const x of [1.95, 2.55]) litBox(0xf5c96d, x, y, 3.73, 0.075, 0.075, 0.05);
  }
  for (const x of [2.04, 2.25, 2.46]) {
    litBox(0xf5c96d, x, 8.26, 3.73, 0.075, 0.075, 0.05);
    litBox(0xf5c96d, x, 4.23, 3.73, 0.075, 0.075, 0.05);
  }
  solid(new THREE.SphereGeometry(0.13, 10, 8), 0xd9a67c, 2.25, 6.75, 3.86);
  box(0x303948, 2.25, 6.36, 3.86, 0.23, 0.58, 0.12);
  beam(kit, 0xd9a67c, [2.16, 6.53, 3.87], [1.75, 6.92, 3.87], 0.07);
  beam(kit, 0xd9a67c, [2.34, 6.53, 3.87], [2.78, 6.88, 3.87], 0.07);
  beam(kit, 0xd9a67c, [2.2, 6.08, 3.87], [1.92, 5.64, 3.87], 0.08);
  beam(kit, 0xd9a67c, [2.3, 6.08, 3.87], [2.62, 5.68, 3.87], 0.08);
  for (const [x, y, color] of [[1.82, 6.84, 0xd07862], [1.7, 7.05, 0x73a5a4], [2.7, 6.83, 0xd07862], [2.83, 7.03, 0x73a5a4]]) {
    litBox(color, x, y, 3.88, 0.13, 0.2, 0.06);
  }
}
