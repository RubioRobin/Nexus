# Intake Automation Phases (Zeus)

## Fase 1 — Intake + Athena context
- Klant submit op website.
- Intake API stuurt direct Telegram-notificatie met intake-details.
- Bericht bevat `Athena research: requested` zodat intake eerst verrijkt kan worden.

## Fase 2 — GO/NO-GO gate (Robin)
- Intake blijft op `awaiting GO`.
- Geen auto-build zonder expliciete Robin GO.
- Doelroute: intake-agent -> Zeus -> Robin beslismoment.

## Fase 3 — Build uitvoering
- Na GO start buildflow.
- Build default eisen:
  - WPF/XAML huisstijl
  - eigen Ribbon-knop
  - knopnaam = bedrijfsnaam uit intake, fallback `Tool`
  - artifacts: `.dll + .addin`

## Opmerking
- Huidige testflow draait intake primair via Telegram-gate.
- Auto-build pipeline kan parallel gebruikt worden voor gecontroleerde test-runs.
