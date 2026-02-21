---
name: intake-triage
description: Triage new business intake into clear scope, acceptance criteria, risk level, and effort estimate. Use when a new Revit/web automation request arrives from Telegram or Trello and needs to be converted into an actionable build card.
---

Convert raw intake into a build-ready brief.

Steps:
1. Extract problem, expected outcome, constraints, and deadline.
2. Produce acceptance criteria (testable bullets).
3. Classify: revit-addin | web-platform | infra | research.
4. Assign owner agent and model mode (local/cloud).
5. Output a GO/NO-GO recommendation for Zeus.

Output format:
- Scope summary
- Acceptance criteria
- Risks/dependencies
- Proposed owner + ETA
- GO/NO-GO recommendation