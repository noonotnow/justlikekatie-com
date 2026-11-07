import { constants } from "node:fs";
import { access, readFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, firefox, webkit } from "playwright";
import { checkAnalyticsNavigation, checkZoom } from "./apex-interaction-checks.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const browserTypes = { chromium, firefox, webkit };
const widths = [320, 390, 768, 1440];

function parseOptions(args) {
  let selected;
  let requireAll = false;
  for (const arg of args) {
    if (arg === "--require-all") requireAll = true;
    else if (arg.startsWith("--browser=")) {
      if (selected) throw new Error("Specify --browser only once.");
      const value = arg.slice("--browser=".length);
      selected = value === "all" ? Object.keys(browserTypes) : value.split(",");
      if (!selected.length || selected.some((name) => !Object.hasOwn(browserTypes, name))) {
        throw new Error("Use --browser=chromium, --browser=firefox, --browser=webkit, or --browser=all.");
      }
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }
  return {
    browsers: [...new Set(selected || Object.keys(browserTypes))],
    // Default discovery may skip missing engines, but an explicitly requested
    // engine (or CI's --require-all) must never silently pass without running.
    requireAll: requireAll || Boolean(selected),
  };
}

function assert(condition, message, checks) {
  if (!condition) throw new Error(message);
  checks.push(message);
}

function createStaticServer() {
  const mimeTypes = {
    ".html": "text/html; charset=utf-8",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
  };
  return createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname);
      const relativePath = pathname === "/" ? "index.html" : pathname.slice(1);
      const filePath = path.resolve(projectRoot, relativePath);
      if (!filePath.startsWith(`${projectRoot}${path.sep}`)) {
        response.writeHead(403).end("Forbidden");
        return;
      }
      const content = await readFile(filePath);
      response.writeHead(200, {
        "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream",
      });
      response.end(content);
    } catch {
      response.writeHead(404).end("Not found");
    }
  });
}

async function launchOptions(name) {
  const override = process.env[`${name.toUpperCase()}_PATH`];
  if (override) return { executablePath: override };
  if (name === "chromium") {
    // Preserve the original Replit Chromium path, with bundled Chromium as the
    // portable alternative on machines using `playwright install`.
    try {
      await access("/repl/tools/bin/chromium", constants.X_OK);
      return { executablePath: "/repl/tools/bin/chromium" };
    } catch {
      // Playwright reports a missing bundled executable with installation help.
    }
  }
  return {};
}

function unavailableReason(error) {
  return /Executable doesn't exist|Host system is missing dependencies|error while loading shared libraries|cannot open shared object file/i.test(error.message);
}

async function checkNoOverflow(page, width, checks, state = "") {
  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  assert(
    dimensions.viewport === width && dimensions.document <= width && dimensions.body <= width,
    `No horizontal overflow at ${width}px${state} (viewport ${dimensions.viewport}px, document ${dimensions.document}px, body ${dimensions.body}px)`,
    checks,
  );
}

async function checkNoteState(page, activeIndex, checks, message) {
  const state = await page.locator("[data-world-toggle]").evaluateAll((controls) =>
    controls.map((control) => ({
      index: Number(control.dataset.worldToggle),
      expanded: control.getAttribute("aria-expanded"),
      hidden: document.getElementById(control.getAttribute("aria-controls"))?.hidden,
      label: control.querySelector("[data-toggle-label]")?.textContent.trim(),
    })),
  );
  assert(
    state.length === 8 && state.every((control) => {
      const expanded = control.index === activeIndex;
      return control.expanded === String(expanded) &&
        control.hidden === !expanded &&
        (control.label === undefined || control.label === (expanded ? "Close field note" : "Read field note"));
    }),
    message,
    checks,
  );
}

async function checkKeyboard(page, selector, width, checks, layout) {
  await page.setViewportSize({ width, height: 1000 });
  const controls = page.locator(selector);
  // Exercise both native activation keys as opener, switcher, and closer.
  // These are real browser keyboard events, not click() or DOM dispatchEvent().
  for (const key of ["Enter", "Space"]) {
    await controls.nth(0).focus();
    await page.keyboard.press(key);
    await checkNoteState(page, 0, checks, `${layout}: ${key} opens a field note and synchronizes controls, labels, and panels`);
    await checkNoOverflow(page, width, checks, ` with the ${layout} note open`);

    await controls.nth(1).focus();
    await page.keyboard.press(key);
    await checkNoteState(page, 1, checks, `${layout}: ${key} switches field notes and closes the previous panel`);
    assert(
      await controls.nth(1).evaluate((control) => document.activeElement === control),
      `${layout}: ${key} keeps focus on the activated button`,
      checks,
    );

    await page.keyboard.press(key);
    await checkNoteState(page, null, checks, `${layout}: ${key} closes the active field note`);
  }
}

