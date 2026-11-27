import * as THREE from "three";
import type { Kit } from "./kit";
import { cylinder, line, paving } from "./entertainment-b-parts";

export function buildLargeFountain(kit: Kit) {
  const { box, solid } = kit;
  const stone = 0xd0c6ae;
  const trim = 0x96876c;
  const water = 0x4a91a0;
  paving(kit, -3.9, 3.9, -3.9, 3.9, 0.72, 0xd4c7a8, 0x9f9072);
  for (const x of [-3.35, 3.35]) for (const z of [-3.35, 3.35]) box(0xb4a27f, x, 0.18, z, 0.82, 0.22, 0.82);
  for (const x of [-3.45, 3.45]) {
    box(0xe4dac2, x, 0.23, 0, 0.7, 0.18, 1.35);
    box(0x9b8a6d, x, 0.36, 0, 0.72, 0.1, 1.38);
  }

  cylinder(kit, trim, 0, 0.42, 0, 3.34, 3.08, 0.62, 32);
  cylinder(kit, stone, 0, 0.76, 0, 3.28, 3.38, 0.1, 32);
  const basin = solid(new THREE.CircleGeometry(3.0, 48), water, 0, 0.83, 0);
  basin.rotation.x = -Math.PI / 2;
  cylinder(kit, 0x907f63, 0, 0.92, 0, 2.1, 2.28, 0.25, 24);
  cylinder(kit, stone, 0, 1.08, 0, 2.06, 2.2, 0.12, 24);
  const lower = solid(new THREE.CircleGeometry(1.82, 40), water, 0, 1.16, 0);
  lower.rotation.x = -Math.PI / 2;
  cylinder(kit, 0x8e7c5e, 0, 1.43, 0, 1.2, 1.4, 0.42, 20);
  cylinder(kit, stone, 0, 1.66, 0, 1.18, 1.31, 0.12, 20);
  const middle = solid(new THREE.CircleGeometry(1.04, 32), water, 0, 1.74, 0);
  middle.rotation.x = -Math.PI / 2;
  cylinder(kit, 0x897757, 0, 2.0, 0, 0.63, 0.77, 0.42, 16);
  cylinder(kit, stone, 0, 2.23, 0, 0.61, 0.72, 0.12, 16);
  const upper = solid(new THREE.CircleGeometry(0.49, 24), water, 0, 2.3, 0);
  upper.rotation.x = -Math.PI / 2;
  cylinder(kit, stone, 0, 2.52, 0, 0.22, 0.36, 0.3, 12);
  cylinder(kit, 0x917d5e, 0, 2.72, 0, 0.4, 0.25, 0.12, 16);
  const crown = solid(new THREE.CircleGeometry(0.36, 24), water, 0, 2.79, 0);
  crown.rotation.x = -Math.PI / 2;

  for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4;
    const x0 = Math.cos(a) * 0.23;
    const z0 = Math.sin(a) * 0.23;
    const x1 = Math.cos(a) * 2.42;
    const z1 = Math.sin(a) * 2.42;
    line(kit, 0x9fe0dd, [x0, 2.94, z0], [x1, 0.96, z1], 0.055, 0.055);
    const splash = solid(new THREE.SphereGeometry(0.12, 8, 6), 0xb4e4dd, x1, 1.0, z1);
    splash.scale.set(1.25, 0.55, 1.25);
  }
  for (let i = 0; i < 6; i++) {
    const a = i * Math.PI / 3;
    const x = Math.cos(a) * 0.25;
    const z = Math.sin(a) * 0.25;
    line(kit, 0xb3e6e2, [x, 2.86, z], [x * 0.72, 3.53, z * 0.72], 0.04, 0.04);
  }
  solid(new THREE.ConeGeometry(0.22, 0.82, 8), 0x89c9ce, 0, 3.15, 0);
  for (let i = 0; i < 16; i++) {
    const a = i * Math.PI / 8;
    box(i % 2 ? 0x9a8b70 : 0xe6dcc4, Math.cos(a) * 3.32, 0.36, Math.sin(a) * 3.32, 0.12, 0.16, 0.12);
  }
}
