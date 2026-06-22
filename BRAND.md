# YearOne — Design Language v1 ("Founder Bold")

The brand of the agent that turns a founder's intent into a complete, explained,
time-aware plan of their **first year** of obligations. The identity has to do two
jobs at once: feel **bold and optimistic** like a year-one founder, and feel
**trustworthy** like a public-administration tool. Founder Bold resolves that with
disciplined ink + neutrals carrying one electric, ascending accent.

Brand assets live in **`public/brand`**. A full interactive showcase can be added later.

---

## 1. Concept — "one orbit"

**YearOne = one trip around the sun.** A company's first year is one orbit: it
starts at incorporation, sweeps through deadlines and triggers, and the agent is the
**marker that watches where you are on that arc.** This single idea drives everything —
the logo, the gradient ("the ascent"), the motion, and the Now / Soon / Monitor model.

Voice: confident, plain-Czech, never legalese. *"Tvůj první rok, pod dohledem."*
The model **explains**; the rules **decide**; a **human approves**. The brand never
overclaims — optimism with a receipt.

---

## 2. Logo

A bold **orbit ring** with a gradient **ascent arc** rising to a solid **marker dot**
(the "you are here" point the agent watches), wrapped around a confident **"1"** — year
one. The open gap in the ring keeps it dynamic, mid-journey.

| Asset | File | Use |
| --- | --- | --- |
| Mark | `public/brand/yearone-mark.svg` | app icon, favicon, avatar, tight spaces |
| Lockup (light) | `public/brand/yearone-logo.svg` | default horizontal lockup |
| Lockup (dark) | `public/brand/yearone-logo-dark.svg` | on dark / photographic backgrounds |

Rules: keep clear space ≥ the mark's "1" height on all sides. The arc is **always**
the ascent gradient; never recolor it flat. Don't rotate, outline, or add a second
shadow. The marker dot may animate along the arc to show progress through the year —
that motion *is* the brand (`/design` → Logo Lab to scrub it).

Wordmark: **Year** in ink, **One** in the gradient. Display face, weight 700, tracking −0.6.

---

## 3. Color

Warm "paper" canvas + deep ink, one electric **Pulse**, and the **Ascent** gradient.
Semantic tones map 1:1 onto YearOne's obligation states.

### Brand
| Token | Hex | Meaning |
| --- | --- | --- |
| Pulse | `#5A3CF4` | primary brand / focus / links |
| Magenta | `#B14DF0` | gradient mid-stop |
| Coral | `#FF6A5A` | gradient end / the marker dot |
| **Ascent** | `linear-gradient(115deg,#6B3DF6,#B14DF0,#FF6A5A)` | hero, primary buttons, the arc |

### Semantic (= obligation states)
| Token | Hex | State |
| --- | --- | --- |
| Sprout | `#0FB888` | **Platí nyní** / Splněno / approved |
| Amber | `#F59E0B` | **Vznikne později** (deferred trigger) |
| Watch | `#2F6BFF` | **Monitorujeme** |
| Flag | `#F0453E` | **Ověřit** / danger |

### Neutrals (light)
Ink `#17130D` · Ink-2 `#5C5346` · Muted `#8A8072` · Canvas `#FAF6EF` ·
Surface `#FFFFFF` · Surface-2 `#F4EFE6` · Line `#E8E1D4`.

A full **dark theme** can use the same hues lifted for contrast on a near-black
aubergine canvas (`#0F0B15`).

---

## 4. Typography

| Role | Family | Notes |
| --- | --- | --- |
| Display | **Space Grotesk** 700/600 | huge, tight tracking (−1 to −2). Headlines, metrics, the "1". |
| Body / UI | **Inter** 400–700 | labels, prose, controls. |
| Data / Mono | **JetBrains Mono** | obligation IDs, tool-call timings, hex codes — anything machine. |

Scale (display): 64 / 44 / 30 / 22. Body: 16 base, 14 UI, 13 micro. Czech needs
`latin-ext` — both UI fonts ship it. Numbers are a brand surface: set big metrics in
the display face and let them count up on change.

---

## 5. Motion

Year-one energy = **springy, not bouncy-toy.** Default ease
`cubic-bezier(.2,.9,.25,1.2)`; settle ease `cubic-bezier(.16,1,.3,1)`.

- **Press**: scale to 0.96, spring back. **Hover**: lift 2px + soft shadow.
- **The pulse**: a 2px live dot, 1.6s breathing — status, "watching now."
- **The orbit**: the marker travels the arc to show time/progress.
- **Numbers count up** on scenario change; delta chips pop in.
- Always honor `prefers-reduced-motion` — the showcase does.

---

## 6. Components

Buttons (primary gradient / solid ink / soft / ghost), status pills, state badges,
metric tiles, obligation cards, agent audit rows, the human-approval box, scenario
chips, and the 5-step demo stepper — all rebuilt in Founder Bold. Radii: 10 / 16 / 22 /
pill. Elevation is one soft, violet-tinted shadow, never a hard border + heavy shadow.

---

*YearOne Design System v1. The working app can adopt these brand rules incrementally;
the current production UI remains optimized for the hackathon demo.*
