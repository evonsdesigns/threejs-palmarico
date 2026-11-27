import * as THREE from "three";
import type { Kit } from "./kit";

export function buildMine(kit: Kit) {
  const { box, solid } = kit;
  const timber = 0x63452f;
  const pile = (x: number, y: number, z: number, sx: number, sy: number, sz: number, color: number) => {
    const mesh = solid(new THREE.IcosahedronGeometry(1, 0), color, x, y, z);
    mesh.scale.set(sx, sy, sz);
  };
  const beam = (color: number, a: [number, number, number], b: [number, number, number], t = 0.12) => {
    const dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2];
    const len = Math.hypot(dx, dy, dz);
    box(color, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2, t, t, len, Math.atan2(-dy, dz), Math.asin(dx / len));
  };

  box(0x867758, 0, 0.04, 0, 11.8, 0.08, 11.8);
  // Sloped spoil heap of rubble wraps around the mine entrance.
  for (const [x, y, z, sx, sy, sz, c] of [
    [-3.2, 0.65, -2.3, 2.5, 0.9, 2.4, 0x776b59], [-1.4, 1.15, -3.0, 2.3, 1.4, 2.0, 0x625e55],
    [0.45, 0.68, -3.25, 2.4, 0.8, 2.1, 0x80715c], [2.4, 0.4, -3.6, 2.1, 0.48, 1.75, 0x726857],
  ] as const) pile(x, y, z, sx, sy, sz, c);
  for (let i = 0; i < 22; i++) {
    const a = i * 2.399;
    const x = -2.1 + Math.cos(a) * (1.2 + (i % 4) * 0.25);
    const z = -2.9 + Math.sin(a) * (1.0 + (i % 3) * 0.2);
    pile(x, 0.25 + (i % 3) * 0.17, z, 0.24 + (i % 2) * 0.15, 0.18 + (i % 3) * 0.12, 0.2, i % 2 ? 0x8b8068 : 0x55534d);
  }

  // Main timber headframe and hoist house, with diagonal bracing and a giant sheave.
  for (const x of [-2.1, 0.7]) {
    beam(timber, [x, 0.3, 0.85], [x, 8.2, -0.2], 0.28);
    beam(0x795b3b, [x, 0.3, 0.85], [x, 8.2, -0.2], 0.09);
    beam(timber, [x, 0.3, 0.85], [x, 6.35, 1.05], 0.23);
    beam(timber, [x, 6.35, 1.05], [x, 8.2, -0.2], 0.23);
    for (const y of [1.2, 3.7, 6.2]) box(0x795b3b, x, y, 0.38, 0.25, 0.19, 1.2);
  }
  for (const z of [-0.2, 1.05]) {
    box(timber, -0.7, 7.95, z, 3.1, 0.32, 0.28);
    box(0x9c7951, -0.7, 6.15, z, 2.95, 0.2, 0.24);
  }
  beam(0x63452f, [-2.1, 3.7, -0.2], [0.7, 3.7, 1.05], 0.2);
  beam(0x63452f, [0.7, 3.7, -0.2], [-2.1, 3.7, 1.05], 0.2);
  const wheel = solid(new THREE.TorusGeometry(0.82, 0.11, 6, 14), 0x393734, -0.7, 8.15, -0.35);
  wheel.rotation.y = Math.PI / 2;
  box(0x70624c, -0.7, 8.15, -0.35, 0.16, 1.7, 0.16);
  for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4;
    box(0x98724a, -0.7, 8.15 + Math.cos(a) * 0.78, -0.35 + Math.sin(a) * 0.78, 0.1, 0.1, 0.1);
  }
  box(0x2e2e2b, -0.7, 8.15, -0.55, 0.06, 0.06, 0.55);
  box(0x8e754e, -0.7, 7.0, -0.2, 0.55, 1.4, 0.58);
  box(0x554633, -0.7, 7.72, -0.2, 0.68, 0.12, 0.7);
  // Cable drops from the sheave to the dark adit mouth.
  for (let y = 3.2; y < 7.8; y += 0.35) box(0x282826, -0.7, y, -0.3, 0.035, 0.36, 0.035);
  for (const x of [-1.25, -0.15]) {
    box(0x342c24, x, 1.9, 2.88, 0.22, 3.8, 0.25);
    box(0x503b2b, x, 3.77, 2.88, 0.38, 0.2, 0.3);
  }
  box(0x171918, -0.7, 1.85, 3.0, 1.1, 3.45, 0.08);
  box(0x65452e, -0.7, 3.72, 3.0, 1.45, 0.26, 0.24);
  // Timber tunnel lining recedes into the rock and carries warning lamp and sign.
  for (const z of [1.4, 2.0, 2.6, 3.2, 3.8]) {
    box(0x523b2b, -0.7, 0.28, z, 1.65, 0.16, 0.14);
    box(0x523b2b, -1.48, 1.8, z, 0.13, 3.1, 0.14);
    box(0x523b2b, 0, 1.8, z, 0.13, 3.1, 0.14);
  }
  box(0xd2b35f, -0.7, 3.16, 3.18, 0.42, 0.12, 0.05);
  box(0x2a2926, -0.7, 2.88, 3.2, 0.13, 0.42, 0.13);

  // Ore loading shed with patched corrugated roof, sliding bay doors and lantern.
  box(0x66503a, 3.05, 1.65, -1.9, 3.4, 3.3, 3.35);
  box(0x382f25, 3.05, 1.38, -0.18, 1.4, 2.5, 0.08);
  box(0x806344, 3.05, 0.28, -0.1, 1.6, 0.16, 0.18);
  box(0x51534d, 3.05, 3.45, -1.9, 3.8, 0.16, 3.75);
  box(0x77766b, 3.05, 3.57, -1.9, 3.7, 0.06, 3.7);
  for (let x = 1.3; x <= 4.8; x += 0.38) box(0x858276, x, 3.62, -1.9, 0.05, 0.035, 3.65);
  for (const x of [2.0, 4.1]) {
    box(0x90714a, x, 1.8, -0.16, 0.12, 3.4, 0.12);
    box(0x90714a, x, 3.4, -0.16, 1.2, 0.12, 0.12);
  }
  box(0xe4c76d, 4.0, 2.7, -0.08, 0.24, 0.3, 0.22);
  for (let x = 1.9; x < 4.5; x += 0.55) {
    box(0x332e28, x, 2.0, -3.83, 0.75, 3.8, 0.08);
    box(0x332e28, x, 2.0, -3.83, 0.08, 3.8, 0.65);
    box(0x5c4935, x, 0.2, -3.83, 0.98, 0.35, 0.82);
  }
  // Tailings baskets, ore bins and two loaded timber ore wagons on paired rails.
  for (let i = 0; i < 3; i++) {
    const x = 2.6 + i * 0.9;
    box(0x8d6640, x, 0.58, 2.0, 0.72, 0.85, 0.82);
    box(0x59432f, x, 1.05, 2.0, 0.82, 0.12, 0.92);
    for (let j = 0; j < 5; j++) pile(x - 0.25 + (j % 3) * 0.22, 1.12 + (j % 2) * 0.12, 1.85 + Math.floor(j / 3) * 0.25, 0.15, 0.14, 0.15, j % 2 ? 0x514f48 : 0x88847a);
  }
  for (const x of [-1.18, -0.22]) {
    box(0x373733, x, 0.09, 1.3, 0.12, 0.1, 4.9);
    for (let z = -0.8; z < 3.65; z += 0.48) box(0x5d4934, -0.7, 0.08, z, 1.35, 0.12, 0.14);
  }
  box(0x9b3d2c, -0.7, 0.84, 0.35, 1.3, 0.75, 1.65);
  box(0x352e27, -0.7, 0.7, 0.35, 1.45, 0.14, 1.8);
  box(0x8b5034, -0.7, 1.26, 0.35, 1.2, 0.16, 1.55);
  for (const x of [-1.2, -0.2]) {
    const wheel = solid(new THREE.CylinderGeometry(0.28, 0.28, 0.12, 10), 0x2b2b28, x, 0.36, 0.35);
    wheel.rotation.z = Math.PI / 2;
    box(0xb4a282, x, 0.36, 0.35, 0.06, 0.06, 0.06);
  }
  // A second empty tram car waits farther down the track.
  box(0x71412f, -0.7, 0.63, -1.55, 1.18, 0.62, 1.28);
  box(0x43382e, -0.7, 0.97, -1.55, 1.25, 0.08, 1.36);
  for (const x of [-1.2, -0.2]) {
    box(0x46392e, x, 0.88, -1.55, 0.1, 0.72, 0.1);
    const wheel = solid(new THREE.CylinderGeometry(0.24, 0.24, 0.12, 10), 0x2b2b28, x, 0.32, -1.55);
    wheel.rotation.z = Math.PI / 2;
    box(0xb4a282, x, 0.32, -1.55, 0.06, 0.06, 0.06);
  }
  for (const x of [-4.6, 5.25]) for (const z of [-4.7, -3.9]) {
    pile(x, 0.42, z, 0.48, 0.35, 0.4, 0x59574f);
    pile(x + 0.2, 0.65, z - 0.05, 0.3, 0.24, 0.3, 0x827a69);
  }
}
