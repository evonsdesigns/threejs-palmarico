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

interface MenuEdictSubMenuProps {
  subMenu: EdictMenuSubMenuId;
  setSubMenu: (subMenu: EdictMenuSubMenuId) => void;
}

export enum EdictMenuSubMenuId {
  PeopleEdict = 'peopleEdict',
  ForeignPolicyEdict = 'foreignPolicyEdict',
  EconomicEdict = 'economicEdict',
  PoliticalReligiousEdict = 'politicalReligiousEdict',
  SocialEdict = 'socialEdict'
}

export interface EdictMenuSubMenuItem {
  id: EdictMenuSubMenuId;
  label: string;
  icon: string;
}

const menus: EdictMenuSubMenuItem[] = [
  {id: EdictMenuSubMenuId.PeopleEdict, label: 'People Edicts', icon: '🧑‍🤝‍🧑' },
  {id: EdictMenuSubMenuId.ForeignPolicyEdict, label: "Foreign Policy", icon: "🌎"},
  {id: EdictMenuSubMenuId.EconomicEdict, label: "Economic Policy", icon: "💵"},
  {id: EdictMenuSubMenuId.PoliticalReligiousEdict, label: "Political/Religious Policy", icon: "⛪️"},
  {id: EdictMenuSubMenuId.SocialEdict, label: "Social Policy", icon: "👥"}

]

const MenuEdictSubMenu = (props: MenuEdictSubMenuProps) => {
  const { subMenu, setSubMenu } = props;

  const handleSubMenuChange = (event: React.MouseEvent<HTMLElement>, newSubMenu: EdictMenuSubMenuId | null) => {
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

export default MenuEdictSubMenu;
