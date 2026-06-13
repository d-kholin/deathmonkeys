# Feature Landscape

**Domain:** Static team/club website (airsoft — tactical/milsim)
**Project:** Death Monkeys — Badlands field, Alberta
**Researched:** 2026-06-12

---

## Table Stakes

Features users expect. Missing = product feels incomplete or they bounce.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Persistent top navigation with all page links | Users need to know where they are and where they can go immediately | Low | Plain text labels beat icons alone; mobile hamburger required |
| Mobile-responsive layout | >50% of casual visitors use mobile; team members check from the field | Low | Design mobile-first to force prioritization |
| Fast initial load (LCP < 2.5s) | Google ranking signal; users abandon slow sites; static Astro is near-free to get right | Low | Astro's static output makes this trivially achievable if images are handled properly |
| Clear site identity on every page | Visitors need to know what this site is within 3 seconds of landing | Low | Team name + one-line description in hero or persistent header |
| Readable body text on dark background | Tactical dark theme is expected; but unreadable text breaks the whole site | Low | Off-white (#E0E0E0) not pure white; 4.5:1 contrast minimum per WCAG AA |
| Events list sorted by date | Core function; if events are buried or unsorted users give up | Low | Most recent/upcoming first; past events visually de-emphasized |
| Roster list with member names/callsigns | Team community function; new visitors want to know who they'd be joining | Low | Cards with callsign prominent, role visible |
| Gallery/AAR index | Shows the team is active and has a history; empty site feels dead | Low | Date + title + one-line summary is enough to scan |
| Footer with field location | Recruiting visitors need to know where this team operates | Low | "Badlands field, Alberta" in footer on every page |
| No broken links or placeholder errors | Amateur mistake that destroys credibility instantly | Low | Seed data must be plausible, not obviously fake |

---

## Differentiators

Features that set memorable team sites apart. Not expected, but valued when present.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Activity signals — recent event dates visible | Instantly communicates the team is alive; many team sites go stale | Low | Show most recent event date or "Last op: [date]" on homepage |
| Personality in copy — callsigns in nav, team voice | Creates community feel that generic templates can't replicate | Low | "Death Monkeys" wordmark in nav, not just "Home" |
| Status badges on events | Upcoming / Completed / Cancelled scannable at a glance without reading every entry | Low | Color-coded pill badge — olive=upcoming, gray=completed, red=cancelled |
| Role clarity on roster | Helps recruits understand team structure and where they'd fit | Low | Rifleman, Grenadier, Medic, Marksman, Squad Leader — tactical roles |
| AAR narrative summaries | Shows team takes the game seriously; far more engaging than just a photo dump | Medium | 2-4 sentences of storytelling per AAR, not just metadata |
| Semantic photo layout in gallery | Masonry or justified grid > equal-square grid for varied aspect ratio field photos | Medium | CSS-only justified grid is achievable with no JS |
| "Active" indicator on roster | Shows who is currently playing vs alumni; keeps roster honest | Low | Boolean `active` field already in content schema |
| Recruiting CTA on About page | Explicit invite for prospective players with contact info or Discord link | Low | "Looking for players? Here's how to reach us" |
| Consistent noise/texture overlay | Adds tactile depth to flat dark backgrounds without heavy imagery | Low | `background-image: url(noise.svg)` at ~3% opacity |
| Loadout notes on roster | Unique to airsoft; lets players see team equipment diversity; credibility signal | Low | 1-2 lines, not a full gear list |

---

## Anti-Features

Features to explicitly NOT build.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| User authentication / member login | Massive complexity for zero public value; team comms belong in Discord | Use Discord for team-only communication |
| Comment systems / forums | Requires moderation, spam protection, backend; goes stale fast | Discord handles community discussion |
| Dynamic event registration / RSVP | Requires server or third-party JS; overkill for a small team | Link to Discord event or Eventbrite if needed |
| Social media feed embeds | Third-party JS, GDPR exposure, slow load, breaks when API changes | Link to socials in footer; don't embed |
| Blog CMS with rich editor | Markdown content collections are already the right tool; a CMS adds auth/hosting complexity | Markdown files in `src/content/` |
| Gear store / WooCommerce | Out of scope; wrong audience for a recruiting/reference site | Omit entirely |
| Animated hero video background | Huge bandwidth cost, terrible on mobile connections in rural Alberta | Use a static hero with dark overlay on a strong photo or solid color |
| Dark/light mode toggle | The tactical aesthetic IS dark; a light mode would be jarring and adds CSS complexity | Hard-code dark theme; use CSS variables so it's easy to add later if truly needed |
| Complex JS frameworks (React/Vue) for any page component | Hydration overhead for static content with no interactivity | Vanilla JS for hamburger only; everything else pure Astro/HTML |
| Stats dashboards / win-loss records | Airsoft doesn't track formal stats; fake metrics look amateur | Qualitative AARs tell the story better |
| Infinite scroll or pagination on any list | Team will never have 50+ events; pagination adds complexity for no gain | Simple flat list; CSS `max-height` + scroll if lists somehow grow large |

---

## Content Patterns by Page

### Home Page

**Purpose:** Convert both audiences — team members (bookmark this) and recruits (learn about us).

**Must have:**
- Team name + one-line tagline as hero (e.g., "Alberta's finest trigger pullers")
- Brief who-we-are paragraph (3-4 sentences max)
- Where we play: Badlands field, Alberta — with a map link
- Links / teasers to Events, Roster, Gallery — at least one recent item from each
- Recruiting CTA: "Looking for new operators? [Contact us / Join our Discord]"

**Scan pattern:** F-pattern. Name and tagline must be in top-left zone. Critical info above the fold.

---

### About Page

**Purpose:** Builds trust and sets expectations for recruits.

**Must have:**
- Team history / founding story (even if brief)
- Play style / ethos (milsim-leaning, casual, competitive?)
- Where and when you play (Badlands field, regular op schedule)
- Team rules / code of conduct — airsoft community cares about fair play and hit-calling
- How to join — explicit CTA with contact method

**Nice to have:**
- Photo of the team at field
- Quote or motto

**Scan pattern:** Linear reading expected (About pages are high-intent). Use subheadings for each section.

---

### Events Page

**Purpose:** Quick reference for upcoming ops; historical log of past ops.

**What matters per event card (in order of visual priority):**
1. **Date** — large, prominent; ISO format for clarity (`2026-07-12`) or human format (`Jul 12, 2026`)
2. **Event name / type** — "Badlands Summer Op", "Night CQB", "Training Day"
3. **Status badge** — Upcoming / Completed / Cancelled; color-coded pill
4. **Location** — Always "Badlands, AB" but include if events vary
5. **Brief description** — 1-2 sentences; optional for past events

**Layout:** Card list, newest upcoming first, then past events in reverse-chron below a divider.

**Anti-pattern:** Do not mix upcoming and past events in a flat list without visual separation — users want to know what's next immediately.

**Status field from schema:** `status: 'upcoming' | 'completed' | 'cancelled'` — use this for CSS badge classes.

---

### Roster Page

**Purpose:** Community reference for members; credibility/culture signal for recruits.

**What matters per roster card (in order of visual priority):**
1. **Callsign** — the primary identity in airsoft; larger than real name
2. **Role** — Rifleman, Grenadier, Medic, Designated Marksman, Squad Leader, etc.
3. **Real name** — secondary, smaller, optional to display at all
4. **Active status** — visual indicator (full color vs muted/greyed for inactive)
5. **Loadout notes** — 1-2 lines, e.g., "HK416 MWS, FAST helmet, plate carrier"
6. **Joined date** — nice-to-have; shows tenure

**Layout:** Grid of cards. Active members first, separated from alumni.

**What NOT to include:** Photos of real people (introduces PII maintenance burden), stats, win records, personal contact info.

**Schema fields already correct:** `callsign, realName, role, loadout, joinedDate, active` — all appropriate.

---

### Gallery / AARs Page (Index)

**Purpose:** Proves the team is active; showcases culture to recruits.

**What matters per gallery card (in order of visual priority):**
1. **Date** — when this op happened
2. **Title** — e.g., "Operation Sandstorm — AAR"
3. **Event reference** — link back to the event entry if available
4. **Summary / lead paragraph** — 2-4 sentences of narrative; what happened, what was the outcome
5. **Cover photo / thumbnail** — even a placeholder; visual hook
6. **Photo count indicator** — "12 photos" tells visitors whether to click

**Layout:** List of cards (not a grid of thumbnails) — the summary text is the value here, not the images alone.

---

### Gallery Detail Page (`/gallery/[slug]`)

**Purpose:** Full AAR narrative + photos for a single op.

**Structure:**
1. Title + date at top
2. Narrative summary — 2-4 paragraphs (situation, execution, outcome, lessons)
3. Photo grid below narrative — CSS justified grid or masonry, no JS required
4. Link back to Events entry for this op
5. "Previous / Next" AAR navigation (nice-to-have, adds no complexity with `getCollection` in Astro)

**Photo handling:** Placeholder image URLs for now. Astro's `<Image>` component handles optimization automatically when real images are added.

---

## Tactical Aesthetic Design Principles

### Color System

| Role | Value | Notes |
|------|-------|-------|
| Background (primary) | `#0a0a0a` | Near-black, not pure black; avoids halation on OLED |
| Background (surface/card) | `#141414` or `#1a1a1a` | Elevation via lighter gray layers, not shadows |
| Background (elevated/hover) | `#222222` | Third level for modals, active states |
| Body text | `#e0e0e0` | Off-white; pure white (#fff) causes halation on dark bg |
| Muted text (secondary) | `#8a8a8a` | Dates, captions, secondary labels |
| Accent (primary) | `#6b7c4a` or `#8a8a5c` | Muted olive green — desaturated from pure green to avoid neon |
| Accent (alt) | `#b89a6a` | Tactical tan — use for hover states or secondary accent |
| Status: Upcoming | `#6b7c4a` (olive) | Matches primary accent |
| Status: Completed | `#4a4a4a` (gray) | De-emphasizes past events |
| Status: Cancelled | `#7c3a3a` (muted red) | Warning without being garish |

**Critical rule:** Never use saturated colors (`#00ff00`, `#ff0000`) in the UI. Desaturate all accents by 40-60% for a credible tactical look.

### Typography

**Headings:** Monospace or stencil-adjacent font — conveys precision, military comms aesthetic.
- Recommended: `JetBrains Mono`, `Space Mono`, `IBM Plex Mono` — all available via Google Fonts
- Alternative: `Oswald` (condensed sans-serif) for display headings if monospace feels too heavy
- Letter-spacing: `0.05em` to `0.1em` for headings — adds the "stamped" feel
- Transform: `uppercase` on H1/H2 is authentic to the aesthetic; use sparingly below H2

**Body:** Clean sans-serif — readability over personality for running text.
- Recommended: `Inter`, `IBM Plex Sans` — both optimized for screen readability
- Font weight: `400` for body, `500` or `600` for UI labels
- Line height: `1.6` to `1.7` — compensate for light-on-dark legibility
- Letter spacing: `0.01em` to `0.02em` on body text in dark mode

**Key rule from research:** Light text on dark backgrounds appears optically thinner. Increase font weight by one step vs what you'd use on a light theme. Never use weights below 400 (`font-thin`, `font-extralight`) in dark mode.

### Texture and Depth

- Subtle noise texture at 2-4% opacity on backgrounds adds tactile depth (1KB SVG or CSS-generated)
- Border treatment: thin `1px solid rgba(255,255,255,0.08)` on cards rather than box-shadows
- Dividers: `border-top: 1px solid rgba(255,255,255,0.06)` — barely-there separator lines
- Avoid: gradient overlays that look like stock template gradients

### Spacing and Layout

- Generous whitespace (Tailwind `gap-8`, `py-16`) — sparse layouts read as intentional, not empty
- Full-width hero with constrained content max-width (`max-w-5xl` or `max-w-4xl`)
- Card borders: rounded-none or `rounded-sm` (1-2px) — sharp edges suit tactical aesthetic better than `rounded-xl`

---

## Feature Dependencies

```
Roster cards → Content collection schema (callsign, role, active)
Event cards → Content collection schema (date, status, title)
Gallery index → Content collection schema (date, title, summary, eventRef)
Gallery detail → Gallery index (slug routing)
Status badges → Event cards (status field)
Gallery detail photo grid → Astro Image component
BaseLayout → All pages (nav, footer, head)
Nav hamburger → BaseLayout (vanilla JS, mobile only)
```

---

## MVP Recommendation

**Prioritize (ship together as Phase 1):**
1. BaseLayout with nav (hamburger), footer, dark design system tokens
2. Home page with hero, about blurb, teaser sections, recruiting CTA
3. Events page — card list with date, title, status badge
4. Roster page — card grid with callsign, role, active indicator
5. Gallery index — card list with date, title, summary
6. Gallery detail — narrative + photo grid
7. Seed data: 2-3 entries per collection, realistic placeholders

**Defer entirely:**
- Any form of user interaction beyond nav hamburger
- Real image assets (placeholder URLs throughout)
- Social media embeds
- Dark/light mode toggle

**One differentiator to include in Phase 1** (low effort, high signal):
- Status badges on event cards — `upcoming` (olive) / `completed` (gray) / `cancelled` (muted red). This is the single highest-ROI feature beyond the basics: it makes the Events page instantly scannable and shows design thoughtfulness.

---

## Sources

- Navigation UX patterns: [Navigation Design Patterns - Justinmind](https://www.justinmind.com/blog/navigation-design-almost-everything-you-need-to-know/)
- Sports team website UX: [Understanding UX for Sports Team Websites - ThemeBoy](https://www.themeboy.com/blog/understanding-ux-sports-team-websites/)
- Dark theme design guide: [Dark Theme Design Guide - Align](https://www.align.vn/blog/dark-theme-website-design-guide/)
- Dark mode typography: [Typography in Dark Mode - Design Shack](https://designshack.net/articles/typography/dark-mode-typography/)
- Dark mode best practices: [Dark Mode Design Best Practices 2026](https://www.tech-rz.com/blog/dark-mode-design-best-practices-in-2026/)
- Event listing UX: [Event Listing Best Practices - Eventbrite](https://www.eventbrite.com/blog/event-listing-best-practices/)
- Core Web Vitals: [Core Web Vitals Guide - web.dev](https://web.dev/articles/vitals)
- Milsim roster features: [Military & Milsim Unit Roster Management - FiveRoster](https://fiveroster.com/use-cases/military-milsim)
- Airsoft team website advice: [Airsoft Website thread - Airsoft Society](https://www.airsoftsociety.com/threads/airsoft-website.63577/)
- Airsoft team roles: [Starting an Airsoft Team - Redwolf Airsoft](https://www.redwolfairsoft.com/blog/starting-an-airsoft-team)
- Astro gallery patterns: [How to build a simple photo gallery with Astro - Jan Kraus](https://jankraus.net/2024/04/05/how-to-build-a-simple-photo-gallery-with-astro/)
- Military typography: [25 Military Fonts - Design Work Life](https://designworklife.com/military-fonts-command-attention/)
