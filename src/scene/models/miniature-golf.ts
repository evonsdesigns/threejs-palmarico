import * as THREE from "three";
import type { Kit } from "./kit";

export function buildMiniatureGolf(kit: Kit) {
  const {box,solid}=kit;
  box(0x6e8f43,0,0.04,0,15.6,0.08,11.6);
  box(0x4f6935,0,0.08,-0.2,14.8,0.04,10.8);
  box(0xd9c7a4,-5.8,0.16,4.9,3.8,0.18,1.4);
  // holes, borders and flags
  const holes=[[-5.8,-3.4],[-1.8,-3.0],[2.4,-3.5],[5.8,-1.0],[-5.2,0.8],[-0.8,1.0],[3.8,2.5]];
  for(let i=0;i<holes.length;i++) {
    const [x,z]=holes[i];
    box(0x91ad5c,x,0.12,z,3.15-(i%2)*0.25,0.05,2.0-(i%3)*0.2);
    for(const side of [-1,1]) box(0xe6dfbd,x+side*1.55,0.23,z,0.12,0.25,2.15);
    box(0xe6dfbd,x,0.23,z-1.05,3.2,0.25,0.12); box(0xe6dfbd,x,0.23,z+1.05,3.2,0.25,0.12);
    solid(new THREE.CylinderGeometry(0.16,0.16,0.02,12),0x292a27,x,0.18,z+0.55);
    box(0x7e6d4f,x,1.25,z+0.55,0.05,2.1,0.05);
    box(i%2?0xe26a4a:0x5e8db7,x+0.42,2.0,z+0.55,0.75,0.45,0.04);
  }
  // windmill
  box(0xf1e4c4,-1.8,0.35,-3.0,2.3,0.7,2.3); box(0xb64f3a,-1.8,1.9,-3.0,2.6,0.18,2.6);
  for(let i=0;i<4;i++){const a=i*Math.PI/2;box(0xf4f0dc,-1.8+Math.cos(a)*0.8,1.45,-3.0+Math.sin(a)*0.8,0.08,1.5,0.08);}
  box(0x9a4a36,-1.8,3.1,-3.0,1.1,2.1,1.1);
  box(0xe8d6a9,-1.8,4.22,-3.0,1.25,0.12,1.25);
  box(0x5b4c3d,-1.8,2.0,-2.42,0.14,1.8,0.14);
  for(let i=0;i<4;i++){const a=i*Math.PI/2;box(0xf2eee0,-1.8+Math.cos(a)*1.15,3.1,-2.42+Math.sin(a)*0.75,0.12,0.12,1.15,0, a);}
  // castle obstacle
  box(0xd0c29f,5.8,0.35,-1.0,2.2,1.4,2.0); box(0xa99c7d,5.8,1.15,-1.0,2.4,0.25,2.2);
  for(const dx of [-0.85,0.85]) for(const dz of [-0.75,0.75]) box(0xd7c7a6,5.8+dx,1.8,-1.0+dz,0.55,1.4,0.55);
  box(0x6b4d36,5.8,0.75,-0.02,0.85,1.5,0.08);
  // ramps and bridge
  box(0xb58d59,-5.2,0.28,0.8,2.8,0.12,0.75,0.18,0);
  box(0x8a7255,-5.2,0.35,0.8,0.12,0.3,0.9,0.18,0);
  box(0x8b7957,-0.8,0.75,1.0,3.6,0.18,1.3);
  for(let x=-2.3;x<1.0;x+=0.35) box(0x9d865f,x,0.9,1.0,0.08,0.05,1.25);
  for(const x of [-2.5,0.9]) box(0x5d4d3c,x,0.42,0.45,0.12,1.0,0.12);
  // kiosk
  box(0xe9dfc1,-6.2,1.15,4.9,2.7,2.3,1.5); box(0x4d7854,-6.2,2.45,4.9,3.0,0.18,1.8);
  box(0xf0c64c,-6.2,2.62,4.9,3.2,0.12,2.0);
  box(0x6a4a35,-6.2,1.25,5.68,1.25,1.45,0.08);
  box(0xe6a83b,-6.2,2.05,5.75,1.65,0.18,0.18);
}
