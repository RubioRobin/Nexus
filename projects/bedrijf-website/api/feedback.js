export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgChatId = process.env.TELEGRAM_CHAT_ID;
  if (!tgToken || !tgChatId) return res.status(500).json({ ok: false, error: 'Missing TELEGRAM vars' });

  const b = req.body || {};
  if (!b.name || !b.email || !b.type || !b.priority || !b.description) {
    return res.status(400).json({ ok: false, error: 'Invalid payload' });
  }

  const text = [
    '📝 Nieuwe feedback',
    `Type: ${b.type}`,
    `Prioriteit: ${b.priority}`,
    `Naam: ${b.name}`,
    `E-mail: ${b.email}`,
    `Versie/Add-in: ${b.version || '-'}`,
    '',
    b.description
  ].join('\n');

  const r = await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: tgChatId, text })
  });

  if (!r.ok) {
    const err = await r.text();
    return res.status(500).json({ ok: false, error: err });
  }

  return res.status(200).json({ ok: true });
}
