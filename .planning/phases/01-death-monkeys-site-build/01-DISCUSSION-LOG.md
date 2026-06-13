# Phase 1: Death Monkeys Site Build - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-12
**Phase:** 1-Death Monkeys Site Build
**Areas discussed:** Hero section treatment, Font choices, Mobile nav style, Seed data quality

---

## Hero Section Treatment

### Hero Height

| Option | Description | Selected |
|--------|-------------|----------|
| Full viewport height (100vh) | Cinematic, immersive first impression | |
| Tall but not full (60–70vh) | Substantial but lets content peek below | ✓ |
| Compact banner (~300px) | Efficient, content-first | |

**User's choice:** 60–70vh

---

### Hero Background

| Option | Description | Selected |
|--------|-------------|----------|
| Plain near-black (#0a0a0a) | Clean, high-contrast, text does the work | |
| Subtle noise/grain texture overlay | Tactical feel via CSS SVG filter | ✓ |
| Dark gradient | More polished/modern, less gritty | |

**User's choice:** Noise/grain texture overlay

---

### Hero Tagline

| Option | Description | Selected |
|--------|-------------|----------|
| "Alberta's Tactical Airsoft Team" | Straightforward, geographic | |
| "Tactical Airsoft — Badlands Field, Alberta" | Specific, field-focused | |
| You decide / suggest something else | Claude picks based on tone direction | ✓ |

**User's choice:** User asked for something silly leaning into the Death Monkeys vibe, not Alberta-centric.
**Claude picked:** "Armed. Dangerous. Slightly Bananas."
**Notes:** User confirmed this direction.

---

## Font Choices

### Heading Font

| Option | Description | Selected |
|--------|-------------|----------|
| JetBrains Mono (Google Fonts) | Crisp dev/tactical aesthetic, strong stencil feel | ✓ |
| System monospace stack | Zero load, inconsistent cross-OS | |
| Share Tech Mono (Google Fonts) | More military stencil, less code-y | |

**User's choice:** JetBrains Mono

---

### Body Font

| Option | Description | Selected |
|--------|-------------|----------|
| System sans-serif stack | Fast, clean on dark, no extra requests | ✓ |
| Inter (Google Fonts) | Ultra-readable, modern | |
| Same monospace as headings | Full terminal aesthetic, hard to read at body size | |

**User's choice:** System sans-serif stack

---

## Mobile Nav Style

### Nav Open Style

| Option | Description | Selected |
|--------|-------------|----------|
| Slide-down dropdown below nav bar | Contextual, standard, stays in page | ✓ |
| Full-screen overlay | Dramatic, modern | |

**User's choice:** Slide-down dropdown

---

### Auto-close on Link Click

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — auto-close on link click | Better UX, one less tap | ✓ |
| No — user closes manually | Simpler JS | |

**User's choice:** Auto-close on link click

---

## Seed Data Quality

### Roster Seed

| Option | Description | Selected |
|--------|-------------|----------|
| Use actual callsign + invented teammates | Real feel immediately | ✓ |
| All invented callsigns | Clearly placeholder | |
| User provides names | User defines callsigns | |

**User's choice:** Real callsign — **Nakunga (Naku)** as first entry, 2 invented teammates.

---

### Event/Gallery Tone

| Option | Description | Selected |
|--------|-------------|----------|
| Committed bit — real-sounding Badlands missions | Lived-in, detailed | |
| Functional placeholder — minimal | Clearly demonstrational | |

**User's choice (free text):** "Committed, but death monkeys, nothing to do with badlands"
**Notes:** Committed content with Death Monkeys brand flavor (e.g., "Op: Primate Protocol"), not Badlands/Alberta references.

---

## Claude's Discretion

- Invented teammate callsigns and roles beyond Nakunga/Naku
- Specific event dates and fictional locations
- About page copy tone (tactical-silly)
- Gallery placeholder image service selection
- Exact nav height, spacing, and Tailwind class details

## Deferred Ideas

- Mobile nav animation/transition on open/close
- Click-outside-to-close mobile nav behavior
- Dark/light theme toggle (already in v2 requirements)
