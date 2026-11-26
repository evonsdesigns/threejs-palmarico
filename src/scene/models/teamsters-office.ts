import * as THREE from "three";
import { Kit } from "./kit";
import { createParts, Face } from "./teamster-parts";

const WALL = 0xe3ddce;
const STONE = 0x92908a;
const STONE_LIGHT = 0xa9a69e;
const MORTAR = 0x6d6b66;
const ROOF = 0x343b3c;
const TILE = 0xa34e35;
const TILE_LIGHT = 0xb35e3f;
const TILE_DARK = 0x86402b;
const TRIM = 0xa6573b;
const BLUE = 0x537a9a;
const BLUE_DARK = 0x3f5f7d;
const WHITE = 0xf2efe6;
const GLASS = 0x2a3236;
const SOIL = 0x756345;
const WOOD = 0x9a8967;
const WOOD_DARK = 0x755b43;
const METAL = 0x858079;
const MAST = 0xeeece4;
const WIRE = 0x2e2e2c;
const CONCRETE = 0xb9b4a8;
const GRIME = 0xd3cab5;
const SACK = 0xcdbb8f;

// Main block and garage annex extents (3 x 2 tiles: x in [-6, 6], z in [-4, 4]).
const X0 = -2.4, X1 = 5.6, Z0 = -3.6, Z1 = 2.4;
const CX = (X0 + X1) / 2, CZ = (Z0 + Z1) / 2, W = X1 - X0, D = Z1 - Z0;
const BASE = 0.45, TOP = 3.6, PARAPET = 4.0;
const AX0 = -5.7, AX1 = X0, AZ0 = -3.4, AZ1 = 2.0, AH = 2.6;
const ACX = (AX0 + AX1) / 2, ACZ = (AZ0 + AZ1) / 2, AW = AX1 - AX0, AD = AZ1 - AZ0;
const MX = -1.9, MZ = 3.05;

