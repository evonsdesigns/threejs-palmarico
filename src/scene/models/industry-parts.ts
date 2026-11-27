import * as THREE from "three";
import type { Kit } from "./kit";

export const INDUSTRY = {
  stone: 0x77766c,
  paleStone: 0x9b9581,
  brick: 0x8c5038,
  brickDark: 0x633a2e,
  stucco: 0xd7cfb9,
  cream: 0xe9dfc8,
  timber: 0x654b35,
  timberLight: 0x9a7046,
  steel: 0x59625e,
  steelLight: 0x89918a,
  roof: 0x454943,
  rust: 0x914f35,
  green: 0x3e7752,
  greenLight: 0x5d9c5e,
  copper: 0xa9643e,
  copperLight: 0xc98b50,
  gold: 0xd4ad45,
  glass: 0x587a78,
  wood: 0x926943,
  woodLight: 0xb18a5a,
  shadow: 0x3b342c,
};

export function floor(kit: Kit, w: number, d: number, color = 0xb7aa8e) {
  kit.box(color, 0, 0.08, 0, w, 0.16, d);
  for (let x = -w / 2 + 0.25; x < w / 2; x += 1.5) {
    kit.box(0xa89b80, x, 0.17, 0, 0.035, 0.018, d - 0.35);
  }
  for (let z = -d / 2 + 0.25; z < d / 2; z += 1.5) {
    kit.box(0xa89b80, 0, 0.17, z, w - 0.35, 0.018, 0.035);
  }
}

export function shed(kit: Kit, x: number, z: number, w: number, d: number, wallH: number, wall = INDUSTRY.stucco, roof = INDUSTRY.roof, rise = 1.9) {
  const y0 = 0.2;
  const eave = y0 + wallH;
  const base = wall === INDUSTRY.timber ? INDUSTRY.stone : INDUSTRY.brickDark;
  kit.box(base, x, 0.55, z, w + 0.2, 0.7, d + 0.2);
  kit.box(wall, x, y0 + wallH / 2, z, w, wallH, d);
  kit.box(INDUSTRY.steel, x, 0.95, z, w + 0.28, 0.13, d + 0.28);
  kit.box(INDUSTRY.steelLight, x, 1.05, z + d / 2 + 0.03, w + 0.24, 0.08, 0.06);
  for (const side of [-1, 1]) {
    kit.box(INDUSTRY.steelLight, x + side * (w / 2 + 0.04), eave - 0.15, z, 0.12, 0.25, d + 0.2);
  }
  kit.box(INDUSTRY.stucco, x, eave - 0.08, z + d / 2 + 0.04, w + 0.2, 0.22, 0.12);
  kit.box(INDUSTRY.timber, x, eave - 0.23, z + d / 2 + 0.12, w + 0.1, 0.07, 0.06);
  kit.gable(x, z, w + 0.55, d + 0.55, eave, rise, roof, Math.max(5, Math.round(w / 1.6)));
  const roofAngle = Math.atan2(rise, d / 2);
  const roofLength = Math.hypot(d / 2, rise);
  for (const side of [-1, 1]) {
    for (let dx = -w / 2 + 0.22; dx < w / 2; dx += 0.42) {
      kit.box(roof === INDUSTRY.green ? INDUSTRY.greenLight : INDUSTRY.steelLight,
        x + dx, eave + rise / 2 + 0.14, z + side * d / 4,
        0.055, 0.035, roofLength, side * roofAngle);
    }
  }
  const windowY = Math.min(2.8, y0 + wallH - 0.75);
  const sideRows = [Math.min(1.9, windowY - 0.6), Math.max(1.1, windowY)];
  for (const side of [-1, 1]) {
    for (let j = 0; j < 3; j++) {
      const yy = sideRows[j % sideRows.length];
      kit.window(x + side * (w / 2 + 0.07), yy, z - d * 0.27 + j * d * 0.27, 0.9, 0.72, side * Math.PI / 2);
    }
  }
  for (const dx of [-w * 0.32, 0, w * 0.32]) {
    kit.frontWindow(x + dx, windowY, z + d / 2 + 0.06, dx === 0 ? 1.15 : 0.9, 1.0);
    kit.backWindow(x + dx, windowY, z - d / 2 - 0.06, 0.9, 0.95);
  }
  return { x, z, w, d, wallH, eave, roofY: eave + rise, front: z + d / 2, back: z - d / 2, left: x - w / 2, right: x + w / 2 };
}

