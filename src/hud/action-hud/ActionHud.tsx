import React from "react";
import Paper from "@mui/material/Paper";
import MenuBuild from "./MenuBuild";
import { Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";
import MenuEdicts from "./MenuEdicts";

const tropicoPaper = {
  border: '2px solid #70553b',
  color: '#efe3c6',
  backgroundColor: '#4c4a3b',
  boxShadow: '0 6px 14px rgba(0,0,0,0.4), inset 0 0 12px rgba(0,0,0,0.35)',
};
const tropicoButton = {
  background: 'linear-gradient(to bottom, #e0d8b0 0%, #c8c090 100%)',
  color: '#4a4a4a',
  border: '1px solid #a09870',
  boxShadow: 'inset 0 0 5px rgba(0,0,0,0.2), 2px 2px 5px rgba(0,0,0,0.2)',
  textShadow: '1px 1px 0 rgba(255,255,255,0.3)',
  fontWeight: 700,
  borderRadius: 1,
  '&:hover': {
    filter: 'brightness(1.05)',
    transform: 'translateY(-1px)',
  },
  '&:active': {
    transform: 'translateY(0)',
    boxShadow: 'inset 0 0 8px rgba(0,0,0,0.3)',
  },
};
const ActionHud: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = React.useState<string | null>('build');
  function renderMenu() {
    switch (selectedMenu) {
      case 'build':
        return <MenuBuild />;
      case 'edicts':
        return <MenuEdicts />;
      case 'viewMenu':
        return <div>View Menu Placeholder</div>;
      default:
        return null;
    }
  }

  return (
    <Paper elevation={6} sx={{ ...tropicoPaper, position: 'absolute', bottom: 16, left: { xs: 152, lg: '50%' }, right: { xs: 166, lg: 'auto' }, transform: { xs: 'none', lg: 'translateX(-50%)' }, width: { xs: 'auto', lg: 650 }, height: 200, borderRadius: 1, display: 'flex', gap: 1, overflow: 'hidden', pointerEvents: 'auto' }}>
      <Stack borderRight={1}  borderColor="grey.700">
        <ToggleButtonGroup
          color="secondary"
          orientation="vertical"
          value={selectedMenu}
          exclusive
          onChange={(_event, newValue) => {
            if (newValue === null) return;
            setSelectedMenu(newValue)
          }}
        >
          <ToggleButton sx={tropicoButton} value="build" aria-label="list">
            Build 🔨
          </ToggleButton>
          <ToggleButton sx={tropicoButton} value="edicts" aria-label="module">
            Edicts 📜
          </ToggleButton>
          <ToggleButton sx={tropicoButton} value="viewMenu" aria-label="quilt">
            View 👁️
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>
        {renderMenu()}
    </Paper>
  );
};

export default ActionHud;
