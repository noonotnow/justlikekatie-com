---
name: Browser runtime compatibility
description: Distinguish native browser packages from compatible Playwright runtimes.
---

A system WebKitGTK installation is not proof that Playwright's downloaded WebKit can run. Verify launch with the intended automation library before claiming coverage.

**Why:** This workspace had native WebKitGTK binaries, but Playwright WebKit still required missing distribution-specific shared-library ABIs after installing the native package. Installing the native browser package did not solve that compatibility problem.

**How to apply:** Report unavailable engines as unverified, not passed. Use a supported browser-test host for strict all-engine checks rather than assuming a native MiniBrowser is a compatible replacement or substituting incompatible shared-library versions.
