import { existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const musicDirectory = fileURLToPath(new URL("./public/sounds/music/", import.meta.url));
export function getMusicFiles(directory) {
  return existsSync(directory)
    ? readdirSync(directory, { withFileTypes: true })
      .filter((entry) => entry.isFile() && /\.(mp3|ogg|wav|m4a|aac|flac|webm)$/i.test(entry.name))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b, "en", { numeric: true, sensitivity: "base" }))
    : [];
}

export default defineConfig({
  define: { __MUSIC_FILES__: JSON.stringify(getMusicFiles(musicDirectory)) },
});
