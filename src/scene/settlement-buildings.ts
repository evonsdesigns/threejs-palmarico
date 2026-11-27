import * as THREE from "three";
import type { BuildingType, FarmCrop } from "../logic/game";
import { createKit, type Kit } from "./models/kit";
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
import { buildJewelryFactory } from "./models/jewelry-factory";
import { buildFurnitureFactory } from "./models/furniture-factory";
import { buildCigarFactory } from "./models/cigar-factory";
import { buildRumDistillery } from "./models/rum-distillery";
import { buildLumberMill } from "./models/lumber-mill";
import { buildCannery } from "./models/cannery";
import { buildLoggingCamp } from "./models/logging-camp";
import { buildMine } from "./models/mine";
import { buildFishermansWharf } from "./models/fishermans-wharf";
import { buildElectricSubstation } from "./models/electric-substation";
import { buildConstructionOffice } from "./models/construction-office";
import { buildBank } from "./models/bank";
import { buildElectricPowerPlant } from "./models/electric-power-plant";
import { buildDock } from "./models/dock";
import { buildAirport } from "./models/airport";
import { buildGuardStation } from "./models/guard-station";
import { buildImmigrationOffice } from "./models/immigration-office";
import { buildNewspaper } from "./models/newspaper";
import { buildRadioStation } from "./models/radio-station";
import { buildPoliceStation } from "./models/police-station";
import { buildDiplomaticMinistry } from "./models/diplomatic-ministry";
import { buildTvStation } from "./models/tv-station";
import { buildArmory } from "./models/armory";
import { buildPrison } from "./models/prison";
import { buildArmyBase } from "./models/army-base";
import { buildColonialFort } from "./models/colonial-fort";
import { buildChurch } from "./models/church";
import { buildHighSchool } from "./models/high-school";
import { buildHospital } from "./models/hospital";
import { buildCollege } from "./models/college";
import { buildCathedral } from "./models/cathedral";
import { buildGourmetRestaurant } from "./models/gourmet-restaurant";
import { buildCabaret } from "./models/cabaret";
import { buildMovieTheater } from "./models/movie-theater";
import { buildNightclub } from "./models/nightclub";
import { buildCasino } from "./models/casino";
import { buildConservatory } from "./models/conservatory";
import { buildElPrezHome } from "./models/el-prez-home";
import { buildSportsComplex } from "./models/sports-complex";
import { buildArchaeologicalSite } from "./models/archaeological-site";
import { buildDutyFreeShop } from "./models/duty-free-shop";
import { buildSouvenirShop } from "./models/souvenir-shop";
import { buildScenicOutlook } from "./models/scenic-outlook";
import { buildBeachVilla } from "./models/beach-villa";
import { buildPool } from "./models/pool";
import { buildSpa } from "./models/spa";
import { buildTennisCourt } from "./models/tennis-court";
import { buildBeachSite } from "./models/beach-site";
import { buildCheapMotel } from "./models/cheap-motel";
import { buildMarina } from "./models/marina";
import { buildMiniatureGolf } from "./models/miniature-golf";
import { buildNaturePreserve } from "./models/nature-preserve";
import { buildHotel } from "./models/hotel";
import { buildLuxuryHotel } from "./models/luxury-hotel";
import { buildSmallFountain } from "./models/small-fountain";
import { buildLargeFountain } from "./models/large-fountain";
import { buildStatue } from "./models/statue";

export type SettlementBuildingType = Exclude<BuildingType, "palace">;

const builders: Record<SettlementBuildingType, (kit: Kit, crop: FarmCrop) => void> = {
  "house": buildHouse,
  "country-house": buildCountryHouse,
  "bungalow": buildBungalow,
  "bunkhouse": buildBunkhouse,
  "apartment": buildApartment,
  "tenement": buildTenement,
  "condominium": buildCondominium,
  "luxury-house": buildLuxuryHouse,
  "ranch": buildRanch,
  "shack": buildShack,
  "pub": buildPub,
  "restaurant": buildRestaurant,
  farm: (kit, crop) => buildFarm(kit, crop),
  "market": buildMarket,
  "clinic": buildClinic,
  "teamsters-office": buildTeamstersOffice,
  "jewelry-factory": buildJewelryFactory,
  "furniture-factory": buildFurnitureFactory,
  "cigar-factory": buildCigarFactory,
  "rum-distillery": buildRumDistillery,
  "lumber-mill": buildLumberMill,
  "cannery": buildCannery,
  "logging-camp": buildLoggingCamp,
  "mine": buildMine,
  "fishermans-wharf": buildFishermansWharf,
  "electric-substation": buildElectricSubstation,
  "construction-office": buildConstructionOffice,
  "bank": buildBank,
  "electric-power-plant": buildElectricPowerPlant,
  "dock": buildDock,
  "airport": buildAirport,
  "guard-station": buildGuardStation,
  "immigration-office": buildImmigrationOffice,
  "newspaper": buildNewspaper,
  "radio-station": buildRadioStation,
  "police-station": buildPoliceStation,
  "diplomatic-ministry": buildDiplomaticMinistry,
  "tv-station": buildTvStation,
  "armory": buildArmory,
  "prison": buildPrison,
  "army-base": buildArmyBase,
  "colonial-fort": buildColonialFort,
  "church": buildChurch,
  "high-school": buildHighSchool,
  "hospital": buildHospital,
  "college": buildCollege,
  "cathedral": buildCathedral,
  "gourmet-restaurant": buildGourmetRestaurant,
  "cabaret": buildCabaret,
  "movie-theater": buildMovieTheater,
  "nightclub": buildNightclub,
  "casino": buildCasino,
  "conservatory": buildConservatory,
  "el-prez-home": buildElPrezHome,
  "sports-complex": buildSportsComplex,
  "archaeological-site": buildArchaeologicalSite,
  "duty-free-shop": buildDutyFreeShop,
  "souvenir-shop": buildSouvenirShop,
  "scenic-outlook": buildScenicOutlook,
  "beach-villa": buildBeachVilla,
  "pool": buildPool,
  "spa": buildSpa,
  "tennis-court": buildTennisCourt,
  "beach-site": buildBeachSite,
  "cheap-motel": buildCheapMotel,
  "marina": buildMarina,
  "miniature-golf": buildMiniatureGolf,
  "nature-preserve": buildNaturePreserve,
  "hotel": buildHotel,
  "luxury-hotel": buildLuxuryHotel,
  "small-fountain": buildSmallFountain,
  "large-fountain": buildLargeFountain,
  "statue": buildStatue,
};

export function createSettlementBuilding(type: SettlementBuildingType, ghost = false, crop: FarmCrop = "corn"): THREE.Group {
  const kit = createKit(ghost);
  builders[type](kit, crop);
  return kit.finish();
}
