#!/usr/bin/env node
import fs from 'fs';
const p = '/home/rubiorobin/.openclaw/workspace/ops/state/pipeline_state.json';
const s = JSON.parse(fs.readFileSync(p,'utf8'));

const awaiting = s.candidates.filter(c => c.status === 'AwaitingDecision');
const inDev = s.candidates.filter(c => c.status === 'InDevelopment' || c.status === 'InQA');

const lines = [];
lines.push('08:00 Brief — Revit Add-in Pipelines');
lines.push('');
lines.push(`Awaiting GO: ${awaiting.length}`);
awaiting.forEach(c => lines.push(`- ${c.id} | ${c.track} | impact ${c.impactScore} | confidence ${c.confidenceScore}`));
lines.push('');
lines.push(`Active builds: ${inDev.length}`);
inDev.forEach(c => lines.push(`- ${c.id} | ${c.status}`));
lines.push('');
lines.push('Reply format: GO <id> or NO-GO <id>');

console.log(lines.join('\n'));
