# Website Intake -> Add-in Factory V1

## Besluiten (Robin)
- Twee pipelines blijven parallel (intern + client).
- Website-intakes krijgen **ClientProject-first routing**.
- Robin blijft altijd beslisser voor GO/NO-GO.
- Updates en major statusmomenten via Telegram.
- Feedback-form direct toegevoegd.

## Kwalificatie defaults (Zeus)
- `NeedsInfo` als verplichte intake-elementen ontbreken.
- Anders `Qualified`.
- Scope-indeling op effort:
  - S -> SLA-band 1-2 werkdagen
  - M -> SLA-band 3-5 werkdagen
  - L -> SLA-band 1-2 weken
- Risk: high als triage tekst “hoog” bevat, anders medium.

## Website track states
`NewSubmission -> NeedsInfo|Qualified -> Routed(ClientProject) -> AwaitingDecision -> Go -> SpecReady -> InDevelopment -> InQA -> ReadyForRelease -> Released -> Feedback -> Iterating`

## Endpoints
- `POST /api/intake` -> stuurt Telegram intake + kwalificatie + GO-gate
- `POST /api/feedback` -> stuurt feedback naar Telegram
- `GET /api/build-queue` -> statusmessage (telegram-gated mode)

## Hardening (v1)
- Origin allowlist optioneel via `ALLOWED_ORIGINS`.
- Basic rate limiting (in-memory, request window) op intake endpoint.
- Honeypot + minimale invultijd controle (`websiteTrap`, `startedAt`).

## Telegram output
Per intake:
- Athena research requested
- route, scope, risk, SLA-band
- missing info (indien aanwezig)
- expliciete GO/NO-GO reminder
