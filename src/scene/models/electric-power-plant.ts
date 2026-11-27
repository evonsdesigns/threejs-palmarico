import * as THREE from "three";
import type { Kit } from "./kit";

function beam(kit: Kit, color: number, a: [number, number, number], b: [number, number, number], thickness = 0.08) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const dz = b[2] - a[2];
  const length = Math.hypot(dx, dy, dz);
  const yaw = Math.asin(Math.max(-1, Math.min(1, dx / length)));
  const pitch = Math.atan2(-dy, dz);
  kit.box(color, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2, thickness, thickness, length, pitch, yaw);
}

export function buildElectricPowerPlant(kit: Kit) {
  const { box, solid, window } = kit;
  const brick = 0x7d4638;
  const brickLight = 0x985442;
  const cream = 0xd8c8a9;
  const roof = 0x687d75;

  box(0x756b58, 0, 0.08, 0, 19.7, 0.16, 15.7);
  box(0x8e846d, 0, 0.16, 0, 18.9, 0.12, 14.9);
  for (let x = -9.2; x < 9.3; x += 0.55) box(0x706753, x, 0.235, 0, 0.035, 0.025, 14.6);
  for (let z = -7.2; z < 7.3; z += 0.55) box(0x706753, 0, 0.235, z, 18.5, 0.025, 0.035);

  box(0xaaa18d, 0, 0.48, 0, 16.8, 0.5, 9.0);
  box(0x897f6c, 0, 0.76, 0, 16.4, 0.12, 8.6);
  box(0x6a4432, 0, 2.85, -0.55, 15.8, 4.15, 7.4);
  box(0xbaa66e, 0, 0.98, 3.18, 15.85, 0.38, 0.18);
  box(0xc9b77f, 0, 0.59, 3.18, 15.9, 0.12, 0.22);
  box(0xa78a59, 0, 4.92, -0.55, 16.0, 0.25, 7.65);
  box(brick, 0, 2.95, 3.22, 15.7, 4.1, 0.12);
  box(brick, 0, 2.95, -4.28, 15.7, 4.1, 0.12);
  for (const x of [-7.55, 7.55]) {
    box(cream, x, 2.9, -0.53, 0.22, 4.25, 7.6);
    for (let z = -3.5; z <= 2.5; z += 1.5) box(0x4c3b31, x + Math.sign(x) * 0.14, 2.75, z, 0.08, 2.5, 0.72);
  }
  for (const x of [-6.4, -4.3, -2.2, 0, 2.2, 4.3, 6.4]) {
    for (const z of [3.31, -4.36]) {
      box(0x523c31, x, 2.9, z, 1.16, 2.8, 0.08);
      box(0xc7d1c5, x, 2.9, z + Math.sign(z) * 0.06, 0.92, 2.45, 0.06);
      box(0x6f8279, x, 2.9, z + Math.sign(z) * 0.1, 0.72, 2.22, 0.04);
      box(0xd0c3a5, x, 2.9, z + Math.sign(z) * 0.13, 0.08, 2.25, 0.04);
      box(0xd0c3a5, x, 2.9, z + Math.sign(z) * 0.13, 0.75, 0.09, 0.04);
      box(0xb7a984, x, 1.49, z + Math.sign(z) * 0.15, 1.32, 0.13, 0.28);
    }
  }
  for (const x of [-7.75, -5.2, -2.6, 0, 2.6, 5.2, 7.75]) {
    box(0xd4c59f, x, 2.9, 3.34, 0.14, 4.1, 0.18);
    for (let y = 1.1; y < 4.9; y += 0.48) box(0x9a7452, x, y, 3.43, 0.24, 0.045, 0.02);
  }

  for (const x of [-5.9, -3.4, -0.9, 1.6, 4.1, 6.6]) {
    window(x, 3.0, 3.43, 0.95, 1.85, 0);
    for (const side of [-1, 1]) box(0xbaa66e, x + side * 0.62, 3.0, 3.49, 0.13, 2.2, 0.18);
  }
  for (const x of [-6.3, -3.15, 0, 3.15, 6.3]) {
    for (const z of [-3.55, -1.2, 1.15]) {
      box(0xb59056, x, 5.12, z, 0.52, 0.16, 0.52);
      solid(new THREE.CylinderGeometry(0.16, 0.19, 0.9, 10), 0x4c5a54, x, 5.65, z);
      box(0x48534e, x, 6.13, z, 0.66, 0.12, 0.66);
    }
  }

  for (const x of [-5.2, 0, 5.2]) {
    const arch = new THREE.CylinderGeometry(3.55, 3.55, 5.1, 18, 1, true, Math.PI, Math.PI);
    arch.rotateZ(Math.PI / 2);
    const shell = solid(arch, roof, x, 6.18, -0.55);
    shell.material.side = THREE.DoubleSide;
    for (let z = -3.45; z <= 2.35; z += 0.42) {
      box(0x546a63, x, 6.1, z, 5.0, 0.08, 0.075);
    }
    box(0x495c57, x, 8.1, -0.55, 5.0, 0.12, 0.18);
  }
  for (const x of [-7.7, -2.7, 2.3, 7.3]) {
    box(0x98907e, x, 5.15, -0.55, 0.36, 0.25, 7.9);
    box(0xb4a78b, x, 5.39, -0.55, 0.2, 0.18, 7.4);
  }

  for (const x of [-1.25, 1.25]) {
    const chimney = solid(new THREE.CylinderGeometry(0.74, 1.0, 13.0, 12), 0x713b2f, x, 7.1, 2.55);
    chimney.scale.set(1, 1, 1);
    for (let y = 1.25; y < 13.9; y += 0.58) {
      const radius = 0.78 + (y / 13.0) * 0.17;
      solid(new THREE.CylinderGeometry(radius + 0.025, radius + 0.035, 0.12, 12, 1, true), y % 1.16 < 0.58 ? brickLight : 0x53352d, x, y, 2.55);
    }
    solid(new THREE.CylinderGeometry(1.05, 0.95, 0.28, 12), 0x49332d, x, 13.72, 2.55);
    solid(new THREE.CylinderGeometry(0.7, 0.7, 0.07, 12, 1, true), 0x252b29, x, 13.88, 2.55);
    box(0x403633, x, 14.0, 2.55, 1.15, 0.12, 1.15);
    for (let y = 1.2; y < 13.4; y += 1.45) {
      box(0x58392e, x + 0.48, y, 2.55, 0.08, 0.44, 0.08);
      box(0x58392e, x + 0.48, y - 0.19, 2.55, 0.32, 0.05, 0.08);
    }
  }
  for (const x of [-1.25, 1.25]) {
    for (let y = 1.4; y < 11.6; y += 0.8) {
      box(0x47372f, x, y, 3.02, 0.92, 0.07, 0.16);
      box(0xc3b27a, x, y + 0.36, 3.03, 0.94, 0.06, 0.14);
    }
  }

  for (const x of [-6.4, -3.6, 3.7, 6.5]) {
    const tank = solid(new THREE.CylinderGeometry(1.0, 1.0, 3.4, 14), 0x9c9b8c, x, 1.95, -5.55);
    tank.material.roughness = 0.78;
    solid(new THREE.CylinderGeometry(1.0, 0.72, 0.45, 14), 0xa9a48d, x, 3.87, -5.55);
    box(0x777a72, x, 0.35, -5.55, 2.2, 0.28, 2.2);
    for (let a = 0; a < 8; a++) {
      const ang = (a / 8) * Math.PI * 2;
      box(0x7f857d, x + Math.cos(ang) * 0.94, 2.0, -5.55 + Math.sin(ang) * 0.94, 0.05, 2.8, 0.05);
    }
    box(0x626963, x, 3.3, -5.55, 0.16, 0.9, 0.16);
    box(0x8e8d80, x, 4.15, -5.55, 0.9, 0.12, 0.9);
  }

  for (const x of [-8.0, -5.5, -3.0, 3.0, 5.5, 8.0]) {
    box(0x585a55, x, 0.92, 4.45, 0.14, 1.5, 0.14);
    box(0xd1c8b4, x, 1.68, 4.45, 0.2, 0.13, 0.2);
  }
  for (const z of [3.45, 5.45]) {
    box(0x51534e, 0, 1.42, z, 17.4, 0.12, 0.12);
    for (let x = -8.2; x <= 8.2; x += 0.45) box(0x52534e, x, 1.0, z, 0.04, 0.95, 0.04);
  }
  for (const x of [-8.3, 8.3]) for (const z of [-4.3, 4.3]) {
    box(0x756b58, x, 1.0, z, 0.28, 2.0, 0.28);
    box(0xf0d579, x, 2.15, z, 0.36, 0.32, 0.36);
    box(0x373832, x, 2.34, z, 0.42, 0.08, 0.42);
  }

  for (const x of [-7.8, 7.8]) {
    const px = x;
    for (const [dx, y] of [[0, 7.2], [-0.9, 5.7], [0.9, 5.7], [-1.5, 3.7], [1.5, 3.7]] as const) {
      box(0x646a67, px + dx, y, -0.2, 0.13, 0.13, 0.13);
    }
    for (const y of [2.4, 4.6, 6.7]) {
      beam(kit, 0x646a67, [px - 1.6, y, -0.2], [px + 1.6, y, -0.2], 0.13);
      beam(kit, 0x646a67, [px - 1.5, 2.4, -0.2], [px + 1.5, 4.6, -0.2], 0.08);
      beam(kit, 0x646a67, [px + 1.5, 2.4, -0.2], [px - 1.5, 4.6, -0.2], 0.08);
    }
    beam(kit, 0x646a67, [px, 2.5, -0.2], [px, 7.6, -0.2], 0.16);
    for (const dz of [-0.7, 0.7]) beam(kit, 0xb9b8ad, [px + dz, 7.25, -0.2], [px - Math.sign(x) * 5 + dz, 6.7, -0.2], 0.035);
  }
}
