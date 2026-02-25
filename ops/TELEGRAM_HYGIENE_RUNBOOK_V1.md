# Telegram Hygiene Runbook V1

Datum: 2026-02-25
Owner: Zeus

## Doel
Chats overzichtelijk houden en besluitcommando’s betrouwbaar laten werken.

## Direct toepassen
1. Bot privacy OFF in groepen (BotFather /setprivacy).
2. Gebruik expliciete commands in groepen:
   - `GO <id>`
   - `NO-GO <id>`
3. Zet Telegram channel behavior op mention-gated waar mogelijk (voorkomt ruis-triggering).
4. Eén lane = één type update (geen cross-post dump).

## Kanaalregels
- **Directie**: alleen beslispunten, GO/NO-GO, daily summary.
- **Intake-Sales**: alleen nieuwe intakes + ontbrekende info.
- **Research-Innovatie**: alleen shortlist + bronverwijzingen.
- **Planning**: only ownership, ETA, sequencing.
- **Codeurs**: buildstatus + artifacts.
- **QA-Release**: QA pass/fail + release readiness.
- **Blockers-Critical**: alleen blockers >3h of incident.

## Update-template (verplicht)
- Done:
- Next:
- Blocker:
- GO/NO-GO nodig:

## Opschonen (weekly)
- Archive/deactivate oude testgroepen.
- Verwijder dubbele kanalen met hetzelfde doel.
- Check pinned message per lane met doel + format.
- Controleer dat chat IDs in `ops/TELEGRAM_CHANNEL_MAP.md` nog kloppen.

## Major event routing
- Build klaar -> Codeurs + Directie
- QA fail -> QA-Release + Blockers-Critical
- QA pass -> QA-Release + Directie (GO gevraagd)
- Release done -> Directie + Intake-Sales (klantupdate)
