import React, { useSyncExternalStore } from "react";
import Box from "@mui/material/Box";
import Minimap from "./minimap/Minimap";
import StatsPanel from "./stats/StatsPanel";
import ActionHud from "./action-hud/ActionHud";
import NotificationsPanel from "./notifications/NotificationsPanel";
import { buildings, game, restaurantTableSettingDetails, teamsterWorkModeDetails } from "../logic/game";
import { edictDefinitions } from "../logic/edicts";
import BuildingDetails from "./BuildingDetails";
import CitizenDetails from "./CitizenDetails";
import "./hud-frame.css";

const HUD: React.FC = () => {
  const { selected, targetingEdict, farmCrop, pubDressCode, restaurantTableSetting, teamsterWorkMode } = useSyncExternalStore(game.subscribe, game.getSnapshot);
  const targetEdict = edictDefinitions.find((edict) => edict.id === targetingEdict);
  const building = buildings.find((item) => item.id === selected);
  const option = selected === "farm" ? farmCrop
    : selected === "pub" ? (pubDressCode === "none" ? "no dress code" : "upscale dress code")
    : selected === "restaurant" ? restaurantTableSettingDetails[restaurantTableSetting].name.toLowerCase()
    : selected === "teamsters-office" ? teamsterWorkModeDetails[teamsterWorkMode].name.toLowerCase()
    : null;
  return (
    <Box className="hud-interface" sx={{ width: '100vw', height: '100vh', pointerEvents: 'none', position: 'fixed', top: 0, left: 0, zIndex: 10 }}>
      <div className="hud-foundation" aria-hidden="true" />
      <Box component="div" className="hud-status" role="status" aria-label="Building selection">
        {targetEdict ? `${targetEdict.name} · Click a citizen to pay and issue · Esc or right-click cancels`
          : building ? `${building.name}${option ? ` (${option})` : ""} · ${building.tiles[0]}×${building.tiles[1]} tiles · $${building.cost.toLocaleString()} · Click to build, [ ] or right-click to rotate` : "Select a building to build"}
      </Box>
      <Minimap />
      <NotificationsPanel />
      <BuildingDetails />
      <CitizenDetails />
      <StatsPanel />
      <ActionHud />
    </Box>
  );
};

export default HUD;
