import * as THREE from "three";
import type { Kit } from "./kit";
import { face, door, detailedWindow, wallLamp, bench, plant } from "./services-parts";
import { flag } from "./government-a-parts";

export function buildNewspaper(kit: Kit) {
  const { box, solid } = kit;
  box(0xb7ad99, 0, 0.09, 0, 11.7, 0.18, 7.7);
  box(0xf0ede2, 0, 2.1, -0.5, 9.5, 3.85, 5.7);
  box(0xbeb79f, 0, 0.28, -0.5, 9.62, 0.28, 5.82);
  box(0x6d7780, 0, 4.08, -0.5, 9.75, 0.18, 5.95);
  box(0x39464b, 0, 4.22, -0.5, 9.4, 0.16, 5.6);
  box(0xf4f1e5, 0, 4.52, -0.5, 9.6, 0.42, 5.8);
  box(0x7d8790, 0, 4.73, -0.5, 9.8, 0.12, 6.0);
  const F = face(kit, 0, 2.38, 0);
  door(F, 0, 0.36, 1.25, 2.35, { leaf: 0x93483a, frame: 0xe8e2d2, trim: 0x3f4e50, double: true, glazed: true, glass: 0x78999e });
  for (const x of [-3.7,-2.45,2.45,3.7]) detailedWindow(F,x,1.9,0.9,1.25,{shutter:0x6c7f70,lintel:0xece7d7});
  wallLamp(F,-1.15,2.55); wallLamp(F,1.15,2.55);
  box(0x34484e,0,3.25,2.42,5.4,0.62,0.12);
  box(0xf1eee2,0,3.25,2.5,5.1,0.38,0.04);
  box(0x8b3b31,0,3.25,2.54,2.55,0.07,0.02);
  for (const x of [-4.15,4.15]) for (const z of [-3.25,2.25]) box(0xe1dccb,x,2.05,z,0.24,3.7,0.24);
  for (const x of [-4.15,4.15]) box(0xa34d3a,x,4.25,-0.5,0.32,0.22,5.9);
  for (const z of [-3.25,2.25]) box(0xa34d3a,0,4.25,z,8.5,0.22,0.32);
  for (const x of [-3.8,-2.3,2.3,3.8]) {
    solid(new THREE.CylinderGeometry(0.42,0.42,1.05,12),0xd9d2bd,x,0.72,3.5);
    box(0x8d8a7d,x,0.74,3.5,0.08,0.08,1.1,0,Math.PI/2);
  }
  box(0x6d6f68,-4.15,0.75,3.48,0.18,1.1,0.18); box(0x6d6f68,-4.15,1.28,3.48,0.7,0.12,0.12);
  box(0x4d6f83,4.55,0.52,2.8,2.65,0.75,1.2);
  box(0x3e5e70,4.55,0.88,2.8,1.55,0.45,1.22);
  box(0x9db0af,4.55,1.02,2.8,1.22,0.28,1.24);
  for (const dx of [-0.82,0.82]) for (const dz of [-0.68,0.68]) solid(new THREE.CylinderGeometry(0.25,0.25,0.18,10),0x252925,4.55+dx,0.34,2.8+dz).rotation.z=Math.PI/2;
  box(0xc9c3ae,3.75,0.44,2.8,0.35,0.35,1.05);
  box(0x9b3a31,3.75,0.78,2.8,0.38,0.18,1.05);
  box(0xe9e5d8,-4.8,0.4,1.2,1.05,0.38,0.75);
  box(0xb8b39f,-4.8,0.78,1.2,1.12,0.06,0.82);
  bench(kit,-2.7,3.25,0.18,1.6,0); bench(kit,2.7,3.25,0.18,1.6,0);
  flag(kit,5.05,-3.25,0,5.2);
  plant(kit,-5.15,-3.25,0.12,0x9c5b3b,[0xd8434f,0xe3c53e],0.65);
  plant(kit,5.15,-3.25,0.12,0x9c5b3b,[0xd8434f,0xe3c53e],0.65);
}
