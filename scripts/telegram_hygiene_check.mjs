#!/usr/bin/env node
import fs from 'fs';
const map='/home/rubiorobin/.openclaw/workspace/ops/TELEGRAM_CHANNEL_MAP.md';
const txt=fs.readFileSync(map,'utf8');
const required=['Directie','Intake-Sales','Research-Innovatie','Planning','Codeurs','QA-Release','Blockers-Critical'];
const missing=required.filter(x=>!txt.includes(x));
if(missing.length){
  console.log(`telegram-hygiene: missing lanes -> ${missing.join(', ')}`);
  process.exit(1);
}
console.log('telegram-hygiene: ok');
