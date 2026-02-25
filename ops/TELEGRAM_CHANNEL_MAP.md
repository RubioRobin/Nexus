# TELEGRAM CHANNEL MAP (Robin x Zeus)

Updated: 2026-02-25
Owner: Zeus
Purpose: vaste kanaal-ID mapping voor betrouwbare automation en berichtenrouting.

## Directie
- Directie: `-1003701843512`
- Zeus backchannel: (DM / aparte chat, niet in group-map)

## Lanes
- Intake-Sales: `-1003870581685`
- Research-Innovatie: `-1003737394321`
- Planning: `-1003575020150`
- Codeurs: `-1003826367901`
- QA-Release: `-1003543098532`
- Blockers-Critical: `-1003399860071`

## Routing rules
1. Research levert kansen/problemen naar Directie (08:00 shortlist).
2. Alleen na Robin JA: door naar Intake -> Planning -> Codeurs -> QA-Release.
3. Escalaties >3h zonder update gaan naar Blockers-Critical.
4. Release pas na QA PASS + Robin GO + artifacts (`.dll` + `.addin`).
5. Besliscommando’s in groepschat: `GO <id>` of `NO-GO <id>` (geen impliciete reply-only beslissingen).

## Hygiene
- Zie `ops/TELEGRAM_HYGIENE_RUNBOOK_V1.md` voor cleanup, pinning, en update-format.
