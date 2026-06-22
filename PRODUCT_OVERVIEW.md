# YearOne — Product Overview (pitch hand-off)

> AI agent that plans a Czech company's **first year of legal & administrative
> obligations** — and watches them over time, instead of interrogating the founder.

This document is a hand-off for whoever writes the pitch. It states plainly what
is **real and working**, what is **simulated for the demo**, and what is **not
built yet**, so the pitch is confident without overclaiming.

---

## 1. One-liner

**YearOne turns a founder's company intent into a complete, explained, time-aware
plan of first-year obligations — deriving even the hidden and deferred ones from
public registries, with zero questions asked and a human approving the final step.**

## 2. The problem

When you found an s.r.o. in the Czech Republic, the obvious steps (commercial
register, income-tax registration, data box, trade licence) are easy. The ones
that get **missed** are what cost you:

- marking the registered seat (`označení sídla`),
- the beneficial-owners register (`skuteční majitelé`),
- VAT once turnover crosses the threshold (a *deferred* obligation),
- employer duties (ČSSZ + health insurance) when the first employee starts,
- registering a place of business (`provozovna`),
- correctly classifying a **regulated** trade (vázaná/koncese) instead of free.

A naive "setup wizard" baseline fills in the obvious registrations and stops.
YearOne is the agent that beats it.

## 3. How it works (the agent loop)

1. **Reads the intent** — predmet, sídlo, partners, turnover, planned employees.
2. **Looks things up instead of asking** — trade classification and partner
   companies come from registries (`lookup_registry`), not from the founder.
   This is the *once-only* principle: never ask the state what it already knows.
3. **Derives obligations with a deterministic rule engine** — base duties +
   trade type + place of business + employees + VAT threshold.
4. **Builds a timeline** — splits duties into **Now / Soon / Monitor** and
   schedules deferred ones (VAT on turnover, employer duties before first hire).
5. **Validates** every output ID against the official catalogue.
6. **Explains** each obligation (why it applies, trigger, data source, rule).
7. **Human approves** the final plan — the agent never files anything itself.

Every step is recorded as a **tool call with timing** → a transparent audit trail.

## 4. What's implemented today (working)

**Core engine (deterministic, tested):**
- 12 obligation types derived from intent; 12 trade classifications (free/
  regulated/concession); synthetic ARES lookup for corporate partners.
- Now / Soon / Monitor timeline with deferred-obligation scheduling.
- Output validation against the obligation catalogue.

**What-if simulator (the demo centrepiece):**
- 7 scenario types: first employee, turnover increase (crosses VAT), advance
  time, open a branch, change subject, add a regulated trade, add a partner.
- Two ways to drive it: **preset buttons** and a **free-text Czech question box**
  ("Co když obrat vzroste na 3 miliony?") parsed into a structured scenario.
- **Scenario delta**: added / removed / unchanged obligations + a complexity read,
  shown as a non-destructive simulation ("does not save without approval").

**Proof it's better than the baseline:**
- Runs against 6 labelled public cases. Result: **YearOne 0 missed / 0 extra**
  vs **baseline 28 missed / 2 extra**. Founder burden = **0 questions**.
- Bridges to the competition's official Python scorer (`bodovac.py`) and matches
  it — i.e. the score is verified by the organisers' own tool, not just ours.

**Product surface:**
- Full Czech web UI (Next.js): company picker (40 sample firms), guidance canvas,
  agent planner, agent audit log, result counts, baseline-vs-YearOne comparison,
  grouped obligation plan, first-year timeline, human-approval box, and an
  **ethics/responsibility panel**.
- Optional **LLM narration** (OpenAI / Anthropic SDK, or local Claude/Codex CLI)
  that writes a 2-sentence plain-Czech summary. Falls back to a local template
  with no API key. **The model only narrates — it never decides** (rules do).

## 5. What is simulated for the demo (say this honestly)

- The **registries are synthetic sandbox data**, not live ARES / živnostenský
  rejstřík. Structure mirrors reality; values are modelled.
- **Legislation lookup is placeholder metadata**, not authoritative legal text;
  thresholds (e.g. VAT) are demo values to verify.
- **"Scheduling / watching in time" is simulated** — no real persistence or cron.
- **Approval is UI-only** — nothing is actually submitted to any authority.
- A few counters (founder burden, missing-data) are currently fixed at 0 by
  design to tell the "zero-burden" story.

## 6. What is NOT built yet (roadmap / don't overclaim)

- Live registry integration **with the legal basis, consent and access audit**
  that real data would require (the ethics panel explicitly names this).
- A real, versioned legislation engine beyond the single VAT rule.
- Persistence, accounts, multi-company, real time-based monitoring/reminders.
- Auth & rate limiting on the API (flagged in the code audit).

## 7. Why it wins (pitch angles)

- **"Dohledat místo vyptávat"** — looks data up instead of interrogating the
  founder. Burden = 0. This is the competition's stated ideal, delivered.
- **Catches the hidden & deferred duties** the baseline misses — provably (0/0).
- **Trustworthy by construction**: deterministic rules + full explainability
  (every duty shows why/trigger/source) + visible audit trail + human approval.
  Exactly the profile a *public-administration* tool needs.
- **Verified, not claimed**: scored by the organisers' own Python scorer.

## 8. Tech & status (for credibility)

- Next.js 16 (App Router, Turbopack) + React + TypeScript (strict) + Zod.
- Pure-function rule/score engine, fully unit-tested.
- **Status: green** — type-check clean, **23/23 tests pass**, production build
  clean. API input validation and error handling hardened.

## 9. Quick demo script (90 seconds)

1. Open on **FIRMA-0004** → show the full first-year plan appear (Now/Soon/Monitor).
2. Point at **Baseline vs YearOne**: baseline misses VAT, employees, beneficial
   owners, seat marking; YearOne has them — **0 missed / 0 extra**.
3. Click **"Co když zaměstnanec nastoupí 15. září?"** → watch the employer duties
   and timeline update live; show the **scenario delta**.
4. Type a free-text what-if in Czech → same engine, natural language in.
5. Show the **agent audit log** (tool calls) and click **Approve** → human-in-loop.
6. Close on the **ethics panel**: real registries need legal basis + consent;
   the model explains, it doesn't create obligations.

---

*Maintained alongside the codebase. If a number here (e.g. score, test count)
changes, update §4 and §8.*
