import * as THREE from "three";
import type { Kit } from "./kit";
import { beam, detailedWindow, door, downspout, face, hipRoof, palm, plant, pixelText, stain, stringLights, wallLamp } from "./services-parts";

const WALL = 0xe9c98d;
const TRIM = 0xf0ebdc;
const SHUTTER = 0x65a39b;
const WOOD = 0x755b43;
const AWNING_A = 0xb8432f;
const AWNING_B = 0xf1e8d2;
const BULBS = [0xf3d27a, 0xe3b44f, 0xc36d51, 0xd4e08a, 0x8ec4d6];

function barrel(kit: Kit, x: number, z: number, y0: number, h = 0.9, r = 0.32) {
  const profile = [
    new THREE.Vector2(r * 0.84, 0), new THREE.Vector2(r * 0.95, h * 0.2), new THREE.Vector2(r, h * 0.5),
    new THREE.Vector2(r * 0.95, h * 0.8), new THREE.Vector2(r * 0.84, h),
  ];
  kit.solid(new THREE.LatheGeometry(profile, 10), 0x8a5f3a, x, y0, z);
  kit.box(0x6e4a2c, x, y0 + h - 0.01, z, r * 1.25, 0.02, r * 1.25);
  for (const [t, k] of [[0.12, 0.88], [0.5, 1.02], [0.88, 0.88]]) {
    kit.solid(new THREE.CylinderGeometry(r * k + 0.015, r * k + 0.015, 0.05, 10, 1, true), 0x3a3632, x, y0 + h * t, z);
  }
}

function stool(kit: Kit, x: number, z: number) {
  for (const [dx, dz] of [[-0.11, -0.11], [0.11, -0.11], [-0.11, 0.11], [0.11, 0.11]]) kit.box(0x5e4630, x + dx, 0.36, z + dz, 0.05, 0.62, 0.05);
  kit.box(0x5e4630, x, 0.3, z, 0.26, 0.04, 0.04);
  kit.box(0x5e4630, x, 0.3, z, 0.04, 0.04, 0.26);
  kit.box(0xa9773f, x, 0.7, z, 0.38, 0.07, 0.38);
}

function table(kit: Kit, x: number, z: number) {
  kit.box(0x3a3632, x, 0.06, z, 0.5, 0.06, 0.5);
  kit.box(0x3a3632, x, 0.5, z, 0.09, 0.9, 0.09);
  kit.solid(new THREE.CylinderGeometry(0.48, 0.48, 0.07, 12), 0x9a6a3e, x, 0.98, z);
  kit.box(0xd7a43a, x + 0.15, 1.1, z + 0.05, 0.1, 0.17, 0.1);
  kit.box(0xf4efe0, x + 0.15, 1.2, z + 0.05, 0.1, 0.03, 0.1);
  kit.box(0x3f6b3a, x - 0.15, 1.15, z - 0.1, 0.07, 0.27, 0.07);
  kit.box(0x3f6b3a, x - 0.15, 1.32, z - 0.1, 0.035, 0.08, 0.035);
  kit.box(0xe9e2cf, x - 0.05, 1.03, z + 0.2, 0.16, 0.02, 0.16);
}

