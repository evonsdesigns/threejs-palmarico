import * as THREE from "three";
import type { Kit } from "./kit";
import { face, door, detailedWindow, wallLamp, bench, plant } from "./services-parts";
import { flag, policeCar } from "./government-a-parts";

export function buildPoliceStation(kit: Kit) {
  const { box } = kit;
  box(0xb8b09c,0,0.09,0,11.7,0.18,11.7);
  box(0xcfcbbd,0,1.95,-0.25,9.15,3.5,8.15);
  box(0xa8a28e,0,0.25,-0.25,9.28,0.32,8.28);
  box(0x7c3933,0,3.65,-0.25,9.45,0.18,8.45);
  kit.gable(0,-0.25,9.55,8.55,3.78,1.35,0x3d4f61,9);
  for(const x of [-4.35,4.35]) for(const z of [-4.25,3.75]) box(0xe7e1d1,x,2.05,z,0.24,3.55,0.24);
  for(const x of [-4.35,4.35]) box(0xddd7c6,x,3.85,-0.25,0.28,0.18,8.1);
  const F=face(kit,0,4.05,0);
  door(F,0,0.38,1.25,2.35,{leaf:0x3b5d78,frame:0xe9e4d6,trim:0x29475e,double:true,glazed:true,glass:0x799da4});
  for(const x of [-3.25,-1.75,1.75,3.25]) detailedWindow(F,x,1.95,1.05,1.25,{shutter:0x66766a,louvers:0x42564d});
  wallLamp(F,-1.15,2.55);wallLamp(F,1.15,2.55);
  box(0x3e4f5d,0,3.1,4.12,4.15,0.45,0.12);
  box(0xf1eee2,0,3.1,4.19,3.82,0.22,0.04);
  box(0x7a2f2a,-3.55,0.85,4.82,2.2,0.12,1.15);
  box(0x7a2f2a,3.55,0.85,4.82,2.2,0.12,1.15);
  policeCar(kit,-2.75,3.85,Math.PI); policeCar(kit,2.75,3.85,Math.PI);
  box(0x1f302f,-4.95,1.02,-3.5,1.15,1.15,0.15);
  box(0x758789,-4.95,1.05,-3.62,0.9,0.82,0.04);
  for(let i=-2;i<=2;i++) box(0xbfc4b8,-4.95+i*0.18,1.05,-3.66,0.055,0.7,0.02);
  box(0x4b5050,-4.95,0.95,-3.72,0.08,1.4,0.08);
  kit.solid(new THREE.CylinderGeometry(0.18,0.18,3.2,8),0x4b5050,-5.2,1.7,-4.55);
  kit.litBox(0xe0c77a,-5.2,3.35,-4.55,0.36,0.42,0.36);
  flag(kit,4.65,-4.75,0,5.7);
  bench(kit,-3.25,5.35,0.18,1.7,0); bench(kit,3.25,5.35,0.18,1.7,0);
  plant(kit,-5.15,-4.95,0.12,0x9c5b3b,[0xd8434f,0xe3c53e],0.7);
  plant(kit,4.85,-4.95,0.12,0x9c5b3b,[0xd8434f,0xe3c53e],0.7);
}
