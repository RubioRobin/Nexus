# MEMORY

Purpose: persistent bedrijfsgeheugen voor Zeus + agents, zodat besluiten/ideeën/hergebruik altijd terugvindbaar zijn.

## Retrieval standaard
- Zoek altijd eerst in `MEMORY.md` + `memory/*.md`.
- Noteer beslissingen met datum/tijd, owner en bewijslink (commit/Trello/url).

## Vast format (altijd gebruiken)
1. **Facts** (wat is gebeurd)
2. **Decisions** (wat is besloten + door wie)
3. **Ideas** (kansen om later te hergebruiken)
4. **Artifacts** (bestanden, commits, cards, links)
5. **Open actions** (owner + deadline)

## Anti-heruitvinding regel
- Als een agent een oplossing/flow/skill heeft gemaakt, leg vast onder **Reusable Patterns** met:
  - Probleem
  - Oplossing
  - Waar staat het (pad/link)
  - Wanneer opnieuw gebruiken

## Reusable Patterns
- **Probleem:** Stijl/UX raakt inconsistent tussen web en Revit add-ins bij snelle bouw.
  - **Oplossing:** Gebruik vaste referentieset (VH_IFC_Viewer, Brood, VH_addin, Nexus) + design baseline in `ops/DESIGN_REFERENCE.md` en UI-regels in `ops/UI_STYLE_REQUIREMENTS_V1.md`.
  - **Waar staat het:** `ops/DESIGN_REFERENCE.md`, `ops/UI_STYLE_REQUIREMENTS_V1.md`
  - **Wanneer opnieuw gebruiken:** Bij elke nieuwe add-in, website-update, of intake waar UI/branding onderdeel is.

## 2026-02-25 Operational Update
1. **Facts**
- Telegram is nu command center met lane-kanalen + Directie.
- Cron-automations draaien voor 08:00, 12:30, 19:30, 3h stale-check en weekly scorecard.
- Web search is geactiveerd (Brave) voor online probleemonderzoek.

2. **Decisions**
- Flow: Research -> Robin JA/NEE -> Intake -> Planning -> Codeurs -> QA -> Directie GO/NO-GO.
- Stale escalatiegrens is 3 uur.
- Revit release-eis: `.dll` + `.addin`, build zonder errors/warnings.
- Bij ready-to-test: altijd GitHub push + testmelding in Directie.

3. **Ideas**
- Website benchmark dagelijks door Athena voor continue conversieverbetering.
- Weekly operating scorecard om directie-besluitvorming te versnellen.

4. **Artifacts**
- `ops/OPERATING_PLAYBOOK_V1.md`
- `ops/TELEGRAM_CHANNEL_MAP.md`
- `ops/DESIGN_REFERENCE.md`
- `ops/UI_STYLE_REQUIREMENTS_V1.md`

5. **Open actions**
- Owner Zeus: monitor eerste productie-run van Task A (Batch Sheet Renamer) tot QA handoff.
- Owner Robin: JA/NEE keuzes blijven in privéchat/Directie vastleggen voor auditspoor.
- Owner Zeus: wekelijkse roster-review uitvoeren volgens `ops/AGENT_ROSTER_STATUS.md`.

## 2026-02-25 13:22 UI/Ribbon standaard (Robin)
1. **Facts**
- Robin bevestigde dat de add-in zichtbaar is en gaf aanvullende standaarden voor toekomstige builds.
- Robin wil meerdere XAML-voorbeelden aanleveren als referentie-‘database’ voor gewenste UI.

2. **Decisions**
- Revit add-in UI moet aansluiten op de website-UI.
- Elke add-in moet een eigen Ribbon-knop krijgen.
- Voorkeur: Ribbon-knop met 32x32 icoon (icoon mag later worden toegevoegd).

3. **Ideas**
- Centrale XAML style library + component mapping naar website design-system, zodat UI consistent en sneller herbruikbaar is.

4. **Artifacts**
- Webchat bericht Robin, 2026-02-25 13:22 (Europe/Amsterdam).

5. **Open actions**
- Owner Zeus/codeur: inkomende XAML-snippets structureren in een herbruikbare referentie-database voor Revit UI-implementaties.
