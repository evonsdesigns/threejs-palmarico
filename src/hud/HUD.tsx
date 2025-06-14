import React from "react";
import Box from "@mui/material/Box";
import Minimap from "./minimap/Minimap";
import StatsPanel from "./stats/StatsPanel";
import ActionHud from "./action-hud/ActionHud";
import NotificationsPanel from "./notifications/NotificationsPanel";

const tropicoPaper = {
  border: '2px solid #5a3f2e',
  color: '#dcd6c9',
  boxShadow: '0 6px 10px rgba(0,0,0,0.4), inset 0 0 15px rgba(0,0,0,0.7)',
};
const tropicoButton = {
  background: 'linear-gradient(to bottom, #e0d8b0 0%, #c8c090 100%)',
  color: '#4a4a4a',
  border: '1px solid #a09870',
  boxShadow: 'inset 0 0 5px rgba(0,0,0,0.2), 2px 2px 5px rgba(0,0,0,0.2)',
  textShadow: '1px 1px 0 rgba(255,255,255,0.3)',
  fontWeight: 700,
  borderRadius: 2,
  fontSize: '10px',
  '&:hover': {
    filter: 'brightness(1.05)',
    transform: 'translateY(-1px)',
  },
  '&:active': {
    transform: 'translateY(0)',
    boxShadow: 'inset 0 0 8px rgba(0,0,0,0.3)',
  },
};

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
