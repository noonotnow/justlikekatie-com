import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publishDirectory = path.join(projectRoot, "generated-artifacts", "netlify-site");

// Deliberately publish a short allowlist: the repository also contains the
// non-public design sandbox and project-only material.
const publicFiles = [
  "index.html",
  "og-image.png",
  "images/curioseek-apex-logo.png",
];

await rm(publishDirectory, { recursive: true, force: true });
await mkdir(publishDirectory, { recursive: true });

for (const file of publicFiles) {
  const source = path.join(projectRoot, file);
  const destination = path.join(publishDirectory, file);
  await mkdir(path.dirname(destination), { recursive: true });
  await cp(source, destination);
}

console.log(`Prepared ${publicFiles.length} public files in generated-artifacts/netlify-site.`);
