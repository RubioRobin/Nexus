#!/usr/bin/env node
import fs from 'fs';
const p='/home/rubiorobin/.openclaw/workspace/ops/state/pipeline_state.json';
const s=JSON.parse(fs.readFileSync(p,'utf8'));
const now=Date.now();
const active=s.candidates.filter(c=>['InDevelopment','InQA','SpecReady'].includes(c.status));
const stale=active.filter(c=>{
  const t=Date.parse(c.updatedAt||c.createdAt||s.updatedAt||0);
  return t>0 && (now-t) > 3*60*60*1000;
});
if(!stale.length){
  console.log('stale-check: none');
  process.exit(0);
}
console.log('stale-check: escalations');
stale.forEach(c=>console.log(`- ${c.id} | ${c.status} | last=${c.updatedAt||c.createdAt||'unknown'}`));