async function checkApex(page, url, checks) {
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto(url, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  const initialNavigation = await page.evaluate(() => {
    const anchors = [...document.querySelectorAll('a[href^="#"]')];
    const missing = anchors
      .map((anchor) => anchor.getAttribute("href"))
      .filter((href) => !document.getElementById(decodeURIComponent(href.slice(1))));
    const fandom = document.querySelector('#fandom a[href="https://fandom.justlikekatie.com/"]');
    return {
      missing,
      headline: document.querySelector("#hero-title")?.innerText.replace(/\s+/g, " ").trim(),
      worlds: [...document.querySelectorAll(".world-name h3")].map((heading) => heading.textContent.trim()),
      statuses: [...document.querySelectorAll(".world .status")].map((status) => status.textContent.trim()),
      fandomCopy: document.querySelector("#fandom .public-copy")?.textContent,
      fandomArtLabel: document.querySelector("#fandom .art-label")?.textContent,
      fandom: fandom && { target: fandom.target, rel: fandom.rel.split(/\s+/) },
    };
  });
  assert(initialNavigation.missing.length === 0, "All in-page navigation targets resolve", checks);
  assert(initialNavigation.headline === "One curious life. Many ways in.", "The apex leads with the approved many-sided-life framing", checks);
  assert(
    initialNavigation.worlds.join("|") === "StudentOS|CreatorOS|LifeOS|Fandom Vibes" &&
    initialNavigation.statuses.join("|") === "PRIVATE WORKSPACE|PRIVATE WORKSPACE|PROPOSED|PUBLIC WORLD",
    "All four worlds and their privacy/publication boundaries are explicit",
    checks,
  );
  assert(
    initialNavigation.fandom?.target === "_blank" &&
    initialNavigation.fandom.rel.includes("noopener") &&
    initialNavigation.fandom.rel.includes("noreferrer"),
    "The public Fandom Vibes link uses the expected URL and safe new-tab attributes",
    checks,
  );
  assert(
    initialNavigation.fandomCopy?.includes("C-drama as its initial focus") &&
    initialNavigation.fandomCopy.includes("Check each reading’s spoiler boundary") &&
    initialNavigation.fandomCopy.includes("VIBE ATLAS: DAILY CARD DROP") &&
    !initialNavigation.fandomCopy.includes("CONCEPT PREVIEW") &&
    initialNavigation.fandomArtLabel === "CONCEPT ART / NOT PUBLISHED CARDS",
    "Fandom copy distinguishes public card drops, spoiler boundaries, initial C-drama focus, and concept artwork",
    checks,
  );

  for (const width of widths) {
    await page.setViewportSize({ width, height: 1000 });
    await checkNoOverflow(page, width, checks);
  }

  const motionState = () => page.evaluate(() => ({
    reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
    animations: [...document.querySelectorAll(".orbit")].map((orbit) => getComputedStyle(orbit).animationName),
    scroll: getComputedStyle(document.documentElement).scrollBehavior,
  }));
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const normalMotion = await motionState();
  assert(!normalMotion.reduced && normalMotion.scroll === "smooth", "The normal-motion baseline uses smooth scrolling", checks);
  assert(
    normalMotion.animations.length === 2 && normalMotion.animations.every((animation) => animation === "none"),
    "The atlas field stays still rather than prescribing a route",
    checks,
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  const reducedMotion = await motionState();
  assert(reducedMotion.reduced, "The browser applies the reduced-motion preference", checks);
  assert(
    reducedMotion.animations.length === 2 && reducedMotion.animations.every((animation) => animation === "none"),
    "Reduced motion leaves both orbital illustrations unanimated",
    checks,
  );
  assert(reducedMotion.scroll === "auto", "Reduced motion disables smooth page scrolling", checks);

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await checkKeyboard(page, ".toggle[data-world-toggle]", 1440, checks, "desktop");
  await checkKeyboard(page, ".mobile-destination[data-world-toggle]", 390, checks, "mobile");
  await checkAnalyticsNavigation(page, url, checks, assert);
  assert(pageErrors.length === 0, `No uncaught page errors${pageErrors.length ? `: ${pageErrors.join("; ")}` : ""}`, checks);
}

async function main() {
  const options = parseOptions(process.argv.slice(2));
  const server = createStaticServer();
  const failures = [];
  const skipped = [];
  let passed = 0;
  try {
    await new Promise((resolve, reject) => {
      server.once("error", reject);
      server.listen(0, "127.0.0.1", resolve);
    });
    const url = `http://127.0.0.1:${server.address().port}/`;
    for (const name of options.browsers) {
      let browser;
      try {
        try {
          browser = await browserTypes[name].launch({ headless: true, ...await launchOptions(name) });
        } catch (error) {
          const hasOverride = Boolean(process.env[`${name.toUpperCase()}_PATH`]);
          if (name !== "chromium" && !options.requireAll && !hasOverride && unavailableReason(error)) {
            skipped.push(name);
            console.warn(`UNAVAILABLE ${name}: ${error.message}`);
            continue;
          }
          throw error;
        }
        const checks = [];
        const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
        page.setDefaultTimeout(15_000);
        await checkApex(page, url, checks);
        await checkZoom(browser, url, checks, assert);
        console.log(`PASS ${name} ${browser.version()} (${checks.length} assertions)`);
        for (const check of checks) console.log(`  ✓ ${check}`);
        passed++;
      } catch (error) {
        failures.push(name);
        console.error(`FAIL ${name}: ${error.stack || error.message}`);
      } finally {
        // Playwright waits for the browser to exit before removing its profile.
        // Killing Chromium and immediately deleting the directory can race.
        await browser?.close();
      }
    }
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
  console.log(`Apex browser checks: ${passed} passed, ${failures.length} failed, ${skipped.length} unavailable.`);
  if (skipped.length) {
    console.warn(`Not verified: ${skipped.join(", ")}. Install engines with "npx playwright install firefox webkit" and their OS dependencies. Use --require-all to fail on unavailable browsers.`);
  }
  if (failures.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(`Apex browser check failed: ${error.stack || error.message}`);
  process.exitCode = 1;
});
