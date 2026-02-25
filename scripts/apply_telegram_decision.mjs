#!/usr/bin/env node
import fs from 'fs';

const statePath = '/home/rubiorobin/.openclaw/workspace/ops/state/pipeline_state.json';
const text = (process.argv.slice(2).join(' ') || '').trim();

const m = text.match(/^(GO|NO-GO|NOGO)\s+([A-Za-z0-9_-]+)$/i);
if (!m) {
  console.log(JSON.stringify({ ok: false, reply: 'Gebruik: GO <id> of NO-GO <id>' }));
  process.exit(0);
}

const action = m[1].toUpperCase() === 'GO' ? 'Go' : 'NoGo';
const id = m[2];

const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
const c = state.candidates.find(x => x.id === id);

if (!c) {
  console.log(JSON.stringify({ ok: false, reply: `Onbekende id: ${id}` }));
  process.exit(0);
}

c.status = action;
c.decisionAt = new Date().toISOString();
state.updatedAt = new Date().toISOString();
fs.writeFileSync(statePath, JSON.stringify(state, null, 2));

const reply = action === 'Go'
  ? `✅ GO verwerkt voor ${id}. Status: Go. Build kan automatisch starten.`
  : `🛑 NO-GO verwerkt voor ${id}. Status: NoGo.`;

console.log(JSON.stringify({ ok: true, id, status: c.status, reply }));
