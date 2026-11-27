import type { Kit } from "./kit";
import { bush, palm, rng, shapes, type Shapes, wall } from "./small-homes-parts";

const LOG = 0x6e5a42;
const TIMBER = 0x5a4330;
const DECK = 0xb28b60;
const BOARD_LINE = 0x8a6e4c;
const BAMBOO = [0xc9a96b, 0xb89355, 0xd4b77a];
const THATCH = 0xb38d4e;
const COURSES = [0xc9a463, 0xd6b878, 0xa8834a];
const FL = 1.5;

/** Hipped palm-thatch roof with the ridge along z, layered courses, hip bundles and a ragged fringe. */
function thatchRoof(sh: Shapes, cz: number, A: number, B: number, ye: number, yr: number) {
  const rise = yr - ye;
  const slope = rise / A;
  const phi = Math.atan(slope);
  const r0 = cz - (B - A), r1 = cz + (B - A);
  const E = (sx: number, sz: number) => [sx * A, ye, cz + sz * B];
  sh.quad(THATCH, E(1, -1), E(1, 1), [0, yr, r1], [0, yr, r0]);
  sh.quad(THATCH, E(-1, 1), E(-1, -1), [0, yr, r0], [0, yr, r1]);
  sh.tri(THATCH, E(-1, 1), E(1, 1), [0, yr, r1]);
  sh.tri(THATCH, E(1, -1), E(-1, -1), [0, yr, r0]);
  const courses = 7;
  const span = A / Math.cos(phi);
  const straw = rng(91);
  const shades = [...COURSES, 0xbf9a58];
  for (let k = 0; k < courses; k++) {
    const f = (k + 0.5) / courses;
    const inset = A * f;
    const y = ye + rise * f;
    const depth = span / courses + 0.1;
    const off = 0.07;
    for (const s of [-1, 1]) {
      for (const sideFace of [true, false]) {
        const len = sideFace ? 2 * (B - inset) + 0.1 : 2 * (A - inset) + 0.1;
        const n = Math.max(1, Math.ceil(len / 0.8));
        for (let i = 0; i < n; i++) {
          const along = -len / 2 + (i + 0.5) * len / n;
          const color = shades[Math.floor(straw() * shades.length)];
          const pitch = phi + 0.05 + straw() * 0.06;
          const o = off + straw() * 0.03;
          const piece = len / n + 0.04;
          if (sideFace) {
            sh.box(color, s * (A - inset + Math.sin(phi) * o), y + Math.cos(phi) * o, cz - s * along, piece, 0.12, depth, pitch, s * Math.PI / 2);
          } else {
            sh.box(color, along, y + Math.cos(phi) * o, cz + s * (B - inset + Math.sin(phi) * o), piece, 0.12, depth, pitch, s > 0 ? 0 : Math.PI);
          }
        }
      }
    }
  }
  // Hip and ridge bundles.
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const [ex, ey, ez] = E(sx, sz);
      const tx = 0, ty = yr, tz = sz > 0 ? r1 : r0;
      const vx = tx - ex, vy = ty - ey, vz = tz - ez;
      const len = Math.hypot(vx, vy, vz);
      sh.cyl(0x9c7a44, (ex + tx) / 2, (ey + ty) / 2 + 0.12, (ez + tz) / 2, 0.13, 0.17, len, 6, Math.acos(vy / len), Math.atan2(vx, vz));
    }
  }
  sh.cyl(0x9c7a44, 0, yr + 0.1, cz, 0.22, 0.22, r1 - r0 + 0.5, 8, Math.PI / 2);
  for (let z = r0 - 0.15; z <= r1 + 0.2; z += 0.35) sh.cyl(0x5a4330, 0, yr + 0.1, z, 0.24, 0.24, 0.07, 8, Math.PI / 2);
  for (const z of [r0 - 0.3, r1 + 0.3]) {
    sh.cyl(0x5a4330, 0, yr + 0.45, z, 0.03, 0.1, 0.75, 6);
    sh.ball(0x9c7a44, 0, yr + 0.15, z, 0.2, 0.14, 0.2);
  }
  // Ragged straw fringe hanging from the eaves.
  const random = rng(77);
  const fringe = (x: number, z: number, yaw: number) => {
    const h = 0.25 + random() * 0.25;
    sh.box(COURSES[Math.floor(random() * 3)], x, ye - h / 2 + 0.08, z, 0.11, h, 0.05, -phi * 0.35, yaw);
  };
  for (let x = -A + 0.06; x < A; x += 0.12) {
    fringe(x, cz + B + 0.02, 0);
    fringe(x, cz - B - 0.02, Math.PI);
  }
  for (let z = cz - B + 0.06; z < cz + B; z += 0.12) {
    fringe(A + 0.02, z, Math.PI / 2);
    fringe(-A - 0.02, z, -Math.PI / 2);
  }
  return (x: number, z: number) => ye + slope * Math.min(A - Math.abs(x), B - Math.abs(z - cz));
}

