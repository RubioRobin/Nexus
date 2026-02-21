# TOOLS (machine-local notes)
Default paths (adjust if your NVMe mount differs):
- Workspace root: /mnt/nvme/openclaw/workspace
- Repo root: /mnt/nvme/openclaw/repos
- Logs: /mnt/nvme/openclaw/logs
- Reports: /mnt/nvme/openclaw/reports
- Knowledge base: /mnt/nvme/openclaw/kb
- Proposals: /mnt/nvme/openclaw/proposals
- Decisions (ADRs): /mnt/nvme/openclaw/decisions

Connectivity:
- Private network: Tailscale
- Notifications: Telegram (ZEUS only)

Notes:
- Use HTTPS + PAT for GitHub pushes (store in credential helper, never in repo).
- Do not place secrets in markdown; reference environment variables instead.


Dev notes:
- Prefer local coder model for code drafting.
- Keep Revit API calls behind small wrapper/service classes where possible.
