# OPERATING PLAYBOOK V1 — Robin x Zeus

Status: Active (drafted from 100-vragen traject)
Updated: 2026-02-25
Owner: Robin (final decisions) / Zeus (execution)

## 1) Strategic Direction
- 90-day goal: end-to-end Revit add-ins + webapps with minimal manual input.
- Primary KPI direction: maximize ready-to-use Revit add-ins inventory.
- 30-day focus:
  1. Automation (agents work autonomously)
  2. Business foundation (website, email, intake)
  3. Security + token safety
- Target customers: smaller BIM/Revit firms without in-house developers.

## 2) Product Portfolio (V1)
### Revit Add-ins (first catalog)
1. Select All In View
2. Batch View Renamer
3. Auto Section Box on selected element

### Web Apps (first catalog)
1. Intake portal
2. Dashboard
3. QA portal

### Commercial model
- Offering model: Hybrid (productized + custom)
- Pricing: combined model
- Product library on website: yes, immediate
- Throughput target: 6–10 products/month (phase 1)
- Intake-to-testable MVP target: 2–3 days

## 3) Operating Model
- Core principle: operate like a real company with information flow.
- Communication flow:
  - Zeus → agents (direction/priorities)
  - Agents → Zeus (status/findings/blockers)
  - Agents ↔ agents (cross-lane collaboration)
- Every meaningful finding must be shared with impacted teams.

## 4) Agent Governance
- Fixed core agents:
  - Zeus/main (orchestration, GO/NO-GO)
  - Athena (research)
  - Hephaistos (build)
  - Themis (QA)
  - Chronos (planning)
- Max autonomy per run: 3 concrete steps
- Run timebox: 30 minutes
- Repeat-failure rule: 2x same error => auto-pause + escalate
- Scope doubt rule: always stop and ask

## 5) Cadence & Reporting
- Fixed updates: 08:00 / 12:30 / 19:30
- Micro-updates: hourly
- Escalation to Robin allowed for:
  - critical blockers
  - scope changes
  - high-impact opportunities
- Update style: medium by default, long when complex
- Tone: Dutch, clear, light, not overly technical
- Always include in updates:
  - what was done
  - blockers
  - GO/NO-GO need

## 6) Quality & Definition of Done
- Quality posture: premium quality
- Daily KPI set:
  - blockers
  - QA pass rate
  - testable product yes/no
  - token health
- Done criteria (task): QA pass + Robin approval
- QA policy: strict by default, but with controlled MVP path to avoid paralysis
- Research usefulness threshold: 2+ sources and preferably implementation proposal
- Evening delivery expectation: testable candidate for Robin (especially for Revit add-ins)

## 7) Discord Role (Operational Source of Truth)
- Discord is the operational overview (not long execution commentary).
- Standard flow (via channels/threads + status tags):
  - Intake → Ready GO/NO-GO → Build → QA → Ready Release → Done
- Planning agent updates status after Robin GO.
- Every task/thread must have an owner.
- Max open tasks per agent: 2 (default)
- Stale update rule: if no update for 6h => escalate to Directie
- Discord hygiene checks: 3x/day

## 8) Platforms, Security, Tokens
- Command center: Discord-first, Telegram secondary (hybrid)
- Secrets: password manager + host injection
- Token policy:
  - warning below 40%
  - protective actions below 20%
- Rate-limit handling: backoff + queue (for now)
- Model routing: fixed per task type
- Logging/privacy: privacy-first strict
- Backups: 2x/day + extra snapshot on major changes
- Incident mode:
  - all pause on incident
  - Zeus can trigger incident mode and must notify immediately
- Security always wins over speed
- Red-lines list required (to be maintained by Zeus proposals + Robin approval)

## 9) Growth & Roadmap
- 6-month growth focus: productized add-ins first
- First scale target: all tracks in parallel, with priority to Revit value lanes
- Funnel preference: Website -> Intake -> Discord (single command center)
- Roadmap style: rolling 2-week sprints
- Success proof priority: autonomous system behavior + delivery consistency
- Playbook governance: Zeus maintains, Robin weekly review + feedback loop

## 10) Weekly Improvement Loop
- Weekly feedback moment required:
  - what went well
  - what blocked
  - where value/profit can be improved
- HR/governance support agent should run this loop and provide recommendations.

## 11) Discord Execution Blueprint (approved 2026-02-25)
- Decision owner: Robin (approved Discord-only execution model).
- System owner: Zeus (design, governance, and operational rollout).
- Trello usage: discontinued for operations.

### Server structure (minimum viable)
- 00-directie
  - #directie-go-nogo
  - #directie-prioriteiten
- 10-operations
  - #intake
  - #planning
  - #build
  - #qa
  - #ready-release
  - #done-log
  - #blockers-critical
- 20-reports
  - #report-0800
  - #report-1230
  - #report-1930

### Operating rules
- Every task lives in exactly one thread with one explicit owner.
- Mandatory status format per update: Done / Next / Blocker / GO-NO-GO need.
- Stale rule: no update for 6h => escalate to #blockers-critical.
- Completion gate remains: QA pass + Robin approval before Done.

### Rollout order (max-3-step enforcement)
1. Provision channel taxonomy + permissions.
2. Pin templates + communication SOP in relevant channels.
3. Run one full cycle (intake -> build -> QA -> release) and tune.

---

## Open Clarifications (next sync)
1. Exact model fallback matrix for rate limits (per lane).
2. Definition of "testable candidate" per product type (Revit vs web).
