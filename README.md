# justlikekatie-com

**Domain:** `justlikekatie.com` (apex)
**Deploys:** This repository's root is the *only* thing deployed to the
Netlify site serving the apex domain. There is nothing else here — no
unrelated projects, and no dashboard "Base directory" setting is needed to
find the right code (repo root == deploy root).
**Origin:** Extracted from
[`noonotnow/stalwart-strudel-413ae3`](https://github.com/noonotnow/stalwart-strudel-413ae3)
(now retired). See `MIGRATION.md` for exact provenance.

## What this is

A hand-authored, fully static "coming soon" control-room page for the bare
apex domain. No build step, no backend, no forms, no data collection. See
`PRODUCT.md` for the product brief/positioning and `DESIGN.md` for the
visual design rationale.

This page intentionally does not name or link any of the private tools
that live on other subdomains (e.g. `fandom.justlikekatie.com`) — see
`PRODUCT.md` for why.

## Build & run

There is no build step. Open `index.html` directly, or serve the directory
with any static file server for local preview, e.g.:

```sh
npx serve .
```

## Browser regression checks

The checks start and stop their own local static server; no preview workflow
or published site is needed. Install the locked development dependency with
`npm ci`, then install the browser engines with:

```sh
npx playwright install chromium firefox webkit
```

On supported Linux hosts, Playwright also needs its documented browser OS
libraries (`npx playwright install-deps`); on Replit/Nix, install system
dependencies through the workspace package tools instead of apt.

```sh
npm run check:apex             # Chromium plus available Firefox and WebKit
npm run check:apex:all         # require all three engines (recommended for CI)
npm run check:apex:chromium    # existing Chromium-only check
npm run check:apex:firefox
npm run check:apex:webkit      # Safari's engine, not the macOS Safari application
```

Every engine runs the same 320/390/768/1440px overflow checks, reduced-motion
checks, and native Enter/Space open/switch/close checks on desktop and mobile
field-note buttons. Default discovery reports unavailable Firefox/WebKit
explicitly; assertion failures always fail. Explicit browser selection and
`--require-all` also fail if an engine cannot start, so CI cannot silently
skip coverage. `--browser=firefox,webkit` selects multiple engines.

The existing 200% zoom reflow and analytics-failure navigation checks are also
run for each available engine. Fandom popup destinations are intercepted
locally during the tests rather than contacting the public site.

Chromium uses `/repl/tools/bin/chromium` when present, otherwise Playwright's
bundled engine. `CHROMIUM_PATH`, `FIREFOX_PATH`, and `WEBKIT_PATH` can point to
compatible executables; Firefox/WebKit must be Playwright-compatible builds.

## Deploy config

`netlify.toml` runs `node scripts/prepare-netlify.mjs` and publishes the
allowlisted static site from `generated-artifacts/netlify-site`. The staging
step includes the apex page and its approved assets only. Baseline security
headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`) apply
to all paths; there are no functions or environment variables.