export function loadingDoor(kit: Kit, x: number, y0: number, z: number, w: number, h: number, color = INDUSTRY.timber) {
  kit.box(INDUSTRY.cream, x, y0 + h / 2, z, w + 0.28, h + 0.16, 0.16);
  kit.box(color, x, y0 + h / 2, z + 0.1, w, h, 0.08);
  for (let i = 1; i < 5; i++) kit.box(INDUSTRY.timberLight, x - w / 2 + i * w / 5, y0 + h / 2, z + 0.16, 0.045, h - 0.12, 0.025);
  for (const y of [y0 + 0.35, y0 + h * 0.55, y0 + h - 0.2]) kit.box(INDUSTRY.timberLight, x, y, z + 0.17, w - 0.08, 0.07, 0.025);
  kit.box(INDUSTRY.steel, x, y0 - 0.08, z + 0.45, w + 0.8, 0.16, 0.9);
  for (const dx of [-w / 2, w / 2]) kit.box(INDUSTRY.steel, x + dx, y0 + h / 2, z + 0.45, 0.14, h + 0.18, 0.14);
}

export function pipe(kit: Kit, points: readonly (readonly [number, number, number])[], color = INDUSTRY.steel, radius = 0.09) {
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0, z0] = points[i];
    const [x1, y1, z1] = points[i + 1];
    const dx = x1 - x0;
    const dy = y1 - y0;
    const dz = z1 - z0;
    const length = Math.hypot(dx, dy, dz);
    const geometry = new THREE.CylinderGeometry(radius, radius, length, 7);
    const mesh = kit.solid(geometry, color, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(dx, dy, dz).normalize());
  }
  for (const [x, y, z] of points) kit.solid(new THREE.SphereGeometry(radius * 1.2, 7, 5), color, x, y, z);
}

export function barrel(kit: Kit, x: number, z: number, y = 0, scale = 1, color = INDUSTRY.wood) {
  const h = 0.95 * scale;
  const r = 0.34 * scale;
  kit.solid(new THREE.CylinderGeometry(r * 0.92, r * 0.92, h, 10), color, x, y + h / 2, z);
  for (const t of [0.12, 0.5, 0.88]) {
    kit.box(INDUSTRY.steel, x, y + h * t, z, r * 2.05, 0.055 * scale, r * 2.05);
    kit.box(INDUSTRY.steel, x, y + h * t, z, r * 1.75, 0.055 * scale, r * 1.75, 0, Math.PI / 4);
  }
  kit.box(INDUSTRY.woodLight, x, y + h + 0.015, z, r * 1.65, 0.05, r * 1.65);
  kit.box(INDUSTRY.shadow, x, y + h + 0.045, z, 0.12 * scale, 0.025, 0.12 * scale);
}

export function crate(kit: Kit, x: number, z: number, y = 0, w = 0.85, h = 0.75, d = 0.75, stamp = false) {
  kit.box(INDUSTRY.wood, x, y + h / 2, z, w, h, d);
  for (const s of [-1, 1]) {
    kit.box(INDUSTRY.woodLight, x + s * (w / 2 - 0.05), y + h / 2, z + d / 2 + 0.02, 0.08, h, 0.045);
    kit.box(INDUSTRY.woodLight, x, y + h / 2, z + s * (d / 2 - 0.05), w, h, 0.045);
  }
  for (let sy = 1; sy < 4; sy++) kit.box(INDUSTRY.timberLight, x, y + h * sy / 4, z + d / 2 + 0.045, w - 0.12, 0.045, 0.025);
  kit.box(INDUSTRY.woodLight, x, y + h + 0.03, z, w - 0.08, 0.045, d - 0.08);
  if (stamp) {
    kit.box(INDUSTRY.gold, x - w * 0.22, y + h * 0.58, z + d / 2 + 0.07, 0.18, 0.12, 0.02);
    kit.box(INDUSTRY.steel, x + w * 0.14, y + h * 0.58, z + d / 2 + 0.07, 0.24, 0.05, 0.02);
  }
}

