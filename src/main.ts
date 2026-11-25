import "./style.css";
import GameScene from "./scene/GameScene";

GameScene.instance.load().then(() => {
  GameScene.instance.render();
}).catch((error: unknown) => {
  console.error("Unable to start Palmarico:", error);
  const app = document.querySelector<HTMLDivElement>("#app");
  if (app) app.textContent = "Unable to load the island. Please reload and check the console for details.";
});

