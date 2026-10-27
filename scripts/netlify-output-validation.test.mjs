import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  APPROVED_PUBLIC_FILES,
  assertNetlifyOutput,
  findLocalAssetReferences,
  readNetlifyBuildConfig,
} from "./netlify-output-validation.mjs";

async function withOutputDirectory(run) {
  const directory = await mkdtemp(path.join(os.tmpdir(), "netlify-output-"));
  try {
    for (const file of APPROVED_PUBLIC_FILES) {
      const destination = path.join(directory, file);
      await mkdir(path.dirname(destination), { recursive: true });
      await writeFile(
        destination,
        file === "index.html"
          ? `<link rel="icon" href="/images/curioseek-apex-logo.png">
             <img src="/images/curioseek-apex-logo.png">`
          : "public asset",
      );
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

test("identifies local asset references in HTML attributes and CSS URLs", () => {
  assert.deepEqual(
    findLocalAssetReferences(`
      <img src="/images/logo.png">
      <source srcset="images/small.webp 1x, images/large.webp 2x">
      <link rel="stylesheet" href="styles/site.css">
      <div style="background-image: url('/images/bg.svg')"></div>
    `),
    [
      "images/bg.svg",
      "images/large.webp",
      "images/logo.png",
      "images/small.webp",
      "styles/site.css",
    ],
  );
});

test("rejects a local asset reference missing from the staged output", async () => {
  await withOutputDirectory(async (directory) => {
    await writeFile(
      path.join(directory, "index.html"),
      '<img src="/images/missing-logo.png">',
    );
    await assert.rejects(
      assertNetlifyOutput(directory),
      /missing referenced local assets: images\/missing-logo\.png/,
    );
  });
});

test("ignores external URLs, fragments, and local routes", async () => {
  await withOutputDirectory(async (directory) => {
    await writeFile(
      path.join(directory, "index.html"),
      `<a href="#section">Jump</a>
       <a href="/worlds">Worlds</a>
       <img src="https://cdn.example.com/image.png">
       <img src="//cdn.example.com/image.png">
       <img src="data:image/png;base64,AAAA">
       <img srcset="data:image/png;base64,AAAA 1x, /images/curioseek-apex-logo.png 2x">
       <a href="mailto:hello@example.com">Email</a>`,
    );
    await assertNetlifyOutput(directory);
  });
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
