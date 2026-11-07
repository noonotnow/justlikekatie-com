const fandomURL = "https://fandom.justlikekatie.com/";
const fandomSelector = `#fandom a[href="${fandomURL}"]`;

async function clickVisibleControl(page, selector, label, checks, assert) {
  const target = await page.locator(selector).evaluate((element) => {
    element.scrollIntoView({ block: "center", behavior: "instant" });
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    return {
      x, y,
      visible: rect.width > 0 && rect.height > 0 &&
        rect.left >= 0 && rect.right <= innerWidth &&
        rect.top >= 0 && rect.bottom <= innerHeight &&
        element.contains(document.elementFromPoint(x, y)),
    };
  });
  assert(target.visible, `${label} is in view and not clipped or covered`, checks);
  // Resizing and scroll anchoring can move the link between the visibility
  // measurement and input dispatch. Locator clicks wait for a stable target
  // and still send trusted mouse input; do not force-click or dispatch a DOM event.
  await page.locator(selector).click();
}

// Preserve the existing 200% zoom regression cases using the same reflow
// model: half the desktop CSS viewport and double devicePixelRatio. Pinch
// zoom (pageScaleFactor) would not exercise responsive reflow.
export async function checkZoom(browser, url, checks, assert) {
  const context = await browser.newContext({
    viewport: { width: 720, height: 500 },
    deviceScaleFactor: 2,
  });
  try {
    const page = await context.newPage();
    page.setDefaultTimeout(15_000);
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(url);
    await page.evaluate(() => document.fonts.ready);
    for (const windowWidth of [1440, 768]) {
      const width = windowWidth / 2;
      await page.setViewportSize({ width, height: 500 });
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      const dimensions = await page.evaluate(() => ({
        viewport: innerWidth,
        scale: devicePixelRatio,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth,
      }));
      assert(dimensions.viewport === width && dimensions.scale === 2,
        `The 200% zoom layout is active at ${width} CSS px`, checks);
      assert(dimensions.document <= width && dimensions.body <= width,
        `No horizontal overflow at 200% zoom and ${width} CSS px (document ${dimensions.document}px, body ${dimensions.body}px)`, checks);

      const menu = await page.evaluate(() => {
        const toggle = document.querySelector(".nav-menu-toggle");
        const links = [...document.querySelectorAll("#primary-navigation a")];
        return {
          toggleVisible: Boolean(toggle.getClientRects().length),
          linksVisible: links.every((link) => Boolean(link.getClientRects().length)),
          links: links.length,
        };
      });
      if (width <= 620) {
        assert(menu.toggleVisible, "The compact main-navigation control is visible at 200% zoom on a narrow viewport", checks);
        await clickVisibleControl(page, ".nav-menu-toggle", "The compact navigation button at 200% zoom", checks, assert);
        const expandedMenu = await page.evaluate(() => ({
          expanded: document.querySelector(".nav-menu-toggle").getAttribute("aria-expanded"),
          visibleLinks: [...document.querySelectorAll("#primary-navigation a")].filter((link) => link.getClientRects().length).length,
        }));
        assert(expandedMenu.expanded === "true" && expandedMenu.visibleLinks === 3,
          "The compact navigation opens all main links at 200% zoom", checks);
      } else {
        assert(menu.linksVisible && menu.links === 3,
          "All main-navigation links stay visible at 200% zoom on a desktop viewport", checks);
      }
      const visibleNavigation = await page.locator("#primary-navigation a").evaluateAll((links) =>
        links.every((link) => {
          const rect = link.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 &&
            rect.left >= 0 && rect.right <= innerWidth &&
            rect.top >= 0 && rect.bottom <= innerHeight &&
            link.contains(document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2));
        }),
      );
      assert(visibleNavigation, `No main-navigation link is clipped or covered at 200% zoom and ${width} CSS px`, checks);
      await clickVisibleControl(page, '#primary-navigation a[href="#worlds"]', `The worlds navigation link at ${width} CSS px`, checks, assert);
      const navigationLink = await page.evaluate(() => ({
        hash: location.hash,
        menuExpanded: document.querySelector(".nav-menu-toggle").getAttribute("aria-expanded"),
      }));
      assert(navigationLink.hash === "#worlds", `The main navigation works at 200% zoom and ${width} CSS px`, checks);
      if (width <= 620) {
        assert(navigationLink.menuExpanded === "false", "Choosing a compact navigation link closes its menu", checks);
      }

      const noteTargets = await page.locator("[data-world-toggle]").evaluateAll((buttons) =>
        buttons.filter((button) => button.getClientRects().length).map((button) => button.getAttribute("aria-controls")),
      );
      assert(noteTargets.length === (width <= 620 ? 8 : 4), `All expected field-note controls are available at ${width} CSS px`, checks);
      for (const noteId of noteTargets) {
        const selector = `[data-world-toggle][aria-controls="${noteId}"]`;
        await clickVisibleControl(page, selector, `${noteId} at 200% zoom and ${width} CSS px`, checks, assert);
        const fieldNote = await page.locator(selector).evaluate((button) => ({
          expanded: button.getAttribute("aria-expanded"),
          detailVisible: !document.getElementById(button.getAttribute("aria-controls")).hidden,
          overflow: document.documentElement.scrollWidth > innerWidth || document.body.scrollWidth > innerWidth,
        }));
        assert(fieldNote.expanded === "true" && fieldNote.detailVisible && !fieldNote.overflow,
          `${noteId} opens without overflow at 200% zoom and ${width} CSS px`, checks);
        await clickVisibleControl(page, selector, `The open ${noteId} control at ${width} CSS px`, checks, assert);
        assert(await page.locator(selector).evaluate((button) =>
          button.getAttribute("aria-expanded") === "false" && document.getElementById(button.getAttribute("aria-controls")).hidden),
        `${noteId} closes at 200% zoom and ${width} CSS px`, checks);
      }

      // This zoom-specific check tests activation without leaving the page.
      await page.locator(fandomSelector).evaluate((link) => {
        link.dataset.zoomActivated = "false";
        link.addEventListener("click", (event) => {
          link.dataset.zoomActivated = "true";
          event.preventDefault();
        }, { once: true });
      });
      await clickVisibleControl(page, fandomSelector, `The Fandom Vibes link at ${width} CSS px`, checks, assert);
      assert(await page.locator(fandomSelector).evaluate((link) =>
        link.dataset.zoomActivated === "true" && link.href === "https://fandom.justlikekatie.com/"),
      `The Fandom Vibes link stays visible and usable at 200% zoom and ${width} CSS px`, checks);
    }
    assert(errors.length === 0, `No uncaught page errors during zoom checks${errors.length ? `: ${errors.join("; ")}` : ""}`, checks);
  } finally {
    await context.close();
  }
}

