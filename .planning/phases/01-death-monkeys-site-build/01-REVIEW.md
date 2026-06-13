---
phase: 01-death-monkeys-site-build
reviewed: 2026-06-13T00:00:00Z
depth: standard
files_reviewed: 10
files_reviewed_list:
  - src/content.config.ts
  - src/components/EventCard.astro
  - src/components/GalleryCard.astro
  - src/components/RosterCard.astro
  - src/pages/about.astro
  - src/pages/events.astro
  - src/pages/gallery/[id].astro
  - src/pages/gallery/index.astro
  - src/pages/index.astro
  - src/pages/roster.astro
findings:
  critical: 2
  warning: 4
  info: 3
  total: 9
status: issues_found
---

# Phase 01: Code Review Report

**Reviewed:** 2026-06-13
**Depth:** standard
**Files Reviewed:** 10
**Status:** issues_found

## Summary

Reviewed 10 source files across content collection config, page components, and Astro pages. The Astro v5 API usage is correct throughout (standalone `render()`, `entry.id`, `glob()` loader, `src/content.config.ts` location). No deprecated patterns from CLAUDE.md's deprecation table were found.

Two blockers were found: a missing npm package that silently drops all typography styling on the gallery detail page, and non-descriptive duplicate `alt` text on gallery photo grids. Four warnings cover a counterintuitive events sort order, a prop that goes nowhere, magic color values bypassing the design token system, and unvalidated URL strings in content schema. Three info items cover unused schema data, a missing page heading, and weak referential integrity.

## Structural Findings (fallow)

No structural pre-pass was provided for this review.

## Narrative Findings (AI reviewer)

## Critical Issues

### CR-01: `prose` classes silently no-op — `@tailwindcss/typography` not installed

**File:** `src/pages/gallery/[id].astro:71`
**Issue:** The AAR body is rendered inside `<article class="prose prose-invert max-w-none ...">`. The `prose` and `prose-invert` utility classes are provided by `@tailwindcss/typography`, which is not listed in `package.json` and is not present under `node_modules/@tailwindcss/`. Without this plugin the classes are silently ignored by Tailwind v4 — the Markdown body will render as completely unstyled raw text (no heading sizes, no paragraph spacing, no list bullets, no code formatting). This is not a build error; `astro build` will succeed while the output is visually broken.

**Fix:** Either install the plugin and register it, or remove the dependency on `prose` and write explicit custom styles.

Option A — install the plugin:
```bash
npm install @tailwindcss/typography
```
Then in `src/styles/global.css` add after the `@import "tailwindcss"` line:
```css
@plugin "@tailwindcss/typography";
```

Option B — replace with explicit Tailwind classes on the `<article>` element and use `@layer components` to style Markdown output without the plugin.

---

### CR-02: All gallery photos share identical, non-descriptive `alt` text

**File:** `src/pages/gallery/[id].astro:56-65`
**Issue:** Every `<img>` in the photo grid is assigned `alt={entry.data.title}`. In a gallery with multiple photos this means every image has the same alt string (e.g., "AAR: Black Banana Engagement"). Screen reader users hear the same label repeated for every image with no indication of what distinguishes one photo from another. This also fails WCAG 2.1 SC 1.1.1.

**Fix:** The `photos` schema field is a plain `string[]`. The simplest fix that requires no schema change is to append a positional label:
```astro
{entry.data.photos.map((photoUrl: string, index: number) => (
  <img
    src={photoUrl}
    alt={`${entry.data.title} — photo ${index + 1} of ${entry.data.photos!.length}`}
    width="800"
    height="600"
    class="w-full object-cover border-2 border-[#1f2937]"
    loading="lazy"
  />
))}
```
A better long-term fix is to change `photos` in the schema to `z.array(z.object({ url: z.string().url(), caption: z.string() }))` so each photo carries a meaningful caption.

---

## Warnings

### WR-01: Events sorted oldest-first — upcoming events appear at the bottom

**File:** `src/pages/events.astro:7`
**Issue:** The sort comparator is `a.data.date.valueOf() - b.data.date.valueOf()` — ascending by date. For a team events page the expected behavior is that the next scheduled op appears first. With the current sort, a visitor sees the oldest completed event at the top and must scroll to the bottom to find upcoming operations. This is a logic inversion that looks like a bug against intent.

**Fix:**
```ts
// Descending by date — most recent / most upcoming first
const events = allEvents.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
```
If the intent is "upcoming events first, then completed in reverse chronological order," a two-pass sort (filter then sort each group) would be cleaner. But simply reversing the comparator already matches the convention used for the gallery collection on line 8 of `gallery/index.astro`.

