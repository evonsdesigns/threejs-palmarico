import { footprintAt, rotatedTiles, type GridFootprint, type Rotation } from "./grid";
import { buildingEffects, type Good } from "./building-effects";
import { calculateIsland, defaultIslandModifiers, type FactionStateMap, type IslandModifiers, type IslandRatings } from "./island";
import { combineEdictModifiers, currentMonthIndex, edictDefinitions, edictCost, edictUnavailableReason, type EdictId } from "./edicts";

export type BuildingType = "palace" | "shack" | "house" | "farm" | "market" | "clinic"
  | "apartment" | "condominium" | "luxury-house" | "bunkhouse" | "country-house"
  | "bungalow" | "ranch" | "tenement" | "pub" | "restaurant" | "teamsters-office"
  | "jewelry-factory" | "furniture-factory" | "cigar-factory" | "rum-distillery" | "lumber-mill" | "cannery"
  | "logging-camp" | "mine" | "fishermans-wharf"
  | "electric-substation" | "construction-office" | "bank" | "electric-power-plant" | "dock" | "airport"
  | "guard-station" | "immigration-office" | "newspaper" | "radio-station" | "police-station" | "diplomatic-ministry" | "tv-station" | "armory" | "prison" | "army-base" | "colonial-fort"
  | "church" | "high-school" | "hospital" | "college" | "cathedral"
  | "gourmet-restaurant" | "cabaret" | "movie-theater" | "nightclub" | "casino" | "conservatory" | "el-prez-home" | "sports-complex" | "archaeological-site"
  | "duty-free-shop" | "souvenir-shop" | "scenic-outlook" | "beach-villa" | "pool" | "spa" | "tennis-court" | "beach-site" | "cheap-motel" | "marina" | "miniature-golf" | "nature-preserve" | "hotel" | "luxury-hotel"
  | "small-fountain" | "large-fountain" | "statue";

export const farmCrops = ["corn", "pineapple", "coffee", "sugar", "tobacco", "papaya", "bananas"] as const;
export type FarmCrop = typeof farmCrops[number];
export const mineResources = ["gold", "iron", "bauxite"] as const;
export type MineResource = typeof mineResources[number];
export const mineResourcePrices: Record<MineResource, number> = { gold: 260, iron: 160, bauxite: 200 };
export const farmCropProduction: Record<FarmCrop, { food: number; revenue: number }> = {
  corn: { food: 16, revenue: 180 },
  pineapple: { food: 12, revenue: 220 },
  coffee: { food: 0, revenue: 300 },
  sugar: { food: 0, revenue: 260 },
  tobacco: { food: 0, revenue: 320 },
  papaya: { food: 12, revenue: 200 },
  bananas: { food: 14, revenue: 200 },
};
export const pubDressCodes = ["none", "upscale"] as const;
export type PubDressCode = typeof pubDressCodes[number];
export const pubCapacity = 8;
export const pubCharge = 15;
export const restaurantTableSettings = ["paper", "cloth", "linen"] as const;
export type RestaurantTableSetting = typeof restaurantTableSettings[number];
export const restaurantTableSettingDetails: Record<RestaurantTableSetting, { name: string; upkeep: number; quality: number }> = {
  paper: { name: "Paper Placemats", upkeep: 0.5, quality: 0.9 },
  cloth: { name: "Cloth Napkins", upkeep: 1, quality: 1 },
  linen: { name: "Linen Tablecloths", upkeep: 1.5, quality: 1.2 },
};
export const restaurantCapacity = 10;
export const restaurantCharge = 20;
export const restaurantBaseQuality = 40;
export function restaurantQuality(setting: RestaurantTableSetting = "cloth") {
  return Math.round(restaurantBaseQuality * restaurantTableSettingDetails[setting].quality);
}
export const teamsterWorkModes = ["normal", "sweatshop", "easy"] as const;
export type TeamsterWorkMode = typeof teamsterWorkModes[number];
export const teamsterWorkModeDetails: Record<TeamsterWorkMode, { name: string; hauling: number; approval: number }> = {
  normal: { name: "Normal Hours", hauling: 0.1, approval: 0 },
  sweatshop: { name: "Sweat Shop", hauling: 0.15, approval: -3 },
  easy: { name: "Easy-Does-It", hauling: 0.08, approval: 2 },
};
export const maxHaulingBonus = 0.3;
export const gameSpeeds = [1, 2, 3, 4, 5] as const;
export type GameSpeed = typeof gameSpeeds[number];
export const immigrationOptions = ["open", "closed"] as const;
export type ImmigrationOption = typeof immigrationOptions[number];
export type SimulationModifiers = IslandModifiers;
export type { FactionId, FactionStateMap, IslandRatings } from "./island";

export interface BuildingDefinition {
  id: BuildingType;
  name: string;
  icon: string;
  cost: number;
  upkeep: number;
  jobs: number;
  housing: number;
  food: number;
  revenue: number;
  /** Footprint in tiles along x and z at rotation 0 (see docs/game-info.md). */
  tiles: readonly [number, number];
  description: string;
  /** Built along the shore: back half on land, front edge over the sea. */
  coastal?: boolean;
  /** Only one may exist on the island. */
  unique?: boolean;
  /** Pre-placed landmark that cannot be built from the menu. */
  landmark?: boolean;
}

