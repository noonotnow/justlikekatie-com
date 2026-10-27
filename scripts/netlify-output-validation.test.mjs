import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  APPROVED_PUBLIC_FILES,
  assertNetlifyOutput,
  readNetlifyBuildConfig,
} from "./netlify-output-validation.mjs";

async function withOutputDirectory(run) {
  const directory = await mkdtemp(path.join(os.tmpdir(), "netlify-output-"));
  try {
    for (const file of APPROVED_PUBLIC_FILES) {
      const destination = path.join(directory, file);
      await mkdir(path.dirname(destination), { recursive: true });
      await writeFile(destination, "public asset");
    }
    await run(directory);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

test("reads the build command and publish directory from netlify.toml", () => {
  assert.deepEqual(
    readNetlifyBuildConfig(`
[build]
  command = "node scripts/prepare-netlify.mjs"
  publish = "generated-artifacts/netlify-site"

[[headers]]
  for = "/*"
`),
    {
      command: "node scripts/prepare-netlify.mjs",
      publish: "generated-artifacts/netlify-site",
    },
  );
});

test("accepts exactly the approved public page and assets", async () => {
  await withOutputDirectory((directory) => assertNetlifyOutput(directory));
});

test("rejects workspace and unexpected files, including nested design directories", async () => {
  await withOutputDirectory(async (directory) => {
    await mkdir(path.join(directory, "artifacts", "mockup-sandbox"), { recursive: true });
    await writeFile(path.join(directory, "artifacts", "mockup-sandbox", "index.html"), "private");
    await mkdir(path.join(directory, ".local"), { recursive: true });
    await writeFile(path.join(directory, ".local", "notes.md"), "private");
    await writeFile(path.join(directory, "README.md"), "project-only");

    await assert.rejects(assertNetlifyOutput(directory), /artifacts\/mockup-sandbox\/index\.html/);
    await assert.rejects(assertNetlifyOutput(directory), /\.local\/notes\.md/);
    await assert.rejects(assertNetlifyOutput(directory), /README\.md/);
  });
});

test("rejects missing approved public assets", async () => {
  await withOutputDirectory(async (directory) => {
    await rm(path.join(directory, "og-image.png"));
    await assert.rejects(assertNetlifyOutput(directory), /missing approved files: og-image\.png/);
  });
});

test("requires both build settings in netlify.toml", () => {
  assert.throws(() => readNetlifyBuildConfig("[build]\ncommand = \"echo build\""), /publish/);
});
