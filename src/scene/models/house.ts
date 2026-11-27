import type { Kit } from "./kit";
import {
  barrel, bush, door, gableRoof, laundry, picketFence, rng, shapes, shutteredWindow, slope, wall, type WindowStyle,
} from "./small-homes-parts";

const WALL = 0x537a9a;
const SIDING = 0x41667f;
const TRIM = 0xf2efe6;
const SHUTTER = 0xe9b949;
const SLAT = 0xc99a35;
const DOOR = 0xc2452f;
const ROOF = 0xb35e3f;
const STONE = 0x92908a;

export function buildHouse(kit: Kit) {
  const { box } = kit;
  const sh = shapes(kit);
  const random = rng(41);

  // Body: x [-3.1, 3.1], z [-4.4, 1.6]; raised plinth to 0.5, one storey to 3.7.
  const x0 = -3.1, x1 = 3.1, z0 = -4.4, z1 = 1.6, base = 0.5, top = 3.7;
  const cx = 0, cz = (z0 + z1) / 2, w = x1 - x0, d = z1 - z0;

  // Yard ground: lawn-worn soil, concrete walk and a back patio.
  box(0x8a7550, 0, 0.012, 5.0, 0.01, 0.01, 0.01);
  box(0xc9c3b2, 0, 0.03, 5.38, 1.2, 0.06, 0.95);
  for (let z = 5.0; z < 5.85; z += 0.3) box(0x9d978a, 0, 0.065, z, 1.2, 0.01, 0.02);
  box(0xc9c3b2, 1.5, 0.03, -5.15, 1.4, 0.06, 0.9);

  // Plinth with vent grilles and a painted band.
  box(STONE, cx, base / 2, cz, w + 0.16, base, d + 0.16);
  box(0xded8c0, cx, base - 0.03, cz, w + 0.22, 0.06, d + 0.22);
  for (const x of [-2.2, 2.2]) {
    box(0x2c2a27, x, 0.25, z1 + 0.085, 0.4, 0.2, 0.01);
    for (const dx of [-0.12, 0, 0.12]) box(STONE, x + dx, 0.25, z1 + 0.09, 0.03, 0.2, 0.01);
  }
  for (const z of [-3.2, -0.2]) {
    box(0x2c2a27, x1 + 0.085, 0.25, z, 0.01, 0.2, 0.4);
    for (const dz of [-0.12, 0, 0.12]) box(STONE, x1 + 0.09, 0.25, z + dz, 0.01, 0.2, 0.03);
  }

  // Clapboard walls: core, siding shadow lines, corner boards, frieze and skirt.
  box(WALL, cx, (base + top) / 2, cz, w, top - base, d);
  for (let y = base + 0.22; y < top - 0.2; y += 0.24) {
    box(SIDING, cx, y, z1 + 0.012, w, 0.035, 0.025);
    box(SIDING, cx, y, z0 - 0.012, w, 0.035, 0.025);
    box(SIDING, x1 + 0.012, y, cz, 0.025, 0.035, d);
    box(SIDING, x0 - 0.012, y, cz, 0.025, 0.035, d);
  }
  for (const [qx, qz] of [[x0, z0], [x0, z1], [x1, z0], [x1, z1]]) box(TRIM, qx, (base + top) / 2, qz, 0.24, top - base, 0.24);
  box(TRIM, cx, top - 0.1, z1 + 0.04, w + 0.1, 0.22, 0.08);
  box(TRIM, cx, top - 0.1, z0 - 0.04, w + 0.1, 0.22, 0.08);
  box(TRIM, x1 + 0.04, top - 0.1, cz, 0.08, 0.22, d + 0.1);
  box(TRIM, x0 - 0.04, top - 0.1, cz, 0.08, 0.22, d + 0.1);
  box(TRIM, cx, base + 0.1, z1 + 0.035, w + 0.1, 0.18, 0.07);
  box(TRIM, cx, base + 0.1, z0 - 0.035, w + 0.1, 0.18, 0.07);
  box(TRIM, x1 + 0.035, base + 0.1, cz, 0.07, 0.18, d + 0.1);
  box(TRIM, x0 - 0.035, base + 0.1, cz, 0.07, 0.18, d + 0.1);
  // Sun-faded and repainted boards.
  for (const [y, x, wd] of [[1.18, -2.4, 1.1], [3.1, 1.2, 1.5], [2.62, -0.95, 0.6]]) box(0x6a90ad, x, y, z1 + 0.02, wd, 0.2, 0.02);
  for (const [y, z, wd] of [[1.42, -1.8, 1.2], [3.34, -3.6, 0.9], [0.95, 0.9, 0.7]]) box(0x6a90ad, x1 + 0.02, y, z, 0.02, 0.2, wd);

  // Gabled tile roof with gutters, ridge cap, gable vents and clapboard gable ends.
  const roof = gableRoof(kit, sh, {
    x: cx, z: cz, w, d, top, rise: 2.3, overX: 0.45, overZ: 0.5,
    roof: ROOF, row: 0x93492f, ridge: 0x7d3524, fascia: TRIM, fill: WALL, line: SIDING, vent: TRIM, gutter: 0xe3ddce,
  });
  for (let x = x0 - 0.2; x <= x1 + 0.2; x += 0.6) {
    for (const s of [-1, 1]) box(0xe3ddce, x, roof.eaveY + 0.14, cz + s * (d / 2 + 0.24), 0.09, 0.12, 0.5, s * Math.atan(roof.k));
  }
  const back = slope(kit, cz - roof.H, roof.eaveY, cz, roof.ridgeY);
  const front = slope(kit, cz, roof.ridgeY, cz + roof.H, roof.eaveY);
  for (const [x, t] of [[-2.2, 0.45], [0.6, 0.3], [2.5, 0.7], [-0.7, 0.8]]) front.box(0xa6573b, x, t, roof.th + 0.06, 0.34, 0.04, 0.3);
  for (const [x, t] of [[1.6, 0.5], [-1.2, 0.2]]) front.box(0x9a4a33, x, t, roof.th + 0.055, 0.6, 0.01, 0.5);
  // Brick chimney on the back slope, a vent stack and a TV aerial on the ridge.
  const chZ = -2.7;
  const chBase = back.point((chZ - (cz - roof.H)) / roof.H)[0];
  box(0xa0583c, -1.9, (chBase - 0.4 + 6.85) / 2, chZ, 0.62, 6.85 - chBase + 0.4, 0.62);
  for (let y = chBase; y < 6.8; y += 0.22) {
    box(0xd8cbb0, -1.9, y, chZ + 0.315, 0.62, 0.025, 0.01);
    box(0xd8cbb0, -1.9 + 0.315, y, chZ, 0.01, 0.025, 0.62);
  }
  box(TRIM, -1.9, 6.9, chZ, 0.8, 0.12, 0.8);
  box(0x343b3c, -1.9, 6.97, chZ, 0.4, 0.04, 0.4);
  for (const dx of [-0.13, 0.13]) sh.cyl(0xa6573b, -1.9 + dx, 7.12, chZ, 0.08, 0.1, 0.3, 8);
  box(0x6f6d68, -1.9, chBase + 0.02, chZ + 0.34, 0.75, 0.05, 0.14, front.theta * -1);
  const ventZ = -0.4;
  const ventY = front.point((ventZ - cz) / roof.H)[0];
  sh.cyl(0x737b77, 1.7, ventY + 0.25, ventZ, 0.09, 0.09, 0.6, 8);
  sh.cyl(0x737b77, 1.7, ventY + 0.6, ventZ, 0.02, 0.17, 0.12, 8);
  box(0x2c2a27, 2.6, roof.ridgeY + 0.85, cz, 0.04, 1.6, 0.04);
  for (const [y, l] of [[1.35, 0.9], [1.1, 0.7], [0.85, 0.5]]) box(0x8d9496, 2.6, roof.ridgeY + y, cz, 0.03, 0.03, l);
  box(0x8d9496, 2.6, roof.ridgeY + 1.25, cz, 0.6, 0.03, 0.03);

  // Front porch: deck on a lattice skirt, turned posts, gingerbread trim, balustrade, tiled shed roof and steps.
  const pz1 = 4.0, px = 2.95;
  box(0xb28b60, 0, base - 0.08, (z1 + pz1) / 2, 2 * px + 0.1, 0.16, pz1 - z1);
  for (let x = -px; x < px; x += 0.2) box(0x8a6e4c, x, base + 0.002, (z1 + pz1) / 2, 0.02, 0.01, pz1 - z1);
  box(TRIM, 0, base - 0.1, pz1 + 0.03, 2 * px + 0.14, 0.2, 0.06);
  for (const s of [-1, 1]) box(TRIM, s * (px + 0.07), base - 0.1, (z1 + pz1) / 2, 0.06, 0.2, pz1 - z1);
  const skirt = wall(kit, sh, 0, 0, pz1 + 0.01);
  box(0x3a2f26, 0, 0.21, pz1 - 0.02, 2 * px, 0.42, 0.02);
  for (let u = -px + 0.15; u < px; u += 0.3) {
    for (const r of [-0.78, 0.78]) skirt.slant(TRIM, u, 0.21, 0, 0.04, 0.52, 0.02, r);
  }
  for (const s of [-1, 1]) {
    const side = wall(kit, sh, s * Math.PI / 2, s * (px + 0.06), (z1 + pz1) / 2);
    box(0x3a2f26, s * (px + 0.03), 0.21, (z1 + pz1) / 2, 0.02, 0.42, pz1 - z1);
    for (let u = -(pz1 - z1) / 2 + 0.15; u < (pz1 - z1) / 2; u += 0.3) {
      for (const r of [-0.78, 0.78]) side.slant(TRIM, u, 0.21, 0, 0.04, 0.52, 0.02, r);
    }
  }
  const pr = slope(kit, z1, 3.1, pz1 + 0.2, 2.74);
  const postZ = pz1 - 0.15;
  const beamY = pr.point((postZ - z1) / (pz1 + 0.2 - z1))[0] - 0.12;
  const posts = [-px + 0.1, -0.85, 0.85, px - 0.1];
  for (const x of posts) {
    box(TRIM, x, (base + beamY) / 2, postZ, 0.15, beamY - base, 0.15);
    for (const y of [base + 0.12, base + 0.95, beamY - 0.35]) box(TRIM, x, y, postZ, 0.22, 0.12, 0.22);
    sh.ball(TRIM, x, base + 0.62, postZ, 0.12, 0.2, 0.12);
    const bracket = wall(kit, sh, 0, x, postZ);
    for (const s of [-1, 1]) if (Math.abs(x + s * 0.3) < px) bracket.slant(TRIM, s * 0.2, beamY - 0.22, 0, 0.05, 0.5, 0.05, -s * 0.785);
  }
  box(TRIM, 0, beamY, postZ, 2 * px + 0.1, 0.18, 0.18);
  for (const s of [-1, 1]) box(TRIM, s * (px - 0.1), beamY, (z1 + postZ) / 2, 0.15, 0.15, postZ - z1);
  for (let x = -px + 0.25; x < px - 0.1; x += 0.24) {
    box(TRIM, x, beamY - 0.14, postZ + 0.04, 0.05, 0.12, 0.03);
    box(TRIM, x, beamY - 0.22, postZ + 0.04, 0.09, 0.05, 0.03);
  }
  pr.box(ROOF, 0, 0.5, 0.06, 2 * px + 0.4, 0.12, pr.len);
  for (let i = 1; i <= 6; i++) pr.box(0x93492f, 0, i / 6 - 0.04, 0.14, 2 * px + 0.4, 0.06, 0.1);
  for (let dx = -px; dx <= px + 0.1; dx += 0.34) pr.box(0x93492f, dx, 0.5, 0.14, 0.07, 0.05, pr.len);
  for (const s of [-1, 1]) pr.box(TRIM, s * (px + 0.22), 0.5, 0.04, 0.06, 0.2, pr.len);
  {
    const [y, z] = pr.point(1, -0.05);
    box(TRIM, 0, y - 0.05, z, 2 * px + 0.44, 0.18, 0.06);
  }
  const rail = (ax: number, az: number, bx: number, bz: number) => {
    const len = Math.hypot(bx - ax, bz - az);
    const along = Math.abs(bx - ax) > Math.abs(bz - az);
    for (const [y, h] of [[base + 0.9, 0.09], [base + 0.16, 0.07]]) box(TRIM, (ax + bx) / 2, y, (az + bz) / 2, along ? len : 0.12, h, along ? 0.12 : len);
    const n = Math.floor(len / 0.16);
    for (let i = 1; i < n; i++) {
      const t = i / n;
      box(0xe3ddce, ax + (bx - ax) * t, base + 0.53, az + (bz - az) * t, 0.06, 0.68, 0.06);
    }
  };
  rail(posts[0], postZ, posts[1], postZ);
  rail(posts[2], postZ, posts[3], postZ);
  rail(posts[0], z1 + 0.1, posts[0], postZ);
  rail(posts[3], z1 + 0.1, posts[3], postZ);
  for (let i = 0; i < 4; i++) {
    const h = base - i * 0.125;
    box(i === 0 ? 0xb28b60 : 0xc9c3b2, 0, h / 2, pz1 + 0.15 + i * 0.28 - 0.15, 1.5, h, 0.28);
    box(0x8a6e4c, 0, h + 0.003, pz1 + 0.02 + i * 0.28 - 0.15, 1.5, 0.01, 0.03);
  }
  for (const s of [-1, 1]) {
    const sx = s * 0.78;
    box(TRIM, sx, 0.55, pz1 + 0.85, 0.12, 1.1, 0.12);
    box(TRIM, sx, 0.75, pz1 + 0.45, 0.08, 0.08, 0.9, -0.55);
    sh.cyl(0xa6573b, s * 0.55, 0.6, pz1 + 0.1, 0.17, 0.13, 0.28, 8);
    bush(sh, s * 0.55, pz1 + 0.1, 0.2, 0x5d9a43, 0x3f7a35, s > 0 ? 0xe86fa0 : 0xf0c33c, 30 + s);
  }

  // Front door with transom, sidelight trim and doormat; shuttered windows with flower boxes.
  door(kit, sh, 0, base, z1, 1.0, 2.25, 0, { leaf: DOOR, frame: TRIM, panel: 0xa83a28, knob: 0xd9b04a, glass: 0x4d6a6a });
  box(0x7d6b55, 0, base + 0.01, z1 + 0.5, 1.0, 0.02, 0.55);
  box(0x2c2a27, 0.65, 1.95, z1 + 0.04, 0.2, 0.12, 0.02);
  const style: WindowStyle = { frame: TRIM, glass: 0x4d6a6a, muntin: TRIM, sill: TRIM, shutter: SHUTTER, slat: SLAT, gap: 0.05 };
  const flowery: WindowStyle = { ...style, flowers: [0xd6354a, 0xf4f0e6, 0xe86fa0, 0xf0c33c], planter: 0x755b43 };
  for (const x of [-1.9, 1.9]) shutteredWindow(kit, sh, x, 2.05, z1, 1.0, 1.35, 0, flowery);
  shutteredWindow(kit, sh, x1, 2.05, 0.0, 1.0, 1.35, Math.PI / 2, flowery);
  shutteredWindow(kit, sh, x1, 2.05, -2.9, 1.0, 1.35, Math.PI / 2, style);
  shutteredWindow(kit, sh, x1, 2.65, -1.45, 0.55, 0.55, Math.PI / 2, { frame: TRIM, glass: 0xb8c8c4, muntin: TRIM, sill: TRIM });
  for (const z of [0.0, -2.9]) shutteredWindow(kit, sh, x0, 2.05, z, 1.0, 1.35, -Math.PI / 2, style);
  shutteredWindow(kit, sh, -1.9, 2.05, z0, 1.0, 1.35, Math.PI, style);
  shutteredWindow(kit, sh, -0.2, 2.25, z0, 0.8, 0.9, Math.PI, { ...style, closed: true });
  door(kit, sh, 1.5, base, z0, 0.9, 2.2, Math.PI, { leaf: 0x668374, frame: TRIM, knob: 0xd9b04a });
  for (let i = 0; i < 2; i++) box(0xc9c3b2, 1.5, (base - i * 0.25) / 2, z0 - 0.2 - i * 0.3, 1.2, base - i * 0.25, 0.3);

  // East wall service details: electric meter, hose bib with coiled hose.
  box(0x8d9496, x1 + 0.08, 1.45, -0.9, 0.12, 0.4, 0.3);
  sh.cyl(0xe8e2d0, x1 + 0.15, 1.5, -0.9, 0.08, 0.08, 0.03, 10, 0, 0, Math.PI / 2);
  box(0x3a3a38, x1 + 0.04, 2.5, -0.9, 0.04, 1.6, 0.04);
  box(0xc9a24a, x1 + 0.08, 0.75, -2.2, 0.1, 0.06, 0.06);
  for (let i = 0; i < 3; i++) sh.torus(0x3f8f45, x1 + 0.1, 0.55 - i * 0.03, -2.2, 0.2 - i * 0.02, 0.025, 0, Math.PI / 2);

  // Downspouts on the corners.
  for (const [sx, sz] of [[1, 1], [-1, 1], [1, -1]]) {
    const dsx = sx * 3.45;
    const dsz = cz + sz * (roof.H + 0.14);
    box(0xe3ddce, dsx, roof.eaveY / 2 - 0.05, dsz, 0.11, roof.eaveY - 0.25, 0.11);
    box(0xe3ddce, dsx, 0.12, dsz + sz * 0.15, 0.11, 0.08, 0.35);
    box(0xc9c3b2, dsx, 0.03, dsz + sz * 0.38, 0.25, 0.04, 0.35);
  }

  // Porch furniture: rocking chair, side table, hanging baskets.
  {
    const rx = -2.2, rz = 2.6;
    for (const s of [-1, 1]) {
      box(0x755b43, rx + s * 0.25, base + 0.06, rz, 0.05, 0.06, 0.8);
      box(0x755b43, rx + s * 0.25, base + 0.3, rz - 0.15, 0.05, 0.5, 0.05);
      box(0x755b43, rx + s * 0.25, base + 0.3, rz + 0.15, 0.05, 0.5, 0.05);
      box(0x755b43, rx + s * 0.25, base + 0.72, rz + 0.05, 0.05, 0.05, 0.45);
    }
    box(0x8a6e4c, rx, base + 0.5, rz, 0.55, 0.06, 0.5);
    box(0x8a6e4c, rx, base + 0.95, rz - 0.25, 0.55, 0.8, 0.05, -0.12);
    box(0xd6354a, rx, base + 0.56, rz + 0.02, 0.45, 0.06, 0.42);
    sh.cyl(0x755b43, -1.55, base + 0.3, 2.6, 0.2, 0.2, 0.04, 10);
    sh.cyl(0x755b43, -1.55, base + 0.15, 2.6, 0.03, 0.03, 0.3, 6);
    sh.cyl(0xe8e2d0, -1.55, base + 0.38, 2.6, 0.05, 0.04, 0.12, 8);
  }
  for (const x of [-1.9, 1.9]) {
    box(0x2c2a27, x, beamY - 0.35, postZ - 0.35, 0.015, 0.5, 0.015);
    sh.cyl(0x755b43, x, beamY - 0.65, postZ - 0.35, 0.18, 0.12, 0.16, 8);
    sh.ball(0x4f8c3c, x, beamY - 0.62, postZ - 0.35, 0.24, 0.16, 0.24, x);
  }

  // Front yard: flamboyant tree, hibiscus bed, mailbox, foundation shrubs, picket fence with gate gap.
  sh.cyl(0x6e5a42, -2.85, 1.15, 4.95, 0.13, 0.18, 2.3, 7);
  for (const [yaw, pitch] of [[0.4, 0.7], [2.4, 0.8], [4.3, 0.6]]) {
    sh.cyl(0x6e5a42, -2.85 + Math.sin(yaw) * 0.3, 2.45, 4.95 + Math.cos(yaw) * 0.3, 0.06, 0.09, 0.9, 6, pitch, yaw);
  }
  sh.ball(0x3f7a35, -2.85, 3.0, 4.95, 1.0, 0.42, 0.95);
  for (const [dx, dz, r] of [[0.45, 0.2, 0.55], [-0.4, -0.3, 0.6], [0.1, -0.5, 0.5], [-0.35, 0.45, 0.5]]) {
    sh.ball(0x4f8c3c, -2.85 + dx, 3.25, 4.95 + dz, r, 0.3, r, dx);
  }
  for (let i = 0; i < 16; i++) {
    const a = random() * Math.PI * 2;
    const r = 0.3 + random() * 0.6;
    sh.ball(i % 3 ? 0xd8432c : 0xef7a2a, -2.85 + Math.cos(a) * r, 3.3 + random() * 0.25, 4.95 + Math.sin(a) * r * 0.9, 0.13, 0.08, 0.13);
  }
  box(0x9a8967, 2.45, 0.05, 4.85, 2.2, 0.1, 1.0);
  box(0x72583b, 2.45, 0.06, 4.85, 2.05, 0.1, 0.85);
  for (const [x, f] of [[1.7, 0xd6354a], [2.4, 0xe86fa0], [3.1, 0xd6354a], [2.05, 0xf0c33c]] as const) {
    bush(sh, x, x === 2.05 ? 5.05 : 4.75, 0.33, 0x5d9a43, 0x3f7a35, f, x * 13);
  }
  for (const x of [-2.4, -1.6, 1.6, 2.4]) bush(sh, x, 4.25, 0.25, 0x4f8c3c, 0x3f7a35, undefined, x * 5);
  box(0x755b43, 1.0, 0.55, 5.55, 0.08, 1.1, 0.08);
  box(0x2f6b8f, 1.0, 1.18, 5.55, 0.28, 0.22, 0.45);
  sh.cyl(0x2f6b8f, 1.0, 1.29, 5.55, 0.14, 0.14, 0.45, 8, Math.PI / 2);
  box(0xc2452f, 1.16, 1.32, 5.45, 0.02, 0.18, 0.04);
  const gate: [number, number] = [(-0.65 + 3.85) / 7.7, (0.65 + 3.85) / 7.7];
  picketFence(kit, -3.85, 5.85, 3.85, 5.85, TRIM, 0xe3ddce, 0.8, [gate], 9);
  picketFence(kit, 3.85, 5.85, 3.85, -5.85, TRIM, 0xe3ddce, 0.8, [], 10);
  picketFence(kit, 3.85, -5.85, -3.85, -5.85, TRIM, 0xe3ddce, 0.8, [], 11);
  picketFence(kit, -3.85, -5.85, -3.85, 5.85, TRIM, 0xe3ddce, 0.8, [], 12);

  // Side and back yard: bicycle, water tank on a stand, clothesline, trash can, banana plants.
  {
    const bx = 3.5;
    for (const z of [-1.85, -0.95]) {
      sh.torus(0x232323, bx, 0.34, z, 0.31, 0.035, 0, Math.PI / 2);
      sh.cyl(0x8d9496, bx, 0.34, z, 0.04, 0.04, 0.12, 6, 0, 0, Math.PI / 2);
    }
    const frame = (y1: number, z1b: number, y2: number, z2b: number) => {
      const len = Math.hypot(y2 - y1, z2b - z1b);
      box(DOOR, bx, (y1 + y2) / 2, (z1b + z2b) / 2, 0.05, len, 0.05, Math.atan2(z2b - z1b, y2 - y1));
    };
    frame(0.34, -1.85, 0.72, -1.4);
    frame(0.34, -1.4, 0.75, -1.45);
    frame(0.72, -1.42, 0.72, -1.05);
    frame(0.34, -0.95, 0.78, -1.05);
    box(0x232323, bx, 0.82, -1.47, 0.12, 0.05, 0.22);
    box(0x8d9496, bx, 0.95, -1.05, 0.45, 0.03, 0.03);
  }
  {
    const tx = 3.15, tz = -5.15;
    for (const sx of [-0.32, 0.32]) for (const sz of [-0.32, 0.32]) box(0x755b43, tx + sx, 0.6, tz + sz, 0.09, 1.2, 0.09);
    box(0x755b43, tx, 1.22, tz, 0.85, 0.08, 0.85);
    sh.box(0x755b43, tx, 0.6, tz + 0.33, 0.04, 0.9, 0.04, 0, 0, 0.78);
    barrel(sh, tx, tz, 0.42, 0.95, 0x343b3c, 0x2c2a27, 1.26);
    sh.cyl(0x343b3c, tx, 2.28, tz, 0.18, 0.18, 0.1, 10);
    box(0x8d9496, tx - 0.32, 0.8, tz + 0.45, 0.06, 1.6, 0.06);
  }
  laundry(kit, -3.5, -5.35, 0.3, -5.35, 1.9, 0x755b43, [0xf4f0e6, 0xd6354a, 0x2f6b8f, 0xf0c33c, 0x6aa84a, 0xe86fa0]);
  sh.cyl(0x737b77, 2.3, 0.35, -4.85, 0.22, 0.2, 0.7, 10);
  sh.cyl(0x5c6462, 2.3, 0.72, -4.85, 0.24, 0.24, 0.05, 10);
  for (const [x, z] of [[-3.5, -1.0], [-3.45, -3.6]]) {
    sh.cyl(0x7d8a45, x, 0.7, z, 0.1, 0.13, 1.4, 6);
    for (let i = 0; i < 5; i++) {
      const yaw = i * 1.25 + x;
      sh.box(i % 2 ? 0x4f8c3c : 0x5f9e45, x + Math.sin(yaw) * 0.22, 1.45, z + Math.cos(yaw) * 0.22, 0.25, 0.02, 0.6, -0.5 + (i % 2) * 0.3, yaw);
    }
  }

  sh.flush();
}
