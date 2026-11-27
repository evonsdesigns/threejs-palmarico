import * as THREE from "three";
import type { Kit } from "./kit";
import { cylinder, line, paving } from "./entertainment-b-parts";

export function buildSmallFountain(kit: Kit) {
  const { box, solid } = kit;
  const stone = 0xcac1ab;
  const trim = 0x9b8d72;
  const water = 0x468d9a;
  paving(kit, -1.9, 1.9, -1.9, 1.9, 0.48, 0xd5c8ac, 0x9b8d72);
  for (const x of [-1.6, 1.6]) for (const z of [-1.6, 1.6]) box(0xe4d9bd, x, 0.19, z, 0.48, 0.2, 0.48);
  cylinder(kit, trim, 0, 0.35, 0, 1.65, 1.48, 0.48, 16);
  cylinder(kit, stone, 0, 0.6, 0, 1.55, 1.64, 0.1, 16);
  const surface = solid(new THREE.CircleGeometry(1.38, 32), water, 0, 0.67, 0);
  surface.rotation.x = -Math.PI / 2;
  cylinder(kit, 0x806e54, 0, 0.78, 0, 0.43, 0.5, 0.24, 12);
  cylinder(kit, stone, 0, 0.98, 0, 0.35, 0.44, 0.2, 12);
  cylinder(kit, 0x9b8a6c, 0, 1.16, 0, 0.22, 0.3, 0.18, 12);
  cylinder(kit, stone, 0, 1.34, 0, 0.36, 0.2, 0.15, 12);
  solid(new THREE.CylinderGeometry(0.35, 0.35, 0.08, 16), water, 0, 1.44, 0);
  cylinder(kit, 0x897957, 0, 1.55, 0, 0.1, 0.16, 0.18, 10);
  for (let i = 0; i < 4; i++) {
    const a = i * Math.PI / 2 + Math.PI / 4;
    const x = Math.cos(a) * 0.68;
    const z = Math.sin(a) * 0.68;
    line(kit, 0x98dce0, [x, 0.8, z], [x * 0.72, 1.48, z * 0.72], 0.045, 0.045);
    const droplet = solid(new THREE.SphereGeometry(0.075, 8, 6), 0xafe2df, x * 0.72, 1.48, z * 0.72);
    droplet.scale.set(0.65, 1.5, 0.65);
  }
  for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4;
    box(0xe9e1d0, Math.cos(a) * 1.54, 0.64, Math.sin(a) * 1.54, 0.1, 0.16, 0.1);
  }
}