export function tank(kit: Kit, x: number, z: number, y = 0, radius = 0.75, height = 2.5, color = INDUSTRY.steelLight, top = "dome") {
  kit.box(INDUSTRY.steel, x, y + 0.12, z, radius * 2.2, 0.24, radius * 2.2);
  kit.solid(new THREE.CylinderGeometry(radius, radius * 1.05, height, 12), color, x, y + 0.24 + height / 2, z);
  for (const t of [0.12, 0.45, 0.8]) kit.solid(new THREE.CylinderGeometry(radius * 1.035, radius * 1.035, 0.085, 12), INDUSTRY.steel, x, y + 0.24 + height * t, z);
  if (top === "dome") kit.solid(new THREE.SphereGeometry(radius * 0.99, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), color, x, y + 0.24 + height, z);
  else kit.solid(new THREE.CylinderGeometry(radius, radius * 0.12, 0.5, 12), color, x, y + 0.24 + height + 0.25, z);
  kit.solid(new THREE.CylinderGeometry(0.08, 0.08, 0.45, 8), INDUSTRY.steel, x, y + 0.24 + height + 0.35, z);
  for (const side of [-1, 1]) {
    kit.box(INDUSTRY.steel, x + side * (radius + 0.18), y + height * 0.42, z, 0.06, height * 0.75, 0.07);
  }
  pipe(kit, [[x + radius + 0.18, y + 0.42, z], [x + radius + 0.18, y + 0.22, z + radius + 0.25], [x, y + 0.22, z + radius + 0.25]], INDUSTRY.copper, 0.055);
}

export function chimney(kit: Kit, x: number, z: number, height = 8, color = INDUSTRY.brick) {
  kit.box(INDUSTRY.stone, x, 0.22, z, 1.2, 0.35, 1.2);
  kit.solid(new THREE.CylinderGeometry(0.48, 0.68, height, 12), color, x, 0.4 + height / 2, z);
  for (let y = 1.1; y < height; y += 0.85) {
    kit.box(INDUSTRY.brickDark, x, 0.4 + y, z, 1.06 - y * 0.018, 0.055, 1.06 - y * 0.018, 0, Math.PI / 4);
  }
  kit.solid(new THREE.CylinderGeometry(0.62, 0.62, 0.2, 12), INDUSTRY.stone, x, 0.4 + height, z);
  kit.solid(new THREE.CylinderGeometry(0.32, 0.32, 0.25, 12), INDUSTRY.shadow, x, 0.52 + height, z);
}

export function lamp(kit: Kit, x: number, z: number, y = 2.5) {
  kit.box(INDUSTRY.steel, x, y / 2, z, 0.09, y, 0.09);
  kit.box(INDUSTRY.steel, x, y - 0.15, z, 0.44, 0.07, 0.08);
  kit.litBox(0xf3d57a, x + 0.2, y - 0.34, z, 0.19, 0.28, 0.19);
  kit.box(INDUSTRY.steel, x + 0.2, y - 0.15, z, 0.3, 0.045, 0.25);
}

export function crateStack(kit: Kit, x: number, z: number, count: number, colorStamp = false) {
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / 3);
    const col = i % 3;
    crate(kit, x + (col - 1) * 0.9, z + row * 0.86, 0.02 + row * 0.78, 0.82, 0.72, 0.78, colorStamp && i % 2 === 0);
  }
}

export function barrelCluster(kit: Kit, x: number, z: number, count: number, color = INDUSTRY.wood) {
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / 3);
    const col = i % 3;
    barrel(kit, x + (col - 1) * 0.82, z + row * 0.82, 0.02 + row * 0.98, 0.95, color);
  }
}
