import * as THREE from "three";
import { buildingTexture } from "../building-textures";
import { Kit } from "./kit";
import { cylinder, downspout, panelDoor, ribs, shrub, shutteredWindow } from "./mid-housing-parts";

type V3 = [number, number, number];

export function buildBunkhouse(kit: Kit) {
  const { box, solid } = kit;
  const wall = 0x668374;
  const trim = 0xe4dfca;
  const board = 0x58705f;
  const metal = 0x737b77;
  const shutter = 0x537a9a;
  const slat = 0x3f5f78;
  const floor = 0x7d6b55;
  const pier = 0x92908a;

  // Body extents
  const x0 = -3.4;
  const x1 = 5.4;
  const cx = (x0 + x1) / 2;
  const zb = -3.2;
  const zf = 0.4;
  const cz = (zb + zf) / 2;
  const bw = x1 - x0;
  const bd = zf - zb;
  const fl = 0.6;
  const top = 3.9;

  // Yard ground, paths and patches
  box(0x756345, 0, 0.03, 0, 11.9, 0.06, 7.9);
  box(0x815b36, -1.15, 0.07, 3.4, 1.1, 0.04, 1.2);
  box(0x815b36, 3.1, 0.07, 3.4, 1.1, 0.04, 1.2);
  box(0x72583b, -4.6, 0.07, -0.4, 1.8, 0.04, 1.6);
  for (const [gx, gz, s] of [[-5.6, -0.9, 0.5], [5.3, -3.7, 0.6], [-3.0, 3.7, 0.45], [5.5, 1.2, 0.4], [-5.4, 3.7, 0.5]]) {
    box(0x6d7a3e, gx, 0.08, gz, s * 1.4, 0.05, s);
    box(0x5c6c34, gx + 0.1, 0.16, gz, s * 0.5, 0.18, s * 0.4);
  }

  // Raised floor platform on piers (body + front veranda)
  box(floor, cx, fl - 0.1, -0.55, bw + 0.2, 0.2, 5.5);
  for (let px = x0 + 0.1; px <= x1; px += 1.46) {
    for (const pz of [-3.15, -1.4, 0.35, 2.1]) box(pier, px, (fl - 0.2) / 2, pz, 0.3, fl - 0.2, 0.3);
  }
  for (let px = x0 + 0.2; px < x1; px += 0.22) box(0x6b5a45, px, 0.22, 2.17, 0.07, 0.36, 0.04);
  for (let pz = -3.1; pz < 2.2; pz += 0.22) box(0x6b5a45, x1 + 0.07, 0.22, pz, 0.04, 0.36, 0.07);
  box(0x6b5a45, cx, 0.42, 2.19, bw + 0.2, 0.06, 0.06);
  for (let px = x0; px < x1; px += 0.36) box(0x6f5d48, px + 0.18, fl + 0.005, 1.3, 0.02, 0.01, 1.75);

  // Walls with board siding
  box(wall, cx, (fl + top) / 2, cz, bw, top - fl, bd);
  for (let y = fl + 0.3; y < top; y += 0.28) {
    box(board, cx, y, zf + 0.015, bw, 0.03, 0.03);
    box(board, cx, y, zb - 0.015, bw, 0.03, 0.03);
    box(board, x1 + 0.015, y, cz, 0.03, 0.03, bd);
    box(board, x0 - 0.015, y, cz, 0.03, 0.03, bd);
  }
  for (const [px, pz] of [[x0, zb], [x0, zf], [x1, zb], [x1, zf]]) box(trim, px, (fl + top) / 2, pz, 0.2, top - fl, 0.2);
  box(trim, cx, fl + 0.12, zf + 0.04, bw, 0.24, 0.08);
  box(trim, cx, fl + 0.12, zb - 0.04, bw, 0.24, 0.08);
  box(trim, x1 + 0.04, fl + 0.12, cz, 0.08, 0.24, bd);
  box(trim, x0 - 0.04, fl + 0.12, cz, 0.08, 0.24, bd);
  box(trim, cx, top - 0.08, zf + 0.04, bw, 0.16, 0.08);
  box(trim, cx, top - 0.08, zb - 0.04, bw, 0.16, 0.08);
  // Weathering streaks and patches
  for (const [px, w, h] of [[-2.0, 0.9, 0.7], [0.9, 0.6, 1.1], [2.4, 0.8, 0.5], [4.0, 0.5, 0.9]]) {
    box(0x5a7566, px, fl + 0.3 + h / 2, zf + 0.03, w, h, 0.02);
  }
  for (const [pz, h] of [[-0.5, 0.8], [-2.4, 0.6]]) box(0x5a7566, x1 + 0.03, fl + 0.3 + h / 2, pz, 0.02, h, 0.7);
  box(0x7d8f6c, 1.0, 3.5, zf + 0.03, 0.7, 0.3, 0.02);

  // Front facade: shuttered windows and doors
  const front = 0;
  for (const wx of [-2.6, 0.3, 1.7, 4.5]) shutteredWindow(kit, front, wx, zf + 0.02, 0, 2.25, 0.75, 1.1, shutter, slat);
  for (const dx of [-1.15, 3.1]) {
    panelDoor(kit, front, dx, zf, 0, fl, 0.95, 2.4, 0x755b43, trim, 0x5e4734);
  }
  // Number plaques
  box(0xe9e2cc, -1.15, 3.6, zf + 0.06, 0.35, 0.2, 0.04);
  box(0xe9e2cc, 3.1, 3.6, zf + 0.06, 0.35, 0.2, 0.04);

  // Side and back windows
  for (const u of [-0.95, 0.95]) {
    shutteredWindow(kit, Math.PI / 2, x1 + 0.02, cz, u, 2.25, 0.75, 1.1, shutter, slat);
    shutteredWindow(kit, -Math.PI / 2, x0 - 0.02, cz, u, 2.25, 0.75, 1.1, shutter, slat, false);
  }
  for (const bx of [-2.3, -0.6, 1.1, 2.8, 4.5]) shutteredWindow(kit, Math.PI, bx, zb - 0.02, 0, 2.25, 0.75, 1.1, shutter, slat, bx > 2);

  // Main corrugated gable roof (ridge along x)
  const eave = 3.7;
  const rise = 1.5;
  const half = 2.1;
  const rw = bw + 0.8;
  const angle = Math.atan2(rise, half);
  const len = Math.hypot(half, rise);
  const ribSegs: [V3, V3][] = [];
  for (const side of [-1, 1]) {
    box(metal, cx, eave + rise / 2, cz + side * half / 2, rw, 0.12, len + 0.05, side * angle);
    for (let x = cx - rw / 2 + 0.12; x < cx + rw / 2; x += 0.24) {
      ribSegs.push([[x, eave + 0.02, cz + side * half], [x, eave + rise - 0.02, cz + side * 0.03]]);
    }
    // Rust and patched sheets
    for (const [px, t, w, l, c] of [[-2.6, 0.3, 1.2, 0.7, 0x8a5a3a], [0.8, 0.6, 0.9, 0.5, 0x7a4c32], [3.4, 0.2, 1.4, 0.4, 0x8e6446], [4.6, 0.7, 0.8, 0.6, 0x85867c], [-0.8, 0.45, 1.1, 0.9, 0x858079]] as const) {
      const ts = side > 0 ? t : 1 - t * 0.8;
      box(c, px + (side > 0 ? 0 : 0.7), eave + rise * ts + 0.11, cz + side * half * (1 - ts), w, 0.03, l, side * angle);
    }
    // Gutter along the eave
    box(0x85867c, cx, eave - 0.05, cz + side * (half + 0.08), rw, 0.14, 0.16);
  }
  ribs(kit, ribSegs, 0.12, 0.05, 0x8c948f, 0.08);
  box(0x5d6461, cx, eave + rise + 0.08, cz, rw + 0.05, 0.12, 0.42);
  for (let x = cx - rw / 2 + 0.4; x < cx + rw / 2; x += 0.8) box(0x4a4f4c, x, eave + rise + 0.15, cz, 0.06, 0.04, 0.44);
  // Barge boards on the gable ends
  for (const ex of [cx - rw / 2, cx + rw / 2]) for (const side of [-1, 1]) {
    box(trim, ex, eave + rise / 2 + 0.02, cz + side * half / 2, 0.08, 0.26, len + 0.1, side * angle);
  }
  // Gable-end infill (wood) at both end walls
  const gp: number[] = [];
  for (const ex of [x0 - 0.01, x1 + 0.01]) {
    const yw = eave + rise * (1 - (zf - cz) / half);
    const a: V3 = [ex, top, zb];
    const b: V3 = [ex, top, zf];
    const c: V3 = [ex, yw, zf];
    const d: V3 = [ex, eave + rise, cz];
    const e: V3 = [ex, yw, zb];
    gp.push(...a, ...b, ...c, ...a, ...c, ...d, ...a, ...d, ...e);
  }
  const gend = new THREE.BufferGeometry();
  gend.setAttribute("position", new THREE.Float32BufferAttribute(gp, 3));
  const guv: number[] = [];
  for (let i = 0; i < gp.length; i += 3) guv.push(gp[i + 2] / 2, gp[i + 1] / 2);
  gend.setAttribute("uv", new THREE.Float32BufferAttribute(guv, 2));
  gend.computeVertexNormals();
  solid(gend, wall, 0, 0, 0, buildingTexture("wood"));
  // Gable vents
  for (const [ex, dir] of [[x1 + 0.04, 1], [x0 - 0.04, -1]] as const) {
    box(trim, ex, 4.45, cz, 0.06, 0.6, 0.8);
    box(0x3a4640, ex + dir * 0.03, 4.45, cz, 0.04, 0.48, 0.66);
    for (let y = 4.27; y < 4.66; y += 0.1) box(trim, ex + dir * 0.05, y, cz, 0.03, 0.03, 0.62);
  }
  // Stove pipe through back slope
  cylinder(kit, 0x4a4f4c, 4.1, 5.0, -2.4, 0.11, 1.4, 8);
  kit.solid(new THREE.ConeGeometry(0.24, 0.22, 8), 0x3e4341, 4.1, 5.8, -2.4);
  box(0x5d6461, 4.1, 4.42, -2.4, 0.5, 0.08, 0.5, -angle);

  // Veranda lean-to roof on posts
  const vz0 = zf;
  const vz1 = 2.4;
  const vy0 = 3.7;
  const vy1 = 3.12;
  const va = Math.atan2(vy0 - vy1, vz1 - vz0);
  const vl = Math.hypot(vz1 - vz0, vy0 - vy1);
  box(0x85867c, cx, (vy0 + vy1) / 2, (vz0 + vz1) / 2, bw + 0.3, 0.1, vl, va);
  const vRibs: [V3, V3][] = [];
  for (let x = cx - bw / 2 - 0.05; x < cx + bw / 2 + 0.1; x += 0.24) vRibs.push([[x, vy1 + 0.02, vz1], [x, vy0 - 0.02, vz0 + 0.02]]);
  ribs(kit, vRibs, 0.12, 0.05, 0x9a9b91, 0.06);
  for (const [px, t, w] of [[-1.8, 0.4, 1.1], [2.2, 0.65, 0.8], [4.4, 0.3, 0.9]]) {
    box(0x8a5a3a, px, vy0 - (vy0 - vy1) * t + 0.08, vz0 + (vz1 - vz0) * t, w, 0.03, 0.6, va);
  }
  box(0x85867c, cx, vy1 - 0.06, vz1 + 0.06, bw + 0.3, 0.14, 0.16);
  const posts = [-3.3, -1.8, -0.5, 0.9, 2.5, 3.7, 5.3];
  box(trim, cx, 3.08, 2.05, bw + 0.1, 0.18, 0.18);
  for (const px of posts) {
    box(trim, px, (fl + 3.05) / 2, 2.05, 0.18, 3.05 - fl, 0.18);
    box(trim, px, 2.85, 1.85, 0.08, 0.08, 0.45, -0.785);
  }
  for (let i = 0; i < posts.length - 1; i++) {
    const a = posts[i];
    const b = posts[i + 1];
    if ((a < -1.15 && b > -1.15) || (a < 3.1 && b > 3.1)) continue;
    box(trim, (a + b) / 2, 1.6, 2.05, b - a, 0.1, 0.12);
    box(trim, (a + b) / 2, 0.85, 2.05, b - a, 0.08, 0.1);
    for (let x = a + 0.25; x < b - 0.1; x += 0.25) box(0xd7cfba, x, 1.22, 2.05, 0.06, 0.7, 0.06);
  }
  // Veranda side rails
  for (const px of [x0 + 0.1, x1 - 0.1]) {
    box(trim, px, 1.6, 1.25, 0.1, 0.1, 1.6);
    for (let z = 0.6; z < 2.0; z += 0.25) box(0xd7cfba, px, 1.22, z, 0.06, 0.7, 0.06);
  }
  // Steps
  for (const sx of [-1.15, 3.1]) {
    box(0x9a8967, sx, 0.2, 2.35, 1.3, 0.4, 0.3);
    box(0x9a8967, sx, 0.1, 2.65, 1.3, 0.2, 0.3);
    for (const side of [-1, 1]) box(0x6b5a45, sx + side * 0.68, 0.25, 2.45, 0.08, 0.5, 0.6);
  }
  // Hanging lamps under veranda
  for (const lx of [-1.15, 3.1]) {
    box(0x2f2f2b, lx, 3.2, 1.0, 0.03, 0.3, 0.03);
    box(0xf2e2a0, lx, 2.98, 1.0, 0.2, 0.22, 0.2);
    box(0x2f2f2b, lx, 3.12, 1.0, 0.28, 0.05, 0.28);
  }

  // Benches on the veranda
  for (const bx of [0.95, 4.35]) {
    box(0x9a8967, bx, fl + 0.45, 0.85, 1.3, 0.08, 0.4);
    box(0x9a8967, bx, fl + 0.8, 0.68, 1.3, 0.3, 0.06);
    for (const dx of [-0.55, 0.55]) box(0x6b5a45, bx + dx, fl + 0.22, 0.85, 0.08, 0.45, 0.36);
  }
  // Rocking chair & crate
  box(0x7d6b55, -2.6, fl + 0.45, 1.3, 0.5, 0.06, 0.5);
  box(0x7d6b55, -2.6, fl + 0.8, 1.05, 0.5, 0.7, 0.06);
  box(0x6b5a45, -2.6, fl + 0.1, 1.3, 0.6, 0.05, 0.08, 0, 0);
  box(0xb28b60, -3.0, fl + 0.25, 1.85, 0.5, 0.5, 0.45);
  box(0x8c6a48, -3.0, fl + 0.25, 1.85, 0.52, 0.06, 0.47);

  // Downspouts and rain barrel
  downspout(kit, 0x85867c, x1 + 0.12, zb - 0.32, eave, 0.1);
  downspout(kit, 0x85867c, x0 - 0.12, zb - 0.32, eave, 0.1);
  downspout(kit, 0x85867c, x1 + 0.12, vz1 + 0.06, vy1 - 0.05, 1.0);
  cylinder(kit, 0x6f5a40, x1 + 0.1, 0.5, 2.65, 0.36, 0.95, 10, 0.36, buildingTexture("wood"));
  cylinder(kit, 0x3e4341, x1 + 0.1, 0.72, 2.65, 0.38, 0.06, 10);
  cylinder(kit, 0x3e4341, x1 + 0.1, 0.3, 2.65, 0.38, 0.06, 10);

  // Water tank on a timber stand (back-left)
  const tx = -4.85;
  const tz = -2.75;
  const legH = 2.7;
  for (const lx of [-0.55, 0.55]) for (const lz of [-0.55, 0.55]) box(0x755b43, tx + lx, legH / 2, tz + lz, 0.16, legH, 0.16);
  for (const y of [0.9, 1.9]) {
    box(0x7d6b55, tx, y, tz + 0.55, 1.2, 0.08, 0.08);
    box(0x7d6b55, tx, y, tz - 0.55, 1.2, 0.08, 0.08);
    box(0x7d6b55, tx + 0.55, y, tz, 0.08, 0.08, 1.2);
    box(0x7d6b55, tx - 0.55, y, tz, 0.08, 0.08, 1.2);
  }
  box(0x7d6b55, tx, 1.4, tz + 0.56, 0.08, 1.4, 0.06, 0, 0);
  box(0x6b5a45, tx + 0.57, 1.4, tz, 0.05, 1.5, 0.05, 0.75);
  box(0x6b5a45, tx, 1.4, tz + 0.57, 1.5, 0.05, 0.05, 0, 0);
  box(0x7d6b55, tx, legH + 0.06, tz, 1.4, 0.12, 1.4);
  cylinder(kit, 0x9a8967, tx, legH + 0.82, tz, 0.72, 1.4, 12, 0.72, buildingTexture("wood"));
  for (const y of [legH + 0.35, legH + 0.82, legH + 1.3]) cylinder(kit, 0x3e4341, tx, y, tz, 0.74, 0.06, 12);
  kit.solid(new THREE.ConeGeometry(0.8, 0.45, 12), 0x737b77, tx, legH + 1.75, tz);
  // ladder
  for (const lz of [-0.2, 0.2]) box(0x6b5a45, tx + 0.72, legH / 2 + 0.3, tz + lz, 0.06, legH + 0.6, 0.06);
  for (let y = 0.3; y < legH + 0.5; y += 0.35) box(0x6b5a45, tx + 0.72, y, tz, 0.05, 0.05, 0.4);
  // pipe from tank to pump
  box(0x4a4f4c, tx + 0.3, 1.4, tz + 0.75, 0.08, 2.8, 0.08);
  box(0x4a4f4c, tx + 0.3, 0.12, tz + 1.4, 0.08, 0.08, 1.3);

  // Hand pump and trough
  const px = -4.55;
  const pz = -0.55;
  box(0x92908a, px - 0.45, 0.08, pz, 0.9, 0.16, 0.9);
  box(0x3e4341, px - 0.7, 0.75, pz, 0.14, 1.2, 0.14);
  box(0x3e4341, px - 0.7, 1.38, pz, 0.2, 0.1, 0.2);
  box(0x3e4341, px - 0.98, 1.45, pz, 0.6, 0.05, 0.05, 0, 0);
  box(0x3e4341, px - 0.5, 1.12, pz, 0.36, 0.08, 0.08);
  box(0x9a8967, px + 0.05, 0.3, pz, 0.6, 0.45, 1.3);
  box(0x4f7d8c, px + 0.05, 0.5, pz, 0.48, 0.04, 1.18);
  box(0x2f3b3f, px - 0.5, 0.17, pz + 0.3, 0.3, 0.02, 0.4);
  // Bucket
  cylinder(kit, 0x85867c, px - 0.2, 0.2, pz + 0.85, 0.16, 0.32, 8, 0.2);

  // Outhouse (front-left)
  const ox = -5.0;
  const oz = 2.45;
  box(0x92908a, ox, 0.06, oz, 1.3, 0.12, 1.3);
  box(0x9a8967, ox, 1.22, oz, 1.1, 2.2, 1.1);
  for (let u = -0.45; u < 0.5; u += 0.22) {
    box(0x7d6b55, ox + u, 1.22, oz + 0.56, 0.03, 2.2, 0.03);
    box(0x7d6b55, ox - 0.56, 1.22, oz + u, 0.03, 2.2, 0.03);
  }
  box(0x755b43, ox + 0.56, 1.15, oz, 0.06, 1.9, 0.75);
  box(0x2f2a22, ox + 0.6, 1.85, oz, 0.02, 0.18, 0.12);
  box(0xc9b16f, ox + 0.61, 1.1, oz + 0.25, 0.05, 0.06, 0.06);
  for (const dz of [-0.33, 0.33]) box(0x5e4734, ox + 0.6, 1.15, oz + dz, 0.03, 1.8, 0.06);
  box(0x737b77, ox + 0.05, 2.42, oz, 1.5, 0.08, 1.5, 0.14);
  for (let u = -0.6; u < 0.7; u += 0.2) box(0x8c948f, ox + 0.05 + u, 2.47, oz, 0.04, 0.04, 1.5, 0.14);
  box(0x8a5a3a, ox - 0.2, 2.45, oz + 0.2, 0.5, 0.03, 0.4, 0.14);
  box(0x4a4f4c, ox - 0.35, 2.7, oz - 0.3, 0.1, 0.5, 0.1);

  // Washing line across the front yard
  for (const lx of [-0.2, 5.55]) {
    box(0x6b5a45, lx, 1.2, 3.55, 0.12, 2.4, 0.12);
    box(0x6b5a45, lx, 2.3, 3.55, 0.1, 0.08, 0.7);
  }
  for (const dz of [-0.25, 0.25]) box(0xdedad0, 2.68, 2.33, 3.55 + dz, 5.75, 0.02, 0.02);
  const clothes = [0xe3ddce, 0xa34e35, 0x537a9a, 0xe7bd70, 0xece7da, 0x65a39b, 0xd8a7a0, 0xb9b8a2];
  let ci = 0;
  for (let lx = 0.35; lx < 5.2; lx += 0.62) {
    const c = clothes[ci++ % clothes.length];
    const tall = ci % 3 === 0;
    box(c, lx, tall ? 1.85 : 2.05, 3.55 + (ci % 2 ? 0.25 : -0.25), 0.48, tall ? 0.9 : 0.5, 0.03);
    box(0xbfb7a2, lx - 0.15, 2.34, 3.55 + (ci % 2 ? 0.25 : -0.25), 0.04, 0.08, 0.05);
  }
  // Yard bench, firewood and shrubs
  box(0x7d6b55, -3.0, 0.45, 3.4, 1.3, 0.08, 0.4);
  for (const dx of [-0.5, 0.5]) box(0x6b5a45, -3.0 + dx, 0.22, 3.4, 0.08, 0.44, 0.36);
  for (let i = 0; i < 6; i++) box(0x8a6a45, -3.85 + (i % 3) * 0.17, 0.1 + Math.floor(i / 3) * 0.16, -3.6, 0.16, 0.16, 0.7);
  shrub(kit, 5.4, 0.05, -1.6, 0.55);
  shrub(kit, -5.45, 0.05, 1.0, 0.5, 0x557a3a);
  shrub(kit, -2.3, 0.05, 3.6, 0.45);
}
