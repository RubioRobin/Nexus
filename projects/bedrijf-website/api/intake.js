function qualify(task) {
  const missing = [];
  if (!task.customer?.name) missing.push('contact naam');
  if (!task.customer?.company) missing.push('bedrijf');
  if (!task.intake?.problem || task.intake.problem.trim().length < 20) missing.push('duidelijke probleemomschrijving');
  if (!task.intake?.revitVersion) missing.push('Revit versie');

  const impact = Number(task.impactScore || 65);
  const confidence = Number(task.confidenceScore || 60);
  const risk = (task?.triage?.risk || '').toLowerCase().includes('hoog') ? 'high' : 'medium';

  const status = missing.length ? 'NeedsInfo' : 'Qualified';
  const scope = task?.triage?.effort?.startsWith('L') ? 'L' : task?.triage?.effort?.startsWith('M') ? 'M' : 'S';
  const route = 'ClientProject'; // klant altijd eerst
  const sla = scope === 'S' ? '1-2 werkdagen' : scope === 'M' ? '3-5 werkdagen' : '1-2 weken';

  return { status, missing, impact, confidence, risk, scope, route, sla };
}

const RATE = new Map();
const WINDOW_MS = 60 * 1000;
const LIMIT = 6;

const getIp = (req) => (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').toString().split(',')[0].trim();

function guardRequest(req, task) {
  const allowRaw = process.env.ALLOWED_ORIGINS || '';
  const allowed = allowRaw.split(',').map(s => s.trim()).filter(Boolean);
  const origin = req.headers.origin || '';
  if (allowed.length && origin && !allowed.includes(origin)) {
    return 'Origin not allowed';
  }

  // Honeypot + minimum form fill time
  if (task?.meta?.websiteTrap) return 'Bot trap triggered';
  const startedAt = Number(task?.meta?.startedAt || 0);
  if (startedAt && Date.now() - startedAt < 4000) return 'Submitted too fast';

  const ip = getIp(req);
  const now = Date.now();
  const arr = (RATE.get(ip) || []).filter(t => now - t < WINDOW_MS);
  arr.push(now);
  RATE.set(ip, arr);
  if (arr.length > LIMIT) return 'Rate limit exceeded';

  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const task = req.body || {};
    const guard = guardRequest(req, task);
    if (guard) return res.status(429).json({ ok: false, error: guard });
    if (!task.taskId || !task.traceId || !task.customer?.email || !task.intake?.problem) {
      return res.status(400).json({ ok: false, error: 'Invalid payload' });
    }

    const q = qualify(task);

    const tgToken = process.env.TELEGRAM_BOT_TOKEN;
    const tgChatId = process.env.TELEGRAM_CHAT_ID;
    const tgZeusChatId = process.env.TELEGRAM_ZEUS_CHAT_ID || tgChatId;

    if (!tgToken || !tgChatId) {
      return res.status(500).json({ ok: false, error: 'Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID' });
    }

    const addinType = task?.intake?.addinType || 'Algemeen';
    const text = [
      `🆕 Nieuwe intake (${q.status})`,
      `Athena research: requested`,
      `Task: ${task.taskId}`,
      `Trace: ${task.traceId}`,
      `Klant: ${task.customer?.name || '-'} (${task.customer?.company || '-'})`,
      `Mail: ${task.customer?.email || '-'}`,
      `Type: ${addinType}`,
      `Revit: ${task.intake?.revitVersion || '-'}`,
      `Route: ${q.route}`,
      `Scope: ${q.scope} | SLA-band: ${q.sla}`,
      `Risk: ${q.risk}`,
      '',
      `Probleem: ${task.intake?.problem || '-'}`,
      `Uitkomst: ${task.intake?.outcome || '-'}`,
      `Bestanden: ${task.intake?.filesUrl || '-'}`,
      ...(q.missing.length ? ['', `Missing info: ${q.missing.join(', ')}`] : []),
      '',
      `Robin GO/NO-GO nodig vóór buildstart.`
    ].join('\n');

    const send = async (chatId) => fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text })
    });

    const r1 = await send(tgChatId);
    if (!r1.ok) {
      const err = await r1.text();
      return res.status(500).json({ ok: false, error: `Telegram send failed: ${err}` });
    }

    if (tgZeusChatId && tgZeusChatId !== tgChatId) {
      await send(tgZeusChatId);
    }

    return res.status(200).json({
      ok: true,
      queueStatus: 'awaiting_go',
      qualification: q,
      assignedTo: 'intake-agent->zeus->robin',
      taskId: task.taskId
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message || 'Unhandled error' });
  }
}
