# Revit Add-in Pipelines V1 (Dual-Track)

Datum: 2026-02-25
Owner: Zeus
Reviewer: Robin

## Doel
Twee parallelle productielijnen draaien continu:
1. **Eigen Ontwikkeling Pipeline** (proactief, marktgedreven)
2. **Client Intake Pipeline** (reactief, klantgedreven)

Alle major updates lopen via **Telegram**. GitHub wordt alleen gebruikt voor website + add-in code/artifacts.

---

## Pipeline A — Eigen Ontwikkeling (Athena + Zeus)

## Fase A1: Dagelijks Onderzoek (Athena)
- Bronnen: forums, Reddit, Autodesk, GitHub issues, blogs, LinkedIn.
- Output in gestandaardiseerd schema: `AddinCandidate`.
- Clustering op thema + impact.

## Fase A2: Prioritering (Zeus)
- Athena-output -> shortlist “Vandaag bouwen”.
- Zeus geeft voorstel met score + risico + effort.
- Robin geeft alleen GO/NO-GO op kandidaatniveau.

## Fase A3: Auto Delivery
Na GO volledig automatisch:
- PRD draft
- Tech Spec draft
- Scaffold vanuit template
- Build + tests + style checks
- Packaging (.dll + .addin, optioneel installer)
- QA gate
- Klaar voor Robin review

---

## Pipeline B — Client Intake

## Fase B1: Intake
- Website intake -> Telegram intakebericht.
- Status: `AwaitingDecision`.

## Fase B2: Besluit
- Robin GO/NO-GO op intake-task.
- Bij GO automatische bouwpipeline starten.

## Fase B3: Auto Delivery
Zelfde technische flow als pipeline A, maar met klantspecifieke requirements.

---

## Telegram Ritme (verplicht)

1. **08:00 Brief**
- Overzicht kandidaten voor vandaag
- Aanbevolen builds + GO/NO-GO lijst
- Intake-overzicht openstaand

2. **12:30 Status**
- Voortgang per actieve build
- Blokkades + ETA

3. **19:30 Samenvatting**
- Wat gestart/afgerond/mislukt is
- QA status
- Klaar voor review items

4. **Tussendoor direct melden**
- Build klaar
- QA klaar
- Packaging klaar
- Fout/blokkade

---

## Statusmodel (uniform)
Proposed -> Reviewed -> AwaitingDecision -> Go -> SpecReady -> InDevelopment -> InQA -> ReadyForRelease -> Released -> Feedback -> Iterating

---

## AddinCandidate Schema (Zeus/Athena leesbaar)
```json
{
  "id": "AC-2026-02-25-001",
  "sourceType": "forum|github|linkedin|blog|intake",
  "date": "2026-02-25",
  "problem": "...",
  "context": "...",
  "discipline": "Architecture|MEP|Structure|General",
  "impactScore": 0,
  "confidenceScore": 0,
  "marketValue": "low|medium|high",
  "solutionType": "revit_addin|dynamo|ai_workflow|standalone",
  "userStories": ["..."],
  "functionalRequirements": ["..."],
  "nonGoals": ["..."],
  "risks": ["..."],
  "techFeasibility": "low|medium|high",
  "status": "Proposed"
}
```

---

## GO-Delegatie (voorstel)
Zeus mag automatisch GO geven als ALLE criteria waar zijn:
- impactScore >= 70
- confidenceScore >= 70
- techFeasibility = high
- effort <= M (1-3 dagen)
- risico niet “hoog”
- geen licentie/security conflict

Anders: altijd Robin GO nodig.

---

## Kwaliteitsgates (hard fail)
1. Build succes (0 errors / 0 warnings)
2. Unit + integration tests pass
3. Style compliance pass (huisstijl + XAML/WPF)
4. Performance smoke pass

---

## Revit versiebeleid
- Nu: **alleen Revit 2025** actief testen/releasen.
- Roadmap matrix: 2023/2024/2025/2026.

---

## Packaging beleid
- Verplicht: `.dll` + `.addin`
- Optioneel: installer (indien snel haalbaar)
- Altijd installatie-instructie + rollback-notitie

---

## Design policy
- Vormtaal referentie: `VH_addin` + `VH_IFC_Viewer`
- Kleuren: huidige Nexus website palette
- UI standaard: WPF/XAML
- Ribbon: eigen knop, bedrijfsnaam of fallback `Tool`

---

## Volgende implementatiestappen
1. Athena research job + schema-opslag automatiseren.
2. Telegram GO/NO-GO command parser voor beide pipelines.
3. Centrale state store voor beide pipelines (zonder GitHub-afhankelijkheid).
4. Auto build trigger direct vanuit Telegram GO.
5. QA + packaging automation afronden.

## Implementatie gestart (v1 foundation)
- Schema: `ops/schemas/AddinCandidate.schema.json`
- Centrale state: `ops/state/pipeline_state.json`
- CLI state beheer: `scripts/pipeline_state_cli.mjs`
- Telegram command parser: `scripts/telegram_decision_parser.mjs`
- 08:00 brief generator: `scripts/generate_0800_brief.mjs`
