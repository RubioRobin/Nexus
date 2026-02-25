#!/usr/bin/env node
import fs from 'fs';
const p='/home/rubiorobin/.openclaw/workspace/ops/state/pipeline_state.json';
const s=JSON.parse(fs.readFileSync(p,'utf8'));
const active=s.candidates.filter(c=>['Go','SpecReady','InDevelopment','InQA','ReadyForRelease'].includes(c.status));
const blocked=s.candidates.filter(c=>String(c.blocker||'').trim());
const lines=[];
lines.push('12:30 Status — Revit Add-in Pipelines');
lines.push('');
lines.push(`Actief: ${active.length}`);
active.slice(0,12).forEach(c=>lines.push(`- ${c.id} | ${c.track} | ${c.status}`));
lines.push('');
lines.push(`Blockers: ${blocked.length}`);
blocked.slice(0,8).forEach(c=>lines.push(`- ${c.id}: ${c.blocker}`));
console.log(lines.join('\n'));
