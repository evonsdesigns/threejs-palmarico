import { Kit } from "./kit";
import { acUnit, antenna, downspout, Face, laundry, makeFace, railing, shutters, waterTank } from "./blocks-common";

// Body spans x [-7, 7], z [-5, 4.2]; footprint x [-8, 8], z [-6, 6].
const HW = 7;
const FRONT = 4.2;
const BACK = -5;
const CZ = (FRONT + BACK) / 2;
const HD = (FRONT - BACK) / 2;
const LEVELS = [0.6, 3.8, 7.0, 10.2];
const TOP = 13.4;

const BRICK = 0xa6573b;
const STUCCO = 0xe9c98d;
const STUCCO_LIGHT = 0xece3cd;
const TRIM = 0xa34b3e;
const STONE = 0xd9cfb9;
const SHUTTER = 0x668374;
const SLAT = 0x56705f;
const IRON = 0x3a3633;
const ROOF = 0x92908a;

export function buildApartment(kit: Kit) {
  const { box } = kit;
  const front = makeFace(kit, 0, FRONT, 0);
  const right = makeFace(kit, HW, CZ, Math.PI / 2);
  const back = makeFace(kit, 0, BACK, Math.PI);
  const left = makeFace(kit, -HW, CZ, -Math.PI / 2);

  // Foundation, plinth and pavement apron.
  box(0x9a968b, 0, 0.04, -0.1, 15.9, 0.08, 11.7);
  box(0x7f786c, 0, 0.32, CZ, HW * 2 + 0.5, 0.56, HD * 2 + 0.5);
  box(0x6d665b, 0, 0.62, CZ, HW * 2 + 0.3, 0.06, HD * 2 + 0.3);

  // Ground floor in brick, upper floors in stucco.
  box(BRICK, 0, (LEVELS[0] + LEVELS[1]) / 2, CZ, HW * 2, LEVELS[1] - LEVELS[0], HD * 2);
  box(STUCCO, 0, (LEVELS[1] + TOP) / 2, CZ, HW * 2, TOP - LEVELS[1], HD * 2);
  // Rusticated base band and brick coursing accents.
  box(0x8f4a33, 0, 0.85, CZ, HW * 2 + 0.08, 0.5, HD * 2 + 0.08);
  for (let y = 1.3; y < 3.7; y += 0.6) box(0x93492f, 0, y, CZ, HW * 2 + 0.03, 0.04, HD * 2 + 0.03);

  // Red string courses at each floor, with a cream drip under each.
  for (const y of LEVELS.slice(1)) {
    box(TRIM, 0, y, CZ, HW * 2 + 0.36, 0.26, HD * 2 + 0.36);
    box(STUCCO_LIGHT, 0, y - 0.19, CZ, HW * 2 + 0.2, 0.12, HD * 2 + 0.2);
  }
  // Sill band under upper windows.
  for (const y of LEVELS.slice(1)) box(0xddb97f, 0, y + 0.62, CZ, HW * 2 + 0.06, 0.08, HD * 2 + 0.06);

  // Main roof cornice, frieze and dentils.
  box(TRIM, 0, TOP - 0.55, CZ, HW * 2 + 0.12, 0.3, HD * 2 + 0.12);
  box(STUCCO_LIGHT, 0, TOP - 0.18, CZ, HW * 2 + 0.6, 0.18, HD * 2 + 0.6);
  box(STUCCO_LIGHT, 0, TOP + 0.0, CZ, HW * 2 + 0.75, 0.16, HD * 2 + 0.75);
  for (let u = -HW + 0.2; u <= HW - 0.2; u += 0.42) {
    front.fb(0xe4d8bd, u, TOP - 0.34, 0.15, 0.16, 0.14, 0.24);
    back.fb(0xe4d8bd, u, TOP - 0.34, 0.15, 0.16, 0.14, 0.24);
  }
  for (let u = -HD + 0.2; u <= HD - 0.2; u += 0.42) {
    right.fb(0xe4d8bd, u, TOP - 0.34, 0.15, 0.16, 0.14, 0.24);
    left.fb(0xe4d8bd, u, TOP - 0.34, 0.15, 0.16, 0.14, 0.24);
  }

  // Corner pilasters and front pilasters flanking the stair bay.
  for (const x of [-HW, HW]) for (const z of [FRONT, BACK]) {
    box(STUCCO_LIGHT, x, (LEVELS[1] + TOP) / 2, z, 0.55, TOP - LEVELS[1], 0.55);
    box(0x8f4a33, x, (LEVELS[0] + LEVELS[1]) / 2, z, 0.58, LEVELS[1] - LEVELS[0], 0.58);
    for (let y = 1.0; y < 3.6; y += 0.55) box(0x7d3f2b, x, y, z, 0.62, 0.06, 0.62);
  }
  for (const u of [-1.15, 1.15]) {
    front.fb(STUCCO_LIGHT, u, (LEVELS[1] + TOP) / 2, 0.12, 0.42, TOP - LEVELS[1], 0.24);
    front.fb(TRIM, u, TOP - 0.85, 0.27, 0.5, 0.3, 0.1);
    for (const y of LEVELS.slice(1)) front.fb(0xd5c8ad, u, y + 0.25, 0.25, 0.5, 0.2, 0.1);
  }
  // Recessed light panel for the stair bay.
  front.fb(0xe9dcc0, 0, (LEVELS[1] + TOP) / 2, 0.05, 1.9, TOP - LEVELS[1] - 0.3, 0.1);

  frontFacade(front);
  sideFacade(right, true);
  sideFacade(left, false);
  backFacade(back);
  entrance(front);
  roof(kit);
  groundProps(front, back, right);
}

