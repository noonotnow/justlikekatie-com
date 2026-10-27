import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { assertNetlifyOutput, readNetlifyBuildConfig } from "./netlify-output-validation.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const netlifyConfigPath = path.join(projectRoot, "netlify.toml");
const config = readNetlifyBuildConfig(await readFile(netlifyConfigPath, "utf8"));
const publishDirectory = path.resolve(projectRoot, config.publish);
const relativePublishDirectory = path.relative(projectRoot, publishDirectory);

if (
  relativePublishDirectory === "" ||
  relativePublishDirectory === ".." ||
  relativePublishDirectory.startsWith(`..${path.sep}`) ||
  path.isAbsolute(relativePublishDirectory)
) {
  throw new Error("The Netlify publish directory must be a subdirectory of the project.");
}

console.log(`Running Netlify staging build: ${config.command}`);
const build = spawnSync(config.command, {
  cwd: projectRoot,
  shell: true,
  stdio: "inherit",
});

if (build.error) throw build.error;
if (build.status !== 0) {
  process.exitCode = build.status ?? 1;
} else {
  await assertNetlifyOutput(publishDirectory);
  console.log(`Verified Netlify publish output: ${config.publish}`);
}
