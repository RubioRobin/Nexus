---
name: revit-ui-huisstijl
description: Pas vaste huisstijlstandaarden toe op Revit add-ins. Gebruik bij elke nieuwe of bestaande add-in wanneer UI (kleuren, rondingen, knoppen, layout, feedback), Ribbon-knoppen of visuele consistentie met de website vereist is.
---

Gebruik dit skill-protocol voor elke Revit add-in met UI-werk.

## Verplichte flow

1. Lees eerst `ops/ADDIN_HUISSTIJL_HANDBOEK_V1.md`.
2. Check referenties in volgorde:
   - `VH_IFC_Viewer`
   - `Nexus`
   - `VH_addin`
3. Definieer component mapping (header, forms, grid, notifications, actions).
4. Pas UI toe met 1 primary CTA per scherm en consistente secondary actions.
5. Zorg voor eigen Ribbon-knop per add-in (voorkeur 32x32 icoon).
6. Valideer op checklist uit het handboek.

## Hard constraints

- Geen visuele drift t.o.v. website-huisstijl zonder Robin GO.
- Geen release zonder `.dll` + `.addin` + foutloze build.
- User-facing tekst: kort, duidelijk NL tenzij project anders vereist.

## Output bij oplevering

- Korte style-conformance samenvatting (wat aligned is).
- Lijst van afwijkingen + reden.
- TODO’s voor ontbrekend icoon/design token indien van toepassing.
