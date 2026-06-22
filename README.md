# YearOne Demo

YearOne is a local-first Next.js demo for the Czech AI Olympiad public administration line. It acts as an AI planning agent for the first year of a new company: it loads a firm intent, looks up sandbox registry data, derives obligations with deterministic rules, builds a first-year timeline, and runs what-if simulations.

The judged path does not depend on an LLM. Optional model calls are used only for short Czech narration when credentials or local CLI subscriptions are available.

## What It Demonstrates

- Agentic tool audit: `get_intent`, `lookup_registry`, `lookup_legislation`, `schedule`, `validate_output`
- Deterministic obligation engine backed by `data/sandbox/katalog_povinnosti.json`
- Baseline comparison against the provided scorer
- First-year timeline for delayed obligations and monitoring
- What-if simulation for employees, DPH threshold, branches, regulated trades, partners, and free-text scenarios
- Human approval state before the output is treated as actionable

## Local Setup

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:3000`.

## Verification

```bash
npm test
npm run build
npm run score
```

Current scorer target:

```text
Baseline:     propasnute=28, zbytecne navic=2
Vase reseni:  propasnute=0, zbytecne navic=0
```

## Optional Model Narration

The app works without API keys. To enable narration, copy `.env.example` to `.env.local` and configure one of:

- OpenAI API key
- Anthropic API key
- local Claude Code CLI login/subscription
- local Codex CLI login/subscription

Obligation IDs are never created by model output. Only IDs from the sandbox obligation catalog are valid.
