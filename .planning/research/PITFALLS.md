# Domain Pitfalls: Astro v5 + Tailwind CSS v4

**Domain:** Static site (Astro v5, output: static, Tailwind v4, content collections, TypeScript strict)
**Researched:** 2026-06-12
**Confidence:** HIGH (all major claims verified against official docs and official changelogs)

---

## Critical Pitfalls

Mistakes that cause rewrites, broken builds, or silent runtime failures.

---

### Pitfall 1: Using `@astrojs/tailwind` with Tailwind CSS v4

**What goes wrong:**
The `@astrojs/tailwind` integration is deprecated and does not support Tailwind CSS v4. If you scaffold a project with the Astro CLI and choose Tailwind, the CLI may still install `@astrojs/tailwind`, which wraps the v3 PostCSS plugin workflow. Using it alongside the v4 package produces either a silent no-op (styles not applied) or a PostCSS version conflict error at build time.

**Why it happens:**
Tailwind v4 ships its own Vite plugin (`@tailwindcss/vite`) and does not require a framework-level integration layer. The old `@astrojs/tailwind` package was never updated for v4's new CSS-first architecture.

**Warning signs:**
- Tailwind utility classes render unstyled in both dev and production
- `npm ls tailwindcss` shows v4 installed but `astro.config.mjs` still has `tailwind()` in the `integrations` array
- Console warnings about deprecated integrations

**Prevention strategy:**

Remove the old integration entirely. Use the Vite plugin instead:

```ts
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
```

Install only: `npm install -D @tailwindcss/vite tailwindcss`
Do NOT install `@astrojs/tailwind`.

Your main CSS file must use the v4 import, not the old directives:

```css
/* src/styles/global.css */
@import "tailwindcss";
```

**Build step affected:** Dev server startup, production build, CSS bundling.