function upperWindow(f: Face, u: number, level: number, open: number, color = SHUTTER, slat = SLAT, w = 1.0) {
  const y = level + 1.5;
  f.win(u, y, 0.05, w, 1.5);
  f.fb(STUCCO_LIGHT, u, y + 0.98, 0.08, w + 0.45, 0.2, 0.14);
  f.fb(0xe8ddc6, u, y + 1.12, 0.12, 0.3, 0.14, 0.12);
  shutters(f, u, y, w, 1.5, color, slat, open);
}

function frontFacade(f: Face) {
  const opens = [0.9, 1.1, 1.0, 0.95, 1.15];
  let k = 0;
  for (const [fi, L] of LEVELS.slice(1).entries()) {
    for (const u of [-2.4, 2.4]) upperWindow(f, u, L, opens[k++ % opens.length]);
    for (const u of [-6.15, 6.15]) upperWindow(f, u, L, 1.3, SHUTTER, SLAT, 0.85);
    // Stair-bay window, tall and narrow.
    f.win(0, L + 1.7, 0.15, 0.62, 1.8);
    f.fb(TRIM, 0, L + 2.85, 0.15, 0.95, 0.16, 0.12);
    // Balconies.
    for (const u of [-4.35, 4.35]) {
      const doorY = L + 1.25;
      f.fb(0xe4ddca, u, doorY, 0.04, 1.25, 2.45, 0.08);
      f.fb(0x3f5553, u, doorY - 0.05, 0.09, 1.02, 2.25, 0.05);
      f.fb(0xdcd6c7, u, doorY - 0.05, 0.13, 0.07, 2.25, 0.04);
      for (const dy of [-0.45, 0.45]) f.fb(0xdcd6c7, u, doorY + dy, 0.13, 1.0, 0.06, 0.04);
      f.fb(STUCCO_LIGHT, u, L + 2.62, 0.08, 1.5, 0.2, 0.14);
      // Slab, fascia and console brackets.
      f.fb(0xd8cdb5, u, L + 0.02, 0.62, 2.0, 0.2, 1.25);
      f.fb(TRIM, u, L - 0.03, 1.25, 2.06, 0.16, 0.06);
      for (const side of [-0.85, 0.85]) {
        f.fb(0xcfc3a7, u + side, L - 0.3, 0.35, 0.16, 0.36, 0.7);
        f.fb(0xcfc3a7, u + side, L - 0.52, 0.12, 0.16, 0.2, 0.25);
      }
      // Wrought-iron railing with scroll bars.
      railing(f, u - 0.95, u + 0.95, L + 0.1, 1.17, 0.95, IRON, 0.16, 0.035);
      f.fb(IRON, u, L + 0.6, 1.17, 1.9, 0.035, 0.035);
      for (const side of [-0.95, 0.95]) {
        f.fb(IRON, u + side, L + 1.05, 0.62, 0.06, 0.06, 1.1);
        for (let n = 0.15; n < 1.15; n += 0.2) f.fb(IRON, u + side, L + 0.58, n, 0.035, 0.95, 0.035);
      }
      // Balcony life: plants, chair, drying rack or AC.
      const variant = (fi + (u > 0 ? 1 : 0)) % 3;
      if (variant === 0) {
        f.fb(0xb06a42, u - 0.7, L + 0.32, 0.85, 0.32, 0.3, 0.32);
        f.fb(0x4f7a3a, u - 0.7, L + 0.65, 0.85, 0.45, 0.4, 0.45);
        f.fb(0xb06a42, u + 0.75, L + 0.3, 0.9, 0.28, 0.26, 0.28);
        f.fb(0x6a9a45, u + 0.75, L + 0.58, 0.9, 0.36, 0.34, 0.36);
        f.fb(0x9a8967, u + 0.1, L + 0.45, 0.65, 0.5, 0.06, 0.5);
        f.fb(0x9a8967, u + 0.1, L + 0.75, 0.42, 0.5, 0.6, 0.06);
      } else if (variant === 1) {
        for (const n of [0.4, 0.8]) f.fb(0x9c9e97, u, L + 1.05, n, 1.6, 0.03, 0.03);
        laundry(f, u - 0.8, u + 0.8, L + 1.05, 0.4, fi * 7 + 3, 0.45);
        f.fb(0x9c9e97, u - 0.8, L + 0.6, 0.6, 0.04, 0.95, 0.04);
        f.fb(0x9c9e97, u + 0.8, L + 0.6, 0.6, 0.04, 0.95, 0.04);
      } else {
        f.fb(0xb06a42, u + 0.75, L + 0.3, 0.9, 0.3, 0.28, 0.3);
        f.fb(0xc8486a, u + 0.75, L + 0.6, 0.9, 0.42, 0.36, 0.42);
        f.fb(0x3e6b3a, u + 0.75, L + 0.6, 0.85, 0.3, 0.3, 0.3);
        acUnit(f, u - 0.55, L + 0.42, 0.05);
      }
      // Laundry draped over the rail.
      if (fi === 1) f.fb(u > 0 ? 0xc2493f : 0x3f6d9a, u + 0.3, L + 0.85, 1.22, 0.7, 0.45, 0.05);
    }
  }
  // AC units hung under a couple of windows.
  acUnit(f, 6.15, 7.0 + 0.45, 0.05);
  acUnit(f, -2.4, 10.2 + 0.45, 0.05);
  acUnit(f, 2.4, 3.8 + 0.45, 0.05);

  // Ground floor windows with iron grilles and stone lintels.
  for (const u of [-6.3, -4.35, -2.4, 2.4, 4.35, 6.3]) {
    const y = 2.2;
    f.win(u, y, 0.05, 1.0, 1.4);
    f.fb(STONE, u, y + 0.92, 0.07, 1.5, 0.28, 0.16);
    f.fb(0xece3cd, u, y + 0.92, 0.16, 0.3, 0.3, 0.06);
    for (let i = 0; i < 6; i++) f.fb(IRON, u - 0.5 + i * 0.2, y, 0.32, 0.035, 1.55, 0.035);
    for (const dy of [-0.65, 0, 0.65]) f.fb(IRON, u, y + dy, 0.32, 1.1, 0.035, 0.035);
    if (Math.abs(u) > 3) {
      f.fb(0x815b36, u, y - 0.98, 0.35, 1.05, 0.22, 0.3);
      for (let i = -2; i <= 2; i++) f.fb(i % 2 ? 0xd8584f : 0x5d8a43, u + i * 0.2, y - 0.8, 0.35, 0.2, 0.2, 0.22);
    }
  }
  // Weather streaks below a few sills.
  for (const [u, L] of [[-6.3, 3.8], [2.4, 7.0], [6.3, 10.2], [-2.4, 7.0]] as const) {
    f.fb(0xd4b07a, u + 0.3, L + 0.25, 0.01, 0.12, 0.5, 0.02);
    f.fb(0xd4b07a, u - 0.25, L + 0.15, 0.01, 0.08, 0.7, 0.02);
  }
}

