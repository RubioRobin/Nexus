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


Oracle sources (configure later):
- GitHub search/trending (topics: bim, revit, ifc, llm, agents, openclaw)
- Autodesk/Revit API release notes (placeholder)
- AI release feeds (placeholder)
