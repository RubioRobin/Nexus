# QA Checklist — Batch Sheet Renamer v1 (Revit 2025)

## Doel
Valideren dat de add-in correct laadt en veilig bulk-hernoemen uitvoert.

## Install
1. Kopieer `BatchSheetRenamer.dll` en `BatchSheetRenamer.addin` naar:
   `%AppData%\Autodesk\Revit\Addins\2025\`
2. Start Revit 2025 opnieuw.

## Smoke test
- [ ] Ribbon/command zichtbaar: **Batch Sheet Renamer**
- [ ] Command opent zonder foutmelding
- [ ] Lijst toont sheets uit actief model

## Functionele test
- [ ] Prefix werkt (bv. `A-`)
- [ ] Suffix werkt (bv. `-REV1`)
- [ ] Find/Replace werkt
- [ ] Preview toont correcte nieuwe namen
- [ ] Deselectie van sheets wordt gerespecteerd
- [ ] Apply hernoemt alleen geselecteerde sheets

## Negatieve test
- [ ] Lege selectie geeft nette melding
- [ ] Geen crash bij lege find/replace velden

## Acceptatiecriteria (GO)
- [ ] Geen blocking fouten in runtime
- [ ] Verwacht hernoemresultaat bevestigd
- [ ] Gebruiker kan workflow zelfstandig herhalen

## Bewijs
- [ ] Screenshot command geopend
- [ ] Screenshot preview vóór apply
- [ ] Screenshot resultaat na apply
