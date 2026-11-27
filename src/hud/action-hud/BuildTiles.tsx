import React, { useEffect, useState, useSyncExternalStore } from "react";
import { buildings, type BuildingType, buildingCost, farmCropProduction, farmCrops, game, missingRequirement, pubDressCodes, restaurantQuality, restaurantTableSettingDetails, restaurantTableSettings, teamsterWorkModeDetails, teamsterWorkModes } from "../../logic/game";
import { ButtonData } from "./button-data";
import { buildingThumbnails } from "./building-thumbnails";
import "./build-tiles.css";

interface BuildTilesProps {
  buttons: ButtonData[];
  availableBuildings: Record<string, BuildingType>;
}

const BuildTiles: React.FC<BuildTilesProps> = ({ buttons, availableBuildings }) => {
  const state = useSyncExternalStore(game.subscribe, game.getSnapshot);
  const { selected, farmCrop, pubDressCode, restaurantTableSetting, teamsterWorkMode } = state;
  const [images, setImages] = useState<Map<BuildingType, string>>(new Map());
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const types = buttons.map((button) => availableBuildings[button.id] ?? (button.id === "palace" ? "palace" : null))
      .filter((type): type is BuildingType => type !== null);
    try {
      setImages(buildingThumbnails(types));
      setImageError(false);
    } catch (error) {
      console.error("Unable to render building menu images:", error);
      setImageError(true);
    }
  }, [buttons, availableBuildings]);

  return (
    <div className="build-tiles" aria-label="Buildings">
      {imageError && <p className="build-tiles__error" role="status">Building images unavailable.</p>}
      {selected === "farm" && buttons.some((button) => button.id === "farm") && (
        <>
          <label className="build-tiles__crop">
            Crop
            <select value={farmCrop} onChange={(event) => {
              const crop = farmCrops.find((item) => item === event.target.value);
              if (!crop) throw new Error("Invalid farm crop selection.");
              game.selectFarmCrop(crop);
            }}>
              {farmCrops.map((crop) => <option value={crop} key={crop}>{crop[0].toUpperCase() + crop.slice(1)}</option>)}
            </select>
          </label>
          <p className="build-tiles__note">At full staffing: {farmCropProduction[farmCrop].food} food, ${farmCropProduction[farmCrop].revenue}/month before upkeep.</p>
        </>
      )}
      {selected === "pub" && buttons.some((button) => button.id === "pub") && (
        <>
          <label className="build-tiles__crop">
            Dress code
            <select value={pubDressCode} onChange={(event) => {
              const dressCode = pubDressCodes.find((item) => item === event.target.value);
              if (!dressCode) throw new Error("Invalid pub dress code.");
              game.selectPubDressCode(dressCode);
            }}>
              <option value="none">No dress code</option>
              <option value="upscale">Upscale dress code</option>
            </select>
          </label>
          <p className="build-tiles__note">Upscale admits an estimated half of residents; visitor income depends on staffing and demand.</p>
        </>
      )}
      {selected === "restaurant" && buttons.some((button) => button.id === "restaurant") && (
        <>
          <label className="build-tiles__crop">
            Table setting
            <select value={restaurantTableSetting} onChange={(event) => {
              const setting = restaurantTableSettings.find((item) => item === event.target.value);
              if (!setting) throw new Error("Invalid restaurant table setting.");
              game.selectRestaurantTableSetting(setting);
            }}>
              {restaurantTableSettings.map((setting) => (
                <option value={setting} key={setting}>{restaurantTableSettingDetails[setting].name}</option>
              ))}
            </select>
          </label>
          <p className="build-tiles__note">Service quality {restaurantQuality(restaurantTableSetting)}; upkeep ×{restaurantTableSettingDetails[restaurantTableSetting].upkeep}. Residents prefer higher-quality restaurants.</p>
        </>
      )}
      {selected === "teamsters-office" && buttons.some((button) => button.id === "teamsters-office") && (
        <>
          <label className="build-tiles__crop">
            Work hours
            <select value={teamsterWorkMode} onChange={(event) => {
              const mode = teamsterWorkModes.find((item) => item === event.target.value);
              if (!mode) throw new Error("Invalid teamster work mode.");
              game.selectTeamsterWorkMode(mode);
            }}>
              {teamsterWorkModes.map((mode) => <option value={mode} key={mode}>{teamsterWorkModeDetails[mode].name}</option>)}
            </select>
          </label>
          <p className="build-tiles__note">Hauling boosts farm and ranch income by {Math.round(teamsterWorkModeDetails[teamsterWorkMode].hauling * 100)}%; approval {teamsterWorkModeDetails[teamsterWorkMode].approval >= 0 ? "+" : ""}{teamsterWorkModeDetails[teamsterWorkMode].approval}.</p>
        </>
      )}
      {buttons.map((button) => {
        const type = availableBuildings[button.id];
        const previewType = type ?? (button.id === "palace" ? "palace" : null);
        const image = previewType ? images.get(previewType) : undefined;
        const definition = buildings.find((item) => item.id === type);
        const requirement = type ? missingRequirement(type, state) : null;
        const cost = type ? buildingCost(type, state) : 0;
        const description = definition
          ? `${button.name}: ${definition.description} ${requirement ? `${requirement}. ` : ""}Cost: $${cost}; upkeep: $${definition.upkeep}/month.`
          : `${button.name}: Not available yet.`;
        return (
          <div className="build-tile-wrap" key={button.id} title={description}>
            <button
              type="button"
              id={button.id}
              className="build-tile"
              disabled={!type || Boolean(requirement)}
              aria-label={button.name}
              aria-pressed={type ? selected === type : undefined}
              onClick={() => {
                if (type) game.select(selected === type ? null : type);
              }}
            >
              {image ? <img src={image} alt="" /> : (
                <span className="build-tile__placeholder" aria-hidden="true">
                  <svg viewBox="0 0 80 50">
                    <path d="M7 25 36 8 72 22 43 40Z M7 25v10l36 12V40 M43 40l29-18v10L43 47" />
                  </svg>
                  <span>{type ? button.name : "Unavailable"}</span>
                </span>
              )}
              {(!type || requirement) && <span className="build-tile__unavailable" aria-hidden="true">{requirement ?? button.name}</span>}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default BuildTiles;
