<!-- GSD:project-start source:PROJECT.md -->

## Project

**Death Monkeys Site**

A public-facing static website for the Death Monkeys airsoft team based out of the Badlands field in Alberta. Serves as both an internal team resource (events, roster, after-action reports) and a public recruiting presence to attract new players.

**Core Value:** A clean, fast, always-up-to-date hub where team members can track events and AARs, and prospective players can find the group and get a feel for the team's culture.

### Constraints

- **Output**: Static only — `output: 'static'` in astro.config.mjs
- **JS**: Vanilla JS only for interactive elements (hamburger menu); no client frameworks
- **Images**: Placeholder URLs only, no real assets committed
- **Type safety**: Must pass `astro check` clean
- **Build**: `npm run build` must succeed before task is considered done

<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->

## Technology Stack

## 1. Core Packages and Versions

| Package | Version (pinned) | Purpose |
|---------|-----------------|---------|
| `astro` | `^5.18.2` | Framework (latest v5 stable; npm `latest` tag is v6.4.6 — pin `^5` explicitly) |
| `tailwindcss` | `^4.3.1` | Utility CSS framework |
| `@tailwindcss/vite` | `^4.3.1` | Vite plugin for Tailwind v4 (replaces `@astrojs/tailwind`) |
| `typescript` | `^5.x` | TypeScript (bundled with Astro; install separately for `astro check`) |
| `@astrojs/check` | `^0.9.9` | Required for `astro check` CLI command (moved out of core in Astro v3) |

## 2. Tailwind CSS v4 with Astro

### Critical: `@astrojs/tailwind` is deprecated for v4

### `astro.config.mjs` — Correct Shape for Static + Tailwind v4

- `output: 'static'` is the default but is worth being explicit about for a purely static site.
- `output: 'hybrid'` was **removed** in Astro v5. Do not use it.
- The Tailwind plugin goes in `vite.plugins`, not `integrations`.

### Tailwind v4 Global CSS File

### Tailwind v4 Configuration Approach (CSS-First, No `tailwind.config.js`)

- `@import "tailwindcss"` — inlines all Tailwind utilities (replaces v3's three `@tailwind` directives)
- `@theme { }` — defines design tokens as CSS custom properties; Tailwind auto-generates utility classes from them
- `@layer` — still available for adding to Tailwind's layer system
- `@apply` — still available for inlining utilities into custom CSS
- `@utility` — defines custom utilities with full variant support (new in v4)
- `@source` — explicitly declares source files for class scanning

## 3. Content Collections — Astro v5 API

### File Location: `src/content.config.ts` (not `src/content/config.ts`)

| Version | Config file location |
|---------|---------------------|
| Astro 2–4 (legacy) | `src/content/config.ts` |
| Astro 5+ (current) | `src/content.config.ts` |

### Content Layer API (v5 Default) — With `loader`

- `loader` property is required (use `glob()` or `file()` from `astro/loaders`)
- Entry IDs are now derived from file paths (no more `slug` field in frontmatter — use `id` instead)
- `z` is imported from `astro/zod`, not from `zod` directly (though either works)
- Use the standalone `render()` function instead of `entry.render()`

### Legacy v2 API (Backwards Compatibility — Avoid for New Projects)

### Querying Collections

## 4. TypeScript Configuration

### Recommended `tsconfig.json`

| Preset | Use When |
|--------|----------|
| `base` | Minimum viable; modern JavaScript, no strict checks |
| `strict` | **Recommended** — strict null checks, better inference |
| `strictest` | Maximum strictness; good for greenfield projects |

## 5. Node.js Version Requirements

- **Node 20 LTS** (`^20.3.0`) — safest choice for production/CI
- **Node 22 LTS** (`>=22.0.0`) — recommended for new projects
- **Node 18** — only the exact patch `18.20.8` (final LTS release) is supported; avoid
- **Node 19, 21, 23** — not supported (odd-number releases)

## 6. Standard `package.json` Scripts

- `astro check` requires `@astrojs/check` and `typescript` to be installed (since Astro v3, these are not bundled in `astro` core)
- The `build` script includes `astro check &&` to fail builds with TypeScript errors — this is the Astro-recommended pattern
- `astro preview` serves the `dist/` folder locally for testing the static build

## 7. What's Deprecated or Wrong in v5 vs v4

| Pattern | Status in v5 | Correct v5 Pattern |
|---------|-------------|-------------------|
| `@astrojs/tailwind` integration | Deprecated for v4; use for v3 only | `@tailwindcss/vite` in `vite.plugins` |
| `tailwind.config.js` | No longer needed for v4 | `@theme` directive in CSS |
| `src/content/config.ts` | Deprecated (backwards-compat only) | `src/content.config.ts` |
| `type: 'content'` in `defineCollection` | Deprecated (legacy v2 API) | `loader: glob(...)` |
| `entry.render()` method | Removed | `render(entry)` from `astro:content` |
| `entry.slug` | Deprecated (use `entry.id`) | `entry.id` |
| `Astro.glob()` | Removed | `import.meta.glob()` or `getCollection()` |
| `<ViewTransitions />` component | Renamed | `<ClientRouter />` |
| `output: 'hybrid'` | Removed | Delete it; `static` now has hybrid behavior |
| `src/env.d.ts` type references | Superseded | `.astro/types.d.ts` via `tsconfig.json` include |

## 8. Installation Commands

# Scaffold new project

# Or manually install core packages

# Add Tailwind v4

# or use the Astro CLI (sets up @tailwindcss/vite automatically for Astro >=5.2)

## Sources

- [Astro Styling Guide — Tailwind section](https://docs.astro.build/en/guides/styling/) — official docs, current
- [Tailwind CSS Installation with Astro](https://tailwindcss.com/docs/installation/framework-guides/astro) — official Tailwind docs
- [@astrojs/tailwind deprecation notice](https://docs.astro.build/en/guides/integrations-guide/tailwind/) — confirms v3-only
- [Astro v5 Upgrade Guide](https://docs.astro.build/en/guides/upgrade-to/v5/) — breaking changes
- [Astro Content Collections Guide](https://docs.astro.build/en/guides/content-collections/) — v5 Content Layer API
- [Tailwind CSS Functions and Directives](https://tailwindcss.com/docs/functions-and-directives) — `@theme`, `@import`, etc.
- [Astro 5.2 release notes](https://astro.build/blog/astro-520/) — Tailwind 4 integration announcement

<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->

## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->

## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:

- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
