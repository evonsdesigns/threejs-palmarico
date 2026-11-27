import type { BuildingType } from "./game";

export type EducationLevel = "high-school" | "college";
export type Good = "sugar" | "tobacco" | "pineapple" | "coffee" | "papaya" | "bananas" | "corn" | "logs" | "lumber" | "gold" | "iron" | "bauxite" | "fish";

export interface BuildingEffect {
  capacity?: number;
  quality?: number;
  education?: EducationLevel;
  beds?: number;
  bedRate?: number;
  attraction?: number;
  beauty?: number;
  pollution?: number;
  powerDemand?: number;
  powerGeneration?: number;
  requires?: BuildingType[];
  requiresAny?: BuildingType[][];
  produces?: Good;
  consumes?: Good[];
  valueAdded?: number;
}

const none: BuildingEffect = {};
const lodging: BuildingType[] = ["hotel", "luxury-hotel", "cheap-motel", "beach-villa", "bungalow"];
const needsLodging = { requiresAny: [lodging] };

export const buildingEffects: Record<BuildingType, BuildingEffect> = {
  palace: none,
  shack: none,
  house: none,
  farm: none,
  market: none,
  clinic: { capacity: 24, quality: 35 },
  apartment: none,
  condominium: none,
  "luxury-house": none,
  bunkhouse: none,
  "country-house": none,
  bungalow: { beds: 6, bedRate: 45 },
  ranch: none,
  tenement: none,
  pub: { capacity: 8, quality: 35 },
  restaurant: { capacity: 10, quality: 40 },
  "teamsters-office": none,
  "jewelry-factory": { education: "high-school", consumes: ["gold"], valueAdded: 420 },
  "furniture-factory": { consumes: ["lumber"], valueAdded: 220 },
  "cigar-factory": { consumes: ["tobacco"], valueAdded: 300 },
  "rum-distillery": { consumes: ["sugar"], valueAdded: 260 },
  "lumber-mill": { education: "high-school", requires: ["logging-camp"], consumes: ["logs"], produces: "lumber", valueAdded: 120 },
  cannery: { consumes: ["pineapple", "coffee", "fish", "papaya", "bananas"], valueAdded: 150 },
  "logging-camp": { produces: "logs", pollution: 5 },
  mine: { pollution: 8 },
  "fishermans-wharf": { produces: "fish" },
  "electric-substation": { requires: ["electric-power-plant"] },
  "construction-office": none,
  bank: { education: "college" },
  "electric-power-plant": { education: "college", pollution: 10, powerGeneration: 100 },
  dock: none,
  airport: { education: "college", attraction: 2, pollution: 5 },
  "guard-station": { requires: ["armory"] },
  "immigration-office": { education: "high-school" },
  newspaper: { education: "college" },
  "radio-station": { education: "college", powerDemand: 10 },
  "police-station": none,
  "diplomatic-ministry": { education: "college" },
  "tv-station": { education: "college", powerDemand: 15 },
  armory: { education: "college" },
  prison: { requires: ["police-station"] },
  "army-base": { education: "college" },
  "colonial-fort": { capacity: 12, quality: 70, attraction: 8 },
  church: { capacity: 48, quality: 60, education: "high-school" },
  "high-school": { capacity: 12, education: "high-school" },
  hospital: { capacity: 80, quality: 90, education: "college", powerDemand: 15, requires: ["clinic"] },
  college: { capacity: 16, education: "college", requires: ["high-school"] },
  cathedral: { capacity: 80, quality: 95, education: "high-school", requires: ["church"] },
  "gourmet-restaurant": { capacity: 12, quality: 80, powerDemand: 5, requires: ["restaurant"] },
  cabaret: { capacity: 9, quality: 60, attraction: 2, ...needsLodging },
  "movie-theater": { capacity: 16, quality: 50, powerDemand: 2 },
  nightclub: { capacity: 15, quality: 70, powerDemand: 8, attraction: 3, requires: ["pub"], ...needsLodging },
  casino: { capacity: 24, quality: 55, education: "high-school", powerDemand: 25, attraction: 5, ...needsLodging },
  conservatory: { capacity: 12, quality: 85, education: "college" },
  "el-prez-home": { attraction: 4, beauty: 2, ...needsLodging },
  "sports-complex": { capacity: 24, quality: 60, education: "high-school", powerDemand: 20 },
  "archaeological-site": { capacity: 10, quality: 70, education: "college", attraction: 4, ...needsLodging },
  "duty-free-shop": { capacity: 9, quality: 58, attraction: 3, ...needsLodging },
  "souvenir-shop": { capacity: 10, quality: 35, education: "high-school", attraction: 2, ...needsLodging },
  "scenic-outlook": { capacity: 6, quality: 50, attraction: 4, beauty: 5, ...needsLodging },
  "beach-villa": { beds: 4, bedRate: 180, attraction: 3, quality: 75 },
  pool: { capacity: 16, quality: 60, attraction: 2, ...needsLodging },
  spa: { capacity: 9, quality: 90, attraction: 4, ...needsLodging },
  "tennis-court": { capacity: 8, quality: 55, attraction: 2, ...needsLodging },
  "beach-site": { capacity: 10, quality: 50, attraction: 3, ...needsLodging },
  "cheap-motel": { beds: 10, bedRate: 30, attraction: 1, quality: 30 },
  marina: { capacity: 10, quality: 70, attraction: 5, ...needsLodging },
  "miniature-golf": { capacity: 12, quality: 52, attraction: 2, ...needsLodging },
  "nature-preserve": { capacity: 8, quality: 70, education: "college", attraction: 6, beauty: 12, ...needsLodging },
  hotel: { beds: 12, bedRate: 75, attraction: 2, quality: 50 },
  "luxury-hotel": { beds: 15, bedRate: 150, attraction: 3, quality: 80, powerDemand: 15 },
  "small-fountain": { beauty: 3 },
  "large-fountain": { beauty: 6 },
  statue: { beauty: 4 },
};
