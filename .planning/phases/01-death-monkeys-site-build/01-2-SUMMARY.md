---
phase: 01-death-monkeys-site-build
plan: "02"
subsystem: content
tags: [astro, content-collections, zod, typescript, markdown]

# Dependency graph
requires:
  - phase: 01-01
    provides: Astro v5 project scaffold with package.json, astro.config.mjs, tsconfig.json, and base src/pages/index.astro
provides:
  - Astro v5 Content Layer API config at src/content.config.ts with events/roster/gallery collections
  - 9 seed markdown files (3 per collection) with Death Monkeys brand voice
  - Typed data foundation for getCollection() use in Plans 1.4/1.5
  - astro sync generates collection types; astro check passes clean
affects:
  - 01-03 (BaseLayout and design system — can reference collection type structure)
  - 01-04 (EventCard, RosterCard, GalleryCard consume these collections)
  - 01-05 (gallery [id].astro uses gallery collection entries)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Astro v5 Content Layer API: glob() loader + zod schema in defineCollection"
    - "z.coerce.date() for ISO date strings in frontmatter"
    - "Optional fields with .optional() on realName, joinedDate, eventRef, photos"
    - "Entry IDs derived from filename (no slug frontmatter field)"

key-files:
  created:
    - src/content.config.ts
    - src/content/events/op-primate-protocol.md
    - src/content/events/black-banana-engagement.md
    - src/content/events/op-canopy-breach.md
    - src/content/roster/nakunga.md
    - src/content/roster/gravedigger.md
    - src/content/roster/jackdaw.md
    - src/content/gallery/aar-primate-protocol.md
    - src/content/gallery/aar-black-banana.md
    - src/content/gallery/aar-canopy-breach.md
  modified: []

key-decisions:
  - "Used loader: glob() for all collections — no deprecated type: 'content' (Astro v5 Content Layer API)"
  - "z.coerce.date() parses ISO YYYY-MM-DD strings from frontmatter without explicit transforms"
  - "Jackdaw set active: false to ensure inactive roster filtering works in Plan 1.4"
  - "Events spread all three status enum values (upcoming/completed/cancelled) for badge testing"
  - "aar-canopy-breach omits photos field to exercise optional field in gallery schema"
  - "Placeholder images use picsum.photos/seed/<name>/<w>/<h> for stable, varied placeholders"

patterns-established:
  - "content.config.ts pattern: import { defineCollection, z } from 'astro:content'; import { glob } from 'astro/loaders';"
  - "Collection base path: './src/content/<name>' (relative to project root)"
  - "Schema pattern: required fields first, optional fields with .optional() at end"

requirements-completed: [FOUND-03, CONTENT-01, CONTENT-02, CONTENT-03, CONTENT-04]

# Metrics
duration: 3min
completed: 2026-06-13
---

# Phase 1 Plan 02: Content Collections Summary

**Three Astro v5 content collections (events/roster/gallery) defined with glob() loaders + zod schemas, seeded with 9 brand-voiced markdown entries; astro check passes 0 errors**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-06-13T14:46:15Z
- **Completed:** 2026-06-13T14:48:48Z
- **Tasks:** 2
- **Files modified:** 10 (1 config + 9 seed markdown files)

## Accomplishments
- `src/content.config.ts` at v5-correct location using Content Layer API (glob() loader, no deprecated type: 'content')
- All three collections have complete zod schemas matching CONTENT-01/02/03 requirements
- 9 seed markdown files with Death Monkeys brand voice — fictional but committed mission names, specific airsoft roles/loadouts
- Status enum coverage: upcoming/completed/cancelled all present (badge testing ready)
- Roster active/inactive spread: Nakunga+Gravedigger active, Jackdaw inactive (muted styling ready)
- Gallery photos optional field exercised: aar-primate-protocol (3 photos), aar-black-banana (2 photos), aar-canopy-breach (no photos)
- `astro sync` generates collection types in `.astro/content.d.ts`; `astro check` exits 0

## Task Commits

Each task was committed atomically:

1. **Task 1: Define events, roster, gallery collections in src/content.config.ts** - `53359c0` (feat)
2. **Task 2: Seed 3 events, 3 roster, 3 gallery markdown entries with Death Monkeys voice** - `d0fe780` (feat)

## Files Created/Modified
- `src/content.config.ts` - Astro v5 Content Layer config with 3 collections + zod schemas
- `src/content/events/op-primate-protocol.md` - Upcoming flagship op, multi-stage assault/defend
- `src/content/events/black-banana-engagement.md` - Completed CQB compound skirmish
- `src/content/events/op-canopy-breach.md` - Cancelled (weather) night assault op
- `src/content/roster/nakunga.md` - Nakunga/Naku, assault, HPA rifle, active
- `src/content/roster/gravedigger.md` - Marcus/Gravedigger, support gunner, LMG, active
- `src/content/roster/jackdaw.md` - Devon/Jackdaw, recon/DMR, inactive
- `src/content/gallery/aar-primate-protocol.md` - AAR with 3 picsum placeholder photos
- `src/content/gallery/aar-black-banana.md` - AAR with 2 picsum placeholder photos
- `src/content/gallery/aar-canopy-breach.md` - AAR for cancelled op, no photos field

## Decisions Made
- Used `z.coerce.date()` for all date fields — parses ISO `YYYY-MM-DD` strings from frontmatter without transforms
- Placeholder photos use `picsum.photos/seed/<name>/800/600` for stable, deterministic results per CLAUDE.md constraint (no real assets)
- `aar-canopy-breach.md` intentionally omits `photos` field to test optional field handling
- Entry IDs are derived from filenames per Astro v5 convention (no `slug` frontmatter)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Plan verification command checked `types.d.ts` but Astro v5 places collection definitions in `.astro/content.d.ts` (types.d.ts only has the reference). Verified correct location and all three collections present.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Data layer complete; Plans 1.3 (BaseLayout) and 1.4 (card components + pages) can proceed
- `getCollection('events')`, `getCollection('roster')`, `getCollection('gallery')` will return typed entries
- `render(entry)` from `astro:content` available for gallery detail pages in Plan 1.5
- Status badge logic (upcoming=olive, completed=gray, cancelled=muted-red) has all three cases seeded and ready

---
*Phase: 01-death-monkeys-site-build*
*Completed: 2026-06-13*
