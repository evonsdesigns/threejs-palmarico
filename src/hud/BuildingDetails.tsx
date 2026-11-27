import React, { useSyncExternalStore } from "react";
import { buildings, buildingProducedGood, buildingUpkeep, farmCropProduction, farmCrops, game, maxHaulingBonus, mineResourcePrices, mineResources, pubCapacity, pubCharge, pubDressCodes, restaurantCapacity, restaurantCharge, restaurantQuality, restaurantTableSettingDetails, restaurantTableSettings, teamsterWorkModeDetails, teamsterWorkModes, immigrationOptions } from "../logic/game";
import { buildingEffects } from "../logic/building-effects";
import "./building-details.css";

const BuildingDetails: React.FC = () => {
  const state = useSyncExternalStore(game.subscribe, game.getSnapshot);
  const index = state.inspectedBuilding;
  if (index === null) return null;
  const building = state.placed[index];
  const definition = buildings.find((item) => item.id === building.type)!;
  const effect = buildingEffects[building.type];
  const producedGood = buildingProducedGood(building);
  const educationName = effect.education === "high-school" ? "High school" : effect.education === "college" ? "College" : "None";
  const operation = state.buildingOperation[index];
  const closed = state.modifiers.closedBuildingTypes.includes(building.type);
  const gridIndex = state.power.buildingGrid[index];
  const grid = gridIndex === null ? null : state.power.grids[gridIndex];
  const blackout = state.power.coverage[index] && !state.powered[index];

  return (
    <section className="building-details" aria-label="Building details">
      <header>
        <strong>{definition.name}</strong>
        <button type="button" aria-label="Close building details" onClick={() => game.inspectBuilding(null)}>×</button>
      </header>
      <p>{definition.description}</p>
      {definition.housing > 0 && <p>Housing: {definition.housing}</p>}
      {definition.jobs > 0 && <p>Jobs: {definition.jobs}</p>}
      <p>Staffing: {Math.round((state.buildingStaffing[index] ?? 0) * 100)}% · Education: {educationName}</p>
      {(effect.powerDemand || building.type === "electric-substation" || building.type === "electric-power-plant") && (
        <p role={!state.powered[index] && !closed ? "status" : undefined}>
          Power: {state.powered[index] ? "Connected" : blackout ? "Rolling blackout" : "Disconnected"}.
          {closed ? "" : building.type === "electric-power-plant" ? ` Generating ${((effect.powerGeneration ?? 0) * state.buildingStaffing[index]).toFixed(1)} MW of ${effect.powerGeneration} MW at full staffing.${operation > 0 ? " Supplying a 24-tile radius." : " College engineers are needed."}`
            : building.type === "electric-substation" ? (state.powered[index] ? " Extending the grid by 10 tiles." : " Connect to a staffed plant or a live substation.")
            : blackout ? " Operations stopped by insufficient generation. Add engineers or another connected plant; substations do not generate power. Staff and upkeep are retained."
            : !state.powered[index] ? " Operations stopped. Build a staffed power plant or extend its grid with substations. Staff and upkeep are retained." : ""}
        </p>
      )}
      {effect.powerDemand !== undefined && <p>Demand: {(effect.powerDemand * state.buildingStaffing[index]).toFixed(1)} MW ({effect.powerDemand} MW at full staffing).</p>}
      {grid && (effect.powerDemand || effect.powerGeneration || building.type === "electric-substation") && (
        <p>Local grid: {grid.generation.toFixed(1)} MW generation; {grid.demand.toFixed(1)} MW demand; {grid.supplied.toFixed(1)} MW supplied.</p>
      )}
      {closed && <p>Operations stopped by edict.</p>}
      <p>Estimated income: ${Math.round(state.buildingIncome[index] ?? 0)}/month gross · upkeep ${buildingUpkeep(building)}/month.</p>
      {effect.capacity !== undefined && <p>Service capacity: {Math.floor(effect.capacity * operation)}; quality {effect.quality ?? "standard"}{effect.beauty ? `; beauty +${effect.beauty}` : ""}{effect.pollution ? `; pollution ${effect.pollution}` : ""}.</p>}
      {effect.beds !== undefined && <p>Tourist beds: {Math.floor(effect.beds * operation)}; current guests: {state.buildingTourists[index] ?? 0}.</p>}
      {(producedGood || effect.consumes) && <p>Goods: {producedGood ? `produces ${producedGood}` : ""}{effect.consumes?.length ? ` uses ${effect.consumes.join(", ")}` : ""}. Island production — {Object.entries(state.goods).filter(([, values]) => values.produced || values.processed).map(([good, values]) => `${good}: ${values.produced.toFixed(1)} produced, ${values.processed.toFixed(1)} processed`).join("; ") || "none"}</p>}
      {building.type === "mine" && (
        <>
          <label>
            Resource
            <select value={building.mineResource ?? "gold"} onChange={(event) => {
              const resource = mineResources.find((item) => item === event.target.value);
              if (!resource) throw new Error("Invalid mine resource selection.");
              game.setBuildingMineResource(index, resource);
            }}>
              {mineResources.map((resource) => <option value={resource} key={resource}>{resource[0].toUpperCase() + resource.slice(1)}</option>)}
            </select>
          </label>
          <p>At full staffing: 1 load/month, ${mineResourcePrices[building.mineResource ?? "gold"]}/load before bonuses and upkeep. Gold can be processed into jewelry.</p>
          <p>Resource selection and prices are provisional; terrain deposits are not yet simulated.</p>
        </>
      )}
      {building.type === "immigration-office" && (
        <label>
          Immigration policy
          <select value={building.immigrationOption ?? "open"} onChange={(event) => {
            const option = immigrationOptions.find((item) => item === event.target.value);
            if (!option) throw new Error("Invalid immigration option.");
            game.setBuildingImmigrationOption(index, option);
          }}>
            <option value="open">Open (+1 immigrant/month)</option>
            <option value="closed">Closed (no immigration)</option>
          </select>
        </label>
      )}
      {building.type === "farm" && (
        <>
          <label>
            Crop
            <select value={building.crop ?? "corn"} onChange={(event) => {
              const crop = farmCrops.find((item) => item === event.target.value);
              if (!crop) throw new Error("Invalid farm crop selection.");
              game.setBuildingCrop(index, crop);
            }}>
              {farmCrops.map((crop) => <option value={crop} key={crop}>{crop[0].toUpperCase() + crop.slice(1)}</option>)}
            </select>
          </label>
          <p>At full staffing: {farmCropProduction[building.crop ?? "corn"].food} food, ${farmCropProduction[building.crop ?? "corn"].revenue}/month before upkeep.</p>
        </>
      )}
      {building.type === "pub" && (
        <>
          <label>
            Dress code
            <select value={building.dressCode ?? "none"} onChange={(event) => {
              const dressCode = pubDressCodes.find((item) => item === event.target.value);
              if (!dressCode) throw new Error("Invalid pub dress code.");
              game.setBuildingDressCode(index, dressCode);
            }}>
              <option value="none">No dress code</option>
              <option value="upscale">Upscale dress code</option>
            </select>
          </label>
          <p>Estimated visits: {state.pubVisitors[index]}/{pubCapacity} per month (staffed capacity: {state.pubStaffedCapacity}).</p>
          <p>Estimated income: ${state.pubVisitors[index] * pubCharge}/month before upkeep.</p>
          <p>Visits and income are aggregate estimates; individual needs and tourists are not simulated.</p>
        </>
      )}
      {building.type === "restaurant" && (
        <>
          <label>
            Table setting
            <select value={building.tableSetting ?? "cloth"} onChange={(event) => {
              const setting = restaurantTableSettings.find((item) => item === event.target.value);
              if (!setting) throw new Error("Invalid restaurant table setting.");
              game.setBuildingTableSetting(index, setting);
            }}>
              {restaurantTableSettings.map((setting) => (
                <option value={setting} key={setting}>{restaurantTableSettingDetails[setting].name}</option>
              ))}
            </select>
          </label>
          <p>Service quality: {restaurantQuality(building.tableSetting)}. Upkeep: ${buildingUpkeep(building)}/month.</p>
          <p>Estimated visits: {state.restaurantVisitors[index]}/{restaurantCapacity} per month (staffed capacity: {state.restaurantStaffedCapacity}).</p>
          <p>Estimated income: ${state.restaurantVisitors[index] * restaurantCharge}/month before upkeep.</p>
          <p>Visits and income are aggregate estimates; individual needs and tourists are not simulated.</p>
        </>
      )}
      {building.type === "teamsters-office" && (
        <>
          <label>
            Work hours
            <select value={building.workMode ?? "normal"} onChange={(event) => {
              const mode = teamsterWorkModes.find((item) => item === event.target.value);
              if (!mode) throw new Error("Invalid teamster work mode.");
              game.setBuildingWorkMode(index, mode);
            }}>
              {teamsterWorkModes.map((mode) => <option value={mode} key={mode}>{teamsterWorkModeDetails[mode].name}</option>)}
            </select>
          </label>
          <p>This office: +{Math.round(teamsterWorkModeDetails[building.workMode ?? "normal"].hauling * 100)}% hauling, approval {teamsterWorkModeDetails[building.workMode ?? "normal"].approval >= 0 ? "+" : ""}{teamsterWorkModeDetails[building.workMode ?? "normal"].approval}.</p>
          <p>Island hauling bonus to farm and ranch income: {Math.round(state.haulingBonus * 100)}% (all offices combined, up to {Math.round(maxHaulingBonus * 100)}%, scaled by staffing).</p>
          <p>Hauling is an aggregate estimate; individual teamsters and goods are not simulated yet.</p>
        </>
      )}
    </section>
  );
};

export default BuildingDetails;
