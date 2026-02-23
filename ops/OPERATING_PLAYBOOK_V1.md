# OPERATING PLAYBOOK V1 — Robin x Zeus

Status: Active (drafted from 100-vragen traject)
Updated: 2026-02-23
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

## 7) Trello Role
- Trello is for operational overview (not long execution commentary).
- Standard flow:
  - Intake → Ready GO/NO-GO → Build → QA → Ready Release → Done
- Planning agent updates board after Robin GO.
- Every card must have an owner.
- Max open tasks per agent: 2 (default)
- Stale update rule: if no update for 6h => escalate to Directie
- Trello hygiene checks: 3x/day

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
- Funnel preference: Website -> Intake -> Trello, with Discord bridge between intake and Trello
- Roadmap style: rolling 2-week sprints
- Success proof priority: autonomous system behavior + delivery consistency
- Playbook governance: Zeus maintains, Robin weekly review + feedback loop

## 10) Weekly Improvement Loop
- Weekly feedback moment required:
  - what went well
  - what blocked
  - where value/profit can be improved
- HR/governance support agent should run this loop and provide recommendations.

---

## Open Clarifications (next sync)
1. Exact model fallback matrix for rate limits (per lane).
2. Discord channel taxonomy mapping to current Telegram/Trello lanes.
3. Definition of "testable candidate" per product type (Revit vs web).
