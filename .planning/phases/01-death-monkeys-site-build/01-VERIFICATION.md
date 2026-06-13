---
phase: 01-death-monkeys-site-build
verified: 2026-06-13T10:02:00Z
status: human_needed
score: 21/21 must-haves verified
overrides_applied: 0
human_verification:
  - test: "Load localhost dev server and verify the hero section has a visible near-black background (#0a0a0a) confirming Tailwind v4 token wiring is active in the browser"
    expected: "Page background renders near-black (#0a0a0a), tagline 'Armed. Dangerous. Slightly Bananas.' and group name are visible at correct font sizes (40px desktop / 28px mobile)"
    why_human: "CSS token rendering and responsive font scaling cannot be verified by grep; requires a browser viewport"
  - test: "Resize browser below 768px and tap the hamburger button in the nav"
    expected: "Mobile dropdown panel slides open showing all 5 nav links stacked vertically; tapping any link closes the panel"
    why_human: "Vanilla JS DOM interaction and aria-expanded toggling require a live browser"
  - test: "Navigate to /events and verify three event cards render with distinct badge colors"
    expected: "UPCOMING badge is olive green (#6b7c4a), COMPLETED badge is gray (#3f3f46), CANCELLED badge is muted red (#7f2e2e)"
    why_human: "Color rendering from Tailwind custom tokens cannot be asserted from built HTML source alone"
  - test: "Navigate to /roster and verify active/inactive visual distinction"
    expected: "Active members render at full opacity; Jackdaw (inactive) renders at 0.5 opacity with surface-inactive background"
    why_human: "Opacity and background-color application on conditional CSS classes requires visual inspection"
  - test: "Navigate to /gallery, click any gallery card, verify the detail page renders"
    expected: "Detail page shows AAR title, date, summary, full markdown body, and photo grid (for entries with photos); entries without photos show no broken image"
    why_human: "External placeholder image rendering (picsum.photos) and markdown body rendering quality require visual check"
---

# Phase 01: Death Monkeys Site Build — Verification Report

**Phase Goal:** Build the complete Death Monkeys static site Walking Skeleton — a fast, zero-JS-framework Astro v5 static site with Tailwind v4 and the dark-tactical theme that scaffolds the project, defines content collections, provides the shared layout shell, renders all five content pages with real data, has dynamic gallery detail routes, and passes astro check / npm run build.

