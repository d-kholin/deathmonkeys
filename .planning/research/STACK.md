# Technology Stack

**Project:** Airsoft Team Static Website
**Researched:** 2026-06-12
**Stack specified:** Astro v5.x (static), Tailwind CSS v4, TypeScript, Content Collections

---

## 1. Core Packages and Versions

All versions verified against npm registry on 2026-06-12.

| Package | Version (pinned) | Purpose |
|---------|-----------------|---------|
| `astro` | `^5.18.2` | Framework (latest v5 stable; npm `latest` tag is v6.4.6 — pin `^5` explicitly) |
| `tailwindcss` | `^4.3.1` | Utility CSS framework |
| `@tailwindcss/vite` | `^4.3.1` | Vite plugin for Tailwind v4 (replaces `@astrojs/tailwind`) |
| `typescript` | `^5.x` | TypeScript (bundled with Astro; install separately for `astro check`) |
| `@astrojs/check` | `^0.9.9` | Required for `astro check` CLI command (moved out of core in Astro v3) |

**Confidence: HIGH** — versions verified directly from npm registry.

---

## 2. Tailwind CSS v4 with Astro

### Critical: `@astrojs/tailwind` is deprecated for v4

The `@astrojs/tailwind` integration (the v3-era package) is **explicitly deprecated** for Tailwind v4. The Astro docs state: "Tailwind CSS now offers a Vite plugin which is the preferred way to use Tailwind 4 in Astro." Do not use `@astrojs/tailwind` for new v4 projects.

Tailwind v4 support in Astro was added in **Astro 5.2.0** (January 2025). The correct integration path is the `@tailwindcss/vite` Vite plugin, added directly to `astro.config.mjs`.

**Confidence: HIGH** — confirmed by Astro official docs and Tailwind official docs.

### `astro.config.mjs` — Correct Shape for Static + Tailwind v4

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
```

Notes:
- `output: 'static'` is the default but is worth being explicit about for a purely static site.
- `output: 'hybrid'` was **removed** in Astro v5. Do not use it.
- The Tailwind plugin goes in `vite.plugins`, not `integrations`.

**Confidence: HIGH** — pattern confirmed by official Astro docs and Tailwind framework guide.

### Tailwind v4 Global CSS File

Create `src/styles/global.css`:

```css
@import "tailwindcss";

/* Custom theme tokens — replaces tailwind.config.js theme section */
@theme {
  --color-brand: oklch(0.62 0.19 256);
  --font-display: "Inter", sans-serif;
  /* Add project-specific tokens here */
}
```

Import this file in your root layout component:

```astro
---
// src/layouts/BaseLayout.astro
import '../styles/global.css';
---
```

**Confidence: HIGH** — confirmed by Tailwind v4 official docs.

### Tailwind v4 Configuration Approach (CSS-First, No `tailwind.config.js`)

Tailwind v4 replaces `tailwind.config.js` entirely with CSS-native configuration:

- `@import "tailwindcss"` — inlines all Tailwind utilities (replaces v3's three `@tailwind` directives)
- `@theme { }` — defines design tokens as CSS custom properties; Tailwind auto-generates utility classes from them
- `@layer` — still available for adding to Tailwind's layer system
- `@apply` — still available for inlining utilities into custom CSS
- `@utility` — defines custom utilities with full variant support (new in v4)
- `@source` — explicitly declares source files for class scanning

Do **not** create `tailwind.config.js` or `tailwind.config.ts` for a new v4 project. The CSS-first approach is the canonical path.

**Confidence: HIGH** — confirmed by Tailwind v4 official docs.

---

## 3. Content Collections — Astro v5 API

### File Location: `src/content.config.ts` (not `src/content/config.ts`)

In Astro v5, the content collection config file moved from inside the `src/content/` directory to the root of `src/`:

| Version | Config file location |
|---------|---------------------|
| Astro 2–4 (legacy) | `src/content/config.ts` |
| Astro 5+ (current) | `src/content.config.ts` |

The old location has **temporary backwards compatibility** in Astro v5 but is deprecated. It was **fully removed** in Astro v6. Use `src/content.config.ts` for all new Astro v5 projects.

**Confidence: HIGH** — confirmed by Astro v5 upgrade guide and docs.

### Content Layer API (v5 Default) — With `loader`

This is the modern, recommended API introduced in Astro v5. Collections require an explicit `loader`:

```ts
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const team = defineCollection({
  loader: glob({ base: './src/content/team', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    joinDate: z.coerce.date(),
    active: z.boolean().default(true),
  }),
});

