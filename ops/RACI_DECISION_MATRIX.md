# RACI_DECISION_MATRIX.md

## Legend
- **R** = Responsible (uitvoer)
- **A** = Accountable (eindverantwoordelijk)
- **C** = Consulted
- **I** = Informed

## Core decision matrix

| Decision / Proces | Robin | Zeus (main) | Metis | Themis | Oracle | Delivery Agent(s) |
|---|---|---|---|---|---|---|
| GO / NO-GO dagbesluit | A | R | C | C | C | I |
| Prioriteit van dagplanning | A | R | C | C | C | I |
| Scope definitie nieuwe intake | I | A | C | C | R | C |
| Architectuurkeuze (hoog impact) | I | A | C | C | C | R |
| Model-routing local vs cloud | I | A | R | C | C | I |
| Start build op intake | I | A | I | C | C | R |
| QA pass/fail release gate | I | A | I | R | C | C |
| Release naar Robin voor test | I | A | I | R | C | R |
| Security/risico escalatie | I | A | C | R | C | I |
| Skill-portfolio uitbreiding | I | A | R | C | C | I |
| Infra incident response | I | A | C | C | I | R (Hades/Triton) |
| Trello workflow wijzigingen | I | A | R | C | C | I |

## Escalation rules
1. Agent blocker > 60 min -> escaleren naar lane lead.
2. Lane blocker > 2 uur -> escaleren naar Zeus.
3. Beslissing met product/scope impact -> Oracle + Zeus.
4. Kwaliteit/security twijfel -> Themis veto tot opgelost.
5. Alleen Robin kan finale GO/NO-GO geven via Telegram.

## Hard boundaries
- Geen ongevraagde externe outreach door agents.
- Geen release zonder QA-gate (Themis) + Zeus akkoord.
- Trello is operationeel; Telegram is beslisbron voor GO/NO-GO.