**Sources:** [Astro Tailwind integration docs](https://docs.astro.build/en/guides/integrations-guide/tailwind/), [Tailwind v4 upgrade guide](https://tailwindcss.com/docs/upgrade-guide)

---

### Pitfall 2: Tailwind v4 Renamed Utility Classes (Silent Visual Regressions)

**What goes wrong:**
Several utility classes were renamed between v3 and v4. The old names are silently dropped — no build error, no console warning. The result is unstyled elements that visually regress without explanation.

**Why it happens:**
Tailwind v4 normalized its scale naming conventions. The most affected scales are shadow, blur, rounded, and drop-shadow, which all shifted one step up the size ladder.

**Warning signs:**
- Shadows, rounded corners, or blurs appear heavier/lighter than expected after migrating
- Code review shows class names that were valid in v3
- Running `npx @tailwindcss/upgrade` reports class renames

**Critical renames (v3 → v4):**

| v3 class | v4 class | Visual change |
|---|---|---|
| `shadow-sm` | `shadow-xs` | Use `shadow-xs` for the old "small" shadow |
| `shadow` (bare) | `shadow-sm` | Bare `shadow` no longer exists |
| `drop-shadow-sm` | `drop-shadow-xs` | Same shift |
| `drop-shadow` (bare) | `drop-shadow-sm` | Bare removed |
| `blur-sm` | `blur-xs` | Same shift |
| `blur` (bare) | `blur-sm` | Bare removed |
| `backdrop-blur-sm` | `backdrop-blur-xs` | Same shift |
| `rounded-sm` | `rounded-xs` | Same shift |
| `rounded` (bare) | `rounded-sm` | Bare removed |
| `flex-shrink-*` | `shrink-*` | Deprecated alias removed |
| `flex-grow-*` | `grow-*` | Deprecated alias removed |
| `overflow-ellipsis` | `text-ellipsis` | Deprecated alias removed |
| `bg-opacity-*` | `bg-black/50` syntax | Opacity modifier approach |
| `text-opacity-*` | `text-black/50` syntax | Opacity modifier approach |

**Additional defaults changed:**
- `ring` bare class: was `3px`, now `1px`. Use `ring-3` for the old default.
- `ring` color: was `blue-500`, now `currentColor`.
- `border` color: was `gray-200`, now `currentColor`.
- `outline-none` is now `outline-hidden` (old name produces no outline in some browsers unexpectedly).

**Prevention strategy:**
Run the official codemod before writing any new code on a migrated project:
```bash
npx @tailwindcss/upgrade
```
Then audit all remaining bare `shadow`, `blur`, `rounded`, and `ring` usages manually. Add a comment in your component template noting which version's scale convention you're targeting.

**Build step affected:** No build failure — purely a visual regression at render time.

**Sources:** [Tailwind v4 upgrade guide](https://tailwindcss.com/docs/upgrade-guide)

---

### Pitfall 3: `@apply` Fails in Scoped `<style>` Blocks (Astro, Vue, Svelte)

**What goes wrong:**
In Tailwind v4, a `<style>` block that is compiled separately from your main CSS entry point does not automatically have access to the theme variables, custom utilities, or custom variants defined elsewhere. Using `@apply` in an Astro component's `<style>` tag (or in a CSS module) throws:

```
Cannot apply unknown utility class: text-primary
```

**Why it happens:**
v4 processes each stylesheet in isolation unless explicitly told to reference the main stylesheet. This is an intentional design change to avoid cross-file implicit globals.

**Warning signs:**
- `@apply` works in `global.css` but fails inside `.astro` component `<style>` tags
- Error message: "Cannot apply unknown utility class: X"
- Works in development with a cache hit, fails on clean build

**Prevention strategy:**
Add `@reference` at the top of any scoped `<style>` block that uses `@apply`:

```astro
<style>
  @reference "../styles/global.css";

  .card-title {
    @apply text-xl font-bold text-gray-900;
  }
</style>
```

Alternatively, eliminate `@apply` entirely and use Tailwind classes directly in the markup, which is the idiomatic v4 approach. CSS custom properties from `@theme` are also available directly:

```css
.card-title {
  color: var(--color-gray-900);
  font-size: var(--text-xl);
}
```

**Build step affected:** CSS compilation during both `astro dev` and `astro build`.

**Sources:** [Tailwind v4 upgrade guide](https://tailwindcss.com/docs/upgrade-guide), [@apply broken discussion](https://github.com/tailwindlabs/tailwindcss/discussions/16429)

---

### Pitfall 4: Tailwind v4 Dark Mode — `tailwind.config.js` `darkMode` Key is Gone

**What goes wrong:**
In v3, dark mode was configured in `tailwind.config.js` with `darkMode: 'class'` or `darkMode: ['class', '[data-theme="dark"]']`. In v4, the config file is no longer used. Any v3-style dark mode config is silently ignored, meaning `dark:` prefixed utilities never apply.

**Why it happens:**
v4 is fully CSS-first. Configuration keys that lived in `tailwind.config.js` must now live in your CSS file using directives like `@custom-variant`.

**Warning signs:**
- `dark:bg-gray-900` has no effect even when the class/attribute is present on `<html>`
- `tailwind.config.js` still contains `darkMode: 'class'` but a `@theme` block exists in CSS
- Toggling the dark class/attribute in DevTools has no visual effect

**Prevention strategy:**
Configure dark mode in your CSS file:

```css
/* For class-based dark mode (adding .dark to <html>) */
/* This is the v4 default — no configuration needed for class strategy */

/* For data-attribute dark mode */
@import "tailwindcss";

@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));
```

Then toggle with: `document.documentElement.dataset.theme = 'dark'`

Delete `tailwind.config.js` entirely (or remove the `darkMode` key) to avoid confusion.

**Build step affected:** No build error — silent behavioral failure at runtime.

**Sources:** [Tailwind dark mode docs](https://tailwindcss.com/docs/dark-mode), [GitHub discussion #16517](https://github.com/tailwindlabs/tailwindcss/discussions/16517)

---

### Pitfall 5: Wrong Content Collections Config File Location in Astro v5

**What goes wrong:**
Astro v5 moved the content collections config from `src/content/config.ts` to `src/content.config.ts` (one level up, outside the `content/` directory). If the old path is used and the legacy compatibility flag is not set, Astro may not load your collections at all — `getCollection('blog')` silently returns an empty array.

**Why it happens:**
The new Content Layer API changed the config file convention as part of the v5 redesign. Backwards compatibility exists but is opt-in, and it is deprecated — it will be removed in a future version.

**Warning signs:**
- `getCollection('blog')` returns `[]` with no error
- `astro check` shows no issues but pages render with empty data
- TypeScript does not autocomplete collection names

**Prevention strategy:**
Use the new path: `src/content.config.ts` (at the project `src/` root, NOT inside `src/content/`).

```
src/
  content.config.ts   ← correct for Astro v5
  content/
    blog/
      post-1.md
```

If you must keep the old location temporarily:
```ts
// astro.config.mjs
export default defineConfig({
  legacy: {
    collections: true,
  },
});
```
But plan to migrate — this flag will be removed.

**Build step affected:** Both `astro dev` and `astro build`; content will be empty without an error.

**Sources:** [Astro v5 upgrade guide](https://docs.astro.build/en/guides/upgrade-to/v5/), [Legacy flags docs](https://docs.astro.build/en/reference/legacy-flags/)

---

### Pitfall 6: Using `z` from `'astro:content'` vs `'astro/zod'` vs `'zod'`

**What goes wrong:**
Astro v5 uses `z` from `'astro/zod'` (re-exported Zod) in its own documentation. Importing `z` directly from `'zod'` usually works but can produce type incompatibilities with `CollectionEntry` generics in strict TypeScript mode. Importing from `'astro:content'` also worked in v4 but is no longer the documented pattern in v5's Content Layer API.

**Why it happens:**
The v5 docs consistently show `import { z } from 'astro/zod'` as the import path when using the Content Layer API. The `'astro:content'` barrel export was reorganized in v5.

**Warning signs:**
- TypeScript errors on `CollectionEntry<'blog'>` generic parameter
- `schema` type mismatch errors in `defineCollection()`
- Autocomplete does not suggest schema fields

**Prevention strategy:**
Follow the exact import pattern from the Astro v5 docs:

```ts
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';  // ← use this, not 'zod' or 'astro:content'

const gallery = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/gallery' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
  }),
});

export const collections = { gallery };
```

**Build step affected:** `astro check` and TypeScript type generation (`astro sync`).

**Sources:** [Astro content collections docs](https://docs.astro.build/en/guides/content-collections/)

---

### Pitfall 7: `z.date()` Instead of `z.coerce.date()` for YAML Frontmatter

**What goes wrong:**
YAML frontmatter date values (e.g. `pubDate: 2025-03-15`) are parsed by JS-YAML as JavaScript `Date` objects in some loaders, but as strings in others. Using `z.date()` in your schema will pass or fail inconsistently depending on the loader and how the YAML parser handles the value. On a production build, you may see:

```
InvalidContentEntryFrontmatterError: Content entry frontmatter does not match schema.
"pubDate" expected date, received string
```

**Why it happens:**
Zod's `z.date()` validates that the value is already a JS `Date` object. `z.coerce.date()` wraps the input in `new Date(value)`, which handles string representations safely.

**Warning signs:**
- Build succeeds locally but fails in CI (different Node.js versions parse YAML dates differently)
- Error: "expected date, received string" for frontmatter date fields
- Date fields work during `astro dev` but fail during `astro build`

**Prevention strategy:**
Always use `z.coerce.date()` for date fields in content collection schemas:

```ts
schema: z.object({
  pubDate: z.coerce.date(),           // handles "2025-03-15" or Date object
  updatedDate: z.coerce.date().optional(),
})
```

Never use `z.date()` in content collection schemas.

**Build step affected:** `astro build` schema validation step.

**Sources:** [Astro content collections docs](https://docs.astro.build/en/guides/content-collections/), [Docs issue #4348](https://github.com/withastro/docs/issues/4348)

---

### Pitfall 8: `slug` Field No Longer Exists in Astro v5 Content Layer Collections

**What goes wrong:**
In Astro v4, content collection entries had a reserved `slug` field used in `getStaticPaths`. In v5's Content Layer API, `slug` is replaced by `id`. Using `entry.slug` or `params: { slug: entry.slug }` results in a TypeScript error or a runtime undefined value.

**Why it happens:**
The Content Layer API stores a plain `id` property derived from the file path, not a processed `slug`. The old `render()` method on entries was also removed — it is now a standalone import.

**Warning signs:**
- TypeScript error: "Property 'slug' does not exist on type 'CollectionEntry<...>'"
- Dynamic route pages return 404 for all entries
- `entry.render()` throws "is not a function"

**Prevention strategy:**
```ts
// [id].astro or [...id].astro
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const entries = await getCollection('gallery');
  return entries.map(entry => ({
    params: { id: entry.id },   // ← id, not slug
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);  // ← standalone render(), not entry.render()
```

Also rename your route file from `[slug].astro` to `[id].astro` (or `[...id].astro` for nested paths).

**Build step affected:** `astro build` static path generation; runtime 404s if not caught.

**Sources:** [Astro v5 upgrade guide](https://docs.astro.build/en/guides/upgrade-to/v5/)

---

## Moderate Pitfalls

---

### Pitfall 9: `getStaticPaths` Missing `export` Keyword on Dynamic Routes

**What goes wrong:**
In `output: 'static'` mode, every dynamic route file (files with `[param]` or `[...param]` in the name) must have `getStaticPaths` as a named export. If you define the function without `export`, or forget it entirely, the build fails with:

```
GetStaticPathsRequired: getStaticPaths() function is required for dynamic routes.
```

**Prevention strategy:**
```astro
---
// [id].astro
export async function getStaticPaths() {  // ← export is required
  const entries = await getCollection('gallery');
  return entries.map(entry => ({
    params: { id: entry.id },
    props: { entry },
  }));
}
---
```

Always pair a dynamic route filename with a corresponding exported `getStaticPaths`. If you do not need dynamic routing, use a static filename.

**Build step affected:** `astro build` route resolution.

**Sources:** [Astro getStaticPaths error docs](https://docs.astro.build/en/reference/errors/get-static-paths-required/)

---

### Pitfall 10: Missing `await` on `getCollection` Inside `getStaticPaths`

**What goes wrong:**
`getCollection` is async. Without `await`, it returns a `Promise<CollectionEntry<...>[]>` which then fails when `.map()` is called or when TypeScript strict mode flags the type mismatch. The error is often cryptic:

```
TypeError: posts.map is not a function
```
or TypeScript: `Argument of type 'Promise<...>' is not assignable to...`

**Prevention strategy:**
```ts
export async function getStaticPaths() {
  const entries = await getCollection('gallery');  // ← await required
  return entries.map(entry => ({ params: { id: entry.id }, props: { entry } }));
}
```

Note: `astro check` will catch the TypeScript type error before runtime, which is one reason to run `astro check && astro build` in CI.

**Build step affected:** Build-time — can produce a TypeScript error or a runtime crash during static path generation.

---

### Pitfall 11: Missing `interface Props` on Astro Components in Strict Mode

**What goes wrong:**
With `strict: true` in `tsconfig.json`, any Astro component that accesses `Astro.props` without a typed `Props` interface will error during `astro check`:

```
error TS7006: Parameter 'Astro' implicitly has an 'any' type.
```

`astro check` does not run automatically during `astro build` — it must be wired in separately. Without it in CI, these errors are invisible until someone runs the check manually.

**Prevention strategy:**
Define the interface at the top of every component's frontmatter:

```astro
---
interface Props {
  title: string;
  imageUrl: string;
  altText?: string;
}

const { title, imageUrl, altText = '' } = Astro.props;
---
```

Add `astro check` to the build script in `package.json`:
```json
{
  "scripts": {
    "build": "astro check && astro build"
  }
}
```

**Build step affected:** `astro check` type-checking phase.

**Sources:** [Astro TypeScript docs](https://docs.astro.build/en/guides/typescript/)

---

### Pitfall 12: `CollectionEntry` Generic Type and `astro sync` Requirement

**What goes wrong:**
When passing a collection entry as a prop between components, the type `CollectionEntry<'gallery'>` requires that the TypeScript type definitions have been generated. If `astro sync` has not been run after modifying `src/content.config.ts`, the `.astro/types.d.ts` file is stale. The result is: TypeScript cannot resolve the collection name as a valid generic parameter, or all properties are typed as `unknown`.

**Warning signs:**
- TS error: `Argument of type '"gallery"' is not assignable to parameter of type 'never'`
- IDE autocomplete shows no fields from your schema
- CI passes but local dev has type errors (or vice versa)

**Prevention strategy:**
Run `astro sync` after any change to `src/content.config.ts`:
```bash
npx astro sync
```

Include this in your `prebuild` script:
```json
{
  "scripts": {
    "prebuild": "astro sync",
    "build": "astro check && astro build"
  }
}
```

**Build step affected:** `astro check`, TypeScript type generation.

---

### Pitfall 13: Vanilla JS `querySelector` Returning `null` — Script Timing

**What goes wrong:**
Astro processes `<script>` tags in `.astro` files as ES modules (`type="module"`) by default. Module scripts are deferred and execute after the DOM is ready — this is usually fine. However, there are two failure scenarios:

1. **`is:inline` scripts run at parse time:** If you mark a script `is:inline`, it executes immediately at the point in the document where it appears, before elements lower in the DOM exist. `querySelector` on an element defined after the script returns `null`, and calling `.addEventListener` on `null` throws:
   ```
   TypeError: Cannot read properties of null (reading 'addEventListener')
   ```

2. **Reuse on multiple pages:** If the nav component exists only on certain pages and you use `document.astro:page-load` event listeners (for View Transitions), the listener fires even on pages where the element doesn't exist.

**Prevention strategy:**
For a hamburger menu, use a processed (non-inline) script and guard against null:

```astro
<script>
  // Runs as type="module", deferred — DOM is ready
  const menuButton = document.querySelector<HTMLButtonElement>('#menu-button');
  const nav = document.querySelector<HTMLElement>('#nav-menu');

  // Guard against null (element not present on this page)
  menuButton?.addEventListener('click', () => {
    const isOpen = nav?.getAttribute('aria-expanded') === 'true';
    nav?.setAttribute('aria-expanded', String(!isOpen));
    nav?.classList.toggle('hidden');
  });
</script>
```

Avoid `is:inline` for hamburger menus unless the script is placed directly before `</body>`. Never use `is:inline` to "fix" timing issues — the module default already defers correctly.

**Build step affected:** Runtime only (no build error). Fails silently or throws in browser console.

**Sources:** [Astro client-side scripts docs](https://docs.astro.build/en/guides/client-side-scripts/), [GitHub issue #12494](https://github.com/withastro/astro/issues/12494)

---

### Pitfall 14: Tailwind v4 `@tailwind` Directives Still in CSS

**What goes wrong:**
The v3 CSS entry point used three directives:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
These directives do not exist in v4. If any of them remain in your CSS, v4 will throw a build error or silently ignore them, resulting in no Tailwind styles.

**Prevention strategy:**
Replace all three with a single import:
```css
@import "tailwindcss";
```

If you need separate layers (e.g., to interleave custom CSS):
```css
@import "tailwindcss/preflight" layer(base);
@import "tailwindcss/utilities" layer(utilities);
```

**Build step affected:** CSS compilation — `astro dev` will show unstyled output, `astro build` may warn or silently skip the directives.

**Sources:** [Tailwind v4 upgrade guide](https://tailwindcss.com/docs/upgrade-guide)

---

## Minor Pitfalls

---

### Pitfall 15: Large Images in `public/` Bypass Sharp Optimization

**What goes wrong:**
Files placed in `public/` are copied as-is to `dist/`. They skip Astro's built-in Sharp image optimization pipeline entirely. For a gallery site with many high-resolution images, this silently causes large bundle sizes and slow page loads.

**Prevention strategy:**
Place images in `src/assets/` (or `src/content/`) and reference them through Astro's `<Image />` component or `getImage()`. Only place truly static files (favicons, PDFs, pre-optimized vendor assets) in `public/`.

```astro
---
import { Image } from 'astro:assets';
import galleryImage from '../assets/gallery/photo-01.jpg';
---
<Image src={galleryImage} alt="Gallery photo" width={800} format="webp" />
```

**Build step affected:** `astro build` output size; not a build failure.

**Sources:** [Astro image optimization](https://docs.astro.build/en/guides/images/)

---

### Pitfall 16: `getStaticPaths` Params Must Be Strings

**What goes wrong:**
In `output: 'static'` mode, `getStaticPaths` param values must be strings. Passing a number (e.g. `params: { id: 1 }`) causes:

```
GetStaticPathsInvalidRouteParam: Invalid value for getStaticPaths parameter.
Expected a string, got number.
```

**Prevention strategy:**
Coerce numeric IDs or indices to strings:
```ts
return entries.map((entry, index) => ({
  params: { id: String(index + 1) },  // ← always a string
  props: { entry },
}));
```
When using content collections, `entry.id` is always a string, so this only applies to custom non-collection dynamic routes.

**Build step affected:** `astro build` static path generation.

**Sources:** [Astro getStaticPaths param error docs](https://docs.astro.build/en/reference/errors/get-static-paths-invalid-route-param/)

---

### Pitfall 17: Tailwind v4 `space-*` and `divide-*` Selector Change

**What goes wrong:**
The CSS selector Tailwind v4 generates for `space-y-4` and `divide-y-4` changed:

- v3: `:not([hidden]) ~ :not([hidden])` — applies margin to all siblings
- v4: `:not(:last-child)` — applies margin-bottom to all but the last child

This means layouts that relied on the v3 selector behavior (e.g., flex containers with hidden elements using the `hidden` class) may break visually.

**Prevention strategy:**
Audit any use of `space-*` and `divide-*` utilities in flex or grid layouts that also use `hidden`. The recommended replacement is `flex` + `gap-*`, which is not selector-dependent:

```html
<!-- Preferred in v4 -->
<div class="flex flex-col gap-4">
  <!-- children -->
</div>
```

**Build step affected:** No build failure — visual regression only.

**Sources:** [Tailwind v4 upgrade guide](https://tailwindcss.com/docs/upgrade-guide)

---

### Pitfall 18: Tailwind v4 Arbitrary Value Syntax Changed

**What goes wrong:**
Two arbitrary value syntaxes changed:

1. CSS variables: `bg-[--brand-color]` is now `bg-(--brand-color)` (parentheses, not square brackets)
2. Grid column definitions: `grid-cols-[1fr,200px]` is now `grid-cols-[1fr_200px]` (underscore for space inside brackets, not comma)

The old syntax either silently produces invalid CSS or is treated as an invalid class.

**Prevention strategy:**
Search your templates for `[--` patterns and replace with `(--`. Search for comma-separated values inside brackets in grid/object-position classes and replace commas with underscores.

**Build step affected:** No build failure — silent CSS generation error.

**Sources:** [Tailwind v4 upgrade guide](https://tailwindcss.com/docs/upgrade-guide)

---

## Phase-Specific Warnings

| Phase / Topic | Likely Pitfall | Mitigation |
|---|---|---|
| Project setup | Installing `@astrojs/tailwind` instead of `@tailwindcss/vite` | Use only the Vite plugin; delete the integration package |
| Tailwind styling | Renamed shadow/blur/rounded/ring classes | Run `npx @tailwindcss/upgrade` on any migrated v3 code; audit manually for new code |
| Content collection schema | `z.date()` for date fields | Always use `z.coerce.date()` in collection schemas |
| Content collection config | Wrong file path for `content.config.ts` | File must be at `src/content.config.ts`, not `src/content/config.ts` |
| Dynamic gallery route | Using `entry.slug` instead of `entry.id` | v5 uses `id`; rename param file to `[id].astro` |
| Dynamic gallery route | Omitting `export` on `getStaticPaths` | Always export the function; `astro build` will error |
| TypeScript / `astro check` | Missing `interface Props` on components | Define Props in every component; wire `astro check` into the build script |
| TypeScript / types | Stale `.astro/types.d.ts` after schema change | Run `astro sync` after any `content.config.ts` change |
| Hamburger menu JS | `querySelector` returning null | Use optional chaining (`?.`) and place scripts as processed modules, not `is:inline` |
| Dark mode | `darkMode` key in `tailwind.config.js` | Configure via `@custom-variant` in CSS; delete the config file |
| Scoped `@apply` | `@apply` failing in component `<style>` tags | Add `@reference "../styles/global.css"` at the top of each scoped block |
| Gallery images | Images in `public/` skipping optimization | Store gallery images in `src/assets/`, reference via `<Image />` |

---

## Sources

- [Tailwind CSS v4 upgrade guide](https://tailwindcss.com/docs/upgrade-guide) — HIGH confidence, official docs
- [Astro v5 upgrade guide](https://docs.astro.build/en/guides/upgrade-to/v5/) — HIGH confidence, official docs
- [Astro content collections docs](https://docs.astro.build/en/guides/content-collections/) — HIGH confidence, official docs
- [Astro TypeScript guide](https://docs.astro.build/en/guides/typescript/) — HIGH confidence, official docs
- [Astro client-side scripts guide](https://docs.astro.build/en/guides/client-side-scripts/) — HIGH confidence, official docs
- [Astro getStaticPaths required error](https://docs.astro.build/en/reference/errors/get-static-paths-required/) — HIGH confidence, official docs
- [Astro @astrojs/tailwind integration (deprecated)](https://docs.astro.build/en/guides/integrations-guide/tailwind/) — HIGH confidence, official docs
- [Tailwind @apply broken GitHub discussion](https://github.com/tailwindlabs/tailwindcss/discussions/16429) — MEDIUM confidence, community-confirmed issue
- [Astro script re-execution issue #12494](https://github.com/withastro/astro/issues/12494) — MEDIUM confidence, confirmed GitHub issue
- [Tailwind dark mode v4 discussion #16517](https://github.com/tailwindlabs/tailwindcss/discussions/16517) — MEDIUM confidence, community-confirmed
- [Astro legacy flags reference](https://docs.astro.build/en/reference/legacy-flags/) — HIGH confidence, official docs