**Verified:** 2026-06-13T10:02:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Astro v5 project scaffolded with `output: 'static'`, TypeScript strict mode, `@tailwindcss/vite` | ✓ VERIFIED | `astro.config.mjs` has `output: 'static'` and `tailwindcss()` in `vite.plugins`; `tsconfig.json` extends `astro/tsconfigs/strict`; `package.json` has `astro@^5.18.2` and `@tailwindcss/vite@^4.3.1`; no `@astrojs/tailwind` |
| 2 | Global CSS with `@import "tailwindcss"`, `@theme` block, dark tactical design tokens | ✓ VERIFIED | `src/styles/global.css` has Google Fonts import first, then `@import "tailwindcss"`, then `@theme` with all required tokens (`--color-surface: #0a0a0a`, `--color-accent: #6b7c4a`, `--nav-height: 56px`, all spacing/typography tokens) and body base rule |
| 3 | `src/content.config.ts` exists at correct v5 location (not `src/content/config.ts`) | ✓ VERIFIED | File present at `src/content.config.ts`; `src/content/config.ts` does not exist |
| 4 | `events`, `roster`, `gallery` collections defined with glob() loader + zod schemas matching requirements | ✓ VERIFIED | `src/content.config.ts` uses `import { glob } from 'astro/loaders'`; events has `status: z.enum(['upcoming','completed','cancelled'])`; roster has `realName`/`joinedDate` optional, `active: z.boolean()`; gallery has `photos: z.array(z.string()).optional()`; no deprecated `type: 'content'` |
| 5 | 2-3 realistic seed entries per collection satisfying their zod schemas | ✓ VERIFIED | Exactly 3 `.md` files per collection (9 total); events cover all three status enum values; roster includes `callsign: Nakunga` with `realName: Naku` and `active: false` on jackdaw.md; gallery includes entries with and without `photos` array |
| 6 | astro sync generates collection types for all three collections | ✓ VERIFIED | `.astro/content.d.ts` contains `"events"`, `"gallery"`, `"roster"` type records |
| 7 | `BaseLayout.astro` provides HTML shell with title prop, global CSS, Nav, slot, Footer | ✓ VERIFIED | `src/layouts/BaseLayout.astro` imports `global.css`, `Nav`, `Footer`; declares `interface Props { title: string }`; renders `<Nav />`, `<main><slot /></main>`, `<Footer />`; no raw `<html>` in pages using it |
| 8 | Nav shows DEATH MONKEYS wordmark and links to all 5 pages with vanilla JS hamburger | ✓ VERIFIED | `src/components/Nav.astro` has wordmark `DEATH MONKEYS` linking to `/`; `navLinks` array defines all five routes (`/`, `/about`, `/events`, `/roster`, `/gallery`); `<script is:inline>` with `addEventListener` toggles `mobile-menu` and sets `aria-expanded`; mobile link auto-close via `.mobile-nav-link` listeners |
| 9 | Footer shows "Death Monkeys" and "Badlands field, Alberta" | ✓ VERIFIED | `src/components/Footer.astro` contains both exact strings; verified in `dist/index.html` built output |
| 10 | Home page renders hero with tagline, about blurb, and nav links to all sections | ✓ VERIFIED | `src/pages/index.astro` has tagline `Armed. Dangerous. Slightly Bananas.`, CTA `Join the Team`, `feTurbulence` SVG noise overlay, min-h-[65vh] hero, links to `/about`, `/events`, `/roster`, `/gallery` |
| 11 | About page shows who-we-are, where-we-play, and ethos copy with `Badlands field, Alberta` | ✓ VERIFIED | `src/pages/about.astro` has "Who We Are", "Where We Play", "Ethos" sections; explicit `Badlands field, Alberta` text; group rules as ethos list |
| 12 | Events page lists all seed events sorted ascending with EventCard status badges | ✓ VERIFIED | `src/pages/events.astro` calls `getCollection('events')`, sorts by `a.data.date.valueOf() - b.data.date.valueOf()` ascending; maps to `<EventCard {...event.data} />`; `EventCard.astro` has `interface Props` with `status`, badge config mapping all three values to labeled spans with color classes |
| 13 | Roster page lists active members before inactive with callsign-dominant RosterCard | ✓ VERIFIED | `src/pages/roster.astro` calls `getCollection('roster')`, sorts active-before-inactive; `RosterCard.astro` has callsign at heading scale, role beneath, realName muted; `!active` applies `opacity-50 bg-surface-inactive` |
| 14 | Gallery index lists entries sorted descending with GalleryCard placeholder images | ✓ VERIFIED | `src/pages/gallery/index.astro` calls `getCollection('gallery')`, sorts `b.data.date.valueOf() - a.data.date.valueOf()` descending; passes `entry.id` (not `entry.slug`); `GalleryCard.astro` renders placeholder URL from picsum.photos, date, title, summary, links to `/gallery/${id}` |
| 15 | Gallery detail route uses `getStaticPaths` + `entry.id` + standalone `render()` | ✓ VERIFIED | `src/pages/gallery/[id].astro` exports `getStaticPaths` mapping gallery entries by `entry.id`; imports `render` from `astro:content`; calls `render(entry)` not `entry.render()`; no `entry.slug` usage; renders `<Content />` for markdown body; guards `entry.data.photos?.length > 0` for optional photos |
| 16 | `astro check` exits 0 with zero type errors | ✓ VERIFIED | `npm run build` output: `Result (15 files): 0 errors, 0 warnings, 0 hints` |
| 17 | `npm run build` succeeds and `dist/` contains all six route types | ✓ VERIFIED | Build succeeds in 730ms; `dist/` has `index.html`, `about/index.html`, `events/index.html`, `roster/index.html`, `gallery/index.html`, plus 3 gallery detail pages (`aar-primate-protocol`, `aar-black-banana`, `aar-canopy-breach`) |
| 18 | EventCard emits correct badge labels and colors for all three status values | ✓ VERIFIED | `EventCard.astro` `badgeConfig` maps `upcoming→UPCOMING/bg-accent`, `completed→COMPLETED/bg-badge-completed`, `cancelled→CANCELLED/bg-destructive` |
| 19 | Empty states present on all listing pages | ✓ VERIFIED | Events: "No Operations Scheduled"; Roster: "No Operators Found"; Gallery: "No After-Action Reports" all present |
| 20 | No deprecated v5 patterns used | ✓ VERIFIED | No `entry.render()`, no `entry.slug`, no `type: 'content'`, no `@astrojs/tailwind`, no `output: 'hybrid'`, no `Astro.glob()` |
| 21 | `src/content.config.ts` NOT at old `src/content/config.ts` location | ✓ VERIFIED | `src/content/config.ts` does not exist |