export function buildPub(kit: Kit) {
  const { box } = kit;

  // Flagstone terrace in front, gravel round the back
  box(0xa59a83, 0, 0.03, 0, 8, 0.06, 8);
  box(0xc2b08c, 0, 0.07, 2.25, 8, 0.06, 3.5);
  for (let x = -3.5; x <= 3.5; x += 0.7) box(0xa8987a, x, 0.105, 2.25, 0.03, 0.01, 3.5);
  for (let z = 0.85; z <= 3.9; z += 0.6) box(0xa8987a, 0, 0.105, z, 8, 0.01, 0.03);
  for (const [x, z] of [[-1.05, 1.15], [1.75, 3.55], [-2.8, 3.25], [0.35, 2.05]]) box(0xb3a07d, x, 0.11, z, 0.6, 0.01, 0.5);
  box(0x8f8572, 0, 0.12, 3.93, 8, 0.12, 0.14);

  // Stone plinth, walls (y 0.35..3.45), quoins, base band, cornice
  box(0x8f8572, 0, 0.175, -1.6, 6.9, 0.35, 4.1);
  box(0x7d7464, 0, 0.36, -1.6, 6.96, 0.04, 4.16);
  box(WALL, 0, 1.9, -1.6, 6.6, 3.1, 3.8);
  box(0xb98a56, 0, 0.6, -1.6, 6.66, 0.45, 3.86);
  for (const x of [-3.3, 3.3]) {
    for (const z of [0.3, -3.5]) {
      for (let i = 0; i < 6; i++) {
        const big = i % 2 === 0;
        box(0xd9cfb8, x + Math.sign(x) * 0.02, 1.0 + i * 0.42, z + Math.sign(z + 1.6) * 0.02, big ? 0.5 : 0.36, 0.36, big ? 0.36 : 0.5);
      }
    }
  }
  box(TRIM, 0, 3.4, -1.6, 6.82, 0.16, 4.02);
  box(0xd9cfb8, 0, 3.27, -1.6, 6.72, 0.1, 3.92);

  // Hipped terracotta tile roof with gutters
  hipRoof(kit, {
    x0: -3.75, x1: 3.75, z0: -3.8, z1: 0.82, eave: 3.48, rise: 1.45, runX: 2.31, runZ: 2.31,
    color: 0xb35e3f, rib: 0x9a4a30, course: 0x7f3b26, cap: 0xa04a2e, fascia: 0xe9e1cc, gutter: 0x8c9089,
    ribStep: 0.3, courses: 6, patches: [0xc0612f, 0x9e5236, 0xc77a4a],
  });
  // Brick chimney with cap and smoke-stain
  box(0x9e5a3e, 1.6, 4.6, -2.5, 0.6, 2.0, 0.6);
  for (let y = 3.8; y < 5.6; y += 0.25) box(0x8a4c34, 1.6, y, -2.5, 0.62, 0.025, 0.62);
  box(0xd9cfb8, 1.6, 5.66, -2.5, 0.78, 0.12, 0.78);
  box(0x3a3632, 1.6, 5.78, -2.5, 0.34, 0.12, 0.34);
  box(0x4a4540, 1.6, 5.86, -2.5, 0.5, 0.05, 0.5);

  // ---------- Front (+z) ----------
  const F = face(kit, 0, 0.3, 0);
  door(F, 0, 0.35, 1.3, 2.4, { leaf: WOOD, frame: TRIM, trim: 0x5e4630, handle: 0xc9b16f, double: true });
  for (const x of [-0.33, 0.33]) F.put(0x5e4630, x, 1.55, 0.12, 0.5, 0.9, 0.04);
  for (const lat of [-1.95, 1.95]) {
    detailedWindow(F, lat, 1.95, 0.9, 1.3, { shutter: SHUTTER, flowers: [0xe86a7a, 0xf3d27a, 0xffffff] });
  }
  // Painted name board standing on the front eave
  for (const x of [-0.9, 0.9]) box(0x3a3632, x, 3.75, 0.6, 0.06, 0.4, 0.06);
  box(0x4e3a28, 0, 4.0, 0.66, 2.3, 0.56, 0.07);
  box(0xd7a43a, 0, 4.0, 0.7, 2.14, 0.42, 0.02);
  pixelText(face(kit, 0, 0.71, 0), "PUB", 0, 4.03, 0.01, 0.065, 0x3a2a1e);
  box(0xb8432f, 0, 3.82, 0.715, 1.9, 0.04, 0.01);
  // Pendant lantern under the awning
  box(0x2f2d2a, 0, 2.86, 0.95, 0.03, 0.3, 0.03);
  box(0x2f2d2a, 0, 2.7, 0.95, 0.26, 0.05, 0.26);
  box(0xf3d27a, 0, 2.53, 0.95, 0.2, 0.28, 0.2);
  box(0x2f2d2a, 0, 2.37, 0.95, 0.22, 0.04, 0.22);

  // Striped awning on iron rafters and two posts
  const run = 1.5;
  const drop = 0.55;
  const tilt = Math.atan2(drop, run);
  const len = Math.hypot(drop, run);
  const stripes = 16;
  const span = 6.4;
  const sw = span / stripes;
  for (let i = 0; i < stripes; i++) {
    const lat = -span / 2 + sw * (i + 0.5);
    const color = i % 2 ? AWNING_B : AWNING_A;
    F.put(color, lat, 3.14 - drop / 2, 0.08 + run / 2, sw, 0.04, len, tilt);
    F.put(color, lat, 3.14 - drop - 0.14, 0.1 + run, sw, 0.28, 0.03);
    F.put(color, lat, 3.14 - drop - 0.3, 0.1 + run, sw * 0.5, 0.06, 0.03);
  }
  F.put(0x3a3632, 0, 3.16, 0.06, span + 0.1, 0.08, 0.12);
  for (const lat of [-3.05, -1.0, 1.0, 3.05]) beam(kit, 0x3a3632, [lat, 3.1, 0.35], [lat, 3.1 - drop, 0.3 + run], 0.04);
  for (const x of [-3.05, 3.05]) {
    box(WOOD, x, 1.35, 1.8, 0.12, 2.6, 0.12);
    box(0x3a3632, x, 0.1, 1.8, 0.22, 0.08, 0.22);
  }

  // Terrace: tables, stools, chalkboard, barrel table
  for (const [x, z] of [[-2.2, 2.75], [2.2, 2.75]] as const) {
    table(kit, x, z);
    for (let k = 0; k < 3; k++) {
      const a = k * 2 * Math.PI / 3 + 0.5;
      stool(kit, x + Math.cos(a) * 0.82, z + Math.sin(a) * 0.82);
    }
  }
  barrel(kit, -3.55, 1.35, 0.1);
  box(0x6e4a2c, -3.55, 1.04, 1.35, 0.7, 0.05, 0.7);
  box(0xd7a43a, -3.45, 1.15, 1.3, 0.1, 0.17, 0.1);
  beam(kit, 0x5e4630, [0.95, 0.1, 1.55], [1.05, 1.0, 1.7], 0.06);
  beam(kit, 0x5e4630, [1.35, 0.1, 1.55], [1.25, 1.0, 1.7], 0.06);
  beam(kit, 0x5e4630, [0.95, 0.1, 1.85], [1.05, 1.0, 1.7], 0.06);
  beam(kit, 0x5e4630, [1.35, 0.1, 1.85], [1.25, 1.0, 1.7], 0.06);
  box(0x2e3b33, 1.15, 0.62, 1.88, 0.5, 0.65, 0.03, -0.17);
  for (const y of [0.78, 0.66, 0.54]) box(0xe9e2cf, 1.15, y, 1.9, 0.32, 0.03, 0.01, -0.17);

  // String lights: roof corners to tall posts at the terrace front
  for (const x of [-3.8, 3.8]) {
    box(WOOD, x, 1.65, 3.78, 0.12, 3.3, 0.12);
    box(0x3a3632, x, 0.12, 3.78, 0.26, 0.1, 0.26);
  }
  stringLights(kit, [-3.8, 3.25, 3.78], [3.8, 3.25, 3.78], 0.45, 13, BULBS);
  stringLights(kit, [-3.6, 3.3, 0.9], [-3.8, 3.2, 3.78], 0.35, 5, BULBS);
  stringLights(kit, [3.6, 3.3, 0.9], [3.8, 3.2, 3.78], 0.35, 5, BULBS);
  stringLights(kit, [0, 3.3, 0.95], [0, 3.1, 3.78], 0.3, 5, BULBS);

  // Plants by the door
  plant(kit, -0.98, 0.65, 0.1, 0x9c5b3b, [0xe86a7a, 0xf3d27a], 0.8);
  palm(kit, 0.95, 0.68, 0.1, 0.75);
  stain(F, -2.15, 0.95, 0.9, 0.25, 0xd7b47a);
  stain(F, 2.85, 2.9, 0.4, 0.4, 0xd7b47a);
  stain(F, -0.95, 0.9, 0.35, 0.2, 0xd7b47a);

  // ---------- Right (+x): hanging sign, barrels, crates ----------
  const R = face(kit, 3.3, -1.6, Math.PI / 2);
  detailedWindow(R, 0.1, 1.95, 0.9, 1.3, { shutter: SHUTTER });
  downspout(R, 1.6, 3.4);
  downspout(R, -1.6, 3.4);
  // Wrought-iron bracket with a swinging painted board (mug)
  box(0x2f2d2a, 3.42, 3.0, -0.35, 0.12, 0.3, 0.12);
  box(0x2f2d2a, 3.68, 3.0, -0.35, 0.6, 0.05, 0.05);
  beam(kit, 0x2f2d2a, [3.4, 2.75, -0.35], [3.9, 2.98, -0.35], 0.035);
  for (const x of [3.5, 3.86]) box(0x2f2d2a, x, 2.88, -0.35, 0.02, 0.2, 0.02);
  box(0x4e3a28, 3.68, 2.45, -0.35, 0.6, 0.66, 0.06);
  box(0x2e5b41, 3.68, 2.45, -0.35, 0.5, 0.56, 0.08);
  box(0xd7a43a, 3.66, 2.38, -0.35, 0.22, 0.26, 0.1);
  box(0xf4efe0, 3.66, 2.54, -0.35, 0.24, 0.07, 0.1);
  box(0xd7a43a, 3.8, 2.38, -0.35, 0.06, 0.14, 0.1);
  barrel(kit, 3.6, -0.75, 0.06);
  barrel(kit, 3.6, -1.45, 0.06);
  barrel(kit, 3.55, -2.3, 0.06, 0.8, 0.3);
  for (const [z, y] of [[-3.1, 0.3], [-3.1, 0.78], [-2.95, 1.2]]) {
    box(0xb28b60, 3.65, y, z, 0.5, 0.45, 0.5);
    box(0x7d6b55, 3.65, y, z, 0.52, 0.06, 0.52);
    box(0x7d6b55, 3.65, y + 0.18, z, 0.52, 0.04, 0.52);
  }
  stain(R, 0.9, 0.95, 0.8, 0.25, 0xd7b47a);
  stain(R, -1.4, 2.6, 0.35, 0.5, 0xd7b47a);

  // ---------- Back (-z) ----------
  const B = face(kit, 0, -3.5, Math.PI);
  door(B, 1.6, 0.35, 0.95, 2.3, { leaf: WOOD, frame: TRIM, trim: 0x5e4630 });
  detailedWindow(B, -1.3, 1.95, 0.9, 1.2, { shutter: SHUTTER });
  wallLamp(B, 0.6, 2.4);
  for (const x of [-2.6, -3.1]) box(0x4b6b4b, x, 0.4, -3.78, 0.45, 0.7, 0.38);
  stain(B, -1.3, 1.0, 0.8, 0.3, 0xd7b47a);

  // ---------- Left (-x) ----------
  const L = face(kit, -3.3, -1.6, -Math.PI / 2);
  detailedWindow(L, 0, 1.95, 0.9, 1.3, { shutter: SHUTTER });
  downspout(L, -1.6, 3.4);
  stain(L, 0.9, 1.0, 0.7, 0.25, 0xd7b47a);
}
