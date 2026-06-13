---
phase: "01"
plan: "04"
title: "Card Components + Pages"
subsystem: "pages-components"
tags: [astro, content-collections, tailwind, cards, pages, static]
completed_date: "2026-06-13"
duration_minutes: 3
tasks_completed: 3
tasks_total: 3
files_created: 7
files_modified: 1

dependency_graph:
  requires:
    - "01-02: content collections (getCollection types, seed data)"
    - "01-03: BaseLayout.astro, Nav, Footer, global CSS with @theme tokens"
  provides:
    - "src/components/EventCard.astro"
    - "src/components/RosterCard.astro"
    - "src/components/GalleryCard.astro"
    - "src/pages/index.astro (hero + about blurb)"
    - "src/pages/about.astro"
    - "src/pages/events.astro"
    - "src/pages/roster.astro"
    - "src/pages/gallery/index.astro"
  affects:
    - "01-05: gallery detail page [id].astro links from GalleryCard"

tech_stack:
  added: []
  patterns:
    - "getCollection() in Astro frontmatter with .sort() for ordered rendering"
    - "EventCard status badge: conditional object map { upcoming, completed, cancelled } -> { label, classes }"
    - "RosterCard inactive treatment: opacity-50 + bg-surface-inactive on the article element"
    - "GalleryCard placeholder: picsum.photos/seed/{id}/800/400 for stable deterministic images"
    - "SVG data URI with feTurbulence for pure-CSS noise texture on hero background"
    - "entry.id (not entry.slug) passed to GalleryCard for /gallery/${id} links"

key_files:
  created:
    - path: "src/pages/index.astro"
      note: "Hero 65vh + feTurbulence noise, tagline, Join the Team CTA, section nav to all 4 pages"
    - path: "src/pages/about.astro"
      note: "Who-we-are, where-we-play (Badlands field Alberta), ethos, join CTA"
    - path: "src/components/EventCard.astro"
      note: "Title/date/location/description + UPCOMING/COMPLETED/CANCELLED status badge"
    - path: "src/pages/events.astro"
      note: "getCollection('events') sorted ascending, EventCard list, empty state"
    - path: "src/components/RosterCard.astro"
      note: "Callsign-dominant (20px/700 JetBrains Mono), role, realName muted, inactive opacity-50"
    - path: "src/components/GalleryCard.astro"
      note: "Placeholder image, date/title/summary, border hover, links /gallery/${id}"
    - path: "src/pages/gallery/index.astro"
      note: "getCollection('gallery') sorted descending, GalleryCard grid, empty state"
  modified:
    - path: "src/pages/index.astro"
      note: "Replaced placeholder h1 from Plan 1.3 with full hero section and about blurb"
    - path: "src/pages/roster.astro"
      note: "getCollection('roster') active-first sort, RosterCard list, empty state"

decisions:
  - "SVG data URI feTurbulence for noise overlay — pure CSS, no assets committed (D-02 compliance)"
  - "Hero tagline and group name separate elements to allow different size treatment if desired later"
  - "Status badge lookup via object map { upcoming, completed, cancelled } — extensible, type-safe"
  - "GalleryCard placeholder uses picsum.photos/seed/{id} for stable per-entry images"
  - "RosterCard inactive uses both opacity-50 AND bg-surface-inactive for double visual signal"
  - "entry.id passed as explicit prop to GalleryCard per CLAUDE.md (not entry.slug)"

requirements-completed: [COMP-04, COMP-05, COMP-06, PAGE-01, PAGE-02, PAGE-03, PAGE-04, PAGE-05]
---

# Phase 01 Plan 04: Card Components + Pages Summary

**One-liner:** Three card components (EventCard with status badges, RosterCard with active/inactive treatment, GalleryCard with placeholder image + hover border) wired to five content-driven pages consuming real seed data via getCollection — astro check 0 errors, npm run build produces all 5 HTML pages.

## Performance

- **Duration:** ~3 min
- **Started:** 2026-06-13T15:36:17Z
- **Completed:** 2026-06-13T15:39:45Z
- **Tasks:** 3
- **Files created/modified:** 8

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Home (hero + about blurb) and About page | e74ee1c | src/pages/index.astro, src/pages/about.astro |
| 2 | EventCard + Events page (sorted ascending, status badges) | ccdc9f9 | src/components/EventCard.astro, src/pages/events.astro |
| 3 | RosterCard + GalleryCard + Roster page + Gallery index page | 4fe402f | src/components/RosterCard.astro, src/components/GalleryCard.astro, src/pages/roster.astro, src/pages/gallery/index.astro |

## Verification Results

- `astro check`: 0 errors (run as part of `npm run build`)
- `npm run build`: 5 pages built successfully — index.html, about/index.html, events/index.html, roster/index.html, gallery/index.html
- Hero tagline "Armed. Dangerous. Slightly Bananas." — PASS
- "Join the Team" CTA with bg-accent — PASS
- feTurbulence SVG noise overlay in hero — PASS
- "Badlands field, Alberta" on About page — PASS
- `getCollection('events')` sorted ascending by date — PASS
- Badge labels UPCOMING/COMPLETED/CANCELLED in EventCard — PASS
- Empty state "No Operations Scheduled" in events.astro — PASS
- `getCollection('roster')` active-first sort — PASS
- Callsign at Heading 20px/700 JetBrains Mono — PASS
- Inactive opacity-50 treatment on RosterCard — PASS
- Empty state "No Operators Found" in roster.astro — PASS
- `getCollection('gallery')` sorted descending by date — PASS
- `entry.id` used (NOT `entry.slug`) in gallery/index.astro — PASS
- Placeholder image via picsum.photos/seed/{id} in GalleryCard — PASS
- Empty state "No After-Action Reports" in gallery/index.astro — PASS

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

- `src/components/GalleryCard.astro`: Placeholder images via `picsum.photos/seed/{id}/800/400` — intentional per CONTEXT.md D-10 and CLAUDE.md constraint "Images: Placeholder URLs only, no real assets committed". The placeholder generates stable, unique images per gallery entry ID. Plan 1.5 (gallery detail page) will link through these cards; real images are out of scope per REQUIREMENTS.md.

## Threat Surface Scan

All card content is rendered via Astro `{expr}` interpolation (auto HTML-escaped). No `set:html` used anywhere in this plan. T-04-01 mitigation fully implemented.

T-04-03 (broken /gallery/${id} links): `entry.id` is passed directly from `getCollection('gallery')` results — the same IDs that `getStaticPaths` will enumerate in Plan 1.5. No link/route mismatch possible.

T-04-02 (picsum.photos external host): Accepted per threat register — HTTPS, no PII.

No new security-relevant surface beyond the plan's threat model.

## Self-Check: PASSED

- src/pages/index.astro — FOUND
- src/pages/about.astro — FOUND
- src/components/EventCard.astro — FOUND
- src/pages/events.astro — FOUND
- src/components/RosterCard.astro — FOUND
- src/components/GalleryCard.astro — FOUND
- src/pages/roster.astro — FOUND
- src/pages/gallery/index.astro — FOUND
- e74ee1c commit — FOUND in git log
- ccdc9f9 commit — FOUND in git log
- 4fe402f commit — FOUND in git log
- dist/index.html — FOUND (built)
- dist/about/index.html — FOUND (built)
- dist/events/index.html — FOUND (built)
- dist/roster/index.html — FOUND (built)
- dist/gallery/index.html — FOUND (built)
