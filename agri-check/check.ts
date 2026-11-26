import * as THREE from "three";
import { createKit } from "../src/scene/models/kit";
import { buildCropField } from "../src/scene/models/crop-field";
import { buildFarm } from "../src/scene/models/farm";
import { buildRanch } from "../src/scene/models/ranch";
import { buildMarket } from "../src/scene/models/market";
import { farmCrops } from "../src/logic/game";
const stats = (g: THREE.Group) => {
  let inst = 0, solids = 0;
  g.traverse((o: any) => { if (o.isInstancedMesh) inst += o.count; else if (o.isMesh) solids++; });
  const b = new THREE.Box3().setFromObject(g);
  const f = (v: THREE.Vector3) => [v.x, v.y, v.z].map(n => n.toFixed(2)).join(",");
  return `boxes=${inst} solids=${solids} min=(${f(b.min)}) max=(${f(b.max)})`;
};
for (const crop of farmCrops) {
  const k = createKit(true);
  buildCropField(k, crop, [{ x: 0, z: 0 }], () => 0);
  console.log("crop", crop, stats(k.finish()));
  const k2 = createKit(true);
  buildCropField(k2, crop, [{ x: 8, z: -4 }], (x, z) => x * 0.3 + z * 0.2);
  const g2 = k2.finish(); const b = new THREE.Box3().setFromObject(g2);
  console.log("  sloped", b.min.x.toFixed(2), b.max.x.toFixed(2), b.min.z.toFixed(2), b.max.z.toFixed(2));
}
const which = process.argv[2] ?? "all";
if (which === "all" || which === "farm") for (const crop of farmCrops) { const k = createKit(true); buildFarm(k, crop); console.log("farm", crop, stats(k.finish())); }
if (which === "all" || which === "ranch") { const k = createKit(true); buildRanch(k); console.log("ranch", stats(k.finish())); }
if (which === "all" || which === "market") { const k = createKit(true); buildMarket(k); console.log("market", stats(k.finish())); }
