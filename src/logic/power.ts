import { buildingEffects } from "./building-effects";
import { GRID_TILE_SIZE } from "./grid";
import type { PlacedBuilding } from "./game";

export interface PowerGrid {
  generation: number;
  demand: number;
  supplied: number;
}

export interface PowerSummary extends PowerGrid {
  coverage: boolean[];
  buildingGrid: (number | null)[];
  grids: PowerGrid[];
}

export function calculatePower(placed: readonly PlacedBuilding[], staffing: readonly number[], month: number) {
  const suppliers = placed.flatMap((building, index) => building.type === "electric-power-plant" && staffing[index] > 0
    ? [{ index, radius: 24 * GRID_TILE_SIZE }] : []);
  const substations = new Set<number>();
  const distance = (a: number, b: number) => Math.hypot(placed[a].x - placed[b].x, placed[a].z - placed[b].z);
  for (let source = 0; source < suppliers.length; source++) {
    const supply = suppliers[source];
    placed.forEach((building, index) => {
      if (building.type !== "electric-substation" || staffing[index] <= 0 || substations.has(index)) return;
      if (distance(index, supply.index) > supply.radius) return;
      substations.add(index);
      suppliers.push({ index, radius: 10 * GRID_TILE_SIZE });
    });
  }

  const grids: PowerGrid[] = [];
  const supplierGrids = new Map<number, number>();
  suppliers.forEach((_, start) => {
    if (supplierGrids.has(start)) return;
    const gridIndex = grids.length;
    const grid: PowerGrid = { generation: 0, demand: 0, supplied: 0 };
    grids.push(grid);
    const connected = [start];
    supplierGrids.set(start, gridIndex);
    for (let source = 0; source < connected.length; source++) {
      const supply = suppliers[connected[source]];
      grid.generation += (buildingEffects[placed[supply.index].type].powerGeneration ?? 0) * staffing[supply.index];
      suppliers.forEach((other, index) => {
        if (supplierGrids.has(index) || distance(supply.index, other.index) > supply.radius + other.radius) return;
        supplierGrids.set(index, gridIndex);
        connected.push(index);
      });
    }
  });

  const buildingGrid = placed.map((_, index) => {
    const supplier = suppliers.findIndex((supply) => distance(index, supply.index) <= supply.radius);
    return supplier < 0 ? null : supplierGrids.get(supplier)!;
  });
  const coverage = buildingGrid.map((grid) => grid !== null);
  const powered = [...coverage];
  const loads = placed.map((building, index) => (buildingEffects[building.type].powerDemand ?? 0) * staffing[index]);
  grids.forEach((grid, gridIndex) => {
    const consumers = placed.map((_, index) => index).filter((index) => buildingGrid[index] === gridIndex && loads[index] > 0);
    grid.demand = consumers.reduce((sum, index) => sum + loads[index], 0);
    // Rotate the first customer monthly so overloads do not always penalize the last building.
    for (let position = 0; position < consumers.length; position++) {
      const index = consumers[(position + month % consumers.length) % consumers.length];
      const available = grid.generation - grid.supplied;
      powered[index] = loads[index] <= available + 1e-9;
      if (powered[index]) grid.supplied += loads[index];
    }
  });
  const power: PowerSummary = {
    generation: grids.reduce((sum, grid) => sum + grid.generation, 0),
    demand: loads.reduce((sum, load) => sum + load, 0),
    supplied: grids.reduce((sum, grid) => sum + grid.supplied, 0),
    coverage, buildingGrid, grids,
  };
  return { powered, power };
}
