# Add-ins structuur

Deze map is de centrale structuur voor add-ins.

## Mappen

- `eigen-addins/` → interne / eigen add-ins (ontwikkeld door ons team)
- `ingekomen-addins/` → inkomende aanvragen vanuit website of andere intake-kanalen

## Conventie inkomende aanvraag

Per intake een eigen map:

`ingekomen-addins/<JAAR>/<INTAKE_ID>/`

Voorbeeld:

`ingekomen-addins/2026/BUILD-NX-MM29UCNL/`

Minimale bestanden per intake:
- `intake.md` (samenvatting aanvraag)
- `status.md` (pipeline status + owner)
- eventuele bijlagen (`attachments/`)

## Conventie eigen add-ins

Per add-in een eigen map:

`eigen-addins/<addon-naam>/`

Aanbevolen inhoud:
- `src/`
- `artifacts/` (`.dll` + `.addin`)
- `README.md`
