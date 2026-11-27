import React, { useEffect, useRef, useSyncExternalStore } from "react";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import GameScene from "../../scene/GameScene";
import { game } from "../../logic/game";
import { cameraGroundOutline, minimapPoint } from "./minimap-math";

const minimapColors = {
  water: "#327c81",
  sand: "#d5c695",
  grass: "#83965b",
  jungle: "#4f7344",
  dirt: "#9a7d55",
  rock: "#8d877a",
};

const Minimap: React.FC = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const state = useSyncExternalStore(game.subscribe, game.getSnapshot);
  const [outline, setOutline] = React.useState(() => cameraGroundOutline(GameScene.instance.cameraView, GameScene.instance.island.worldSize));

  useEffect(() => {
    const scene = GameScene.instance;
    const update = () => setOutline(cameraGroundOutline(scene.cameraView, scene.island.worldSize));
    update();
    return scene.onCameraChange(update);
  }, []);

  useEffect(() => {
    const context = canvas.current?.getContext("2d");
    if (!context) return;
    const island = GameScene.instance.island;
    const tilesPerPixel = island.size / 96;
    for (let z = 0; z < 96; z++) {
      for (let x = 0; x < 96; x++) {
        const type = island.tileType(Math.floor(x * tilesPerPixel) - island.half, Math.floor(z * tilesPerPixel) - island.half);
        context.fillStyle = minimapColors[type ?? "water"];
        context.fillRect(x, z, 1, 1);
      }
    }
    context.fillStyle = "#f4e3b2";
    for (const building of state.placed) {
      context.fillRect((building.x / island.worldSize + 0.5) * 96 - 1, (building.z / island.worldSize + 0.5) * 96 - 1, 3, 3);
    }
  }, [state.placed]);

  return (
    <Paper elevation={6} className="hud-map">
      <Button aria-label="Zoom out" onClick={() => GameScene.instance.zoom(0.8)} id="minimap-zoom-out" className="hud-map__button" sx={{ position: 'absolute', top: 8, left: 8 }}>−</Button>
      <Button aria-label="Zoom in" onClick={() => GameScene.instance.zoom(1.25)} id="minimap-zoom-in" className="hud-map__button" sx={{ position: 'absolute', top: 8, right: 8 }}>+</Button>
      <div className="hud-map__interior">
        <button
          type="button"
          className="hud-map__diamond"
          aria-label="Island overview: click to move the camera, or use arrow keys to pan"
          onClick={(event) => {
            if (event.detail === 0) return;
            const rect = canvas.current?.getBoundingClientRect();
            if (!rect) throw new Error("Cannot locate the minimap canvas.");
            const point = minimapPoint(event.clientX, event.clientY, rect);
            const size = GameScene.instance.island.worldSize;
            GameScene.instance.moveCameraTo((point.x - 0.5) * size, (point.z - 0.5) * size);
          }}
          onKeyDown={(event) => {
            const steps: Record<string, [number, number]> = {
              ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1],
            };
            const step = steps[event.key];
            if (!step) return;
            event.preventDefault();
            event.stopPropagation();
            const scene = GameScene.instance;
            const target = scene.cameraTarget;
            const distance = scene.island.worldSize / 20;
            scene.moveCameraTo(target.x + step[0] * distance, target.z + step[1] * distance);
          }}
        >
          <canvas ref={canvas} width={96} height={96} aria-hidden="true" />
          <svg viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden="true">
            <polygon className="hud-map__outline-shadow" points={outline.map((point) => `${point.x},${point.z}`).join(" ")} />
            <polygon className="hud-map__outline" points={outline.map((point) => `${point.x},${point.z}`).join(" ")} />
          </svg>
        </button>
        <span className="hud-map__north" aria-hidden="true">N</span>
      </div>
      <Button aria-label="Rotate left" onClick={() => GameScene.instance.rotate(Math.PI / 4)} id="minimap-rotate-left" className="hud-map__button" sx={{ position: 'absolute', bottom: 8, left: 8 }}>&#8634;</Button>
      <Button aria-label="Rotate right" onClick={() => GameScene.instance.rotate(-Math.PI / 4)} id="minimap-rotate-right" className="hud-map__button" sx={{ position: 'absolute', bottom: 8, right: 8 }}>&#8635;</Button>
    </Paper>
  );
};

export default Minimap;
