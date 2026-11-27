import * as THREE from "three";
import type { Kit } from "./kit";
import { beam } from "./services-parts";

export function militaryTank(kit: Kit, x: number, z: number, paint = 0x58664e) {
  const { box, solid } = kit;
  box(0x30352e, x, 0.48, z, 2.25, 0.72, 3.35);
  for (const side of [-1, 1]) {
    box(0x252a26, x + side * 0.92, 0.56, z, 0.22, 0.82, 3.7);
    for (let i = 0; i < 6; i++) {
      const rz = z - 1.35 + i * 0.54;
      const wheel = solid(new THREE.CylinderGeometry(0.31, 0.31, 0.18, 10), 0x55584c, x + side * 1.01, 0.52, rz);
      wheel.rotation.z = Math.PI / 2;
      box(0x77776a, x + side * 1.12, 0.52, rz, 0.04, 0.06, 0.28);
    }
    box(0x919079, x + side * 1.07, 0.93, z, 0.06, 0.06, 3.3);
  }
  box(paint, x, 1.12, z - 0.12, 1.9, 0.78, 2.7);
  box(0x68765b, x, 1.56, z + 0.15, 1.55, 0.18, 2.2);
  const turret = solid(new THREE.CylinderGeometry(0.72, 0.82, 0.55, 8), paint, x, 1.7, z + 0.2);
  turret.rotation.y = Math.PI / 8;
  box(0x777b64, x, 1.99, z + 0.2, 0.44, 0.16, 0.5);
  beam(kit, 0x4c5546, [x, 1.79, z + 0.45], [x, 1.79, z + 2.15], 0.22);
  box(0x30352e, x, 1.82, z + 2.17, 0.28, 0.26, 0.22);
  for (const side of [-1, 1]) {
    box(0x8c8d78, x + side * 0.58, 1.12, z + 1.25, 0.35, 0.1, 0.18);
    box(0x29302a, x + side * 0.67, 1.25, z + 0.5, 0.18, 0.14, 0.12);
    box(0xd0b85d, x + side * 0.62, 1.32, z - 1.25, 0.16, 0.12, 0.1);
  }
  box(0x6f765e, x - 0.35, 2.14, z - 0.1, 0.16, 0.07, 0.42);
}

export function militaryTruck(kit: Kit, x: number, z: number, paint = 0x6d7656) {
  const { box, litBox } = kit;
  box(0x252a26, x, 0.36, z, 1.65, 0.55, 3.3);
  for (const side of [-1, 1]) for (const pz of [-1.0, 0.85]) {
    const wheel = kit.solid(new THREE.CylinderGeometry(0.34, 0.34, 0.2, 10), 0x252522, x + side * 0.82, 0.38, z + pz);
    wheel.rotation.z = Math.PI / 2;
    box(0x828177, x + side * 0.94, 0.38, z + pz, 0.04, 0.06, 0.28);
  }
  box(paint, x, 0.86, z - 0.25, 1.55, 0.74, 1.6);
  box(paint, x, 1.26, z + 0.88, 1.5, 1.25, 1.1);
  box(0x9ca08d, x, 1.37, z + 0.91, 1.15, 0.58, 0.05);
  box(0x394b4a, x, 1.36, z + 0.96, 0.98, 0.42, 0.04);
  box(0x343b34, x - 0.58, 1.38, z + 1.0, 0.06, 0.45, 0.05);
  box(0x343b34, x + 0.58, 1.38, z + 1.0, 0.06, 0.45, 0.05);
  for (const side of [-1, 1]) {
    box(0xd8c975, x + side * 0.68, 0.9, z + 1.36, 0.16, 0.16, 0.12);
    box(0x4d5744, x + side * 0.79, 0.88, z + 0.25, 0.08, 0.42, 0.95);
  }
  box(0x3d4538, x, 1.29, z - 0.98, 1.35, 0.12, 1.15);
  for (let px = -0.55; px <= 0.55; px += 0.27) box(0x959582, x + px, 1.52, z - 1.0, 0.06, 0.48, 0.06);
  for (const sx of [-0.45, 0.45]) {
    box(0x252a26, x + sx, 1.7, z + 0.55, 0.07, 0.55, 0.07);
    box(0x59604d, x + sx, 1.98, z + 0.55, 0.48, 0.07, 0.07);
  }
  litBox(0xf0c66b, x, 0.7, z + 1.63, 0.12, 0.1, 0.05);
}

