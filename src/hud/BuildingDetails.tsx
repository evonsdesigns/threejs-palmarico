import React, { useSyncExternalStore } from "react";
import { buildings, buildingUpkeep, farmCropProduction, farmCrops, game, maxHaulingBonus, pubCapacity, pubCharge, pubDressCodes, restaurantCapacity, restaurantCharge, restaurantQuality, restaurantTableSettingDetails, restaurantTableSettings, teamsterWorkModeDetails, teamsterWorkModes } from "../logic/game";
import "./building-details.css";

const BuildingDetails: React.FC = () => {
  const state = useSyncExternalStore(game.subscribe, game.getSnapshot);
  const index = state.inspectedBuilding;
  if (index === null) return null;
  const building = state.placed[index];
  const definition = buildings.find((item) => item.id === building.type)!;

  return (
    <section className="building-details" aria-label="Building details">
      <header>
        <strong>{definition.name}</strong>
        <button type="button" aria-label="Close building details" onClick={() => game.inspectBuilding(null)}>×</button>
      </header>
      <p>{definition.description}</p>
      {definition.housing > 0 && <p>Housing: {definition.housing}</p>}
      {definition.jobs > 0 && <p>Jobs: {definition.jobs}</p>}
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
