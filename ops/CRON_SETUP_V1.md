# Cron Setup V1 (Nexus)

## Active schedule
- 08:00 -> `scripts/generate_0800_brief.mjs`
- 12:30 -> `scripts/generate_1230_status.mjs`
- 19:30 -> `scripts/generate_1930_summary.mjs`
- Every 30m -> `scripts/stale_check_3h.mjs`
- Every 15m -> `scripts/decision_ingest_tick.sh`
- 09:00 / 13:00 / 18:00 -> `scripts/telegram_hygiene_check.mjs`

Logs:
- `logs/cron/0800.log`
- `logs/cron/1230.log`
- `logs/cron/1930.log`
- `logs/cron/stale.log`
- `logs/cron/decision_ingest.log`
- `logs/cron/hygiene.log`

## Notes
- Decision ingest tick is placeholder scheduler hook; command parser is ready (`scripts/telegram_decision_parser.mjs` + `scripts/apply_telegram_decision.mjs`).
- Next step: bind Telegram inbound events directly to decision apply flow.
