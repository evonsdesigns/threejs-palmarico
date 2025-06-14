import React from "react";
import { createRoot } from "react-dom/client";
import HUD from "./HUD";

const container = document.getElementById("hud-container");

if (container) {
    const root = createRoot(container);
    root.render(<HUD />);
}