function sideFacade(f: Face, isRight: boolean) {
  const opens = isRight ? [0.9, 1.2, 1.0, 1.4] : [1.1, 0.95, 1.3, 1.0];
  let k = 0;
  for (const [fi, L] of LEVELS.slice(1).entries()) {
    for (const u of [-3.1, -1.05, 1.05, 3.1]) {
      upperWindow(f, u, L, opens[k++ % opens.length], SHUTTER, SLAT, 0.9);
      if ((fi + Math.round(u)) % 3 === 0) acUnit(f, u, L + 0.45, 0.05);
    }
  }
  for (const u of [-3.1, -1.05, 3.1]) {
    f.win(u, 2.2, 0.05, 1.0, 1.4);
    f.fb(STONE, u, 3.12, 0.07, 1.5, 0.28, 0.16);
    for (let i = 0; i < 6; i++) f.fb(IRON, u - 0.5 + i * 0.2, 2.2, 0.32, 0.035, 1.55, 0.035);
    f.fb(IRON, u, 2.2, 0.32, 1.1, 0.035, 0.035);
  }
  // Service door with hood and step.
  f.fb(STONE, 1.0, 1.95, 0.04, 1.35, 2.7, 0.1);
  f.fb(0x755b43, 1.0, 1.85, 0.1, 1.05, 2.45, 0.06);
  for (const dy of [-0.6, 0.5]) f.fb(0x604a39, 1.0, 1.85 + dy, 0.14, 0.8, 0.8, 0.03);
  f.fb(0xc9b16f, 1.35, 1.8, 0.16, 0.08, 0.08, 0.06);
  f.fb(TRIM, 1.0, 3.35, 0.4, 1.6, 0.12, 0.8);
  f.fb(0x9f9a8d, 1.0, 0.3, 0.45, 1.5, 0.3, 0.9);
  // Downspouts near both corners, utility meters, wiring.
  downspout(f, -4.3, TOP - 0.2, 0.28);
  downspout(f, 4.3, TOP - 0.2, 0.28);
  if (isRight) {
    f.fb(0x85867c, -2.0, 1.6, 0.12, 0.7, 0.9, 0.22);
    f.fb(0x5b5e5a, -2.0, 1.6, 0.24, 0.5, 0.6, 0.03);
    f.fb(0xd8d2c2, -2.0, 1.75, 0.26, 0.2, 0.2, 0.02);
    f.fb(0x2a2a28, -2.0, 7.5, 0.08, 0.05, 11.5, 0.05);
    f.fb(0x2a2a28, -2.4, 12.6, 0.08, 0.8, 0.05, 0.05);
    for (let y = 2.4; y < 13; y += 2.4) f.fb(0x6a6458, -2.0, y, 0.06, 0.12, 0.1, 0.12);
  } else {
    // Painted-over patch and a faded advertisement panel on the blind side.
    f.fb(0xe2d3a9, -2.0, 9.0, 0.02, 2.2, 1.3, 0.02);
    f.fb(0xc94a3a, 2.0, 2.2, 0.03, 0.8, 0.6, 0.03);
    f.fb(0xf1eee6, 2.0, 2.2, 0.05, 0.55, 0.12, 0.02);
  }
}

