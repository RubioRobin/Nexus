#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const root = '/home/rubiorobin/.openclaw/workspace';
const intakeYearDir = path.join(root, 'addins/ingekomen-addins/2026');
const stateFile = path.join(root, 'ops/state/auto_started_builds.json');

const token = process.env.TELEGRAM_BOT_TOKEN || '';
const codeursChatId = (process.env.TELEGRAM_CODEURS_CHAT_ID || '-1003826367901').trim();
const releaseChatId = (process.env.TELEGRAM_RELEASE_CHAT_ID || '-1003543098532').trim();

const send = async (chatId, text) => {
  if (!token || !chatId) return;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text })
  }).catch(() => {});
};

const loadState = () => {
  try { return JSON.parse(fs.readFileSync(stateFile, 'utf8')); }
  catch { return { processed: {} }; }
};
const saveState = (s) => fs.writeFileSync(stateFile, JSON.stringify(s, null, 2));

const hasArtifacts = (buildId) => {
  const dir = path.join(root, 'projects/intake-builds', buildId, 'artifacts');
  return fs.existsSync(path.join(dir, `${buildId}.dll`)) && fs.existsSync(path.join(dir, `${buildId}.addin`));
};

const parseBuildId = (text) => {
  const m = text.match(/Linkt aan build:\s*(BUILD-[A-Za-z0-9_-]+)/i);
  return m ? m[1] : null;
};

const run = async () => {
  if (!fs.existsSync(intakeYearDir)) return;

  const state = loadState();
  const dirs = fs.readdirSync(intakeYearDir).map(d => path.join(intakeYearDir, d)).filter(p => fs.statSync(p).isDirectory());

  for (const dir of dirs) {
    const statusPath = path.join(dir, 'status.md');
    if (!fs.existsSync(statusPath)) continue;

    const text = fs.readFileSync(statusPath, 'utf8');
    if (!/Huidige status:\s*Build gestart/i.test(text)) continue;

    const buildId = parseBuildId(text) || path.basename(dir).replace(/^TEST-/, 'BUILD-TEST-');
    if (!buildId) continue;

    if (hasArtifacts(buildId)) {
      state.processed[buildId] = true;
      continue;
    }

    if (state.processed[buildId]) continue;

    const r = spawnSync('/usr/bin/node', ['scripts/orchestrate_go_build.mjs', buildId], {
      cwd: root,
      encoding: 'utf8'
    });

    if (r.status !== 0) {
      await send(codeursChatId, `⚠️ Auto-start build mislukt voor ${buildId}. Check Pi logs.`);
      continue;
    }

    let out = {};
    try { out = JSON.parse((r.stdout || '').trim()); } catch {}

    const releaseUrl = out?.release?.url || 'n.v.t.';
    const startMsg = `🛠️ Codeurs gestart voor ${buildId}.\nBuild draait op Pi.`;
    const productMsg = `📦 Product gereed voor ${buildId}.\nArtifacts: ${out?.artifactDir || 'onbekend'}\nRelease: ${releaseUrl}`;

    await send(codeursChatId, startMsg);
    await send(releaseChatId, productMsg);

    state.processed[buildId] = true;
  }

  saveState(state);
};

await run();
console.log('auto-start: scan complete');