export const buildings: BuildingDefinition[] = [
  { id: "palace", name: "Palace", icon: "♜", cost: 0, upkeep: 0, jobs: 0, housing: 0, food: 0, revenue: 0, tiles: [6, 5], description: "The island's seat of government." },
  { id: "shack", name: "Shack", icon: "⌂", cost: 0, upkeep: 0, jobs: 0, housing: 2, food: 0, revenue: 0, tiles: [1, 1], description: "Informal shelter for 2 residents." },
  { id: "house", name: "House", icon: "⌂", cost: 400, upkeep: 10, jobs: 0, housing: 8, food: 0, revenue: 0, tiles: [2, 3], description: "Homes for 8 residents." },
  { id: "apartment", name: "Apartment", icon: "▦", cost: 1200, upkeep: 40, jobs: 0, housing: 24, food: 0, revenue: 0, tiles: [4, 3], description: "Homes for 24 residents." },
  { id: "tenement", name: "Tenement", icon: "▦", cost: 800, upkeep: 30, jobs: 0, housing: 32, food: 0, revenue: 0, tiles: [4, 3], description: "Inexpensive homes for 32 residents." },
  { id: "condominium", name: "Condominium", icon: "⌂", cost: 1600, upkeep: 55, jobs: 0, housing: 16, food: 0, revenue: 0, tiles: [4, 3], description: "Homes for 16 residents." },
  { id: "luxury-house", name: "Luxury House", icon: "⌂", cost: 1000, upkeep: 35, jobs: 0, housing: 4, food: 0, revenue: 0, tiles: [3, 3], description: "Homes for 4 residents." },
  { id: "bunkhouse", name: "Bunkhouse", icon: "⌂", cost: 300, upkeep: 12, jobs: 0, housing: 12, food: 0, revenue: 0, tiles: [3, 2], description: "Homes for 12 residents." },
  { id: "country-house", name: "Country House", icon: "⌂", cost: 250, upkeep: 8, jobs: 0, housing: 4, food: 0, revenue: 0, tiles: [2, 2], description: "Homes for 4 residents." },
  { id: "bungalow", name: "Bungalow", icon: "⌂", cost: 300, upkeep: 12, jobs: 0, housing: 0, food: 0, revenue: 0, tiles: [2, 3], description: "Tourist accommodation; tourism is not simulated yet." },
  { id: "ranch", name: "Ranch", icon: "✿", cost: 650, upkeep: 35, jobs: 4, housing: 0, food: 12, revenue: 140, tiles: [3, 3], description: "Feeds 12 people and creates 4 jobs." },
  { id: "farm", name: "Farm", icon: "✿", cost: 1000, upkeep: 30, jobs: 4, housing: 0, food: 16, revenue: 180, tiles: [4, 3], description: "Produces food or cash crops and creates 4 farming jobs." },
  { id: "market", name: "Market", icon: "◈", cost: 450, upkeep: 25, jobs: 4, housing: 0, food: 0, revenue: 150, tiles: [3, 3], description: "Earns income and creates 4 jobs." },
  { id: "clinic", name: "Clinic", icon: "✚", cost: 500, upkeep: 35, jobs: 3, housing: 0, food: 0, revenue: 0, tiles: [3, 2], description: "Improves approval and creates 3 jobs." },
  { id: "pub", name: "Pub", icon: "♨", cost: 800, upkeep: 25, jobs: 2, housing: 0, food: 0, revenue: 0, tiles: [2, 2], description: "A pub with 2 barmaid jobs, 8 visitor spaces and base service quality 35." },
  { id: "restaurant", name: "Restaurant", icon: "🍽", cost: 2000, upkeep: 40, jobs: 2, housing: 0, food: 0, revenue: 0, tiles: [3, 2], description: "A restaurant with 2 cook jobs, 10 visitor spaces and base service quality 40." },
  { id: "teamsters-office", name: "Teamster's Office", icon: "⛟", cost: 2000, upkeep: 40, jobs: 8, housing: 0, food: 0, revenue: 0, tiles: [3, 2], description: "Employs 8 teamsters who haul farm and ranch goods to market." },
  { id: "jewelry-factory", name: "Jewelry Factory", icon: "⚒", cost: 13000, upkeep: 260, jobs: 6, housing: 0, food: 0, revenue: 0, tiles: [3, 3], description: "Six high-school factory workers refine gold from mines into jewelry, the island's most valuable export." },
  { id: "furniture-factory", name: "Furniture Factory", icon: "⚒", cost: 9000, upkeep: 180, jobs: 6, housing: 0, food: 0, revenue: 0, tiles: [4, 3], description: "Six factory workers turn lumber from the lumber mill into furniture for export." },
  { id: "cigar-factory", name: "Cigar Factory", icon: "⚒", cost: 10000, upkeep: 200, jobs: 8, housing: 0, food: 0, revenue: 0, tiles: [4, 4], description: "Eight factory workers roll tobacco from farms into cigars, a cheap product with strong profits." },
  { id: "rum-distillery", name: "Rum Distillery", icon: "⚒", cost: 22000, upkeep: 300, jobs: 12, housing: 0, food: 0, revenue: 0, tiles: [4, 4], description: "Twelve factory workers distil sugar from farms into rum for export." },
  { id: "lumber-mill", name: "Lumber Mill", icon: "⚒", cost: 5000, upkeep: 120, jobs: 5, housing: 0, food: 0, revenue: 0, tiles: [5, 4], description: "Five high-school workers saw logs from logging camps into lumber; needs a logging camp." },
  { id: "cannery", name: "Cannery", icon: "⚒", cost: 15000, upkeep: 250, jobs: 8, housing: 0, food: 0, revenue: 0, tiles: [6, 4], description: "Eight factory workers can fish, pineapples and coffee into canned goods for export." },
  { id: "logging-camp", name: "Logging Camp", icon: "⛏", cost: 1500, upkeep: 40, jobs: 8, housing: 0, food: 0, revenue: 0, tiles: [2, 2], description: "Eight lumberjacks fell nearby trees for logs; hurts island beauty." },
  { id: "mine", name: "Mine", icon: "⛏", cost: 3000, upkeep: 70, jobs: 8, housing: 0, food: 0, revenue: 0, tiles: [3, 3], description: "Eight miners extract gold, iron or bauxite for export; gold can be made into jewelry." },
  { id: "fishermans-wharf", name: "Fisherman's Wharf", icon: "⛏", cost: 3000, upkeep: 60, jobs: 4, housing: 0, food: 18, revenue: 0, tiles: [4, 3], description: "Four fishermen bring in fish that feeds 18 people; surplus goes to the cannery. Must be built on the shore.", coastal: true },
  { id: "electric-substation", name: "Electric Substation", icon: "⚡", cost: 2000, upkeep: 20, jobs: 0, housing: 0, food: 0, revenue: 0, tiles: [1, 1], description: "Extends power from a nearby power plant by 10 tiles. Needs no staff." },
  { id: "construction-office", name: "Construction Office", icon: "⚡", cost: 1000, upkeep: 40, jobs: 8, housing: 0, food: 0, revenue: 0, tiles: [3, 2], description: "Eight laborers build the island's projects; each staffed office cuts building costs 5% (up to 15%)." },
  { id: "bank", name: "Bank", icon: "⚡", cost: 8000, upkeep: 120, jobs: 5, housing: 0, food: 0, revenue: 0, tiles: [3, 3], description: "Five college bankers earn interest on the treasury and enable the Bribe and Special Building Permit edicts." },
  { id: "electric-power-plant", name: "Electric Power Plant", icon: "⚡", cost: 17000, upkeep: 300, jobs: 6, housing: 0, food: 0, revenue: 0, tiles: [5, 4], description: "Six college engineers generate electricity for buildings within 24 tiles. Pollutes." },
  { id: "dock", name: "Dock", icon: "⚡", cost: 2000, upkeep: 60, jobs: 4, housing: 0, food: 0, revenue: 0, tiles: [6, 4], description: "Four dockworkers load exports (+10% raw export income) and land tourists and immigrants. Must be built on the shore.", coastal: true },
  { id: "airport", name: "Airport", icon: "⚡", cost: 16000, upkeep: 250, jobs: 2, housing: 0, food: 0, revenue: 0, tiles: [12, 6], description: "Two college engineers run flights that bring many tourists and some immigrants." },
  { id: "guard-station", name: "Guard Station", icon: "★", cost: 1500, upkeep: 45, jobs: 3, housing: 0, food: 0, revenue: 0, tiles: [2, 2], description: "Three high-school soldiers guard the island against rebels." },
  { id: "immigration-office", name: "Immigration Office", icon: "★", cost: 2500, upkeep: 50, jobs: 2, housing: 0, food: 0, revenue: 0, tiles: [2, 2], description: "Two high-school bureaucrats manage immigration. Only one may be built.", unique: true },
  { id: "newspaper", name: "Newspaper", icon: "★", cost: 7500, upkeep: 90, jobs: 3, housing: 0, food: 0, revenue: 0, tiles: [3, 2], description: "Three college journalists sway public opinion and raise liberty." },
  { id: "radio-station", name: "Radio Station", icon: "★", cost: 10000, upkeep: 110, jobs: 2, housing: 0, food: 0, revenue: 0, tiles: [3, 2], description: "Two college journalists broadcast across Tropico, raising respect. Needs power." },
  { id: "police-station", name: "Police Station", icon: "★", cost: 2000, upkeep: 70, jobs: 6, housing: 0, food: 0, revenue: 0, tiles: [3, 3], description: "Six high-school policemen fight crime but reduce liberty. Enables the Arrest edict." },
  { id: "diplomatic-ministry", name: "Diplomatic Ministry", icon: "★", cost: 5000, upkeep: 80, jobs: 3, housing: 0, food: 0, revenue: 0, tiles: [3, 3], description: "Three high-school bureaucrats manage U.S. and Soviet relations and enable foreign edicts. Only one may be built.", unique: true },
  { id: "tv-station", name: "TV Station", icon: "★", cost: 15000, upkeep: 160, jobs: 3, housing: 0, food: 0, revenue: 0, tiles: [3, 3], description: "Three college journalists broadcast island-wide and enable ad campaigns. Needs power." },
  { id: "armory", name: "Armory", icon: "★", cost: 3000, upkeep: 70, jobs: 3, housing: 0, food: 0, revenue: 0, tiles: [4, 3], description: "Three college generals train soldiers; each general supports three guard stations." },
  { id: "prison", name: "Prison", icon: "★", cost: 3000, upkeep: 60, jobs: 2, housing: 0, food: 0, revenue: 0, tiles: [4, 3], description: "Two high-school policemen guard 8 cells. Needs a police station." },
  { id: "army-base", name: "Army Base", icon: "★", cost: 6000, upkeep: 150, jobs: 3, housing: 0, food: 0, revenue: 0, tiles: [5, 4], description: "Houses 15 soldiers and generals, greatly increasing military strength." },
  { id: "colonial-fort", name: "Colonial Fort", icon: "★", cost: 0, upkeep: 0, jobs: 0, housing: 0, food: 0, revenue: 0, tiles: [4, 4], description: "A historic Spanish fort with a dungeon and museum. It attracts tourists and cannot be built.", unique: true, landmark: true },
  { id: "church", name: "Church", icon: "✚", cost: 6000, upkeep: 60, jobs: 4, housing: 0, food: 0, revenue: 0, tiles: [4, 3], description: "Four high-school priests serve the faithful (quality 60)." },
  { id: "high-school", name: "High School", icon: "✚", cost: 8000, upkeep: 100, jobs: 6, housing: 0, food: 0, revenue: 0, tiles: [4, 3], description: "Six high-school teachers educate 12 students to high-school level." },
  { id: "hospital", name: "Hospital", icon: "✚", cost: 12000, upkeep: 200, jobs: 4, housing: 0, food: 0, revenue: 0, tiles: [4, 4], description: "Four college doctors provide high-quality healthcare (quality 90). Needs a clinic and power." },
  { id: "college", name: "College", icon: "✚", cost: 12000, upkeep: 200, jobs: 8, housing: 0, food: 0, revenue: 0, tiles: [4, 4], description: "Eight college professors educate 16 high-school graduates to college level. Needs a high school and power." },
  { id: "cathedral", name: "Cathedral", icon: "✚", cost: 20000, upkeep: 200, jobs: 4, housing: 0, food: 0, revenue: 0, tiles: [6, 4], description: "Four high-school bishops serve the faithful with the island's best religious service (quality 95). Needs a church and power." },
  { id: "gourmet-restaurant", name: "Gourmet Restaurant", icon: "♫", cost: 3000, upkeep: 80, jobs: 4, housing: 0, food: 0, revenue: 0, tiles: [3, 2], description: "Four cooks serve 12 diners upscale meals (quality 80). Needs a restaurant and power." },
  { id: "cabaret", name: "Cabaret", icon: "♫", cost: 4000, upkeep: 80, jobs: 3, housing: 0, food: 0, revenue: 0, tiles: [3, 3], description: "Three showgirls entertain 9 visitors (quality 60)." },
  { id: "movie-theater", name: "Movie Theater", icon: "♫", cost: 3500, upkeep: 70, jobs: 3, housing: 0, food: 0, revenue: 0, tiles: [3, 3], description: "Three ushers show films to 16 visitors (quality 50). Needs power." },
  { id: "nightclub", name: "Nightclub", icon: "♫", cost: 4000, upkeep: 90, jobs: 4, housing: 0, food: 0, revenue: 0, tiles: [3, 3], description: "Four barmaids entertain 15 visitors (quality 70). Needs a pub and power." },
  { id: "casino", name: "Casino", icon: "♫", cost: 10000, upkeep: 160, jobs: 4, housing: 0, food: 0, revenue: 0, tiles: [4, 3], description: "Four high-school pit bosses run gambling for 24 visitors (quality 55). Needs power." },
  { id: "conservatory", name: "Conservatory", icon: "♫", cost: 6000, upkeep: 110, jobs: 4, housing: 0, food: 0, revenue: 0, tiles: [4, 3], description: "Four college musicians perform classical music for 12 visitors (quality 85)." },
  { id: "el-prez-home", name: "El Prez' Childhood Home", icon: "♫", cost: 3000, upkeep: 40, jobs: 2, housing: 0, food: 0, revenue: 0, tiles: [3, 3], description: "El Presidente's childhood home, now a museum. It draws tourists and loyalists. Only one may be built.", unique: true },
  { id: "sports-complex", name: "Sports Complex", icon: "♫", cost: 25000, upkeep: 260, jobs: 6, housing: 0, food: 0, revenue: 0, tiles: [5, 4], description: "Six high-school athletes play before 24 spectators (quality 60). Needs power." },
  { id: "archaeological-site", name: "Archaeological Site", icon: "♫", cost: 2000, upkeep: 50, jobs: 2, housing: 0, food: 0, revenue: 0, tiles: [4, 4], description: "Two college professors guide 10 tourists around ancient ruins (quality 70)." },
  { id: "duty-free-shop", name: "Duty Free Shop", icon: "☀", cost: 1900, upkeep: 40, jobs: 3, housing: 0, food: 0, revenue: 0, tiles: [2, 2], description: "Three shopkeepers sell duty-free goods to 9 tourists (quality 58). Needs a hotel." },
  { id: "souvenir-shop", name: "Souvenir Shop", icon: "☀", cost: 1250, upkeep: 30, jobs: 2, housing: 0, food: 0, revenue: 0, tiles: [2, 2], description: "Two high-school shopkeepers sell souvenirs to 10 tourists (quality 35). Needs a hotel." },
  { id: "scenic-outlook", name: "Scenic Outlook", icon: "☀", cost: 1000, upkeep: 20, jobs: 1, housing: 0, food: 0, revenue: 0, tiles: [2, 2], description: "An attendant shows 6 tourists the view (quality 50). Needs a hotel." },
  { id: "beach-villa", name: "Beach Villa", icon: "☀", cost: 4000, upkeep: 60, jobs: 2, housing: 0, food: 0, revenue: 0, tiles: [3, 2], description: "Two maids keep a private beachfront villa for 4 high-class tourists (quality 75)." },
  { id: "pool", name: "Pool", icon: "☀", cost: 4000, upkeep: 50, jobs: 2, housing: 0, food: 0, revenue: 0, tiles: [3, 2], description: "Two attendants serve 16 swimmers (quality 60). Needs a hotel." },
  { id: "spa", name: "Spa", icon: "☀", cost: 5000, upkeep: 70, jobs: 3, housing: 0, food: 0, revenue: 0, tiles: [3, 2], description: "Three attendants pamper 9 tourists (quality 90). Needs a hotel." },
  { id: "tennis-court", name: "Tennis Court", icon: "☀", cost: 2500, upkeep: 40, jobs: 2, housing: 0, food: 0, revenue: 0, tiles: [3, 2], description: "Two attendants run courts for 8 tourists (quality 55). Needs a hotel." },
  { id: "beach-site", name: "Beach Site", icon: "☀", cost: 500, upkeep: 15, jobs: 1, housing: 0, food: 0, revenue: 0, tiles: [3, 3], description: "A lifeguard watches 10 beachgoers (quality 50). Must be built on the beach; needs a hotel.", coastal: true },
  { id: "cheap-motel", name: "Cheap Motel", icon: "☀", cost: 3000, upkeep: 50, jobs: 2, housing: 0, food: 0, revenue: 0, tiles: [3, 3], description: "Two maids keep 10 budget rooms for low-class tourists (quality 30)." },
  { id: "marina", name: "Marina", icon: "☀", cost: 6000, upkeep: 90, jobs: 3, housing: 0, food: 0, revenue: 0, tiles: [4, 3], description: "Berths 10 yachts and draws wealthy tourists. Must be built on the shore.", coastal: true },
  { id: "miniature-golf", name: "Miniature Golf", icon: "☀", cost: 2850, upkeep: 45, jobs: 2, housing: 0, food: 0, revenue: 0, tiles: [4, 3], description: "Two attendants run putt-putt for 12 tourists (quality 52). Needs a hotel." },
  { id: "nature-preserve", name: "Nature Preserve", icon: "☀", cost: 2000, upkeep: 30, jobs: 1, housing: 0, food: 0, revenue: 0, tiles: [3, 3], description: "A college professor guides 8 tourists through untouched nature (quality 70). Adds beauty." },
  { id: "hotel", name: "Hotel", icon: "☀", cost: 5000, upkeep: 80, jobs: 3, housing: 0, food: 0, revenue: 0, tiles: [4, 3], description: "Three maids keep 12 rooms for middle-class tourists (quality 50)." },
  { id: "luxury-hotel", name: "Luxury Hotel", icon: "☀", cost: 10000, upkeep: 160, jobs: 6, housing: 0, food: 0, revenue: 0, tiles: [5, 4], description: "Six maids keep 15 high-class rooms (quality 80). Needs power." },
  { id: "small-fountain", name: "Small Fountain", icon: "❀", cost: 200, upkeep: 2, jobs: 0, housing: 0, food: 0, revenue: 0, tiles: [1, 1], description: "A small fountain that raises local beauty." },
  { id: "large-fountain", name: "Large Fountain", icon: "❀", cost: 600, upkeep: 5, jobs: 0, housing: 0, food: 0, revenue: 0, tiles: [2, 2], description: "A tiered fountain that raises local beauty more widely." },
  { id: "statue", name: "Statue", icon: "❀", cost: 500, upkeep: 2, jobs: 0, housing: 0, food: 0, revenue: 0, tiles: [1, 1], description: "A statue of El Presidente that raises beauty and loyalist respect." },
];

