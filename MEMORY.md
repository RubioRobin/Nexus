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
- Eerste set met 6 C#/WPF snippets ontvangen (ProgressWindow, ResultWindow, SelectionWindow, IfcSettingsWindow, NotificationWindow, AdminCommand).

2. **Decisions**
- Revit add-in UI moet aansluiten op de website-UI.
- Elke add-in moet een eigen Ribbon-knop krijgen.
- Voorkeur: Ribbon-knop met 32x32 icoon (icoon mag later worden toegevoegd).

3. **Ideas**
- Centrale XAML style library + component mapping naar website design-system, zodat UI consistent en sneller herbruikbaar is.

4. **Artifacts**
- Webchat bericht Robin, 2026-02-25 13:22 (Europe/Amsterdam).
- `ops/XAML_UI_REFERENCE_VH_IFC_QR_2026-02-25.md`

5. **Open actions**
- Owner Zeus/codeur: inkomende XAML-snippets structureren in een herbruikbare referentie-database voor Revit UI-implementaties.

## 2026-02-25 14:11 Huisstijl-handboek opdracht (Robin)
1. **Facts**
- Robin vroeg om een vast intern handboek voor add-in standaarden, met focus op visuele huisstijl (kleuren, rondingen, knoppen).
- Robin vroeg expliciet om eventueel skills aan te maken voor deze taak.

2. **Decisions**
- Handboek `ops/ADDIN_HUISSTIJL_HANDBOEK_V1.md` is leidend voor add-in UI uitvoering.
- Skill `skills/revit-ui-huisstijl/SKILL.md` is aangemaakt voor consistente toepassing.

3. **Ideas**
- Volgende stap: gedeelde XAML ResourceDictionary opzetten als technische implementatie van het handboek.

4. **Artifacts**
- `ops/ADDIN_HUISSTIJL_HANDBOEK_V1.md`
- `skills/revit-ui-huisstijl/SKILL.md`

5. **Open actions**
- Owner Zeus/codeur: handboekregels in komende add-ins hard afdwingen via review-checklist.

## 2026-02-25 14:12 Shared XAML style library
1. **Facts**
- Robin gaf GO om direct een gedeelde XAML style library op te zetten.
- Eerste library-bestanden zijn aangemaakt met tokens + controls + usage snippet.

2. **Decisions**
- Nieuwe add-ins starten vanaf `ui/revit-style/*` als visuele baseline.
- Bestaande add-ins worden gefaseerd naar deze library gemigreerd.

3. **Ideas**
- Volgende iteratie: icon style rules + DataGrid styles + status badge components toevoegen.

4. **Artifacts**
- `ui/revit-style/BrandTokens.xaml`
- `ui/revit-style/Controls.xaml`
- `ui/revit-style/USAGE_SNIPPET.xaml`
- Update in `ops/ADDIN_HUISSTIJL_HANDBOEK_V1.md`

5. **Open actions**
- Owner Zeus/codeur: library in eerstvolgende add-in concreet toepassen en visueel valideren met Robin.

## 2026-02-25 14:19 Technologiekeuze UI
1. **Facts**
- Robin gaf expliciet aan: add-ins moeten altijd als XAML worden gebouwd.

2. **Decisions**
- Standaard UI stack voor add-ins is WPF/XAML.
- WinForms wordt niet meer gebruikt voor nieuwe UI-implementaties.

3. **Ideas**
- Bestaande WinForms-schermen gefaseerd migreren naar XAML met gedeelde style library.

4. **Artifacts**
- Update `ops/ADDIN_HUISSTIJL_HANDBOEK_V1.md` (XAML-only regel).

5. **Open actions**
- Owner Zeus/codeur: Batch Sheet Renamer van WinForms naar WPF/XAML migreren.

## 2026-02-25 14:57 Batch Sheet Renamer XAML migratie
1. **Facts**
- Robin gaf opdracht om de add-in volledig om te bouwen naar WPF/XAML met huisstijl.
- UI is gemigreerd van WinForms naar WPF/XAML met house-style tokens/controls.

2. **Decisions**
- Batch Sheet Renamer gebruikt voortaan WPF (`UseWPF=true`) en geen WinForms.
- Project bevat lokale style dictionaries onder `Styles/` voor directe toepasbaarheid.

3. **Ideas**
- Volgende stap: style dictionaries centraliseren als linked shared resources voor alle add-ins.

