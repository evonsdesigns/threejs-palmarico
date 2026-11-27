import * as THREE from "three";
import type { Kit } from "./kit";
import { palm } from "./mid-housing-parts";

export function buildBeachSite(kit: Kit) {
  const { box, solid } = kit;
  box(0xd9be78, 0, 0.02, 0, 11.75, 0.04, 11.75);
  box(0xc9a85f, 0, 0.06, 5.55, 11.75, 0.06, 0.75);
  for (let x=-5.5;x<=5.5;x+=0.55) box(0xe5ca85,x,0.09,5.55,0.025,0.01,0.7);
  for (const z of [-4.8,-2.7,-0.6,1.5,3.4]) for (let x=-5.3;x<5.3;x+=0.65) box(0xdfbd70,x,0.09,z,0.025,0.01,0.025);
  // changing huts along the back
  for (let i=0;i<4;i++) {
    const x=-4.2+i*2.45;
    box(0xf1e7ce,x,1.55,-4.55,2.05,2.9,1.8);
    box(0xe86a55,x,1.55,-4.55,2.12,0.35,1.86);
    box(0x9f4d38,x,3.05,-4.55,2.25,0.12,2.0);
    box(0xd86a45,x,3.25,-4.55,2.45,0.12,2.15,0.08);
    box(0xe6dfc8,x,1.2,-3.58,0.72,2.2,0.08);
    box(0x4b4b46,x+0.25,1.15,-3.54,0.07,0.08,0.06);
  }
  // lifeguard tower
  for (const x of [-4.7,-3.3]) for (const z of [2.5,3.55]) box(0x7b6b50,x,1.5,z,0.18,3.0,0.18);
  box(0xded4b3,-4,3.15,3.03,2.2,0.18,1.75);
  box(0xe4ead9,-4,4.25,3.03,1.9,1.8,1.35);
  box(0x4f7a9a,-4,4.32,3.72,1.65,1.28,0.08);
  box(0xc94b3e,-4,5.35,3.03,2.15,0.12,1.6);
  box(0xf3edcf,-4,5.48,3.03,0.5,0.18,0.5);
  // umbrellas and loungers
  const colors=[0x6c9bd1,0xe0bc42,0xd85d50,0x5aa0a0];
  for (let r=0;r<3;r++) for (let c=0;c<4;c++) {
    const x=-4.1+c*2.55+(r%2)*0.3,z=-1.7+r*2.15;
    box(0xe5dfc7,x-0.5,0.22,z,1.55,0.12,0.55,0,0.08);
    box(0xeef0e8,x-0.5,0.45,z-0.35,1.45,0.08,0.07,0.65);
    for(const dx of [-0.55,0.55]) box(0x8b7252,x-0.5+dx,0.22,z,0.07,0.18,0.07);
    box(0x8e7654,x+0.9,0.16,z,0.08,1.8,0.08);
    solid(new THREE.ConeGeometry(1.18,0.38,8,1,true),colors[(r*4+c)%colors.length],x+0.9,1.55,z);
    box(0xf1e8d3,x+0.9,1.85,z,0.12,0.12,0.12);
  }
  for (const [x,z,col] of [[-3.6,-0.2,0xe65a58],[0.2,0.6,0x4e91b7],[3.7,-1.0,0xe4bd42]]) {
    box(col,x,0.12,z,1.1,0.025,1.8,0,0.12);
    box(0xf1e6cd,x,0.14,z+0.05,0.28,0.02,0.9,0,0.12);
  }
  // small jetty over sea
  box(0x9a8061,4.7,0.12,4.0,1.8,0.24,4.0);
  for(let z=2.2;z<5.8;z+=0.8) for(const x of [4.0,5.4]) box(0x66543f,x,-1.45,z,0.14,3.0,0.14);
  for(let z=2.2;z<5.8;z+=0.45) box(0x7e694f,4.7,0.26,z,1.78,0.05,0.07);
  box(0xc78e45,4.7,0.55,5.72,2.0,0.12,0.12);
  palm(kit,-4.0,-2.8,3.2,0.45,-0.2);
  palm(kit,3.8,-3.9,3.0,0.42,0.2);
}
