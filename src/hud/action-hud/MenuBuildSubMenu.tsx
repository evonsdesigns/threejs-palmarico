import React from "react";
import { ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";

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

const subMenuStyles = {
  fontSize: 16,
  px: 1.75,
  py: 0
};

interface MenuBuildSubMenuProps {
  subMenu: BuildMenuSubMenuId;
  setSubMenu: (subMenu: BuildMenuSubMenuId) => void;
}

export enum BuildMenuSubMenuId {
  Housing = 'housing',
  Industry = 'industry',
  Agriculture = 'agriculture',
  Tourism = 'tourism',
  Services = 'services',
  Entertainment = 'entertainment',
  Infrastructure = 'infrastructure',
  Government = 'government',
  HumanServices = 'humanServices',
  Landscape = 'landscape'
}

export interface BuildMenuSubMenuItem {
  id: BuildMenuSubMenuId;
  label: string;
  icon: string;
}

const menus: BuildMenuSubMenuItem[] = [
  { id: BuildMenuSubMenuId.Housing, label: 'Housing', icon: '🏠' },
  { id: BuildMenuSubMenuId.Industry, label: 'Industrial', icon: '🏭' },
  { id: BuildMenuSubMenuId.Agriculture, label: 'Farms and Mines', icon: '🚜' },
  { id: BuildMenuSubMenuId.Tourism, label: 'Tourist Attractions', icon: '🏖️' },
  { id: BuildMenuSubMenuId.Services, label: 'Tourist Accommodations', icon: '🏨' },
  { id: BuildMenuSubMenuId.Entertainment, label: 'Entertainment', icon: '🍷' },
  { id: BuildMenuSubMenuId.Infrastructure, label: 'Infrastructure', icon: '🛣️' },
  { id: BuildMenuSubMenuId.Government, label: 'Government', icon: '🏛️' },
  { id: BuildMenuSubMenuId.HumanServices, label: 'Human Services', icon: '🏥' },
  { id: BuildMenuSubMenuId.Landscape, label: 'Landscape', icon: '🌴' }
]

const MenuBuildSubMenu = (props: MenuBuildSubMenuProps) => {
  const { subMenu, setSubMenu } = props;

  const handleSubMenuChange = (event: React.MouseEvent<HTMLElement>, newSubMenu: BuildMenuSubMenuId | null) => {
    if (newSubMenu !== null) {
      setSubMenu(newSubMenu);
    }
  };

  return (
    <>
      <ToggleButtonGroup
        value={subMenu}
        exclusive
        onChange={handleSubMenuChange}
        aria-label="text alignment"
        sx={{
          alignItems: 'center',
          height: 48,
        }}
      >
        {menus.map((menu) => (
            <Tooltip key={menu.id} title={menu.label} placement="top">
              <ToggleButton
                value={menu.id}
                aria-label={menu.label}
                sx={{
                  ...tropicoButton,
                  ...subMenuStyles,
                  background: subMenu === menu.id ? '#e0b84c' : tropicoButton.background,
                  color: subMenu === menu.id ? '#222' : tropicoButton.color,
                  boxShadow: 'none',
                  border: 'none',
                }}
              >
                {menu.icon}
              </ToggleButton>
            </Tooltip>
        ))}
      </ToggleButtonGroup>
    </>
  );
};

export default MenuBuildSubMenu;
