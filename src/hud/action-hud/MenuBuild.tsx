import React from "react";
import Box from "@mui/material/Box";
import MenuBuildSubMenu, { BuildMenuSubMenuId } from "./MenuBuildSubMenu";
import MenuGeneric from "./MenuGeneric";
import * as buttonData from "./button-data";
import GameScene from "../../scene/GameScene";

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

  return (
    <Box sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
      <MenuBuildSubMenu
        subMenu={subMenu}
        setSubMenu={setSubMenu}
      />
      {buttons ?
        <MenuGeneric
          buttons={buttons}
          onButtonClick={(buttonId) =>  {
            console.log(`Button clicked: ${buttonId}`);
            GameScene.instance.toggleBuildingPlacement(buttonId);
            GameScene.instance.setBuildingType(buttonId);
          }}
        /> :
        <Box sx={{ p: 2 }}>Select a submenu</Box>
      }
    </Box>
  );
};

export default MenuBuild;
