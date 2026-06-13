# Architecture Patterns: Death Monkeys Astro v5 Site

**Domain:** Static content site with content collections
**Researched:** 2026-06-12
**Overall confidence:** HIGH — all findings verified against official Astro v5 documentation via Context7

---

## Recommended Directory Structure

```
deathmonkeys/
├── public/
│   └── favicon.svg              # Static assets served as-is (no processing)
├── src/
│   ├── content.config.ts        # Content collection definitions (v5 location)
│   ├── content/
│   │   ├── events/
│   │   │   ├── op-iron-fist.md
│   │   │   └── op-sandstorm.md
│   │   ├── roster/
│   │   │   ├── ghost.md
│   │   │   └── reaper.md
│   │   └── gallery/
│   │       ├── aar-iron-fist.md
│   │       └── aar-sandstorm.md
│   ├── layouts/
│   │   └── BaseLayout.astro     # Single shared layout — head, nav, footer, <slot />
│   ├── components/
│   │   ├── Nav.astro            # Hamburger menu lives here
│   │   ├── Footer.astro
│   │   ├── EventCard.astro
│   │   ├── RosterCard.astro
│   │   └── GalleryCard.astro
│   ├── pages/
│   │   ├── index.astro          # Home /
│   │   ├── about.astro          # About /about
│   │   ├── events.astro         # Events /events
│   │   ├── roster.astro         # Roster /roster
│   │   ├── gallery/
│   │   │   ├── index.astro      # Gallery list /gallery
│   │   │   └── [slug].astro     # Gallery detail /gallery/[slug]
│   └── styles/
│       └── global.css           # @import "tailwindcss"; — single entry point
├── astro.config.mjs
├── tsconfig.json
└── package.json
```

**Key structural decision:** `src/content.config.ts` (not `src/content/config.ts`) is the v5 convention. Astro v5 introduced the Content Layer API and moved the config file to `src/content.config.ts` at the `src/` root. The old `src/content/config.ts` path still works for legacy projects but the v5 recommended location is the root-level file shown in the official directory structure diagram.

---

## Content Collection Config

**File:** `src/content.config.ts`

Astro v5 requires a `loader` in every `defineCollection` call — this is the Content Layer API introduced in v5. The old "magic directory scanning" approach is replaced by explicit loaders.

```typescript
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const events = defineCollection({
  loader: glob({ base: './src/content/events', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    location: z.string(),
    description: z.string(),
    status: z.enum(['upcoming', 'completed', 'cancelled']),
  }),
});

const roster = defineCollection({
  loader: glob({ base: './src/content/roster', pattern: '**/*.md' }),
  schema: z.object({
    callsign: z.string(),
    realName: z.string().optional(),
    role: z.string(),
    loadout: z.string().optional(),
    joinedDate: z.coerce.date(),
    active: z.boolean().default(true),
  }),
});

const gallery = defineCollection({
  loader: glob({ base: './src/content/gallery', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    eventRef: z.string().optional(),
    summary: z.string(),
    photos: z.array(z.string()).default([]),
  }),
});

export const collections = { events, roster, gallery };
```

Zod types are inferred automatically. `CollectionEntry<'gallery'>` gives you fully typed `.data` and `.id` on any entry returned by `getCollection()` or `getEntry()`.

---

## Component Map

```
BaseLayout.astro
├── Props: { title: string; description?: string }
├── Renders: <head> (title, meta), <Nav />, <slot />, <Footer />
├── Nav.astro (hamburger menu with is:inline script)
└── Footer.astro

Pages → BaseLayout
├── index.astro          uses BaseLayout, no card components
├── about.astro          uses BaseLayout, no card components
├── events.astro         uses BaseLayout, maps collection → EventCard[]
├── roster.astro         uses BaseLayout, maps collection → RosterCard[]
├── gallery/index.astro  uses BaseLayout, maps collection → GalleryCard[]
└── gallery/[slug].astro uses BaseLayout, renders <Content /> for body

Card Components (dumb/presentational — no data fetching)
├── EventCard.astro      Props: { event: CollectionEntry<'events'> }
├── RosterCard.astro     Props: { member: CollectionEntry<'roster'> }
└── GalleryCard.astro    Props: { entry: CollectionEntry<'gallery'> }
```

Card components are purely presentational. All `getCollection()` calls happen in pages, not in cards. This is the correct Astro pattern — pages own data fetching, components own display.

---

## Data Flow

```
Build time (server-side only):

  src/content/events/*.md
  src/content/roster/*.md       →  content.config.ts (Zod schemas)
  src/content/gallery/*.md           ↓
                                getCollection('events')   [in events.astro]
                                getCollection('roster')   [in roster.astro]
                                getCollection('gallery')  [in gallery/index.astro]
                                getStaticPaths()          [in gallery/[slug].astro]
                                     ↓
                              CollectionEntry<T>[] (typed)
                                     ↓
                              Props passed to card components
                                     ↓
                              render(entry) → <Content />  [slug page only]
                                     ↓
                              Static HTML output in dist/
```

