import * as THREE from "three";
import type { Kit } from "./kit";

export function flag(kit: Kit, x: number, z: number, y0 = 0, h = 5.2) {
  kit.solid(new THREE.CylinderGeometry(0.035, 0.045, h, 8), 0xe1dcb9, x, y0 + h / 2, z);
  kit.solid(new THREE.SphereGeometry(0.08, 8, 6), 0xd6b43c, x, y0 + h + 0.04, z);
  kit.box(0xf1f0df, x + 0.55, y0 + h - 0.42, z, 1.05, 0.72, 0.025);
  kit.box(0x4c79a6, x + 0.55, y0 + h - 0.42, z + 0.015, 0.34, 0.72, 0.02);
  kit.box(0xc43b32, x + 0.83, y0 + h - 0.42, z + 0.02, 0.48, 0.72, 0.018);
  kit.box(0xe4d15d, x + 0.55, y0 + h - 0.42, z + 0.03, 0.12, 0.12, 0.022);
}

export function jeep(kit: Kit, x: number, z: number, ry = 0) {
  const c = Math.cos(ry), s = Math.sin(ry);
  const p = (dx: number, dz: number) => [x + dx * c - dz * s, z + dx * s + dz * c] as const;
  kit.box(0x4b5d3d, x, 0.48, z, 2.05, 0.58, 1.05, 0, ry);
  kit.box(0x59694a, x, 0.82, z, 1.35, 0.52, 1.0, 0, ry);
  kit.box(0x1f2928, x - 0.05 * c, 1.03, z - 0.05 * s, 0.9, 0.38, 0.9, 0, ry);
  kit.box(0x6f8b8c, x - 0.05 * c, 1.07, z - 0.05 * s, 0.72, 0.29, 0.92, 0, ry);
  for (const dx of [-0.72, 0.72]) for (const dz of [-0.58, 0.58]) {
    const [wx, wz] = p(dx, dz);
    kit.solid(new THREE.CylinderGeometry(0.25, 0.25, 0.18, 10), 0x242724, wx, 0.35, wz).rotation.z = Math.PI / 2;
  }
  kit.box(0xc7d8d2, x - 0.72 * c - 0.54 * s, 0.68, z - 0.72 * s + 0.54 * c, 0.28, 0.18, 0.06, 0, ry);
}

export function policeCar(kit: Kit, x: number, z: number, ry = 0) {
  const c = Math.cos(ry), s = Math.sin(ry);
  const p = (dx: number, dz: number) => [x + dx * c - dz * s, z + dx * s + dz * c] as const;
  kit.box(0xe9e7dc, x, 0.46, z, 2.6, 0.62, 1.18, 0, ry);
  kit.box(0x303936, x - 0.18 * c, 0.94, z - 0.18 * s, 1.55, 0.55, 1.08, 0, ry);
  kit.box(0x9db7b8, x - 0.18 * c, 1.04, z - 0.18 * s, 1.25, 0.34, 1.12, 0, ry);
  kit.box(0x303936, x - 0.18 * c, 1.22, z - 0.18 * s, 1.6, 0.08, 1.12, 0, ry);
  for (const dx of [-0.88, 0.88]) for (const dz of [-0.64, 0.64]) {
    const [wx, wz] = p(dx, dz);
    kit.solid(new THREE.CylinderGeometry(0.28, 0.28, 0.2, 10), 0x242724, wx, 0.34, wz).rotation.z = Math.PI / 2;
  }
  kit.box(0x3f6f9a, x + 0.3 * c, 0.73, z + 0.3 * s, 0.72, 0.18, 1.2, 0, ry);
  kit.litBox(0xe5a0a0, x - 0.12 * c - 0.18 * s, 1.32, z - 0.12 * s + 0.18 * c, 0.18, 0.12, 0.22, 0, ry);
  kit.litBox(0x77a7d4, x - 0.12 * c + 0.18 * s, 1.32, z - 0.12 * s - 0.18 * c, 0.18, 0.12, 0.22, 0, ry);
}

export function sandbags(kit: Kit, x: number, z: number, length: number, ry = 0) {
  const c = Math.cos(ry), s = Math.sin(ry);
  for (let i = 0; i < Math.ceil(length / 0.45); i++) {
    const u = -length / 2 + 0.25 + i * 0.45;
    kit.solid(new THREE.CapsuleGeometry(0.16, 0.22, 3, 6), 0xb0a16f, x + u * c, 0.18, z - u * s).rotation.z = Math.PI / 2;
  }
}

export function radioMast(kit: Kit, x: number, z: number) {
  const steel = 0x6b7370, red = 0x8e3d32;
  for (let y = 1; y < 23; y += 1.25) {
    kit.box(steel, x - 0.38, y, z - 0.38, 0.07, 1.25, 0.07);
    kit.box(steel, x + 0.38, y, z - 0.38, 0.07, 1.25, 0.07);
    kit.box(steel, x - 0.38, y, z + 0.38, 0.07, 1.25, 0.07);
    kit.box(steel, x + 0.38, y, z + 0.38, 0.07, 1.25, 0.07);
    kit.box(steel, x, y, z - 0.38, 0.82, 0.055, 0.055);
    kit.box(steel, x, y, z + 0.38, 0.82, 0.055, 0.055);
    kit.box(steel, x - 0.38, y, z, 0.055, 0.055, 0.82);
    kit.box(steel, x + 0.38, y, z, 0.055, 0.055, 0.82);
  }
  kit.box(red, x, 22.9, z, 0.9, 0.16, 0.9);
  kit.solid(new THREE.CylinderGeometry(0.045, 0.045, 1.2, 8), red, x, 23.5, z);
  kit.litBox(0xc94b40, x, 24.1, z, 0.18, 0.18, 0.18);
  for (const [dx, dz] of [[2.5, 2.5], [-2.5, 2.5], [2.5, -2.5], [-2.5, -2.5]]) {
    const ax = x + dx, az = z + dz;
    for (const y of [7, 14, 20]) {
      const length = Math.hypot(ax - x, az - z, y);
      kit.solid(new THREE.CylinderGeometry(0.018, 0.018, length, 5), 0x575b56, (x + ax) / 2, y / 2, (z + az) / 2).rotation.z = Math.atan2(ax - x, y);
    }
  }
}
