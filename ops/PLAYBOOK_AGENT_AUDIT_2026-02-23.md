# Agent Audit — Playbook Alignment

Date: 2026-02-23
Scope: Validate all workspace agents against `ops/OPERATING_PLAYBOOK_V1.md` and align behavior.

## Changes Applied

### 1) Global alignment block added to ALL 22 agents
Updated files:
- agents/athena/AGENTS.md
- agents/atlas/AGENTS.md
- agents/chronos/AGENTS.md
- agents/daedalus/AGENTS.md
- agents/hades/AGENTS.md
- agents/harmonia/AGENTS.md
- agents/hephaistos/AGENTS.md
- agents/hermes/AGENTS.md
- agents/hermes_integration/AGENTS.md
- agents/hypatia/AGENTS.md
- agents/iris/AGENTS.md
- agents/janus/AGENTS.md
- agents/kronos/AGENTS.md
- agents/metis/AGENTS.md
- agents/mnemosyne/AGENTS.md
- agents/nemesis/AGENTS.md
- agents/odysseus/AGENTS.md
- agents/oracle/AGENTS.md
- agents/pandora/AGENTS.md
- agents/themis/AGENTS.md
- agents/triton/AGENTS.md
- agents/zeus/AGENTS.md

### 2) Root orchestrator alignment updated
- AGENTS.md updated with Playbook governance controls.

## What is now enforced in each agent file
- Playbook is primary operating baseline.
- Run limits: max 3 steps, 30-minute timebox.
- Scope uncertainty => escalate to Zeus before proceeding.
- Mandatory communication flow:
  - agent -> Zeus (Done/Blocker/Next/ETA)
  - agent -> impacted peers (cross-lane handoff)
- Trello is concise operational overview only.
- Completion gate: no Done without QA pass + Robin approval.
- Repeat-failure behavior: auto-pause and escalate.
- Token/rate-limit controls must be respected.

## Recommended Core Active Agents (daily)
1. zeus (orchestration/governance)
2. athena (research)
3. hephaistos (implementation)
4. themis (qa/gate)
5. chronos (planning)
6. oracle (scope decisions support)
7. harmonia (coordination + weekly feedback loop)

## Recommended Support Agents (on-demand)
- daedalus, atlas, odysseus, triton, hades (engineering depth)
- hermes, pandora, iris (intake/dispatch/experiments)
- metis, kronos, mnemosyne, hypatia (strategy/cost/knowledge/docs)
- janus, nemesis (release/risk depth)
- hermes_integration (contracts/integrations)

## Agents possibly redundant (not removal, only optional parking)
No immediate hard removals required.
Optional parking when load is low:
- atlas, odysseus (overlap with daedalus/hephaistos)
- janus OR nemesis (can be merged temporarily into themis lane)
- hypatia (when documentation load is low)

## New/Adjusted capability needed for true autonomous operation
1. **HR/People-Ops loop owner** (weekly performance + process improvement)
   - Recommendation: assign to `harmonia` (no new agent required).
2. **Model routing controller** (fallback matrix and cost controls)
   - Recommendation: assign to `kronos` with Zeus approval gate.
3. **Channel bridge policy (Discord-first, Telegram-secondary)**
   - Recommendation: define channel map in ops doc and enforce lane-specific posting.

## Final note
Agent role definitions are now aligned to Playbook behavior. Remaining work for full autonomy is mainly runtime policy wiring (cron/session behavior, channel bridge, and fallback matrix), not role text.
