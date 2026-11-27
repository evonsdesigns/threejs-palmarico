import type { Kit } from "./kit";
import { face, door, detailedWindow, wallLamp, plant } from "./services-parts";
import { radioMast, flag } from "./government-a-parts";

export function buildRadioStation(kit: Kit) {
  const { box } = kit;
  box(0xb7ad99,0,0.09,0,11.7,0.18,7.7);
  box(0xded8c5,-1.25,1.85,-0.25,8.4,3.25,5.7);
  box(0xaaa893,-1.25,0.32,-0.25,8.55,0.32,5.85);
  box(0x30383a,-1.25,3.58,-0.25,8.7,0.18,5.92);
  kit.gable(-1.25,-0.25,8.8,6.05,3.66,1.15,0x4b5557,7);
  for(const x of [-5.05,2.55]) for(const z of [-3.12,2.62]) box(0xe0dac8,x,1.9,z,0.24,3.35,0.24);
  const F=face(kit,-1.25,2.62,0);
  door(F,0,0.38,1.25,2.35,{leaf:0x3f5e68,frame:0xe9e3d3,trim:0x2f4a52,double:true,glazed:true,glass:0x7899a0});
  for(const x of [-3.35,-1.85,1.85,3.35]) detailedWindow(F,x,1.95,0.95,1.25,{shutter:0x66736a,louvers:0x43564d});
  wallLamp(F,-1.15,2.55);wallLamp(F,1.15,2.55);
  box(0x6c7775,-1.25,4.15,-0.25,7.2,0.12,4.65);
  box(0x444e4f,-1.25,4.28,-0.25,7.05,0.12,4.5);
  for(let x=-4.1;x<1.8;x+=0.65) box(0x626a67,x,4.45,-0.25,0.045,0.04,4.5);
  radioMast(kit,3.1,-1.4);
  flag(kit,-5.1,-3.05,0,5.0);
  for(const z of [-2.7,-1.8,-0.9,0]) box(0x59625f,-5.05,0.42,z,0.22,0.7,0.22);
  box(0x59625f,-5.05,0.75,-1.35,0.22,0.12,3.0);
  plant(kit,-5.45,-2.7,0.12,0x9c5b3b,[0x5f8f45,0xd8434f],0.65);
}
