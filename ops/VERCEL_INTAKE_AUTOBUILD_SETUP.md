# Vercel Setup — Intake -> Auto Build Queue

## 1) Root directory
In Vercel project settings:
- Root Directory: `projects/bedrijf-website`

## 2) Environment variables (required)
Set in Vercel -> Project -> Settings -> Environment Variables:
- `GITHUB_TOKEN` = PAT met minimaal repo issue write rechten
- `GITHUB_OWNER` = `RubioRobin`
- `GITHUB_REPO` = `Nexus`

Optional:
- `AUTO_BUILD_WORKFLOW_FILE` = bv `auto-build.yml`
- `AUTO_BUILD_REF` = `master`

## 3) Wat gebeurt er na intake
1. Klant verstuurt intake op `/contact`
2. Frontend maakt build-task payload
3. API route `/api/intake` maakt GitHub Issue met labels:
   - `intake`
   - `auto-build`
   - `revit-addon`
4. (Optioneel) workflow dispatch start automatische build-pipeline

## 4) Queue bekijken
- `GET /api/build-queue`
Toont open intake/auto-build issues in GitHub.

## 5) Belangrijk
Dit levert een automatische intake->build taakstroom op.
Het volledig autonoom genereren van perfecte add-ins blijft afhankelijk van de build-agent/workflow (codegen, compile, QA gate, artifacts).
