#!/usr/bin/env bash
set -euo pipefail
cd /home/rubiorobin/.openclaw/workspace

# Load runtime env for cron (best-effort, no echo of secrets)
for f in \
  /home/rubiorobin/.openclaw/workspace/.env \
  /home/rubiorobin/.openclaw/workspace/.env.local \
  /home/rubiorobin/.openclaw/.env \
  /home/rubiorobin/.config/zeus/env \
  /home/rubiorobin/.config/zeus/.env
  do
  if [[ -f "$f" ]]; then
    set -a
    # shellcheck disable=SC1090
    source "$f"
    set +a
  fi
done

/usr/bin/node scripts/decision_ingest_from_telegram.mjs
/usr/bin/node scripts/auto_start_registered_builds.mjs