export function buildingUpkeep(building: PlacedBuilding): number {
  const upkeep = buildings.find((item) => item.id === building.type)!.upkeep;
  return building.type === "restaurant"
    ? Math.round(upkeep * restaurantTableSettingDetails[building.tableSetting ?? "cloth"].upkeep)
    : upkeep;
}

export function buildingFootprint(building: Pick<PlacedBuilding, "type" | "x" | "z" | "rotation">): GridFootprint {
  const [sizeX, sizeZ] = rotatedTiles(buildings.find((item) => item.id === building.type)!.tiles, building.rotation ?? 0);
  return footprintAt(building.x, building.z, sizeX, sizeZ);
}

export const starterBuildings: readonly BuildingType[] = ["palace", "farm"];

export interface PlacedBuilding {
  type: BuildingType;
  x: number;
  z: number;
  rotation?: Rotation;
  crop?: FarmCrop;
  mineResource?: MineResource;
  dressCode?: PubDressCode;
  tableSetting?: RestaurantTableSetting;
  workMode?: TeamsterWorkMode;
  immigrationOption?: ImmigrationOption;
}

export interface ResidentPlan {
  home: number | null;
  work: number | null;
  service: number | null;
}

export function planResidents(placed: PlacedBuilding[], population: number): ResidentPlan[] {
  const defs = placed.map((building) => buildings.find((item) => item.id === building.type)!);
  const homes: number[] = [];
  const jobs: number[] = [];
  const addSlots = (slots: number[], index: number, capacity: number) => {
    for (let i = 0; i < capacity && slots.length < population; i++) slots.push(index);
  };
  placed.forEach((building, index) => {
    if (building.type !== "shack") addSlots(homes, index, defs[index].housing);
    addSlots(jobs, index, defs[index].jobs);
  });
  placed.forEach((building, index) => {
    if (building.type === "shack") addSlots(homes, index, defs[index].housing);
  });
  const fallback = placed.findIndex((building) => building.type === "palace");
  return Array.from({ length: population }, (_, resident) => {
    const services = placed.flatMap((building, index) => {
      if (building.type === "clinic" || building.type === "market" || building.type === "restaurant" || building.type === "hospital" || building.type === "church" || building.type === "cathedral" || building.type === "gourmet-restaurant" || building.type === "cabaret" || building.type === "movie-theater" || building.type === "nightclub" || building.type === "casino" || building.type === "conservatory" || building.type === "sports-complex" || building.type === "duty-free-shop" || building.type === "souvenir-shop") return [index];
      if (building.type === "pub" && (building.dressCode !== "upscale" || resident < Math.floor(population / 2))) return [index];
      return [];
    });
    return {
      home: homes[resident] ?? (fallback === -1 ? null : fallback),
      work: jobs[resident] ?? null,
      service: services.length ? services[resident % services.length] : null,
    };
  });
}

