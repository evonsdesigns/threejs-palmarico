import type { Kit } from "./kit";
import { barrel, chicken, crate, laundry, rng, shapes, slope, wall } from "./small-homes-parts";

const PLANKS = [0x7d6b55, 0x755b43, 0x9a8967, 0x8e7b60, 0xb28b60, 0x6c5a47];

export function buildShack(kit: Kit) {
  const { box } = kit;
  const sh = shapes(kit);
  const random = rng(11);
  const plank = () => PLANKS[Math.floor(random() * PLANKS.length)];

  // Body footprint: x [-1.45, 1.15], z [-1.45, 0.65]; floor at 0.42; mono-pitch roof falling toward the front.
  const x0 = -1.45, x1 = 1.15, z0 = -1.45, z1 = 0.65, floor = 0.42;
  const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
  const topAt = (z: number) => 2.6 + (z1 - z) * (0.5 / (z1 - z0));

  // Bare dirt yard with worn patches and weeds.
  box(0x756345, 0, 0.02, 0, 3.92, 0.04, 3.92);
  box(0x815b36, 0.3, 0.045, 1.35, 2.2, 0.02, 1.1);
  box(0x72583b, -1.1, 0.045, -1.55, 1.3, 0.02, 0.6);
  box(0x8a7550, 1.4, 0.045, -0.6, 0.6, 0.02, 1.4);
  for (let i = 0; i < 18; i++) {
    const a = random() * Math.PI * 2;
    const r = 1.55 + random() * 0.3;
    const x = Math.max(-1.85, Math.min(1.85, Math.cos(a) * r * 1.1));
    const z = Math.max(-1.85, Math.min(1.85, Math.sin(a) * r));
    box(i % 2 ? 0x6f8a3c : 0x587535, x, 0.12, z, 0.08, 0.22 + random() * 0.12, 0.08, (random() - 0.5) * 0.5, a);
    box(0x6f8a3c, x + 0.06, 0.09, z + 0.03, 0.06, 0.16, 0.06, 0.4, a + 1);
  }

  // Cinder-block piers, floor platform and joist ends.
  for (const x of [x0 + 0.12, cx, x1 - 0.12]) {
    for (const z of [z0 + 0.12, cz, z1 - 0.12]) {
      box(0x92908a, x, 0.15, z, 0.34, 0.3, 0.3);
      box(0x5d5a55, x, 0.15, z + 0.155, 0.08, 0.14, 0.02);
    }
  }
  box(0x755b43, cx, 0.37, cz, x1 - x0 + 0.12, 0.1, z1 - z0 + 0.1);
  for (let x = x0 + 0.1; x < x1; x += 0.42) box(0x5e4a38, x, 0.36, z1 + 0.07, 0.09, 0.12, 0.06);

  // Wall core and back wall upper strip.
  box(0x4f4033, cx, floor + (2.6 - floor) / 2, cz, x1 - x0, 2.6 - floor, z1 - z0);
  box(0x4f4033, cx, (2.6 + topAt(z0)) / 2, z0 + 0.15, x1 - x0, topAt(z0) - 2.6, 0.3);

  // Front wall: uneven vertical planks around a door and a window opening.
  const doorL = -0.93, doorR = -0.15, doorTop = floor + 2.05;
  const winL = 0.11, winR = 0.89, winB = 1.35, winT = 1.95;
  for (let i = 0; i < 10; i++) {
    const x = x0 + 0.13 + i * 0.26;
    const c = plank();
    const top = 2.6 - random() * 0.08;
    const jitter = (random() - 0.5) * 0.04;
    if (x > doorL && x < doorR) {
      box(c, x, (doorTop + top) / 2, z1 + 0.025, 0.25, top - doorTop, 0.04, 0, jitter);
    } else if (x > winL && x < winR) {
      box(c, x, (floor + winB) / 2, z1 + 0.025, 0.25, winB - floor, 0.04, 0, jitter);
      box(c, x, (winT + top) / 2, z1 + 0.025, 0.25, top - winT, 0.04, 0, jitter);
    } else {
      box(c, x, (floor - 0.05 + top) / 2, z1 + 0.025, 0.25, top - floor + 0.05, 0.04, 0, jitter);
    }
    box(0x3a2f26, x + 0.125, (floor + top) / 2, z1 + 0.02, 0.02, top - floor, 0.03);
  }
  for (const y of [0.62, 2.48]) {
    box(0x5e4a38, (x0 + doorL) / 2, y, z1 + 0.06, doorL - x0, 0.1, 0.04);
    box(0x5e4a38, (doorR + x1) / 2, y, z1 + 0.06, x1 - doorR, 0.1, 0.04);
  }
  // Nail heads on the battens.
  for (let x = x0 + 0.13; x < x1; x += 0.26) {
    if (x > doorL && x < doorR) continue;
    for (const y of [0.62, 2.48]) box(0x2c2a27, x, y, z1 + 0.085, 0.03, 0.03, 0.02);
  }
  // A tin patch nailed over a rotten plank and a faded hand-painted sign.
  box(0x737b77, -1.2, 1.25, z1 + 0.06, 0.42, 0.55, 0.02, 0, 0.06);
  for (const dx of [-0.13, 0, 0.13]) box(0x5c6462, -1.2 + dx, 1.25, z1 + 0.075, 0.03, 0.55, 0.02, 0, 0.06);
  box(0x2c2a27, -1.2, 1.5, z1 + 0.08, 0.03, 0.03, 0.02);
  box(0xd9c27a, 0.5, 2.25, z1 + 0.06, 0.7, 0.22, 0.02);
  box(0x2f6b8f, 0.5, 2.25, z1 + 0.075, 0.55, 0.06, 0.01);

  // Doorway: dark interior, curtain, rough frame and a plank door propped wide open.
  box(0x1c1915, (doorL + doorR) / 2, floor + 1.025, z1 + 0.01, doorR - doorL, 2.05, 0.02);
  box(0x2f5f8a, doorL + 0.17, floor + 1.0, z1 + 0.03, 0.3, 1.95, 0.02);
  box(0x244d70, doorL + 0.25, floor + 1.0, z1 + 0.04, 0.04, 1.95, 0.02);
  for (const x of [doorL - 0.05, doorR + 0.05]) box(0x5e4a38, x, floor + 1.05, z1 + 0.06, 0.1, 2.1, 0.06);
  box(0x5e4a38, (doorL + doorR) / 2, doorTop + 0.05, z1 + 0.06, doorR - doorL + 0.25, 0.1, 0.06);
  const swing = 1.2;
  const leafW = 0.76;
  const leaf = wall(kit, sh, swing, doorR - (leafW / 2) * Math.cos(swing), z1 + 0.05 + (leafW / 2) * Math.sin(swing));
  for (let i = 0; i < 3; i++) leaf.box(PLANKS[i * 2], -leafW / 3 + i * leafW / 3, floor + 1.0, 0, leafW / 3 - 0.01, 1.98 - i * 0.04, 0.05);
  for (const y of [0.35, 1.65]) for (const n of [-1, 1]) leaf.box(0x5e4a38, 0, floor + y, n * 0.04, leafW, 0.12, 0.03);
  for (const n of [-1, 1]) leaf.slant(0x5e4a38, 0, floor + 1.0, n * 0.04, 0.1, 1.45, 0.03, -0.42);
  leaf.box(0x3a3a38, -leafW / 2 + 0.1, floor + 1.0, 0.06, 0.05, 0.05, 0.05);
  box(0xa0543a, doorR - leafW * Math.cos(swing) - 0.12, 0.1, z1 + leafW * Math.sin(swing) + 0.1, 0.28, 0.14, 0.16, 0, 0.3);
  // Cinder-block step.
  box(0x92908a, (doorL + doorR) / 2, 0.12, z1 + 0.25, 0.7, 0.24, 0.36);
  for (const dx of [-0.16, 0.16]) box(0x4b4944, (doorL + doorR) / 2 + dx, 0.12, z1 + 0.435, 0.2, 0.12, 0.01);

  // Window opening: curtain, crooked board, propped top-hinged shutter.
  const wx = (winL + winR) / 2;
  const wy = (winB + winT) / 2;
  kit.litBox(0x1c1915, wx, wy, z1 + 0.01, winR - winL, winT - winB, 0.02);
  box(0xc0503a, winL + 0.18, wy, z1 + 0.03, 0.3, winT - winB, 0.02);
  for (let y = winB + 0.08; y < winT; y += 0.15) box(0xe6c34a, winL + 0.18, y, z1 + 0.045, 0.3, 0.04, 0.01);
  box(0x8e7b60, wx, winB - 0.04, z1 + 0.1, winR - winL + 0.2, 0.07, 0.2);
  for (const x of [winL - 0.04, winR + 0.04]) box(0x5e4a38, x, wy, z1 + 0.06, 0.08, winT - winB + 0.1, 0.05);
  sh.box(0x9a8967, wx + 0.1, wy - 0.05, z1 + 0.08, 0.6, 0.1, 0.03, 0, 0, 0.5);
  const tilt = -0.55;
  const hingeY = winT + 0.03;
  const reach = 0.62;
  box(0x8e7b60, wx, hingeY + Math.sin(-tilt) * reach / 2, z1 + 0.05 + Math.cos(tilt) * reach / 2, 0.84, 0.04, reach, tilt);
  for (const dx of [-0.25, 0.25]) box(0x6c5a47, wx + dx, hingeY + Math.sin(-tilt) * reach / 2 + 0.03, z1 + 0.05 + Math.cos(tilt) * reach / 2, 0.06, 0.03, reach, tilt);
  const tipY = hingeY + Math.sin(-tilt) * reach;
  const tipZ = z1 + 0.05 + Math.cos(tilt) * reach;
  const stickLen = Math.hypot(tipY - winB, tipZ - (z1 + 0.12));
  box(0x6c5a47, winR - 0.05, (tipY + winB) / 2, (tipZ + z1 + 0.12) / 2, 0.04, stickLen, 0.04, Math.atan2(tipZ - z1 - 0.12, tipY - winB));

  // Side and back walls: planks following the roof slope.
  for (let z = z0 + 0.13; z < z1; z += 0.26) {
    const top = topAt(z) - 0.03;
    box(plank(), x1 + 0.025, (floor - 0.05 + top) / 2, z, 0.04, top - floor + 0.05, 0.25);
    box(plank(), x0 - 0.025, (floor - 0.05 + top) / 2, z, 0.04, top - floor + 0.05, 0.25);
  }
  for (let x = x0 + 0.13; x < x1; x += 0.26) {
    const top = topAt(z0) - 0.03;
    box(plank(), x, (floor - 0.05 + top) / 2, z0 - 0.025, 0.25, top - floor + 0.05, 0.04);
  }
  box(0x5e4a38, x1 + 0.06, 0.62, cz, 0.04, 0.1, z1 - z0);
  box(0x5e4a38, x0 - 0.06, 0.62, cz, 0.04, 0.1, z1 - z0);
  // +x wall: patched corrugated tin sheets, rust streaks and an old enamel advert.
  box(0x687a80, x1 + 0.06, 1.42, -0.8, 0.03, 1.95, 1.25, 0, 0.02);
  for (let z = -1.38; z < -0.2; z += 0.12) box(0x56656a, x1 + 0.085, 1.42, z, 0.02, 1.95, 0.04);
  box(0x8d5b3e, x1 + 0.1, 1.05, 0.25, 0.03, 1.1, 0.75, 0.05, -0.04);
  for (let z = -0.08; z < 0.6; z += 0.12) box(0x744631, x1 + 0.125, 1.05, z, 0.02, 1.1, 0.04, 0.05);
  for (const [y, z, h] of [[2.0, -1.1, 0.5], [1.6, -0.55, 0.8], [0.8, -0.9, 0.35]]) box(0x9a5a35, x1 + 0.09, y, z, 0.01, h, 0.12);
  box(0xd8b23a, x1 + 0.1, 1.75, -0.75, 0.02, 0.4, 0.6);
  box(0xb83a2b, x1 + 0.115, 1.82, -0.75, 0.01, 0.12, 0.6);
  for (const dz of [-0.15, 0.05]) box(0x2c2a27, x1 + 0.115, 1.64, -0.75 + dz, 0.01, 0.06, 0.16);
  // Small side window opening with a cloth.
  kit.litBox(0x1c1915, x1 + 0.13, 1.8, 0.3, 0.02, 0.45, 0.5);
  box(0xe8e2d0, x1 + 0.14, 1.85, 0.42, 0.02, 0.35, 0.22);
  box(0x5e4a38, x1 + 0.15, 1.55, 0.3, 0.05, 0.06, 0.62);
  // Back wall tin patch.
  box(0x85867c, -0.3, 1.6, z0 - 0.06, 0.9, 1.0, 0.03, 0.03);

  // Roof: three mismatched corrugated sheets, a diagonal patch, rocks and a tire holding it down.
  const rz0 = -1.8, rz1 = 1.5;
  const sheets: [number, number, number, number][] = [
    [-1.25, 0x85867c, 0x6d6e66, 0],
    [-0.15, 0x737b77, 0x5c6462, 0.04],
    [0.92, 0x8d5b3e, 0x744631, 0.08],
  ];
  const th = 0.06;
  for (const [x, color, rib, lift] of sheets) {
    const sl = slope(kit, rz0 - lift * 0.5, topAt(rz0) + lift, rz1 - lift, topAt(rz1) + lift);
    sl.box(color, x, 0.5, th / 2 + 0.02, 1.2, th, sl.len);
    for (let dx = -0.54; dx <= 0.55; dx += 0.135) sl.box(rib, x + dx, 0.5, th + 0.035, 0.045, 0.045, sl.len);
    for (let i = 0; i < 3; i++) sl.box(color === 0x8d5b3e ? 0x6e4330 : 0x8a5a3c, x + (random() - 0.5) * 0.8, 0.15 + random() * 0.7, th + 0.06, 0.08 + random() * 0.14, 0.01, 0.12 + random() * 0.3);
    for (const t of [0.04, 0.5, 0.96]) for (let dx = -0.45; dx <= 0.46; dx += 0.3) sl.box(0x3a3a38, x + dx, t, th + 0.07, 0.04, 0.02, 0.04);
  }
  const roof = slope(kit, rz0, topAt(rz0), rz1, topAt(rz1));
  {
    const [y, z] = roof.point(0.45, 0.2);
    sh.box(0x6b6b58, -0.4, y, z, 0.8, 0.04, 0.9, roof.theta, 0.35);
    sh.box(0x8a5a3c, -0.3, y + 0.03, z + 0.12, 0.2, 0.02, 0.3, roof.theta, 0.35);
  }
  for (const [x, t] of [[-1.55, 0.85], [0.35, 0.92], [1.3, 0.2], [-0.8, 0.15]]) {
    const [y, z] = roof.point(t, 0.24);
    sh.ball(0x8a8a84, x, y, z, 0.17, 0.12, 0.15, x);
  }
  {
    const [y, z] = roof.point(0.55, 0.22);
    sh.torus(0x232323, 0.75, y, z, 0.24, 0.09, Math.PI / 2 + roof.theta);
  }
  // Fascia board and rafter tails at the low front eave.
  {
    const [y, z] = roof.point(1, -0.05);
    box(0x5e4a38, cx, y, z, 3.2, 0.12, 0.06);
    for (let x = -1.7; x <= 1.4; x += 0.52) box(0x5e4a38, x, y - 0.02, z - 0.35, 0.08, 0.1, 0.7, roof.theta);
  }
  // Stove pipe with a rain cap.
  sh.cyl(0x3a3a38, -0.85, 3.4, -0.9, 0.1, 0.1, 1.0, 8);
  sh.cyl(0x8d5b3e, -0.85, topAt(-0.9) + 0.12, -0.9, 0.16, 0.18, 0.1, 8);
  sh.cyl(0x3a3a38, -0.85, 4.02, -0.9, 0.02, 0.22, 0.14, 8);

  // Yard clutter: laundry line on the +x side, crates, bucket, drum, firewood, cooking fire, banana, chickens.
  laundry(kit, 1.78, -1.82, 1.78, 0.55, 1.95, 0x6c5a47, [0xe8e2d0, 0xd2533c, 0x3f78b5, 0xe3c14d]);
  crate(kit, 1.45, 0, 1.15, 0.58, 0.2, 0xb28b60, 0x7d6b55);
  crate(kit, 1.42, 0.58, 1.15, 0.42, -0.25, 0x9a8967, 0x6c5a47);
  crate(kit, 0.95, 0, 1.6, 0.42, 0.6, 0xb28b60, 0x7d6b55);
  sh.cyl(0x8d9496, 0.25, 0.18, 1.12, 0.17, 0.13, 0.36, 10);
  sh.cyl(0x41698a, 0.25, 0.33, 1.12, 0.15, 0.15, 0.01, 10);
  sh.torus(0x5c6462, 0.25, 0.36, 1.12, 0.16, 0.012, 0, 0, 0, Math.PI);
  barrel(sh, -1.6, -1.62, 0.28, 0.85, 0x3d6b8a, 0x2d4e66);
  for (const [y, z, d] of [[0.1, -0.2, 0], [0.1, 0.1, 0.05], [0.1, 0.4, -0.04], [0.28, -0.05, 0.03], [0.28, 0.25, 0]]) {
    sh.cyl(0x7a5a3c, x0 - 0.2, y, z, 0.09, 0.09, 0.95, 6, Math.PI / 2, d);
    sh.cyl(0xc9a26e, x0 - 0.2, y, z, 0.07, 0.07, 0.96, 6, Math.PI / 2, d);
  }
  for (let i = 0; i < 5; i++) {
    const a = i * Math.PI * 2 / 5;
    sh.ball(0x77756e, -1.35 + Math.cos(a) * 0.28, 0.08, 1.35 + Math.sin(a) * 0.28, 0.12, 0.09, 0.12, a);
  }
  box(0xe0702a, -1.35, 0.12, 1.35, 0.18, 0.12, 0.18, 0, 0.5);
  box(0xf2b23a, -1.35, 0.18, 1.35, 0.08, 0.12, 0.08, 0, 0.2);
  sh.cyl(0x232323, -1.35, 0.38, 1.35, 0.2, 0.15, 0.26, 10);
  sh.cyl(0x7a5a3c, 0.65, 0.18, 1.15, 0.17, 0.19, 0.36, 7);
  sh.cyl(0xc9a26e, 0.65, 0.365, 1.15, 0.16, 0.16, 0.01, 7);
  // Banana plant tucked behind the +x corner.
  sh.cyl(0x7d8a45, 1.45, 0.55, -1.5, 0.08, 0.11, 1.1, 6);
  for (let i = 0; i < 5; i++) {
    const yaw = Math.PI + i * 0.75 - 0.6;
    const pitch = -0.6 + (i % 2) * 0.4;
    sh.box(i % 2 ? 0x4f8c3c : 0x5f9e45, 1.45 + Math.sin(yaw) * 0.2, 1.15 + 0.12 * (i % 2), -1.45 + Math.cos(yaw) * 0.2, 0.26, 0.02, 0.5, pitch, yaw);
  }
  chicken(kit, 0.45, 1.7, 2.2);
  chicken(kit, -0.75, 1.55, -0.5, 0xb5622f);

  sh.flush();
}
