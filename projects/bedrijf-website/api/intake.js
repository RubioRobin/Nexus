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
    const labels = ['intake', 'auto-build', 'revit-addon'];

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

    // Optional: trigger workflow dispatch for automation pipeline
    const workflow = process.env.AUTO_BUILD_WORKFLOW_FILE || 'auto-build.yml';
    if (workflow) {
      await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow}/dispatches`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ref: process.env.AUTO_BUILD_REF || 'master',
          inputs: {
            issue_number: String(issue.number),
            task_id: task.taskId,
            trace_id: task.traceId
          }
        })
      });
    }

    return res.status(200).json({
      ok: true,
      queueStatus: 'queued',
      assignedTo: 'github-issues-auto-build',
      taskId: task.taskId,
      issueUrl: issue.html_url,
      issueNumber: issue.number
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message || 'Unhandled error' });
  }
}