const events = defineCollection({
  loader: glob({ base: './src/content/events', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    location: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = { team, events };
```

Key differences from legacy v2 API:
- `loader` property is required (use `glob()` or `file()` from `astro/loaders`)
- Entry IDs are now derived from file paths (no more `slug` field in frontmatter — use `id` instead)
- `z` is imported from `astro/zod`, not from `zod` directly (though either works)
- Use the standalone `render()` function instead of `entry.render()`

### Legacy v2 API (Backwards Compatibility — Avoid for New Projects)

The v2 API (`type: 'content'`, no `loader`) still works in Astro v5 via a compatibility shim, but is **fully removed in Astro v6**. Do not use it for new projects in 2025:

```ts
// DO NOT USE for new Astro v5 projects
const blog = defineCollection({
  type: 'content',           // v2 pattern — deprecated
  schema: z.object({ ... })  // no loader — v2 pattern
});
```

**Confidence: HIGH** — confirmed by Astro v5 and v6 docs.

### Querying Collections

```ts
// In .astro or endpoint files
import { getCollection, getEntry, render } from 'astro:content';

const allEvents = await getCollection('events');
const entry = await getEntry('team', 'player-callsign');
const { Content } = await render(entry);
```

---

## 4. TypeScript Configuration

### Recommended `tsconfig.json`

Astro v5 defaults all new projects to the `strict` preset. The `create astro` CLI no longer asks about TypeScript — strict is the only option.

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "src"],
  "exclude": ["dist"]
}
```

Astro provides three presets (via `astro/tsconfigs/`):

| Preset | Use When |
|--------|----------|
| `base` | Minimum viable; modern JavaScript, no strict checks |
| `strict` | **Recommended** — strict null checks, better inference |
| `strictest` | Maximum strictness; good for greenfield projects |

For content collections, `strict` or `strictest` is required. The `base` preset needs manual additions (`strictNullChecks: true`, `allowJs: true`).

**Note on `src/env.d.ts`:** Astro v5 moved away from relying on `src/env.d.ts` for type generation. Instead, `.astro/types.d.ts` is the generated types file and should be referenced via `include` in `tsconfig.json`, not `/// <reference>` in env.d.ts.

**Confidence: HIGH** — confirmed by Astro v5 upgrade guide and TypeScript docs.

---

## 5. Node.js Version Requirements

Astro v5.18.2 requires:

```
node: "18.20.8 || ^20.3.0 || >=22.0.0"
```

Practical guidance:
- **Node 20 LTS** (`^20.3.0`) — safest choice for production/CI
- **Node 22 LTS** (`>=22.0.0`) — recommended for new projects
- **Node 18** — only the exact patch `18.20.8` (final LTS release) is supported; avoid
- **Node 19, 21, 23** — not supported (odd-number releases)

Note: Astro 5.8+ dropped general Node 18 support, keeping only `18.20.8` as a compatibility bridge. Use Node 20 or 22 for new projects.

**Confidence: HIGH** — verified from `npm view astro@5.18.2 engines`.

---

## 6. Standard `package.json` Scripts

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "check": "astro check"
  }
}
```

Notes:
- `astro check` requires `@astrojs/check` and `typescript` to be installed (since Astro v3, these are not bundled in `astro` core)
- The `build` script includes `astro check &&` to fail builds with TypeScript errors — this is the Astro-recommended pattern
- `astro preview` serves the `dist/` folder locally for testing the static build

**Confidence: HIGH** — confirmed by Astro CLI reference docs.

---

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

**Confidence: HIGH** — verified against Astro v5 upgrade guide.

---

## 8. Installation Commands

```bash
# Scaffold new project
npm create astro@5 my-site

# Or manually install core packages
npm install astro@^5.18.2
npm install -D typescript @astrojs/check

# Add Tailwind v4
npm install tailwindcss @tailwindcss/vite
# or use the Astro CLI (sets up @tailwindcss/vite automatically for Astro >=5.2)
npx astro add tailwind
```

---

## Sources

- [Astro Styling Guide — Tailwind section](https://docs.astro.build/en/guides/styling/) — official docs, current
- [Tailwind CSS Installation with Astro](https://tailwindcss.com/docs/installation/framework-guides/astro) — official Tailwind docs
- [@astrojs/tailwind deprecation notice](https://docs.astro.build/en/guides/integrations-guide/tailwind/) — confirms v3-only
- [Astro v5 Upgrade Guide](https://docs.astro.build/en/guides/upgrade-to/v5/) — breaking changes
- [Astro Content Collections Guide](https://docs.astro.build/en/guides/content-collections/) — v5 Content Layer API
- [Tailwind CSS Functions and Directives](https://tailwindcss.com/docs/functions-and-directives) — `@theme`, `@import`, etc.
- [Astro 5.2 release notes](https://astro.build/blog/astro-520/) — Tailwind 4 integration announcement
