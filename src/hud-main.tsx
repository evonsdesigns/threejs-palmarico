import { createRoot } from "react-dom/client";
import HUD from "./hud/HUD";

const container = document.getElementById("hud-container");

if (container) {
    const root = createRoot(container);
    root.render(<HUD />);
}
