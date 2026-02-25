# Web Intake Platform — Implementatie V1

Datum: 2026-02-25
Owner: Zeus

## Architecture summary

- Frontend: statische website (`projects/bedrijf-website`) met intakeformulier op `contact.html`.
- Validatie: client-side required velden + minimale probleemlengte.
- Storage (tijdelijk): `localStorage` key `nexus_intakes` met laatste 50 submissions.
- Tracking (tijdelijk): `localStorage` key `nexus_events` voor CTA/form events.
- Intake handoff: Trello-kaarttekst generator in UI (`Genereer Trello-kaarttekst`) + copy-to-clipboard.

## API/form contract

Form fields:
- `name` (string, required)
- `company` (string, required)
- `email` (email, required)
- `problem` (string, required, min 20 chars)
- `outcome` (string, required)
- `urgency` (enum: Laag/Midden/Hoog)
- `budget` (enum: €1k–€3k / €3k–€7.5k / €7.5k+)

Derived fields:
- `traceId` (`NX-<timestamp-base36>`)
- `createdAt` (ISO timestamp)
- `trelloText` (markdown payload)

## Deployment notes

- Site is file-based/static en direct wijzigbaar in `projects/bedrijf-website`.
- Geen backend secrets nodig voor huidige versie.
- Volgende stap (v2): server endpoint toevoegen voor directe Trello API write.

## Test checklist

- [ ] Home CTA “Start intake” werkt vanaf meerdere pagina’s.
- [ ] Form validatie blokkeert lege/onvolledige submit.
- [ ] Geldige submit toont trace ID bevestiging.
- [ ] Trello export knop toont payload en kopieert tekst.
- [ ] `nexus_events` bevat cta/form events.
- [ ] Mobiele weergave van formulier blijft leesbaar.
