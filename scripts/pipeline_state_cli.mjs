#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const root = '/home/rubiorobin/.openclaw/workspace';
const statePath = path.join(root, 'ops/state/pipeline_state.json');

const cmd = process.argv[2];
const arg = process.argv[3];

const read = () => JSON.parse(fs.readFileSync(statePath, 'utf8'));
const write = (s) => {
  s.updatedAt = new Date().toISOString();
  fs.writeFileSync(statePath, JSON.stringify(s, null, 2));
};

if (!cmd) {
  console.log('Usage: pipeline_state_cli.mjs <add|list-awaiting|go|nogo|status> [args]');
  process.exit(1);
}

const state = read();

if (cmd === 'add') {
  const candidate = JSON.parse(fs.readFileSync(arg, 'utf8'));
  state.candidates.push(candidate);
  write(state);
  console.log(`Added ${candidate.id}`);
} else if (cmd === 'list-awaiting') {
  const out = state.candidates.filter(c => c.status === 'AwaitingDecision');
  console.log(JSON.stringify(out, null, 2));
} else if (cmd === 'go' || cmd === 'nogo') {
  const id = arg;
  const c = state.candidates.find(x => x.id === id);
  if (!c) throw new Error(`Candidate not found: ${id}`);
  c.status = cmd === 'go' ? 'Go' : 'NoGo';
  c.decisionAt = new Date().toISOString();
  write(state);
  console.log(`${id} => ${c.status}`);
} else if (cmd === 'status') {
  const id = arg;
  const c = state.candidates.find(x => x.id === id);
  console.log(JSON.stringify(c || null, null, 2));
} else {
  console.log('Unknown command');
  process.exit(1);
}
