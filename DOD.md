# DOD.md — Definition of Done

A task is only DONE when all are true:

1. Build succeeds without blocking errors.
2. Required checks pass (smoke/tests/lint where applicable).
3. Deliverables are complete:
   - Revit: `.dll` + `.addin`
   - Web: runnable package/deployable output
4. Install/run instructions are documented.
5. Changelog updated.
6. Known limitations listed.
7. Themis QA gate passes.
8. Zeus release note + test request sent to Robin.
