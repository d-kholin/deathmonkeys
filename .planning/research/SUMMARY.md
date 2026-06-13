# Project Research Summary

**Project:** Death Monkeys Site — Astro v5 static website for an airsoft team
**Domain:** Static content site (team/club) with content collections
**Researched:** 2026-06-12
**Confidence:** HIGH

---

## Executive Summary

This is a static team website built with Astro v5, Tailwind CSS v4, TypeScript strict, and content collections. The stack is well-documented and modern — but v5 introduced a series of breaking API changes from earlier Astro versions (slug→id, new config file location, Content Layer API with required loaders, Tailwind via Vite plugin not integration). Every research area agrees: the patterns are straightforward when used correctly, and most failures come from following outdated tutorials or v4 habits.

The recommended approach is to scaffold in dependency order (config → layout → static pages → collection pages → dynamic routes), use the CSS-first Tailwind v4 workflow with no `tailwind.config.js`, and keep all data fetching in pages rather than components. The site is fully build-time static with zero runtime data fetching. For the tactical dark aesthetic: desaturated colors, heavier font weights than a light theme, and subtle noise texture over a near-black background.

The top risks are: (1) using deprecated integration patterns from Astro v4 or Tailwind v3 that fail silently, (2) misplacing the content collections config file so `getCollection` returns empty arrays with no error, and (3) using `entry.slug` instead of `entry.id` in dynamic routes (causes 404s on all gallery detail pages). All three are 100% preventable with the correct patterns from this research.

---

## Key Findings

### Recommended Stack

| Package | Version | Purpose |
|---------|---------|---------|
| `astro` | `^5.18.2` | Framework — pin `^5` explicitly; npm latest is v6 |
| `tailwindcss` | `^4.3.1` | CSS framework |
| `@tailwindcss/vite` | `^4.3.1` | Vite plugin (replaces deprecated `@astrojs/tailwind`) |
| `@astrojs/check` | `^0.9.9` | Required for `astro check` CLI (moved out of core in v3) |
| `typescript` | `^5.x` | Bundled with Astro; install separately for `astro check` |

**Critical config decisions:**
- Tailwind goes in `vite.plugins`, NOT `integrations`. Do NOT install `@astrojs/tailwind`.
- No `tailwind.config.js` — Tailwind v4 is CSS-first; use `@theme {}` in `global.css`.
- `output: 'static'` in `astro.config.mjs` (explicit, though it is the default).
- `tsconfig.json` extends `"astro/tsconfigs/strict"` — required for content collections.
- `build` script: `"astro check && astro build"` — fail builds on TypeScript errors.
- Node 20 LTS or Node 22 LTS. Node 18 only supported at exact patch `18.20.8`.

---

### Table Stakes Features

| Feature | Why It Matters |
|---------|---------------|
| Persistent nav (mobile hamburger) | Users need orientation immediately; >50% check from mobile |
| Team identity in hero | Visitors decide in 3 seconds; name + tagline above the fold |
| Events list sorted by date | Core utility; unsorted events = bounce |
| Status badges on events (upcoming/completed/cancelled) | Highest-ROI single feature: instant scannability |
| Roster with callsign + role + active indicator | Community function; active/alumni separation essential |
| Gallery/AAR index with narrative summaries | Proves the team is alive; photo-dump-only is worthless |
| Gallery detail page (`/gallery/[id]`) | Completes the gallery; narrative + photo grid per op |
| Footer with field location | Recruits need "Badlands field, Alberta" on every page |
| Readable body text on dark bg | Off-white `#e0e0e0`; 4.5:1 contrast minimum |
| No broken links / placeholder errors | Kills credibility immediately |

**Should-have (v1, low effort):**
- Recruiting CTA on home + about pages
- "Last op" activity signal on home page
- Loadout notes on roster cards

**Defer to v2+:**
- Any user interaction beyond nav hamburger
- Real image assets (use placeholder URLs in v1)
- Dark/light mode toggle (hard-code dark; anti-feature for this aesthetic)
- Social embeds, auth, forms, CMS

