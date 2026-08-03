# Migration provenance

This repository was extracted from
[`noonotnow/stalwart-strudel-413ae3`](https://github.com/noonotnow/stalwart-strudel-413ae3)
as part of a one-repo-per-deployment split.

- **Source repo:** `noonotnow/stalwart-strudel-413ae3`
- **Source commit at time of extraction:** `ef03ad32347dfabe1b06354163b8f1186ad9596e`
  ("Add coming-soon landing page for justlikekatie.com (#73)")
- **Extraction date:** 2026 (see this repo's first commit timestamp for the
  exact date)
- **Path carried over:** `site/` (added self-contained in PR #73) → repo
  root. `site/netlify.toml` was rewritten only to remove the comment
  referencing a Netlify dashboard "Base directory: site" setting — that
  setting is no longer needed, since this repo's root is now the deploy
  root. `publish = "."` and the security headers are otherwise unchanged.
- **History:** this was a single self-contained commit in the source repo
  (PR #73, squash-merged), so it is preserved as-is rather than needing
  further filtering.

**Why this repo exists:** the source repo originally served this apex
coming-soon page from a `site/` subdirectory, disambiguated only by a
Netlify dashboard "Base directory: site" setting invisible from the repo
itself. That hidden-glue setup was initially misconfigured — the apex
briefly served the *other*, unrelated Fandom app's legacy page instead of
this one. Promoting `site/` to its own repo root permanently removes that
failure mode: this repo's root is always the entire deployable, with
nothing else present to accidentally serve.