No runtime data fetching. Everything resolves at build time. The `render()` call is also build-time only — it converts markdown body to HTML and returns a `<Content />` component.

---

## Page Patterns

### List page (e.g. `events.astro`)

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import EventCard from '../components/EventCard.astro';
import { getCollection } from 'astro:content';

const events = await getCollection('events');
const sorted = events.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
---
<BaseLayout title="Events">
  <div class="grid gap-4">
    {sorted.map((event) => <EventCard event={event} />)}
  </div>
</BaseLayout>
```

### Dynamic detail page (`gallery/[slug].astro`)

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getCollection, render } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export async function getStaticPaths() {
  const entries = await getCollection('gallery');
  return entries.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

interface Props {
  entry: CollectionEntry<'gallery'>;
}

const { entry } = Astro.props;
const { Content } = await render(entry);
---
<BaseLayout title={entry.data.title}>
  <h1>{entry.data.title}</h1>
  <Content />
</BaseLayout>
```

Critical v5 detail: use `entry.id` not `entry.slug` in `getStaticPaths`. The `slug` property was removed in v5's Content Layer API. `entry.id` is the filename without extension (e.g., `aar-iron-fist`), which maps directly to the URL slug.

---

## Layout and BaseLayout Pattern

```astro
---
// src/layouts/BaseLayout.astro
import '../styles/global.css';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';

interface Props {
  title: string;
  description?: string;
}

const { title, description = 'Death Monkeys Airsoft Team' } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title} | Death Monkeys</title>
  </head>
  <body>
    <Nav />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

The global CSS import happens once in BaseLayout, not in every page. All pages use BaseLayout, so Tailwind is available everywhere with a single import.

If a page needs content injected into `<head>` (e.g., page-specific og:image), use a named slot:

```astro
<!-- In BaseLayout -->
<head>
  <slot name="head" />
</head>

<!-- In a page -->
<BaseLayout title="Gallery">
  <meta slot="head" property="og:image" content="/images/preview.jpg" />
  <!-- default slot content -->
</BaseLayout>
```

---

## Tailwind v4 Integration

**Setup (run once):**
```bash
npx astro add tailwind
```

This installs `@tailwindcss/vite` and configures `astro.config.mjs` automatically. No `tailwind.config.js` is needed — Tailwind v4 is CSS-first.

**`src/styles/global.css`:**
```css
@import "tailwindcss";

/* Custom design tokens */
:root {
  --color-bg: #0a0a0a;
  --color-accent: #6b7c3f;   /* muted olive */
  --color-tan: #c2a87d;       /* tactical tan */
}
```

**`astro.config.mjs`** (after `astro add tailwind`):
```javascript
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
```

**`class:list` for conditional classes** (built into Astro, no extra library):
```astro
<div class:list={['card', { 'card--active': isActive, 'card--featured': isFeatured }]}>
```

---

## Vanilla JS Hamburger Menu Pattern

Astro bundles and deduplicates `<script>` tags by default (they become `type="module"`). For a hamburger toggle that needs to run immediately without module bundling, use `is:inline`:

```astro
---
// src/components/Nav.astro
---
<nav>
  <button id="menu-toggle" aria-expanded="false" aria-controls="nav-links">
    <span class="sr-only">Menu</span>
    <!-- icon -->
  </button>
  <ul id="nav-links" class="hidden">
    <li><a href="/">Home</a></li>
    <li><a href="/events">Events</a></li>
    <li><a href="/roster">Roster</a></li>
    <li><a href="/gallery">Gallery</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>

<script is:inline>
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('nav-links');

  toggle.addEventListener('click', () => {
    const isOpen = !nav.classList.contains('hidden');
    nav.classList.toggle('hidden', isOpen);
    toggle.setAttribute('aria-expanded', String(!isOpen));
  });
</script>
```

`is:inline` means: no TypeScript, no module bundling, renders exactly as written, runs immediately. This is the correct choice for simple DOM toggles. The tradeoff: if Nav.astro is used multiple times on a page, the script is duplicated — not a concern here since Nav appears once per page in BaseLayout.

For a toggle without `is:inline` (processed script), the code runs after module evaluation but Astro deduplicates it across pages, which is fine too. `is:inline` is preferred when you want guaranteed synchronous execution before paint.

---

## TypeScript in Card Components

```astro
---
// src/components/EventCard.astro
import type { CollectionEntry } from 'astro:content';

interface Props {
  event: CollectionEntry<'events'>;
}

const { event } = Astro.props;
const { title, date, location, status } = event.data;
---
<article class="card">
  <h2>{title}</h2>
  <time datetime={date.toISOString()}>{date.toLocaleDateString()}</time>
  <p>{location}</p>
  <span class:list={['badge', { 'badge--upcoming': status === 'upcoming' }]}>
    {status}
  </span>