function backFacade(f: Face) {
  const opens = [0.9, 1.2, 1.0, 1.35, 0.95];
  let k = 0;
  for (const [fi, L] of LEVELS.slice(1).entries()) {
    for (const u of [-6.0, -4.3, -2.4, 2.4, 4.3, 6.0]) {
      upperWindow(f, u, L, Math.abs(u) > 5 ? 1.25 : opens[k % opens.length], 0x537a9a, 0x456a85, 0.85);
      k++;
      if ((k + fi) % 4 === 0) acUnit(f, u, L + 0.45, 0.05);
    }
    f.win(0, L + 1.7, 0.05, 0.62, 1.8);
    // Small Juliet rails on the middle windows.
    for (const u of [-4.3, 4.3]) railing(f, u - 0.55, u + 0.55, L + 0.62, 0.3, 0.5, IRON, 0.15, 0.03);
  }
  // Laundry strung between the rear windows on pulleys.
  laundry(f, -6.6, -2.1, 9.6, 0.9, 11);
  laundry(f, 2.1, 6.6, 6.4, 0.9, 5);
  for (const [u0, y] of [[-6.6, 9.6], [-2.1, 9.6], [2.1, 6.4], [6.6, 6.4]] as const) {
    f.fb(0x6a6458, u0, y, 0.45, 0.06, 0.06, 0.9);
  }
  for (const u of [-6.0, -4.3, -2.4, 2.4, 4.3, 6.0]) {
    f.win(u, 2.2, 0.05, 1.0, 1.4);
    f.fb(STONE, u, 3.12, 0.07, 1.5, 0.28, 0.16);
    for (let i = 0; i < 6; i++) f.fb(IRON, u - 0.5 + i * 0.2, 2.2, 0.32, 0.035, 1.55, 0.035);
  }
  // Back door with steps.
  f.fb(STONE, 0, 1.95, 0.04, 1.5, 2.75, 0.1);
  f.fb(0x755b43, 0, 1.85, 0.1, 1.15, 2.45, 0.06);
  f.fb(TRIM, 0, 3.4, 0.4, 1.8, 0.12, 0.8);
  f.fb(0x9f9a8d, 0, 0.3, 0.45, 1.8, 0.3, 0.9);
  downspout(f, -1.3, TOP - 0.2, 0);
  downspout(f, 1.3, TOP - 0.2, 0);
}

