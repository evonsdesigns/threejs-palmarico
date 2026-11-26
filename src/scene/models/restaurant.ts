import * as THREE from "three";
import { Kit } from "./kit";
import { beam, detailedWindow, door, Face, face, hipRoof, plant, stain, stripeTexture, wallLamp } from "./services-parts";

const WALL = 0xece7da;
const TRIM = 0xf2eee2;
const BLUE = 0x6f9cc4;
const DEEP_BLUE = 0x3f6f9a;
const GREEN = 0x4c8b55;
const STRIPE_WHITE = 0xf1efe3;
const FLOWERS = [0xe3c53e, 0xd8434f, 0xf08fb0, 0xffffff];

/** Half-disc (upper semicircle) slab on a wall, used for arches and fanlights. */
function halfDisc(kit: Kit, F: Face, lat: number, y: number, out: number, r: number, depth: number, color: number) {
  const geometry = new THREE.CylinderGeometry(r, r, depth, 12, 1, false, Math.PI / 2, Math.PI);
  geometry.rotateX(Math.PI / 2);
  geometry.rotateY(F.f);
  const [x, z] = F.at(lat, out);
  kit.solid(geometry, color, x, y, z);
}

/** Arched doorway with blue frame, fanlight, glazed double doors and keystone. */
function archedDoor(kit: Kit, F: Face, lat: number, y0: number, w: number, h: number) {
  const r = w / 2;
  const spring = y0 + h;
  door(F, lat, y0, w, h, { leaf: DEEP_BLUE, frame: BLUE, trim: 0x355d82, handle: 0xc9b16f, double: true, glazed: true, glass: 0x7fa2ab });
  halfDisc(kit, F, lat, spring + 0.16, 0.05, r + 0.18, 0.12, BLUE);
  halfDisc(kit, F, lat, spring + 0.16, 0.1, r, 0.04, 0x3e4a52);
  for (const a of [Math.PI / 6, Math.PI / 2, 5 * Math.PI / 6]) {
    const [x0, z0] = F.at(lat, 0.13);
    const [x1, z1] = F.at(lat + Math.cos(a) * r, 0.13);
    beam(kit, BLUE, [x0, spring + 0.16, z0], [x1, spring + 0.16 + Math.sin(a) * r, z1], 0.05);
  }
  F.put(TRIM, lat, spring + 0.16 + r + 0.12, 0.12, 0.28, 0.34, 0.1);
  for (const side of [-1, 1]) F.put(TRIM, lat + side * (r + 0.2), spring + 0.16, 0.08, 0.3, 0.12, 0.16);
}

/** Green-and-white striped awning above a window. */
function stripedAwning(F: Face, lat: number, top: number, width: number, run = 0.85, drop = 0.45) {
  const tilt = Math.atan2(drop, run);
  const len = Math.hypot(drop, run);
  const stripes = Math.max(4, Math.round(width / 0.3));
  const sw = width / stripes;
  for (let i = 0; i < stripes; i++) {
    const lat0 = lat - width / 2 + sw * (i + 0.5);
    const color = i % 2 ? STRIPE_WHITE : GREEN;
    F.put(color, lat0, top - drop / 2, 0.06 + run / 2, sw, 0.04, len, tilt);
    F.put(color, lat0, top - drop - 0.11, 0.08 + run, sw, 0.22, 0.03);
    F.put(color, lat0, top - drop - 0.25, 0.08 + run, sw * 0.5, 0.06, 0.03);
  }
  F.put(0x2f2d2a, lat, top + 0.02, 0.06, width + 0.08, 0.06, 0.1);
  for (const side of [-1, 1]) {
    F.put(0x2f2d2a, lat + side * (width / 2 - 0.03), top - drop / 2, 0.06 + run / 2, 0.03, 0.03, len, tilt);
  }
}

