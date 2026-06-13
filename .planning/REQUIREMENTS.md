# Requirements — Death Monkeys Site

**Milestone:** v1.0
**Status:** Active
**Last updated:** 2026-06-12 after initialization

---

## v1 Requirements

### Foundation & Config

- [ ] **FOUND-01**: Astro v5 project scaffolded with `output: 'static'`, TypeScript strict mode, `@tailwindcss/vite` integration
- [ ] **FOUND-02**: Global CSS with `@import "tailwindcss"` and `@theme` block defining dark tactical design tokens (near-black bg `#0a0a0a`, muted olive accent `#6b7c4a`, monospace font stack)
- [ ] **FOUND-03**: `src/content.config.ts` defining `events`, `roster`, and `gallery` collections with zod schemas

### Content Collections

- [ ] **CONTENT-01**: `events` collection — `title` (string), `date` (z.coerce.date), `location` (string), `description` (string), `status` (enum: upcoming | completed | cancelled)
- [ ] **CONTENT-02**: `roster` collection — `callsign` (string), `realName` (string, optional), `role` (string), `loadout` (string), `joinedDate` (z.coerce.date, optional), `active` (boolean)
- [ ] **CONTENT-03**: `gallery` collection — `title` (string), `date` (z.coerce.date), `eventRef` (string, optional), `summary` (string), `photos` (array of strings, optional)
- [ ] **CONTENT-04**: 2–3 realistic seed entries per collection in markdown with appropriate airsoft content

### Layout & Components

- [ ] **COMP-01**: `BaseLayout.astro` — `<head>` (title prop, global CSS import), semantic nav, footer; accepts `title` prop
- [ ] **COMP-02**: Nav with Death Monkeys wordmark (text-based), links to all 5 pages (`/`, `/about`, `/events`, `/roster`, `/gallery`), mobile hamburger toggle via vanilla JS `<script is:inline>`
- [ ] **COMP-03**: Footer — group name + "Badlands field, Alberta", minimal
- [ ] **COMP-04**: `EventCard.astro` — displays event title, date, location, description; status badge (olive = upcoming, gray = completed, muted red = cancelled)
- [ ] **COMP-05**: `RosterCard.astro` — callsign visually dominant, role beneath, real name small/secondary, visually muted for inactive members
- [ ] **COMP-06**: `GalleryCard.astro` — date, title, summary snippet, placeholder image

### Pages

- [ ] **PAGE-01**: `/` — hero with group name + tagline, about blurb, navigation links to all sections
- [ ] **PAGE-02**: `/about` — who we are, where we play (Badlands field, Alberta), group rules/ethos, placeholder text
- [ ] **PAGE-03**: `/events` — `getCollection('events')` sorted by date ascending, renders `EventCard` per entry
- [ ] **PAGE-04**: `/roster` — `getCollection('roster')`, active members first, renders `RosterCard` per entry
- [ ] **PAGE-05**: `/gallery` — `getCollection('gallery')` sorted by date descending, renders `GalleryCard` per entry
- [ ] **PAGE-06**: `/gallery/[id]` — `getStaticPaths` + standalone `render(entry)` from `astro:content`, full AAR detail page with photos list

### Quality Gates

- [ ] **QA-01**: `astro check` passes with zero type errors
- [ ] **QA-02**: `npm run build` succeeds and produces valid static output in `dist/`

---

## v2 Requirements (Deferred)

- Search or filter on events/roster pages
- Dark/light theme toggle
- RSS feed for events or AARs
- Contact/recruitment form (would require a form backend)
- Real image uploads or CMS integration
- Member-only content or auth

---

## Out of Scope

- Client-side JS frameworks (React, Vue, Svelte, etc.) — Astro components + vanilla JS only
- Server routes or SSR — static output only, no server
- CMS or API integrations — all content is local markdown
- Real image assets — placeholder URLs only (placeholder.com or similar)
- Authentication or member-only areas
- Social embeds (Twitter/X, Instagram) — maintenance burden, not warranted
- Animated video hero — performance cost, not warranted
- Comments system

---

## Traceability

| REQ-ID | Phase | Plan |
|--------|-------|------|
| FOUND-01 | 1 | — |
| FOUND-02 | 1 | — |
| FOUND-03 | 1 | — |
| CONTENT-01 | 1 | — |
| CONTENT-02 | 1 | — |
| CONTENT-03 | 1 | — |
| CONTENT-04 | 1 | — |
| COMP-01 | 1 | — |
| COMP-02 | 1 | — |
| COMP-03 | 1 | — |
| COMP-04 | 1 | — |
| COMP-05 | 1 | — |
| COMP-06 | 1 | — |
| PAGE-01 | 1 | — |
| PAGE-02 | 1 | — |
| PAGE-03 | 1 | — |
| PAGE-04 | 1 | — |
| PAGE-05 | 1 | — |
| PAGE-06 | 1 | — |
| QA-01 | 1 | — |
| QA-02 | 1 | — |
