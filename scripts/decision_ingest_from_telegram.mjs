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
const releaseChatId = (process.env.TELEGRAM_RELEASE_CHAT_ID || '').trim();
const planningChatId = (process.env.TELEGRAM_PLANNING_CHAT_ID || '-1003575020150').trim();
const codeursChatId = (process.env.TELEGRAM_CODEURS_CHAT_ID || '-1003826367901').trim();

const statePath = '/home/rubiorobin/.openclaw/workspace/ops/state/pipeline_state.json';
const offPath = '/home/rubiorobin/.openclaw/workspace/ops/state/telegram_offset.json';

const readOffset = () => {
  try { return JSON.parse(fs.readFileSync(offPath, 'utf8')).offset || 0; } catch { return 0; }
};
const writeOffset = (offset) => fs.writeFileSync(offPath, JSON.stringify({ offset, updatedAt: new Date().toISOString() }, null, 2));

const parseDecision = (text = '') => {
  const t = text.trim();
  const withId = t.match(/^(GO|NO-GO|NOGO)\s+([A-Za-z0-9_-]+)$/i);
  if (withId) return { action: withId[1].toUpperCase() === 'GO' ? 'Go' : 'NoGo', id: withId[2], raw: t };

  const noId = t.match(/^(GO|NO-GO|NOGO)$/i);
  if (noId) return { action: noId[1].toUpperCase() === 'GO' ? 'Go' : 'NoGo', id: null, raw: t };

  return null;
};

const extractBuildId = (text = '') => {
  const m = text.match(/\b(BUILD-[A-Za-z0-9_-]+)\b/i);
  return m ? m[1] : null;
};

const resolveDecisionId = (msg, decision) => {
  if (decision.id) return decision.id;

  const fromReply = extractBuildId(msg?.reply_to_message?.text || '');
  if (fromReply) return fromReply;

  try {
    const s = JSON.parse(fs.readFileSync(statePath, 'utf8'));
    const last = [...(s.candidates || [])].reverse().find(c => c?.id);
    if (last?.id) return last.id;
  } catch {}

  return null;
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

  const resolvedId = resolveDecisionId(msg, decision);
  if (!resolvedId) {
    await send(chatId, '⚠️ Geen intake-id gevonden. Gebruik: GO <BUILD-ID> of reply op intakebericht met GO.');
    continue;
  }

  const result = applyDecision(resolvedId, decision.action);
  if (!result.ok) {
    await send(chatId, `⚠️ Besluit niet verwerkt voor ${resolvedId}`);
    continue;
  }

  if (decision.action === 'Go') {
    const build = startBuild(resolvedId);
    if (build.ok) {
      const releaseLine = build.release?.ok && build.release?.url
        ? `\nGitHub release: ${build.release.url}`
        : `\nGitHub release: niet gelukt (${build.release?.error ? 'zie logs' : 'onbekend'})`;
      const msgOut = `✅ GO verwerkt voor ${resolvedId}. Build gestart/afgerond voor ${build.buildTaskId}.\nArtifacts: ${build.artifactDir}${releaseLine}`;
      await send(chatId, msgOut);

      const laneMsg = `🛠️ GO ${resolvedId} verwerkt.\nCodeurs-run gestart op Pi voor ${build.buildTaskId}.\nArtifacts: ${build.artifactDir}`;
      if (planningChatId) await send(planningChatId, laneMsg);
      if (codeursChatId) await send(codeursChatId, laneMsg);

      if (releaseChatId && releaseChatId !== chatId) {
        await send(releaseChatId, `📦 Release update\n${msgOut}`);
      }
    } else {
      await send(chatId, `⚠️ GO verwerkt voor ${resolvedId}, maar build faalde.\n${build.detail || 'onbekende fout'}`);
    }
  } else {
    await send(chatId, `🛑 NO-GO verwerkt voor ${resolvedId}.`);
  }
}

writeOffset(maxUpdate);
console.log(`decision-ingest: processed, offset=${maxUpdate}`);
