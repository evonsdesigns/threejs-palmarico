import * as THREE from "three";
import type { Kit } from "./kit";
import { palm } from "./mid-housing-parts";

export function buildMarina(kit: Kit) {
  const {box,solid}=kit;
  box(0x9e9b8d,0,0.04,-2.0,15.6,0.08,7.7);
  box(0xe6dfc9,-3.7,0.15,-2.0,7.5,0.3,5.0);
  box(0xe9e2cf,-3.7,1.7,-2.0,7.0,3.0,4.6);
  box(0x5f91a3,-3.7,0.72,-2.0,7.1,0.45,4.7);
  box(0xf1ead6,-3.7,3.3,-2.0,7.35,0.18,4.95);
  box(0xb46943,-3.7,3.55,-2.0,7.8,0.16,5.3);
  for(const x of [-6.25,-4.9,-3.55,-2.2,-1.1]) box(0x526e6b,x,1.85,0.34,1.05,1.25,0.06);
  box(0x6d4e36,-3.7,1.15,0.34,1.25,2.3,0.12);
  box(0xc9b16f,-3.3,1.1,0.42,0.07,0.08,0.06);
  for(const x of [-6.7,-0.7]) box(0xf1ead6,x,1.8,0.55,0.22,3.0,0.22);
  // floating docks
  for(const z of [1.05,3.15,5.05]) {
    box(0x8b7355,-0.2,0.05,z,10.8,0.18,1.15);
    for(let x=-5.0;x<5.2;x+=0.65) box(0x695943,x,0.16,z,0.055,0.04,1.05);
  }
  box(0x8b7355,5.75,0.05,3.05,1.0,0.18,5.3);
  for(let z=0.8;z<5.4;z+=0.7) box(0x695943,5.75,0.16,z,0.9,0.04,0.055);
  // pilings
  for(const z of [-0.2,2.0,4.0,5.6]) for(const x of [-5.2,-1.8,1.7,5.0]) box(0x6b5742,x,-1.5,z,0.16,3.1,0.16);
  // yachts/sailboats
  for(const [x,z,body] of [[-3.8,1.05,0xf1eddf],[1.4,3.15,0xdedabf],[4.0,4.9,0xe9e5d4]]) {
    box(body,x,-0.9,z,3.2,0.55,0.82); solid(new THREE.ConeGeometry(0.82,2.0,3),body,x,-0.35,z);
    box(0x4d6571,x,-0.75,z+0.43,1.2,0.32,0.05);
    box(0x2d2d29,x,1.0,z,0.08,3.1,0.08);
    solid(new THREE.ConeGeometry(1.2,2.15,3),0xf5eee0,x+0.75,0.65,z);
  }
  box(0xdedabf,-0.4,-0.9,5.05,2.6,0.5,0.75);
  box(0x4f7e91,-0.4,-0.72,5.05,1.2,0.28,0.05);
  // clubhouse details and palms
  for(const x of [-6.5,-5.8,-1.2,-0.5]) box(0x3f4140,x,0.25,-4.35,0.12,0.5,0.12);
  palm(kit,-6.2,-4.1,3.6,0.48,-0.15); palm(kit,-0.2,-4.0,3.2,0.42,0.2);
}