function blueWindow(F: Face, lat: number, y: number, w: number, h: number, run = 0.85) {
  F.put(BLUE, lat, y, 0.02, w + 0.62, h + 0.62, 0.05);
  detailedWindow(F, lat, y, w, h, { lintel: TRIM, flowers: FLOWERS });
  stripedAwning(F, lat, y + h / 2 + 0.75, w + 0.5, run, run > 0.5 ? 0.45 : 0.32);
}

function umbrellaTable(kit: Kit, x: number, z: number, color: number) {
  // Table with cloth, pedestal and settings
  kit.box(0x3a3632, x, 0.13, z, 0.5, 0.06, 0.5);
  kit.box(0xd8d6cc, x, 0.47, z, 0.1, 0.66, 0.1);
  kit.solid(new THREE.CylinderGeometry(0.52, 0.5, 0.08, 12), 0xf4f2ea, x, 0.82, z);
  kit.box(color, x, 0.87, z, 0.5, 0.012, 0.5);
  for (const [dx, dz] of [[0.25, 0], [-0.25, 0], [0, 0.25], [0, -0.25]]) kit.box(0xffffff, x + dx, 0.875, z + dz, 0.16, 0.015, 0.16);
  kit.box(0xc8d9dc, x, 0.95, z, 0.07, 0.14, 0.07);
  kit.box(0xd8434f, x, 1.05, z, 0.08, 0.07, 0.08);
  // Chairs, backs facing away from the table
  for (let k = 0; k < 4; k++) {
    const a = Math.PI / 4 + k * Math.PI / 2;
    const c = Math.cos(a);
    const s = Math.sin(a);
    const ry = Math.PI / 2 - a;
    kit.box(0xe9e7de, x + c * 0.72, 0.5, z + s * 0.72, 0.42, 0.06, 0.42, 0, ry);
    for (const [u, v] of [[-0.17, -0.17], [0.17, -0.17], [-0.17, 0.17], [0.17, 0.17]]) {
      const px = x + c * (0.72 + v) + s * u;
      const pz = z + s * (0.72 + v) - c * u;
      kit.box(0xcac7bc, px, 0.24, pz, 0.04, 0.48, 0.04);
    }
    kit.box(0xe9e7de, x + c * 0.92, 0.82, z + s * 0.92, 0.42, 0.6, 0.05, 0, ry);
    kit.box(color, x + c * 0.94, 0.88, z + s * 0.94, 0.3, 0.06, 0.02, 0, ry);
  }
  // Umbrella: weighted base, pole, ribs, striped canopy, valance, finial
  kit.box(0x8c8a82, x, 0.16, z, 0.3, 0.08, 0.3);
  kit.box(0xefefe8, x, 1.55, z, 0.07, 2.9, 0.07);
  const r = 1.08;
  kit.solid(new THREE.ConeGeometry(r, 0.45, 8, 1, true), 0xffffff, x, 2.6, z, kit.ghost ? null : stripeTexture(`#${color.toString(16).padStart(6, "0")}`, "#f6f4ec", 8));
  for (let k = 0; k < 8; k++) {
    const a = (k + 0.5) * Math.PI / 4;
    const mid = r * Math.cos(Math.PI / 8);
    kit.box(k % 2 ? 0xf6f4ec : color, x + Math.sin(a) * mid, 2.29, z + Math.cos(a) * mid, 2 * r * Math.sin(Math.PI / 8), 0.17, 0.02, 0, a);
    const b = k * Math.PI / 4;
    beam(kit, 0xd8d6cc, [x, 2.15, z], [x + Math.sin(b) * r * 0.95, 2.4, z + Math.cos(b) * r * 0.95], 0.025);
  }
  kit.box(0xefefe8, x, 2.88, z, 0.12, 0.12, 0.12);
}

