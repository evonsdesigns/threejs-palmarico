import * as THREE from "three";
import { buildingTexture } from "../building-textures";
import type { Kit } from "./kit";
import { cylinder, downspout, shrub } from "./mid-housing-parts";

export function buildCondominium(kit: Kit) {
  const { box, solid, window } = kit;
  const base = 0x92908a;
  const wallC = 0xded8c0;
  const trim = 0xece7da;
  const iron = 0x3c4446;
  const slab = 0xe3ddce;
  const acC = 0xd8d8d0;
  const x0 = -7.4;
  const x1 = 7.4;
  // Four flats per floor in a long block, two each side of the central stair core.
  const UNITS = [-5.95, -2.85, 2.85, 5.95];
  const zb = -4.4;
  const zf = 3.0;
  const cz = (zb + zf) / 2;
  const bw = x1 - x0;
  const bd = zf - zb;
  const FL = [0.4, 3.6, 6.8];
  const roofY = 10.0;
  const pastel = [
    [0xe8b4b0, 0xb6d8c0],
    [0xe9c98d, 0xa8c4dc],
    [0xc8b8e0, 0xe7bd70],
    [0xb6d8c0, 0xe8b4b0],
  ];
  const stripes = [[0xd8584a, 0xf2ede0], [0x3f7fb0, 0xf2ede0], [0x4f9a6a, 0xf2ede0], [0xe0a030, 0xf2ede0]];

  // Ground pad, paving and plinth
  box(0xc9c2b0, 0, 0.03, 0, 15.9, 0.06, 11.9);
  for (let x = -7.5; x <= 7.5; x += 1.0) box(0xb5ad98, x, 0.065, 4.8, 0.03, 0.01, 2.3);
  for (let z = 3.8; z <= 5.9; z += 1.0) box(0xb5ad98, 0, 0.065, z, 15.8, 0.01, 0.03);
  box(base, 0, 0.2, cz, bw + 0.4, 0.4, bd + 0.4);
  box(0x7d7a72, 0, 0.42, cz, bw + 0.44, 0.05, bd + 0.44);

  // Main block
  box(wallC, 0, (0.4 + roofY) / 2, cz, bw, roofY - 0.4, bd);
  // Pastel unit bays (front wraps around the corners to the sides)
  for (let f = 0; f < FL.length; f++) {
    const y = FL[f] + 1.6;
    for (const [ui, cx] of UNITS.entries()) {
      const c = pastel[f][ui % 2];
      box(c, cx, y, zf + 0.015, 2.9, 3.0, 0.03);
      box(c, cx, y, zb - 0.015, 2.9, 3.0, 0.03);
    }
    for (const s of [-1, 1]) box(pastel[f][s < 0 ? 0 : 1], s * (x1 + 0.015), y, cz, 0.03, 3.0, bd - 0.5);
  }
  // Cornices, bands, pilasters
  for (let f = 1; f < FL.length; f++) {
    const y = FL[f];
    box(trim, 0, y, zf + 0.07, bw + 0.2, 0.22, 0.14);
    box(trim, 0, y, zb - 0.07, bw + 0.2, 0.22, 0.14);
    box(trim, x1 + 0.07, y, cz, 0.14, 0.22, bd + 0.2);
    box(trim, x0 - 0.07, y, cz, 0.14, 0.22, bd + 0.2);
  }
  box(trim, 0, roofY - 0.1, cz, bw + 0.5, 0.4, bd + 0.5);
  box(0xd6cfbb, 0, roofY - 0.36, cz, bw + 0.34, 0.12, bd + 0.34);
  for (let x = x0; x <= x1 + 0.01; x += 0.36) {
    box(trim, x, roofY - 0.5, zf + 0.12, 0.13, 0.14, 0.2);
    box(trim, x, roofY - 0.5, zb - 0.12, 0.13, 0.14, 0.2);
  }
  for (let z = zb; z <= zf + 0.01; z += 0.36) {
    box(trim, x1 + 0.12, roofY - 0.5, z, 0.2, 0.14, 0.13);
    box(trim, x0 - 0.12, roofY - 0.5, z, 0.2, 0.14, 0.13);
  }
  // Parapet with coping
  const pH = 0.7;
  for (const s of [-1, 1]) {
    box(wallC, 0, roofY + 0.1 + pH / 2, cz + s * (bd / 2 + 0.1), bw + 0.4, pH, 0.25);
    box(wallC, s * (bw / 2 + 0.1), roofY + 0.1 + pH / 2, cz, 0.25, pH, bd + 0.2);
    box(trim, 0, roofY + 0.15 + pH, cz + s * (bd / 2 + 0.1), bw + 0.5, 0.1, 0.35);
    box(trim, s * (bw / 2 + 0.1), roofY + 0.15 + pH, cz, 0.35, 0.1, bd + 0.4);
  }
  for (const [px, pz] of [[x0, zf], [x1, zf], [x0, zb], [x1, zb]]) {
    box(trim, px, (0.4 + roofY) / 2, pz, 0.45, roofY - 0.4, 0.45);
    for (let y = 1.0; y < roofY; y += 0.8) box(0xd6cfbb, px, y, pz, 0.48, 0.05, 0.48);
  }
  // Weathering stains
  for (const [px, py, w, h] of [[-3.9, 0.8, 1.2, 0.6], [2.2, 0.75, 1.6, 0.5], [4.6, 6.0, 0.3, 2.2], [-4.6, 6.6, 0.25, 1.8], [0.9, 9.4, 1.4, 0.3]]) {
    box(0xb9b3a0, px, py, zf + 0.035, w, h, 0.02);
  }
  for (const [pz, py, h] of [[1.5, 0.75, 0.55], [-2.0, 0.8, 0.6], [-3.9, 7.0, 2.5], [0.4, 9.3, 0.6]]) box(0xb9b3a0, x1 + 0.035, py, pz, 0.02, h, 0.9);

  // Front façade per unit
  const awning = (x: number, y: number, z: number, w: number, depth: number, pair: number[]) => {
    const a = 0.5;
    const n = Math.max(3, Math.round(w / 0.22));
    const sw = w / n;
    for (let i = 0; i < n; i++) {
      const sx = x - w / 2 + sw * (i + 0.5);
      box(pair[i % 2], sx, y - Math.sin(a) * depth / 2, z + Math.cos(a) * depth / 2, sw, 0.04, depth, a);
      box(pair[i % 2], sx, y - Math.sin(a) * depth - 0.1, z + Math.cos(a) * depth, sw, 0.22, 0.03);
    }
    box(iron, x, y + 0.02, z + 0.02, w + 0.06, 0.06, 0.06);
  };
  const acUnit = (x: number, y: number, z: number, facing: number) => {
    const ox = Math.sin(facing);
    const oz = Math.cos(facing);
    box(acC, x + ox * 0.25, y, z + oz * 0.25, 0.75, 0.45, 0.5, 0, facing);
    box(0x7d8084, x + ox * 0.51, y, z + oz * 0.51, 0.62, 0.32, 0.02, 0, facing);
    for (let t = -0.12; t <= 0.12; t += 0.06) box(acC, x + ox * 0.525, y + t, z + oz * 0.525, 0.6, 0.02, 0.01, 0, facing);
    box(0x8d8f8c, x + ox * 0.25, y - 0.28, z + oz * 0.25, 0.7, 0.05, 0.45, 0, facing);
    box(0xc9c2b0, x + ox * 0.26 + oz * 0.2, y - 0.6, z + oz * 0.26 - ox * 0.2, 0.03, 0.5, 0.03, 0, facing);
  };
  const roller = (x: number, y: number, z: number, w: number, facing: number) => {
    box(0xc9c2b0, x + Math.sin(facing) * 0.12, y, z + Math.cos(facing) * 0.12, w + 0.2, 0.22, 0.2, 0, facing);
  };
  for (let f = 0; f < FL.length; f++) {
    const y = FL[f];
    for (const [ui, cx] of UNITS.entries()) {
      const s = cx < 0 ? -1 : 1;
      const doorX = cx - s * 0.75;
      const winX = cx + s * 0.85;
      // balcony door + window
      window(doorX, y + 1.25, zf + 0.05, 0.95, 2.2);
      box(0x6f8f92, doorX, y + 1.25, zf + 0.2, 0.03, 2.2, 0.02);
      roller(doorX, y + 2.5, zf, 0.95, 0);
      window(winX, y + 1.75, zf + 0.05, 1.05, 1.2);
      roller(winX, y + 2.5, zf, 1.05, 0);
      acUnit(winX, y + 0.75, zf + 0.03, 0);
      awning(winX, y + 2.72, zf + 0.05, 1.2, 0.8, stripes[(f + ui) % 4]);
      if (f === 0) {
        // Ground-floor patio with low wall and planters
        box(0xc4bcaa, cx, 0.42, 3.75, 2.8, 0.04, 1.5);
        box(trim, cx, 0.75, 4.45, 2.8, 0.7, 0.2);
        box(trim, cx, 1.14, 4.45, 2.9, 0.08, 0.28);
        box(trim, cx + s * 1.4, 0.75, 3.75, 0.2, 0.7, 1.5);
        box(0xb06a42, cx - s * 0.5, 1.3, 4.45, 1.6, 0.25, 0.3);
        for (const dx of [-0.6, 0, 0.6]) shrub(kit, cx - s * 0.5 + dx, 1.38, 4.45, 0.3, 0x4f8a3c);
        box(0xd4485a, cx - s * 0.3, 1.72, 4.5, 0.12, 0.1, 0.12);
        // table and chairs
        cylinder(kit, 0xf0f0e8, cx + s * 0.3, 0.85, 3.6, 0.32, 0.05, 10);
        box(iron, cx + s * 0.3, 0.62, 3.6, 0.06, 0.42, 0.06);
        for (const d of [-0.5, 0.5]) {
          box(0xf0f0e8, cx + s * 0.3 + d, 0.68, 3.6, 0.36, 0.05, 0.36);
          box(0xf0f0e8, cx + s * 0.3 + d * 1.45, 0.92, 3.6, 0.05, 0.45, 0.36);
        }
      } else {
        // Balcony slab, railings and life
        box(slab, cx, y - 0.04, 3.68, 2.8, 0.18, 1.36);
        box(0xb9b3a0, cx, y - 0.16, 4.3, 2.7, 0.06, 0.08);
        box(trim, cx, y + 0.08, 4.3, 2.8, 0.1, 0.1);
        box(iron, cx, y + 1.0, 4.28, 2.8, 0.07, 0.1);
        for (let bx = cx - 1.35; bx <= cx + 1.36; bx += 0.15) box(iron, bx, y + 0.55, 4.28, 0.035, 0.9, 0.035);
        for (const ex of [cx - 1.38, cx + 1.38]) {
          box(iron, ex, y + 1.0, 3.65, 0.07, 0.07, 1.3);
          for (let bz = 3.1; bz < 4.25; bz += 0.15) box(iron, ex, y + 0.55, bz, 0.035, 0.9, 0.035);
        }
        const variant = (f + ui) % 3;
        if (variant === 0) {
          for (const dx of [-1.1, -0.75]) {
            box(0xb06a42, cx + s * dx, y + 0.2, 4.0, 0.3, 0.3, 0.3);
            shrub(kit, cx + s * dx, y + 0.3, 4.0, 0.32, 0x4f8a3c);
          }
          box(0xf0f0e8, cx + s * 0.3, y + 0.45, 3.85, 0.4, 0.05, 0.4);
          box(0xf0f0e8, cx + s * 0.3, y + 0.7, 3.65, 0.4, 0.5, 0.05);
        } else if (variant === 1) {
          // drying rack with laundry
          for (const dx of [-0.2, 0.9]) box(0xd8d8d0, cx + s * dx, y + 0.5, 3.75, 0.04, 1.0, 0.5);
          box(0xd8d8d0, cx + s * 0.35, y + 1.0, 3.75, 1.15, 0.03, 0.5);
          const cl = [0xe8b4b0, 0x537a9a, 0xf2ede0, 0xe7bd70];
          for (let i = 0; i < 4; i++) box(cl[i], cx + s * (-0.05 + i * 0.26), y + 0.75, 3.75 + (i % 2 ? 0.12 : -0.12), 0.2, 0.45, 0.02);
        } else {
          box(0x9a8967, cx + s * 0.2, y + 0.4, 3.75, 0.7, 0.05, 0.5);
          for (const dz of [-0.2, 0.2]) box(0x9a8967, cx + s * 0.2, y + 0.2, 3.75 + dz, 0.6, 0.4, 0.04);
          box(0xb06a42, cx - s * 1.1, y + 0.2, 4.0, 0.3, 0.3, 0.3);
          box(0x5f8a43, cx - s * 1.1, y + 0.6, 4.0, 0.2, 0.6, 0.2);
          box(0x4f7a34, cx - s * 1.1, y + 0.95, 4.0, 0.5, 0.1, 0.5, 0, 0.5);
        }
      }
    }
  }
  // Top-floor balcony awnings
  for (const [ui, cx] of UNITS.entries()) {
    const a = 0.32;
    const depth = 1.45;
    const pair = stripes[ui % 2 ? 2 : 0];
    for (let i = 0; i < 12; i++) {
      const sx = cx - 1.32 + 0.22 * (i + 0.5);
      box(pair[i % 2], sx, roofY - 0.35 - Math.sin(a) * depth / 2, zf + Math.cos(a) * depth / 2, 0.22, 0.04, depth, a);
      box(pair[i % 2], sx, roofY - 0.35 - Math.sin(a) * depth - 0.12, zf + Math.cos(a) * depth, 0.22, 0.25, 0.03);
    }
  }

  // Central stair core with entrance
  const coreZ = zf + 0.25;
  box(0xece3cd, 0, (0.4 + roofY + 0.85) / 2, coreZ, 2.2, roofY + 0.85 - 0.4, 0.5);
  for (const s of [-1, 1]) box(trim, s * 1.1, (0.4 + roofY + 0.9) / 2, zf + 0.5, 0.25, roofY + 0.9 - 0.4, 0.2);
  for (let f = 1; f < FL.length; f++) {
    const y = FL[f] + 1.6;
    box(trim, 0, y, zf + 0.52, 1.0, 2.3, 0.04);
    box(0x9fc4c8, 0, y, zf + 0.55, 0.8, 2.1, 0.04);
    for (let gy = -0.9; gy <= 0.91; gy += 0.3) box(0xe4ede8, 0, y + gy, zf + 0.58, 0.8, 0.03, 0.02);
    for (const gx of [-0.2, 0.2]) box(0xe4ede8, gx, y, zf + 0.58, 0.03, 2.1, 0.02);
    box(trim, 0, FL[f], zf + 0.56, 2.3, 0.18, 0.12);
  }
  // Entrance doors, canopy, steps, mailboxes, sign
  box(trim, 0, 1.75, zf + 0.52, 1.8, 2.8, 0.04);
  for (const dx of [-0.36, 0.36]) {
    box(0x5e4734, dx, 1.65, zf + 0.56, 0.68, 2.5, 0.05);
    box(0x9fc4c8, dx, 1.85, zf + 0.6, 0.48, 1.6, 0.03);
    box(0xc9b16f, dx * 0.2, 1.6, zf + 0.62, 0.05, 0.3, 0.05);
  }
  box(0x9fc4c8, 0, 2.98, zf + 0.56, 1.5, 0.3, 0.03);
  box(0xd6cfbb, 0, 3.15, 4.25, 2.9, 0.16, 1.5);
  box(trim, 0, 3.28, 4.25, 2.95, 0.1, 1.55);
  box(0x3f7fb0, 0, 3.5, 4.98, 1.8, 0.32, 0.05);
  box(0xf2ede0, 0, 3.5, 5.0, 1.5, 0.1, 0.04);
  for (const dx of [-1.25, 1.25]) cylinder(kit, trim, dx, 1.75, 4.8, 0.1, 2.7, 8);
  box(base, 0, 0.2, 3.95, 2.9, 0.4, 0.9);
  box(base, 0, 0.135, 4.55, 2.6, 0.27, 0.3);
  box(base, 0, 0.065, 4.85, 2.6, 0.13, 0.3);
  for (let i = 0; i < 6; i++) box(0x7d8a8c, -1.05 + (i % 3) * 0.17, 1.4 + Math.floor(i / 3) * 0.2, zf + 0.53, 0.14, 0.16, 0.06);
  box(0xf6e7a8, 0.85, 2.4, zf + 0.56, 0.16, 0.24, 0.1);
  box(0xf6e7a8, -0.85, 2.4, zf + 0.56, 0.16, 0.24, 0.1);
  box(0xf6e7a8, 0, 3.02, 4.25, 0.5, 0.06, 0.5);

  // Side façades: +x with balconies, -x plain
  for (const s of [-1, 1]) {
    const wx = s * (x1 + 0.05);
    const facing = s * Math.PI / 2;
    for (let f = 0; f < FL.length; f++) {
      const y = FL[f];
      for (const wz of [1.8, -3.2]) {
        window(wx, y + 1.75, wz, 1.0, 1.2, facing);
        box(0xc9c2b0, wx + s * 0.12, y + 2.5, wz, 0.2, 0.22, 1.2);
        // stepped side awnings
        const pair = stripes[(f + (wz > 0 ? 0 : 2)) % 4];
        for (let k = 0; k < 3; k++) {
          for (let i = 0; i < 6; i++) box(pair[i % 2], wx + s * (0.15 + k * 0.22), y + 2.66 - k * 0.12, wz - 0.65 + 0.217 * (i + 0.5), 0.24, 0.16, 0.217);
        }
        for (let i = 0; i < 6; i++) box(pair[i % 2], wx + s * 0.75, y + 2.3, wz - 0.65 + 0.217 * (i + 0.5), 0.03, 0.22, 0.217);
      }
      acUnit(wx, y + 0.75, -3.2, facing);
      if (f > 0 && (f + (s > 0 ? 0 : 1)) % 2 === 0) acUnit(wx, y + 0.75, 1.8, facing);
      if (s > 0 && f > 0) {
        window(wx, y + 1.25, -0.7, 0.95, 2.2, facing);
        box(slab, x1 + 0.4, y - 0.04, -0.7, 0.8, 0.18, 1.9);
        box(trim, x1 + 0.78, y + 0.08, -0.7, 0.1, 0.1, 1.9);
        box(iron, x1 + 0.78, y + 1.0, -0.7, 0.1, 0.07, 1.9);
        for (let bz = -1.6; bz <= 0.21; bz += 0.15) box(iron, x1 + 0.78, y + 0.55, bz, 0.035, 0.9, 0.035);
        for (const ez of [-1.62, 0.22]) {
          box(iron, x1 + 0.4, y + 1.0, ez, 0.76, 0.07, 0.07);
          for (let bx = x1 + 0.1; bx < x1 + 0.76; bx += 0.15) box(iron, bx, y + 0.55, ez, 0.035, 0.9, 0.035);
        }
        box(0xb06a42, x1 + 0.5, y + 0.2, -1.3, 0.3, 0.3, 0.3);
        shrub(kit, x1 + 0.5, y + 0.3, -1.3, 0.3, 0x4f8a3c);
      } else {
        window(wx, y + 1.75, -0.7, 0.7, 1.0, facing);
      }
    }
  }
  // Service door on +x ground floor
  box(0x5e4734, x1 + 0.06, 1.55, -0.7, 0.06, 2.3, 0.95);
  box(0x737b77, x1 + 0.4, 2.9, -0.7, 0.8, 0.08, 1.4);

  // Back façade
  for (let f = 0; f < FL.length; f++) {
    const y = FL[f];
    for (const bx of [-6.4, -4.6, -2.8, 2.8, 4.6, 6.4]) {
      window(bx, y + 1.75, zb - 0.05, 0.95, 1.2, Math.PI);
      box(0xc9c2b0, bx, y + 2.5, zb - 0.12, 1.15, 0.22, 0.2);
    }
    for (const bx of [-0.6, 0.6]) window(bx, y + 2.1, zb - 0.05, 0.5, 0.6, Math.PI);
    if (f > 0) {
      acUnit(-3.7, y + 0.75, zb - 0.03, Math.PI);
      acUnit(5.5, y + 0.75, zb - 0.03, Math.PI);
      for (const s of [-1, 1]) {
        box(iron, s * 3.7, y + 2.2, zb - 0.6, 0.04, 0.04, 1.1);
        box(iron, s * 3.7 + 0.6, y + 2.2, zb - 0.6, 0.04, 0.04, 1.1);
        const cl = [0xf2ede0, 0xe8b4b0, 0x3f7fb0, 0xe7bd70];
        box(cl[f % 4], s * 3.7, y + 1.95, zb - 0.8, 0.02, 0.45, 0.35);
        box(cl[(f + 1) % 4], s * 3.7 + 0.6, y + 1.9, zb - 0.6, 0.02, 0.55, 0.3);
      }
    }
  }
  box(0x5e4734, 0, 1.55, zb - 0.06, 1.0, 2.3, 0.06);
  box(0x737b77, 0, 2.9, zb - 0.45, 1.5, 0.08, 0.9);

  // Downspouts and plumbing
  for (const [dx, dz] of [[x1 + 0.3, zf - 0.35], [x0 - 0.3, zf - 0.35], [x1 + 0.3, zb + 0.35], [x0 - 0.3, zb + 0.35]]) {
    downspout(kit, 0x85867c, dx, dz, roofY + 0.2, 0.4);
  }
  for (const px of [-1.3, 1.3]) box(0x85867c, px, roofY / 2, zb - 0.1, 0.1, roofY, 0.1);

  // Roof: covering, stair house, water tanks, antennae, laundry
  box(0x5f5a52, 0, roofY + 0.02, cz, bw - 0.1, 0.06, bd - 0.1);
  for (const [px, pz, w, d] of [[-2.5, -1.0, 2.2, 1.4], [2.8, 1.2, 1.4, 1.8], [0.5, -3.2, 2.0, 0.9]]) box(0x6b665c, px, roofY + 0.06, pz, w, 0.02, d);
  const sh = 2.5;
  box(0xece3cd, 0, roofY + sh / 2, 2.2, 2.2, sh, 2.6);
  box(trim, 0, roofY + sh + 0.06, 2.2, 2.5, 0.14, 2.9);
  box(0x5f5a52, 0, roofY + sh + 0.15, 2.2, 2.3, 0.04, 2.7);
  box(0x5e4734, 1.12, roofY + 1.1, 1.6, 0.06, 2.0, 0.9);
  box(trim, 1.13, roofY + 2.15, 1.6, 0.06, 0.12, 1.1);
  window(1.12, roofY + 1.5, 2.85, 0.6, 0.6, Math.PI / 2);
  box(0x737b77, 0.5, roofY + sh + 0.45, 2.8, 0.4, 0.6, 0.4);
  box(0x5d6461, 0.5, roofY + sh + 0.78, 2.8, 0.55, 0.06, 0.55);
  for (const tx of [-4.6, 4.6]) {
    const tz = -2.5;
    for (const lx of [-0.55, 0.55]) for (const lz of [-0.55, 0.55]) box(0x5d6461, tx + lx, roofY + 0.65, tz + lz, 0.1, 1.3, 0.1);
    box(0x5d6461, tx, roofY + 1.3, tz, 1.3, 0.1, 1.3);
    box(0x5d6461, tx, roofY + 0.6, tz + 0.55, 1.2, 0.05, 0.05, 0, 0);
    box(0x5d6461, tx + 0.55, roofY + 0.6, tz, 0.05, 0.05, 1.2);
    cylinder(kit, 0x85867c, tx, roofY + 2.1, tz, 0.72, 1.5, 12, 0.72, buildingTexture("metal"));
    cylinder(kit, 0x5d6461, tx, roofY + 2.4, tz, 0.74, 0.05, 12);
    solid(new THREE.ConeGeometry(0.76, 0.35, 12), 0x737b77, tx, roofY + 3.02, tz);
    box(0x5d6461, tx + 0.45, roofY + 0.9, tz + 0.7, 0.08, 1.5, 0.08);
  }
  const antenna = (ax: number, az: number, h: number, yaw: number) => {
    box(0x4a4f4c, ax, roofY + h / 2, az, 0.06, h, 0.06);
    for (let i = 0; i < 4; i++) box(0x4a4f4c, ax, roofY + h - 0.15 - i * 0.22, az, 1.2 - i * 0.2, 0.03, 0.03, 0, yaw);
    box(0x4a4f4c, ax, roofY + h - 0.45, az, 0.03, 0.03, 0.9, 0, yaw);
    box(0x8d8f8c, ax, roofY + 0.05, az, 0.3, 0.1, 0.3);
  };
  antenna(-4.2, 2.2, 2.6, 0.3);
  antenna(4.1, 0.9, 2.2, -0.4);
  antenna(-0.6, 2.3, 1.6 + sh, 0.6);
  antenna(1.8, -3.7, 1.9, 0.1);
  for (const lx of [-4.3, -1.5]) {
    box(0x9a8967, lx, roofY + 0.9, 0.3, 0.08, 1.8, 0.08);
    box(0x9a8967, lx, roofY + 1.75, 0.3, 0.06, 0.06, 0.8);
  }
  for (const dz of [-0.3, 0.3]) box(0xdedad0, -2.9, roofY + 1.76, 0.3 + dz, 2.8, 0.02, 0.02);
  const roofClothes = [0xe8b4b0, 0xf2ede0, 0x3f7fb0, 0xe7bd70, 0xb6d8c0, 0xd8584a];
  for (let i = 0; i < 6; i++) box(roofClothes[i], -4.0 + i * 0.44, roofY + 1.45, 0.3 + (i % 2 ? 0.3 : -0.3), 0.34, 0.55, 0.02);
  for (const [vx, vz] of [[-1.8, -3.4], [3.6, 2.2], [-4.2, -3.8]]) {
    box(0x8d8f8c, vx, roofY + 0.3, vz, 0.18, 0.6, 0.18);
    box(0x5d6461, vx, roofY + 0.62, vz, 0.3, 0.05, 0.3);
  }
  box(0x8d8f8c, 2.0, roofY + 0.2, -0.8, 0.9, 0.3, 0.9);
  box(0x5d6461, 2.0, roofY + 0.37, -0.8, 1.0, 0.05, 1.0);

  // Forecourt: planters, lamps, bench, bicycle, bins
  for (const px of [-6.2, -3.4, 3.4, 6.2]) {
    box(0xd6cfbb, px, 0.3, 5.45, 1.3, 0.55, 0.7);
    box(0x815b36, px, 0.58, 5.45, 1.15, 0.04, 0.55);
    shrub(kit, px - 0.25, 0.58, 5.45, 0.45);
    shrub(kit, px + 0.3, 0.58, 5.45, 0.38, 0x557a3a);
    box(0xd4485a, px + 0.1, 1.0, 5.55, 0.12, 0.1, 0.12);
  }
  for (const lx of [-7.1, 7.1]) {
    box(iron, lx, 1.6, 5.5, 0.1, 3.2, 0.1);
    box(iron, lx, 3.22, 5.3, 0.06, 0.06, 0.5);
    box(0xf6e7a8, lx, 3.1, 5.1, 0.24, 0.2, 0.24);
    box(iron, lx, 3.24, 5.1, 0.34, 0.05, 0.34);
  }
  box(0x9a8967, 0, 0.45, 5.6, 1.3, 0.08, 0.4);
  for (const dx of [-0.5, 0.5]) box(iron, dx, 0.22, 5.6, 0.06, 0.44, 0.36);
  // bicycle by the +x patio
  for (const bz of [4.95, 5.85 - 0.3]) cylinder(kit, 0x2f3330, 5.45, 0.35, bz, 0.32, 0.04, 10).rotation.set(0, 0, Math.PI / 2);
  box(0xc0392b, 5.45, 0.55, 5.25, 0.04, 0.05, 0.62, 0.3);
  box(0x2f3330, 5.45, 0.8, 5.0, 0.4, 0.04, 0.04);
  // bins and gas bottles out back
  for (const bx of [-4.6, -4.0]) {
    box(0x4f7d5a, bx, 0.45, -5.3, 0.5, 0.8, 0.55);
    box(0x3f6a4a, bx, 0.88, -5.3, 0.54, 0.06, 0.6);
  }
  for (const gx of [3.8, 4.1, 4.4]) cylinder(kit, 0xc0612f, gx, 0.4, -5.1, 0.13, 0.7, 8);
  shrub(kit, 5.4, 0.05, -5.3, 0.6);
  shrub(kit, -5.45, 0.05, 1.0, 0.5);
}
