import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Minimap from "./hud/minimap/Minimap";

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
      {/* Minimap Container */}
      <Minimap />

      {/* Stats Panel */}
      <Paper elevation={6} sx={{ ...tropicoPaper, position: 'absolute', bottom: 192 + 64, right: 32, width: 220, borderRadius: 2, p: 2, pointerEvents: 'auto' }}>
        <Typography variant="h6" align="center" fontWeight={700} gutterBottom>Stats</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
          {[{ label: 'Pop', value: 1200, percent: 75 },
            { label: 'Gold', value: '$15K', percent: 50 },
            { label: 'Apprv', value: '85%', percent: 85 },
            { label: 'Res', value: 420, percent: 60 },
          ].map((stat) => (
            <Box key={stat.label} sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="caption" color="text.secondary">{stat.label}: {stat.value}</Typography>
              <Box sx={{ width: '100%', height: 10, bgcolor: '#4a4a4a', borderRadius: 5, mt: 0.5 }}>
                <Box sx={{ width: `${stat.percent}%`, height: '100%', bgcolor: 'success.main', borderRadius: 5 }} />
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Notification Area */}
      <Paper elevation={6} sx={{ ...tropicoPaper, position: 'absolute', bottom: 32, right: 32, width: 128, height: 128, borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto', bgcolor: 'warning.light' }}>
        <Typography variant="h4" color="warning.main">!</Typography>
        <Typography variant="caption" color="text.secondary">New Event!</Typography>
      </Paper>

      {/* Action Bar */}
      <Paper elevation={6} sx={{ ...tropicoPaper, position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', width: 520, borderRadius: 2, p: 2, display: 'flex', gap: 2, pointerEvents: 'auto' }}>
        <Stack spacing={1} pr={2} borderRight={1} borderColor="grey.700">
          <Button variant="contained" color="primary" id="build" sx={tropicoButton}>Build</Button>
          <Button variant="contained" color="primary" id="edicts" sx={tropicoButton}>Edicts</Button>
          <Button variant="contained" color="primary" id="trade" sx={tropicoButton}>Trade</Button>
          <Button variant="contained" color="primary" id="military" sx={tropicoButton}>Military</Button>
        </Stack>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1, width: 140, pl: 2 }}>
          <Button variant="contained" color="primary" id="build-house" sx={{ ...tropicoButton, height: 56, borderRadius: 2 }}>
            House
          </Button>
          <Button variant="contained" color="primary" id="build-tenant" sx={{ ...tropicoButton, height: 56, borderRadius: 2 }}>
            Tenant
          </Button>
        </Box>
      </Paper>

      {/* Navigation Buttons */}
      <Button id="nav-btn-home" variant="contained" color="secondary" sx={{ ...tropicoButton, position: 'absolute', bottom: 32, left: 'calc(50% - 250px - 60px)', minWidth: 48, minHeight: 48, borderRadius: 2, pointerEvents: 'auto' }}>🏠</Button>
      <Button id="nav-btn-settings" variant="contained" color="secondary" sx={{ ...tropicoButton, position: 'absolute', bottom: 32, right: 'calc(50% - 250px - 60px)', minWidth: 48, minHeight: 48, borderRadius: 2, pointerEvents: 'auto' }}>⚙️</Button>
      <Button id="nav-btn-users" variant="contained" color="secondary" sx={{ ...tropicoButton, position: 'absolute', bottom: 104, left: 'calc(50% - 250px - 60px)', minWidth: 48, minHeight: 48, borderRadius: 2, pointerEvents: 'auto' }}>👥</Button>
      <Button id="nav-btn-info" variant="contained" color="secondary" sx={{ ...tropicoButton, position: 'absolute', bottom: 104, right: 'calc(50% - 250px - 60px)', minWidth: 48, minHeight: 48, borderRadius: 2, pointerEvents: 'auto' }}>ℹ️</Button>
    </Box>
  );
};

export default HUD;
