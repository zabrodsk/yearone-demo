# YearOne — Design System

> **YearOne** is an AI agent for a company's first year. It turns a founder's
> intent plus public-registry data into a personalized timeline of legal and
> administrative obligations, and lets them simulate what changes as the
> company grows. Built for the Czech market; the product UI is in **Czech**.

This repository is the single source of truth for YearOne's brand, visual
foundations, reusable UI components, and full-screen product recreations.
A compiler indexes everything here so design agents can produce on-brand
work — production code or throwaway mocks alike.

---

## 1 · Product context

YearOne is **agentic, not a GPT wrapper.** An LLM only explains results and
turns free-text questions into structured scenarios. The real core is a
pipeline:

`intent → registry lookup (ARES) → trade-license (živnost) classifier →
obligation engine → timeline scheduler → future triggers → human approval`

**The three product surfaces:**

1. **Guidance Canvas** — instead of a long form, the founder assembles a model
   of the company from cards: what it does, where it operates, who is involved,
   expected turnover, whether it will hire, whether it has business premises.
   The canvas is only the input layer — the agent then looks things up,
   derives, and plans on its own.
2. **The Plan** — a personalized output: obligation list, first-year timeline,
   *hidden* obligations the founder wouldn't know to ask about, future triggers,
   what was pulled from registries, what a human must confirm, and a baseline
   comparison.
3. **What-if simulator** — preset scenario cards ("I hire my first employee",
   "I cross the VAT threshold", "I open premises", "I add a partner") or a free
   question ("What if turnover grows to 3M?"). The agent clones the current
   plan, changes one parameter, recomputes, and shows the **diff**: new
   obligations, removed obligations, timeline impact, new questions, change in
   administrative complexity. Scenarios are never auto-saved — the user chooses
   *simulate only*, *add to plan*, or *discard*.

**Obligation domain (examples the engine reasons about):** `SIDLO_OZNACENI`
(registered-office marking), `SKUTECNI_MAJITELE` (beneficial owners), `DPH`
(VAT), `ZAM_CSSZ` / `ZAM_ZP` (social + health insurance on hiring),
`PROVOZOVNA` (business premises), `ZIVNOST_VAZANA` / `ZIVNOST_KONCESE`
(regulated/licensed trades).

**Users & buyers:** founders/directors of small companies in their first year;
buyers include the small company itself, accounting offices managing many
clients, advisory firms, and possible white-label for public administration,
banks, or business portals.

> **One-line:** YearOne is an AI agent for a company's first year that turns
> intent and registry data into a personalized obligation timeline and lets you
> simulate what changes as the company grows.

### Sources given
- `uploads/Pasted text.txt` — founder's product definition (Czech). The brand
  had no prior logo, fonts, codebase, or Figma; the visual identity in this
  system is an original creation built to the brief *"professional, startup,
  modern SF, agentic, B2B."* Flag for the user: **fonts and logo are proposals**
  — see Caveats at the end of this turn.

---

## 2 · Content fundamentals

**Language.** The product is **Czech**. UI copy, button labels, obligation
names, and timeline items are written in Czech. Marketing/brand surfaces may be
bilingual, but default to Czech for anything in-product. (This README and code
comments are in English for the design team.)

**Voice.** Calm, precise, and reassuring — YearOne handles something stressful
(legal compliance) so the tone must build trust, never alarm. It is an expert
co-pilot, not a cheerleader. Confident and plain; no hype, no exclamation marks.

**Person.** Address the founder directly with informal-but-respectful Czech
("ty" is too casual for compliance; prefer neutral/`vy`-leaning phrasing or
impersonal instructions — e.g. *"Tvoje firma"* in casual marketing, but
*"Vaše firma potřebuje…"* in-product). The agent refers to itself sparingly in
the first person only when explaining what it did ("Dohledal jsem v ARES…").

**Casing.** Sentence case everywhere — buttons, headings, menu items
(*"Přidat do plánu"*, not *"Přidat Do Plánu"*). The wordmark is **YearOne**
(one word, capital Y and O). Obligation codes are `UPPER_SNAKE` and always set
in mono.

**Numbers, dates, money.** Czech conventions: `1 200 000 Kč` (space thousands,
`Kč` suffix), dates `15. 3. 2025` or `15. března 2025`. Thresholds and limits
are stated exactly (e.g. VAT threshold) and always paired with what they
trigger.

