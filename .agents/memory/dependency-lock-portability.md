---
name: Dependency lock portability
description: Keep browser-test dependency locks installable outside the workspace.
---

Workspace package installation can record internal registry tarball URLs even for public npm packages. Those URLs are not usable by external test hosts.

**Why:** The initial browser-test lockfile used workspace-only tarball URLs, breaking the documented path to run unavailable browser engines on a separate supported host. Public npm metadata confirmed identical package integrity at publicly reachable tarball URLs.

**How to apply:** Check lockfile tarball hosts after dependency changes intended for shared CI. Preserve verified integrity hashes while using reachable public package URLs, and validate a clean locked installation before claiming portability.
