export default async function handler(_req, res) {
  try {
    const owner = process.env.GITHUB_OWNER || 'RubioRobin';
    const repo = process.env.GITHUB_REPO || 'Nexus';
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      return res.status(500).json({ ok: false, error: 'Missing GITHUB_TOKEN env var' });
    }

    const q = encodeURIComponent('is:issue is:open label:auto-build label:intake');
    const url = `https://api.github.com/search/issues?q=${q}+repo:${owner}/${repo}&sort=created&order=desc&per_page=20`;

    const resp = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json'
      }
    });

    if (!resp.ok) {
      const txt = await resp.text();
      return res.status(500).json({ ok: false, error: `GitHub query failed: ${txt}` });
    }

    const data = await resp.json();
    const items = (data.items || []).map(i => ({
      id: i.number,
      title: i.title,
      state: i.state,
      createdAt: i.created_at,
      updatedAt: i.updated_at,
      url: i.html_url
    }));

    return res.status(200).json({ ok: true, count: items.length, items });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message || 'Unhandled error' });
  }
}