**Tone of obligations.** Each obligation states *what*, *by when*, and *why it
applies to you* in one breath. Hidden obligations are surfaced gently
("Na tohle se často zapomíná:"). Anything the agent inferred but a human must
confirm is clearly labeled *"K potvrzení"* — never presented as fact.

**Emoji:** none. This is a compliance product; trust comes from restraint.
Status is communicated with color + icon + label, never an emoji.

**Example copy**
- Hero: *"AI agent pro první rok vaší firmy."*
- Sub: *"Ze záměru a registrů vytvoříme plán povinností a ukážeme, co se změní, když firma poroste."*
- Empty plan: *"Vyplňte canvas a YearOne sestaví váš plán."*
- What-if prompt: *"Co se změní, když…"*
- Confirmation: *"3 povinnosti k potvrzení"*

---

## 3 · Visual foundations

The system is **refined-technical**: precise, gradient-free, generously spaced.
It signals trust (a compliance product) while feeling like a modern SF startup.
Think Linear/Vercel-grade restraint, original to YearOne.

**Color.** A cool-neutral slate scale carries ~90% of every surface. A single
brand accent — **Signal**, a confident cobalt/indigo `#3A56E8` — touches only
interactive and agent-driven elements (primary actions, links, agent
highlights, the active timeline node). A warm **Amber** `#DD8E2E` appears
*sparingly* as "first-year / dawn" energy and as the warning/deadline status.
Semantic green = done/compliant, red = overdue/error, amber = upcoming
deadline, signal = agent-found / needs attention. See `tokens/colors.css`.

**Type.** Display **Space Grotesk** (geometric grotesque — confident, technical;
set large with negative tracking). Body/UI **Hanken Grotesk** (humanist,
highly legible at small sizes — the workhorse). Mono **JetBrains Mono** for
agent output, obligation codes, registry data, telemetry, and timestamps.
Two-tier hierarchy: display for moments, Hanken for everything functional.

**Spacing & layout.** 4px base grid (`--space-*`). Content sits on a calm
multi-column grid with wide gutters; the Plan/timeline view uses a fixed left
rail (canvas summary) + scrollable timeline. Generous negative space is a
feature — density is reserved for data tables and the obligation list.

**Backgrounds.** Flat. `--paper #FAFAFB` for app/page, pure white for cards.
**No gradient meshes, no photos behind text.** The only permitted texture is a
faint slate **dot/line grid** on hero or canvas backgrounds at very low opacity,
suggesting structure/planning. Imagery, where used, is restrained and
diagrammatic, not stocky.

**Corners.** Moderate and consistent: 6px controls, 8px cards/menus, 12px
panels, 16px modals/hero surfaces. Tags 4px. Avatars/pills full-round.

**Elevation.** Soft, cool-tinted, low-spread shadows (`--shadow-*`). Cards rest
on `--shadow-sm`; popovers/menus on `--shadow-md`; modals on `--shadow-lg/xl`.
Never heavy black drop shadows. Many surfaces use a 1px border *instead of* a
shadow — borders are the default separation device.

**Borders.** 1px is the standard hairline; `--border-default` for cards and
inputs, `--border-subtle` for internal dividers, `--border-strong` on hover/
emphasis. The brand leans on crisp borders over heavy shadow.

**Motion.** Fast and ease-out, never bouncy. `--duration-fast 140ms` for hover/
press, `--duration-base 220ms` for entrances. Page/plan reveals use a short
staggered fade-up. The agent "thinking" state is the one place for a calm,
continuous motion (a subtle pulsing dot or shimmer on the progress ring) — it
mirrors the logo. Respect `prefers-reduced-motion`.

**Hover / press.** Hover: surfaces shift to `--surface-hover`, bordered elements
go to `--border-strong`; primary buttons darken to `--accent-hover`. Press:
darken further to `--accent-active` and drop elevation (no scale-down on large
surfaces; controls may use a 1px translate). Focus: `--focus-ring` (3px signal
halo), always visible for keyboard users.

**Transparency & blur.** Used only for overlays: modal scrims (`ink-900` at
~45%), sticky-header backdrop blur on scroll. Not decorative.

**Cards.** White surface, 1px `--border-default`, 8px radius, `--shadow-xs/sm`,
generous internal padding (`--space-6/7`). Canvas cards and what-if cards are
selectable: selected = `--accent` border + `--accent-tint` background.

---

## 4 · Iconography