4. **Artifacts**
- `projects/revit-batch-sheet-renamer-v1/src/BatchSheetRenamer/BatchSheetRenamerForm.xaml`
- `projects/revit-batch-sheet-renamer-v1/src/BatchSheetRenamer/BatchSheetRenamerForm.cs`
- `projects/revit-batch-sheet-renamer-v1/src/BatchSheetRenamer/Styles/BrandTokens.xaml`
- `projects/revit-batch-sheet-renamer-v1/src/BatchSheetRenamer/Styles/Controls.xaml`

5. **Open actions**
- Owner Robin/Zeus: Windows build + Revit runtime test bevestigen op testmachine.

## 2026-02-25 Website iteratie 2 (GO Robin)
1. **Facts**
- Robin gaf GO om website direct door te pakken.
- Website is verder aangescherpt op conversie + cases met KPI-taal.
- Intakeflow uitgebreid met Trello-kaarttekst generator en trace ID.

2. **Decisions**
- Intake blijft in v1 frontend-first (validatie + lokale opslag + tracking).
- v2 voegt backend endpoint toe voor directe Trello API write.

3. **Ideas**
- Cases verrijken met echte klantlogo’s + geverifieerde KPI’s.

4. **Artifacts**
- `projects/bedrijf-website/*.html` updates
- `projects/bedrijf-website/assets/script.js`
- `projects/bedrijf-website/assets/styles.css`
- `ops/WEB_INTAKE_PLATFORM_IMPLEMENTATION_V1.md`

5. **Open actions**
- Owner Zeus/codeur: v2 backend handoff implementeren naar gekozen backlogkanaal (geen Trello).

## 2026-02-25 Intake kanaalwijziging
1. **Facts**
- Robin gaf aan dat Trello niet meer gebruikt wordt.

2. **Decisions**
- Intakeflow verwijst niet meer naar Trello.
- Export is generieke intake-samenvatting; backend-koppeling wordt naar nieuw kanaal gezet.

3. **Ideas**
- Koppelen aan GitHub Issues of interne DB/API als standaard intake sink.

4. **Artifacts**
- `projects/bedrijf-website/contact.html`
- `projects/bedrijf-website/assets/script.js`
- `ops/WEB_INTAKE_PLATFORM_IMPLEMENTATION_V1.md`

5. **Open actions**
- Owner Robin/Zeus: doel-backlogkanaal kiezen voor v2 directe intake write.

## 2026-02-25 Intake-to-build verduidelijking (Robin)
1. **Facts**
- Robin verduidelijkte dat intake bedoeld is voor echte klanten en direct moet leiden tot add-in bouwopdracht.

2. **Decisions**
- Website intakeflow is aangepast naar directe build-opdracht generatie (geen lead-only flow).
- Intake bevat nu add-in type + Revit versie + optionele bestandenlink voor snellere start.

3. **Ideas**
- v3: centrale queue met directe toewijzing naar codeuragent (in plaats van localStorage).

4. **Artifacts**
- `projects/bedrijf-website/contact.html`
- `projects/bedrijf-website/assets/script.js`
- `ops/WEB_INTAKE_PLATFORM_IMPLEMENTATION_V1.md`

5. **Open actions**
- Owner Zeus/codeur: centrale backend queue + auto-assign implementeren na Robin GO.

## 2026-02-25 Intake-to-build V3
1. **Facts**
- Robin gaf GO voor V3.
- Centrale intake backend is toegevoegd met queue + auto-assign.

2. **Decisions**
- Intake stuurt direct naar centrale endpoint (`POST /api/intake`).
- Fallback naar localStorage blijft actief als backend offline is.

3. **Ideas**
- Volgende stap: queue naar database + Telegram push bij nieuwe intake.

4. **Artifacts**
- `projects/bedrijf-website/backend/server.js`
- `projects/bedrijf-website/backend/package.json`
- `projects/bedrijf-website/assets/script.js`
- `ops/WEB_INTAKE_PLATFORM_IMPLEMENTATION_V2.md`

5. **Open actions**
- Owner Zeus/codeur: productie-hardening (auth + database + notif integratie).

## 2026-02-25 Vercel auto-build setup
1. **Facts**
- Robin gaf opdracht om alles klaar te zetten voor automatische add-in instroom vanaf website.
- Vercel serverless API routes toegevoegd voor intake en build queue.