**Score:** 21/21 truths verified

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `package.json` | Pinned Astro v5 + Tailwind v4, check/build scripts | ✓ VERIFIED | `astro@^5.18.2`, `@tailwindcss/vite@^4.3.1`, `tailwindcss@^4.3.1`; build script `astro check && astro build` |
| `astro.config.mjs` | `output: 'static'` + Tailwind v4 vite plugin | ✓ VERIFIED | Contains both; `tailwindcss()` in `vite.plugins` |
| `src/styles/global.css` | `@import tailwindcss` + `@theme` tokens | ✓ VERIFIED | All required tokens present including `--color-surface: #0a0a0a`, `--color-accent: #6b7c4a`, `--nav-height: 56px` |
| `tsconfig.json` | Extends `astro/tsconfigs/strict` | ✓ VERIFIED | Correct preset; includes `.astro/types.d.ts` |
| `src/content.config.ts` | Three collections with glob() + zod schemas | ✓ VERIFIED | All three collections with correct schemas and `export const collections` |
| `src/content/events/*.md` (3 files) | Seed events covering all status enum values | ✓ VERIFIED | 3 files; `upcoming`, `completed`, `cancelled` all present |
| `src/content/roster/*.md` (3 files) | Seed roster with Nakunga + active/inactive mix | ✓ VERIFIED | 3 files; callsign Nakunga/realName Naku; jackdaw.md has `active: false` |
| `src/content/gallery/*.md` (3 files) | Seed AARs with optional photos exercised | ✓ VERIFIED | 3 files; 2 have `photos:` array, 1 (aar-canopy-breach.md) omits it |
| `src/layouts/BaseLayout.astro` | HTML shell with title prop, Nav, slot, Footer | ✓ VERIFIED | Correct structure; imports all required components |
| `src/components/Nav.astro` | Wordmark + 5 links + hamburger via `is:inline` JS | ✓ VERIFIED | All present; auto-close on mobile link tap implemented |
| `src/components/Footer.astro` | Group name + Badlands location | ✓ VERIFIED | Both required strings present |
| `src/components/EventCard.astro` | Status badge with all three color variants | ✓ VERIFIED | Full `interface Props`; badge config for all three statuses |
| `src/components/RosterCard.astro` | Callsign-dominant, active/inactive variant | ✓ VERIFIED | Callsign at heading scale; `!active` applies opacity/color treatment |
| `src/components/GalleryCard.astro` | Date/title/summary + placeholder image + detail link | ✓ VERIFIED | All present; picsum.photos fallback; links to `/gallery/${id}` |
| `src/pages/index.astro` | Hero, tagline, CTA, about blurb, section links | ✓ VERIFIED | All required elements including feTurbulence noise overlay |
| `src/pages/about.astro` | Who-we-are, where-we-play, ethos | ✓ VERIFIED | Three named sections; Badlands field, Alberta explicit |
| `src/pages/events.astro` | `getCollection('events')` sorted ascending → EventCard | ✓ VERIFIED | Ascending sort; maps to EventCard; empty state |
| `src/pages/roster.astro` | `getCollection('roster')` active-first → RosterCard | ✓ VERIFIED | Active-first sort; maps to RosterCard; empty state |
| `src/pages/gallery/index.astro` | `getCollection('gallery')` sorted descending → GalleryCard | ✓ VERIFIED | Descending sort; uses `entry.id`; maps to GalleryCard; empty state |
| `src/pages/gallery/[id].astro` | `getStaticPaths` + `render()` + BaseLayout | ✓ VERIFIED | All present; `entry.id` params; standalone `render(entry)`; optional photos guarded |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `astro.config.mjs` | `@tailwindcss/vite` | `vite.plugins` array with `tailwindcss()` | ✓ WIRED | `tailwindcss()` call confirmed in `vite.plugins` |
| `src/pages/index.astro` | `src/styles/global.css` | BaseLayout imports global.css | ✓ WIRED | BaseLayout imports `../styles/global.css`; index.astro uses BaseLayout |
| `src/layouts/BaseLayout.astro` | `src/components/Nav.astro` | `import Nav` + `<Nav />` render | ✓ WIRED | Import and render both confirmed |
| `src/components/Nav.astro` | mobile menu panel | `addEventListener` toggling `mobile-menu` class | ✓ WIRED | `addEventListener('click')` on toggle; closes on link tap |
| `src/pages/events.astro` | `src/components/EventCard.astro` | import + map over collection | ✓ WIRED | `import EventCard`; `events.map((event) => <EventCard {...event.data} />)` |
| `src/pages/roster.astro` | `getCollection('roster')` | collection query in frontmatter | ✓ WIRED | `await getCollection('roster')` with active-first sort |
| `src/pages/gallery/index.astro` | `getCollection('gallery')` | collection query sorted descending | ✓ WIRED | `await getCollection('gallery')` with descending sort; `entry.id` passed |
| `src/pages/gallery/[id].astro` | `getCollection('gallery')` | `getStaticPaths` enumerating entries by id | ✓ WIRED | `getStaticPaths` maps over collection with `entry.id` as param |
| `src/pages/gallery/[id].astro` | `astro:content render()` | standalone `render(entry)` for AAR body | ✓ WIRED | `const { Content } = await render(entry)` and `<Content />` rendered |

