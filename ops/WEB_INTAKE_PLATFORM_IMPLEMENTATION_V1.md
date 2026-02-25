# Web Intake Platform — Implementatie V2

Datum: 2026-02-25
Owner: Zeus

## Architecture summary

- Frontend: statische website (`projects/bedrijf-website`) met intakeformulier op `contact.html`.
- Doelflow: **klant intake -> directe build-opdracht voor codeur**.
- Validatie: client-side required velden + minimale probleemlengte.
- Storage (tijdelijk):
  - `nexus_intakes` (historie)
  - `nexus_build_queue` (directe build-queue)
- Tracking (tijdelijk): `nexus_events` voor CTA/intake/build events.
- Intake handoff: knop `Start build-opdracht` maakt een gestructureerde build task + acceptance criteria + effort/risk inschatting.

## API/form contract

Form fields:
- `name` (string, required)
- `company` (string, required)
- `email` (email, required)
- `revitVersion` (enum, required)
- `addinType` (enum, required)
- `problem` (string, required, min 20 chars)
- `outcome` (string, required)
- `urgency` (enum: Laag/Midden/Hoog)
- `budget` (enum: €1k–€3k / €3k–€7.5k / €7.5k+)
- `filesUrl` (url, optional)

Derived fields:
- `traceId` (`NX-<timestamp-base36>`)
- `taskId` (`BUILD-NX-...`)
- `createdAt` (ISO timestamp)
- `triage` (effort/risk/priority)
- `acceptanceCriteria` (array)

## Deployment notes

- Site is file-based/static en direct wijzigbaar in `projects/bedrijf-website`.
- Geen backend secrets nodig voor huidige versie.
- Volgende stap (v3): server endpoint zodat build queue niet in localStorage maar centraal wordt opgeslagen en toegewezen aan codeur.

## Test checklist

- [ ] Home CTA “Start intake” werkt vanaf meerdere pagina’s.
- [ ] Form validatie blokkeert lege/onvolledige submit.
- [ ] Geldige submit maakt `taskId` en toont build-opdracht payload.
- [ ] `nexus_build_queue` krijgt nieuwe task na submit.
- [ ] Exportknop kopieert build-opdracht tekst.
- [ ] `nexus_events` bevat `intake_build_created` events.
- [ ] Mobiele weergave van formulier blijft leesbaar.