export interface ActiveEdict {
  id: EdictId;
  expiresAt: number | null;
}

export interface GameSnapshot {
  money: number;
  slushFund: number;
  population: number;
  month: number;
  year: number;
  paused: boolean;
  speed: GameSpeed;
  selected: BuildingType | null;
  inspectedBuilding: number | null;
  farmCrop: FarmCrop;
  pubDressCode: PubDressCode;
  restaurantTableSetting: RestaurantTableSetting;
  placed: PlacedBuilding[];
  housing: number;
  food: number;
  jobs: number;
  approval: number;
  balance: number;
  pubVisitors: number[];
  pubStaffedCapacity: number;
  restaurantVisitors: number[];
  restaurantStaffedCapacity: number;
  /** Fractional boost to farm and ranch income from staffed teamster offices. */
  haulingBonus: number;
  teamsterWorkMode: TeamsterWorkMode;
  immigrationOption: ImmigrationOption;
  educated: { highSchool: number; college: number };
  buildingStaffing: number[];
  buildingIncome: number[];
  goods: Record<Good, { produced: number; processed: number }> ;
  powered: boolean[];
  ratings: IslandRatings;
  factions: FactionStateMap;
  superpowers: { us: number; ussr: number };
  tourists: number;
  buildingTourists: number[];
  tourismIncome: number;
  military: number;
  police: number;
  jailCapacity: number;
  rebels: number;
  rngSeed: number;
  nextElectionYear: number;
  gameOver: string | null;
  modifiers: IslandModifiers;
  activeEdicts: ActiveEdict[];
  edictCooldowns: Record<string, number>;
  issuedOnce: Partial<Record<EdictId, true>>;
  jailUsed: number;
  jailReleases: number[];
  placementRotation: Rotation;
  notice: string;
}

const goodNames: Good[] = ["sugar", "tobacco", "pineapple", "coffee", "papaya", "bananas", "corn", "logs", "lumber", "gold", "iron", "bauxite", "fish"];
const rawPrices: Partial<Record<Good, number>> = { logs: 160, ...mineResourcePrices, fish: 110 };
const factoryTypes: BuildingType[] = ["rum-distillery", "cigar-factory", "cannery", "lumber-mill", "furniture-factory", "jewelry-factory"];
const entertainmentTypes: BuildingType[] = ["gourmet-restaurant", "cabaret", "movie-theater", "nightclub", "casino", "conservatory", "sports-complex"];
const touristAttractions: BuildingType[] = ["beach-site", "pool", "spa", "tennis-court", "miniature-golf", "marina", "scenic-outlook", "nature-preserve", "archaeological-site", "colonial-fort", "el-prez-home", "souvenir-shop", "duty-free-shop", "casino", "nightclub", "cabaret"];
const legacyBuildings = new Set<BuildingType>(["palace", "shack", "house", "farm", "market", "clinic", "apartment", "condominium", "luxury-house", "bunkhouse", "country-house", "bungalow", "ranch", "tenement", "pub", "restaurant", "teamsters-office"]);

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

export function buildingProducedGood(building: PlacedBuilding): Good | undefined {
  return building.type === "mine" ? building.mineResource ?? "gold" : buildingEffects[building.type].produces;
}