export function ammoCrate(kit: Kit, x: number, z: number, y = 0.42, color = 0x927247) {
  const { box } = kit;
  box(color, x, y, z, 0.82, 0.78, 0.72);
  box(0x594a35, x, y + 0.4, z, 0.88, 0.06, 0.78);
  for (const dx of [-0.27, 0, 0.27]) box(0x6f5a3b, x + dx, y, z + 0.37, 0.07, 0.72, 0.04);
  box(0xc0a465, x, y + 0.42, z - 0.04, 0.34, 0.04, 0.04);
  box(0x444239, x, y - 0.12, z, 0.8, 0.08, 0.69);
}

export function perimeterFence(kit: Kit, x0: number, x1: number, z0: number, z1: number, y = 2.0, step = 0.8) {
  const { box } = kit;
  for (const x of [x0, x1]) {
    for (let z = z0; z <= z1 + 0.01; z += step) {
      box(0x5c6358, x, y / 2, z, 0.1, y, 0.1);
      box(0x7d8475, x, y + 0.05, z, 0.16, 0.12, 0.16);
    }
    for (let z = z0 + step / 2; z < z1; z += step) {
      box(0x737b70, x, y / 2, z, 0.035, y - 0.12, 0.035);
      box(0x737b70, x + 0.11, y / 2, z, 0.035, y - 0.12, 0.035);
    }
    box(0x555c53, x, 0.22, (z0 + z1) / 2, 0.13, 0.12, z1 - z0);
    box(0x555c53, x, y - 0.15, (z0 + z1) / 2, 0.13, 0.12, z1 - z0);
  }
  for (const z of [z0, z1]) {
    for (let x = x0; x <= x1 + 0.01; x += step) {
      box(0x5c6358, x, y / 2, z, 0.1, y, 0.1);
      box(0x7d8475, x, y + 0.05, z, 0.16, 0.12, 0.16);
    }
    box(0x555c53, (x0 + x1) / 2, 0.22, z, x1 - x0, 0.12, 0.13);
    box(0x555c53, (x0 + x1) / 2, y - 0.15, z, x1 - x0, 0.12, 0.13);
  }
}

export function barbedWire(kit: Kit, x: number, z: number, length: number, alongX = true, y = 5.2) {
  const half = length / 2;
  const step = 0.45;
  for (let p = -half; p < half; p += step) {
    const p2 = Math.min(half, p + step);
    const a: [number, number, number] = alongX ? [x + p, y + (Math.floor((p + half) / step) % 2) * 0.14, z] : [x, y + (Math.floor((p + half) / step) % 2) * 0.14, z + p];
    const b: [number, number, number] = alongX ? [x + p2, y + (Math.floor((p2 + half) / step) % 2) * 0.14, z] : [x, y + (Math.floor((p2 + half) / step) % 2) * 0.14, z + p2];
    beam(kit, 0x8b8d82, a, b, 0.025);
    if (Math.abs(p % 0.9) < 0.03) {
      const c: [number, number, number] = alongX ? [x + p, y + 0.13, z - 0.11] : [x - 0.11, y + 0.13, z + p];
      const d: [number, number, number] = alongX ? [x + p, y - 0.13, z + 0.11] : [x + 0.11, y - 0.13, z + p];
      beam(kit, 0x8b8d82, c, d, 0.025);
    }
  }
}
