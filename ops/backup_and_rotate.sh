#!/usr/bin/env bash
set -euo pipefail
cd /home/rubiorobin/.openclaw/workspace

# Commit local changes (best effort)
git add -A || true
if ! git diff --cached --quiet; then
  git commit -m "chore(backup): nightly snapshot $(date -Iseconds)" || true
fi

# Keep repo lean
git gc --prune=now || true
