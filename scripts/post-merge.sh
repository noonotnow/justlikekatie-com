#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SANDBOX_DIR="$PROJECT_ROOT/artifacts/mockup-sandbox"
PACKAGE_JSON="$SANDBOX_DIR/package.json"
PACKAGE_LOCK="$SANDBOX_DIR/package-lock.json"

if [[ -f "$PACKAGE_JSON" && -f "$PACKAGE_LOCK" ]]; then
  npm --prefix "$SANDBOX_DIR" ci --no-audit --no-fund
elif [[ -e "$PACKAGE_JSON" || -e "$PACKAGE_LOCK" ]]; then
  echo "Mockup sandbox has an incomplete npm manifest/lockfile pair." >&2
  exit 1
else
  echo "No dependency-managed mockup sandbox found; the apex site has no install step."
fi