---

### Architecture in Brief

**Directory structure:**

```
src/
  content.config.ts          ← v5 location (NOT src/content/config.ts)
  content/
    events/                  ← .md files
    roster/                  ← .md files
    gallery/                 ← .md files
  layouts/
    BaseLayout.astro         ← single layout; imports global.css, Nav, Footer
  components/
    Nav.astro                ← hamburger toggle (vanilla JS, processed script)
    Footer.astro
    EventCard.astro          ← presentational; Props: CollectionEntry<'events'>
    RosterCard.astro         ← presentational; Props: CollectionEntry<'roster'>
    GalleryCard.astro        ← presentational; Props: CollectionEntry<'gallery'>
  pages/
    index.astro
    about.astro
    events.astro             ← getCollection here, not in card component
    roster.astro
    gallery/
      index.astro
      [id].astro             ← [id] not [slug]; uses getStaticPaths + render()
  styles/
    global.css               ← @import "tailwindcss"; + @theme {}
```

**Data flow:** All `getCollection()` calls happen in pages at build time. Card components are purely presentational — they receive a typed `CollectionEntry<T>` prop. Zero runtime fetching.

| Component | Fetches data | Receives |
|-----------|-------------|----------|
| `BaseLayout.astro` | No | `{ title, description? }` |
| `Nav.astro` / `Footer.astro` | No | Nothing |
| `*Card.astro` | No | `CollectionEntry<T>` |
| List pages (`events.astro`, etc.) | `getCollection()` | — |
| `gallery/[id].astro` | `getStaticPaths` + `render()` | entry via props |

---

### Critical Pitfalls

| # | Pitfall | What breaks | Prevention |
|---|---------|-------------|-----------|
| 1 | `@astrojs/tailwind` installed alongside Tailwind v4 | Styles silently not applied; PostCSS conflict | Use only `@tailwindcss/vite` in `vite.plugins`; never install `@astrojs/tailwind` |
| 2 | `src/content/config.ts` instead of `src/content.config.ts` | `getCollection()` silently returns `[]`; pages render with no data | Put config at `src/content.config.ts` (src root) |
| 3 | `entry.slug` in dynamic routes | TypeScript error + 404 for all gallery detail pages | Use `entry.id`; name route file `[id].astro` |
| 4 | `z.date()` instead of `z.coerce.date()` | Build fails in CI: "expected date, received string" | Always use `z.coerce.date()` for frontmatter date fields |
| 5 | `@apply` in scoped `<style>` blocks | "Cannot apply unknown utility class" build error | Add `@reference "../styles/global.css"` at top of scoped block, or use Tailwind classes inline |

**Additional watchlist:**
- Tailwind v4 renamed bare `shadow`, `rounded`, `blur`, `ring` classes — all shifted one step (`shadow` → `shadow-sm`, `shadow-sm` → `shadow-xs`, etc.)
- `@tailwind base/components/utilities` directives removed — replace with `@import "tailwindcss"`
- `defineCollection` requires a `loader:` field in v5 — no-loader definitions break silently
- Run `astro sync` after any `content.config.ts` change to regenerate `.astro/types.d.ts`
- `getStaticPaths` must be `export async function` — missing `export` is a hard build error

---

### Design Principles (Tactical Dark Aesthetic)

1. **Desaturate all colors.** Olive accent: `#6b7c4a` not `#00ff00`. Cancelled red: `#7c3a3a`. Background: `#0a0a0a` (near-black, not pure black). Cards: `#141414`. Never use saturated primaries.

2. **Go heavier on font weight.** Light text on dark backgrounds appears optically thinner. Use `font-medium` (500) where you'd use `font-normal` on a light theme. Never use weights below 400. Headings: monospace (`JetBrains Mono`, `Space Mono`, `IBM Plex Mono`) in uppercase with `letter-spacing: 0.05–0.1em`.

3. **Elevation via layers, not shadows.** Cards at `#141414` on `#0a0a0a`. Borders `1px solid rgba(255,255,255,0.08)`. No box-shadows. Sharp corners (`rounded-none` or `rounded-sm`) — not `rounded-xl`.

