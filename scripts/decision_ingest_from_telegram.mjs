#!/usr/bin/env node
import fs from 'fs';
import { spawnSync } from 'child_process';

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error('Missing TELEGRAM_BOT_TOKEN');
  process.exit(2);
}

const allowRaw = process.env.TELEGRAM_ALLOWED_CHAT_IDS || '';
const allow = new Set(allowRaw.split(',').map(s => s.trim()).filter(Boolean));

const statePath = '/home/rubiorobin/.openclaw/workspace/ops/state/pipeline_state.json';
const offPath = '/home/rubiorobin/.openclaw/workspace/ops/state/telegram_offset.json';

const readOffset = () => {
  try { return JSON.parse(fs.readFileSync(offPath, 'utf8')).offset || 0; } catch { return 0; }
};
const writeOffset = (offset) => fs.writeFileSync(offPath, JSON.stringify({ offset, updatedAt: new Date().toISOString() }, null, 2));

const parseDecision = (text='') => {
  const m = text.trim().match(/^(GO|NO-GO|NOGO)\s+([A-Za-z0-9_-]+)$/i);
  if (!m) return null;
  return { action: m[1].toUpperCase() === 'GO' ? 'Go' : 'NoGo', id: m[2] };
};

const applyDecision = (id, action) => {
  const s = JSON.parse(fs.readFileSync(statePath, 'utf8'));
  const now = new Date().toISOString();
  const c = s.candidates.find(x => x.id === id);

  if (c) {
    c.status = action;
    c.updatedAt = now;
    c.decisionAt = now;
  } else {
    s.candidates.push({ id, status: action, decisionAt: now, updatedAt: now, source: 'telegram' });
  }

  s.updatedAt = now;
  fs.writeFileSync(statePath, JSON.stringify(s, null, 2));
  return { ok: true, status: action };
};

const startBuild = (id) => {
  const r = spawnSync('/usr/bin/node', ['scripts/orchestrate_go_build.mjs', id], {
    cwd: '/home/rubiorobin/.openclaw/workspace',
    encoding: 'utf8'
  });

  if (r.status !== 0) {
    return { ok: false, detail: (r.stderr || r.stdout || 'build_failed').slice(-2000) };
  }

  try {
    return JSON.parse((r.stdout || '').trim() || '{}');
  } catch {
    return { ok: false, detail: 'invalid_build_output' };
  }
};

const send = async (chatId, text) => {
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text })
  });
};

const offset = readOffset();
const url = `https://api.telegram.org/bot${token}/getUpdates?offset=${offset + 1}`;
const resp = await fetch(url);
const data = await resp.json();

if (!data.ok) {
  console.error('Telegram getUpdates failed');
  process.exit(1);
}

let maxUpdate = offset;
for (const u of (data.result || [])) {
  maxUpdate = Math.max(maxUpdate, u.update_id || 0);
  const msg = u.message || u.edited_message;
  if (!msg) continue;

  const chatId = String(msg.chat?.id || '');
  if (allow.size && !allow.has(chatId)) continue;

  const decision = parseDecision(msg.text || '');
  if (!decision) continue;

  const result = applyDecision(decision.id, decision.action);
  if (!result.ok) {
    await send(chatId, `⚠️ Besluit niet verwerkt voor ${decision.id}`);
    continue;
  }

  if (decision.action === 'Go') {
    const build = startBuild(decision.id);
    if (build.ok) {
      await send(chatId, `✅ GO verwerkt voor ${decision.id}. Build gestart/afgerond voor ${build.buildTaskId}.\nArtifacts: ${build.artifactDir}`);
    } else {
      await send(chatId, `⚠️ GO verwerkt voor ${decision.id}, maar build faalde.\n${build.detail || 'onbekende fout'}`);
    }
  } else {
    await send(chatId, `🛑 NO-GO verwerkt voor ${decision.id}.`);
  }
}

writeOffset(maxUpdate);
console.log(`decision-ingest: processed, offset=${maxUpdate}`);
