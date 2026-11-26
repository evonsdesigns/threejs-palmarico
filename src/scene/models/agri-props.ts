import { Kit } from "./kit";

// Shared prop builders for the farm, ranch and market models.
export function agriProps(kit: Kit) {
  const { box } = kit;

  // Box positioned by an offset (lx, ly, lz) rotated by `yaw` around (cx, cz).
  const yawBox = (color: number, cx: number, cy: number, cz: number, yaw: number,
    lx: number, ly: number, lz: number, w: number, h: number, d: number, rx = 0, ry = 0) => {
    const s = Math.sin(yaw);
    const c = Math.cos(yaw);
    box(color, cx + lx * c + lz * s, cy + ly, cz - lx * s + lz * c, w, h, d, rx, yaw + ry);
  };

  // Box from (x, y, z) heading psi (0 = +z) and pitched down by phi; returns the far end.
  const ray = (color: number, x: number, y: number, z: number, psi: number, phi: number, len: number, w: number, h: number) => {
    const dx = Math.sin(psi) * Math.cos(phi);
    const dy = -Math.sin(phi);
    const dz = Math.cos(psi) * Math.cos(phi);
    box(color, x + dx * len / 2, y + dy * len / 2, z + dz * len / 2, w, h, len, Math.atan2(-dy, dz), Math.asin(dx));
    return [x + dx * len, y + dy * len, z + dz * len] as const;
  };

  const crate = (x: number, y: number, z: number, w: number, h: number, d: number, fill?: number, fillAccent?: number) => {
    box(0xb28b60, x, y + h / 2, z, w, h, d);
    for (const dy of [0.2, 0.55, 0.85]) {
      if (dy * h < h - 0.05) box(0x8f6c48, x, y + h * dy, z, w + 0.03, 0.045, d + 0.03);
    }
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(0x755b43, x + sx * (w / 2 - 0.03), y + h / 2, z + sz * (d / 2 - 0.03), 0.07, h + 0.02, 0.07);
    if (fill !== undefined) {
      box(fill, x, y + h - 0.02, z, w - 0.12, 0.08, d - 0.12);
      const nx = Math.max(1, Math.round((w - 0.12) / 0.22));
      const nz = Math.max(1, Math.round((d - 0.12) / 0.22));
      for (let i = 0; i < nx; i++) {
        for (let j = 0; j < nz; j++) {
          const fx = x - (w - 0.12) / 2 + (i + 0.5) * (w - 0.12) / nx;
          const fz = z - (d - 0.12) / 2 + (j + 0.5) * (d - 0.12) / nz;
          box((i + j) % 3 === 0 && fillAccent !== undefined ? fillAccent : fill, fx, y + h + 0.06, fz, 0.17, 0.15, 0.17);
        }
      }
    }
  };

  const sack = (x: number, y: number, z: number, color = 0xc2a978, yaw = 0, mark = 0x6f5a3f) => {
    yawBox(color, x, y + 0.28, z, yaw, 0, 0, 0, 0.62, 0.52, 0.42);
    yawBox(color, x, y + 0.6, z, yaw, 0, 0, 0, 0.5, 0.16, 0.34);
    yawBox(0xa89062, x, y + 0.72, z, yaw, 0, 0, 0, 0.18, 0.1, 0.18);
    yawBox(0x8a744e, x, y + 0.72, z, yaw, 0, 0.03, 0, 0.24, 0.04, 0.24);
    yawBox(mark, x, y + 0.3, z, yaw, 0, 0, 0.215, 0.32, 0.2, 0.02);
  };

  const barrel = (x: number, y: number, z: number, h = 1, r = 0.38, color = 0x8a6440, top?: number) => {
    box(color, x, y + h / 2, z, r * 1.7, h * 0.94, r * 1.7, 0, Math.PI / 4);
    box(color, x, y + h / 2, z, r * 1.9, h, r * 1.9);
    for (const t of [0.14, 0.5, 0.86]) {
      box(0x4e4a44, x, y + h * t, z, r * 1.95, 0.06, r * 1.95);
      box(0x4e4a44, x, y + h * t, z, r * 1.75, 0.06, r * 1.75, 0, Math.PI / 4);
    }
    box(top ?? 0x6c5034, x, y + h + 0.01, z, r * 1.6, 0.04, r * 1.6);
  };

  const hayBale = (x: number, y: number, z: number, yaw = 0, w = 1.1, h = 0.55, d = 0.6) => {
    yawBox(0xd6b76a, x, y + h / 2, z, yaw, 0, 0, 0, w, h, d);
    yawBox(0xe2c67e, x, y + h + 0.02, z, yaw, 0.05, 0, 0.03, w * 0.9, 0.05, d * 0.8);
    for (const t of [-0.28, 0.28]) yawBox(0x8b6d3c, x, y + h / 2, z, yaw, w * t, 0, 0, 0.04, h + 0.02, d + 0.02);
    yawBox(0xbfa05a, x, y + h * 0.35, z, yaw, 0, 0, d / 2 + 0.005, w * 0.95, 0.05, 0.01);
  };

  const wheelbarrow = (x: number, y: number, z: number, yaw = 0, load?: number) => {
    yawBox(0x657068, x, y + 0.55, z, yaw, 0, 0, 0, 0.75, 0.32, 0.95);
    yawBox(0x58615a, x, y + 0.42, z, yaw, 0, 0, 0.05, 0.55, 0.1, 0.7);
    if (load !== undefined) yawBox(load, x, y + 0.72, z, yaw, 0, 0, 0, 0.62, 0.08, 0.8);
    for (const side of [-1, 1]) {
      yawBox(0x755b43, x, y + 0.42, z, yaw, side * 0.3, 0, -0.35, 0.07, 0.07, 1.6, 0.18);
      yawBox(0x755b43, x, y + 0.2, z, yaw, side * 0.3, 0, -0.45, 0.06, 0.4, 0.06);
    }
    yawBox(0x2f2f2b, x, y + 0.22, z, yaw, 0, 0, 0.6, 0.1, 0.44, 0.44);
    yawBox(0x2f2f2b, x, y + 0.22, z, yaw, 0, 0, 0.6, 0.1, 0.32, 0.5, Math.PI / 4);
    yawBox(0x9a9b93, x, y + 0.22, z, yaw, 0, 0, 0.6, 0.14, 0.08, 0.08);
  };

  const basket = (x: number, y: number, z: number, fill: number, accent?: number, size = 0.5) => {
    box(0xb48a50, x, y + size * 0.3, z, size, size * 0.6, size);
    box(0xc79d5f, x, y + size * 0.56, z, size + 0.06, 0.06, size + 0.06);
    box(0x8d6a3c, x, y + size * 0.15, z, size + 0.02, 0.04, size + 0.02);
    box(fill, x, y + size * 0.62, z, size * 0.8, 0.1, size * 0.8);
    for (const [dx, dz] of [[-0.12, -0.1], [0.11, 0.08], [0, 0.12], [-0.1, 0.12], [0.1, -0.12]]) {
      box(accent !== undefined && dx > 0 ? accent : fill, x + dx * size * 2, y + size * 0.7, z + dz * size * 2, size * 0.28, size * 0.24, size * 0.28);
    }
  };

  // A hanging banana bunch, top of stalk at (x, y, z).
  const bananaBunch = (x: number, y: number, z: number, ripe = false) => {
    const fruit = ripe ? 0xe3c94a : 0x9fb54a;
    const tip = ripe ? 0x5c4a2a : 0x6f7f35;
    box(0x6b5a38, x, y - 0.4, z, 0.07, 0.8, 0.07);
    for (let i = 0; i < 4; i++) {
      const hy = y - 0.2 - i * 0.17;
      const r = 0.2 - i * 0.025;
      box(fruit, x, hy, z, r * 2, 0.13, r * 1.3);
      box(fruit, x, hy - 0.02, z, r * 1.3, 0.13, r * 2);
      box(tip, x + r, hy - 0.06, z, 0.05, 0.05, 0.05);
    }
  };

  // Fence run between two axis-aligned points.
  const fence = (x0: number, z0: number, x1: number, z1: number, post = 0x7d6b55, rail = 0xb9a382, rails = [0.45, 0.9], height = 1.15, spacing = 1.2) => {
    const len = Math.hypot(x1 - x0, z1 - z0);
    const n = Math.max(1, Math.round(len / spacing));
    const alongX = Math.abs(x1 - x0) > Math.abs(z1 - z0);
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const px = x0 + (x1 - x0) * t;
      const pz = z0 + (z1 - z0) * t;
      box(post, px, height / 2, pz, 0.14, height, 0.14);
      box(0x5d4d3a, px, height + 0.02, pz, 0.17, 0.05, 0.17);
    }
    for (const ry of rails) {
      box(rail, (x0 + x1) / 2, ry, (z0 + z1) / 2, alongX ? len : 0.07, 0.1, alongX ? 0.07 : len);
    }
  };

  // Low-poly cow standing at (x, z) facing yaw (0 = +z).
  const cow = (x: number, z: number, yaw: number, coat: number, patch: number, grazing = false) => {
    const b = (color: number, lx: number, ly: number, lz: number, w: number, h: number, d: number, rx = 0) => yawBox(color, x, 0, z, yaw, lx, ly, lz, w, h, d, rx);
    b(coat, 0, 1.15, 0, 0.78, 0.68, 1.6);
    b(coat, 0, 1.38, 0.55, 0.7, 0.3, 0.5);
    b(coat, 0, 0.98, -0.05, 0.64, 0.2, 1.3);
    b(patch, 0.395, 1.2, -0.25, 0.02, 0.4, 0.55);
    b(patch, -0.395, 1.1, 0.25, 0.02, 0.35, 0.45);
    b(patch, 0.1, 1.5, -0.4, 0.4, 0.02, 0.5);
    for (const sx of [-0.25, 0.25]) for (const sz of [-0.6, 0.58]) {
      b(coat, sx, 0.5, sz, 0.17, 0.72, 0.2);
      b(0x3a3229, sx, 0.08, sz, 0.18, 0.16, 0.22);
    }
    b(0xd8a8a0, 0, 0.78, -0.4, 0.3, 0.14, 0.3);
    b(coat, 0, 1.15, -0.86, 0.08, 0.08, 0.14, -0.6);
    b(coat, 0, 0.85, -0.88, 0.05, 0.55, 0.05);
    b(0x2c2620, 0, 0.55, -0.88, 0.09, 0.14, 0.09);
    const hy = grazing ? 0.55 : 1.35;
    const hz = grazing ? 1.1 : 1.05;
    const tilt = grazing ? 0.9 : 0.15;
    b(coat, 0, (hy + 1.25) / 2, (hz + 0.75) / 2, 0.38, 0.38, 0.5, tilt);
    b(coat, 0, hy, hz, 0.4, 0.42, 0.48, tilt);
    b(0xc9a89a, 0, hy - 0.1, hz + 0.25, 0.32, 0.24, 0.16, tilt);
    b(0x2c2620, 0, hy - 0.08, hz + 0.33, 0.24, 0.06, 0.02, tilt);
    b(0x1d1a17, 0.17, hy + 0.08, hz + 0.1, 0.06, 0.06, 0.06);
    b(0x1d1a17, -0.17, hy + 0.08, hz + 0.1, 0.06, 0.06, 0.06);
    for (const sx of [-1, 1]) {
      b(coat, sx * 0.3, hy + 0.14, hz - 0.12, 0.22, 0.08, 0.13);
      b(0xe3dccb, sx * 0.22, hy + 0.27, hz - 0.12, 0.16, 0.06, 0.06);
      b(0xe3dccb, sx * 0.31, hy + 0.34, hz - 0.12, 0.05, 0.12, 0.05);
    }
  };

  // Diagonal plank in the XY plane (on a face looking along z); angle measured from vertical.
  const braceXY = (color: number, x: number, y: number, z: number, len: number, angle: number, w = 0.14, t = 0.06) => box(color, x, y, z, w, t, len, -Math.PI / 2, angle);
  // Diagonal plank in the YZ plane (on a face looking along x); angle measured from horizontal.
  const braceYZ = (color: number, x: number, y: number, z: number, len: number, angle: number, w = 0.14, t = 0.06) => box(color, x, y, z, t, w, len, angle);

  // Mono-pitch roof whose low edge faces +z, with tile courses and barrel rows.
  const shedRoof = (x: number, z: number, w: number, d: number, yLow: number, rise: number, color: number, tiled = true) => {
    const angle = Math.atan2(rise, d);
    const len = Math.hypot(d, rise);
    box(color, x, yLow + rise / 2, z, w, 0.14, len, angle);
    if (!tiled) {
      for (let dx = -w / 2 + 0.25; dx < w / 2; dx += 0.45) box(0x5c5d4f, x + dx, yLow + rise / 2 + 0.08, z, 0.04, 0.04, len, angle);
      return;
    }
    for (let t = 0.12; t < 1; t += 0.2) {
      box(0x7f3c28, x, yLow + rise * (1 - t) + 0.09, z - d / 2 + d * t, w, 0.05, 0.05);
    }
    for (let dx = -w / 2 + 0.15; dx < w / 2; dx += 0.3) box(0xb86b4c, x + dx, yLow + rise / 2 + 0.1, z, 0.1, 0.06, len, angle);
    box(0x8a4630, x, yLow - 0.02, z + d / 2, w + 0.05, 0.12, 0.14);
  };

  // Barge boards, eave fascia and ridge caps for a kit.gable roof with the same arguments.
  const gableTrim = (x: number, z: number, width: number, depth: number, y: number, rise: number, color: number, cap = 0x8a4630) => {
    const half = depth / 2;
    const angle = Math.atan2(rise, half);
    const len = Math.hypot(half, rise);
    for (const side of [-1, 1]) {
      for (const end of [-1, 1]) box(color, x + end * (width / 2 + 0.04), y + rise / 2 - 0.05, z + side * half / 2, 0.08, 0.3, len + 0.1, side * angle);
      box(color, x, y - 0.08, z + side * (half + 0.04), width + 0.1, 0.25, 0.08);
    }
    for (let dx = -width / 2 + 0.25; dx < width / 2; dx += 0.5) box(cap, x + dx, y + rise + 0.2, z, 0.42, 0.14, 0.32);
  };

  const door = (x: number, y: number, z: number, facing: number, w = 1.1, h = 2.4, color = 0x604a39, frame = 0xece7da) => {
    yawBox(frame, x, y + h / 2 + 0.06, z, facing, 0, 0, 0, w + 0.3, h + 0.14, 0.1);
    yawBox(color, x, y + h / 2, z, facing, 0, 0, 0.06, w, h, 0.08);
    for (const sx of [-1, 1]) {
      yawBox(0x4a382b, x, y + h * 0.72, z, facing, sx * w / 4, 0, 0.11, w * 0.36, h * 0.34, 0.03);
      yawBox(0x4a382b, x, y + h * 0.28, z, facing, sx * w / 4, 0, 0.11, w * 0.36, h * 0.38, 0.03);
    }
    yawBox(0xc9b16f, x, y + h * 0.48, z, facing, w * 0.36, 0, 0.14, 0.08, 0.08, 0.08);
    yawBox(0x9d978a, x, y - 0.06, z, facing, 0, 0, 0.3, w + 0.4, 0.14, 0.5);
  };

  const shutters = (x: number, y: number, z: number, facing: number, w: number, h: number, color = 0x4d8c46) => {
    for (const sx of [-1, 1]) {
      yawBox(color, x, y, z, facing, sx * (w / 2 + 0.33), 0, 0.12, 0.42, h + 0.2, 0.06);
      for (let sy = -h / 2 + 0.1; sy < h / 2; sy += 0.17) yawBox(0x3a6b36, x, y + sy, z, facing, sx * (w / 2 + 0.33), 0, 0.16, 0.36, 0.035, 0.03);
    }
  };

  const flowerBox = (x: number, y: number, z: number, facing: number, w: number) => {
    yawBox(0x7d6b55, x, y, z, facing, 0, 0, 0.32, w, 0.22, 0.24);
    const blooms = [0xd94a4a, 0xf0d050, 0xe87aa8, 0xd94a4a, 0xf2f0e6];
    for (let i = 0; i < 5; i++) {
      yawBox(0x4f7a3a, x, y + 0.16, z, facing, -w / 2 + 0.1 + i * (w - 0.2) / 4, 0, 0.32, 0.16, 0.14, 0.16);
      yawBox(blooms[i], x, y + 0.26, z, facing, -w / 2 + 0.12 + i * (w - 0.2) / 4, 0, 0.36, 0.08, 0.08, 0.08);
    }
  };

  const chicken = (x: number, z: number, yaw: number, color = 0xf0ece0) => {
    yawBox(color, x, 0.25, z, yaw, 0, 0, 0, 0.18, 0.18, 0.28);
    yawBox(color, x, 0.38, z, yaw, 0, 0, 0.12, 0.1, 0.14, 0.1);
    yawBox(0xc8382a, x, 0.47, z, yaw, 0, 0, 0.12, 0.03, 0.06, 0.08);
    yawBox(0xe0a030, x, 0.38, z, yaw, 0, 0, 0.19, 0.04, 0.03, 0.05);
    yawBox(color, x, 0.34, z, yaw, 0, 0, -0.15, 0.12, 0.14, 0.06);
    yawBox(0xd9a040, x, 0.08, z, yaw, 0, 0, 0, 0.1, 0.16, 0.03);
  };

  return { yawBox, ray, crate, sack, barrel, hayBale, wheelbarrow, basket, bananaBunch, fence, cow, braceXY, braceYZ, shedRoof, gableTrim, door, shutters, flowerBox, chicken };
}

export type AgriProps = ReturnType<typeof agriProps>;