export async function checkAnalyticsNavigation(page, url, checks, assert) {
  const context = page.context();
  // Keep the real new-tab navigation, but serve its destination locally so
  // regression runs never contact or record visits on the public Fandom site.
  const destination = async (route) => route.fulfill({
    contentType: "text/html",
    body: "<!doctype html><title>Fandom navigation check</title>",
  });
  const errors = [];
  const onError = (error) => errors.push(error.message);
  page.on("pageerror", onError);
  await context.route(`${fandomURL}**`, destination);
  try {
    await page.setViewportSize({ width: 1440, height: 1000 });
    for (const trackerState of ["missing", "throwing"]) {
      const beforeErrors = errors.length;
      await page.evaluate((state) => {
        delete window.umami;
        window.__trackerCalls = 0;
        window.__fandomClick = null;
        if (state === "throwing") {
          window.umami = { track() {
            window.__trackerCalls++;
            throw new Error("Simulated analytics failure");
          } };
        }
        document.addEventListener("click", (event) => {
          window.__fandomClick = { trusted: event.isTrusted, defaultPrevented: event.defaultPrevented };
        }, { once: true });
      }, trackerState);
      const [popup] = await Promise.all([
        page.waitForEvent("popup"),
        clickVisibleControl(page, fandomSelector, `The Fandom link with a ${trackerState} analytics tracker`, checks, assert),
      ]);
      try {
        await popup.waitForURL(fandomURL, { waitUntil: "domcontentloaded" });
        const click = await page.evaluate(() => new Promise((resolve) => {
          // Drain the analytics timer, including any uncaught exception.
          setTimeout(() => resolve({
            ...window.__fandomClick,
            trackerCalls: window.__trackerCalls,
            url: location.href,
          }), 50);
        }));
        assert(click.trusted && click.defaultPrevented === false,
          `A real click is not cancelled with a ${trackerState} analytics tracker`, checks);
        assert(click.trackerCalls === (trackerState === "throwing" ? 1 : 0),
          `The ${trackerState} tracker scenario actually runs`, checks);
        assert(errors.length === beforeErrors,
          `No uncaught page error with a ${trackerState} analytics tracker`, checks);
        assert(popup.url() === fandomURL,
          `Fandom navigation is requested by the click with a ${trackerState} tracker`, checks);
        assert(!popup.isClosed(), `A new tab opens with a ${trackerState} analytics tracker`, checks);
        assert(click.url === url, `The apex stays open with a ${trackerState} analytics tracker`, checks);
      } finally {
        await popup.close();
      }
    }
  } finally {
    await context.unroute(`${fandomURL}**`, destination);
    page.off("pageerror", onError);
    await page.evaluate(() => { delete window.umami; });
  }
}