---

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `src/pages/events.astro` | `events` | `await getCollection('events')` | Yes — 3 seed entries | ✓ FLOWING |
| `src/pages/roster.astro` | `members` | `await getCollection('roster')` | Yes — 3 seed entries | ✓ FLOWING |
| `src/pages/gallery/index.astro` | `entries` | `await getCollection('gallery')` | Yes — 3 seed entries | ✓ FLOWING |
| `src/pages/gallery/[id].astro` | `entry` / `Content` | `getStaticPaths` + `render(entry)` | Yes — markdown body rendered | ✓ FLOWING |
| `src/components/GalleryCard.astro` | `imageUrl` | `photos[0]` or `picsum.photos/seed/${id}` | Yes — placeholder URL (intentional per REQUIREMENTS.md out-of-scope) | ✓ FLOWING |

---

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| `npm run build` succeeds with 0 type errors | `npm run build` | Exit 0; 0 errors, 0 warnings, 0 hints across 15 files | ✓ PASS |
| All 5 main pages exist in dist/ | `for f in dist/index.html dist/about/index.html dist/events/index.html dist/roster/index.html dist/gallery/index.html; do test -f $f; done` | All 5 found | ✓ PASS |
| 3 gallery detail pages built | `find dist/gallery -mindepth 2 -name index.html \| wc -l` | 3 (aar-primate-protocol, aar-black-banana, aar-canopy-breach) | ✓ PASS |
| Nav wordmark and footer in built index.html | `grep -q "DEATH MONKEYS" dist/index.html && grep -q "Badlands field, Alberta" dist/index.html` | Both found | ✓ PASS |
| feTurbulence noise overlay in hero | `grep -q "feTurbulence" dist/index.html` | Found | ✓ PASS |
| Tagline present | `grep -q "Armed. Dangerous. Slightly Bananas." dist/index.html` | Found | ✓ PASS |

