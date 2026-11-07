---
name: Browser runtime compatibility
description: Distinguish native browser packages from compatible Playwright runtimes.
---

A system WebKitGTK installation is not proof that Playwright's downloaded WebKit can run. Verify launch with the intended automation library before claiming coverage.

**Why:** This workspace had native WebKitGTK binaries, but Playwright WebKit still required missing distribution-specific shared-library ABIs after installing the native package. Installing the native browser package did not solve that compatibility problem.

**How to apply:** Report unavailable engines as unverified, not passed. Use a supported browser-test host for strict all-engine checks rather than assuming a native MiniBrowser is a compatible replacement or substituting incompatible shared-library versions.

Cross-browser checks must tolerate host scheduling differences without bypassing real input or retrying away failures.

**Why:** Supported-host CI exposed an intermittent Chromium popup timeout after responsive layout changes even though an earlier run passed; a green run alone did not establish stable interaction coverage.

**How to apply:** Use browser-aware stable-target input for interactions after resizing or scrolling. Preserve hit-testing and trusted-event assertions rather than replacing them with synthetic events, forced clicks, or blanket retries.
