# MODEL_ROUTING_POLICY.md

## Default Principle
**Local-first, cloud-when-needed.**

## Use Local (ollama/qwen2.5:3b)
- Research summaries
- Draft docs
- Refactors/boilerplate
- Routine issue triage
- Low-risk web/source analysis

## Use Cloud (openai-codex/gpt-5.3-codex)
- Final architecture decisions
- Hard debugging deadlocks
- QA sign-off reasoning
- High-impact scope choices
- Critical release decisions

## Escalation Trigger
Escalate local -> cloud when one of these is true:
1. Confidence low after 2 local passes
2. Safety/quality risk is high
3. Decision has long-term architectural impact
4. User explicitly requests deep reasoning