export function buildBungalow(kit: Kit) {
  const { box } = kit;
  const sh = shapes(kit);
  const random = rng(5);

  // Beach sand plot with a short boardwalk to the steps.
  box(0xe2d3a9, 0, 0.015, 0, 7.92, 0.03, 11.92);
  for (const [x, z, w, d] of [[-2, -2, 2.6, 3], [1.8, 3.2, 2, 1.6], [2.5, -4.5, 2.2, 2.4]]) box(0xd8c79a, x, 0.032, z, w, 0.01, d);
  for (let z = 5.3; z < 5.95; z += 0.22) box(z > 5.7 ? 0x9a8967 : DECK, 0, 0.06, z, 1.1, 0.06, 0.2, 0, (random() - 0.5) * 0.05);

  // House on stilts: body x [-2.4, 2.4], z [-4.2, 0]; front deck to z 4.0.
  const x0 = -2.4, x1 = 2.4, z0 = -4.2, z1 = 0, top = 4.4;
  const cz = (z0 + z1) / 2;
  const dz1 = 4.0, dx = 3.0;
  const stilts: [number, number][] = [];
  for (const x of [x0, 0, x1]) for (const z of [z0, cz, z1 - 0.15]) stilts.push([x, z]);
  for (const x of [-dx + 0.15, -0.75, 0.75, dx - 0.15]) for (const z of [1.9, dz1 - 0.15]) stilts.push([x, z]);
  for (const [x, z] of stilts) {
    sh.cyl(LOG, x, (FL - 0.2) / 2 + 0.1, z, 0.12, 0.14, FL - 0.2, 7);
    box(0xa8b5b8, x, 0.08, z, 0.38, 0.16, 0.38);
  }
  // Beams and joists under the platform.
  for (const z of [z0, cz, z1 - 0.15]) box(TIMBER, 0, FL - 0.28, z, x1 - x0 + 0.3, 0.2, 0.16);
  for (const z of [1.9, dz1 - 0.15]) box(TIMBER, 0, FL - 0.28, z, 2 * dx, 0.2, 0.16);
  for (let x = -dx + 0.15; x <= dx; x += 0.6) box(0x755b43, x, FL - 0.14, (z1 + dz1) / 2, 0.08, 0.12, dz1 - z1);
  // Cross bracing on the visible stilt rows.
  const brace = (ax: number, az: number, bx: number, bz: number) => {
    const len = Math.hypot(bx - ax, bz - az, FL - 0.6);
    const mx = (ax + bx) / 2, mz = (az + bz) / 2;
    const yaw = Math.atan2(bx - ax, bz - az);
    for (const s of [-1, 1]) {
      sh.box(LOG, mx, 0.75, mz, 0.06, 0.06, len, s * Math.atan2(FL - 0.6, Math.hypot(bx - ax, bz - az)), yaw);
    }
  };
  brace(-dx + 0.15, dz1 - 0.15, -0.75, dz1 - 0.15);
  brace(0.75, dz1 - 0.15, dx - 0.15, dz1 - 0.15);
  brace(x1, z1 - 0.15, x1, cz);
  brace(x1, cz, x1, z0);
  brace(dx - 0.15, 1.9, dx - 0.15, dz1 - 0.15);

  // Decking: house platform and front deck with plank seams.
  box(DECK, 0, FL - 0.08, cz, x1 - x0 + 0.3, 0.16, z1 - z0 + 0.3);
  box(DECK, 0, FL - 0.08, (z1 + dz1) / 2, 2 * dx, 0.16, dz1 - z1);
  for (let z = z1 + 0.1; z < dz1; z += 0.2) box(BOARD_LINE, 0, FL + 0.002, z, 2 * dx, 0.01, 0.02);
  box(0x755b43, 0, FL - 0.12, dz1 + 0.02, 2 * dx + 0.04, 0.22, 0.05);
  for (const s of [-1, 1]) box(0x755b43, s * (dx + 0.02), FL - 0.12, (z1 + dz1) / 2, 0.05, 0.22, dz1 - z1);
  box(0x755b43, x1 + 0.17, FL - 0.12, cz, 0.05, 0.22, z1 - z0 + 0.3);

  // Walls: timber frame infilled with vertical bamboo, lashed with rope bands.
  box(DECK, 0, (FL + top) / 2, cz, x1 - x0, top - FL, z1 - z0);
  const bamboo = (along: "x" | "z", fixed: number, from: number, to: number, out: number) => {
    let i = 0;
    for (let p = from + 0.08; p < to; p += 0.15, i++) {
      const c = BAMBOO[i % 3];
      if (along === "x") box(c, p, (FL + top) / 2, fixed + out * 0.04, 0.13, top - FL, 0.06);
      else box(c, fixed + out * 0.04, (FL + top) / 2, p, 0.06, top - FL, 0.13);
    }
    for (const y of [FL + 0.4, FL + 1.3, top - 0.35]) {
      if (along === "x") box(0x5a4330, (from + to) / 2, y, fixed + out * 0.08, to - from, 0.05, 0.03);
      else box(0x5a4330, fixed + out * 0.08, y, (from + to) / 2, 0.03, 0.05, to - from);
    }
  };
  bamboo("x", z1, x0, x1, 1);
  bamboo("x", z0, x0, x1, -1);
  bamboo("z", x1, z0, z1, 1);
  bamboo("z", x0, z0, z1, -1);
  for (const [x, z] of [[x0, z0], [x0, z1], [x1, z0], [x1, z1], [0, z1], [x1, cz], [0, z0], [x0, cz]]) {
    box(TIMBER, x, (FL + top) / 2, z, 0.2, top - FL, 0.2);
  }
  for (const s of [-1, 1]) {
    box(TIMBER, 0, top - 0.05, s > 0 ? z1 + 0.05 : z0 - 0.05, x1 - x0 + 0.25, 0.16, 0.14);
    box(TIMBER, s * (x1 + 0.05), top - 0.05, cz, 0.14, 0.16, z1 - z0 + 0.25);
    box(TIMBER, 0, FL + 0.07, s > 0 ? z1 + 0.06 : z0 - 0.06, x1 - x0, 0.14, 0.1);
    box(TIMBER, s * (x1 + 0.06), FL + 0.07, cz, 0.1, 0.14, z1 - z0);
  }

  // Openings: glazed French doors flung open, window openings with rolled blinds and propped shutters.
  const opening = (x: number, y: number, z: number, w: number, h: number, facing: number, propped: boolean) => {
    const f = wall(kit, sh, facing, x, z);
    f.litBox(0x1f1a15, 0, y, 0.09, w, h, 0.02);
    f.box(0xf4f0e6, -w / 2 + 0.08, y - 0.05, 0.11, 0.12, h - 0.1, 0.02);
    for (const s of [-1, 1]) f.box(TIMBER, s * (w / 2 + 0.06), y, 0.12, 0.12, h + 0.1, 0.08);
    f.box(TIMBER, 0, y - h / 2 - 0.05, 0.16, w + 0.3, 0.08, 0.2);
    f.box(TIMBER, 0, y + h / 2 + 0.06, 0.12, w + 0.3, 0.12, 0.08);
    const [rx, rz] = f.at(0, 0.2);
    sh.cyl(0xd8c08a, rx, y + h / 2 - 0.02, rz, 0.08, 0.08, w + 0.05, 8, 0, facing, Math.PI / 2);
    for (const s of [-1, 1]) f.box(0x8a6e4c, s * w * 0.35, y + h / 2 - 0.06, 0.29, 0.02, 0.16, 0.02);
    if (propped) {
      const tilt = 0.6;
      const reach = h * 0.85;
      const [px, pz] = f.at(0, 0.12 + Math.cos(tilt) * reach / 2);
      sh.box(BAMBOO[1], px, y + h / 2 + 0.1 + Math.sin(tilt) * reach / 2, pz, w + 0.1, 0.05, reach, -tilt, facing);
      const [sx, sz] = f.at(w / 2 - 0.05, 0.12 + Math.cos(tilt) * reach / 2);
      sh.box(LOG, sx, y + (Math.sin(tilt) * reach) / 2, sz, 0.04, h * 0.95, 0.04, 0.35, facing);
    }
  };
  opening(-1.65, FL + 1.35, z1, 0.95, 0.95, 0, false);
  opening(1.65, FL + 1.35, z1, 0.95, 0.95, 0, false);
  opening(x1, FL + 1.35, -0.95, 1.0, 0.95, Math.PI / 2, true);
  opening(x1, FL + 1.35, -3.15, 1.0, 0.95, Math.PI / 2, true);
  opening(x0, FL + 1.35, -2.1, 1.0, 0.95, -Math.PI / 2, false);
  opening(-1.2, FL + 1.35, z0, 1.0, 0.95, Math.PI, false);
  opening(1.2, FL + 1.35, z0, 1.0, 0.95, Math.PI, true);
  {
    const dw = 1.5, dh = 2.3;
    box(0x1f1a15, 0, FL + dh / 2, z1 + 0.09, dw, dh, 0.02);
    for (const s of [-1, 1]) box(0xf4f0e6, s * 0.55, FL + dh / 2, z1 + 0.11, 0.3, dh - 0.1, 0.02);
    for (const s of [-1, 1]) box(TIMBER, s * (dw / 2 + 0.07), FL + dh / 2, z1 + 0.12, 0.14, dh, 0.1);
    box(TIMBER, 0, FL + dh + 0.07, z1 + 0.12, dw + 0.28, 0.14, 0.1);
    const swing = 1.75;
    for (const s of [-1, 1]) {
      const hx = s * dw / 2;
      const dirX = -s * Math.cos(swing), dirZ = Math.sin(swing);
      const yaw = Math.atan2(-dirZ, dirX);
      const lx = hx + dirX * dw / 4, lz = z1 + 0.15 + dirZ * dw / 4;
      const leaf = wall(kit, sh, yaw, lx, lz);
      leaf.box(TIMBER, 0, FL + dh / 2, 0, dw / 2 - 0.02, dh - 0.04, 0.06);
      leaf.litBox(0x6f9aa0, 0, FL + dh / 2 + 0.15, 0, dw / 2 - 0.18, dh - 0.5, 0.07);
      for (const y of [-0.35, 0.25, 0.75]) leaf.box(TIMBER, 0, FL + dh / 2 + y, 0, dw / 2 - 0.1, 0.05, 0.08);
      leaf.box(TIMBER, 0, FL + dh / 2 + 0.15, 0, 0.05, dh - 0.5, 0.08);
    }
    box(0xc2452f, 0, FL + 0.01, z1 + 0.55, 0.9, 0.02, 0.5);
    box(0x2c2a27, 0.95, FL + 2.0, z1 + 0.35, 0.03, 0.45, 0.03);
    kit.litBox(0xf2d27a, 0.95, FL + 1.72, z1 + 0.35, 0.16, 0.22, 0.16);
    box(0x2c2a27, 0.95, FL + 1.86, z1 + 0.35, 0.22, 0.05, 0.22);
  }

  // Thatched hip roof over the house and veranda.
  const roofAt = thatchRoof(sh, -0.8, 3.55, 4.15, 4.3, 7.4);

  // Veranda posts, beam, string lights.
  const postZ = 2.8;
  const posts = [-dx + 0.15, -0.9, 0.9, dx - 0.15];
  const beamY = roofAt(dx - 0.15, postZ) - 0.12;
  for (const x of posts) {
    sh.cyl(LOG, x, (FL + beamY) / 2, postZ, 0.11, 0.12, beamY - FL, 7);
    sh.cyl(0x5a4330, x, beamY - 0.3, postZ, 0.13, 0.13, 0.06, 7);
  }
  for (const s of [-1, 1]) sh.cyl(LOG, s * (dx - 0.15), (FL + beamY) / 2, 0.15, 0.11, 0.12, beamY - FL, 7);
  box(TIMBER, 0, beamY, postZ, 2 * dx, 0.18, 0.16);
  for (const s of [-1, 1]) box(TIMBER, s * (dx - 0.15), beamY, (postZ + 0.15) / 2, 0.14, 0.16, postZ);
  for (let x = -dx + 0.35; x < dx - 0.2; x += 0.42) {
    const sag = 0.12 * Math.sin(((x + dx) / (2 * dx)) * Math.PI * 4) ** 2;
    box(0x2c2a27, x, beamY - 0.12 - sag, postZ + 0.06, 0.42, 0.01, 0.01);
    sh.ball([0xf2d27a, 0xf0a04a, 0xf4f0e6][Math.floor(random() * 3)], x, beamY - 0.2 - sag, postZ + 0.06, 0.06);
  }

  // Bamboo railings around the deck, leaving the stair gap.
  const rail = (ax: number, az: number, bx: number, bz: number) => {
    const len = Math.hypot(bx - ax, bz - az);
    const along = Math.abs(bx - ax) > Math.abs(bz - az);
    for (const [y, r] of [[FL + 0.9, 0.06], [FL + 0.55, 0.025], [FL + 0.25, 0.025]]) {
      sh.cyl(r > 0.03 ? BAMBOO[1] : 0xd8c08a, (ax + bx) / 2, y, (az + bz) / 2, r, r, len, 6, along ? 0 : Math.PI / 2, 0, along ? Math.PI / 2 : 0);
    }
    const n = Math.max(1, Math.round(len / 0.9));
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      box(BAMBOO[0], ax + (bx - ax) * t, FL + 0.47, az + (bz - az) * t, 0.08, 0.94, 0.08);
    }
  };
  rail(-dx + 0.05, dz1 - 0.05, -0.68, dz1 - 0.05);
  rail(0.68, dz1 - 0.05, dx - 0.05, dz1 - 0.05);
  rail(dx - 0.05, z1 + 0.25, dx - 0.05, dz1 - 0.05);
  rail(-dx + 0.05, z1 + 0.25, -dx + 0.05, dz1 - 0.05);

  // Striped hammock slung along the west side of the veranda.
  {
    const hx = -dx + 0.55;
    const za = 0.4, zb = postZ - 0.15;
    const n = 9;
    const stripes = [0xd6354a, 0xf0c33c, 0x3f8fb5, 0x6aa84a, 0xf4f0e6];
    const hy = (t: number) => FL + 1.0 - 0.55 * Math.sin(t * Math.PI);
    for (let i = 0; i < n; i++) {
      const ta = i / n, tb = (i + 1) / n;
      const ya = hy(ta), yb = hy(tb);
      const za2 = za + (zb - za) * ta, zb2 = za + (zb - za) * tb;
      const len = Math.hypot(zb2 - za2, yb - ya);
      box(stripes[i % stripes.length], hx, (ya + yb) / 2, (za2 + zb2) / 2, 0.75, 0.03, len + 0.02, Math.atan2(ya - yb, zb2 - za2));
      box(stripes[(i + 2) % stripes.length], hx - 0.39, (ya + yb) / 2 + 0.05, (za2 + zb2) / 2, 0.03, 0.12, len, Math.atan2(ya - yb, zb2 - za2));
      box(stripes[(i + 2) % stripes.length], hx + 0.39, (ya + yb) / 2 + 0.05, (za2 + zb2) / 2, 0.03, 0.12, len, Math.atan2(ya - yb, zb2 - za2));
    }
    for (const [z, pz] of [[za, 0.15], [zb, postZ]]) {
      box(0x755b43, hx, hy(z === za ? 0 : 1) + 0.03, z, 0.85, 0.05, 0.05);
      const ropeLen = Math.hypot(pz - z, 0.7);
      box(0xd8c08a, hx, hy(0) + 0.35, (z + pz) / 2, 0.02, ropeLen, 0.02, Math.atan2(pz - z, 0.7) * -1);
    }
    box(0xf4f0e6, hx, hy(0.2) + 0.12, za + (zb - za) * 0.2, 0.5, 0.12, 0.3, 0.3);
  }

  // Sun deck: two loungers with towels, side table with coconut drinks, a parasol.
  const lounger = (x: number, color: number) => {
    const z = 3.35;
    for (const s of [-1, 1]) {
      box(0x755b43, x + s * 0.28, FL + 0.32, z, 0.05, 0.05, 1.15);
      for (const dz of [-0.5, 0.5]) box(0x755b43, x + s * 0.28, FL + 0.16, z + dz, 0.05, 0.32, 0.05);
    }
    for (let i = 0; i < 6; i++) box(DECK, x, FL + 0.36, z - 0.05 + i * 0.12, 0.6, 0.04, 0.09);
    box(DECK, x, FL + 0.62, z - 0.5, 0.6, 0.05, 0.62, -1.0);
    box(color, x, FL + 0.41, z + 0.25, 0.52, 0.06, 0.62);
    box(color, x, FL + 0.66, z - 0.47, 0.52, 0.05, 0.55, -1.0);
    box(0xf4f0e6, x, FL + 0.48, z - 0.03, 0.4, 0.08, 0.16);
  };
  lounger(-2.1, 0x3f8fb5);
  lounger(2.1, 0xd6354a);
  sh.cyl(0x755b43, 1.35, FL + 0.42, 3.4, 0.22, 0.22, 0.04, 10);
  sh.cyl(0x755b43, 1.35, FL + 0.21, 3.4, 0.04, 0.04, 0.42, 6);
  for (const [ox, oz] of [[-0.08, 0], [0.09, 0.06]]) {
    sh.ball(0x6e4b2a, 1.35 + ox, FL + 0.53, 3.4 + oz, 0.08);
    box(0xd6354a, 1.35 + ox + 0.02, FL + 0.65, 3.4 + oz, 0.015, 0.15, 0.015, 0.3);
  }
  sh.cyl(0xe8e2d0, -1.3, FL + 1.1, 3.35, 0.03, 0.03, 2.2, 6);
  sh.cyl(0xd6354a, -1.3, FL + 2.05, 3.35, 0.03, 0.95, 0.38, 8, 0, 0.39);
  sh.cyl(0xf4f0e6, -1.3, FL + 2.06, 3.35, 0.03, 0.55, 0.22, 8, 0, 0.0);
  box(0xf0c33c, 0.5 * dx + 0.2, FL + 0.8, dz1 - 0.05, 0.55, 0.65, 0.04);
  box(0xd6354a, 0.5 * dx + 0.2, FL + 0.7, dz1 - 0.03, 0.55, 0.08, 0.04);
  // Potted tropical plants on the veranda.
  for (const [x, z] of [[dx - 0.45, 0.45], [-0.95, 0.45]]) {
    sh.cyl(0xa6573b, x, FL + 0.2, z, 0.2, 0.15, 0.4, 8);
    for (let i = 0; i < 5; i++) {
      const yaw = i * 1.26 + x;
      sh.box(i % 2 ? 0x3f7a35 : 0x4f8c3c, x + Math.sin(yaw) * 0.2, FL + 0.65, z + Math.cos(yaw) * 0.2, 0.28, 0.02, 0.45, -0.55, yaw);
    }
  }
  // Surfboard leaning against the east wall.
  sh.ball(0xf0c33c, x1 + 0.55, FL + 1.05, -2.1, 0.24, 1.0, 0.05, Math.PI / 2);
  box(0x3f8fb5, x1 + 0.55, FL + 1.05, -2.1, 0.025, 1.6, 0.06);

  // Stairs down to the beach with stringers, handrails and tiki torches.
  const steps = 5;
  for (let i = 1; i < steps; i++) {
    const y = FL - i * (FL / steps);
    const z = dz1 + (i - 0.5) * 0.3;
    box(DECK, 0, y - 0.04, z, 1.2, 0.08, 0.3);
    box(BOARD_LINE, 0, y - 0.085, z + 0.14, 1.2, 0.01, 0.02);
  }
  const stairRun = (steps - 1) * 0.3 + 0.1;
  const stringer = Math.hypot(stairRun, FL);
  const stairPitch = Math.atan2(FL, stairRun);
  for (const s of [-1, 1]) {
    box(0x755b43, s * 0.64, FL / 2, dz1 + stairRun / 2, 0.07, 0.22, stringer, stairPitch);
    sh.cyl(BAMBOO[1], s * 0.66, FL / 2 + 0.9, dz1 + stairRun / 2, 0.04, 0.04, stringer, 6, Math.PI / 2 - stairPitch);
    box(BAMBOO[0], s * 0.66, 0.5, dz1 + stairRun, 0.08, 1.0, 0.08);
    sh.cyl(0x6e5a42, s * 1.0, 0.85, 5.55, 0.035, 0.05, 1.7, 6);
    sh.cyl(0x5a4330, s * 1.0, 1.75, 5.55, 0.09, 0.06, 0.2, 6);
    sh.cyl(0xf0a04a, s * 1.0, 1.95, 5.55, 0.01, 0.08, 0.22, 6);
    sh.cyl(0xf2d27a, s * 1.0, 1.92, 5.55, 0.01, 0.05, 0.14, 6);
  }

  // Under-house storage: a canoe with a paddle.
  sh.ball(0xc2452f, 1.15, 0.28, -2.0, 0.32, 0.2, 1.45);
  sh.ball(0xf4f0e6, 1.15, 0.33, -2.0, 0.25, 0.08, 1.2);
  box(0x755b43, 0.65, 0.07, -2.0, 0.06, 0.04, 1.5, 0, 0.15);
  box(0x755b43, 0.62, 0.07, -1.25, 0.16, 0.03, 0.3, 0, 0.15);

  // Palms, ferns and beach plants around the plot.
  palm(sh, -3.4, -5.55, -2.45, -4.35, 8.2, 0x8a7656, 0x5f9e45, 0x3f7a35, 13, 1.5);
  palm(sh, -3.45, 5.5, -2.55, 4.5, 6.6, 0x8a7656, 0x6aa84a, 0x4f8c3c, 21, 1.4);
  palm(sh, 3.45, -5.5, 2.65, -4.6, 5.4, 0x8a7656, 0x5f9e45, 0x4f8c3c, 31, 1.2);
  for (const [x, z, r, f] of [[3.2, 1.4, 0.45, 0xe86fa0], [3.3, 4.9, 0.4, undefined], [-3.3, 1.2, 0.42, 0xf0c33c], [1.9, 5.3, 0.35, 0xd6354a], [-1.7, 5.4, 0.35, undefined], [3.35, -2.9, 0.4, undefined]] as const) {
    bush(sh, x, z, r, 0x5d9a43, 0x3f7a35, f, x * 17 + z);
  }
  for (let i = 0; i < 14; i++) {
    const x = (random() - 0.5) * 7.4;
    const z = (random() - 0.5) * 11.2;
    if (Math.abs(x) < 3.1 && z > -4.6 && z < 5.4) continue;
    for (let k = 0; k < 3; k++) box(0x8aa64a, x + k * 0.05, 0.14, z, 0.03, 0.28, 0.03, (k - 1) * 0.35, k);
  }
  for (const [x, z] of [[2.6, 5.6], [-2.9, -0.5]]) sh.ball(0xf4f0e6, x, 0.05, z, 0.09, 0.05, 0.07);

  sh.flush();
}
