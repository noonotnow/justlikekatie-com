# CurioSeek apex design exploration

The imported root is the existing static Just Like Katie landing page. Its HTML, product brief, assets, and Netlify configuration remain unchanged. The CurioSeek proposal is isolated in a design sandbox, not integrated into the production page.

## Run the design preview

- Workflow: `artifacts/mockup-sandbox: Component Preview Server`
- Working directory: `artifacts/mockup-sandbox`
- Command: `npm run dev`
- Preview base: `/__mockup/`
- CurioSeek concept: `/__mockup/preview/curioseek/Apex`
- Exact imported-page reference: `/__mockup/preview/curioseek/Current`
- Type check: `cd artifacts/mockup-sandbox && npm run typecheck`

The sandbox uses Node.js 22, React, TypeScript, and Vite. It does not need application secrets or a backend. The original site remains plain HTML with no build step.

## Product and privacy boundaries

CurioSeek is a proposed umbrella for StudentOS, CreatorOS, LifeOS, Fandom Vibes, a content engine, and a C-drama wiki. This is a design proposal, not a launch announcement.

Keep private workspaces and public destinations distinct. Do not expose private repository contents, operator endpoints, clinical information, account data, or private tool URLs in public page content. LifeOS and a standalone public C-drama wiki have not been verified as implemented; do not claim otherwise.

The existing root product brief describes the earlier coming-soon page. It has not been rewritten to imply approval of the new concept. Production integration, domain changes, and publishing require a separate user decision.