2. **Decisions**
- Intake schrijft centraal naar GitHub Issues (`intake`, `auto-build`, `revit-addon`).
- Frontend post standaard naar `/api` (Vercel-native) i.p.v. localhost backend.

3. **Ideas**
- Volgende stap: GitHub Action uitbreiden van kickoff naar echte codegen/build/artifact pipeline.

4. **Artifacts**
- `projects/bedrijf-website/api/intake.js`
- `projects/bedrijf-website/api/build-queue.js`
- `projects/bedrijf-website/vercel.json`
- `.github/workflows/auto-build.yml`
- `ops/VERCEL_INTAKE_AUTOBUILD_SETUP.md`

5. **Open actions**
- Owner Robin: Vercel env vars zetten (`GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO`, optioneel workflow vars).

## 2026-02-25 Auto-build v2 (GO Robin)
1. **Facts**
- Robin gaf GO op automatische build na intake.
- Workflow uitgebreid van kickoff naar template generatie + build + artifacts.

2. **Decisions**
- Intake API triggert standaard `auto-build.yml` workflow dispatch.
- Build levert `.dll` + `.addin` artifacts via GitHub Actions artifact upload.

3. **Ideas**
- Volgende stap: template vervangen door domeinspecifieke codegen per add-in type.

4. **Artifacts**
- `.github/workflows/auto-build.yml`
- `scripts/auto_build_from_issue.sh`
- `templates/revit-wpf-addon-template/*`
- `projects/bedrijf-website/api/intake.js`

5. **Open actions**
- Owner Zeus/codeur: codegen intelligentie verbeteren zodat output functioneel dichter op intake zit.

## 2026-02-25 GO-gate voor autobuild
1. **Facts**
- Robin wil vóór build altijd eerst Telegram GO/NO-GO.
- Robin wil automatische GitHub e-mail zoveel mogelijk uit.

2. **Decisions**
- Intake maakt issue met label `awaiting-go` (geen directe buildstart).
- Auto-build workflow start alleen bij label `go-build` of handmatige dispatch.
- Intake API stuurt Telegram melding (als env vars aanwezig) met instructie voor GO.

3. **Ideas**
- Later: GO/NO-GO direct via Telegram callback i.p.v. handmatig labelen in GitHub.

4. **Artifacts**
- `projects/bedrijf-website/api/intake.js`
- `.github/workflows/auto-build.yml`
- `projects/bedrijf-website/assets/script.js`

5. **Open actions**
- Owner Robin: in Vercel `TELEGRAM_BOT_TOKEN` en `TELEGRAM_CHAT_ID` zetten voor pre-build notificaties.

## 2026-02-25 Intake automatisering Robin (3 fases)
1. **Facts**
- Robin wil dat Athena bij intake onderzoek/context toevoegt.
- Robin wil house-style verplicht + eigen ribbon-knop met bedrijfsnaam (fallback Tool).
- Robin wil alle 3 fases tegelijk oppakken (intake -> GO gate -> build).

2. **Decisions**
- Intake-bericht markeert nu expliciet `Athena research: requested`.
- Build template maakt ribbon-knop via `IExternalApplication` met bedrijfsnaam/fallback.
- GO/NO-GO gate blijft leidend vóór buildstart.

3. **Ideas**
- GO/NO-GO straks volledig via Telegram callback i.p.v. handmatig labels.

4. **Artifacts**
- `templates/revit-wpf-addon-template/App.cs`
- `scripts/auto_build_from_issue.sh`
- `.github/workflows/auto-build.yml`
- `projects/bedrijf-website/api/intake.js`
- `ops/INTAKE_AUTOMATION_PHASES_V1.md`

5. **Open actions**
- Owner Zeus/codeur: Telegram callback GO->build trigger implementeren zonder GitHub tussenschakel.

## 2026-02-25 Website visual harmonisatie (Robin)
1. **Facts**
- Robin vroeg om website-look gelijk te trekken met Brood/VH referenties: geen pill-buttons, duidelijkere overzichten, sterkere visuele presentatie.
- Robin wilde klantvriendelijke UX zonder technische statusblokken.

2. **Decisions**
- Buttonstijl aangepast naar afgerond-vierkant (radius 10-14px) als standaard.
- Intake UI houdt alleen nette toasts; technische details blijven uit klantzicht.
- Homepage uitgebreid met duidelijk overzichtsblok + visuele KPI cards.