export function buildTeamstersOffice(kit: Kit) {
  const { box, solid } = kit;
  const { onFace, beam, rand } = createParts(kit);
  const front: Face = { x: CX, z: Z1, yaw: 0 };
  const right: Face = { x: X1, z: CZ, yaw: Math.PI / 2 };
  const back: Face = { x: CX, z: Z0, yaw: Math.PI };

  // Dirt yard with darker patches and tyre tracks into the garage.
  box(SOIL, 0, 0.02, 0, 12, 0.04, 8);
  for (let i = 0; i < 14; i++) {
    const w = 0.6 + rand() * 1.4;
    const d = 0.4 + rand() * 1.0;
    const px = -5.9 + w / 2 + rand() * (11.8 - w);
    const pz = 2.5 + d / 2 + rand() * Math.max(0, 1.45 - d);
    box(i % 2 ? 0x66563c : 0x857152, px, 0.042 + (i % 3) * 0.002, Math.min(pz, 3.95 - d / 2), w, 0.004, d);
  }
  for (const tx of [-4.75, -3.45]) box(0x5c4d35, tx, 0.05, 3.1, 0.32, 0.01, 1.8);
  box(0x857152, 3.5, 0.045, 3.92, 2.6, 0.006, 0.16);

  // ---------- Main block ----------
  box(TRIM, CX, BASE / 2, CZ, W + 0.16, BASE, D + 0.16);
  box(TILE_DARK, CX, BASE + 0.03, CZ, W + 0.2, 0.06, D + 0.2);
  box(WALL, CX, (BASE + TOP) / 2, CZ, W, TOP - BASE, D);
  box(WHITE, CX, TOP - 0.08, CZ, W + 0.14, 0.16, D + 0.14);
  box(WALL, CX, TOP - 0.24, CZ, W + 0.06, 0.12, D + 0.06);

  // Parapet walls with corner piers.
  box(WALL, CX, (TOP + PARAPET) / 2, Z1 - 0.125, W, PARAPET - TOP, 0.25);
  box(WALL, CX, (TOP + PARAPET) / 2, Z0 + 0.125, W, PARAPET - TOP, 0.25);
  box(WALL, X0 + 0.125, (TOP + PARAPET) / 2, CZ, 0.25, PARAPET - TOP, D - 0.5);
  box(WALL, X1 - 0.125, (TOP + PARAPET) / 2, CZ, 0.25, PARAPET - TOP, D - 0.5);

  const coping = (ax: number, az: number, bx: number, bz: number, y: number, skip?: (x: number, z: number) => boolean) => {
    const length = Math.hypot(bx - ax, bz - az);
    const ry = Math.atan2(-(bz - az), bx - ax);
    box(TILE_DARK, (ax + bx) / 2, y - 0.06, (az + bz) / 2, length, 0.05, 0.36, 0, ry);
    const count = Math.max(1, Math.round(length / 0.34));
    for (let i = 0; i < count; i++) {
      const t = (i + 0.5) / count;
      const x = ax + (bx - ax) * t;
      const z = az + (bz - az) * t;
      if (skip?.(x, z)) continue;
      box(i % 3 === 1 ? TILE_LIGHT : TILE, x, y, z, length / count - 0.03, 0.1, 0.42, 0, ry);
      box(TILE_DARK, x, y + 0.055, z, length / count - 0.12, 0.02, 0.1, 0, ry);
    }
  };
  const inPediment = (x: number, z: number) => z > 2 && x > 2.3 && x < 4.7;
  coping(X0 + 0.6, Z1 - 0.125, X1 - 0.6, Z1 - 0.125, PARAPET + 0.05, inPediment);
  coping(X0 + 0.6, Z0 + 0.125, X1 - 0.6, Z0 + 0.125, PARAPET + 0.05);
  coping(X0 + 0.125, Z0 + 0.6, X0 + 0.125, Z1 - 0.6, PARAPET + 0.05);
  coping(X1 - 0.125, Z0 + 0.6, X1 - 0.125, Z1 - 0.6, PARAPET + 0.05);
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const px = (sx > 0 ? X1 : X0) - sx * 0.3;
      const pz = (sz > 0 ? Z1 : Z0) - sz * 0.3;
      box(WALL, px, (TOP + 4.3) / 2, pz, 0.62, 4.3 - TOP, 0.62);
      box(TILE_DARK, px, 4.33, pz, 0.72, 0.06, 0.72);
      box(TILE, px, 4.41, pz, 0.68, 0.1, 0.68);
      box(TILE_LIGHT, px, 4.49, pz, 0.36, 0.08, 0.36);
    }
  }

  // Tar roof, mottled with patches and seams.
  box(ROOF, CX, TOP + 0.06, CZ, W - 0.5, 0.12, D - 0.5);
  const roofTop = TOP + 0.12;
  for (let x = X0 + 1.1; x < X1 - 0.4; x += 0.95) box(0x4a5052, x, roofTop + 0.003, CZ, 0.05, 0.006, D - 0.55);
  const patchColors = [0x2e3436, 0x3b4244, 0x30373a, 0x41474a, 0x2a2f31];
  for (let i = 0; i < 70; i++) {
    const w = 0.2 + rand() * 0.9;
    const d = 0.2 + rand() * 0.8;
    const px = X0 + 0.3 + w / 2 + rand() * (W - 0.6 - w);
    const pz = Z0 + 0.3 + d / 2 + rand() * (D - 0.6 - d);
    box(patchColors[i % patchColors.length], px, roofTop + 0.004 + (i % 5) * 0.0015, pz, w, 0.004, d);
  }
  // Roof hatch, vents and scuppers.
  box(WALL, 4.1, roofTop + 0.18, -2.3, 0.95, 0.36, 0.95);
  box(METAL, 4.1, roofTop + 0.39, -2.3, 1.05, 0.06, 1.05);
  box(0x6b6b58, 4.1, roofTop + 0.43, -2.0, 0.5, 0.04, 0.06);
  for (const [vx, vz, vh] of [[-0.6, -2.9, 0.7], [4.9, 0.9, 0.55], [2.4, -3.0, 0.45]]) {
    box(METAL, vx, roofTop + vh / 2, vz, 0.16, vh, 0.16);
    box(0x6b6b58, vx, roofTop + vh + 0.05, vz, 0.32, 0.08, 0.32);
    box(0x6b6b58, vx, roofTop + 0.02, vz, 0.3, 0.04, 0.3);
  }

  // Rooftop antenna masts with dipole bars, guy wires and a small dish.
  const poles: [number, number, number][] = [[0.6, -1.4, 9.6], [1.4, -0.5, 8.2], [-0.8, -1.9, 6.4]];
  for (const [px, pz, top] of poles) {
    box(METAL, px, roofTop + 0.04, pz, 0.4, 0.08, 0.4);
    box(0xd9d7cf, px, (roofTop + top) / 2, pz, 0.07, top - roofTop, 0.07);
    for (let y = top - 0.3; y > top - 2.2; y -= 0.6) box(0xd9d7cf, px, y, pz, 0.9 - (top - y) * 0.15, 0.035, 0.035);
    box(0xd9d7cf, px, top - 1.0, pz, 0.035, 0.035, 0.7);
    for (const [gx, gz] of [[1.1, 0.7], [-1.0, 0.8], [0.1, -1.2]]) {
      beam(WIRE, px, roofTop + (top - roofTop) * 0.6, pz, px + gx, roofTop + 0.02, pz + gz, 0.018);
    }
  }
  beam(WIRE, poles[0][0], 9.3, poles[0][1], poles[1][0], 8.0, poles[1][1], 0.02);
  box(METAL, 3.0, roofTop + 0.35, -1.0, 0.12, 0.7, 0.12);
  const dish = solid(new THREE.SphereGeometry(0.55, 12, 5, 0, Math.PI * 2, 0, 0.85), 0xdedbd2, 3.0, roofTop + 0.95, -1.0);
  dish.rotation.set(-1.0, 0.7, 0);
  beam(METAL, 3.0, roofTop + 0.95, -1.0, 3.35, roofTop + 1.25, -0.65, 0.03);

  // Rusticated stone quoins.
  const quoins = (cx: number, cz: number, sx: number, sz: number, from: number, to: number, long = 0.7) => {
    box(MORTAR, cx + sx * 0.03 - sx * 0.24, (from + to) / 2, cz + sz * 0.03 - sz * 0.24, 0.48, to - from, 0.48);
    let k = 0;
    for (let y = from + 0.2; y < to; y += 0.4, k++) {
      const lx = k % 2 ? 0.48 : long;
      const lz = k % 2 ? long : 0.48;
      box(rand() > 0.4 ? STONE : STONE_LIGHT, cx + sx * 0.06 - sx * lx / 2, y, cz + sz * 0.06 - sz * lz / 2, lx, 0.35, lz);
    }
  };
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) quoins(sx > 0 ? X1 : X0, sz > 0 ? Z1 : Z0, sx, sz, BASE, TOP - 0.2);

  const pilaster = (face: Face, u: number) => {
    onFace(face, MORTAR, u, (BASE + TOP - 0.2) / 2, 0.02, 0.46, TOP - 0.2 - BASE, 0.06);
    let k = 0;
    for (let y = BASE + 0.2; y < TOP - 0.2; y += 0.4, k++) {
      onFace(face, rand() > 0.4 ? STONE : STONE_LIGHT, u, y, 0.05, k % 2 ? 0.5 : 0.72, 0.35, 0.14);
    }
    onFace(face, STONE_LIGHT, u, BASE + 0.1, 0.07, 0.8, 0.2, 0.2);
  };
  pilaster(front, 0.55);
  pilaster(front, 3.25);
  pilaster(right, 0);
  pilaster(back, 0);

  // Tall shuttered windows.
  const win = (face: Face, u: number, yc = 1.95, w = 0.9, h = 1.85) => {
    onFace(face, GLASS, u, yc, 0.005, w, h, 0.04);
    for (const side of [-1, 1]) onFace(face, WHITE, u + side * (w / 2 + 0.05), yc, 0.05, 0.1, h + 0.1, 0.1);
    onFace(face, WHITE, u, yc + h / 2 + 0.05, 0.05, w + 0.2, 0.1, 0.1);
    for (const side of [-1, 1]) {
      const lu = u + side * w / 4;
      onFace(face, BLUE, lu, yc, 0.045, w / 2 - 0.03, h - 0.06, 0.04);
      for (let y = yc - h / 2 + 0.16; y < yc + h / 2 - 0.1; y += 0.13) {
        if (Math.abs(y - yc) < 0.07) continue;
        onFace(face, BLUE_DARK, lu, y, 0.075, w / 2 - 0.14, 0.035, 0.025, -0.4);
      }
      onFace(face, BLUE, lu, yc, 0.08, w / 2 - 0.05, 0.08, 0.03);
      onFace(face, BLUE_DARK, lu + side * (w / 4 - 0.05), yc, 0.08, 0.04, h - 0.1, 0.03);
      onFace(face, 0x2d2b28, u + side * 0.06, yc, 0.1, 0.03, 0.1, 0.03);
    }
    onFace(face, WHITE, u, yc, 0.07, 0.05, h, 0.05);
    onFace(face, TILE, u, yc - h / 2 - 0.09, 0.12, w + 0.32, 0.12, 0.26);
    onFace(face, TILE_DARK, u, yc - h / 2 - 0.18, 0.07, w + 0.2, 0.06, 0.14);
    onFace(face, TILE, u, yc + h / 2 + 0.18, 0.08, w + 0.36, 0.16, 0.16);
    onFace(face, STONE_LIGHT, u, yc + h / 2 + 0.2, 0.1, 0.22, 0.26, 0.18);
    for (const side of [-1, 1]) onFace(face, GRIME, u + side * (0.2 + rand() * 0.15), yc - h / 2 - 0.5, 0.004, 0.1, 0.55 + rand() * 0.3, 0.01);
  };
  win(front, -2.5);
  win(front, -0.75);
  win(right, -1.5);
  win(right, 1.5);
  for (const u of [-2.6, -1.1, 1.4, 2.8]) win(back, u);

  // Entrance: steps, recessed double door, canopy and emblem pediment.
  const DU = 1.9, DX = CX + DU;
  box(CONCRETE, DX, 0.225, 2.825, 2.8, 0.45, 0.85);
  box(CONCRETE, DX, 0.15, 3.4, 2.4, 0.3, 0.3);
  box(CONCRETE, DX, 0.075, 3.7, 2.4, 0.15, 0.3);
  for (const [y, z, w] of [[0.45, 3.245, 2.8], [0.3, 3.545, 2.4], [0.15, 3.845, 2.4]]) box(0x8d877b, DX, y - 0.02, z, w + 0.01, 0.04, 0.02);
  for (const side of [-1, 1]) box(TRIM, DX + side * 1.32, 0.3, 3.4, 0.16, 0.6, 0.9);
  onFace(front, 0x2b2622, DU, BASE + 1.3, 0.005, 1.6, 2.6, 0.04);
  for (const side of [-1, 1]) {
    const lu = DU + side * 0.38;
    onFace(front, BLUE, lu, BASE + 1.225, 0.04, 0.72, 2.45, 0.05);
    for (const [py, ph] of [[0.45, 0.6], [1.2, 0.6], [1.95, 0.6]]) {
      onFace(front, BLUE_DARK, lu, BASE + py, 0.075, 0.5, ph, 0.02);
      onFace(front, 0x6b8daa, lu, BASE + py + ph / 2 - 0.02, 0.08, 0.5, 0.03, 0.02);
    }
    onFace(front, 0xc9b16f, DU + side * 0.1, BASE + 1.15, 0.1, 0.05, 0.22, 0.05);
    onFace(front, WHITE, DU + side * 0.85, BASE + 1.3, 0.06, 0.12, 2.65, 0.12);
  }
  onFace(front, 0x2f3c44, DU, BASE + 1.24, 0.072, 0.03, 2.4, 0.03);
  onFace(front, WHITE, DU, BASE + 2.66, 0.06, 1.85, 0.14, 0.14);

  const canopyRise = 0.42, canopyRun = 1.4, canopyY = 3.38, canopyW = 2.9;
  const ang = Math.atan2(canopyRise, canopyRun);
  const nY = Math.cos(ang), nZ = Math.sin(ang);
  box(TILE, DX, canopyY - canopyRise / 2, Z1 + canopyRun / 2, canopyW, 0.1, Math.hypot(canopyRise, canopyRun), ang);
  let rib = 0;
  for (let x = DX - canopyW / 2 + 0.08; x < DX + canopyW / 2; x += 0.17, rib++) {
    beam(rib % 3 === 0 ? TILE_LIGHT : TILE, x, canopyY + nY * 0.08, Z1 + nZ * 0.08, x, canopyY - canopyRise + nY * 0.08, Z1 + canopyRun + nZ * 0.08 + 0.04, 0.08);
  }
  for (let t = 0.2; t < 0.95; t += 0.2) {
    box(TILE_DARK, DX, canopyY - canopyRise * t + nY * 0.1, Z1 + canopyRun * t + nZ * 0.1, canopyW, 0.03, 0.05, ang);
  }
  box(TILE_DARK, DX, canopyY + 0.05, Z1 + 0.05, canopyW + 0.05, 0.1, 0.12);
  box(TILE_DARK, DX, canopyY - canopyRise - 0.04, Z1 + canopyRun, canopyW + 0.06, 0.14, 0.08);
  for (let x = DX - canopyW / 2 + 0.09; x < DX + canopyW / 2; x += 0.34) {
    box(TILE_LIGHT, x, canopyY - canopyRise + 0.02, Z1 + canopyRun + 0.03, 0.14, 0.12, 0.1);
  }
  const postZ = 3.15;
  const postTop = canopyY - canopyRise * ((postZ - Z1) / canopyRun) - 0.06;
  for (const side of [-1, 1]) {
    const px = DX + side * 1.25;
    box(WHITE, px, (BASE + postTop) / 2, postZ, 0.16, postTop - BASE, 0.16);
    box(TRIM, px, BASE + 0.12, postZ, 0.26, 0.24, 0.26);
    box(WHITE, px, postTop - 0.06, postZ, 0.24, 0.12, 0.24);
    box(WHITE, px, postTop - 0.06, (postZ + Z1) / 2, 0.1, 0.1, postZ - Z1);
    beam(WHITE, px, postTop - 0.6, postZ, px, postTop - 0.06, postZ - 0.45, 0.06);
  }
  box(WHITE, DX, postTop - 0.06, postZ, 2.6, 0.12, 0.12);
  box(0x3a3a38, DX, postTop - 0.22, Z1 + 0.2, 0.14, 0.2, 0.14);
  box(0xf5e7a8, DX, postTop - 0.34, Z1 + 0.2, 0.1, 0.06, 0.1);

  // Pediment with the wheel emblem plaque.
  const pz = Z1 - 0.075;
  box(WALL, DX, 4.225, pz, 2.3, 1.25, 0.35);
  box(WALL, DX, 5.0, pz, 1.3, 0.32, 0.35);
  box(WHITE, DX, 3.85, pz + 0.05, 2.4, 0.1, 0.38);
  coping(DX - 1.15, pz, DX - 0.65, pz, 4.9);
  coping(DX + 0.65, pz, DX + 1.15, pz, 4.9);
  coping(DX - 0.65, pz, DX + 0.65, pz, 5.21);
  for (const side of [-1, 1]) {
    for (let k = 0; k < 3; k++) {
      box(k % 2 ? STONE : STONE_LIGHT, DX + side * (1.15 - (k % 2 ? 0.17 : 0.24)), 3.96 + k * 0.3, pz + 0.03, k % 2 ? 0.34 : 0.48, 0.26, 0.4);
    }
  }
  const ez = pz + 0.18;
  const plaque = solid(new THREE.CylinderGeometry(0.52, 0.52, 0.05, 20), WHITE, DX, 4.42, ez);
  plaque.rotation.x = Math.PI / 2;
  solid(new THREE.TorusGeometry(0.53, 0.05, 5, 24), STONE, DX, 4.42, ez + 0.02);
  solid(new THREE.TorusGeometry(0.36, 0.045, 5, 20), 0x5d5a55, DX, 4.42, ez + 0.04);
  const hub = solid(new THREE.CylinderGeometry(0.09, 0.09, 0.08, 10), 0x5d5a55, DX, 4.42, ez + 0.04);
  hub.rotation.x = Math.PI / 2;
  for (let k = 0; k < 8; k++) {
    const a = k * Math.PI / 4;
    beam(0x5d5a55, DX + Math.cos(a) * 0.08, 4.42 + Math.sin(a) * 0.08, ez + 0.04, DX + Math.cos(a) * 0.35, 4.42 + Math.sin(a) * 0.35, ez + 0.04, 0.035);
  }
  box(0x5d5a55, DX, 3.98, ez - 0.02, 1.1, 0.12, 0.04);

  // Weathering on the visible walls.
  for (const face of [front, right]) {
    const half = face === front ? W / 2 : D / 2;
    for (let i = 0; i < 7; i++) {
      const w = 0.5 + rand() * 1.1;
      const u = -half + 0.9 + rand() * (2 * half - 1.8);
      if (face === front && Math.abs(u - DU) < 1.2) continue;
      onFace(face, GRIME, u, BASE + 0.2 + rand() * 0.25, 0.004, w, 0.3 + rand() * 0.35, 0.01);
    }
    onFace(face, 0xb87a5a, -half + 1.6 + rand() * 2, 1.0 + rand() * 1.5, 0.006, 0.28, 0.16, 0.012);
  }

  // Downspouts.
  for (const [x, z, ox, oz] of [[X1 + 0.08, Z0 + 0.65, 1, 0], [X0 + 0.65, Z0 - 0.08, 0, -1], [X1 - 0.65, Z0 - 0.08, 0, -1]]) {
    box(METAL, x, (0.25 + TOP) / 2, z, 0.12, TOP - 0.25, 0.12);
    box(METAL, x - ox * 0.12, TOP + 0.05, z - oz * 0.12, 0.2 + Math.abs(oz) * 0.2, 0.12, 0.2 + Math.abs(ox) * 0.2);
    box(METAL, x + ox * 0.08, 0.15, z + oz * 0.08, 0.16 + Math.abs(ox) * 0.15, 0.1, 0.16 + Math.abs(oz) * 0.15);
    for (let y = 1; y < TOP; y += 1.2) box(0x6b6b58, x, y, z, 0.16, 0.04, 0.16);
  }

  // ---------- Garage annex ----------
  const wallMid = (0.35 + AH) / 2, wallH = AH - 0.35;
  box(TRIM, ACX - 0.06, 0.175, ACZ, AW + 0.12, 0.35, AD + 0.12);
  box(WALL, AX0 + 0.15, wallMid, ACZ, 0.3, wallH, AD);
  box(WALL, ACX, wallMid, AZ0 + 0.15, AW, wallH, 0.3);
  box(WALL, AX1 - 0.2, wallMid, ACZ, 0.4, wallH, AD);
  box(WALL, AX0 + 0.25, wallMid, AZ1 - 0.15, 0.5, wallH, 0.3);
  box(WALL, AX1 - 0.25, wallMid, AZ1 - 0.15, 0.5, wallH, 0.3);
  box(WALL, ACX, 2.4, AZ1 - 0.15, AW, 0.4, 0.3);
  box(WHITE, ACX, 2.2, AZ1 + 0.02, 2.5, 0.08, 0.06);
  // Shadowed interior.
  box(0x8d877b, ACX, 0.36, ACZ + 0.1, 2.4, 0.02, AD - 0.5);
  box(0x2a2622, ACX, 1.3, AZ0 + 0.31, 2.4, 1.9, 0.02);
  box(0x3a342c, AX0 + 0.31, 1.3, ACZ + 0.1, 0.02, 1.9, AD - 0.5);
  box(0x332e28, AX1 - 0.41, 1.3, ACZ + 0.1, 0.02, 1.9, AD - 0.5);
  box(0x1e1b18, ACX, 2.19, ACZ + 0.1, 2.4, 0.02, AD - 0.5);
  box(0x47413a, ACX - 0.6, 0.37, ACZ - 0.5, 0.8, 0.005, 1.0);
  for (const [cx, cz, s] of [[-4.95, -2.6, 0.6], [-4.95, -2.6, 0.45], [-3.4, -2.8, 0.55]]) {
    const y = s === 0.45 ? 0.95 : 0.37 + s / 2;
    box(WOOD, cx, y, cz, s, s, s);
    box(WOOD_DARK, cx, y, cz + s / 2 + 0.01, s, 0.06, 0.02);
  }
  for (const [dx, dz] of [[-3.6, -1.8], [-3.25, -1.3]]) solid(new THREE.CylinderGeometry(0.26, 0.26, 0.8, 10), 0x6f7f5a, dx, 0.77, dz);
  solid(new THREE.TorusGeometry(0.3, 0.11, 5, 12), 0x1f1f1f, -4.3, 1.4, AZ0 + 0.42);
  box(0x5a4a3a, -4.3, 1.8, AZ0 + 0.34, 1.6, 0.05, 0.08);
  // Garage roof and parapet.
  box(ROOF, ACX - 0.05, AH + 0.05, ACZ, AW - 0.1, 0.1, AD);
  for (let i = 0; i < 10; i++) {
    const w = 0.3 + rand() * 0.9;
    const d = 0.3 + rand() * 0.9;
    box(patchColors[i % patchColors.length], AX0 + 0.3 + w / 2 + rand() * (AW - 0.8 - w), AH + 0.102 + (i % 4) * 0.0015, AZ0 + 0.3 + d / 2 + rand() * (AD - 0.6 - d), w, 0.004, d);
  }
  box(WALL, AX0 + 0.11, AH + 0.15, ACZ, 0.22, 0.3, AD);
  box(WALL, ACX - 0.05, AH + 0.15, AZ1 - 0.11, AW - 0.1, 0.3, 0.22);
  box(WALL, ACX - 0.05, AH + 0.15, AZ0 + 0.11, AW - 0.1, 0.3, 0.22);
  coping(AX0 + 0.11, AZ0 + 0.11, AX0 + 0.11, AZ1 - 0.11, AH + 0.35);
  coping(AX0 + 0.11, AZ1 - 0.11, AX1 - 0.1, AZ1 - 0.11, AH + 0.35);
  coping(AX0 + 0.11, AZ0 + 0.11, AX1 - 0.1, AZ0 + 0.11, AH + 0.35);
  quoins(AX0, AZ1, -1, 1, 0.35, AH - 0.05, 0.6);
  quoins(AX0, AZ0, -1, -1, 0.35, AH - 0.05, 0.6);
  const annexLeft: Face = { x: AX0, z: ACZ, yaw: -Math.PI / 2 };
  win(annexLeft, 0, 1.45, 0.8, 1.2);
  box(METAL, AX0 - 0.08, 1.4, AZ0 + 0.6, 0.12, 2.5, 0.12);
  // Open plank doors swung outward.
  for (const [hx, dirX, dirZ] of [[-5.3, -0.36, 0.93], [-2.92, 0.22, 0.975]]) {
    const ry = Math.atan2(-dirZ, dirX);
    const door: Face = { x: hx + dirX * 0.6, z: AZ1 + 0.03 + dirZ * 0.6, yaw: ry };
    onFace(door, 0xe9e6dc, 0, 1.27, 0, 1.18, 1.82, 0.07);
    for (const n of [-0.045, 0.045]) {
      for (const y of [0.5, 1.27, 2.04]) onFace(door, WHITE, 0, y, n, 1.18, 0.12, 0.03);
      for (const u of [-0.53, 0.53]) onFace(door, WHITE, u, 1.27, n, 0.12, 1.82, 0.03);
      for (let u = -0.3; u < 0.4; u += 0.3) onFace(door, 0xc9c4b6, u, 1.27, n * 0.95, 0.02, 1.7, 0.02);
      onFace(door, 0xf8f6ef, 0, 0.885, n * 1.2, 1.15, 0.1, 0.03);
    }
    for (const y of [0.7, 1.85]) beam(0x3a3a38, hx, y, AZ1 + 0.05, hx + dirX * 0.25, y, AZ1 + 0.05 + dirZ * 0.25, 0.05);
  }
  box(CONCRETE, ACX, 0.19, AZ1 + 0.25, 2.4, 0.12, 0.5, -0.45);

  // ---------- Lattice radio mast ----------
  box(CONCRETE, MX, 0.15, MZ, 1.1, 0.3, 1.1);
  const mBase = 0.3, mTop = 10.5, hw0 = 0.42, hw1 = 0.14;
  const hw = (y: number) => hw0 + (hw1 - hw0) * (y - mBase) / (mTop - mBase);
  const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  for (const [sx, sz] of corners) {
    beam(MAST, MX + sx * hw0, mBase, MZ + sz * hw0, MX + sx * hw1, mTop, MZ + sz * hw1, 0.075);
    box(0x8d877b, MX + sx * hw0, mBase + 0.05, MZ + sz * hw0, 0.18, 0.1, 0.18);
  }
  const levels: number[] = [];
  for (let y = mBase; y <= mTop + 0.01; y += 0.85) levels.push(y);
  for (let l = 0; l < levels.length; l++) {
    const y = levels[l];
    const h = hw(y);
    for (let c = 0; c < 4; c++) {
      const [ax, az] = corners[c];
      const [bx, bz] = corners[(c + 1) % 4];
      beam(MAST, MX + ax * h, y, MZ + az * h, MX + bx * h, y, MZ + bz * h, 0.045);
      if (l + 1 < levels.length) {
        const y2 = levels[l + 1];
        const h2 = hw(y2);
        beam(MAST, MX + ax * h, y, MZ + az * h, MX + bx * h2, y2, MZ + bz * h2, 0.035);
        beam(MAST, MX + bx * h, y, MZ + bz * h, MX + ax * h2, y2, MZ + az * h2, 0.035);
      }
    }
  }
  box(MAST, MX, mTop + 0.04, MZ, 0.5, 0.06, 0.5);
  box(0xd9d7cf, MX, mTop + 0.75, MZ, 0.08, 1.4, 0.08);
  box(0xc8382c, MX, mTop + 1.5, MZ, 0.14, 0.14, 0.14);
  for (const y of [mTop + 0.5, mTop + 1.0]) {
    box(0xd9d7cf, MX, y, MZ, 1.0, 0.035, 0.035);
    box(0xd9d7cf, MX, y + 0.2, MZ, 0.035, 0.035, 0.7);
  }
  box(0xc8382c, MX, 6.2, MZ + hw(6.2) + 0.03, 0.1, 0.1, 0.06);
  for (const y of [2.1, 3.3]) {
    for (const sx of [-1, 1]) beam(MAST, MX + sx * hw(y), y, MZ - hw(y), MX + sx * hw(y), y, Z1 + 0.02, 0.05);
  }
  box(0x4b4a46, MX + 0.3, 1.2, MZ - hw(1.2) - 0.02, 0.3, 0.4, 0.15);
  beam(WIRE, MX + 0.3, 1.4, MZ - hw(1.2) - 0.05, MX + 0.6, 3.2, Z1 + 0.02, 0.025);
  // Guy wires and anchors.
  const anchors: [number, number, number][] = [[-5.6, 0.1, 3.85], [1.9, 0.1, 3.9], [-0.6, roofTop + 0.05, -2.6], [-3.4, AH + 0.12, -1.8]];
  for (const [ax, ay, az] of anchors) {
    beam(WIRE, MX + Math.sign(ax - MX) * hw(8.8), 8.8, MZ + Math.sign(az - MZ) * hw(8.8), ax, ay, az, 0.02);
    box(CONCRETE, ax, ay, az, 0.2, 0.12, 0.2);
  }
  beam(WIRE, MX, mTop + 1.0, MZ, poles[0][0], poles[0][2] - 0.3, poles[0][1], 0.02);
  beam(WIRE, MX, mTop + 0.5, MZ, poles[2][0], poles[2][2] - 0.2, poles[2][1], 0.02);

  // ---------- Yard props ----------
  // Wooden hand cart by the steps.
  const cartX = 5.35, cartZ = 3.2;
  box(WOOD, cartX, 0.55, cartZ, 0.7, 0.08, 0.95);
  for (const side of [-1, 1]) {
    box(WOOD_DARK, cartX + side * 0.37, 0.7, cartZ, 0.05, 0.26, 0.95);
    beam(WOOD_DARK, cartX + side * 0.25, 0.52, cartZ + 0.4, cartX + side * 0.25, 0.12, cartZ + 0.75, 0.06);
    const wheel = solid(new THREE.CylinderGeometry(0.3, 0.3, 0.06, 12), WOOD_DARK, cartX + side * 0.43, 0.32, cartZ - 0.1);
    wheel.rotation.z = Math.PI / 2;
    box(0x4a3a2a, cartX + side * 0.47, 0.32, cartZ - 0.1, 0.03, 0.56, 0.06);
    box(0x4a3a2a, cartX + side * 0.47, 0.32, cartZ - 0.1, 0.03, 0.06, 0.56);
  }
  box(WOOD_DARK, cartX, 0.7, cartZ - 0.47, 0.75, 0.26, 0.05);
  box(0x4a3a2a, cartX, 0.32, cartZ - 0.1, 0.9, 0.05, 0.05);
  box(SACK, cartX - 0.1, 0.75, cartZ + 0.1, 0.42, 0.26, 0.55, 0, 0.3);
  box(0xbfa979, cartX + 0.14, 0.72, cartZ - 0.25, 0.32, 0.2, 0.36, 0, -0.2);

  // Crates and sacks under the front windows.
  const crate = (x: number, y: number, z: number, s: number, ry: number) => {
    box(WOOD, x, y + s / 2, z, s, s, s, 0, ry);
    const c = Math.cos(ry), sn = Math.sin(ry);
    for (const side of [-1, 1]) {
      box(WOOD_DARK, x + sn * side * (s / 2 + 0.01), y + s / 2, z + c * side * (s / 2 + 0.01), s, 0.07, 0.02, 0, ry);
      box(WOOD_DARK, x + c * side * (s / 2 + 0.01), y + s / 2, z - sn * side * (s / 2 + 0.01), 0.02, 0.07, s, 0, ry);
    }
    box(WOOD_DARK, x, y + s + 0.005, z, s * 0.9, 0.01, 0.06, 0, ry);
  };
  crate(1.15, 0.04, 2.95, 0.62, 0.1);
  crate(1.75, 0.04, 3.0, 0.5, -0.15);
  crate(1.2, 0.66, 2.95, 0.45, 0.4);
  for (const [sx, sz, ry] of [[-0.35, 3.25, 0.2], [0.05, 3.35, -0.3], [-0.15, 3.3, 0.9]]) {
    box(SACK, sx, ry > 0.5 ? 0.42 : 0.17, sz, 0.55, 0.26, 0.36, 0, ry);
    box(0xa89462, sx, ry > 0.5 ? 0.42 : 0.17, sz, 0.08, 0.27, 0.37, 0, ry);
  }
  solid(new THREE.CylinderGeometry(0.26, 0.26, 0.8, 10), 0x7a4a36, -1.0, 0.44, 3.68);
  box(0x5a3a2a, -1.0, 0.85, 3.68, 0.3, 0.03, 0.3);
}