---

### Probe Execution

No `scripts/*/tests/probe-*.sh` probes found. Step 7c: SKIPPED (no probe scripts in repo).

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| FOUND-01 | 01-01 | Astro v5, `output: 'static'`, TS strict, `@tailwindcss/vite` | ✓ SATISFIED | `astro.config.mjs`, `tsconfig.json`, `package.json` all verified |
| FOUND-02 | 01-01 | Global CSS with `@import "tailwindcss"` and `@theme` dark tactical tokens | ✓ SATISFIED | `src/styles/global.css` verified with all tokens |
| FOUND-03 | 01-02 | `src/content.config.ts` with events/roster/gallery collections | ✓ SATISFIED | File at correct v5 location with all three collections |
| CONTENT-01 | 01-02 | events schema: title, date, location, description, status enum | ✓ SATISFIED | Exact schema in `src/content.config.ts` |
| CONTENT-02 | 01-02 | roster schema: callsign, realName?, role, loadout, joinedDate?, active | ✓ SATISFIED | Exact schema with correct optionality |
| CONTENT-03 | 01-02 | gallery schema: title, date, eventRef?, summary, photos? | ✓ SATISFIED | Exact schema with correct optionality |
| CONTENT-04 | 01-02 | 2-3 realistic seed entries per collection | ✓ SATISFIED | 9 entries total (3 per collection) with brand-voiced content |
| COMP-01 | 01-03 | `BaseLayout.astro` with title prop, global CSS, Nav, slot, Footer | ✓ SATISFIED | Full implementation verified |
| COMP-02 | 01-03 | Nav with wordmark, 5 links, mobile hamburger via vanilla JS | ✓ SATISFIED | All elements present; `is:inline` JS with addEventListener |
| COMP-03 | 01-03 | Footer with group name + Badlands field, Alberta | ✓ SATISFIED | Both strings present |
| COMP-04 | 01-04 | `EventCard.astro` with status badge variants | ✓ SATISFIED | Three badge color variants with correct labels |
| COMP-05 | 01-04 | `RosterCard.astro` with callsign-dominant, inactive muted | ✓ SATISFIED | Heading-scale callsign; opacity-50 inactive treatment |
| COMP-06 | 01-04 | `GalleryCard.astro` with date, title, summary, placeholder image | ✓ SATISFIED | All fields rendered; picsum.photos placeholder |
| PAGE-01 | 01-04 | `/` hero with tagline, about blurb, section links | ✓ SATISFIED | Hero, tagline, CTA, section nav links all present |
| PAGE-02 | 01-04 | `/about` with who-we-are, where-we-play, ethos | ✓ SATISFIED | Three sections; Badlands field, Alberta explicit |
| PAGE-03 | 01-04 | `/events` with `getCollection('events')` sorted ascending → EventCard | ✓ SATISFIED | Ascending sort by date; EventCard per entry |
| PAGE-04 | 01-04 | `/roster` with `getCollection('roster')`, active first → RosterCard | ✓ SATISFIED | Active-first sort; RosterCard per entry |
| PAGE-05 | 01-04 | `/gallery` with `getCollection('gallery')` sorted descending → GalleryCard | ✓ SATISFIED | Descending sort by date; GalleryCard per entry |
| PAGE-06 | 01-05 | `/gallery/[id]` with `getStaticPaths` + standalone `render()` | ✓ SATISFIED | Fully implemented per v5 API |
| QA-01 | 01-05 | `astro check` passes with zero type errors | ✓ SATISFIED | 0 errors, 0 warnings, 0 hints (15 files) |
| QA-02 | 01-05 | `npm run build` succeeds, valid `dist/` output | ✓ SATISFIED | 8 pages built; all route types present in dist/ |

