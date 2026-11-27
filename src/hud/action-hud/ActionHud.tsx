import React from "react";
import Paper from "@mui/material/Paper";
import MenuBuild from "./MenuBuild";
import { Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";
import MenuEdicts from "./MenuEdicts";
import Almanac from "../Almanac";
import "../almanac.css";

const ActionHud: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = React.useState<string | null>('build');
  function renderMenu() {
    switch (selectedMenu) {
      case 'build':
        return <MenuBuild />;
      case 'edicts':
        return <MenuEdicts />;
      case 'viewMenu':
        return <Almanac />;
      default:
        return null;
    }
  }

  return (
    <Paper elevation={6} className="hud-actions">
      <Stack className="hud-actions__nav">
        <ToggleButtonGroup
          color="secondary"
          orientation="vertical"
          sx={{ height: '100%' }}
          value={selectedMenu}
          exclusive
          onChange={(_event, newValue) => {
            if (newValue === null) return;
            setSelectedMenu(newValue)
          }}
        >
          <ToggleButton value="build" aria-label="Build">
            <svg className="hud-tool-icon" viewBox="0 0 48 36" aria-hidden="true">
              <path d="M9 29 32 12l3 4L12 33Z" fill="#94643f" stroke="#36291e" strokeWidth="2"/>
              <path d="m27 9 9-5 8 4-2 5-6 2-4 5-5-3 3-5Z" fill="#77776a" stroke="#302a24" strokeWidth="2"/>
              <path d="m35 7 6 2M14 28l3 3" fill="none" stroke="#d3b88a" strokeWidth="1.5"/>
            </svg>
            <span>Build</span>
          </ToggleButton>
          <ToggleButton value="edicts" aria-label="Edicts">
            <svg className="hud-tool-icon" viewBox="0 0 48 36" aria-hidden="true">
              <path d="M9 8h30v20H9z" fill="#c6a975" stroke="#46301f" strokeWidth="2"/>
              <path d="M9 7c-5 0-5 7 0 7h3V7Zm30 15c5 0 5 7 0 7h-3v-7Z" fill="#9c754c" stroke="#46301f" strokeWidth="2"/>
              <path d="M16 12h16M16 16h13M16 20h15" stroke="#786042" strokeWidth="1"/>
              <path d="M24 7h5v22h-5z" fill="#95473a" opacity=".8"/>
            </svg>
            <span>Edicts</span>
          </ToggleButton>
          <ToggleButton value="viewMenu" aria-label="View">
            <svg className="hud-tool-icon" viewBox="0 0 48 36" aria-hidden="true">
              <path d="M4 19c7-11 20-18 40 0-11 12-28 15-40 0Z" fill="#d2c19b" stroke="#463126" strokeWidth="2"/>
              <circle cx="24" cy="19" r="7" fill="#668079" stroke="#342e29" strokeWidth="2"/>
              <circle cx="24" cy="19" r="3" fill="#292a24"/>
              <path d="M8 11c11-8 22-9 33 0" fill="none" stroke="#634632" strokeWidth="2"/>
            </svg>
            <span>View</span>
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>
        {renderMenu()}
    </Paper>
  );
};

export default ActionHud;
