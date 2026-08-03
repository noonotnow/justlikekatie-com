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

## Deploy config

`netlify.toml`: `publish = "."` (repo root), plus baseline security headers
(`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`) on all
paths. No functions, no build command, no environment variables.
