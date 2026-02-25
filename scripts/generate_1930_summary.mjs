#!/usr/bin/env node
import fs from 'fs';
const p='/home/rubiorobin/.openclaw/workspace/ops/state/pipeline_state.json';
const s=JSON.parse(fs.readFileSync(p,'utf8'));
const done=s.candidates.filter(c=>['Released','ReadyForRelease'].includes(c.status));
const qa=s.candidates.filter(c=>c.status==='InQA');
const awaiting=s.candidates.filter(c=>c.status==='AwaitingDecision');
const lines=[];
lines.push('19:30 Samenvatting — Revit Add-in Pipelines');
lines.push('');
lines.push(`Klaar/release-ready: ${done.length}`);
done.slice(0,10).forEach(c=>lines.push(`- ${c.id} | ${c.status}`));
lines.push(`In QA: ${qa.length}`);
qa.slice(0,8).forEach(c=>lines.push(`- ${c.id}`));
lines.push(`Wacht op GO: ${awaiting.length}`);
awaiting.slice(0,8).forEach(c=>lines.push(`- ${c.id}`));
console.log(lines.join('\n'));
