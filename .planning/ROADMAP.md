# Roadmap — Death Monkeys Site

## Overview

A single-phase build that delivers a complete, static Astro v5 team website for the Death Monkeys airsoft group. The phase progresses in five vertical plans, each leaving the project in a working, buildable state: scaffold and config first, then content schemas, then layout and shared components, then all pages with their card components, and finally the dynamic gallery detail route plus QA gates.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Death Monkeys Site Build** - Complete static Astro site with all pages, content collections, components, and tactical dark design (completed 2026-06-13)

## Phase Details

### Phase 1: Death Monkeys Site Build

**Goal:** Complete static Astro site with all pages, content collections, components, and tactical dark design
**Mode:** mvp
**Depends on:** Nothing (first phase)
**Requirements:** FOUND-01, FOUND-02, FOUND-03, CONTENT-01, CONTENT-02, CONTENT-03, CONTENT-04, COMP-01, COMP-02, COMP-03, COMP-04, COMP-05, COMP-06, PAGE-01, PAGE-02, PAGE-03, PAGE-04, PAGE-05, PAGE-06, QA-01, QA-02
**Success Criteria** (what must be TRUE):

  1. All six pages (/, /about, /events, /roster, /gallery, /gallery/[id]) render in the browser with the dark tactical design and no broken links
  2. `astro check` exits with zero type errors
  3. `npm run build` completes successfully and produces a valid `dist/` directory
  4. Mobile nav hamburger toggles the menu open and closed on a narrow viewport

**Plans:** 6/5 plans complete
**UI hint:** yes

Plans:

- [ ] 01-PLAN-01.md — Scaffold + Config (Astro v5 + Tailwind v4 + TS strict + @theme tokens)
- [ ] 01-PLAN-02.md — Content Collections (events/roster/gallery schemas + seed data)
- [ ] 01-PLAN-03.md — Layout + Shared Components (BaseLayout, Nav + hamburger, Footer)
- [ ] 01-PLAN-04.md — Card Components + Pages (3 cards + home/about/events/roster/gallery)
- [ ] 01-PLAN-05.md — Gallery Detail + QA (/gallery/[id] route + check/build gates)

---

#### Plan 1.1: Scaffold + Config

**Goal:** Astro v5 project installed and configured with Tailwind v4, TypeScript strict mode, and design tokens; `astro check` passes on a skeleton index page
**Requirements:** FOUND-01, FOUND-02
**Success Criteria:**

  1. `npx astro dev` starts without errors and serves a page at localhost
  2. `astro check` passes with zero type errors on the skeleton project
  3. The browser background on the skeleton page reflects the near-black `#0a0a0a` design token (confirms Tailwind v4 wired correctly via `@tailwindcss/vite`)

---

#### Plan 1.2: Content Collections

**Goal:** All three content collections defined with zod schemas and seeded with realistic placeholder data; types resolve cleanly
**Requirements:** FOUND-03, CONTENT-01, CONTENT-02, CONTENT-03, CONTENT-04
**Success Criteria:**

  1. `src/content.config.ts` exists at the project root of `src/` (not inside `src/content/`)
  2. `astro sync` completes and `.astro/types.d.ts` includes generated types for `events`, `roster`, and `gallery`
  3. Each collection directory contains 2-3 `.md` seed files with frontmatter that satisfies the zod schema without coercion errors
  4. `astro check` passes with all collection types resolving

---

#### Plan 1.3: Layout + Shared Components

**Goal:** BaseLayout, Nav with hamburger, and Footer implemented; any static page wrapped in BaseLayout renders correctly with full nav and footer
**Requirements:** COMP-01, COMP-02, COMP-03
**Success Criteria:**

  1. A page using `<BaseLayout title="Test">` renders with a `<head>` containing the title, a nav, a content area, and a footer
  2. Nav displays the Death Monkeys wordmark and links to all five pages (`/`, `/about`, `/events`, `/roster`, `/gallery`)
  3. On a narrow viewport, the hamburger button toggles the mobile menu open and closed using vanilla JS (no framework)
  4. Footer displays "Death Monkeys" and "Badlands field, Alberta" on every page

---

#### Plan 1.4: Card Components + Pages

**Goal:** All card components built and all six pages (including both static and collection-driven) render with real seed data
**Requirements:** COMP-04, COMP-05, COMP-06, PAGE-01, PAGE-02, PAGE-03, PAGE-04, PAGE-05
**Success Criteria:**

  1. Home page (`/`) renders with a hero section (group name + tagline), an about blurb, and navigation links to all sections — visible above the fold
  2. Events page (`/events`) lists all seed events sorted by date ascending, each showing an `EventCard` with a status badge (olive for upcoming, gray for completed, muted red for cancelled)
  3. Roster page (`/roster`) lists active members before inactive members; each `RosterCard` shows callsign prominently with role beneath and real name secondary
  4. Gallery index (`/gallery`) lists seed gallery entries sorted by date descending, each showing a `GalleryCard` with placeholder image, title, and summary snippet

---

#### Plan 1.5: Gallery Detail + QA

**Goal:** Dynamic gallery detail route functional and all QA gates passing; the full site builds cleanly to `dist/`
**Requirements:** PAGE-06, QA-01, QA-02
**Success Criteria:**

  1. Each gallery seed entry has a detail page at `/gallery/[id]` that renders its full AAR content and photos list (uses `entry.id`, not `entry.slug`)
  2. `astro check` exits with zero type errors across the entire project
  3. `npm run build` (running `astro check && astro build`) succeeds and `dist/` contains HTML files for all six page routes including gallery detail pages

---

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Death Monkeys Site Build | 6/5 | Complete   | 2026-06-13 |
