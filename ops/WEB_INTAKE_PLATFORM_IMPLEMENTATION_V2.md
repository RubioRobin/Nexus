# Web Intake Platform — Implementatie V3 (centrale queue)

Datum: 2026-02-25
Owner: Zeus

## Wat is gebouwd

- Frontend intake (`projects/bedrijf-website/contact.html`) maakt direct build-task payload.
- Frontend verstuurt payload naar centrale endpoint: `POST /api/intake`.
- Backend toegevoegd: `projects/bedrijf-website/backend/server.js` (Express).
- Centrale queue-opslag: `projects/bedrijf-website/backend/data/build-queue.json`.
- Auto-assign op basis van add-in type (sheet/export/qa/parameters/general).
- Fallback: als backend niet bereikbaar is, task gaat lokaal in `nexus_build_queue`.

## Backend endpoints

- `GET /health`
- `GET /api/build-queue`
- `POST /api/intake`
- `POST /api/build-queue/:taskId/start`

## Runbook

```bash
cd projects/bedrijf-website/backend
npm install
npm start
```

Standaard draait backend op `http://localhost:8787`.

Frontend leest endpoint uit:
- `window.NEXUS_INTAKE_API_BASE` (optioneel)
- default: `http://localhost:8787`

## Security/next steps

- Voeg API key of signed webhook toe voor productie.
- Verplaats queue van JSON-file naar database.
- Koppel queue events aan Telegram-notificaties voor directie.
