import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { access, mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const chromiumPath = process.env.CHROMIUM_PATH || "/repl/tools/bin/chromium";
const checks = [];

function assert(condition, message) {
  if (!condition) throw new Error(message);
  checks.push(message);
}

async function waitFor(readinessCheck, message, timeoutMs = 15_000) {
  const deadline = Date.now() + timeoutMs;
  let lastError;
  while (Date.now() < deadline) {
    try {
      const result = await readinessCheck();
      if (result) return result;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`${message}${lastError ? `: ${lastError.message}` : ""}`);
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

function connectToPage(webSocketUrl, onEvent = () => {}) {
  const socket = new WebSocket(webSocketUrl);
  let nextId = 0;
  const pending = new Map();

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.method) onEvent(message);
    if (!message.id) return;
    const callbacks = pending.get(message.id);
    if (!callbacks) return;
    pending.delete(message.id);
    if (message.error) callbacks.reject(new Error(message.error.message));
    else callbacks.resolve(message.result || {});
  });

  return new Promise((resolve, reject) => {
    socket.addEventListener("open", () => {
      resolve({
        send(method, params = {}) {
          const id = ++nextId;
          return new Promise((commandResolve, commandReject) => {
            pending.set(id, { resolve: commandResolve, reject: commandReject });
            socket.send(JSON.stringify({ id, method, params }));
          });
        },
        async evaluate(expression) {
          const result = await this.send("Runtime.evaluate", {
            expression,
            returnByValue: true,
            awaitPromise: true,
          });
          if (result.exceptionDetails) {
            throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
          }
          return result.result?.value;
        },
        close() {
          socket.close();
        },
      });
    }, { once: true });
    socket.addEventListener("error", () => reject(new Error("Could not connect to Chromium's page.")), { once: true });
  });
}

async function clickVisibleControl(page, selector, label) {
  const target = await page.evaluate(`(() => {
    const element = document.querySelector(${JSON.stringify(selector)});
    if (!element) return null;
    element.scrollIntoView({ block: "center", behavior: "instant" });
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    return {
      x, y,
      visible: rect.width > 0 && rect.height > 0 &&
        rect.left >= 0 && rect.right <= innerWidth &&
        rect.top >= 0 && rect.bottom <= innerHeight &&
        element.contains(document.elementFromPoint(x, y))
    };
  })()`);
  assert(target?.visible, `${label} is in view and not clipped or covered`);
  for (const type of ["mousePressed", "mouseReleased"]) {
    await page.send("Input.dispatchMouseEvent", {
      type, x: target.x, y: target.y, button: "left", clickCount: 1,
    });
  }
}

const server = createStaticServer();
let browser;
let page;
let profileDirectory;
const browserEvents = [];