export function buildRestaurant(kit: Kit) {
  const { box, solid } = kit;
  const cx = -2;
  const cz = -1.6;

  // Lot paving with a tiled dining terrace (front strip and +x side)
  box(0xcdbf9f, 0, 0.04, 0, 12, 0.08, 8);
  box(0xd9ccb0, 0, 0.1, 2.2, 12, 0.04, 3.6);
  box(0xd9ccb0, 3.8, 0.1, -1.8, 4.4, 0.04, 4.4);
  for (let x = -5.7; x < 6; x += 0.6) box(0xc4b594, x, 0.125, 2.2, 0.03, 0.01, 3.6);
  for (let z = 0.7; z < 4; z += 0.6) box(0xc4b594, 0, 0.125, z, 12, 0.01, 0.03);
  for (let x = 1.9; x < 6; x += 0.6) box(0xc4b594, x, 0.125, -1.8, 0.03, 0.01, 4.4);
  for (let z = -3.7; z < 0.4; z += 0.6) box(0xc4b594, 3.8, 0.125, z, 4.4, 0.01, 0.03);
  for (const [x, z] of [[-1.3, 1.4], [2.3, 3.2], [4.6, -0.9], [-5.2, 3.5]]) box(0xcbbd9c, x, 0.13, z, 0.6, 0.01, 0.6);

  // Plinth, walls, blue base band, cornice
  box(0xcdbf9f, cx, 0.17, cz, 7.5, 0.3, 4.3);
  box(WALL, cx, 2.03, cz, 7.2, 3.46, 4.0);
  box(BLUE, cx, 0.52, cz, 7.28, 0.42, 4.08);
  box(0x5d87ad, cx, 0.75, cz, 7.3, 0.05, 4.1);
  box(TRIM, cx, 3.66, cz, 7.5, 0.2, 4.3);
  box(0xe1dccd, cx, 3.5, cz, 7.36, 0.12, 4.16);
  for (const x of [-5.55, 1.55]) for (const z of [0.35, -3.55]) box(TRIM, x, 2.1, z, 0.22, 2.9, 0.22);

  // Hipped terracotta roof around a raised flat roof
  const { inner } = hipRoof(kit, {
    x0: -5.9, x1: 1.9, z0: -3.9, z1: 0.7, eave: 3.78, rise: 0.95, runX: 1.4, runZ: 1.4,
    color: 0xb06a42, rib: 0x9a5233, course: 0x8f4a2c, cap: 0xa04a2e, fascia: 0x8f4a2c,
    ribStep: 0.32, courses: 5, patches: [0xd08a45, 0xc0612f],
  });
  const ix0 = inner[0][0];
  const ix1 = inner[1][0];
  const iz1 = inner[0][1];
  const iz0 = inner[2][1];
  const top = 3.78 + 0.95;
  box(WALL, cx, (3.78 + top) / 2 + 0.05, cz, ix1 - ix0, top - 3.78 + 0.1, iz1 - iz0);
  box(0x52554e, cx, top + 0.1, cz, ix1 - ix0 + 0.1, 0.08, iz1 - iz0 + 0.1);
  for (let x = ix0 + 0.6; x < ix1; x += 0.8) box(0x5c5f57, x, top + 0.145, cz, 0.04, 0.01, iz1 - iz0 - 0.2);
  // White balustrade
  const bx0 = ix0 + 0.12;
  const bx1 = ix1 - 0.12;
  const bz0 = iz0 + 0.12;
  const bz1 = iz1 - 0.12;
  const by = top + 0.14;
  for (const z of [bz0, bz1]) {
    box(TRIM, cx, by + 0.04, z, bx1 - bx0 + 0.12, 0.08, 0.16);
    box(TRIM, cx, by + 0.47, z, bx1 - bx0 + 0.16, 0.07, 0.2);
    for (let x = bx0 + 0.25; x < bx1 - 0.1; x += 0.3) {
      box(0xf4f1e8, x, by + 0.24, z, 0.08, 0.34, 0.08);
      box(0xf4f1e8, x, by + 0.2, z, 0.13, 0.12, 0.13);
    }
  }
  for (const x of [bx0, bx1]) {
    box(TRIM, x, by + 0.04, cz, 0.16, 0.08, bz1 - bz0);
    box(TRIM, x, by + 0.47, cz, 0.2, 0.07, bz1 - bz0 + 0.2);
    for (let z = bz0 + 0.25; z < bz1 - 0.1; z += 0.3) {
      box(0xf4f1e8, x, by + 0.24, z, 0.08, 0.34, 0.08);
      box(0xf4f1e8, x, by + 0.2, z, 0.13, 0.12, 0.13);
    }
  }
  for (const x of [bx0, cx, bx1]) for (const z of [bz0, bz1]) box(TRIM, x, by + 0.26, z, 0.2, 0.5, 0.2);
  // Two terracotta chimneys with caps and pots
  for (const x of [-3.75, -0.3]) {
    box(0x8f4a2c, x, top + 0.2, cz - 0.2, 0.7, 0.12, 0.7);
    solid(new THREE.CylinderGeometry(0.28, 0.3, 1.3, 10), 0xa34e35, x, top + 0.85, cz - 0.2);
    solid(new THREE.CylinderGeometry(0.36, 0.36, 0.14, 10), 0x7a3a28, x, top + 1.55, cz - 0.2);
    box(0x7a3a28, x, top + 1.72, cz - 0.2, 0.2, 0.22, 0.2);
    box(0x4a3a30, x, top + 1.84, cz - 0.2, 0.26, 0.04, 0.26);
  }

  // ---------- Front (+z) ----------
  const F = face(kit, cx, 0.4, 0);
  box(0xcdbf9f, cx - 0.4, 0.2, 0.75, 2.4, 0.2, 0.7);
  box(0xbdae8c, cx - 0.4, 0.3, 1.09, 2.4, 0.02, 0.04);
  archedDoor(kit, F, -0.4, 0.3, 1.4, 2.0);
  blueWindow(F, -2.55, 2.0, 1.2, 1.3);
  blueWindow(F, 2.65, 2.0, 0.9, 1.3);
  wallLamp(F, -1.55, 2.45);
  // Round painted sign with a blue rim
  {
    const [x, z] = F.at(1.15, 0.1);
    const rim = solid(new THREE.CylinderGeometry(0.5, 0.5, 0.1, 18), BLUE, x, 2.85, z);
    rim.rotation.x = Math.PI / 2;
    const disc = solid(new THREE.CylinderGeometry(0.43, 0.43, 0.12, 18), 0xf3efe2, x, 2.85, z + 0.01);
    disc.rotation.x = Math.PI / 2;
    F.put(0x4f8040, 1.15, 2.85, 0.19, 0.52, 0.22, 0.03);
    F.put(0x5f8f45, 1.02, 3.0, 0.2, 0.18, 0.12, 0.03);
    for (const [dl, dy] of [[-0.17, 0.05], [0.03, -0.05], [0.2, 0.07]]) F.put(0xc0392b, 1.15 + dl, 2.85 + dy, 0.22, 0.15, 0.15, 0.03);
    F.put(DEEP_BLUE, 1.15, 2.6, 0.22, 0.5, 0.05, 0.02);
  }
  plant(kit, -3.35, 0.75, 0.1, 0x9c5b3b, [0xd8434f, 0xe3c53e, 0xf08fb0], 0.85);
  plant(kit, -1.45, 0.75, 0.1, 0x9c5b3b, [0xd8434f, 0xe3c53e, 0xf08fb0], 0.85);
  stain(F, -2.55, 0.95, 1.0, 0.12, 0xd9d3c3);
  stain(F, 3.35, 3.2, 0.3, 0.25, 0xddd6c5);

  // ---------- Right (+x): side doorway onto the terrace ----------
  const R = face(kit, 1.6, cz, Math.PI / 2);
  box(0xcdbf9f, 1.9, 0.2, -0.7, 0.6, 0.2, 1.7);
  archedDoor(kit, R, -0.9, 0.3, 1.1, 2.0);
  blueWindow(R, 1.05, 2.0, 0.85, 1.3);
  wallLamp(R, 0.13, 2.5);
  stain(R, 1.05, 0.95, 0.9, 0.12, 0xd9d3c3);
  plant(kit, 2.0, -1.75, 0.1, 0x9c5b3b, FLOWERS, 0.7);

  // ---------- Back (-z): kitchen door, vent, gas bottles, bins ----------
  const B = face(kit, cx, -3.6, Math.PI);
  door(B, -2.2, 0.3, 0.95, 2.2, { leaf: DEEP_BLUE, frame: BLUE, trim: 0x355d82 });
  blueWindow(B, 2.5, 2.0, 1.0, 1.2, 0.3);
  blueWindow(B, 0.2, 2.0, 1.0, 1.2, 0.3);
  B.put(0x9fa6a3, -0.9, 3.05, 0.18, 0.6, 0.5, 0.36);
  for (let d = -0.2; d <= 0.2; d += 0.1) B.put(0x6a6c66, -0.9 + d, 3.05, 0.37, 0.04, 0.4, 0.02);
  for (const x of [-3.8, -3.4]) {
    solid(new THREE.CylinderGeometry(0.17, 0.17, 0.9, 8), 0x8e3b33, x, 0.56, -3.8);
    box(0x5a5c57, x, 1.06, -3.8, 0.08, 0.1, 0.08);
  }
  for (const x of [1.15, 1.65]) {
    box(0x4b6b4b, x, 0.45, -3.82, 0.48, 0.75, 0.32);
    box(0x3c573c, x, 0.85, -3.82, 0.52, 0.06, 0.36);
  }

  // ---------- Left (-x) ----------
  const L = face(kit, -5.6, cz, -Math.PI / 2);
  blueWindow(L, -0.95, 2.0, 0.9, 1.3, 0.3);
  blueWindow(L, 0.95, 2.0, 0.9, 1.3, 0.3);
  stain(L, 0, 0.95, 1.6, 0.12, 0xd9d3c3);

  // ---------- Terrace: low wall, gate piers, planters, umbrellas ----------
  box(TRIM, -4.63, 0.38, 3.84, 2.66, 0.6, 0.2);
  box(TRIM, 2.23, 0.38, 3.84, 7.46, 0.6, 0.2);
  box(TRIM, 5.84, 0.38, -0.11, 0.2, 0.6, 7.7);
  box(0xa34e35, -4.63, 0.71, 3.84, 2.66, 0.07, 0.24);
  box(0xa34e35, 2.23, 0.71, 3.84, 7.46, 0.07, 0.24);
  box(0xa34e35, 5.84, 0.71, -0.11, 0.24, 0.07, 7.7);
  for (const x of [-3.15, -1.65]) {
    box(TRIM, x, 0.6, 3.8, 0.4, 1.0, 0.3);
    box(0xa34e35, x, 1.14, 3.8, 0.44, 0.08, 0.34);
    plant(kit, x, 3.8, 1.18, 0x9c5b3b, [0xd8434f, 0xe3c53e], 0.55);
  }
  for (const [x, z] of [[-5.6, 3.78], [5.76, 3.6], [5.76, 0.4], [5.76, -3.55]]) plant(kit, x, z, 0.75, 0x9c5b3b, FLOWERS, 0.6);
  for (let x = -5.2; x < -3.5; x += 0.55) box(0x5f8f45, x, 0.82, 3.84, 0.3, 0.16, 0.22);
  umbrellaTable(kit, -4.3, 2.4, 0x2f8fd6);
  umbrellaTable(kit, 0.3, 2.45, 0xf2cf2b);
  umbrellaTable(kit, 3.85, 2.45, 0x2f8fd6);
  umbrellaTable(kit, 3.95, -2.2, 0xf2cf2b);
}
