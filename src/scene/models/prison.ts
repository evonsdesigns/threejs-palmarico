import * as THREE from "three";
import type { Kit } from "./kit";
import { ammoCrate, barbedWire } from "./government-b-parts";
import { detailedWindow, door, face, wallLamp } from "./services-parts";

const CONCRETE = 0xaaa99a;
const LIGHT = 0xc9c5b5;
const DARK = 0x514f48;
const STEEL = 0x4c514e;

export function buildPrison(kit: Kit) {
  const { box, solid } = kit;
  box(0x88816f, 0, 0.05, 0, 15.7, 0.1, 11.7);
  box(0x706f68, 0, 0.14, 0, 14.8, 0.08, 10.8);
  box(0xb8b3a5, 0, 0.2, 2.85, 10.0, 0.06, 4.8);
  for (let x = -4.7; x <= 4.7; x += 0.55) box(0xaaa391, x, 0.24, 2.85, 0.03, 0.015, 4.75);

  // Cell block with barred slit windows, heavy doors, concrete bands and roof ventilation.
  box(0x6a6962, 0, 0.38, -1.9, 9.2, 0.42, 5.0);
  box(CONCRETE, 0, 2.45, -1.9, 8.8, 3.8, 4.65);
  box(0x8e8d82, 0, 0.88, -1.9, 8.96, 0.54, 4.8);
  box(DARK, 0, 1.17, -1.9, 9.0, 0.08, 4.86);
  box(LIGHT, 0, 4.22, -1.9, 9.0, 0.22, 4.85);
  box(0x676962, 0, 4.42, -1.9, 9.2, 0.16, 5.05);
  box(0x575a55, 0, 4.54, -1.9, 8.95, 0.08, 4.8);
  const F = face(kit, 0, 0.43, 0);
  for (const x of [-3.35, -1.9, -0.5, 0.5, 1.9, 3.35]) {
    box(0x8f8e84, x, 2.38, 0.47, 0.13, 3.65, 0.15);
  }
  for (const x of [-3.45, -2.05, -0.65, 0.65, 2.05, 3.45]) {
    box(0x454943, x, 2.58, 0.49, 0.84, 1.0, 0.1);
    box(0x393e3d, x, 2.58, 0.55, 0.68, 0.82, 0.04);
    for (let dx = -0.24; dx <= 0.25; dx += 0.16) box(0x9ca094, x + dx, 2.58, 0.59, 0.035, 0.82, 0.04);
    box(0xb9b8aa, x, 3.17, 0.55, 0.92, 0.12, 0.12);
    box(0x62645c, x, 0.85, 0.6, 0.95, 0.15, 0.35);
  }
  for (const x of [-3.5, -1.75, 1.75, 3.5]) {
    detailedWindow(F, x, 3.78, 0.58, 0.42, { lintel: LIGHT });
    for (let dx = -0.2; dx <= 0.21; dx += 0.14) box(STEEL, x + dx, 3.78, 0.64, 0.035, 0.48, 0.035);
  }
  door(F, 0, 0.38, 1.4, 2.35, { leaf: 0x52564f, frame: LIGHT, trim: 0x333632, handle: 0xaaa482, double: true });
  box(0x333733, 0, 2.95, 0.68, 1.15, 0.08, 0.04);
  box(0xb5b39f, 0, 3.03, 0.71, 0.22, 0.16, 0.04);
  wallLamp(F, -1.4, 3.0);
  wallLamp(F, 1.4, 3.0);
  const B = face(kit, 0, -4.23, Math.PI);
  for (const x of [-3.2, -1.6, 0, 1.6, 3.2]) {
    detailedWindow(B, x, 2.7, 0.62, 0.75);
    for (let dx = -0.2; dx < 0.21; dx += 0.13) box(STEEL, -x - dx, 2.7, -4.3, 0.04, 0.83, 0.04);
  }
  for (const x of [-4.43, 4.43]) {
    const side = face(kit, x, -1.9, x < 0 ? -Math.PI / 2 : Math.PI / 2);
    for (const z of [-1.4, 0, 1.4]) {
      detailedWindow(side, z, 2.8, 0.6, 0.68);
      for (let dx = -0.18; dx <= 0.19; dx += 0.13) side.put(STEEL, z + dx, 2.8, 0.22, 0.035, 0.76, 0.035);
    }
  }
  // Flat roof ribbing, vent housings, fan units and a small service ladder.
  box(0x51534f, 0, 4.7, -1.9, 9.0, 0.18, 4.85);
  box(0x79796e, 0, 4.82, -1.9, 8.75, 0.06, 4.65);
  for (let x = -4.0; x <= 4.0; x += 0.4) box(0x64665f, x, 4.87, -1.9, 0.035, 0.025, 4.5);
  for (const [x, z] of [[-3.1, -2.7], [-1.4, -2.7], [1.4, -2.7], [3.1, -2.7]]) {
    box(0x424743, x, 5.12, z, 0.82, 0.48, 0.72);
    box(0x777a70, x, 5.38, z, 0.94, 0.08, 0.82);
    for (const dx of [-0.2, 0, 0.2]) box(0x3c413f, x + dx, 5.5, z, 0.06, 0.18, 0.42);
  }
  for (let y = 0.6; y <= 4.4; y += 0.48) {
    box(0x50544f, 4.66, y, -3.2, 0.12, 0.06, 0.64);
    box(0x50544f, 4.72, y, -3.52, 0.05, 0.05, 0.05);
  }

  // High secure masonry perimeter with a controlled front gate and continuous razor-wire coils.
  const wallZ = 5.45;
  for (const x of [-7.45, -5.8, -4.15, -2.5, 2.5, 4.15, 5.8, 7.45]) {
    box(0x827f72, x, 1.68, wallZ, 1.4, 3.2, 0.48);
    box(0xb5b1a3, x, 3.35, wallZ, 1.45, 0.14, 0.55);
    for (const y of [0.55, 1.25, 2.0, 2.75]) box(0x747267, x, y, 5.2, 1.3, 0.04, 0.04);
  }
  box(0x827f72, -3.3, 1.68, wallZ, 1.55, 3.2, 0.48);
  box(0x827f72, 3.3, 1.68, wallZ, 1.55, 3.2, 0.48);
  for (const x of [-2.4, 2.4]) {
    box(0x575a54, x, 1.6, wallZ + 0.1, 0.12, 3.05, 0.1);
    box(0x697067, x, 1.6, wallZ + 0.12, 0.09, 2.85, 0.07);
    box(0x555952, x, 0.65, wallZ + 0.15, 0.24, 0.15, 0.18);
  }
  for (const [x, z, w, d] of [[-7.45, 0, 0.48, 10.8], [7.45, 0, 0.48, 10.8], [0, -5.45, 14.9, 0.48]] as const) {
    box(0x827f72, x, 1.68, z, w, 3.2, d);
    box(0xb5b1a3, x, 3.35, z, w + 0.12, 0.14, d + 0.12);
    for (const y of [0.55, 1.25, 2.0, 2.75]) box(0x747267, x, y, z, w + 0.1, 0.04, d + 0.1);
  }
  barbedWire(kit, 0, 5.45, 14.5, true, 3.55);
  barbedWire(kit, 0, -5.45, 14.5, true, 3.55);
  barbedWire(kit, -7.45, 0, 10.5, false, 3.55);
  barbedWire(kit, 7.45, 0, 10.5, false, 3.55);

  // Four elevated sentry towers with enclosed cabs, slit views, ladders and searchlights.
  for (const [x, z] of [[-6.25, -4.25], [6.25, -4.25], [-6.25, 4.1], [6.25, 4.1]]) {
    for (const dx of [-0.56, 0.56]) for (const dz of [-0.56, 0.56]) {
      box(0x565a54, x + dx, 2.2, z + dz, 0.15, 4.4, 0.15);
      for (let y = 0.4; y < 4.4; y += 0.44) box(0x6c7068, x + dx, y, z + dz, 0.21, 0.06, 0.21);
    }
    box(0x7d7b6e, x, 4.55, z, 1.5, 0.24, 1.5);
    box(0xbcb8a8, x, 5.55, z, 1.35, 1.8, 1.3);
    box(0x4b504c, x, 5.45, z, 1.4, 0.15, 1.4);
    for (const dx of [-0.42, 0.42]) box(0x454b4a, x + dx, 5.65, z + 0.67, 0.12, 0.38, 0.08);
    box(0x353a38, x, 6.05, z + 0.74, 0.42, 0.2, 0.12);
    box(0xe4c76d, x, 6.1, z + 0.88, 0.3, 0.14, 0.06);
    box(0x424844, x, 6.55, z, 1.68, 0.12, 1.68);
    for (let y = 0.85; y < 4.4; y += 0.45) box(0x505650, x + 0.78, y, z - 0.25, 0.04, 0.05, 0.5);
  }

  // Gravel exercise court, benches, basketball hoop and a small inmate plate-shop yard.
  box(0x989487, 0, 0.17, 2.85, 8.8, 0.12, 4.25);
  for (const x of [-3.3, -1.1, 1.1, 3.3]) {
    box(0x6c6358, x, 0.4, 2.25, 1.55, 0.1, 0.48);
    box(0x594f45, x - 0.58, 0.63, 2.25, 0.08, 0.52, 0.08);
    box(0x594f45, x + 0.58, 0.63, 2.25, 0.08, 0.52, 0.08);
  }
  box(0x4c514d, -5.0, 1.8, 1.2, 0.09, 3.4, 0.09);
  box(0x686b63, -5.0, 3.48, 1.2, 1.0, 0.08, 0.08);
  box(0x444843, -5.0, 3.12, 1.2, 0.68, 0.12, 0.52);
  box(0xc8c3b4, -5.0, 2.95, 1.2, 0.52, 0.08, 0.4);
  for (let x = -1.5; x <= 1.51; x += 0.6) {
    box(0x554f43, x, 0.82, 4.0, 0.62, 1.3, 0.54);
    box(0xaaa18d, x, 1.52, 4.0, 0.67, 0.08, 0.58);
    box(0x4e514e, x, 1.58, 4.0, 0.42, 0.025, 0.18);
  }
  for (const [x, z] of [[-5.8, -0.8], [5.8, -0.8]]) {
    for (const dz of [0, 0.6]) box(0x4e544e, x, 0.5, z + dz, 0.85, 0.9, 0.76);
    ammoCrate(kit, x, z + 0.3, 1.1, 0x8d7555);
  }
  for (const x of [-4.9, 4.9]) {
    solid(new THREE.CylinderGeometry(0.06, 0.09, 4.4, 8), 0x484c48, x, 2.2, 4.75);
    box(0x4a4e48, x, 4.5, 4.75, 0.72, 0.12, 0.18);
    kit.litBox(0xf2dfa0, x, 4.35, 4.75, 0.48, 0.14, 0.18);
  }
  box(0x434943, 0, 0.55, 5.08, 0.12, 1.1, 0.12);
  box(0x9f9b88, 0, 1.12, 5.08, 0.62, 0.22, 0.06);
  box(0x4c6a50, 0, 1.12, 5.11, 0.56, 0.18, 0.025);
}