---

### WR-02: `joinedDate` schema field declared but never surfaced in `RosterCard`

**File:** `src/components/RosterCard.astro:2-8`, `src/content.config.ts:22`
**Issue:** The roster schema declares `joinedDate: z.coerce.date().optional()` and the roster content files populate it (e.g., `nakunga.md` has `joinedDate: 2023-03-20`). The page spreads `{...member.data}` onto `RosterCard`, but `RosterCard`'s Props interface does not declare `joinedDate` and the component never renders it. The data is silently discarded. This is not a type error (Astro allows extra props in spread), but it means the schema field is collecting data that goes nowhere.

**Fix:** Either add `joinedDate` to the Props interface and display it:
```ts
interface Props {
  callsign: string;
  realName?: string;
  role: string;
  loadout: string;
  active: boolean;
  joinedDate?: Date;
}
```
And render it in the card:
```astro
{joinedDate && (
  <p class="text-[14px] text-text-muted leading-[1.4]">
    Since {joinedDate.toLocaleDateString('en-CA', { year: 'numeric', month: 'long' })}
  </p>
)}
```
Or remove `joinedDate` from the schema if it is intentionally not displayed.

---

### WR-03: Magic color values bypass the design token system

**File:** `src/components/GalleryCard.astro:26`, `src/pages/gallery/[id].astro:62`
**Issue:** Both files use the hardcoded hex `border-[#1f2937]` instead of the design token. The global CSS defines `--color-border: #27272a` (near-black zinc), but `#1f2937` is a different color (dark slate-700). This is either an intentional divergence (in which case a token should be added) or an accidental mismatch that will cause visual inconsistency as the token changes. Using a raw hex inside an arbitrary value also escapes the theming system entirely.

**Fix:** If this border color is intentional, add a token in `global.css`:
```css
--color-surface-border-raised: #1f2937;
```
Then replace both occurrences with `border-[var(--color-surface-border-raised)]` or a Tailwind token class. If the intent was to use the existing `--color-border`, replace with `border-border`.

---

### WR-04: `photos` schema accepts any string — no URL validation

**File:** `src/content.config.ts:34`
**Issue:** `photos: z.array(z.string()).optional()` accepts any string value, including relative paths, empty strings, or malformed values. These are rendered directly into `src=` attributes. An empty string produces `<img src="">` which triggers a redundant network request to the page's own URL. A relative path without a leading slash may resolve incorrectly depending on build base path.

**Fix:** Use `z.string().url()` to enforce absolute URL format at schema validation time:
```ts
photos: z.array(z.string().url()).optional(),
```
This will surface malformed entries as content validation errors at build time rather than silent runtime failures.

---

## Info

### IN-01: `about.astro` has no `<h1>` — heading hierarchy starts at `<h2>`

**File:** `src/pages/about.astro:15,34,47,67`
**Issue:** The About page has four `<h2>` sections ("Who We Are", "Where We Play", "Ethos", "Want In?") but no `<h1>`. The introductory paragraph at line 9 acts as a lead but is a `<p>`, not a heading. This breaks document outline and is suboptimal for SEO (crawlers expect an `<h1>` per page) and accessibility (screen reader landmark navigation).

**Fix:** Add an `<h1>` before the lead paragraph:
```astro
<h1 class="font-heading text-[32px] font-bold uppercase tracking-[0.1em] text-text-primary mb-[var(--spacing-lg)]">
  About
</h1>
```

---

### IN-02: `eventRef` has no referential integrity to the events collection

**File:** `src/content.config.ts:32`
**Issue:** `eventRef: z.string().optional()` is intended to link a gallery AAR to an event entry (e.g., `eventRef: "black-banana-engagement"`). However, the value is a plain string with no validation against the events collection. A typo in `eventRef` will go undetected at build time and simply render the wrong or missing reference in the detail page at `gallery/[id].astro:37-39`.

**Fix:** This cannot be fully resolved with Zod alone since cross-collection references are not natively supported in Astro content schemas. The pragmatic fix is to add a comment in the schema noting the expected format, or to introduce a build-time validation step. Alternatively, remove the field from the detail page display unless cross-linking is fully implemented.

---

### IN-03: `joinedDate` schema data collected but not displayed (duplicate of WR-02 data side)

Covered by WR-02 above. Noted here for completeness: the schema field and content file data exist and are valid, but produce no rendered output. If the decision is to not display join dates, the field should be removed from the schema to avoid misleading future content authors.

---

_Reviewed: 2026-06-13_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
