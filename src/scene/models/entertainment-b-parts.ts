import * as THREE from "three";
import type { Kit } from "./kit";
import { beam } from "./services-parts";

export function cylinder(kit: Kit, color: number, x: number, y: number, z: number, top: number, bottom: number, height: number, segments = 12) {
  return kit.solid(new THREE.CylinderGeometry(top, bottom, height, segments), color, x, y, z);
}

export function line(kit: Kit, color: number, a: [number, number, number], b: [number, number, number], width = 0.06, depth = width) {
  beam(kit, color, a, b, width, depth);
}

export function paving(kit: Kit, x0: number, x1: number, z0: number, z1: number, tile = 0.8, stone = 0xcbbf9f, grout = 0x9f9275) {
  kit.box(stone, (x0 + x1) / 2, 0.075, (z0 + z1) / 2, x1 - x0, 0.15, z1 - z0);
  for (let x = x0 + tile; x < x1; x += tile) kit.box(grout, x, 0.155, (z0 + z1) / 2, 0.025, 0.015, z1 - z0);
  for (let z = z0 + tile; z < z1; z += tile) kit.box(grout, (x0 + x1) / 2, 0.155, z, x1 - x0, 0.015, 0.025);
}

export function flower(kit: Kit, x: number, z: number, scale = 1, bloom = 0xe7bd42) {
  kit.box(0x76513a, x, 0.2 * scale, z, 0.58 * scale, 0.4 * scale, 0.58 * scale);
  kit.box(0x5c432f, x, 0.42 * scale, z, 0.64 * scale, 0.08 * scale, 0.64 * scale);
  kit.box(0x355d38, x, 0.62 * scale, z, 0.46 * scale, 0.35 * scale, 0.46 * scale);
  for (let i = 0; i < 5; i++) {
    const a = i * Math.PI * 0.4;
    kit.box(i % 2 ? bloom : 0xe97e67, x + Math.cos(a) * 0.22 * scale, 0.85 * scale + (i % 2) * 0.08, z + Math.sin(a) * 0.22 * scale, 0.16 * scale, 0.12 * scale, 0.16 * scale);
  }
}

export function wallLamp(kit: Kit, x: number, y: number, z: number, facing = 0) {
  const c = Math.cos(facing);
  const s = Math.sin(facing);
  kit.box(0x34312b, x, y + 0.24, z, 0.12, 0.12, 0.26, 0, facing);
  kit.box(0x34312b, x + s * 0.15, y + 0.12, z + c * 0.15, 0.05, 0.32, 0.05, 0, facing);
  kit.box(0x34312b, x + s * 0.28, y, z + c * 0.28, 0.28, 0.05, 0.26, 0, facing);
  kit.litBox(0xf4d078, x + s * 0.28, y - 0.15, z + c * 0.28, 0.18, 0.24, 0.18, 0, facing);
  kit.box(0x34312b, x + s * 0.28, y - 0.29, z + c * 0.28, 0.24, 0.04, 0.24, 0, facing);
}

export function shrub(kit: Kit, x: number, z: number, size = 1, color = 0x4d8145) {
  kit.box(0x76513a, x, 0.18 * size, z, 0.62 * size, 0.36 * size, 0.62 * size);
  kit.box(color, x, 0.55 * size, z, 0.76 * size, 0.56 * size, 0.76 * size);
  kit.box(0x659554, x - 0.16 * size, 0.76 * size, z + 0.12 * size, 0.4 * size, 0.36 * size, 0.4 * size);
  kit.box(0x3e6e3d, x + 0.16 * size, 0.75 * size, z - 0.12 * size, 0.4 * size, 0.32 * size, 0.4 * size);
}
