import { Kit } from "./kit";
import {
  barrel, bush, chicken, door, gableRoof, picketFence, rng, shapes, shutteredWindow, slope, WindowStyle,
} from "./small-homes-parts";

const WALL = 0xe9c98d;
const TRIM = 0xece3cd;
const SHUTTER = 0x668374;
const ROOF = 0xa34e35;
const STONE = 0x92908a;

export function buildCountryHouse(kit: Kit) {
  const { box } = kit;
  const sh = shapes(kit);
  const random = rng(23);

  // Cottage body: x [-2.7, 1.7], z [-3.1, 0.3]; stone plinth to 0.45, walls to 3.5.
  const x0 = -2.7, x1 = 1.7, z0 = -3.1, z1 = 0.3, base = 0.45, top = 3.5;
  const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, w = x1 - x0, d = z1 - z0;

  // Yard: trodden earth around the house, stepping-stone path.
  box(0x8a7550, cx, 0.015, cz + 0.4, w + 1.4, 0.03, d + 1.6);
  for (let i = 0; i < 4; i++) {
    sh.box(STONE, -0.5 + (i % 2 ? 0.12 : -0.1), 0.04, 2.8 + i * 0.27, 0.46, 0.06, 0.22, 0, i * 0.35);
  }

  // Stone plinth with block joints.
  box(STONE, cx, base / 2, cz, w + 0.2, base, d + 0.2);
  box(0x6f6d68, cx, base + 0.02, cz, w + 0.26, 0.05, d + 0.26);
  for (let x = x0 + 0.2; x < x1; x += 0.55) {
    box(0x6f6d68, x, base / 2, z1 + 0.105, 0.03, base - 0.05, 0.01);
    box(0x6f6d68, x + 0.27, base / 2, z0 - 0.105, 0.03, base - 0.05, 0.01);
  }
  for (let z = z0 + 0.2; z < z1; z += 0.55) {
    box(0x6f6d68, x1 + 0.105, base / 2, z, 0.01, base - 0.05, 0.03);
    box(0x6f6d68, x0 - 0.105, base / 2, z, 0.01, base - 0.05, 0.03);
  }
  box(0x6f6d68, x1 + 0.105, base / 2, cz, 0.01, 0.03, d + 0.2);
  box(0x6f6d68, cx, base / 2, z1 + 0.105, w + 0.2, 0.03, 0.01);

  // Plastered walls with corner quoins, a grime band and patches of exposed brick.
  box(WALL, cx, (base + top) / 2, cz, w, top - base, d);
  for (const [qx, qz] of [[x0, z0], [x0, z1], [x1, z0], [x1, z1]]) {
    for (let y = base + 0.2, i = 0; y < top - 0.1; y += 0.36, i++) {
      const sx = Math.sign(qx - cx), sz = Math.sign(qz - cz);
      const long = i % 2 === 0;
      box(TRIM, qx - sx * (long ? 0.2 : 0.12) + sx * 0.02, y, qz + sz * 0.02, long ? 0.44 : 0.28, 0.3, 0.06);
      box(TRIM, qx + sx * 0.02, y, qz - sz * (long ? 0.12 : 0.2) + sz * 0.02, 0.06, 0.3, long ? 0.28 : 0.44);
    }
  }
  box(0xcdb07a, cx, base + 0.18, z1 + 0.012, w - 0.1, 0.3, 0.02);
  box(0xcdb07a, x1 + 0.012, base + 0.18, cz, 0.02, 0.3, d - 0.1);
  box(0xcdb07a, cx, top - 0.12, z1 + 0.012, w, 0.18, 0.02);
  box(0xcdb07a, x1 + 0.012, top - 0.12, cz, 0.02, 0.18, d);
  const brick = (x: number, y: number, z: number, onX: boolean) => {
    box(0xd8bd85, x, y, z, onX ? 0.025 : 0.62, 0.48, onX ? 0.62 : 0.025);
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 2; c++) {
        const o = -0.12 + c * 0.26 + (r % 2) * 0.1 - 0.05;
        box(0xa0583c, onX ? x + 0.02 : x + o, y - 0.13 + r * 0.13, onX ? z + o : z + 0.02, onX ? 0.02 : 0.22, 0.1, onX ? 0.22 : 0.02);
      }
    }
  };
  brick(1.25, 1.0, z1, false);
  brick(-2.3, 2.85, z1, false);
  brick(x1, 2.8, -1.45, true);
  brick(x1, 0.95, -2.75, true);
  box(0xd9b77b, 0.2, 3.0, z1 + 0.012, 0.6, 0.4, 0.02);
  box(0xf0d8a4, x1 + 0.012, 1.3, -1.4, 0.02, 0.5, 0.35);

  // Roof: terracotta tiles, ridge cap, white fascia and gable vent.
  const roof = gableRoof(kit, sh, {
    x: cx, z: cz, w, d, top, rise: 1.8, overX: 0.45, overZ: 0.45,
    roof: ROOF, row: 0x8a3f2b, ridge: 0x7d3524, fascia: TRIM, fill: WALL, vent: SHUTTER, gutter: 0x8d9496,
  });
  // Rafter tails under the eaves.
  for (let x = x0 - 0.3; x <= x1 + 0.3; x += 0.55) {
    for (const s of [-1, 1]) box(0x755b43, x, roof.eaveY + 0.12, cz + s * (d / 2 + 0.22), 0.1, 0.12, 0.5, s * Math.atan(roof.k));
  }
  // A few slipped / replaced tiles.
  const front = slope(kit, cz, top + 1.8, cz + roof.H, roof.eaveY);
  for (const [x, t] of [[-1.9, 0.35], [0.9, 0.6], [-0.4, 0.75], [1.6, 0.25]]) front.box(0xb35e3f, x, t, roof.th + 0.06, 0.32, 0.05, 0.28);
  front.box(0x6b6b58, -1.2, 0.5, roof.th + 0.05, 0.5, 0.03, 0.45);

  // Stone chimney on the west gable.
  const chx = -2.92;
  box(STONE, chx, 3.0, -1.9, 0.44, 6.0, 0.8);
  for (let y = 0.4; y < 6; y += 0.4) box(0x6f6d68, chx + 0.225, y, -1.9, 0.01, 0.03, 0.8);
  box(0x6f6d68, chx, 6.05, -1.9, 0.6, 0.14, 0.95);
  for (const dz of [-0.18, 0.18]) sh.cyl(0xa6573b, chx, 6.27, -1.9 + dz, 0.08, 0.1, 0.3, 8);
  box(0x2c2a27, chx, 6.13, -1.9, 0.3, 0.02, 0.6);

  // Front porch: deck on stone piers, posts, railings, tiled lean-to roof, stone steps.
  const px0 = -2.3, px1 = 1.3, pz1 = 2.0, pcx = (px0 + px1) / 2;
  box(0x9a8967, pcx, base - 0.08, (z1 + pz1) / 2, px1 - px0, 0.16, pz1 - z1);
  for (let z = z1 + 0.12; z < pz1; z += 0.2) box(0x6c5a47, pcx, base + 0.002, z, px1 - px0, 0.01, 0.02);
  box(0x755b43, pcx, base - 0.12, pz1 + 0.02, px1 - px0 + 0.04, 0.2, 0.06);
  for (const x of [px0 + 0.15, pcx, px1 - 0.15]) box(STONE, x, 0.16, pz1 - 0.15, 0.3, 0.32, 0.3);
  const posts = [px0 + 0.1, -1.1, 0.1, px1 - 0.1];
  const postZ = pz1 - 0.12;
  const pr = slope(kit, z1, 2.92, pz1 + 0.15, 2.5);
  const beamY = pr.point((postZ - z1) / (pz1 + 0.15 - z1))[0] - 0.12;
  for (const x of posts) {
    box(TRIM, x, (base + beamY) / 2, postZ, 0.16, beamY - base, 0.16);
    box(TRIM, x, base + 0.08, postZ, 0.24, 0.16, 0.24);
    box(TRIM, x, beamY - 0.12, postZ, 0.22, 0.1, 0.22);
  }
  box(TRIM, pcx, beamY, postZ, px1 - px0 + 0.1, 0.16, 0.18);
  for (const x of [posts[0], posts[3]]) box(TRIM, x, beamY, (z1 + postZ) / 2, 0.14, 0.14, postZ - z1);
  pr.box(ROOF, pcx, 0.5, 0.06, px1 - px0 + 0.35, 0.12, pr.len);
  for (let i = 1; i <= 5; i++) pr.box(0x8a3f2b, pcx, i / 5 - 0.04, 0.14, px1 - px0 + 0.35, 0.06, 0.1);
  for (let dx = -(px1 - px0) / 2; dx <= (px1 - px0) / 2 + 0.1; dx += 0.34) pr.box(0x8a3f2b, pcx + dx, 0.5, 0.14, 0.07, 0.05, pr.len);
  for (const s of [-1, 1]) pr.box(TRIM, pcx + s * ((px1 - px0) / 2 + 0.2), 0.5, 0.04, 0.06, 0.2, pr.len);
  {
    const [y, z] = pr.point(1, -0.05);
    box(TRIM, pcx, y - 0.05, z, px1 - px0 + 0.4, 0.18, 0.06);
  }
  // Railings with balusters, leaving the step opening.
  const rail = (ax: number, az: number, bx: number, bz: number) => {
    const len = Math.hypot(bx - ax, bz - az);
    const along = Math.abs(bx - ax) > Math.abs(bz - az);
    const mx = (ax + bx) / 2, mz = (az + bz) / 2;
    for (const y of [base + 0.82, base + 0.15]) box(TRIM, mx, y, mz, along ? len : 0.08, 0.07, along ? 0.08 : len);
    const n = Math.floor(len / 0.17);
    for (let i = 1; i < n; i++) {
      const t = i / n;
      box(0xd9d2bd, ax + (bx - ax) * t, base + 0.48, az + (bz - az) * t, 0.05, 0.62, 0.05);
    }
  };
  rail(posts[0], postZ, posts[1], postZ);
  rail(posts[2], postZ, posts[3], postZ);
  rail(posts[0], z1 + 0.1, posts[0], postZ);
  rail(posts[3], z1 + 0.1, posts[3], postZ);
  box(STONE, -0.5, 0.15, pz1 + 0.17, 1.1, 0.3, 0.3);
  box(STONE, -0.5, 0.075, pz1 + 0.47, 1.1, 0.15, 0.3);
  for (const z of [pz1 + 0.31, pz1 + 0.61]) box(0x6f6d68, -0.5, z < pz1 + 0.5 ? 0.3 : 0.15, z, 1.1, 0.02, 0.03);

  // Door and shuttered windows.
  door(kit, sh, -0.5, base, z1, 0.95, 2.2, 0, { leaf: SHUTTER, frame: TRIM, panel: 0x5a7466, knob: 0xc9a24a });
  const style: WindowStyle = {
    frame: TRIM, glass: 0x4d6a6a, muntin: TRIM, sill: 0xddd4bd, shutter: SHUTTER, slat: 0x56705f, gap: 0.04,
  };
  const flowery: WindowStyle = { ...style, flowers: [0xd6354a, 0xf0c33c, 0xe86fa0], planter: 0x755b43 };
  shutteredWindow(kit, sh, -1.75, 1.85, z1, 0.8, 1.1, 0, flowery);
  shutteredWindow(kit, sh, 0.75, 1.85, z1, 0.8, 1.1, 0, flowery);
  shutteredWindow(kit, sh, x1, 1.85, -0.7, 0.8, 1.1, Math.PI / 2, flowery);
  shutteredWindow(kit, sh, x1, 1.85, -2.15, 0.8, 1.1, Math.PI / 2, { ...style, closed: true });
  shutteredWindow(kit, sh, x0, 1.85, -0.6, 0.8, 1.1, -Math.PI / 2, style);
  shutteredWindow(kit, sh, -1.7, 1.85, z0, 0.8, 1.1, Math.PI, style);
  shutteredWindow(kit, sh, 0.6, 1.85, z0, 0.8, 1.1, Math.PI, { ...style, closed: true });
  // Porch furniture: bench, potted plants, lantern, a broom.
  box(0x755b43, -1.75, base + 0.45, z1 + 0.35, 1.1, 0.07, 0.36);
  box(0x755b43, -1.75, base + 0.8, z1 + 0.18, 1.1, 0.3, 0.05);
  for (const dx of [-0.48, 0.48]) box(0x5e4a38, -1.75 + dx, base + 0.22, z1 + 0.35, 0.06, 0.44, 0.34);
  for (const x of [-1.05, 0.05]) {
    sh.cyl(0xa6573b, x, base + 0.17, pz1 - 0.35, 0.16, 0.12, 0.34, 8);
    bush(sh, x, pz1 - 0.35, 0.22, 0x5d9a43, 0x3f7a35, 0xd6354a, x * 10);
  }
  box(0x2c2a27, 0.2, 2.62, z1 + 0.25, 0.04, 0.3, 0.04);
  box(0x2c2a27, 0.2, 2.38, z1 + 0.25, 0.2, 0.22, 0.2);
  box(0xf2d27a, 0.2, 2.38, z1 + 0.25, 0.14, 0.16, 0.22);
  sh.box(0xb28b60, 1.0, base + 0.75, z1 + 0.15, 0.04, 1.5, 0.04, 0, 0, 0.15);
  sh.box(0xd8b86a, 1.1, base + 0.15, z1 + 0.18, 0.25, 0.3, 0.08, 0, 0, 0.15);

  // Gutter downspout feeding a water barrel at the front-east corner.
  const gx = 2.02, gz = 0.89;
  box(0x8d9496, gx, (roof.eaveY - 0.2 + 1.35) / 2, gz, 0.1, roof.eaveY - 0.2 - 1.35, 0.1);
  box(0x8d9496, gx + 0.05, 1.28, gz - 0.12, 0.1, 0.1, 0.3, 0.5);
  box(0x2c2a27, gx, 2.0, gz - 0.06, 0.14, 0.04, 0.04);
  barrel(sh, 2.17, 0.5, 0.32, 1.0, 0x755b43, 0x3a3a38);
  box(0x6c5a47, 2.17, 1.03, 0.5, 0.5, 0.04, 0.12, 0, 0.6);
  sh.cyl(0x8d9496, 2.27, 1.1, 0.38, 0.06, 0.06, 0.1, 8);

  // Kitchen garden on the east side: soil beds with cabbages, tomatoes on stakes, maize.
  for (const [i, bx] of [2.55, 3.05, 3.55].entries()) {
    box(0x72583b, bx, 0.07, -1.85, 0.36, 0.14, 3.2);
    box(0x5e4a38, bx, 0.07, -1.85, 0.4, 0.1, 3.24);
    box(0x72583b, bx, 0.1, -1.85, 0.36, 0.06, 3.2);
    for (let z = -3.3; z < -0.35; z += 0.38) {
      if (i === 0) {
        sh.ball(0x7fb058, bx, 0.25, z, 0.15, 0.11, 0.15, z);
        sh.ball(0x5f9e45, bx + 0.04, 0.3, z + 0.03, 0.09, 0.07, 0.09);
      } else if (i === 1) {
        box(0x9a8967, bx, 0.55, z, 0.04, 0.9, 0.04);
        sh.ball(0x4f8c3c, bx, 0.55, z, 0.16, 0.3, 0.16, z);
        sh.ball(0xd6402f, bx + 0.12, 0.45 + random() * 0.3, z + 0.05, 0.05);
        sh.ball(0xd6402f, bx - 0.08, 0.5 + random() * 0.3, z - 0.1, 0.05);
      } else {
        const h = 1.2 + random() * 0.4;
        box(0x8aa64a, bx, h / 2 + 0.1, z, 0.06, h, 0.06);
        for (const a of [0.5, 2.6, 4.2]) sh.box(0x6f9a3c, bx + Math.sin(a) * 0.15, 0.4 + a * 0.12, z + Math.cos(a) * 0.15, 0.08, 0.02, 0.4, -0.5, a);
        box(0xd9c06a, bx, h + 0.15, z, 0.05, 0.14, 0.05);
        box(0xe3c35a, bx + 0.05, h * 0.6, z, 0.07, 0.2, 0.07);
      }
    }
  }
  // Hoe leaning on the fence and a watering can.
  sh.box(0xb28b60, 3.72, 0.75, -0.25, 0.04, 1.6, 0.04, 0.15, 0, -0.08);
  box(0x6b6b58, 3.66, 0.06, -0.12, 0.25, 0.04, 0.12);
  sh.cyl(0x5f8f8a, 2.55, 0.15, 0.0, 0.13, 0.13, 0.3, 8);
  sh.cyl(0x5f8f8a, 2.75, 0.25, 0.0, 0.025, 0.025, 0.35, 6, 0, 0, -0.9);

  // Flower beds along the porch front and a papaya tree.
  box(0x72583b, -2.5, 0.06, 2.55, 2.0, 0.12, 0.6);
  box(0x72583b, 1.6, 0.06, 2.55, 2.0, 0.12, 0.6);
  for (const [x, f] of [[-3.15, 0xd6354a], [-2.4, 0xf0c33c], [-1.75, 0xd6354a], [1.0, 0xc2378f], [1.75, 0xf0f0e6], [2.45, 0xc2378f]] as const) {
    bush(sh, x, 2.55, 0.32, 0x5d9a43, 0x3f7a35, f, x * 7);
  }
  sh.cyl(0x9a8f6a, -3.25, 1.35, 3.25, 0.07, 0.11, 2.7, 6);
  for (let i = 0; i < 7; i++) {
    const yaw = i * 0.9;
    sh.box(i % 2 ? 0x4f8c3c : 0x6aa84a, -3.25 + Math.sin(yaw) * 0.32, 2.75, 3.25 + Math.cos(yaw) * 0.32, 0.36, 0.02, 0.6, -0.35 - (i % 3) * 0.12, yaw);
  }
  for (const a of [0.3, 2.4, 4.4]) sh.ball(a > 2 ? 0x9fb33c : 0xe0952f, -3.25 + Math.cos(a) * 0.12, 2.45, 3.25 + Math.sin(a) * 0.12, 0.09, 0.14, 0.09);

  // Picket fence around the plot with an open gate on the path.
  const gate: [number, number] = [(-1.0 + 3.85) / 7.7, (0.0 + 3.85) / 7.7];
  picketFence(kit, -3.85, 3.85, 3.85, 3.85, 0xe8e2d0, 0xd9d2bd, 0.85, [gate], 5);
  picketFence(kit, 3.85, 3.85, 3.85, -3.85, 0xe8e2d0, 0xd9d2bd, 0.85, [], 6);
  picketFence(kit, 3.85, -3.85, -3.85, -3.85, 0xe8e2d0, 0xd9d2bd, 0.85, [], 7);
  picketFence(kit, -3.85, -3.85, -3.85, 3.85, 0xe8e2d0, 0xd9d2bd, 0.85, [], 8);
  const ga = 1.2;
  const gcx = -1.0 + Math.cos(ga) * 0.45, gcz = 3.85 - Math.sin(ga) * 0.45;
  for (const y of [0.25, 0.65]) box(0xd9d2bd, gcx, y, gcz, 0.9, 0.07, 0.05, 0, ga);
  for (let i = 0; i < 4; i++) {
    const t = -0.35 + i * 0.23;
    box(0xe8e2d0, gcx + Math.cos(ga) * t, 0.42, gcz - Math.sin(ga) * t, 0.1, 0.8, 0.035, 0, ga);
  }

  chicken(kit, 2.4, 1.6, 2.6);
  chicken(kit, 3.2, 2.0, -0.8, 0xb5622f);
  chicken(kit, 2.8, 1.25, 1.3);

  sh.flush();
}
