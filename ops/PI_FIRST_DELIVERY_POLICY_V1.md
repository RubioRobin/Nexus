# PI-First Delivery Policy V1

Datum: 2026-02-25
Owner: Zeus
Requester: Robin

## Doel
Alles operationeel op de Pi draaien. GitHub alleen voor:
1. Website code
2. Backup van eindproducten
3. Backup van intake-omschrijvingen

## Hard rules
- Geen GitHub als GO/NO-GO triggerlaag.
- Telegram GO (`GO <id>`) start direct Zeus-orchestratie.
- Intake state, build state, rules en memory blijven lokaal op de Pi.
- Add-in build en packaging draaien lokaal op de Pi.

## Lokale bron van waarheid (Pi)
- Pipeline state: `ops/state/pipeline_state.json`
- Memory: `MEMORY.md` + `memory/*`
- Intake dossiers: `addins/ingekomen-addins/<jaar>/<BUILD-ID>/`
- Build output: `addins/eigen-addins/*/artifacts` of intake artifacts map

## GitHub role (backup-only)
- Website wijzigingen blijven pushen.
- Intake backup: alleen `intake.md` / `status.md` snapshots.
- Eindproducten backup: alleen release artifacts (`.dll`, `.addin`, optioneel zip/installers).

## Operationele flow
1. Website intake komt binnen (Telegram melding + lokale intake dossiervorming op Pi).
2. Robin beslist in Telegram: `GO <id>` / `NO-GO <id>`.
3. Zeus verwerkt beslissing lokaal en stuurt agents direct aan.
4. Build/QA/package op Pi.
5. Backup naar GitHub van website + intake-omschrijving + eindproducten.

## Niet toegestaan
- Buildstart via GitHub label/workflow als primaire route.
- Besluitvorming buiten Telegram voor intake-build start.

## Open technische actie
- Directe koppeling `decision_ingest -> build_orchestrator` afronden zodat GO meteen buildstatus naar `InDevelopment` zet en artifact-pad reserveert.
