import React, { useSyncExternalStore } from "react";
import Box from "@mui/material/Box";
import Minimap from "./minimap/Minimap";
import StatsPanel from "./stats/StatsPanel";
import ActionHud from "./action-hud/ActionHud";
import NotificationsPanel from "./notifications/NotificationsPanel";
import { buildings, game, restaurantTableSettingDetails, teamsterWorkModeDetails } from "../logic/game";
import BuildingDetails from "./BuildingDetails";

const HUD: React.FC = () => {
  const { selected, farmCrop, pubDressCode, restaurantTableSetting, teamsterWorkMode } = useSyncExternalStore(game.subscribe, game.getSnapshot);
  const building = buildings.find((item) => item.id === selected);
  const option = selected === "farm" ? farmCrop
    : selected === "pub" ? (pubDressCode === "none" ? "no dress code" : "upscale dress code")
    : selected === "restaurant" ? restaurantTableSettingDetails[restaurantTableSetting].name.toLowerCase()
    : selected === "teamsters-office" ? teamsterWorkModeDetails[teamsterWorkMode].name.toLowerCase()
    : null;
  return (
    <Box sx={{ width: '100vw', height: '100vh', pointerEvents: 'none', position: 'fixed', top: 0, left: 0, zIndex: 10 }}>
      <Box component="div" role="status" aria-label="Building selection" sx={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 16,
        background: 'linear-gradient(#49392c, #241f1a)', borderTop: '1px solid #938264',
        color: '#f0e2bc', textAlign: 'center', font: 'bold 10px/15px Arial, sans-serif',
        overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
      }}>
        {building ? `${building.name}${option ? ` (${option})` : ""} · ${building.tiles[0]}×${building.tiles[1]} tiles · $${building.cost.toLocaleString()} · Click to build, [ ] or right-click to rotate` : "Select a building to build"}
      </Box>
      <Minimap />
      <NotificationsPanel />
      <BuildingDetails />
      <StatsPanel />
      <ActionHud />
    </Box>
  );
};

export default HUD;
