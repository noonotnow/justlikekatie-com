import { spawnSync } from "node:child_process";
import { access, mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "og-image-source.svg");
const output = path.join(root, "og-image.png");
const chromium = process.env.CHROMIUM_PATH || "/repl/tools/bin/chromium";

// Render the SVG as a document: some SVG rasterizers silently omit linked PNGs.
await access(source);
await access(path.join(root, "images/curioseek-apex-logo.png"));
await access(chromium);
const profile = await mkdtemp(path.join(os.tmpdir(), "curioseek-og-"));
try {
  const result = spawnSync(chromium, [
    "--headless",
    "--no-sandbox",
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    "--window-size=1200,630",
    "--virtual-time-budget=1000",
    `--user-data-dir=${profile}`,
    `--screenshot=${output}`,
    pathToFileURL(source).href,
  ], { encoding: "utf8", timeout: 30_000 });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Image export failed:\n${result.stderr}`);
  const png = await readFile(output);
  if (png.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a"
    || png.readUInt32BE(16) !== 1200 || png.readUInt32BE(20) !== 630) {
    throw new Error("Share image must be a 1200×630 PNG.");
  }
  console.log("Rendered og-image.png (1200×630) from the SVG source.");
} finally {
  await rm(profile, { recursive: true, force: true });
}
