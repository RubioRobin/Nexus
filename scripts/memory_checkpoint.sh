#!/usr/bin/env bash
set -euo pipefail

cd /home/rubiorobin/.openclaw/workspace
mkdir -p logs/cron

TS="$(date +"%Y-%m-%d %H:%M:%S %Z")"
CHANGES="$(git status --short | wc -l | tr -d ' ')"

{
  echo "[$TS] memory-checkpoint"
  echo "  git_changes_pending: $CHANGES"
  echo "  note: update MEMORY.md after major decision/artifact changes"
} >> logs/cron/memory_checkpoint.log
