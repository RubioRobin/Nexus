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
  - **Oplossing:** Gebruik vaste referentieset (VH_IFC_Viewer, Brood, VH_addin) + design baseline in `ops/DESIGN_REFERENCE.md`.
  - **Waar staat het:** `ops/DESIGN_REFERENCE.md`
  - **Wanneer opnieuw gebruiken:** Bij elke nieuwe add-in, website-update, of intake waar UI/branding onderdeel is.