function entrance(f: Face) {
  // Steps down to the street.
  for (let i = 0; i < 3; i++) {
    const top = 0.6 - i * 0.2;
    const n1 = 0.6 + i * 0.4;
    f.fb(i % 2 ? 0xb9b2a2 : 0xc4bdad, 0, top / 2, n1 / 2, 3.0 + i * 0.3, top, n1);
  }
  // Cheek walls with lamp posts.
  for (const side of [-1, 1]) {
    f.fb(0xa8a191, side * 1.75, 0.45, 0.8, 0.3, 0.9, 1.6);
    f.fb(STONE, side * 1.75, 0.95, 0.8, 0.38, 0.1, 1.68);
  }
  // Stone surround, double doors, transom.
  f.fb(STONE, 0, 2.05, 0.05, 2.3, 2.95, 0.12);
  f.fb(0x2b2522, 0, 1.9, 0.09, 1.8, 2.6, 0.05);
  for (const side of [-1, 1]) {
    f.fb(0x755b43, side * 0.43, 1.85, 0.13, 0.82, 2.45, 0.06);
    for (const dy of [-0.65, 0.45]) f.fb(0x604a39, side * 0.43, 1.85 + dy, 0.17, 0.6, 0.85, 0.03);
    f.fb(0x3f5553, side * 0.43, 2.3, 0.18, 0.4, 0.5, 0.02);
    f.fb(0xc9b16f, side * 0.1, 1.8, 0.2, 0.06, 0.25, 0.05);
  }
  f.fb(0x3f5553, 0, 3.32, 0.12, 1.7, 0.3, 0.04);
  for (let i = -3; i <= 3; i++) f.fb(0xdcd6c7, i * 0.24, 3.32, 0.15, 0.04, 0.3, 0.03);
  // Canopy on slender columns.
  f.fb(0xd8cdb5, 0, 3.6, 0.85, 3.4, 0.16, 1.7);
  f.fb(TRIM, 0, 3.6, 1.72, 3.46, 0.26, 0.06);
  for (const side of [-1, 1]) {
    f.fb(TRIM, side * 1.72, 3.6, 0.85, 0.06, 0.26, 1.7);
    f.fb(STUCCO_LIGHT, side * 1.5, 1.8, 1.5, 0.2, 3.5, 0.2);
    f.fb(STONE, side * 1.5, 0.1, 1.5, 0.34, 0.2, 0.34);
    f.fb(STONE, side * 1.5, 3.45, 1.5, 0.3, 0.14, 0.3);
    // Wall lamps.
    f.fb(0x3a3633, side * 1.4, 2.7, 0.12, 0.08, 0.3, 0.2);
    f.fb(0xf4e2a3, side * 1.4, 2.7, 0.28, 0.18, 0.28, 0.18);
  }
  // Name plaque, intercom and mailboxes.
  f.fb(0xd6c79a, 0, 3.9 + 0.55, 0.12, 1.4, 0.4, 0.05);
  f.fb(TRIM, 0, 3.9 + 0.55, 0.15, 1.1, 0.12, 0.02);
  f.fb(0x85867c, 1.3, 1.6, 0.12, 0.2, 0.35, 0.06);
  for (let i = 0; i < 3; i++) f.fb(0x537a9a, -1.38, 1.3 + i * 0.25, 0.14, 0.18, 0.2, 0.12);
}

