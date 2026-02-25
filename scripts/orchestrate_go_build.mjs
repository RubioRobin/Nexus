#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const root = '/home/rubiorobin/.openclaw/workspace';
const addinsRoot = path.join(root, 'addins/ingekomen-addins/2026');

const id = (process.argv[2] || '').trim();
if (!id) {
  console.log(JSON.stringify({ ok: false, error: 'missing_id' }));
  process.exit(1);
}

const traceId = `NX-LOCAL-${Date.now()}`;

function resolveBuildTask(inputId) {
  if (inputId.toUpperCase().startsWith('BUILD-')) return inputId;

  const statusPath = path.join(addinsRoot, inputId, 'status.md');
  if (fs.existsSync(statusPath)) {
    const text = fs.readFileSync(statusPath, 'utf8');
    const m = text.match(/Linkt aan build:\s*(BUILD-[A-Za-z0-9_-]+)/i);
    if (m) return m[1];
  }

  return `BUILD-${inputId}`;
}

function ensureIntakeStatus(inputId, buildTaskId) {
  const dir = path.join(addinsRoot, inputId);
  fs.mkdirSync(dir, { recursive: true });

  const intakePath = path.join(dir, 'intake.md');
  if (!fs.existsSync(intakePath)) {
    fs.writeFileSync(intakePath, `# Intake: ${inputId}\n\n- Bron: Telegram GO\n- Intake-ID: ${inputId}\n- Datum: ${new Date().toISOString().slice(0,10)}\n- Status: GO ontvangen\n\n## Doel\nLokale build-orchestratie op Pi gestart.\n`);
  }

  const statusPath = path.join(dir, 'status.md');
  const status = [
    `# Status - ${inputId}`,
    '',
    '- Pipeline: Intake -> Build -> QA -> Directie GO/NO-GO',
    '- Huidige status: Build gestart (Pi local)',
    '- Owner: Zeus/build',
    `- Linkt aan build: ${buildTaskId}`,
    '',
    '## Build artifacts',
    `- Verwacht pad: projects/intake-builds/${buildTaskId}/artifacts/`
  ].join('\n');
  fs.writeFileSync(statusPath, status);

  return statusPath;
}

const buildTaskId = resolveBuildTask(id);
ensureIntakeStatus(id, buildTaskId);

const cmd = path.join(root, 'scripts/auto_build_from_issue.sh');
const run = spawnSync(cmd, ['0', buildTaskId, traceId, 'Tool'], {
  cwd: root,
  encoding: 'utf8'
});

const artifactDir = path.join(root, 'projects/intake-builds', buildTaskId, 'artifacts');

if (run.status !== 0) {
  console.log(JSON.stringify({
    ok: false,
    id,
    buildTaskId,
    traceId,
    error: 'build_failed',
    stderr: (run.stderr || '').slice(-3000)
  }));
  process.exit(2);
}

const files = fs.existsSync(artifactDir)
  ? fs.readdirSync(artifactDir).map(f => path.join(artifactDir, f))
  : [];

let release = { ok: false, url: null, tag: null, error: null };
if (files.length) {
  const tag = `${buildTaskId}-${Date.now()}`;
  const title = `${buildTaskId} artifacts`;
  const notes = `Auto release vanaf Pi\n\nIntake: ${id}\nTrace: ${traceId}`;

  const rel = spawnSync('gh', ['release', 'create', tag, ...files, '-t', title, '-n', notes], {
    cwd: root,
    encoding: 'utf8'
  });

  if (rel.status === 0) {
    const out = (rel.stdout || '').trim();
    const url = out.split('\n').find(x => x.startsWith('http')) || null;
    release = { ok: true, url, tag, error: null };
  } else {
    release = { ok: false, url: null, tag, error: (rel.stderr || rel.stdout || '').slice(-2000) };
  }
}

console.log(JSON.stringify({
  ok: true,
  id,
  buildTaskId,
  traceId,
  artifactDir,
  release
}));
