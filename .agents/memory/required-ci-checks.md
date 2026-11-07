---
name: Required CI checks
description: Avoiding pending-check deadlocks when GitHub branch rules require CI results.
---

Required GitHub checks must report a result for every pull request covered by the branch rule. Do not add workflow-level path filters to a required check.

**Why:** GitHub leaves a required workflow check pending when path filtering prevents the workflow from starting. An unrelated pull request can then remain blocked indefinitely.

**How to apply:** Keep required workflows unconditional at the pull-request trigger. If a check is renamed, update and verify its required context in the live repository settings as well; a local YAML change alone cannot update branch protection.

Workflow linting on GitHub can reject deprecated action runtimes even when the action still executes successfully. A locally installed older linter may not flag those deprecations.

**Why:** The hosted workflow linter enforced runtime deprecations that the local linter did not, while the actual jobs still passed.

**How to apply:** Check hosted annotations as well as job outcomes. Use supported action runtimes for new workflows; do not change an explicitly protected existing workflow just to clear unrelated lint errors.