function roof(kit: Kit) {
  const { box } = kit;
  const r0 = TOP + 0.08;
  // Roof deck with tar patches and drains.
  box(ROOF, 0, r0 - 0.04, CZ, HW * 2 - 0.1, 0.1, HD * 2 - 0.1);
  for (const [x, z, w, d] of [[-3.5, 1.5, 2.4, 1.2], [3.8, -1.8, 1.6, 2.2], [0.5, -3.4, 3, 0.9]] as const) {
    box(0x6b6a64, x, r0 + 0.015, z, w, 0.02, d);
  }
  for (const [x, z] of [[-6.4, -4.4], [6.4, -4.4], [-6.4, 3.6], [6.4, 3.6]] as const) box(0x3a3a37, x, r0 + 0.02, z, 0.35, 0.03, 0.35);

  // Parapet with red coping and corner piers.
  const ph = 0.95;
  const t = 0.3;
  box(STUCCO, 0, r0 + ph / 2, FRONT - t / 2, HW * 2, ph, t);
  box(STUCCO, 0, r0 + ph / 2, BACK + t / 2, HW * 2, ph, t);
  box(STUCCO, HW - t / 2, r0 + ph / 2, CZ, t, ph, HD * 2);
  box(STUCCO, -HW + t / 2, r0 + ph / 2, CZ, t, ph, HD * 2);
  box(TRIM, 0, r0 + ph + 0.06, FRONT - t / 2, HW * 2 + 0.15, 0.12, t + 0.15);
  box(TRIM, 0, r0 + ph + 0.06, BACK + t / 2, HW * 2 + 0.15, 0.12, t + 0.15);
  box(TRIM, HW - t / 2, r0 + ph + 0.06, CZ, t + 0.15, 0.12, HD * 2 + 0.15);
  box(TRIM, -HW + t / 2, r0 + ph + 0.06, CZ, t + 0.15, 0.12, HD * 2 + 0.15);
  for (const x of [-HW, HW]) for (const z of [FRONT, BACK]) {
    box(STUCCO_LIGHT, x, r0 + 0.6, z, 0.6, 1.2, 0.6);
    box(TRIM, x, r0 + 1.25, z, 0.72, 0.14, 0.72);
  }
  // Balustrade panels inset in the front parapet.
  for (const x of [-4.35, 4.35]) {
    box(0xe8ddc6, x, r0 + 0.45, FRONT + 0.02, 2.2, 0.5, 0.04);
    for (let dx = -0.9; dx <= 0.9; dx += 0.3) box(TRIM, x + dx, r0 + 0.45, FRONT + 0.05, 0.1, 0.4, 0.04);
  }
  // Raised pediment over the stair bay.
  box(STUCCO_LIGHT, 0, r0 + 0.85, FRONT - 0.1, 2.7, 1.7, 0.4);
  box(TRIM, 0, r0 + 1.76, FRONT - 0.1, 2.95, 0.16, 0.55);
  box(TRIM, 0, r0 + 1.95, FRONT - 0.1, 1.2, 0.24, 0.45);
  box(0xd6c79a, 0, r0 + 1.0, FRONT + 0.12, 1.5, 0.55, 0.04);
  for (const dx of [-0.45, 0, 0.45]) box(TRIM, dx, r0 + 1.0, FRONT + 0.15, 0.25, 0.3, 0.02);

  // Stair bulkhead with door, vent and light.
  const bx = 0;
  const bz = 1.9;
  box(STUCCO, bx, r0 + 1.25, bz, 2.8, 2.5, 2.6);
  box(TRIM, bx, r0 + 2.55, bz, 3.0, 0.14, 2.8);
  box(0x737b77, bx, r0 + 2.68, bz, 2.9, 0.12, 2.7);
  box(STONE, bx + 1.42, r0 + 1.1, bz - 0.2, 0.08, 2.2, 1.2);
  box(0x755b43, bx + 1.46, r0 + 1.05, bz - 0.2, 0.06, 2.05, 0.95);
  box(0xc9b16f, bx + 1.5, r0 + 1.0, bz + 0.15, 0.05, 0.08, 0.08);
  box(0xf4e2a3, bx + 1.5, r0 + 2.3, bz - 0.2, 0.12, 0.16, 0.2);
  box(0x9f9a8d, bx + 1.65, r0 + 0.08, bz - 0.2, 0.4, 0.16, 1.2);
  kit.window(bx - 1.43, r0 + 1.5, bz, 0.7, 0.6, -Math.PI / 2);
  for (let i = 0; i < 4; i++) box(0x5b5e5a, bx - 0.4 + i * 0.27, r0 + 2.9, bz - 0.6, 0.06, 0.3, 0.06);

  // Water tanks: black polyethylene and older galvanized.
  waterTank(kit, -4.6, r0, -2.6, 0.85, 1.5, 0x343b3c, 1.0);
  waterTank(kit, -2.4, r0, -3.1, 0.7, 1.3, 0xd8d2c2, 0.8);
  // Pipes from tanks to the bulkhead.
  box(0x6c6a62, -2.6, r0 + 0.2, -1.2, 0.08, 0.08, 3.4);
  box(0x6c6a62, -1.3, r0 + 0.2, 0.4, 2.6, 0.08, 0.08);

  // Plumbing vents, mushroom vents and exhaust stacks.
  for (const [x, z] of [[5.8, 2.9], [2.4, -4.0], [-5.8, 0.4], [-0.8, -1.6], [6.1, -2.0]] as const) {
    box(0x6f736c, x, r0 + 0.45, z, 0.16, 0.9, 0.16);
    box(0x5b5e5a, x, r0 + 0.93, z, 0.3, 0.08, 0.3);
  }
  for (const [x, z] of [[-6.0, 2.6], [1.6, -2.9]] as const) {
    box(0xbab5a8, x, r0 + 0.35, z, 0.6, 0.7, 0.6);
    box(0x85867c, x, r0 + 0.8, z, 0.8, 0.2, 0.8);
  }
  // Rooftop AC condensers.
  for (const x of [3.2, 4.6]) {
    box(0x5b5e5a, x, r0 + 0.08, -3.9, 1.2, 0.16, 0.9);
    box(0xc9c6b8, x, r0 + 0.6, -3.9, 1.1, 0.9, 0.8);
    box(0x3c3e3c, x, r0 + 0.6, -3.48, 0.7, 0.7, 0.03);
    box(0x8a8c86, x, r0 + 1.06, -3.9, 0.5, 0.03, 0.5);
  }
  // Antennas.
  antenna(kit, 5.9, r0, 3.2, 3.0, 0.4);
  antenna(kit, -5.9, r0, -4.2, 2.6, -0.3);
  antenna(kit, 0.8, r0 + 2.74, 2.6, 1.6, 0.9);

  // Laundry lines on the roof terrace.
  for (const z of [0.3, -1.3]) {
    for (const x of [1.9, 6.2]) {
      box(0x7a7d77, x, r0 + 0.95, z, 0.08, 1.9, 0.08);
      box(0x7a7d77, x, r0 + 1.85, z, 0.08, 0.06, 0.6);
    }
    laundry(makeFace(kit, 0, z, 0), 1.9, 6.2, r0 + 1.82, 0, z > 0 ? 17 : 29);
  }
  // Terrace furniture and potted plants.
  box(0x9a8967, -4.0, r0 + 0.4, 1.6, 0.6, 0.06, 0.6);
  box(0x9a8967, -4.0, r0 + 0.7, 1.32, 0.6, 0.6, 0.06);
  box(0x9a8967, -3.2, r0 + 0.35, 2.4, 0.9, 0.06, 0.9);
  box(0x7d6b55, -3.2, r0 + 0.17, 2.4, 0.08, 0.34, 0.08);
  for (const [x, z, c] of [[-6.1, 3.5, 0x4f7a3a], [-5.4, 3.5, 0x6a9a45], [-2.2, 3.5, 0x3e6b3a]] as const) {
    box(0xb06a42, x, r0 + 0.22, z, 0.45, 0.44, 0.45);
    box(c, x, r0 + 0.65, z, 0.6, 0.55, 0.6);
  }
  // Skylight hatch.
  box(0xbab5a8, -1.0, r0 + 0.2, -3.6, 1.2, 0.4, 1.0);
  box(0x6a8c96, -1.0, r0 + 0.43, -3.6, 1.0, 0.06, 0.8);
}

