---
name: qa-release-gate
description: Enforce quality gates before release and validate Definition of Done for add-ins/web deliverables. Use before any handoff to Robin or moving a task to Ready to Release.
---

Run strict pre-release QA.

Checks:
1. Acceptance criteria coverage
2. Build/package integrity
3. Regression and risk review
4. Documentation completeness
5. Clear pass/fail verdict with fixes

Output format:
- PASS or FAIL
- Blocking findings
- Required fixes
- Release recommendation