try {
  await access(chromiumPath);
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const { port: sitePort } = server.address();
  profileDirectory = await mkdtemp(path.join(os.tmpdir(), "curioseek-apex-check-"));
  browser = spawn(chromiumPath, [
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--no-first-run",
    "--no-default-browser-check",
    "--remote-debugging-port=0",
    "--remote-allow-origins=*",
    `--user-data-dir=${profileDirectory}`,
    "about:blank",
  ], { stdio: "ignore" });

  const activePortFile = path.join(profileDirectory, "DevToolsActivePort");
  const debuggingPort = await waitFor(async () => {
    if (browser.exitCode !== null) throw new Error(`Chromium exited with code ${browser.exitCode}.`);
    try {
      const [port] = (await readFile(activePortFile, "utf8")).split("\n");
      return Number(port) || null;
    } catch {
      return null;
    }
  }, "Chromium did not start its debugging interface");

  const targets = await waitFor(async () => {
    const response = await fetch(`http://127.0.0.1:${debuggingPort}/json/list`);
    if (!response.ok) return null;
    const pages = (await response.json()).filter((target) => target.type === "page");
    return pages[0] || null;
  }, "Chromium did not open a page");
  page = await connectToPage(targets.webSocketDebuggerUrl, (event) => browserEvents.push(event));
  await page.send("Page.enable");
  await page.send("Runtime.enable");
  await page.send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await page.send("Page.navigate", { url: `http://127.0.0.1:${sitePort}/` });
  await waitFor(async () => (await page.evaluate("document.readyState")) === "complete", "The apex page did not load");

  const initialNavigation = await page.evaluate(`(() => {
    const anchors = [...document.querySelectorAll('a[href^="#"]')];
    const missing = anchors
      .map((anchor) => anchor.getAttribute("href"))
      .filter((href) => !document.getElementById(decodeURIComponent(href.slice(1))));
    const fandom = document.querySelector('#fandom a[href="https://fandom.justlikekatie.com/"]');
    return {
      missing,
      headline: document.querySelector("#hero-title")?.innerText.replace(/\\s+/g, " ").trim(),
      worlds: [...document.querySelectorAll(".world-name h3")].map((heading) => heading.textContent.trim()),
      statuses: [...document.querySelectorAll(".world .status")].map((status) => status.textContent.trim()),
      fandomCopy: document.querySelector("#fandom .public-copy")?.textContent,
      fandomArtLabel: document.querySelector("#fandom .art-label")?.textContent,
      fandom: fandom && {
        target: fandom.target,
        rel: fandom.rel.split(/\\s+/).sort(),
      },
    };
  })()`);
  assert(initialNavigation.missing.length === 0, `All ${initialNavigation.missing.length ? "broken" : "in-page"} navigation targets resolve`);
  assert(initialNavigation.headline === "One curious life. Many ways in.", "The apex leads with the approved many-sided-life framing");
  assert(
    initialNavigation.worlds.join("|") === "StudentOS|CreatorOS|LifeOS|Fandom Vibes" &&
    initialNavigation.statuses.join("|") === "PRIVATE WORKSPACE|PRIVATE WORKSPACE|PROPOSED|PUBLIC WORLD",
    "All four worlds and their privacy/publication boundaries are explicit",
  );
  assert(
    initialNavigation.fandom?.target === "_blank" &&
    initialNavigation.fandom.rel.includes("noopener") &&
    initialNavigation.fandom.rel.includes("noreferrer"),
    "The public Fandom Vibes link uses the expected URL and safe new-tab attributes",
  );
  assert(
    initialNavigation.fandomCopy?.includes("C-drama as its initial focus") &&
    initialNavigation.fandomCopy.includes("Check each reading’s spoiler boundary") &&
    initialNavigation.fandomCopy.includes("VIBE ATLAS: DAILY CARD DROP") &&
    !initialNavigation.fandomCopy.includes("CONCEPT PREVIEW") &&
    initialNavigation.fandomArtLabel === "CONCEPT ART / NOT PUBLISHED CARDS",
    "Fandom copy distinguishes public card drops, spoiler boundaries, initial C-drama focus, and concept artwork",
  );

  for (const width of [320, 390, 768, 1440]) {
    await page.send("Emulation.setDeviceMetricsOverride", {
      width,
      height: 1000,
      deviceScaleFactor: 1,
      mobile: width < 768,
    });
    const dimensions = await page.evaluate(`({
      viewport: window.innerWidth,
      document: document.documentElement.scrollWidth,
      body: document.body.scrollWidth
    })`);
    assert(
      dimensions.document <= width && dimensions.body <= width,
      `No horizontal overflow at ${width}px (document ${dimensions.document}px, body ${dimensions.body}px)`,
    );
  }

  // Desktop browser zoom halves the CSS viewport and doubles devicePixelRatio.
  // These are 1440px desktop and 768px narrow windows at 200%, not pinch zoom
  // (setPageScaleFactor), which magnifies without testing responsive reflow.
  for (const windowWidth of [1440, 768]) {
    const width = windowWidth / 2;
    await page.send("Emulation.setDeviceMetricsOverride", {
      width,
      height: 500,
      deviceScaleFactor: 2,
      mobile: false,
    });
    await page.evaluate(`window.scrollTo({ top: 0, behavior: "instant" })`);
    const zoomDimensions = await page.evaluate(`({
      viewport: window.innerWidth,
      scale: window.devicePixelRatio,
      document: document.documentElement.scrollWidth,
      body: document.body.scrollWidth
    })`);
    assert(
      zoomDimensions.viewport === width && zoomDimensions.scale === 2,
      `The 200% zoom layout is active at ${width} CSS px`,
    );
    assert(
      zoomDimensions.document <= width && zoomDimensions.body <= width,
      `No horizontal overflow at 200% zoom and ${width} CSS px (document ${zoomDimensions.document}px, body ${zoomDimensions.body}px)`,
    );

    const menu = await page.evaluate(`(() => {
      const toggle = document.querySelector(".nav-menu-toggle");
      const links = [...document.querySelectorAll("#primary-navigation a")];
      return {
        toggleVisible: !!toggle.getClientRects().length,
        linksVisible: links.every((link) => !!link.getClientRects().length),
        links: links.length
      };
    })()`);
    if (width <= 620) {
      assert(menu.toggleVisible, "The compact main-navigation control is visible at 200% zoom on a narrow viewport");
      await clickVisibleControl(page, ".nav-menu-toggle", "The compact navigation button at 200% zoom");
      const expandedMenu = await page.evaluate(`({
        expanded: document.querySelector(".nav-menu-toggle").getAttribute("aria-expanded"),
        visibleLinks: [...document.querySelectorAll("#primary-navigation a")].filter((link) => !!link.getClientRects().length).length
      })`);
      assert(
        expandedMenu.expanded === "true" && expandedMenu.visibleLinks === 3,
        "The compact navigation opens all main links at 200% zoom",
      );
    } else {
      assert(menu.linksVisible && menu.links === 3, "All main-navigation links stay visible at 200% zoom on a desktop viewport");
    }

    const visibleNavigation = await page.evaluate(`(() => {
      return [...document.querySelectorAll("#primary-navigation a")].every((link) => {
        const rect = link.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 &&
          rect.left >= 0 && rect.right <= innerWidth &&
          rect.top >= 0 && rect.bottom <= innerHeight &&
          link.contains(document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2));
      });
    })()`);
    assert(visibleNavigation, `No main-navigation link is clipped or covered at 200% zoom and ${width} CSS px`);
    await clickVisibleControl(page, '#primary-navigation a[href="#worlds"]', `The worlds navigation link at ${width} CSS px`);
    const navigationLink = await page.evaluate(`({
      hash: location.hash, menuExpanded: document.querySelector(".nav-menu-toggle").getAttribute("aria-expanded")
    })`);
    assert(navigationLink.hash === "#worlds", `The main navigation works at 200% zoom and ${width} CSS px`);
    if (width <= 620) {
      assert(navigationLink.menuExpanded === "false", "Choosing a compact navigation link closes its menu");
    }

    const noteTargets = await page.evaluate(`(
      [...document.querySelectorAll("[data-world-toggle]")]
        .filter((button) => button.getClientRects().length)
        .map((button) => button.getAttribute("aria-controls"))
    )`);
    assert(noteTargets.length === (width <= 620 ? 8 : 4), `All expected field-note controls are available at ${width} CSS px`);
    for (const noteId of noteTargets) {
      const selector = `[data-world-toggle][aria-controls="${noteId}"]`;
      await clickVisibleControl(page, selector, `${noteId} at 200% zoom and ${width} CSS px`);
      const fieldNote = await page.evaluate(`(() => {
        const button = document.querySelector(${JSON.stringify(selector)});
        return {
          expanded: button.getAttribute("aria-expanded"),
          detailVisible: !document.getElementById(${JSON.stringify(noteId)}).hidden,
          overflow: document.documentElement.scrollWidth > innerWidth || document.body.scrollWidth > innerWidth
        };
      })()`);
      assert(
        fieldNote.expanded === "true" && fieldNote.detailVisible && !fieldNote.overflow,
        `${noteId} opens without overflow at 200% zoom and ${width} CSS px`,
      );
      await clickVisibleControl(page, selector, `The open ${noteId} control at ${width} CSS px`);
      assert(
        await page.evaluate(`document.querySelector(${JSON.stringify(selector)}).getAttribute("aria-expanded") === "false" && document.getElementById(${JSON.stringify(noteId)}).hidden`),
        `${noteId} closes at 200% zoom and ${width} CSS px`,
      );
    }

    // Verify activation without opening or making requests to the public site.
    await page.evaluate(`(() => {
      const link = document.querySelector('#fandom a[href="https://fandom.justlikekatie.com/"]');
      link.dataset.zoomActivated = "false";
      link.addEventListener("click", (event) => {
        link.dataset.zoomActivated = "true";
        event.preventDefault();
      }, { once: true });
    })()`);
    await clickVisibleControl(page, '#fandom a[href="https://fandom.justlikekatie.com/"]', `The Fandom Vibes link at ${width} CSS px`);
    const fandomLink = await page.evaluate(`(() => {
      const link = document.querySelector('#fandom a[href="https://fandom.justlikekatie.com/"]');
      return {
        activated: link.dataset.zoomActivated === "true",
        href: link.href
      };
    })()`);
    assert(
      fandomLink.activated && fandomLink.href === "https://fandom.justlikekatie.com/",
      `The Fandom Vibes link stays visible and usable at 200% zoom and ${width} CSS px`,
    );
  }

  await page.send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await page.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "no-preference" }] });
  const normalMotion = await page.evaluate(`({
    animation: getComputedStyle(document.querySelector(".orbit-one")).animationName,
    scroll: getComputedStyle(document.documentElement).scrollBehavior
  })`);
  assert(normalMotion.animation === "none", "The atlas field stays still rather than prescribing a route");

  await page.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  const reducedMotion = await page.evaluate(`({
    animation: getComputedStyle(document.querySelector(".orbit-one")).animationName,
    scroll: getComputedStyle(document.documentElement).scrollBehavior
  })`);
  assert(reducedMotion.animation === "none", "The static orbital illustration remains still for reduced-motion visitors");
  assert(reducedMotion.scroll === "auto", "Reduced motion disables smooth page scrolling");

  await page.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "no-preference" }] });
  const pressKey = async (key, code, windowsVirtualKeyCode, text) => {
    await page.send("Input.dispatchKeyEvent", {
      type: "keyDown",
      key,
      code,
      windowsVirtualKeyCode,
      nativeVirtualKeyCode: windowsVirtualKeyCode,
      ...(text ? { text, unmodifiedText: text } : key === "Enter" ? { text: "\r", unmodifiedText: "\r" } : {}),
    });
    await page.send("Input.dispatchKeyEvent", {
      type: "keyUp",
      key,
      code,
      windowsVirtualKeyCode,
      nativeVirtualKeyCode: windowsVirtualKeyCode,
    });
  };
  await page.evaluate("document.querySelector('.toggle[data-world-toggle]').focus()");
  await pressKey("Enter", "Enter", 13);
  const firstNote = await page.evaluate(`({
    expanded: document.querySelector('.toggle[data-world-toggle]').getAttribute("aria-expanded"),
    hidden: document.getElementById("world-detail-0").hidden,
    label: document.querySelector('.toggle[data-world-toggle] [data-toggle-label]').textContent.trim()
  })`);
  assert(
    firstNote.expanded === "true" && firstNote.hidden === false,
    "Enter opens a field note and exposes its expanded state",
  );
  assert(firstNote.label === "Close field note", "An open field note's control label updates");

  await page.evaluate("document.querySelectorAll('.toggle[data-world-toggle]')[1].focus()");
  await pressKey(" ", "Space", 32, " ");
  const switchedNotes = await page.evaluate(`({
    expanded: [...document.querySelectorAll('.toggle[data-world-toggle]')].map((button) => button.getAttribute("aria-expanded")),
    hidden: [...document.querySelectorAll('.world .detail')].map((detail) => detail.hidden)
  })`);
  assert(
    switchedNotes.expanded[0] === "false" &&
    switchedNotes.expanded[1] === "true" &&
    switchedNotes.hidden[0] === true &&
    switchedNotes.hidden[1] === false,
    "Space switches the open field note and keeps button states in sync",
  );

  await page.evaluate("document.querySelectorAll('.toggle[data-world-toggle]')[1].focus()");
  await pressKey(" ", "Space", 32, " ");
  const closedNote = await page.evaluate(`({
    expanded: document.querySelectorAll('.toggle[data-world-toggle]')[1].getAttribute("aria-expanded"),
    hidden: document.getElementById("world-detail-1").hidden
  })`);
  assert(closedNote.expanded === "false" && closedNote.hidden, "Space closes the active field note");

  for (const trackerState of ["missing", "throwing"]) {
    const { targetInfos: existingTargets } = await page.send("Target.getTargets");
    const existingTargetIds = new Set(existingTargets.map((target) => target.targetId));
    browserEvents.length = 0;
    const point = await page.evaluate(`(() => {
      delete window.umami;
      window.__trackerCalls = 0;
      window.__fandomClick = null;
      if (${JSON.stringify(trackerState)} === "throwing") {
        window.umami = { track() {
          window.__trackerCalls++;
          throw new Error("Simulated analytics failure");
        } };
      }
      const link = document.querySelector('#fandom a[href="https://fandom.justlikekatie.com/"]');
      document.addEventListener("click", (event) => {
        window.__fandomClick = {
          defaultPrevented: event.defaultPrevented,
          trusted: event.isTrusted,
        };
      }, { once: true });
      link.scrollIntoView({ behavior: "instant", block: "center" });
      const rect = link.getBoundingClientRect();
      return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
    })()`);
    await page.send("Input.dispatchMouseEvent", {
      type: "mousePressed", ...point, button: "left", clickCount: 1,
    });
    await page.send("Input.dispatchMouseEvent", {
      type: "mouseReleased", ...point, button: "left", clickCount: 1,
    });
    const click = await page.evaluate(`new Promise((resolve) => {
      // Drain the analytics timer, including any uncaught exception it raises.
      window.setTimeout(() => resolve({
        ...window.__fandomClick,
        trackerCalls: window.__trackerCalls,
        url: window.location.href,
      }), 50);
    })`);
    assert(click.trusted && click.defaultPrevented === false,
      `A real click is not cancelled with a ${trackerState} analytics tracker`);
    assert(click.trackerCalls === (trackerState === "throwing" ? 1 : 0),
      `The ${trackerState} tracker scenario actually runs`);
    assert(!browserEvents.some((event) => event.method === "Runtime.exceptionThrown"),
      `No uncaught page error with a ${trackerState} analytics tracker`);
    assert(browserEvents.some((event) => event.method === "Page.windowOpen" &&
      event.params.url === "https://fandom.justlikekatie.com/" && event.params.userGesture),
      `Fandom navigation is requested by the click with a ${trackerState} tracker`);
    const popup = await waitFor(async () => {
      const { targetInfos } = await page.send("Target.getTargets");
      return targetInfos.find((target) =>
        target.type === "page" && !existingTargetIds.has(target.targetId));
    }, `Fandom did not open a new tab with a ${trackerState} tracker`);
    assert(Boolean(popup), `A new tab opens with a ${trackerState} analytics tracker`);
    assert(click.url === `http://127.0.0.1:${sitePort}/`,
      `The apex stays open with a ${trackerState} analytics tracker`);
    await page.send("Target.closeTarget", { targetId: popup.targetId });
  }

  console.log(`Apex browser checks passed (${checks.length} assertions).`);
  for (const check of checks) console.log(`  ✓ ${check}`);
} catch (error) {
  console.error(`Apex browser check failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  page?.close();
  browser?.kill("SIGTERM");
  await new Promise((resolve) => server.close(resolve));
  if (profileDirectory) await rm(profileDirectory, { recursive: true, force: true });
}
