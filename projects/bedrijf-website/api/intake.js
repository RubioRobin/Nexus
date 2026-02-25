export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const task = req.body || {};
    if (!task.taskId || !task.traceId || !task.customer?.email || !task.intake?.problem) {
      return res.status(400).json({ ok: false, error: 'Invalid payload' });
    }

    const owner = process.env.GITHUB_OWNER || 'RubioRobin';
    const repo = process.env.GITHUB_REPO || 'Nexus';
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      return res.status(500).json({ ok: false, error: 'Missing GITHUB_TOKEN env var' });
    }

    const addinType = task?.intake?.addinType || 'Algemeen';
    const labels = ['intake', 'awaiting-go', 'revit-addon'];

    const body = [
      `# Build Task ${task.taskId}`,
      `Trace ID: ${task.traceId}`,
      '',
      '## Klant',
      `- Naam: ${task.customer?.name || '-'}`,
      `- Bedrijf: ${task.customer?.company || '-'}`,
      `- E-mail: ${task.customer?.email || '-'}`,
      '',
      '## Intake',
      `- Type add-in: ${addinType}`,
      `- Revit versie: ${task.intake?.revitVersion || '-'}`,
      `- Urgentie: ${task.intake?.urgency || '-'}`,
      `- Budget: ${task.intake?.budget || '-'}`,
      `- Bestanden: ${task.intake?.filesUrl || '-'}`,
      '',
      '## Probleem',
      task.intake?.problem || '-',
      '',
      '## Gewenste uitkomst',
      task.intake?.outcome || '-',
      '',
      '## Triage',
      `- Effort: ${task.triage?.effort || '-'}`,
      `- Risico: ${task.triage?.risk || '-'}`,
      `- Prioriteit: ${task.triage?.priority || '-'}`,
      '',
      '## Acceptance criteria',
      ...(task.acceptanceCriteria || []).map((x, i) => `${i + 1}. ${x}`),
      '',
      `Handoff: ${task.handoff || '-'}`
    ].join('\n');

    const issueResp = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: `[AUTO BUILD] ${task.taskId} — ${addinType}`,
        body,
        labels
      })
    });

    if (!issueResp.ok) {
      const txt = await issueResp.text();
      return res.status(500).json({ ok: false, error: `GitHub issue create failed: ${txt}` });
    }

    const issue = await issueResp.json();

    // Notify Robin on Telegram before any build starts
    const tgToken = process.env.TELEGRAM_BOT_TOKEN;
    const tgChatId = process.env.TELEGRAM_CHAT_ID;
    if (tgToken && tgChatId) {
      const text = [
        `Nieuwe intake: ${task.taskId}`,
        `Type: ${addinType}`,
        `Urgentie: ${task.intake?.urgency || '-'}`,
        `Issue: ${issue.html_url}`,
        '',
        `Reageer met GO/NO-GO.`,
        `Bij GO: voeg label 'go-build' toe op issue #${issue.number}.`
      ].join('\n');

      await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: tgChatId, text })
      });
    }

    return res.status(200).json({
      ok: true,
      queueStatus: 'awaiting_go',
      assignedTo: 'robin-go-gate',
      taskId: task.taskId,
      issueUrl: issue.html_url,
      issueNumber: issue.number
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message || 'Unhandled error' });
  }
}
