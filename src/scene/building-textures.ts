import * as THREE from "three";

type Surface = "plaster" | "wood" | "metal" | "tile" | "soil";

const cache = new Map<Surface, THREE.CanvasTexture>();

export function buildingTexture(surface: Surface): THREE.CanvasTexture {
  const cached = cache.get(surface);
  if (cached) return cached;

  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Unable to create building textures.");
  context.fillStyle = "#eeeeee";
  context.fillRect(0, 0, 256, 256);
  let seed = 113;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  for (let i = 0; i < 3500; i++) {
    const shade = Math.floor(190 + random() * 65);
    context.fillStyle = `rgba(${shade},${shade},${shade},${0.05 + random() * 0.16})`;
    context.fillRect(random() * 256, random() * 256, 1 + random() * 3, 1 + random() * 3);
  }
  if (surface === "wood") {
    for (let y = 0; y < 256; y += 24) {
      context.fillStyle = "rgba(60,60,60,.22)";
      context.fillRect(0, y, 256, 2);
      for (let i = 0; i < 14; i++) {
        context.fillStyle = `rgba(70,70,70,${0.04 + random() * 0.1})`;
        context.fillRect(random() * 256, y + random() * 24, 10 + random() * 75, 0.8);
      }
    }
  } else if (surface === "metal") {
    for (let x = 0; x < 256; x += 8) {
      context.fillStyle = "rgba(50,50,50,.18)";
      context.fillRect(x, 0, 2, 256);
      context.fillStyle = "rgba(255,255,255,.32)";
      context.fillRect(x + 2, 0, 1, 256);
    }
  } else if (surface === "tile") {
    for (let y = 0; y < 256; y += 20) {
      context.fillStyle = "rgba(65,65,65,.2)";
      context.fillRect(0, y, 256, 2);
      for (let x = (y / 20 % 2) * 10; x < 256; x += 20) context.fillRect(x, y, 1, 20);
    }
  } else if (surface === "soil") {
    for (let i = 0; i < 220; i++) {
      context.fillStyle = `rgba(55,55,55,${random() * 0.15})`;
      context.beginPath();
      context.ellipse(random() * 256, random() * 256, 1 + random() * 4, 1 + random() * 2, random(), 0, Math.PI * 2);
      context.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  cache.set(surface, texture);
  return texture;
}

export function buildingSurface(color: number): Surface | null {
  if ([0xece7da, 0xe3ddce, 0xe2d3a9, 0xded8c0, 0xa8b5b8, 0xece3cd, 0xe9c98d, 0xe7bd70, 0x92908a, 0x343b3c].includes(color)) return "plaster";
  if ([0x537a9a, 0xb9b8a2, 0x65a39b, 0x668374, 0x9a8967, 0xb28b60, 0x755b43, 0x7d6b55].includes(color)) return "wood";
  if ([0x737b77, 0x687a80, 0x85867c, 0x6b6b58, 0x858079].includes(color)) return "metal";
  if ([0xb06a42, 0x755746, 0xa34e35, 0xa6573b, 0xb35e3f].includes(color)) return "tile";
  if ([0x756345, 0x815b36, 0x72583b].includes(color)) return "soil";
  return null;
}
