import { readdir } from "node:fs/promises";
import path from "node:path";

// Keep this verifier allowlist independent from the staging script's copy list:
// expanding the build must not silently expand what the check considers safe.
export const APPROVED_PUBLIC_FILES = Object.freeze([
  "index.html",
  "og-image.png",
  "images/curioseek-apex-logo.png",
]);

export function readNetlifyBuildConfig(contents) {
  let inBuildSection = false;
  const build = {};

  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    const section = line.match(/^\[([^\]]+)\]$/);

    if (section) {
      inBuildSection = section[1] === "build";
      continue;
    }

    if (!inBuildSection || !line || line.startsWith("#")) continue;

    const setting = line.match(/^(command|publish)\s*=\s*"([^"]+)"\s*$/);
    if (!setting) continue;
    if (build[setting[1]]) {
      throw new Error(`netlify.toml defines build.${setting[1]} more than once.`);
    }
    build[setting[1]] = setting[2];
  }

  for (const key of ["command", "publish"]) {
    if (!build[key]) {
      throw new Error(`netlify.toml must define [build].${key} as a quoted string.`);
    }
  }

  return build;
}

async function listOutputEntries(directory, relativeDirectory = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  const directories = [];

  for (const entry of entries) {
    const relativePath = path.posix.join(relativeDirectory, entry.name);
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      directories.push(relativePath);
      const nested = await listOutputEntries(fullPath, relativePath);
      files.push(...nested.files);
      directories.push(...nested.directories);
    } else if (entry.isFile()) {
      files.push(relativePath);
    } else {
      throw new Error(`Netlify output contains a non-regular file: ${relativePath}`);
    }
  }

  return { files, directories };
}

export async function assertNetlifyOutput(publishDirectory) {
  const { files, directories } = await listOutputEntries(publishDirectory);
  const approvedFiles = new Set(APPROVED_PUBLIC_FILES);
  const approvedDirectories = new Set(
    APPROVED_PUBLIC_FILES.flatMap((file) => {
      const parts = file.split("/");
      return parts.slice(0, -1).map((_, index) => parts.slice(0, index + 1).join("/"));
    }),
  );
  const unexpectedFiles = files.filter((file) => !approvedFiles.has(file)).sort();
  const unexpectedDirectories = directories
    .filter((directory) => !approvedDirectories.has(directory))
    .sort();
  const missingFiles = APPROVED_PUBLIC_FILES.filter((file) => !files.includes(file)).sort();

  if (unexpectedFiles.length || unexpectedDirectories.length || missingFiles.length) {
    const details = [];
    if (unexpectedFiles.length) {
      details.push(`unexpected files: ${unexpectedFiles.join(", ")}`);
    }
    if (unexpectedDirectories.length) {
      details.push(`unexpected directories: ${unexpectedDirectories.join(", ")}`);
    }
    if (missingFiles.length) {
      details.push(`missing approved files: ${missingFiles.join(", ")}`);
    }
    throw new Error(`Netlify publish output does not match the public allowlist (${details.join("; ")}).`);
  }
}
