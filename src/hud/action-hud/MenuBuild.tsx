import React from "react";
import Box from "@mui/material/Box";
import MenuBuildSubMenu, { BuildMenuSubMenuId } from "./MenuBuildSubMenu";
import MenuGeneric from "./MenuGeneric";
import * as buttonData from "./button-data";

const MenuBuild: React.FC = () => {
  const [subMenu, setSubMenu] = React.useState<BuildMenuSubMenuId>(BuildMenuSubMenuId.Housing);
  let subMenuComponent;
  switch(subMenu) {
    case BuildMenuSubMenuId.Housing:
      subMenuComponent = <MenuGeneric buttons={buttonData.housingButtonData} />;
      break;
    case BuildMenuSubMenuId.Industry:
      subMenuComponent = <MenuGeneric buttons={buttonData.industrialButtonData} />;
      break;
    case BuildMenuSubMenuId.Agriculture:
      subMenuComponent = <MenuGeneric buttons={buttonData.farmsAndMinesButtonData} />;
      break;
    case BuildMenuSubMenuId.Tourism:
      subMenuComponent = <MenuGeneric buttons={buttonData.touristAttractionsButtonData} />;
      break;
    case BuildMenuSubMenuId.Services:
      subMenuComponent = <MenuGeneric buttons={buttonData.touristAccommodationsButtonData} />;
      break;
    case BuildMenuSubMenuId.Entertainment:
      subMenuComponent = <MenuGeneric buttons={buttonData.entertainmentButtonData} />;
      break;
    case BuildMenuSubMenuId.Infrastructure:
      subMenuComponent = <MenuGeneric buttons={buttonData.infrastructureButtonData} />;
      break;
    case BuildMenuSubMenuId.Government:
      subMenuComponent = <MenuGeneric buttons={buttonData.governmentButtonData} />;
      break;
    case BuildMenuSubMenuId.HumanServices:
      subMenuComponent = <MenuGeneric buttons={buttonData.humanServicesButtonData} />;
      break;
    case BuildMenuSubMenuId.Landscape:
      subMenuComponent = <MenuGeneric buttons={buttonData.landscapeButtonData} />;
      break;
    default:
      subMenuComponent = <Box sx={{ p: 2 }}>Select a submenu</Box>;
  }

  return (
    <Box sx={{ p: 0,  display: 'flex', flexDirection: 'column'}}>
      <MenuBuildSubMenu
        subMenu={subMenu}
        setSubMenu={setSubMenu}
      />
      {subMenuComponent}
    </Box>
  );
};

export default MenuBuild;