function calculate(placed: PlacedBuilding[], population: number, educated = { highSchool: 0, college: 0 }, modifiers: IslandModifiers = defaultIslandModifiers, money = 0, superpowers = { us: 50, ussr: 50 }) {
  const defs = placed.map((building) => buildings.find((item) => item.id === building.type)!);
  const housing = defs.reduce((sum, item) => sum + item.housing, 0);
  const production = placed.map((building, index) => building.type === "farm" ? farmCropProduction[building.crop ?? "corn"] : defs[index]);
  const jobs = defs.reduce((sum, item, index) => sum + (modifiers.closedBuildingTypes.includes(placed[index].type) ? 0 : item.jobs), 0);
  const staffing = jobs === 0 ? 0 : Math.min(1, population / jobs);
  const buildingStaffing = placed.map((building, index) => modifiers.closedBuildingTypes.includes(building.type) ? 0 : defs[index].jobs === 0 ? 1 : staffing);
  let collegeWorkers = educated.college;
  let highSchoolWorkers = educated.highSchool;
  placed.forEach((building, index) => {
    if (modifiers.closedBuildingTypes.includes(building.type) || buildingEffects[building.type].education !== "college" || defs[index].jobs === 0) return;
    const fraction = Math.min(staffing, collegeWorkers / defs[index].jobs);
    buildingStaffing[index] = fraction;
    collegeWorkers = Math.max(0, collegeWorkers - fraction * defs[index].jobs);
  });
  placed.forEach((building, index) => {
    if (modifiers.closedBuildingTypes.includes(building.type) || buildingEffects[building.type].education !== "high-school" || defs[index].jobs === 0) return;
    const available = highSchoolWorkers + collegeWorkers;
    const fraction = Math.min(staffing, available / defs[index].jobs);
    buildingStaffing[index] = fraction;
    let assigned = fraction * defs[index].jobs;
    const fromHighSchool = Math.min(highSchoolWorkers, assigned);
    highSchoolWorkers -= fromHighSchool;
    assigned -= fromHighSchool;
    collegeWorkers = Math.max(0, collegeWorkers - assigned);
  });

  const powered = placed.map((building) => {
    const x = building.x / 4;
    const z = building.z / 4;
    return placed.some((plant, i) => {
      if (plant.type !== "electric-power-plant" || buildingStaffing[i] <= 0) return false;
      const plantX = plant.x / 4;
      const plantZ = plant.z / 4;
      const distance = Math.hypot(x - plantX, z - plantZ);
      if (distance <= 24) return true;
      return placed.some((substation) => substation.type === "electric-substation"
        && Math.hypot(substation.x / 4 - plantX, substation.z / 4 - plantZ) <= 24
        && Math.hypot(x - substation.x / 4, z - substation.z / 4) <= 10);
    });
  });

  const goods = Object.fromEntries(goodNames.map((good) => [good, { produced: 0, processed: 0 }])) as Record<Good, { produced: number; processed: number }>;
  placed.forEach((building, index) => {
    const amount = buildingStaffing[index];
    if (building.type === "farm") goods[building.crop ?? "corn"].produced += amount;
    const produced = buildingProducedGood(building);
    if (produced) goods[produced].produced += amount;
  });
  const stock: Record<Good, number> = Object.fromEntries(goodNames.map((good) => [good, goods[good].produced])) as Record<Good, number>;
  const factoryIncome = placed.map(() => 0);
  placed.map((_, index) => index).sort((a, b) => Number(placed[b].type === "lumber-mill") - Number(placed[a].type === "lumber-mill")).forEach((index) => {
    const building = placed[index];
    const effect = buildingEffects[building.type];
    if (!factoryTypes.includes(building.type) || !effect.consumes || !effect.valueAdded) return;
    let loads = buildingStaffing[index] * 2;
    let processed = 0;
    for (const input of effect.consumes) {
      const quantity = Math.min(stock[input], loads);
      stock[input] -= quantity;
      loads -= quantity;
      goods[input].processed += quantity;
      processed += quantity;
      if (loads <= 0) break;
    }
    if (building.type === "lumber-mill") {
      goods.lumber.produced += processed;
      stock.lumber += processed;
    }
    factoryIncome[index] = processed * effect.valueAdded * (powered[index] ? 1.25 : 1) * modifiers.exportPriceMultiplier;
  });
  const dockBonus = Math.min(1, placed.reduce((sum, building, i) => sum + (building.type === "dock" ? buildingStaffing[i] * 0.1 : 0), 0));
  const teamsterOffices = placed.filter((building) => building.type === "teamsters-office");
  const haulingBonus = staffing * Math.min(maxHaulingBonus,
    teamsterOffices.reduce((sum, building) => sum + teamsterWorkModeDetails[building.workMode ?? "normal"].hauling, 0));
  const teamsterMorale = staffing > 0
    ? teamsterOffices.reduce((sum, building) => sum + teamsterWorkModeDetails[building.workMode ?? "normal"].approval, 0)
    : 0;
  const staffedFood = Math.floor(production.reduce((sum, item, i) => sum + item.food * buildingStaffing[i], 0));
  const clinic = defs.some((item) => item.id === "clinic") && staffing > 0;
  const housingScore = population ? Math.min(1, housing / population) : 1;
  const foodScore = population ? Math.min(1, staffedFood / (population * modifiers.foodConsumptionMultiplier)) * (modifiers.foodQuality > 0 ? modifiers.foodQuality / 100 : 1) : 1;

  const pubStaffedCapacity = Math.floor(pubCapacity * staffing);
  const pubVisitors = placed.map(() => 0);
  let upscaleResidents = Math.floor(population / 2);
  let otherResidents = population - upscaleResidents;
  placed.forEach((building, index) => {
    if (building.type !== "pub" || building.dressCode !== "upscale") return;
    const visitors = Math.min(pubStaffedCapacity, upscaleResidents);
    pubVisitors[index] = visitors;
    upscaleResidents -= visitors;
  });
  placed.forEach((building, index) => {
    if (building.type !== "pub" || building.dressCode === "upscale") return;
    const otherVisitors = Math.min(pubStaffedCapacity, otherResidents);
    const upscaleVisitors = Math.min(pubStaffedCapacity - otherVisitors, upscaleResidents);
    pubVisitors[index] = otherVisitors + upscaleVisitors;
    otherResidents -= otherVisitors;
    upscaleResidents -= upscaleVisitors;
  });
  const restaurantStaffedCapacity = Math.floor(restaurantCapacity * staffing);
  const restaurantVisitors = placed.map(() => 0);
  let diners = population;
  placed.map((_, index) => index)
    .filter((index) => placed[index].type === "restaurant")
    .sort((a, b) => restaurantQuality(placed[b].tableSetting) - restaurantQuality(placed[a].tableSetting) || a - b)
    .forEach((index) => {
      restaurantVisitors[index] = Math.min(restaurantStaffedCapacity, diners);
      diners -= restaurantVisitors[index];
    });

  const island = calculateIsland({ placed, population, jobs, buildingStaffing, powered, educated, modifiers, money, superpowers, food: staffedFood });
  const hasReligiousBuilding = placed.some((building) => building.type === "church" || building.type === "cathedral");
  const hasSchool = placed.some((building) => building.type === "high-school" || building.type === "college");
  const newEntertainmentCount = placed.reduce((sum, building, index) => sum + (entertainmentTypes.includes(building.type) ? buildingStaffing[index] : 0), 0);
  const mediaBonus = Math.min(4, island.media / 20 * 2);
  const approvalModifiers = (hasReligiousBuilding ? island.ratings.religion / 100 * 8 : 0)
    + Math.min(6, newEntertainmentCount * 1.5)
    + (placed.some((building, i) => building.type === "hospital" && buildingStaffing[i] > 0) ? 5 : 0)
    + (hasSchool ? island.ratings.education / 100 * 4 : 0)
    + mediaBonus
    + Math.min(4, island.beauty / 5)
    - Math.max(0, island.ratings.crime - 40) * 0.5
    - Math.max(0, 50 - island.ratings.liberty) * 0.2
    - Math.max(0, 40 - island.ratings.environment) * 0.25
    + modifiers.approvalModifier;
  const baseApproval = 20 + 30 * housingScore + 35 * foodScore + (clinic ? 15 : 0) + teamsterMorale;
  island.factions.loyalists.respect = clamp(island.factions.loyalists.respect + baseApproval / 10);
  const approval = Math.round(clamp(baseApproval + approvalModifiers));

  const pubRevenue = pubVisitors.reduce((sum, visitors) => sum + visitors * pubCharge, 0);
  const restaurantRevenue = restaurantVisitors.reduce((sum, visitors) => sum + visitors * restaurantCharge, 0);
  const buildingIncome = placed.map((building, index) => {
    let gross = production[index].revenue * buildingStaffing[index] * (building.type === "farm" ? modifiers.exportPriceMultiplier : 1);
    if (building.type === "farm" || building.type === "logging-camp" || building.type === "mine") gross *= 1 + dockBonus;
    if (building.type === "farm" || building.type === "ranch") gross *= 1 + haulingBonus;
    if (building.type === "pub") gross += pubVisitors[index] * pubCharge;
    if (building.type === "restaurant") gross += restaurantVisitors[index] * restaurantCharge;
    gross += factoryIncome[index];
    if (defs[index].jobs > 0) gross *= modifiers.productivityMultiplier;
    if (building.type === "logging-camp" || building.type === "mine" || building.type === "fishermans-wharf") {
      const produced = buildingProducedGood(building);
      if (!produced) throw new Error(`Missing produced good for ${building.type}.`);
      gross += buildingStaffing[index] * (rawPrices[produced] ?? 0) * (building.type === "logging-camp" || building.type === "mine" ? 1 + dockBonus : 1) * modifiers.exportPriceMultiplier;
    }
    if (building.type === "fishermans-wharf") gross += buildingStaffing[index] * 18 * 8;
    if (building.type === "market") gross += production[index].revenue * staffing;
    if (entertainmentTypes.includes(building.type)) gross += Math.min(population, (buildingEffects[building.type].capacity ?? 0) * buildingStaffing[index]) * 8;
    return gross;
  });
  const touristsHaveGateway = placed.some((building, i) => (building.type === "dock" || building.type === "airport") && buildingStaffing[i] > 0);
  const totalBeds = placed.reduce((sum, building, i) => sum + (buildingEffects[building.type].beds ?? 0) * (defs[i].jobs ? buildingStaffing[i] : 1), 0);
  const gateway = placed.reduce((sum, building, i) => sum + (building.type === "airport" ? 30 * buildingStaffing[i] : building.type === "dock" ? 8 * buildingStaffing[i] : 0), 0);
  const tourists = touristsHaveGateway ? Math.min(Math.floor(totalBeds), Math.round(gateway * island.ratings.tourism / 100)) : 0;
  let remainingTourists = tourists;
  let tourismIncome = 0;
  const buildingTourists = placed.map(() => 0);
  placed.forEach((building, index) => {
    const beds = buildingEffects[building.type].beds ?? 0;
    if (!beds || remainingTourists <= 0) return;
    const accommodated = Math.min(remainingTourists, Math.ceil(beds * (defs[index].jobs ? buildingStaffing[index] : 1)));
    buildingTourists[index] = accommodated;
    tourismIncome += accommodated * (buildingEffects[building.type].bedRate ?? 0) * (powered[index] && (building.type === "hotel" || building.type === "luxury-hotel") ? 1.1 : 1);
    remainingTourists -= accommodated;
  });
  const availableSpend = tourists * Math.min(20, touristAttractions.reduce((sum, type) => sum + (placed.some((item) => item.type === type) ? 2 : 0), 0));
  tourismIncome = (tourismIncome + availableSpend) * modifiers.tourismIncomeMultiplier;
  buildingTourists.forEach((visitors, index) => {
    if (visitors) buildingIncome[index] += visitors * (buildingEffects[placed[index].type].bedRate ?? 0) * (powered[index] && (placed[index].type === "hotel" || placed[index].type === "luxury-hotel") ? 1.1 : 1) * modifiers.tourismIncomeMultiplier;
  });
  const bankInterest = placed.some((building, i) => building.type === "bank" && buildingStaffing[i] > 0)
    ? Math.round(Math.min(300, Math.max(0, money) * 0.01 * placed.reduce((sum, building, i) => sum + (building.type === "bank" ? buildingStaffing[i] : 0), 0))) : 0;
  const staffedBanks = placed.reduce((sum, building, i) => sum + (building.type === "bank" ? buildingStaffing[i] : 0), 0);
  buildingIncome.forEach((_, index) => {
    if (placed[index].type === "bank" && staffedBanks > 0) buildingIncome[index] += bankInterest * buildingStaffing[index] / staffedBanks;
  });
  const roomIncome = buildingTourists.map((visitors, index) => visitors * (buildingEffects[placed[index].type].bedRate ?? 0)
    * (powered[index] && (placed[index].type === "hotel" || placed[index].type === "luxury-hotel") ? 1.1 : 1) * modifiers.tourismIncomeMultiplier);
  const securityStaff = island.military + placed.reduce((sum, building, index) => sum + (building.type === "police-station" ? defs[index].jobs * buildingStaffing[index] : 0), 0);
  const monthlyEdictCosts = population * modifiers.monthlyCostPerResident + securityStaff * modifiers.monthlyCostPerSecurityStaff;
  const balance = Math.round(100 + pubRevenue + restaurantRevenue + tourismIncome + bankInterest + modifiers.monthlyIncome - monthlyEdictCosts
    + placed.reduce((sum, building, index) => {
      const definition = defs[index];
      const operation = modifiers.closedBuildingTypes.includes(building.type) ? 0 : legacyBuildings.has(building.type) || definition.jobs === 0 ? 1 : buildingStaffing[index];
      const upkeep = buildingUpkeep(building) * operation
        * (factoryTypes.includes(building.type) ? modifiers.factoryUpkeepMultiplier : 1);
      return sum + buildingIncome[index]
        - (building.type === "pub" ? pubVisitors[index] * pubCharge : 0)
        - (building.type === "restaurant" ? restaurantVisitors[index] * restaurantCharge : 0)
        - roomIncome[index]
        - (building.type === "bank" && staffedBanks > 0 ? bankInterest * buildingStaffing[index] / staffedBanks : 0)
        - upkeep;
    }, 0));
  return {
    housing, food: staffedFood, jobs, approval, balance, pubVisitors, pubStaffedCapacity,
    restaurantVisitors, restaurantStaffedCapacity, haulingBonus, buildingStaffing, buildingIncome,
    goods, powered, ratings: island.ratings, factions: island.factions, military: island.military,
    police: placed.reduce((sum, building, i) => sum + (building.type === "police-station" ? buildingStaffing[i] * 6 : 0), 0),
    jailCapacity: island.jailCapacity, tourists, buildingTourists, tourismIncome, educated, modifiers,
  };
}

