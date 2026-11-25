import * as THREE from "three";
import { BuildingType } from "../logic/game";
import { createPalace } from "./palace";
import { createSettlementBuilding } from "./settlement-buildings";

export function createBuilding(type: BuildingType, ghost = false): THREE.Group {
  return type === "palace" ? createPalace(ghost) : createSettlementBuilding(type, ghost);
}
