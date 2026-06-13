# Walking Skeleton — Death Monkeys Site

**Phase:** 1
**Generated:** 2026-06-12

## Capability Proven End-to-End

A visitor can load the static site in a browser, see the dark-tactical home page rendered through `BaseLayout`, navigate to a collection-driven page (e.g. `/events`) populated from real markdown seed data, and toggle the mobile hamburger nav open/closed — all produced by `npm run build` into a valid `dist/` and served by `astro preview`.

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Astro v5 (`astro@^5.18.2`), `output: 'static'` | Required by CLAUDE.md; static-only public team site, no SSR needed. npm `latest` tag is v6 — pin `^5` explicitly. |
| Styling | Tailwind v4 (`tailwindcss@^4.3.1`) via `@tailwindcss/vite` in `vite.plugins` | CLAUDE.md mandates the v4 Vite plugin; `@astrojs/tailwind` is deprecated for v4. CSS-first `@theme` tokens, no `tailwind.config.js`. |
| Data layer | Astro Content Collections via `glob()` filesystem loader, schemas in `src/content.config.ts` | No DB/CMS (out of scope). Content is local markdown — `events`, `roster`, `gallery` collections with zod schemas. |
| Interactivity | Vanilla JS in `<script is:inline>` (mobile hamburger only) | Constraint: no client frameworks. Single interactive element. |
| Type checking | TypeScript strict mode + `@astrojs/check` (`astro check`) | CLAUDE.md: `build` = `astro check && astro build`; must pass clean. |
| Deployment target | `npm run build` → `dist/` static output, verified locally with `astro preview` | Static site; no server runtime. Full-stack run command IS the build + preview. |
| Directory layout | `src/layouts/`, `src/components/`, `src/pages/`, `src/content/{events,roster,gallery}/`, `src/styles/global.css`, `src/content.config.ts` at `src/` root | Conventional Astro v5 layout; `content.config.ts` at `src/` root (NOT inside `src/content/`) per v5. |

## Stack Touched in Phase 1

- [x] Project scaffold (Astro v5 init, Tailwind v4 Vite plugin, TS strict, `@theme` tokens) — Plan 1.1
- [x] Routing — six real routes (`/`, `/about`, `/events`, `/roster`, `/gallery`, `/gallery/[id]`) — Plans 1.4, 1.5
- [x] Data layer — Content Collections with real markdown reads (`getCollection`, `render`) — Plans 1.2, 1.4, 1.5
- [x] UI — mobile hamburger nav toggle wired via vanilla JS — Plan 1.3
- [x] Deployment — `npm run build` produces valid `dist/`; `astro preview` serves it — Plan 1.5

## Out of Scope (Deferred to Later Slices)

- Search/filter on events or roster pages (v2)
- Dark/light theme toggle (v2)
- RSS feed (v2)
- Contact/recruitment form — needs a form backend (v2)
- Real image assets — placeholder URLs only this phase
- Member-only content or auth (v2)
- Mobile nav open/close CSS transition animation (deferred per CONTEXT.md)
- Click-outside-to-close on mobile nav (deferred per CONTEXT.md)

## Subsequent Slice Plan

This is a single-phase milestone (Phase 1 of 1). There are no subsequent phases in v1.0. Any future capability (v2 requirements) builds on this skeleton's architectural decisions — Astro v5 static output, Tailwind v4 `@theme` tokens, and the Content Collections data layer — without altering them.