export function missingRequirement(type: BuildingType, state: Pick<GameSnapshot, "placed">): string | null {
  const has = (types: BuildingType[]) => state.placed.some((building) => types.includes(building.type));
  const effect = buildingEffects[type];
  for (const required of effect.requires ?? []) {
    if (!has([required])) {
      const name = buildings.find((item) => item.id === required)!.name;
      return `Requires a ${name}`;
    }
  }
  for (const alternatives of effect.requiresAny ?? []) {
    if (has(alternatives)) continue;
    if (alternatives.some((building) => ["hotel", "luxury-hotel", "cheap-motel", "beach-villa", "bungalow"].includes(building))) {
      return "Requires a hotel, motel, villa, or bungalow";
    }
    return `Requires one of: ${alternatives.map((item) => buildings.find((definition) => definition.id === item)!.name).join(", ")}`;
  }
  return null;
}

export function buildingCost(type: BuildingType, state: Pick<GameSnapshot, "placed"> & Partial<Pick<GameSnapshot, "buildingStaffing" | "modifiers">>): number {
  const definition = buildings.find((item) => item.id === type)!;
  const staffing = state.buildingStaffing ?? calculate(state.placed, 8).buildingStaffing;
  const staffedOffices = state.placed.reduce((sum, building, index) => building.type === "construction-office" ? sum + staffing[index] : sum, 0);
  const discount = Math.min(0.15, staffedOffices * 0.05);
  const modifiers = state.modifiers ?? defaultIslandModifiers;
  const aidDiscount = modifiers.halfPriceBuildingTypes.includes(type) ? 0.5 : 1;
  return Math.ceil(definition.cost * (1 - discount) * modifiers.costMultiplier * aidDiscount);
}

export class GameState {
  private listeners = new Set<() => void>();
  private initialized = false;
  private elapsed = 0;
  private warnedRelations = false;
  private baseModifiers: IslandModifiers = { ...defaultIslandModifiers, superpowerAdjustments: { ...defaultIslandModifiers.superpowerAdjustments }, factionAdjustments: {}, factionShareMultipliers: {} };
  private state: GameSnapshot = {
    money: 3000, slushFund: 0, population: 8, month: 1, year: 1950, paused: false, speed: 1,
    selected: null, inspectedBuilding: null, farmCrop: "corn", pubDressCode: "none", restaurantTableSetting: "cloth", teamsterWorkMode: "normal", immigrationOption: "open", placementRotation: 0, placed: [],
    superpowers: { us: 50, ussr: 50 }, rebels: 0, rngSeed: 5381,
    nextElectionYear: 1954, gameOver: null, activeEdicts: [], edictCooldowns: {}, issuedOnce: {}, jailUsed: 0, jailReleases: [],
    ...calculate([], 8, { highSchool: 1, college: 1 }, { ...defaultIslandModifiers }, 3000),
    notice: "Loading the island...",
  };

  getSnapshot = () => this.state;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private effectiveModifiers(activeEdicts = this.state.activeEdicts) {
    const combined = combineEdictModifiers(this.baseModifiers, activeEdicts.map((entry) => entry.id));
    combined.superpowerAdjustments = { ...this.baseModifiers.superpowerAdjustments };
    return combined;
  }

  private simulate(placed = this.state.placed, population = this.state.population, money = this.state.money, educated = this.state.educated, modifiers = this.state.modifiers) {
    return calculate(placed, population, educated, modifiers, money, this.state.superpowers);
  }

