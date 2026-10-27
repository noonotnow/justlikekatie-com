---
name: Required CI checks
description: Avoiding pending-check deadlocks when GitHub branch rules require CI results.
---

Required GitHub checks must report a result for every pull request covered by the branch rule. Do not add workflow-level path filters to a required check.

**Why:** GitHub leaves a required workflow check pending when path filtering prevents the workflow from starting. An unrelated pull request can then remain blocked indefinitely.

**How to apply:** Keep required workflows unconditional at the pull-request trigger. If a check is renamed, update and verify its required context in the live repository settings as well; a local YAML change alone cannot update branch protection.