YearOne uses **[Lucide](https://lucide.dev)** — a clean, consistent 24px stroke
icon set (1.75–2px stroke, rounded joins) that matches the geometric-grotesk,
technical-but-warm aesthetic. It is loaded from CDN in cards and kits:

```html
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
<i data-lucide="calendar-clock"></i>
<script>lucide.createIcons();</script>
```

> **Substitution flag:** Lucide is a chosen match, not an extracted brand set
> (none existed). It is the recommended icon system for YearOne. If the team
> later commissions custom icons, swap them in and keep the stroke weight.

**Usage rules.** Icons are functional, not decorative — pair with a label in
nav and actions. Stroke icons only (no filled/duotone). Default
`--text-muted`; `--accent` only when the icon marks an agent action or active
state. Status icons map to semantic color: `circle-check` (done/green),
`clock`/`calendar-clock` (upcoming/amber), `alert-triangle` (overdue/red),
`search-check` (agent-found / "dohledáno", in signal blue). **No emoji. No
unicode glyphs as icons. Never use `sparkles` or other generic "AI" glyphs —
the agent's identity is the YearOne mark, and agent actions read functionally
(`search-check` = looked up, `git-branch` = what-if, the dot-grid = thinking).**
Common icons: `calendar-clock`, `file-check-2`, `building-2`,
`users`, `landmark`, `shield-check`, `git-branch` (what-if), `search-check`
(agent-found), `circle-check`, `circle-dashed` (pending), `search`, `arrow-right`.

The YearOne **mark** (`assets/yearone-mark.svg`) is the agent's identity glyph
— it renders inside `<Avatar agent />` and is used wherever the agent "speaks"
or is working. The signature **agent-thinking** indicator is the `AgentThinking`
3×3 pulsing dot-grid (never a spinning circle).

---

## 5 · Index / manifest

**Root**
- `styles.css` — global entry; `@import` manifest only. Consumers link this.
- `readme.md` — this guide.
- `SKILL.md` — Agent-Skill front matter for use in Claude Code.

**`tokens/`** — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`,
`elevation.css` (radius + shadow + motion), `base.css` (element resets +
`.yo-*` helpers).

**`assets/`** — `yearone-mark.svg`, `yearone-mark-mono.svg`,
`yearone-wordmark.svg`, `yearone-wordmark-inverse.svg`.

**`guidelines/`** — foundation specimen cards (Type, Colors, Spacing, Brand)
shown in the Design System tab.

**`components/`** — reusable React primitives. Each has `<Name>.jsx`,
`<Name>.d.ts`, `<Name>.prompt.md`; one `*.card.html` per group. Mount via
`window.YearOneDesignSystem_5121e2`.
- `core/` — `Button`, `IconButton`, `Badge`, `Avatar` (renders the agent mark).
- `forms/` — `Input`, `Textarea`, `Select`, `Checkbox`, `Switch`.
- `display/` — `Card` (incl. selectable canvas/what-if variant), `Tabs`, `Tag`.
- `feedback/` — `Toast`, `Tooltip`, `AgentThinking` (the dot-grid indicator).

**`ui_kits/`** — full-screen product recreations:
- `app/` — the YearOne product: Guidance Canvas → agentic pipeline → Plan +
  timeline → What-if simulator. `index.html` is the click-through.
- `marketing/` — the YearOne landing page (`index.html`).

---

## 6 · Caveats & open questions

- **Identity is original.** No prior logo, fonts, codebase, or Figma existed —
  the wordmark/mark, color, type, and components are all proposals built to the
  brief. **Fonts** (Space Grotesk / Hanken Grotesk / JetBrains Mono) are loaded
  from Google Fonts; if you have brand fonts, send them and I'll swap the
  `@font-face` closure. **Logo** is a placeholder mark (orbit + node) — happy
  to iterate or replace with a commissioned logo.
- **Icons** use Lucide (CDN), a chosen match, not a brand set. Agent actions use
  functional glyphs (`search-check`, `git-branch`) + the dot-grid — never
  `sparkles`-style "AI" clichés (per review feedback).
- **Product copy** is Czech and illustrative (fake company, obligations, dates).
  Verify legal/obligation wording with a domain expert before any real use.

> **Help me make it perfect:** (1) Send real **brand fonts + logo** if they
> exist, or tell me a direction to push the placeholder mark. (2) Confirm the
> **signal-blue accent** (`#3A56E8`) and amber are right, or name a different
> brand color. (3) Tell me which **product screens** matter most so I can deepen
> the app kit (e.g. notifications, accountant multi-client view, settings).