  private update(patch: Partial<GameSnapshot>) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((listener) => listener());
  }

  initializeIsland(placed: PlacedBuilding[]) {
    if (this.initialized) throw new Error("The island has already been initialized.");
    if (placed.length !== starterBuildings.length || placed.some((item, index) => item.type !== starterBuildings[index])) {
      throw new Error("Invalid starting settlement.");
    }
    this.initialized = true;
    this.update({
      placed: placed.map((item) => ({ ...item })),
      ...this.simulate(placed, this.state.population),
      notice: "Your palace and farm are ready. Residents will build shacks if they need shelter.",
    });
  }

  /** Developer start: one of every building, so models can be inspected side by side. */
  initializeShowcase(placed: PlacedBuilding[]) {
    if (this.initialized) throw new Error("The island has already been initialized.");
    const types = placed.map((item) => item.type);
    if (types.length !== buildings.length || buildings.some((item) => !types.includes(item.id))) {
      throw new Error("The showcase must contain exactly one of every building.");
    }
    this.initialized = true;
    this.update({
      placed: placed.map((item) => ({ ...item })),
      ...this.simulate(placed, this.state.population),
      notice: "Developer showcase: one of every building. Add ?normal-start to the URL for a regular island.",
    });
  }

  addShack(x: number, z: number): boolean {
    if (this.state.housing >= this.state.population) return false;
    const placed = [...this.state.placed, { type: "shack" as const, x, z }];
    this.update({ placed, ...this.simulate(placed, this.state.population) });
    return true;
  }

  select(type: BuildingType | null) {
    this.update({ selected: type, inspectedBuilding: null, notice: type ? `Place a ${buildings.find((item) => item.id === type)!.name} on level land. Esc cancels.` : "Placement cancelled." });
  }

  inspectBuilding(index: number | null) {
    if (index !== null && !this.state.placed[index]) throw new Error("Cannot inspect a missing building.");
    this.update({ inspectedBuilding: index });
  }

  setBuildingCrop(index: number, crop: FarmCrop) {
    const building = this.state.placed[index];
    if (!building || building.type !== "farm") throw new Error("Cannot set a crop on a non-farm building.");
    const placed = this.state.placed.map((item, i) => i === index ? { ...item, crop } : item);
    this.update({ placed, ...this.simulate(placed, this.state.population), notice: `Farm crop changed to ${crop}.` });
  }

  setBuildingMineResource(index: number, resource: MineResource) {
    const building = this.state.placed[index];
    if (!building || building.type !== "mine") throw new Error("Cannot set a resource on a non-mine building.");
    if (!mineResources.includes(resource)) throw new Error("Invalid mine resource.");
    const placed = this.state.placed.map((item, i) => i === index ? { ...item, mineResource: resource } : item);
    this.update({ placed, ...this.simulate(placed, this.state.population), notice: `Mine now extracts ${resource}.` });
  }

  setBuildingDressCode(index: number, dressCode: PubDressCode) {
    const building = this.state.placed[index];
    if (!building || building.type !== "pub") throw new Error("Cannot set a dress code on a non-pub building.");
    const placed = this.state.placed.map((item, i) => i === index ? { ...item, dressCode } : item);
    this.update({ placed, ...this.simulate(placed, this.state.population), notice: `Pub dress code changed to ${dressCode === "none" ? "none" : "upscale"}.` });
  }

  setBuildingTableSetting(index: number, tableSetting: RestaurantTableSetting) {
    const building = this.state.placed[index];
    if (!building || building.type !== "restaurant") throw new Error("Cannot set table settings on a non-restaurant building.");
    const placed = this.state.placed.map((item, i) => i === index ? { ...item, tableSetting } : item);
    this.update({ placed, ...this.simulate(placed, this.state.population), notice: `Restaurant now uses ${restaurantTableSettingDetails[tableSetting].name.toLowerCase()}.` });
  }

  setBuildingWorkMode(index: number, workMode: TeamsterWorkMode) {
    const building = this.state.placed[index];
    if (!building || building.type !== "teamsters-office") throw new Error("Cannot set work hours on a non-teamster building.");
    const placed = this.state.placed.map((item, i) => i === index ? { ...item, workMode } : item);
    this.update({ placed, ...this.simulate(placed, this.state.population), notice: `Teamster's Office now works ${teamsterWorkModeDetails[workMode].name.toLowerCase()}.` });
  }

  selectTeamsterWorkMode(workMode: TeamsterWorkMode) {
    this.update({ teamsterWorkMode: workMode });
  }

  rotatePlacement(direction: 1 | -1) {
    this.update({ placementRotation: ((this.state.placementRotation + direction + 4) % 4) as Rotation });
  }

  selectRestaurantTableSetting(tableSetting: RestaurantTableSetting) {
    this.update({ restaurantTableSetting: tableSetting });
  }

  selectFarmCrop(crop: FarmCrop) {
    this.update({ farmCrop: crop });
  }

  selectPubDressCode(dressCode: PubDressCode) {
    this.update({ pubDressCode: dressCode });
  }

  selectImmigrationOption(option: ImmigrationOption) {
    this.update({ immigrationOption: option });
  }

  setBuildingImmigrationOption(index: number, option: ImmigrationOption) {
    const building = this.state.placed[index];
    if (!building || building.type !== "immigration-office") throw new Error("Cannot set an immigration policy on a non-immigration office.");
    const placed = this.state.placed.map((item, i) => i === index ? { ...item, immigrationOption: option } : item);
    this.update({ placed, ...this.simulate(placed, this.state.population) });
  }

  setSimulationModifiers(patch: Partial<IslandModifiers>) {
    this.baseModifiers = {
      ...this.baseModifiers,
      ...patch,
      superpowerAdjustments: { ...this.baseModifiers.superpowerAdjustments, ...patch.superpowerAdjustments },
      factionAdjustments: { ...this.baseModifiers.factionAdjustments, ...patch.factionAdjustments },
      factionShareMultipliers: { ...this.baseModifiers.factionShareMultipliers, ...patch.factionShareMultipliers },
    };
    const modifiers = this.effectiveModifiers();
    this.update(calculate(this.state.placed, this.state.population, this.state.educated, modifiers, this.state.money, this.state.superpowers));
  }

  issueEdict(id: string): string | null {
    const edict = edictDefinitions.find((entry) => entry.id === id);
    if (!edict) return `Unknown edict: ${id}`;
    const edictId = edict.id as EdictId;
    const reason = edictUnavailableReason(edictId, this.state, missingRequirement);
    if (reason) return reason;

    const cost = edictCost(edictId, this.state);
    const monthIndex = currentMonthIndex(this.state);
    const activeEdicts = [...this.state.activeEdicts];
    if (edict.toggle || edict.durationMonths || (edict.once && edict.modifiers)) activeEdicts.push({ id: edictId, expiresAt: edict.durationMonths ? monthIndex + edict.durationMonths : null });
    const issuedOnce = edict.once ? { ...this.state.issuedOnce, [edictId]: true as const } : this.state.issuedOnce;
    const edictCooldowns = edict.cooldownMonths ? { ...this.state.edictCooldowns, [edict.cooldownKey ?? edictId]: monthIndex + edict.cooldownMonths } : this.state.edictCooldowns;
    let money = this.state.money - cost;
    let slushFund = this.state.slushFund;
    let rebels = this.state.rebels;
    let jailUsed = this.state.jailUsed;
    let jailReleases = this.state.jailReleases;
    let educated = this.state.educated;
    let superpowers = { ...this.state.superpowers };
    let rngSeed = this.state.rngSeed;

    switch (edict.event) {
      case "arrest":
      case "capture": {
        rngSeed = (1664525 * rngSeed + 1013904223) >>> 0;
        jailReleases = [...jailReleases, currentMonthIndex(this.state) + 60 + (rngSeed % 37)];
        jailUsed = jailReleases.length;
        rebels = Math.max(0, rebels - 1);
        break;
      }
      case "heretic": {
        const factionAdjustments = { ...this.baseModifiers.factionAdjustments, religious: (this.baseModifiers.factionAdjustments.religious ?? 0) + 3 };
        this.baseModifiers = { ...this.baseModifiers, factionAdjustments };
        break;
      }
      case "eliminate": rebels = Math.max(0, rebels - 1); break;
      case "praise-us": superpowers = { us: Math.min(100, superpowers.us + 10), ussr: Math.max(0, superpowers.ussr - 4) }; break;
      case "praise-ussr": superpowers = { us: Math.max(0, superpowers.us - 4), ussr: Math.min(100, superpowers.ussr + 10) }; break;
      case "trade-us":
      case "trade-ussr": {
        rngSeed = (1664525 * rngSeed + 1013904223) >>> 0;
        switch (rngSeed % 4) {
          case 0: money += 5000; break;
          case 1: educated = { ...educated, highSchool: Math.min(this.state.population - educated.college, educated.highSchool + 2) }; break;
          case 2: money += 2500; break;
          default: superpowers[edict.event === "trade-us" ? "us" : "ussr"] = Math.min(100, superpowers[edict.event === "trade-us" ? "us" : "ussr"] + 5);
        }
        break;
      }
      case "amnesty": rebels = 0; break;
      case "early-election": this.baseModifiers = { ...this.baseModifiers, electionTrigger: true }; break;
      case "open-jails": jailUsed = 0; jailReleases = []; superpowers.us = Math.max(0, superpowers.us - 10); break;
      case "papal-visit": {
        const factionAdjustments = { ...this.baseModifiers.factionAdjustments };
        for (const faction of ["communists", "capitalists", "intellectuals", "militarists", "environmentalists", "nationalists", "loyalists"] as const) factionAdjustments[faction] = (factionAdjustments[faction] ?? 0) + 15;
        factionAdjustments.religious = (factionAdjustments.religious ?? 0) + 50;
        this.baseModifiers = { ...this.baseModifiers, approvalModifier: this.baseModifiers.approvalModifier + 25, factionAdjustments };
        break;
      }
    }
    if (edict.id === "headliner") superpowers.us = Math.min(100, superpowers.us + 10);
    const skimRate = this.state.modifiers.swissSkimRate;
    slushFund += Math.floor(cost * skimRate);
    const modifiers = this.effectiveModifiers(activeEdicts);
    this.update({
      money, slushFund, rebels, jailUsed, jailReleases, superpowers, rngSeed, activeEdicts, issuedOnce, edictCooldowns,
      ...calculate(this.state.placed, this.state.population, educated, modifiers, money, superpowers),
      notice: `${edict.name} issued for $${cost.toLocaleString()}.`,
    });
    return null;
  }

  cancelEdict(id: string): string | null {
    const edict = edictDefinitions.find((entry) => entry.id === id);
    if (!edict) return `Unknown edict: ${id}`;
    if (!edict.toggle) return `${edict.name} cannot be cancelled.`;
    if (!this.state.activeEdicts.some((entry) => entry.id === edict.id)) return `${edict.name} is not active.`;
    const activeEdicts = this.state.activeEdicts.filter((entry) => entry.id !== edict.id);
    const modifiers = this.effectiveModifiers(activeEdicts);
    this.update({ activeEdicts, ...calculate(this.state.placed, this.state.population, this.state.educated, modifiers, this.state.money, this.state.superpowers), notice: `${edict.name} cancelled.` });
    return null;
  }

  togglePause() {
    this.update({ paused: !this.state.paused });
  }

  setSpeed(speed: GameSpeed) {
    if (!gameSpeeds.some((option) => option === speed)) throw new Error("Invalid game speed.");
    this.update({ speed });
  }

  advanceTime(seconds: number): number {
    if (!Number.isFinite(seconds) || seconds < 0) throw new Error("Invalid elapsed time.");
    if (this.state.paused) return 0;
    const elapsed = seconds * this.state.speed;
    this.elapsed += elapsed;
    while (this.elapsed >= 5) {
      this.elapsed -= 5;
      this.advanceMonth();
    }
    return elapsed;
  }

  notify(notice: string) {
    this.update({ notice });
  }

  place(type: BuildingType, x: number, z: number): boolean {
    const definition = buildings.find((item) => item.id === type)!;
    if (type === "palace" || type === "shack") {
      this.notify(type === "palace" ? "The island already has a palace." : "Residents build shacks themselves when they need shelter.");
      return false;
    }
    if (definition.landmark) {
      this.notify(`The ${definition.name} is a historic landmark and cannot be built.`);
      return false;
    }
    const requirement = missingRequirement(type, this.state);
    if (requirement) {
      this.notify(`${definition.name}: ${requirement}.`);
      return false;
    }
    if (definition.unique && this.state.placed.some((item) => item.type === type)) {
      this.notify(`The island can only have one ${definition.name}.`);
      return false;
    }
    const cost = buildingCost(type, this.state);
    const skim = Math.floor(cost * this.state.modifiers.swissSkimRate);
    if (this.state.money < cost) {
      this.notify(`Not enough treasury funds for a ${definition.name}.`);
      return false;
    }
    const building: PlacedBuilding = { type, x, z, rotation: this.state.placementRotation };
    if (type === "farm") building.crop = this.state.farmCrop;
    if (type === "pub") building.dressCode = this.state.pubDressCode;
    if (type === "restaurant") building.tableSetting = this.state.restaurantTableSetting;
    if (type === "teamsters-office") building.workMode = this.state.teamsterWorkMode;
    if (type === "immigration-office") building.immigrationOption = this.state.immigrationOption;
    const placed = [...this.state.placed, building];
    this.update({
      placed,
      money: this.state.money - cost,
      slushFund: this.state.slushFund + skim,
      ...this.simulate(placed, this.state.population, this.state.money - cost),
      notice: `${definition.name} built for $${cost}. Click to build another, or press Esc.`,
    });
    return true;
  }

  advanceMonth() {
    if (this.state.paused || this.state.gameOver) return;
    const { placed, population, month, year } = this.state;
    const current = calculate(placed, population, this.state.educated, this.state.modifiers, this.state.money, this.state.superpowers);
    const staffed = (type: BuildingType) => placed.reduce((sum, building, i) => sum + (building.type === type ? current.buildingStaffing[i] : 0), 0);
    const highSchoolGraduates = Math.min(Math.max(0, population - this.state.educated.highSchool - this.state.educated.college), staffed("high-school") * 2 * this.state.modifiers.educationMultiplier);
    const collegeGraduates = Math.min(this.state.educated.highSchool + highSchoolGraduates, staffed("college") * this.state.modifiers.educationMultiplier);
    const nextEducated = {
      highSchool: Math.min(population, this.state.educated.highSchool + highSchoolGraduates - collegeGraduates),
      college: Math.min(population, this.state.educated.college + collegeGraduates),
    };
    let nextPopulation = population;
    const canGrow = current.approval >= 60 && current.housing > population && current.jobs > population;
    if (canGrow) {
      const immigrationOffices = placed.filter((building) => building.type === "immigration-office");
      const officeClosed = immigrationOffices.some((building) => (building.immigrationOption ?? "open") === "closed");
      const hasImmigrationMechanic = placed.some((building) => building.type === "dock" || building.type === "airport" || building.type === "immigration-office");
      const incoming = (!hasImmigrationMechanic ? 1 : officeClosed ? 0
        : 1 + (staffed("dock") > 0 ? 1 : 0) + (staffed("airport") > 0 ? 2 : 0) + (staffed("immigration-office") > 0 ? 1 : 0)) * this.state.modifiers.populationGrowthMultiplier;
      nextPopulation += Math.min(Math.round(incoming), current.housing - population, current.jobs - population);
    } else if (current.approval < 35 && population > 0) {
      nextPopulation--;
    }
    nextEducated.highSchool = Math.min(nextEducated.highSchool, nextPopulation);
    nextEducated.college = Math.min(nextEducated.college, nextPopulation - nextEducated.highSchool);

    let seed = this.state.rngSeed >>> 0;
    const random = () => { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 0x100000000; };
    const disaffected = Object.values(current.factions).reduce((sum, faction) => sum + (faction.respect < 25 ? faction.share * population : 0), 0);
    let rebels = this.state.rebels;
    for (let citizen = 0; citizen < Math.floor(disaffected); citizen++) if (random() < Math.max(0, 0.025 + this.state.modifiers.rebelsModifier + this.state.modifiers.protestChanceModifier / 100)) rebels++;
    rebels = Math.max(0, rebels - Math.floor(Math.min(rebels, current.jailCapacity)));
    const military = current.military;
    const police = current.police;
    const raided = rebels > military ? Math.min(this.state.money, Math.ceil((rebels - military) * 10)) : 0;
    let gameOver: string | null = null;
    if (rebels >= 10 && rebels > 2 * (military + police)) gameOver = "El Presidente has been overthrown by the rebels.";
    if (current.factions.militarists.respect < 15 && military >= 8) gameOver = "The military has staged a coup.";

    const superpowers = { ...this.state.superpowers };
    for (const power of ["us", "ussr"] as const) {
      const factionRespect = current.factions[power === "us" ? "capitalists" : "communists"].respect;
      const target = 50 + (factionRespect - 50) * 0.4;
      const pace = staffed("diplomatic-ministry") > 0 ? 2 : 1;
      const delta = Math.sign(target - superpowers[power]) * Math.min(pace, Math.abs(target - superpowers[power]));
      superpowers[power] = clamp(superpowers[power] + delta + this.state.modifiers.superpowerAdjustments[power] + (power === "us" && current.tourists > 0 ? 0.1 : 0));
    }
    let notice = "";
    if (!this.warnedRelations && (superpowers.us < 20 || superpowers.ussr < 20)) {
      notice = "Warning: a superpower's relations have fallen below 20.";
      this.warnedRelations = true;
    }
    if ((superpowers.us < 10 && !this.state.modifiers.protectedSuperpowers.includes("us")) || (superpowers.ussr < 10 && !this.state.modifiers.protectedSuperpowers.includes("ussr"))) gameOver = "A superpower invaded after relations fell below 10.";

    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    let nextElectionYear = this.state.nextElectionYear;
    const electionDue = !this.state.modifiers.cancelElections && (this.state.modifiers.electionTrigger || (nextMonth === 1 && nextYear >= 1954 && (nextYear - 1954) % 4 === 0));
    if (electionDue) {
      const weightedRespect = Object.values(current.factions).reduce((sum, faction) => sum + faction.respect * faction.share, 0);
      const vote = Math.round((weightedRespect + current.approval) / 2);
      if (vote < 50) gameOver = `El Presidente lost the election with ${vote}% of the vote.`;
      else notice = `Election won with ${vote}% of the vote.`;
      nextElectionYear = nextYear + (nextYear < 1954 ? 1954 - nextYear : 4);
    } else if (nextElectionYear <= nextYear) {
      nextElectionYear = Math.max(1954, nextYear + ((4 - ((nextYear - 1954) % 4) + 4) % 4));
    }
    if (gameOver) notice = gameOver;
    if (electionDue && this.baseModifiers.electionTrigger) this.baseModifiers = { ...this.baseModifiers, electionTrigger: false };
    const nextMonthIndex = nextYear * 12 + nextMonth - 1;
    const activeEdicts = this.state.activeEdicts.filter((entry) => entry.expiresAt === null || entry.expiresAt > nextMonthIndex);
    const modifiers = this.effectiveModifiers(activeEdicts);
    const nextJailCapacity = calculateIsland({ placed, population: nextPopulation, buildingStaffing: current.buildingStaffing, jobs: current.jobs, educated: nextEducated, money: this.state.money, superpowers, food: current.food, modifiers }).jailCapacity;
    const jailReleases = this.state.jailReleases.filter((releaseAt) => releaseAt > nextMonthIndex).slice(0, Math.floor(nextJailCapacity));
    this.update({
      money: this.state.money + current.balance - raided,
      population: nextPopulation,
      rebels,
      rngSeed: seed,
      superpowers,
      month: nextMonth,
      year: nextYear,
      nextElectionYear,
      gameOver,
      paused: Boolean(gameOver),
      activeEdicts,
      jailReleases,
      jailUsed: jailReleases.length,
      notice: notice || this.state.notice,
      ...calculate(placed, nextPopulation, nextEducated, modifiers, this.state.money + current.balance - raided, superpowers),
    });
  }
}

export const game = new GameState();
