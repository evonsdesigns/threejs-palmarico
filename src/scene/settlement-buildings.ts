import * as THREE from "three";
import { FarmCrop } from "../logic/game";
import { createKit } from "./models/kit";
import { buildHouse } from "./models/house";
import { buildCountryHouse } from "./models/country-house";
import { buildBungalow } from "./models/bungalow";
import { buildBunkhouse } from "./models/bunkhouse";
import { buildApartment } from "./models/apartment";
import { buildTenement } from "./models/tenement";
import { buildCondominium } from "./models/condominium";
import { buildLuxuryHouse } from "./models/luxury-house";
import { buildRanch } from "./models/ranch";
import { buildShack } from "./models/shack";
import { buildPub } from "./models/pub";
import { buildRestaurant } from "./models/restaurant";
import { buildFarm } from "./models/farm";
import { buildMarket } from "./models/market";
import { buildClinic } from "./models/clinic";
import { buildTeamstersOffice } from "./models/teamsters-office";

export type SettlementBuildingType =
  | "house" | "apartment" | "condominium" | "luxury-house"
  | "bunkhouse" | "country-house" | "bungalow" | "ranch"
  | "shack" | "farm" | "market" | "clinic" | "tenement" | "pub" | "restaurant" | "teamsters-office";

export function createSettlementBuilding(type: SettlementBuildingType, ghost = false, crop: FarmCrop = "corn"): THREE.Group {
  const kit = createKit(ghost);
  switch (type) {
    case "house": buildHouse(kit); break;
    case "country-house": buildCountryHouse(kit); break;
    case "bungalow": buildBungalow(kit); break;
    case "bunkhouse": buildBunkhouse(kit); break;
    case "apartment": buildApartment(kit); break;
    case "tenement": buildTenement(kit); break;
    case "condominium": buildCondominium(kit); break;
    case "luxury-house": buildLuxuryHouse(kit); break;
    case "ranch": buildRanch(kit); break;
    case "shack": buildShack(kit); break;
    case "pub": buildPub(kit); break;
    case "restaurant": buildRestaurant(kit); break;
    case "farm": buildFarm(kit, crop); break;
    case "market": buildMarket(kit); break;
    case "clinic": buildClinic(kit); break;
    case "teamsters-office": buildTeamstersOffice(kit); break;
  }
  return kit.finish();
}
