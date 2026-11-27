import React from "react";
import Box from "@mui/material/Box";
import MenuBuildSubMenu, { BuildMenuSubMenuId } from "./MenuBuildSubMenu";
import BuildTiles from "./BuildTiles";
import * as buttonData from "./button-data";
import { buildings, type BuildingType } from "../../logic/game";

// Every placeable building is available under its button id; the marketplace button builds a market.
const availableBuildings: Record<string, BuildingType> = Object.fromEntries([
  ...buildings.filter((item) => item.id !== "palace" && item.id !== "shack" && item.id !== "colonial-fort")
    .map((item) => [item.id, item.id]),
  ["marketplace", "market"],
]);

const MenuBuild: React.FC = () => {
  const [subMenu, setSubMenu] = React.useState<BuildMenuSubMenuId>(BuildMenuSubMenuId.Housing);
  let buttons;
  switch (subMenu) {
    case BuildMenuSubMenuId.Housing:
      buttons = buttonData.housingButtonData;
      break;
    case BuildMenuSubMenuId.Industry:
      buttons = buttonData.industrialButtonData;
      break;
    case BuildMenuSubMenuId.Agriculture:
      buttons = buttonData.farmsAndMinesButtonData;
      break;
    case BuildMenuSubMenuId.Tourism:
      buttons = buttonData.touristAttractionsButtonData;
      break;
    case BuildMenuSubMenuId.Services:
      buttons = buttonData.touristAccommodationsButtonData;
      break;
    case BuildMenuSubMenuId.Entertainment:
      buttons = buttonData.entertainmentButtonData;
      break;
    case BuildMenuSubMenuId.Infrastructure:
      buttons = buttonData.infrastructureButtonData;
      break;
    case BuildMenuSubMenuId.Government:
      buttons = buttonData.governmentButtonData;
      break;
    case BuildMenuSubMenuId.HumanServices:
      buttons = buttonData.humanServicesButtonData;
      break;
    case BuildMenuSubMenuId.Landscape:
      buttons = buttonData.landscapeButtonData;
      break;
  }
  const visibleButtons = React.useMemo(() => buttons?.filter((button) => button.id !== "shack"), [buttons]);

  return (
    <Box sx={{ p: 0, display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
      <MenuBuildSubMenu
        subMenu={subMenu}
        setSubMenu={setSubMenu}
      />
      {visibleButtons ?
        <BuildTiles buttons={visibleButtons} availableBuildings={availableBuildings} /> :
        <Box sx={{ p: 2 }}>Select a submenu</Box>
      }
    </Box>
  );
};

export default MenuBuild;