</article>
```

`CollectionEntry<'events'>` is fully inferred from the Zod schema in `content.config.ts`. `event.data.date` is a `Date` object (because the schema uses `z.coerce.date()`), so `.toISOString()` and `.toLocaleDateString()` work without casting.

---

## Build Order Recommendation

Build in this order to unblock downstream work:

**1. Foundation (unblocks everything)**
- `src/content.config.ts` — defines schemas; all pages depend on this
- `src/styles/global.css` — Tailwind import
- `astro.config.mjs` — Tailwind vite plugin config
- `src/content/` placeholder markdown files (2-3 per collection) — needed to test pages

**2. Layout layer (unblocks all pages)**
- `src/layouts/BaseLayout.astro` — all pages wrap in this
- `src/components/Nav.astro` (with hamburger script)
- `src/components/Footer.astro`

**3. Static pages (no dynamic routing)**
- `src/pages/index.astro`
- `src/pages/about.astro`

**4. Collection list pages + card components (build together)**
- `src/components/EventCard.astro` + `src/pages/events.astro`
- `src/components/RosterCard.astro` + `src/pages/roster.astro`
- `src/components/GalleryCard.astro` + `src/pages/gallery/index.astro`

**5. Dynamic routing (depends on gallery collection + GalleryCard existing)**
- `src/pages/gallery/[slug].astro`

**Rationale:** Steps 1-2 have no inter-dependencies and create the base all subsequent pages need. Step 3 validates the layout before adding complexity. Steps 4-5 can be done in any order once the layout exists, but building card components alongside their list pages surfaces type errors early while the context is fresh.

---

## Component Boundaries Summary

| Component | Fetches Data | Receives Data | Renders |
|-----------|-------------|---------------|---------|
| `BaseLayout.astro` | No | `{ title, description? }` | HTML shell, Nav, Footer, `<slot />` |
| `Nav.astro` | No | None | Nav links, hamburger button + script |
| `Footer.astro` | No | None | Footer markup |
| `EventCard.astro` | No | `CollectionEntry<'events'>` | Single event card |
| `RosterCard.astro` | No | `CollectionEntry<'roster'>` | Single member card |
| `GalleryCard.astro` | No | `CollectionEntry<'gallery'>` | Single gallery/AAR card |
| `events.astro` | `getCollection('events')` | — | List of EventCards |
| `roster.astro` | `getCollection('roster')` | — | List of RosterCards |
| `gallery/index.astro` | `getCollection('gallery')` | — | List of GalleryCards |
| `gallery/[slug].astro` | `getStaticPaths` + `render()` | `CollectionEntry<'gallery'>` via props | Full detail with `<Content />` |

---

## Pitfalls to Avoid

1. **`entry.slug` does not exist in v5.** Use `entry.id`. The upgrade guide explicitly calls this out as a breaking change when migrating to v5.

2. **Config file location.** Use `src/content.config.ts` (at src root), not `src/content/config.ts` (inside the content directory). The v5 docs show this in the canonical directory structure.

3. **The `loader` field is required.** `defineCollection({ schema: z.object({...}) })` without a `loader` will fail in v5. Always include `loader: glob({...})`.

4. **Import Tailwind CSS in the layout, not in astro.config.** The Vite plugin enables Tailwind processing; the actual `@import "tailwindcss"` goes in `src/styles/global.css`, which is imported in `BaseLayout.astro`. Do not put the import in `astro.config.mjs`.

5. **`is:inline` scripts are not TypeScript-aware.** Keep hamburger toggle logic simple (pure DOM queries). If TypeScript support is needed later, remove `is:inline` and let Astro process the script as a module.

---

## Sources

- Astro v5 Content Collections guide: https://github.com/withastro/docs/blob/main/src/content/docs/en/guides/content-collections.mdx
- Astro v5 Directory Structure: https://github.com/withastro/docs/blob/main/src/content/docs/en/basics/project-structure.mdx
- Astro v5 Layouts: https://github.com/withastro/docs/blob/main/src/content/docs/en/basics/layouts.mdx
- Astro v5 Client-side Scripts: https://github.com/withastro/docs/blob/main/src/content/docs/en/guides/client-side-scripts.mdx
- Astro v5 Styling (Tailwind v4): https://github.com/withastro/docs/blob/main/src/content/docs/en/guides/styling.mdx
- Astro v5 Upgrade Guide (slug → id): https://github.com/withastro/docs/blob/main/src/content/docs/en/guides/upgrade-to/v5.mdx
- Astro v5 Directives Reference (class:list, is:inline): https://github.com/withastro/docs/blob/main/src/content/docs/en/reference/directives-reference.mdx
- Astro v5 TypeScript Guide: https://github.com/withastro/docs/blob/main/src/content/docs/en/guides/typescript.mdx
