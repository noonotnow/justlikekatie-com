import { readFile, readdir } from "node:fs/promises";
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

function attributeValues(tag, attributeName) {
  const escapedName = attributeName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(
    `(?:^|\\s)${escapedName}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'=<>\\x60]+))`,
    "i",
  );
  const match = tag.match(pattern);
  return match ? [match[1] ?? match[2] ?? match[3]] : [];
}

function localFilePath(reference) {
  const value = reference.trim();
  if (!value || value.startsWith("#")) return null;

  let url;
  try {
    url = new URL(value, "https://netlify-output.invalid/");
  } catch {
    return null;
  }

  if (url.origin !== "https://netlify-output.invalid" || url.protocol !== "https:") {
    return null;
  }

  let decodedPath;
  try {
    decodedPath = decodeURIComponent(url.pathname);
  } catch {
    throw new Error(`Netlify page contains an invalid local asset URL: ${reference}`);
  }

  if (!decodedPath || decodedPath.endsWith("/")) return null;
  return path.posix.normalize(decodedPath.replace(/^\/+/, ""));
}

function hasFileExtension(reference) {
  const pathname = reference.split(/[?#]/, 1)[0];
  return /\.[a-z0-9]{1,12}$/i.test(pathname);
}

function srcsetUrls(value) {
  const urls = [];
  let position = 0;

  while (position < value.length) {
    while (position < value.length && /[\s,]/.test(value[position])) position += 1;
    if (position >= value.length) break;

    const start = position;
    while (position < value.length && !/\s/.test(value[position])) position += 1;
    const rawUrl = value.slice(start, position);
    const url = rawUrl.replace(/,+$/, "");
    if (url) urls.push(url);

    if (rawUrl.endsWith(",")) continue;

    while (position < value.length && /\s/.test(value[position])) position += 1;
    if (position < value.length && value[position] !== ",") {
      while (position < value.length && value[position] !== ",") position += 1;
    }
  }

  return urls;
}

export function findLocalAssetReferences(html) {
  const references = new Set();
  const tags = html.match(/<[a-z][^>]*>/gi) ?? [];

  for (const tag of tags) {
    const tagName = tag.match(/^<\s*([a-z]+)/i)?.[1]?.toLowerCase();
    const rel = attributeValues(tag, "rel").join(" ").toLowerCase();
    const hrefIsResource =
      tagName === "link" &&
      /\b(stylesheet|icon|apple-touch-icon|manifest|preload|modulepreload|mask-icon)\b/.test(rel);

    for (const attribute of ["src", "poster", "data-src"]) {
      for (const value of attributeValues(tag, attribute)) {
        const filePath = localFilePath(value);
        if (filePath) references.add(filePath);
      }
    }

    for (const value of attributeValues(tag, "srcset")) {
      for (const reference of srcsetUrls(value)) {
        const filePath = localFilePath(reference);
        if (filePath) references.add(filePath);
      }
    }

    for (const value of attributeValues(tag, "href")) {
      const filePath = localFilePath(value);
      if (filePath && (hrefIsResource || hasFileExtension(value))) {
        references.add(filePath);
      }
    }
  }

  for (const match of html.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*?))\s*\)/gi)) {
    const filePath = localFilePath(match[1] ?? match[2] ?? match[3]);
    if (filePath) references.add(filePath);
  }

  return [...references].sort();
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
  const html = await readFile(path.join(publishDirectory, "index.html"), "utf8");
  const missingReferencedAssets = findLocalAssetReferences(html).filter(
    (file) => !files.includes(file),
  );

  if (
    unexpectedFiles.length ||
    unexpectedDirectories.length ||
    missingFiles.length ||
    missingReferencedAssets.length
  ) {
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
    if (missingReferencedAssets.length) {
      details.push(`missing referenced local assets: ${missingReferencedAssets.join(", ")}`);
    }
    throw new Error(`Netlify publish output does not match the public allowlist (${details.join("; ")}).`);
  }
}
