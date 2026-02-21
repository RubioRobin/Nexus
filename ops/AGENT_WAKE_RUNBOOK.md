# AGENT WAKE RUNBOOK (INTERNAL)

Doel: elke agent weet exact wat te doen op heartbeat (“wekker”).

## Ruimtes + leads
- Directie → lead: `main` (Zeus)
- Codeurs → lead: `hephaistos`
- Intake-Sales → lead: `iris`
- Research-Innovatie → lead: `athena`
- QA-Release → lead: `themis`
- Regelgeving → lead: `socratis`

## Standaard heartbeat-protocol (alle agents)
1. Check nieuwe taken in je lane.
2. Update status van lopende taken (owner, next action, deadline).
3. Markeer blockers met impact en ETA.
4. Als blocker >4 uur of scope-impact: escaleren naar Zeus.
5. Als niets kritisch: alleen HEARTBEAT_OK.

## Rapportagemomenten (leads)
- 08:00 Plan van de dag
- 12:30 Status + blockers
- 19:30 Dagafsluiting + morgenplan

Leads rapporteren compact, decision-first, met expliciete GO/NO-GO waar nodig.