3. **Ideas**
- Volgende iteratie: echte projectfoto’s/screenshots per case toevoegen i.p.v. abstracte visual cards.

4. **Artifacts**
- `projects/bedrijf-website/index.html`
- `projects/bedrijf-website/assets/styles.css`
- `ops/UI_STYLE_REQUIREMENTS_V1.md`
- `ops/ADDIN_HUISSTIJL_HANDBOEK_V1.md`

5. **Open actions**
- Owner Robin/Zeus: shortlist van echte visuals/foto’s aanleveren voor homepage/case modules.

## 2026-02-25 Duidelijke add-in mappenstructuur (Robin)
1. **Facts**
- Robin vroeg om een duidelijke structuur voor inkomende aanvragen vanuit website/intake.
- BUILD-NX-MM29UCNL is bevestigd als eerste inkomende website-aanvraag.

2. **Decisions**
- Centrale add-in root: `addins/`.
- Splitsing verplicht in twee hoofdmappen: `addins/eigen-addins/` en `addins/ingekomen-addins/`.
- Inkomende aanvragen worden per jaar + intake-ID opgeslagen.

3. **Ideas**
- Volgende stap: automatische intake writer die direct een map onder `addins/ingekomen-addins/<jaar>/<intake-id>/` aanmaakt.

4. **Artifacts**
- `addins/README.md`
- `addins/eigen-addins/README.md`
- `addins/ingekomen-addins/2026/BUILD-NX-MM29UCNL/intake.md`
- `addins/ingekomen-addins/2026/BUILD-NX-MM29UCNL/status.md`

5. **Open actions**
- Owner Zeus/codeur: bestaande eigen add-ins gefaseerd verplaatsen naar `addins/eigen-addins/` met behoud van build-paden.

## 2026-02-25 Uitvoering add-in migratie (Robin)
1. **Facts**
- Robin gaf akkoord om de nieuwe add-in mappenstructuur direct ook operationeel toe te passen.
- Bestaande eigen add-ins zijn gekopieerd naar de nieuwe centrale mapstructuur.

2. **Decisions**
- `addins/eigen-addins/` is de actieve verzamelmap voor eigen add-ins.
- Huidige bronlocaties blijven voorlopig bestaan voor compatibiliteit; migratie gebeurt gefaseerd.

3. **Ideas**
- Volgende stap: build scripts laten wijzen naar de paden onder `addins/eigen-addins/`.

4. **Artifacts**
- `addins/eigen-addins/revit-batch-sheet-renamer-v1/`
- `addins/eigen-addins/revit-views-sheets-generator/`
- `addins/eigen-addins/VH_addin/`
- `addins/README.md`

5. **Open actions**
- Owner Zeus/codeur: build- en releasepaden standaardiseren op `addins/eigen-addins/*`.

## 2026-02-25 Uitvoering + voortgang Batch Sheet Renamer (Robin)
1. **Facts**
- Robin gaf opdracht om de nieuwe structuur direct uit te voeren en tegelijk door te pakken op de add-in.
- Oude paden zijn opgeruimd uit de actieve root en vervangen door compatibiliteits-symlinks.
- Batch Sheet Renamer is opnieuw gebouwd vanuit `addins/eigen-addins/revit-batch-sheet-renamer-v1`.

2. **Decisions**
- Actieve bronlocatie voor Batch Sheet Renamer is nu `addins/eigen-addins/revit-batch-sheet-renamer-v1`.
- Inkomende intake `BUILD-NX-MM29UCNL` is bijgewerkt naar build geslaagd en klaar voor QA/Revit runtime test.

3. **Ideas**
- Volgende stap: QA-gate draaien op Windows/Revit testmachine met vaste checklist en screenshot-bewijs.

4. **Artifacts**
- `addins/eigen-addins/revit-batch-sheet-renamer-v1/README.md`
- `addins/eigen-addins/revit-batch-sheet-renamer-v1/artifacts/BatchSheetRenamer.dll`
- `addins/ingekomen-addins/2026/BUILD-NX-MM29UCNL/status.md`

5. **Open actions**
- Owner Robin/QA: runtime-validatie in Revit 2025 en GO/NO-GO terugkoppeling in Directie.

