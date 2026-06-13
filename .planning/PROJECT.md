# Death Monkeys Site

## What This Is

A public-facing static website for the Death Monkeys airsoft team based out of the Badlands field in Alberta. Serves as both an internal team resource (events, roster, after-action reports) and a public recruiting presence to attract new players.

## Core Value

A clean, fast, always-up-to-date hub where team members can track events and AARs, and prospective players can find the group and get a feel for the team's culture.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Home/landing page with group name, tagline, hero section, about blurb, and links to other sections
- [ ] About page covering who we are, where we play (Badlands field, Alberta), group rules/ethos
- [ ] Events page listing content collection entries sorted by date
- [ ] Roster page listing member profiles from content collection
- [ ] Gallery index page listing after-action reports and photo galleries from content collection
- [ ] Gallery detail page (`/gallery/[slug]`) rendered from content collection entries
- [ ] Content collection for events (title, date, location, description, status)
- [ ] Content collection for roster (callsign, realName, role, loadout, joinedDate, active)
- [ ] Content collection for gallery/AARs (title, date, eventRef, summary, photos)
- [ ] Seed each collection with 2–3 realistic placeholder entries
- [ ] Shared BaseLayout.astro with head, nav, footer
- [ ] Nav with Death Monkeys wordmark, links to all pages, mobile hamburger menu (vanilla JS)
- [ ] Footer with group name and field location
- [ ] EventCard.astro, RosterCard.astro, GalleryCard.astro components
- [ ] Dark tactical military design system (near-black bg, muted olive/tan accent, monospace headings)
- [ ] Passes `astro check` with no type errors
- [ ] `npm run build` succeeds

### Out of Scope

- Client-side JS frameworks (React, Vue, etc.) — Astro-only with vanilla JS for interactivity
- CMS or API integrations — all content is local markdown/content collections
- Real image assets — placeholder images throughout
- Server routes or SSR — static output only

## Context

- **Tech stack**: Astro (latest stable), Tailwind CSS v4 via @astrojs/tailwind, TypeScript, content collections
- **Output mode**: `output: 'static'` — fully static, no server
- **Design language**: dark tactical military — near-black (#0a0a0a) background, muted olive green or tactical tan accent, monospace/stencil headings, clean sans-serif body, optional subtle noise texture
- **Field**: Badlands airsoft field, Alberta

## Constraints

- **Output**: Static only — `output: 'static'` in astro.config.mjs
- **JS**: Vanilla JS only for interactive elements (hamburger menu); no client frameworks
- **Images**: Placeholder URLs only, no real assets committed
- **Type safety**: Must pass `astro check` clean
- **Build**: `npm run build` must succeed before task is considered done

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Static output mode | No server needed; fast, cheap, deployable anywhere (Netlify, Cloudflare Pages, etc.) | — Pending |
| Tailwind v4 via @astrojs/tailwind | Latest integration, CSS-first config | — Pending |
| Content collections for all structured data | Type-safe, easy to extend, Astro-native | — Pending |
| Vanilla JS for hamburger | No framework JS overhead for a single interactive element | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-06-12 after initialization*