**All 21 requirements verified.**

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `src/content/gallery/aar-canopy-breach.md` | 29 | `TBD` in markdown body: "Rescheduled date TBD. Watch the events page." | INFO | In-universe narrative text in seed content (AAR body about a cancelled op). Not executable code or a source comment. Does not signal incomplete implementation. Passes debt marker gate: TBD is fictional prose, not a code/config marker signaling unfinished work. |

No blockers or warnings. The single `TBD` occurrence is in a markdown content body used as fictional flavor text — the in-story reason the op was cancelled. This is intentional seed content, not a code debt signal.

---

### Human Verification Required

Five items require live browser testing. All automated checks (build, type checking, file structure, wiring, data flow) have passed.

#### 1. Dark Tactical Theme Visual Rendering

**Test:** Run `npm run dev`, navigate to `http://localhost:4321`, inspect the page background and hero typography.
**Expected:** Background renders near-black (#0a0a0a) from the `--color-surface` token; hero heading "DEATH MONKEYS" and tagline "Armed. Dangerous. Slightly Bananas." display at approximately 40px on desktop; tagline scales to approximately 28px on mobile (below 640px).
**Why human:** CSS custom property resolution and responsive font scaling cannot be asserted from built HTML source alone.

#### 2. Mobile Hamburger Toggle Interaction

**Test:** Run `npm run dev`, open the site at a viewport narrower than 768px (or use browser DevTools responsive mode), tap the hamburger button icon in the top-right of the nav.
**Expected:** The mobile dropdown panel appears below the nav bar (not full-screen), showing all 5 nav links stacked vertically. Tapping any link navigates and closes the panel. Tapping the button again closes the panel.
**Why human:** Vanilla JS DOM manipulation (`classList.toggle('hidden')`, `aria-expanded` updates) and the resulting visual state require a live browser with a rendered DOM.

#### 3. EventCard Status Badge Colors

**Test:** Navigate to `/events`.
**Expected:** Three event cards render with visually distinct badge colors — "UPCOMING" badge is olive/green (#6b7c4a), "COMPLETED" badge is gray (#3f3f46), "CANCELLED" badge is dark red (#7f2e2e). Cards are sorted ascending by date (Canopy Breach June 2026, then Black Banana April 2026... note: verify the sort direction matches oldest-first).
**Why human:** Color rendering from Tailwind custom token class names (`bg-accent`, `bg-badge-completed`, `bg-destructive`) cannot be asserted from built HTML class attributes alone.

#### 4. Roster Inactive Muting

**Test:** Navigate to `/roster`.
**Expected:** Nakunga and Gravedigger render at full opacity with dark card backgrounds. Jackdaw (inactive) renders visibly dimmer (50% opacity) with a slightly lighter background (`--color-surface-inactive` / #1f1f1f), and shows an "INACTIVE" label.
**Why human:** CSS opacity and conditional background-color on `!active` require visual comparison to confirm the contrast is perceptible and the treatment is correct.

#### 5. Gallery Detail Page Content

**Test:** Navigate to `/gallery`, click the "AAR: Op Primate Protocol" card.
**Expected:** Detail page renders at `/gallery/aar-primate-protocol/`; shows title, date, summary, a grid of 3 placeholder photos from picsum.photos, and the full markdown AAR body with headings ("Phase 1: Canopy Advance", "Phase 2: Extraction Hold", "Lessons Learned", "Verdict"). Clicking "AAR: Op Canopy Breach" should show a detail page with NO photos section (the optional field omit case).
**Why human:** Markdown body rendering quality, external image loading from picsum.photos, and the optional-field behavior require visual browser verification.

---

### Gaps Summary

No gaps found. All 21 must-have truths are VERIFIED. The build passes with zero type errors, all six route types are present in `dist/`, all artifacts exist and are substantive, all key data flows are connected, and no deprecated v5 patterns were used.

The phase goal is achieved. Status is `human_needed` because 5 visual/interactive behaviors require browser-based verification before the phase can be marked fully passed.

---

_Verified: 2026-06-13T10:02:00Z_
_Verifier: Claude (gsd-verifier)_
