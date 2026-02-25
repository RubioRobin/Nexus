export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const task = req.body || {};
    if (!task.taskId || !task.traceId || !task.customer?.email || !task.intake?.problem) {
      return res.status(400).json({ ok: false, error: 'Invalid payload' });
    }

    const tgToken = process.env.TELEGRAM_BOT_TOKEN;
    const tgChatId = process.env.TELEGRAM_CHAT_ID;
    const tgZeusChatId = process.env.TELEGRAM_ZEUS_CHAT_ID || tgChatId;

    if (!tgToken || !tgChatId) {
      return res.status(500).json({ ok: false, error: 'Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID' });
    }

    const addinType = task?.intake?.addinType || 'Algemeen';
    const text = [
      `🆕 Nieuwe intake (awaiting GO)`,
      `Task: ${task.taskId}`,
      `Trace: ${task.traceId}`,
      `Klant: ${task.customer?.name || '-'} (${task.customer?.company || '-'})`,
      `Mail: ${task.customer?.email || '-'}`,
      `Type: ${addinType}`,
      `Revit: ${task.intake?.revitVersion || '-'}`,
      `Urgentie: ${task.intake?.urgency || '-'}`,
      `Budget: ${task.intake?.budget || '-'}`,
      '',
      `Probleem: ${task.intake?.problem || '-'}`,
      `Uitkomst: ${task.intake?.outcome || '-'}`,
      `Bestanden: ${task.intake?.filesUrl || '-'}`,
      '',
      `GO/NO-GO nodig van Robin vóór buildstart.`
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
      assignedTo: 'intake-agent->zeus->robin',
      taskId: task.taskId
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message || 'Unhandled error' });
  }
}
