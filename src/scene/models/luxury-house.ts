import * as THREE from "three";
import { buildingTexture } from "../building-textures";
import { Kit } from "./kit";
import { arcade, archHeads, cylinder, downspout, hipRoof, palm, panelDoor, shrub, shutteredWindow, wallBox } from "./mid-housing-parts";

export function buildLuxuryHouse(kit: Kit) {
  const { box, solid } = kit;
  const wall = 0xe9c98d;
  const trim = 0xf0e7ce;
  const stone = 0xc8bea3;
  const shutter = 0x65a39b;
  const slat = 0x4b7f78;
  const glass = 0x526e6b;
  const iron = 0x2f3330;
  const x0 = -4.4;
  const x1 = 4.4;
  const zb = -4.6;
  const zf = 0.6;
  const cz = (zb + zf) / 2;
  const bw = x1 - x0;
  const bd = zf - zb;
  const base = 0.5;
  const mid = 3.8;
  const top = 7.3;
  const fanGlass: { x: number; y: number; z: number; r: number; facing: number; inner?: number }[] = [];
  const fanTrim: { x: number; y: number; z: number; r: number; facing: number; inner?: number }[] = [];
  const arched = (facing: number, cx: number, cz2: number, u: number, y: number, w: number, h: number, shutters: boolean) => {
    const c = Math.cos(facing);
    const s = Math.sin(facing);
    if (shutters) shutteredWindow(kit, facing, cx, cz2, u, y, w, h, shutter, slat);
    else kit.window(cx + u * c, y, cz2 - u * s, w, h, facing);
    const px = cx + u * c;
    const pz = cz2 - u * s;
    fanGlass.push({ x: px + s * 0.1, y: y + h / 2 + 0.12, z: pz + c * 0.1, r: w / 2, facing });
    fanTrim.push({ x: px + s * 0.13, y: y + h / 2 + 0.12, z: pz + c * 0.13, r: w / 2 + 0.17, inner: w / 2 - 0.02, facing });
    wallBox(kit, facing, cx, cz2)(trim, u, y + h / 2 + 0.12 + w / 2 + 0.12, 0.16, 0.18, 0.24, 0.12);
  };

  // Grounds: lawn, paving, perimeter wall and gate
  box(0x6f8f4a, 0, 0.03, 0, 11.9, 0.06, 11.9);
  box(0xd8cbb0, 0, 0.07, 4.9, 1.6, 0.04, 1.8);
  for (let z = 4.15; z < 5.8; z += 0.4) box(0xc4b697, 0, 0.1, z, 1.6, 0.02, 0.04);
  const wallC = 0xece3cd;
  const cap = 0xddd2b8;
  const perimeter = (x: number, z: number, w: number, d: number) => {
    box(wallC, x, 0.5, z, w, 1.0, d);
    box(cap, x, 1.06, z, w + 0.1, 0.12, d + 0.1);
    box(0xb7ab92, x, 0.1, z, w + 0.04, 0.2, d + 0.04);
  };
  perimeter(-3.55, 5.7, 4.2, 0.3);
  perimeter(3.55, 5.7, 4.2, 0.3);
  perimeter(-5.7, 0, 0.3, 11.1);
  perimeter(5.7, 0, 0.3, 11.1);
  perimeter(0, -5.7, 11.7, 0.3);
  for (const x of [-5.7, -3.2, 3.2, 5.7]) for (const z of [5.7]) {
    box(wallC, x, 0.65, z, 0.42, 1.3, 0.42);
    box(cap, x, 1.35, z, 0.5, 0.1, 0.5);
  }
  for (const z of [-5.7, -3, 0, 3]) for (const x of [-5.7, 5.7]) {
    box(wallC, x, 0.65, z, 0.42, 1.3, 0.42);
    box(cap, x, 1.35, z, 0.5, 0.1, 0.5);
  }
  // Gate piers with lanterns and iron gates
  for (const side of [-1, 1]) {
    const gx = side * 1.2;
    box(wallC, gx, 0.85, 5.62, 0.5, 1.7, 0.5);
    box(cap, gx, 1.75, 5.62, 0.6, 0.12, 0.6);
    box(cap, gx, 1.86, 5.62, 0.42, 0.1, 0.42);
    box(iron, gx, 1.98, 5.62, 0.08, 0.16, 0.08);
    box(0xf6e7a8, gx, 2.2, 5.62, 0.26, 0.3, 0.26);
    box(iron, gx, 2.38, 5.62, 0.34, 0.06, 0.34);
    box(iron, gx, 2.46, 5.62, 0.12, 0.1, 0.12);
    // gate leaf swung open
    const leafX = side * 0.92;
    const leafZ = 5.12;
    for (let t = 0.05; t < 0.85; t += 0.13) box(iron, leafX, 0.75, 5.5 - t, 0.04, 1.3, 0.04);
    box(iron, leafX, 1.38, leafZ, 0.06, 0.06, 0.85);
    box(iron, leafX, 0.2, leafZ, 0.06, 0.06, 0.85);
    box(iron, leafX, 0.8, leafZ, 0.05, 0.05, 0.85);
  }
  for (const lx of [-0.95, 0.95]) {
    box(iron, lx, 0.8, 4.6, 0.08, 1.6, 0.08);
    box(iron, lx, 1.65, 4.6, 0.3, 0.06, 0.3);
    box(0xf6e7a8, lx, 1.82, 4.6, 0.22, 0.28, 0.22);
    box(iron, lx, 2.0, 4.6, 0.3, 0.06, 0.3);
  }

  // Plinth, terrace and steps
  box(stone, 0, base / 2, -1.3, bw + 0.6, base, 7.0);
  box(0xb7ab92, 0, 0.08, -1.3, bw + 0.7, 0.16, 7.1);
  box(0xdcd0b4, 0, base + 0.01, 1.6, bw + 0.5, 0.02, 3.4);
  for (let x = -4.6; x <= 4.6; x += 0.55) box(0xc9bc9d, x, base + 0.025, 1.95, 0.025, 0.01, 2.7);
  for (let z = 0.8; z < 3.3; z += 0.55) box(0xc9bc9d, 0, base + 0.025, z, bw + 0.5, 0.01, 0.025);
  box(stone, 0, 0.33 / 2, 3.55, 2.0, 0.33, 0.35);
  box(stone, 0, 0.17 / 2, 3.85, 2.0, 0.17, 0.3);
  // Terrace balustrade
  const balustrade = (xA: number, xB: number, z: number, y: number, along: "x" | "z", h = 0.85) => {
    const len = xB - xA;
    const mid2 = (xA + xB) / 2;
    if (along === "x") {
      box(trim, mid2, y + 0.06, z, len, 0.12, 0.3);
      box(trim, mid2, y + h, z, len + 0.05, 0.1, 0.3);
      for (let x = xA + 0.15; x < xB - 0.05; x += 0.24) {
        box(0xe8dcc0, x, y + h / 2, z, 0.08, h - 0.2, 0.08);
        box(0xe8dcc0, x, y + h * 0.42, z, 0.14, 0.18, 0.14);
      }
    } else {
      box(trim, z, y + 0.06, mid2, 0.3, 0.12, len);
      box(trim, z, y + h, mid2, 0.3, 0.1, len + 0.05);
      for (let p = xA + 0.15; p < xB - 0.05; p += 0.24) {
        box(0xe8dcc0, z, y + h / 2, p, 0.08, h - 0.2, 0.08);
        box(0xe8dcc0, z, y + h * 0.42, p, 0.14, 0.18, 0.14);
      }
    }
  };
  balustrade(-4.7, -1.05, 3.2, base, "x");
  balustrade(1.05, 4.7, 3.2, base, "x");
  for (const x of [-4.7, -1.05, 1.05, 4.7]) {
    box(trim, x, base + 0.5, 3.2, 0.36, 1.0, 0.36);
    box(trim, x, base + 1.02, 3.2, 0.42, 0.08, 0.42);
  }
  // Urns on the stair posts
  for (const x of [-1.05, 1.05]) {
    cylinder(kit, 0xb06a42, x, base + 1.28, 3.2, 0.14, 0.42, 8, 0.24, buildingTexture("tile"));
    shrub(kit, x, base + 1.45, 3.2, 0.36, 0x4f8a3c);
  }

  // Main body
  box(wall, 0, (base + top) / 2, cz, bw, top - base, bd);
  box(trim, 0, mid, cz, bw + 0.16, 0.2, bd + 0.16);
  box(trim, 0, mid + 0.14, cz, bw + 0.1, 0.08, bd + 0.1);
  box(trim, 0, top - 0.12, cz, bw + 0.24, 0.24, bd + 0.24);
  box(0xe1d5b8, 0, top + 0.02, cz, bw + 0.4, 0.12, bd + 0.4);
  for (let x = x0 - 0.1; x <= x1 + 0.1; x += 0.4) {
    box(trim, x, top - 0.3, zf + 0.14, 0.12, 0.12, 0.16);
    box(trim, x, top - 0.3, zb - 0.14, 0.12, 0.12, 0.16);
  }
  for (let z = zb; z <= zf; z += 0.4) {
    box(trim, x1 + 0.14, top - 0.3, z, 0.16, 0.12, 0.12);
    box(trim, x0 - 0.14, top - 0.3, z, 0.16, 0.12, 0.12);
  }
  // Quoins
  for (const [qx, qz] of [[x0, zb], [x0, zf], [x1, zb], [x1, zf]]) {
    for (let y = base + 0.2, i = 0; y < top - 0.3; y += 0.42, i++) {
      const long = i % 2 === 0;
      box(0xf4ecd6, qx + (qx > 0 ? -1 : 1) * (long ? 0.18 : 0.1), y + 0.17, qz, long ? 0.5 : 0.34, 0.34, 0.1 + 0.08);
      box(0xf4ecd6, qx, y + 0.17, qz + (qz > cz ? -1 : 1) * (long ? 0.1 : 0.18), 0.18, 0.34, long ? 0.34 : 0.5);
    }
  }
  // Weathering
  for (const [px, w] of [[-3.8, 1.2], [-0.9, 0.7], [2.6, 1.4]]) box(0xd7b57d, px, base + 0.3, zb - 0.02, w, 0.5, 0.02);
  for (const [pz, w] of [[-3.6, 1.0], [-1.2, 1.4]]) box(0xd7b57d, x1 + 0.02, base + 0.28, pz, 0.02, 0.45, w);
  for (const pz of [-3.3, -0.5]) box(0xd9ba84, x1 + 0.02, 4.3, pz, 0.02, 1.0, 0.12);

  // Front ground floor (behind arcade): door and arched French windows
  for (const u of [-3.4, -1.7, 1.7, 3.4]) arched(0, 0, zf + 0.02, u, base + 1.3, 0.9, 1.9, false);
  box(trim, 0, base + 1.45, zf + 0.04, 1.9, 2.95, 0.08);
  for (const side of [-1, 1]) {
    box(0x6c4a33, side * 0.36, base + 1.25, zf + 0.1, 0.7, 2.5, 0.08);
    for (const py of [0.6, 1.5, 2.15]) box(0x5a3c29, side * 0.36, base + py, zf + 0.15, 0.5, py > 2 ? 0.3 : 0.7, 0.03);
    box(0xc9b16f, side * 0.08, base + 1.2, zf + 0.17, 0.06, 0.1, 0.06);
    // wall lanterns beside the door
    box(iron, side * 1.25, base + 2.2, zf + 0.12, 0.08, 0.3, 0.12);
    box(0xf6e7a8, side * 1.25, base + 2.4, zf + 0.22, 0.2, 0.3, 0.2);
    box(iron, side * 1.25, base + 2.6, zf + 0.22, 0.26, 0.05, 0.26);
  }
  fanGlass.push({ x: 0, y: base + 2.5, z: zf + 0.1, r: 0.7, facing: 0 });
  fanTrim.push({ x: 0, y: base + 2.5, z: zf + 0.12, r: 0.92, inner: 0.7, facing: 0 });
  box(0x6c4a33, 0, base + 2.53, zf + 0.12, 1.42, 0.06, 0.05);
  // Loggia ceiling beams
  for (let x = -4.2; x <= 4.2; x += 0.7) box(0xa58c66, x, mid - 0.17, 1.55, 0.12, 0.14, 1.9);
  // Pendant lantern
  box(iron, 0, mid - 0.45, 1.5, 0.03, 0.5, 0.03);
  box(0xf6e7a8, 0, mid - 0.82, 1.5, 0.28, 0.32, 0.28);
  // Front arcade with columns
  const archX = [-3.4, -1.7, 0, 1.7, 3.4];
  arcade(kit, wall, x0, x1, base, mid - 0.1, 2.35, 0.4, archX.map((x) => ({ x, w: 1.3, spring: 2.55 })), buildingTexture("plaster"));
  for (const x of archX) {
    fanTrim.push({ x, y: 2.55, z: 2.56, r: 0.82, inner: 0.65, facing: 0 });
    box(0xf4ecd6, x, 3.27, 2.6, 0.24, 0.32, 0.1);
  }
  for (const x of [-4.25, -2.55, -0.85, 0.85, 2.55, 4.25]) {
    cylinder(kit, trim, x, base + 1.1, 2.68, 0.16, 2.0, 10, 0.14);
    box(trim, x, base + 0.08, 2.66, 0.42, 0.16, 0.42);
    box(trim, x, base + 2.18, 2.66, 0.42, 0.16, 0.36);
    box(0xe1d5b8, x, base + 2.07, 2.66, 0.34, 0.08, 0.3);
  }
  box(trim, 0, mid - 0.32, 2.62, bw + 0.2, 0.18, 0.12);
  // Balcony slab and balustrade above the loggia
  box(trim, 0, mid, 1.6, bw + 0.3, 0.22, 2.2);
  box(0xd9c9a8, 0, mid - 0.15, 2.66, bw + 0.36, 0.1, 0.12);
  for (let x = -4.4; x <= 4.4; x += 0.4) box(0xe1d5b8, x, mid - 0.2, 2.68, 0.12, 0.1, 0.1);
  balustrade(-4.5, 4.5, 2.55, mid + 0.1, "x");
  balustrade(0.6, 2.55, x0 - 0.02, mid + 0.1, "z");
  balustrade(0.6, 2.55, x1 + 0.02, mid + 0.1, "z");
  for (const x of [-4.5, -1.7, 1.7, 4.5]) box(trim, x, mid + 0.55, 2.55, 0.34, 0.95, 0.34);
  // Planters on the balcony
  for (const x of [-2.6, 2.6]) {
    box(0xb06a42, x, mid + 0.35, 2.2, 0.8, 0.35, 0.35);
    shrub(kit, x - 0.2, mid + 0.5, 2.2, 0.3, 0x4f8a3c);
    box(0xd4485a, x + 0.15, mid + 0.68, 2.2, 0.18, 0.12, 0.18);
    box(0xe8d45a, x + 0.3, mid + 0.62, 2.15, 0.14, 0.12, 0.14);
  }
  // Upper floor French doors with fanlights and shutters
  for (const u of [-3.3, -1.1, 1.1, 3.3]) arched(0, 0, zf + 0.02, u, mid + 1.25, 0.85, 2.2, true);
  // Side and back facades
  for (const [facing, cx2, cz2] of [[Math.PI / 2, x1 + 0.02, cz], [-Math.PI / 2, x0 - 0.02, cz]] as const) {
    for (const u of [-1.3, 1.3]) {
      arched(facing, cx2, cz2, u, base + 1.5, 0.85, 1.7, true);
      arched(facing, cx2, cz2, u, mid + 1.5, 0.85, 1.7, true);
    }
  }
  for (const u of [-3.3, -1.1, 1.1, 3.3]) arched(Math.PI, 0, zb - 0.02, u, mid + 1.5, 0.85, 1.7, true);
  for (const u of [-3.3, 3.3]) arched(Math.PI, 0, zb - 0.02, u, base + 1.5, 0.85, 1.7, true);
  panelDoor(kit, Math.PI, 0, zb, 0, base, 1.0, 2.4, 0x6c4a33, trim, 0x5a3c29);
  box(0xa34e35, 0, base + 2.95, zb - 0.45, 1.6, 0.1, 0.9, 0.2);
  // Side balcony (+x upper floor)
  box(trim, x1 + 0.45, mid, cz, 0.9, 0.18, 2.6);
  for (let z = cz - 1.2; z <= cz + 1.2; z += 0.6) box(0xe1d5b8, x1 + 0.4, mid - 0.25, z, 0.7, 0.22, 0.14);
  for (let z = cz - 1.25; z <= cz + 1.25; z += 0.2) box(iron, x1 + 0.85, mid + 0.55, z, 0.04, 0.9, 0.04);
  box(iron, x1 + 0.85, mid + 1.02, cz, 0.08, 0.06, 2.6);
  box(iron, x1 + 0.85, mid + 0.15, cz, 0.06, 0.05, 2.6);
  for (const z of [cz - 1.3, cz + 1.3]) box(iron, x1 + 0.45, mid + 1.02, z, 0.85, 0.06, 0.06);

  // Downspouts
  for (const [dx, dz] of [[x1 + 0.12, zb - 0.12], [x0 - 0.12, zb - 0.12], [x1 + 0.12, zf - 0.25], [x0 - 0.12, zf - 0.25]]) {
    downspout(kit, 0x85867c, dx, dz, top + 0.1, base);
  }

  // Terracotta hip roof
  hipRoof(kit, { x: 0, z: cz, w: bw + 0.9, d: bd + 0.9, eave: top + 0.1, rise: 2.1, color: 0xb06a42, ribColor: 0xbd6b40, ridgeColor: 0x8f4a2c, ribSpacing: 0.36, courses: 6 });
  // Chimneys
  for (const cxh of [-2.6, 2.6]) {
    box(0xece3cd, cxh, 8.6, -3.3, 0.7, 2.6, 0.55);
    box(trim, cxh, 9.92, -3.3, 0.85, 0.14, 0.7);
    for (const dx of [-0.15, 0.15]) box(0xa34e35, cxh + dx, 10.12, -3.3, 0.16, 0.3, 0.16);
    box(0xd7c9ad, cxh, 8.5, -3.02, 0.7, 0.6, 0.02);
  }
  // Roof finials
  for (const fx of [-1.6, 1.6]) {
    box(0x8f4a2c, fx + Math.sign(fx) * 0.05, top + 2.35, cz, 0.18, 0.3, 0.18);
    box(0xd08a45, fx + Math.sign(fx) * 0.05, top + 2.58, cz, 0.12, 0.16, 0.12);
  }

  // Pool with coping, ladder, loungers and umbrella
  const pX = 2.9;
  const pZ = 4.65;
  const pW = 3.0;
  const pD = 1.45;
  box(0xe8e0cc, pX, 0.1, pZ, pW + 0.5, 0.16, pD + 0.5);
  box(0x2f8fae, pX, 0.12, pZ, pW, 0.16, pD);
  box(0x5fc3d8, pX, 0.205, pZ, pW - 0.1, 0.02, pD - 0.1);
  for (const [rx, rz, rw] of [[2.2, 4.4, 0.6], [3.4, 4.9, 0.8], [3.9, 4.3, 0.4]]) box(0x9ee0ea, rx, 0.22, rz, rw, 0.01, 0.06);
  for (const dx of [-0.15, 0.15]) {
    box(0xd8d8d0, pX + pW / 2 - 0.4 + dx, 0.55, pZ - pD / 2 - 0.08, 0.05, 0.7, 0.05);
    box(0xd8d8d0, pX + pW / 2 - 0.4 + dx, 0.9, pZ - pD / 2 + 0.02, 0.05, 0.05, 0.2);
  }
  for (const lz of [4.15, 5.05]) {
    box(0xf0f0e8, 5.0, 0.3, lz, 0.55, 0.08, 0.7);
    box(0x4f8fb8, 5.0, 0.36, lz, 0.5, 0.05, 0.65);
    box(0xf0f0e8, 5.0, 0.5, lz - 0.45, 0.55, 0.08, 0.4, 0.8);
    for (const dz of [-0.3, 0.3]) box(0xd8d8d0, 5.0, 0.13, lz + dz, 0.5, 0.26, 0.05);
  }
  box(0xd8d8d0, 5.0, 1.1, 3.65, 0.06, 2.2, 0.06);
  solid(new THREE.ConeGeometry(0.75, 0.45, 8), 0xe8603c, 5.0, 2.25, 3.65);
  box(0xf4f1e8, 5.0, 2.0, 3.65, 0.1, 0.06, 1.3);

  // Front-left garden: palm, beds, fountain, bench
  palm(kit, -4.4, 4.2, 5.4, 0.22, 0);
  box(0x815b36, -4.4, 0.1, 4.2, 1.2, 0.12, 1.2);
  box(0xddd2b8, -4.4, 0.12, 4.2, 1.35, 0.1, 0.06);
  cylinder(kit, 0xddd2b8, -2.5, 0.25, 4.6, 0.62, 0.4, 12);
  cylinder(kit, 0x5fc3d8, -2.5, 0.44, 4.6, 0.52, 0.04, 12);
  cylinder(kit, 0xddd2b8, -2.5, 0.8, 4.6, 0.1, 0.8, 8, 0.14);
  cylinder(kit, 0xddd2b8, -2.5, 1.22, 4.6, 0.3, 0.08, 10, 0.18);
  box(0x9ee0ea, -2.5, 1.32, 4.6, 0.08, 0.2, 0.08);
  const flowers = [0xd4485a, 0xe8d45a, 0xf0f0f0, 0xc46ad0, 0xe8803c];
  for (let i = 0; i < 14; i++) {
    const fx = -5.3 + (i % 7) * 0.62;
    const fz = i < 7 ? 3.6 : 5.35;
    box(0x815b36, fx, 0.08, fz, 0.6, 0.08, 0.5);
    shrub(kit, fx, 0.1, fz, 0.32, 0x4f8a3c);
    box(flowers[i % flowers.length], fx + 0.08, 0.38, fz + 0.05, 0.14, 0.1, 0.14);
  }
  box(0x9a8967, -3.6, 0.45, 4.6, 0.4, 0.08, 1.2);
  box(0x9a8967, -3.78, 0.75, 4.6, 0.06, 0.5, 1.2);
  for (const dz of [-0.5, 0.5]) box(iron, -3.6, 0.22, 4.6 + dz, 0.4, 0.44, 0.06);

  // Pergola on the +x side with climbing vines
  for (const pz of [-4.2, -2.6, -1.0]) {
    box(trim, 5.3, 1.35, pz, 0.22, 2.7, 0.22);
    box(0x9a8967, 4.95, 2.8, pz, 1.1, 0.12, 0.14);
  }
  for (let x = 4.55; x < 5.5; x += 0.3) box(0x9a8967, x, 2.92, -2.6, 0.08, 0.1, 3.6);
  box(0x9a8967, 5.3, 2.75, -2.6, 0.14, 0.14, 3.6);
  for (const [vx, vz, vw] of [[5.0, -3.8, 0.8], [4.8, -2.4, 1.1], [5.2, -1.4, 0.7]]) {
    box(0x4f7a34, vx, 3.02, vz, 0.7, 0.1, vw);
    box(0xc46ad0, vx + 0.1, 3.08, vz + 0.2, 0.15, 0.05, 0.15);
  }
  for (const pz of [-4.2, -1.0]) box(0x4f7a34, 5.3, 1.2, pz + 0.12, 0.26, 2.2, 0.08);
  box(0x9a8967, 4.95, 0.45, -2.6, 0.5, 0.08, 1.2);
  box(0x9a8967, 5.18, 0.75, -2.6, 0.06, 0.5, 1.2);

  // Hedges and cypresses around the sides and back
  for (let z = -5.2; z < 2.6; z += 0.9) shrub(kit, -5.15, 0.05, z, 0.7, z % 1.8 > 0.5 ? 0x4c7436 : 0x46702f);
  for (let x = -4.2; x < 4.4; x += 0.9) shrub(kit, x, 0.05, -5.2, 0.6);
  for (const cz2 of [-3.6, -0.4]) {
    box(0x3b5f2b, -4.95, 1.2, cz2, 0.6, 2.4, 0.6);
    box(0x3b5f2b, -4.95, 2.6, cz2, 0.4, 0.6, 0.4);
  }
  // Trash bins by the back door
  for (const bx of [1.0, 1.45]) cylinder(kit, 0x5f6b5a, bx, 0.35, -5.1, 0.18, 0.6, 8);

  archHeads(kit, glass, fanGlass);
  archHeads(kit, trim, fanTrim);
}