function groundProps(front: Face, back: Face, right: Face) {
  // Planters and shrubs along the street front.
  for (const u of [-5.3, -3.3, 3.3, 5.3]) {
    front.fb(0xb9b2a2, u, 0.35, 1.0, 1.0, 0.5, 0.7);
    front.fb(0x5d4a36, u, 0.62, 1.0, 0.9, 0.06, 0.6);
    front.fb(0x4f7a3a, u, 0.95, 1.0, 0.8, 0.6, 0.55);
    front.fb(0x6a9a45, u + 0.2, 1.25, 1.0, 0.45, 0.4, 0.4);
  }
  // Bench and a bicycle by the door.
  front.fb(0x9a8967, -7.0, 0.5, 1.2, 1.4, 0.08, 0.45);
  front.fb(0x9a8967, -7.0, 0.8, 1.0, 1.4, 0.4, 0.06);
  for (const du of [-0.6, 0.6]) front.fb(IRON, -7.0 + du, 0.25, 1.2, 0.08, 0.5, 0.4);
  for (const du of [-0.45, 0.45]) {
    front.fb(0x2a2a28, 7.0 + du, 0.35, 1.35, 0.7, 0.7, 0.05);
    front.fb(0x8a8c86, 7.0 + du, 0.35, 1.35, 0.55, 0.55, 0.06);
  }
  front.fb(0xc2493f, 7.0, 0.65, 1.35, 0.9, 0.06, 0.06);
  front.fb(0xc2493f, 6.75, 0.5, 1.35, 0.06, 0.4, 0.06);
  front.fb(0x2a2a28, 6.75, 0.75, 1.35, 0.3, 0.06, 0.1);
  // Street lamp.
  front.fb(0x3a3633, 2.45, 1.6, 1.6, 0.12, 3.2, 0.12);
  front.fb(0x3a3633, 2.45, 0.12, 1.6, 0.35, 0.24, 0.35);
  front.fb(0x3a3633, 2.45, 3.25, 1.3, 0.08, 0.08, 0.6);
  front.fb(0xf4e2a3, 2.45, 3.1, 1.05, 0.25, 0.3, 0.25);
  // Rear bins and gas bottles.
  for (const [u, c] of [[-3.2, 0x4d6b4a], [-2.3, 0x4d6b4a], [3.0, 0x56606a]] as const) {
    back.fb(c, u, 0.55, 0.6, 0.75, 1.1, 0.7);
    back.fb(0x2f3a2e, u, 1.13, 0.6, 0.8, 0.06, 0.75);
  }
  for (const u of [5.0, 5.4]) {
    back.fb(0xc2493f, u, 0.45, 0.4, 0.3, 0.9, 0.3);
    back.fb(0x8a8c86, u, 0.95, 0.4, 0.12, 0.1, 0.12);
  }
  // Wooden crates by the service door.
  right.fb(0xb28b60, 2.4, 0.3, 0.45, 0.6, 0.6, 0.6);
  right.fb(0xb28b60, 2.5, 0.85, 0.45, 0.5, 0.5, 0.5, 0.2);
}
