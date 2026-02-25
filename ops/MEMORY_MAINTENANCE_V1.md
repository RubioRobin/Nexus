# Memory Maintenance V1

Doel: MEMORY.md altijd actueel houden voor Zeus + agents.

## Standaardmomenten
- 08:05 na morning brief
- 12:35 na midday status
- 19:35 na day summary

## Verplichte updateblokken
1. Facts
2. Decisions
3. Ideas
4. Artifacts
5. Open actions

## Trigger-events (direct updaten)
- Nieuwe pipeline-regel of governance-besluit
- Nieuwe API/flow/automation die live gaat
- Wijziging in Telegram routing/agent roster/cron
- Release-ready artifacts of QA gates

## Controle
- Cron schrijft checkpoint naar `logs/cron/memory_checkpoint.log`.
- Bij belangrijke wijzigingen: MEMORY.md meteen bijwerken + commit.
