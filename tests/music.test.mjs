import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmdirSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { getMusicFiles } from "../vite.config.js";

test("the music playlist discovers supported files in natural order", () => {
  const directory = mkdtempSync(join(tmpdir(), "palmarico-music-"));
  const names = ["song-10.MP3", "song-2.mp3", "song-1.ogg", "notes.txt"];
  try {
    for (const name of names) writeFileSync(join(directory, name), "");
    mkdirSync(join(directory, "folder.mp3"));
    assert.deepEqual(getMusicFiles(directory), ["song-1.ogg", "song-2.mp3", "song-10.MP3"]);
    assert.deepEqual(getMusicFiles(join(directory, "missing")), []);
  } finally {
    for (const name of names) unlinkSync(join(directory, name));
    rmdirSync(join(directory, "folder.mp3"));
    rmdirSync(directory);
  }
});
