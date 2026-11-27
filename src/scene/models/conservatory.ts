import * as THREE from "three";
import type { Kit } from "./kit";
import { cylinder, flower, paving, shrub, wallLamp } from "./entertainment-b-parts";
import { face, pixelText } from "./services-parts";

export function buildConservatory(kit: Kit) {
  const { box, solid } = kit;
  const ivory = 0xe8dfc9;
  const white = 0xf3eddb;
  const sandstone = 0xb9a77f;
  const roof = 0x8c4937;
  const blue = 0x527b83;

  paving(kit, -7.8, 7.8, -5.8, 5.8, 0.8, 0xcbbd9e, 0xb19f7c);
  box(0xa69678, 0, 0.2, -0.5, 11.9, 0.4, 7.2);
  box(sandstone, 0, 0.48, -0.5, 11.55, 0.2, 6.85);
  box(ivory, 0, 2.3, -0.55, 10.9, 3.5, 6.2);
  box(white, 0, 0.88, -0.55, 11.1, 0.55, 6.38);
  box(sandstone, 0, 1.2, -0.55, 11.2, 0.11, 6.45);
  box(white, 0, 4.08, -0.55, 11.4, 0.22, 6.7);
  box(sandstone, 0, 4.23, -0.55, 11.55, 0.09, 6.85);

  for (const side of [-1, 1]) {
    box(roof, 0, 5.03, -0.55 + side * 1.38, 11.9, 0.18, 3.15, side * -0.32);
    for (let x = -5.4; x <= 5.4; x += 0.42) box(0xa75c3f, x, 5.03, -0.55 + side * 1.38, 0.045, 0.07, 3.02, side * -0.32);
  }
  box(0xa75c3f, 0, 5.53, -0.55, 12.0, 0.18, 0.26);
  for (let x = -5.6; x <= 5.6; x += 0.4) box(0xb9744b, x, 4.93, 2.79, 0.045, 0.12, 0.12);

  const front = face(kit, 0, 2.56, 0);
  for (const x of [-4.3, -2.2, 2.2, 4.3]) {
    front.put(0x5c5040, x, 2.65, 0.03, 1.34, 2.25, 0.1);
    front.put(blue, x, 2.65, 0.11, 1.14, 2.03, 0.07);
    front.put(white, x, 2.65, 0.16, 0.07, 2.03, 0.06);
    front.put(white, x, 2.65, 0.16, 1.14, 0.07, 0.06);
    front.put(ivory, x, 3.88, 0.08, 1.6, 0.18, 0.2);
    for (const side of [-1, 1]) front.put(sandstone, x + side * 0.71, 2.62, 0.08, 0.13, 2.3, 0.18);
    front.put(white, x, 2.62, 0.2, 0.06, 2.0, 0.04);
    front.put(white, x, 2.65, 0.2, 1.1, 0.06, 0.04);
  }
  const back = face(kit, 0, -3.66, Math.PI);
  for (const x of [-4.3, -2.2, 0, 2.2, 4.3]) {
    kit.window(x, 2.6, -3.73, 1.1, 1.7, Math.PI);
    back.put(white, x, 3.65, 0.08, 1.45, 0.15, 0.15);
  }
  for (const x of [-5.25, 5.25]) for (const z of [-3.45, -1.4, 0.7, 2.35]) {
    box(white, x, 2.35, z, 0.2, 3.25, 0.22);
    box(sandstone, x, 0.8, z, 0.32, 0.22, 0.36);
    box(white, x, 4.0, z, 0.36, 0.2, 0.38);
  }

  for (const [x, y, z, w, h, d] of [[0, 0.22, 3.75, 4.2, 0.25, 1.15], [0, 0.42, 4.05, 3.7, 0.18, 0.85], [0, 0.58, 4.25, 3.2, 0.14, 0.55]]) box(sandstone, x, y, z, w, h, d);
  box(0x49392e, 0, 1.72, 2.63, 2.0, 2.4, 0.12);
  box(0x506f76, 0, 1.78, 2.73, 1.72, 2.2, 0.07);
  for (const x of [-0.48, 0.48]) box(ivory, x, 1.68, 2.79, 0.07, 2.1, 0.06);
  box(white, 0, 3.03, 2.8, 1.7, 0.08, 0.06);
  for (const x of [-1.65, -0.55, 0.55, 1.65]) {
    cylinder(kit, white, x, 2.05, 3.0, 0.28, 0.36, 2.9, 12);
    for (const y of [0.65, 3.45]) box(sandstone, x, y, 3.0, 0.8, 0.15, 0.65);
    for (let a = 0; a < 8; a++) {
      const ang = a * Math.PI / 4;
      box(ivory, x + Math.cos(ang) * 0.27, 2.15, 3.23 + Math.sin(ang) * 0.27, 0.055, 2.45, 0.055, 0, -ang);
    }
  }
  box(white, 0, 3.65, 3.05, 4.3, 0.3, 0.85);
  box(sandstone, 0, 3.81, 3.06, 4.5, 0.1, 0.92);
  const pediment = new THREE.Shape();
  pediment.moveTo(-2.2, 0);
  pediment.lineTo(2.2, 0);
  pediment.lineTo(0, 1.8);
  pediment.closePath();
  solid(new THREE.ExtrudeGeometry(pediment, { depth: 0.46, bevelEnabled: false }), white, 0, 3.78, 3.12);
  box(sandstone, 0, 3.87, 3.62, 0.18, 0.18, 0.08);
  for (const x of [-1.2, -0.8, 0.8, 1.2]) box(0xd0c3a2, x, 3.95 + (1.8 - Math.abs(x) * 0.7) * 0.45, 3.63, 0.12, 0.1, 0.06);
  box(roof, 0, 5.0, 3.25, 4.85, 0.18, 0.82, -0.4);
  box(roof, 0, 5.0, 3.66, 4.85, 0.18, 0.82, 0.4);

  const medallion = solid(new THREE.CylinderGeometry(0.46, 0.46, 0.12, 20), sandstone, 0, 4.42, 3.65);
  medallion.rotation.x = Math.PI / 2;
  for (const x of [-0.24, 0.24]) box(0x9d7641, x, 4.38, 3.76, 0.07, 0.48, 0.06, 0, x < 0 ? -0.2 : 0.2);
  box(0x9d7641, 0, 4.15, 3.76, 0.5, 0.06, 0.06);
  for (let x = -0.2; x <= 0.2; x += 0.1) box(0x9d7641, x, 4.08 + Math.abs(x) * 0.5, 3.76, 0.045, 0.18, 0.045);
  wallLamp(kit, -2.7, 2.55, 2.74);
  wallLamp(kit, 2.7, 2.55, 2.74);

  box(0xbba77e, 0, 0.17, 5.1, 2.1, 0.22, 1.2);
  for (const x of [-6.6, 6.6]) {
    shrub(kit, x, 4.5, 1.0, 0x437744);
    flower(kit, x, 0.1, 0.88, x < 0 ? 0xdf7e65 : 0xf3d65e);
  }
  for (const x of [-4.1, 4.1]) {
    box(0xe4ddca, x, 0.55, 4.55, 0.5, 0.9, 0.5);
    cylinder(kit, 0x9d704e, x, 1.12, 4.55, 0.48, 0.35, 0.3, 10);
    flower(kit, x, 4.55, 0.45, 0xf6d657);
  }
  for (const x of [-6.9, 6.9]) for (const z of [-4.9, 4.9]) box(white, x, 0.52, z, 0.3, 0.9, 0.3);
  box(0xd5c8a9, 0, 0.18, 5.4, 4.2, 0.18, 0.75);
  const sign = face(kit, 0, 5.82, 0);
  box(0x55453a, 0, 2.15, 5.77, 3.4, 1.35, 0.16);
  box(0xe0d4b8, 0, 2.15, 5.88, 3.18, 1.12, 0.07);
  pixelText(sign, "MUSIC", 0, 2.34, 0.13, 0.14, 0x544731);
  box(0x8d4936, 0, 1.6, 5.88, 3.18, 0.08, 0.08);
}
