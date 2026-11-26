import * as THREE from "three";
import { BuildingType, FarmCrop } from "../logic/game";
import { createPalace } from "./palace";
import { createSettlementBuilding } from "./settlement-buildings";

export function createBuilding(type: BuildingType, ghost = false, crop: FarmCrop = "corn"): THREE.Group {
  return type === "palace" ? createPalace(ghost) : createSettlementBuilding(type, ghost, crop);
}
