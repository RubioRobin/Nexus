#!/usr/bin/env node
const text = (process.argv.slice(2).join(' ') || '').trim();

// Supported:
// GO AC-2026-02-25-001
// NO-GO AC-2026-02-25-001
const m = text.match(/^(GO|NO-GO|NOGO)\s+([A-Za-z0-9_-]+)$/i);
if (!m) {
  console.log(JSON.stringify({ ok: false, error: 'No decision command found' }));
  process.exit(0);
}
const verb = m[1].toUpperCase();
const id = m[2];
console.log(JSON.stringify({ ok: true, action: verb === 'GO' ? 'go' : 'nogo', id }));
