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

function connectToPage(webSocketUrl) {
  const socket = new WebSocket(webSocketUrl);
  let nextId = 0;
  const pending = new Map();

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
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

const server = createStaticServer();
let browser;
let page;
let profileDirectory;

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
  page = await connectToPage(targets.webSocketDebuggerUrl);
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
