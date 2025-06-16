import React from "react";
import Box from "@mui/material/Box";
import Minimap from "./minimap/Minimap";
import StatsPanel from "./stats/StatsPanel";
import ActionHud from "./action-hud/ActionHud";
import NotificationsPanel from "./notifications/NotificationsPanel";

const HUD: React.FC = () => {
  return (
    <Box sx={{ width: '100vw', height: '100vh', pointerEvents: 'none', position: 'fixed', top: 0, left: 0, zIndex: 10 }}>
      <Minimap />
      <NotificationsPanel />
      <StatsPanel />
      <ActionHud />
    </Box>
  );
};

export default HUD;