4. **Texture over gradients.** SVG noise at 2–4% opacity on backgrounds adds depth. Stock-looking gradient overlays break the aesthetic.

---

## Build Order Suggestion

**Step 1 — Foundation (unblocks everything)**
- `package.json` with pinned packages and scripts (`"build": "astro check && astro build"`)
- `astro.config.mjs` with `@tailwindcss/vite` in `vite.plugins`, `output: 'static'`
- `tsconfig.json` extending `astro/tsconfigs/strict`
- `src/styles/global.css` with `@import "tailwindcss"` + `@theme {}` design tokens
- `src/content.config.ts` with schemas for `events`, `roster`, `gallery` (use `z.coerce.date()`, `loader: glob(...)`)
- Seed content: 2–3 `.md` files per collection with realistic data

**Step 2 — Layout layer (unblocks all pages)**
- `src/layouts/BaseLayout.astro` (imports global.css; wraps Nav + slot + Footer)
- `src/components/Nav.astro` (links + processed `<script>` for hamburger — NOT `is:inline`)
- `src/components/Footer.astro` (field location, team name)

**Step 3 — Static pages (validates layout; no collection complexity)**
- `src/pages/index.astro` (hero, about blurb, teasers, recruiting CTA)
- `src/pages/about.astro` (history, ethos, code of conduct, how-to-join CTA)

**Step 4 — Collection list pages + card components (build as paired units)**
- `EventCard.astro` + `events.astro` (sort by date; status badge `upcoming`/`completed`/`cancelled`)
- `RosterCard.astro` + `roster.astro` (active-first; callsign prominent)
- `GalleryCard.astro` + `gallery/index.astro` (date sort; narrative summary)

**Step 5 — Dynamic route (depends on gallery collection + GalleryCard)**
- `src/pages/gallery/[id].astro` (`export async function getStaticPaths`; `render(entry)`; `entry.id` as param)

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Versions from npm registry; config patterns from official Astro + Tailwind docs |
| Features | HIGH | UX patterns consistent across multiple domain-specific sources |
| Architecture | HIGH | All patterns verified against official Astro v5 docs |
| Pitfalls | HIGH | Verified against official changelogs, upgrade guides, and confirmed GitHub issues |

**Overall confidence: HIGH**

### Gaps to Address

- **Real image assets:** Placeholder URLs used throughout v1. When photos are added they must go in `src/assets/` (not `public/`) for `<Image />` optimization. A content workflow decision is needed (how the team uploads field photos).
- **Noise texture asset:** Research confirms the technique (SVG noise at 2–4% opacity) but does not specify an asset. Any SVG noise generator (grainy.js, etc.) produces the correct output.
- **Hamburger CSS transition:** Toggle logic is covered; a smooth slide-down animation is a minor CSS addition not explored in research.

---

## Sources

All sources HIGH confidence — verified against official documentation.

- [Astro v5 Upgrade Guide](https://docs.astro.build/en/guides/upgrade-to/v5/) — breaking changes, slug→id, config file location
- [Astro Content Collections Guide](https://docs.astro.build/en/guides/content-collections/) — Content Layer API, loader patterns
- [Astro Styling Guide](https://docs.astro.build/en/guides/styling/) — Tailwind v4 integration via Vite plugin
- [Tailwind CSS v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide) — renamed classes, `@apply`, dark mode config
- [Tailwind CSS Installation: Astro](https://tailwindcss.com/docs/installation/framework-guides/astro) — `@tailwindcss/vite` setup
- [Astro TypeScript Guide](https://docs.astro.build/en/guides/typescript/) — strict preset, Props interfaces, `astro sync`
- [Astro Client-side Scripts](https://docs.astro.build/en/guides/client-side-scripts/) — processed scripts vs `is:inline`
- [Astro Image Optimization](https://docs.astro.build/en/guides/images/) — `src/assets/` vs `public/`

---

*Research completed: 2026-06-12*
*Ready for roadmap: yes*
