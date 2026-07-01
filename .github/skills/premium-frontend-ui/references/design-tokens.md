# Design Tokens Reference

Color palette, typography, spacing, and motion conventions for the project.

## Design Philosophy

A **professional, minimal, editorial** aesthetic:
- **Restraint over decoration**: Neutral tones carry the design; the accent is an occasional highlight, not a default.
- **White space is a feature**: Generous negative space signals confidence and quality. When in doubt, add breathing room, not content.
- **Calm motion**: Animation orients and guides — it never performs for its own sake.
- **Contrast parity**: Light and dark themes meet the same accessibility and polish standards.

## Color System

### Color Strategy

The palette is **neutral-first** — ~90% of any screen should be background, surface, foreground, and muted tones. Reserve the accent for a few high-intent moments:
- Use it for the single primary action, active/selected states, and focus rings.
- Prefer neutral foreground for links and secondary buttons; build hierarchy with borders and weight, not color.
- Avoid accent headings, large accent fills, gradients, and multiple accents competing in one viewport.
- Aim for **at most one or two accent elements visible at a time**.

### Light Theme
```css
--color-background: #ffffff    /* Page background */
--color-foreground: #0f172a    /* Primary text — 16.9:1 */
--color-surface: #f6f8fa       /* Card/section backgrounds */
--color-border: #d5dbe2        /* Borders/dividers — visible separation */
--color-accent: #067a3a        /* Primary actions/focus — darkened for AA */
--color-accent-hover: #05602e  /* Hover state */
--color-muted: #4b5563         /* Secondary text — 7.4:1 */
--color-warning: #b45309       /* Warning — accessible amber on light */
--color-highlight-01: #3f7f1e  /* Highlights — darkened for contrast */
```

> **Light contrast**: `--color-muted` and `--color-accent` are intentionally darker than a naive brand green so secondary text and interactive elements clear **WCAG AA (4.5:1)** on white. Never place the dark-theme accent (`#08ca5f`) on a light background — it fails contrast.

### Dark Theme
```css
--color-background: #0a0a0f    /* Page background */
--color-foreground: #f1f5f9    /* Primary text */
--color-surface: #111827       /* Card/section backgrounds */
--color-border: #273449        /* Borders/dividers — stronger separation */
--color-accent: #08ca5f        /* Primary actions/focus */
--color-accent-hover: #23d873  /* Hover — lightens for feedback */
--color-muted: #9aa8bd         /* Secondary text — 6.8:1 */
--color-warning: #fbbf24       /* Warning states */
--color-highlight-01: #6ec038  /* Special highlights */
```

### Contrast Targets (both themes)

| Pair | Minimum | Notes |
|------|---------|-------|
| Foreground / background | 12:1+ | Body and headings |
| Muted / background | 4.5:1 (AA) | Secondary text, captions |
| Accent / background | 4.5:1 (AA) | Links, buttons, focus rings |
| Border / surface | 3:1 | Separation without harshness |

Verify **both** themes with a contrast checker whenever a color changes — don't tune only dark.

## Usage Patterns

### Text
- **Primary**: `text-[var(--color-foreground)]` — headings and body (default)
- **Muted**: `text-[var(--color-muted)]` — captions, metadata, supporting copy
- **Accent**: `text-[var(--color-accent)]` — links and primary action only, not headings
- **Warning**: `text-[var(--color-warning)]`
- **Highlight**: `text-[var(--color-highlight-01)]` — rare, single-word emphasis at most

> Build hierarchy with **size, weight, and spacing** before reaching for color. A page should read clearly in grayscale.

### Background
- **Page**: `bg-[var(--color-background)]`
- **Surface**: `bg-[var(--color-surface)]` — workhorse for cards/sections
- **Accent**: `bg-[var(--color-accent)]` — primary CTA only; avoid large fills
- **Accent Hover**: `hover:bg-[var(--color-accent-hover)]`

### Border
- **Default**: `border-[var(--color-border)]` — preferred separator
- **Accent**: `border-[var(--color-accent)]` — active/selected state only

## Typography

### Font Families
```css
--font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif
--font-mono: var(--font-geist-mono), ui-monospace, monospace
```

### Sizes & Hierarchy

Favor a **restrained, editorial scale** — oversized display type reads as loud, not premium. Reserve the largest step for a single hero heading per page; most sections top out at `text-3xl`.

| Element | Class | Usage |
|---------|-------|-------|
| H1 (Hero) | `text-4xl sm:text-5xl` | Main hero heading (one per page) |
| H2 (Section) | `text-2xl sm:text-3xl` | Section titles |
| H3 | `text-xl` | Subsection headings |
| H4 | `text-lg` | Card titles |
| Body Large | `text-lg` | Intro paragraphs (sparingly) |
| Body | `text-base` | Standard text |
| Small | `text-sm` | Labels, captions |
| Tiny | `text-xs` | Footnotes, metadata |

> **Scale discipline**: Avoid `text-6xl`/`text-7xl`. Two-step contrast (e.g. `text-3xl` over `text-base`) is enough. Line-height and margin do more for quality than raw size.

### Weights & Classes
- Weights: `font-normal` (400), `font-medium` (500), `font-semibold` (600), `font-bold` (700)
- Sans-serif default; `font-mono` for code, labels, timestamps

## Spacing

### Tailwind Scale
`0→0` `1→4` `2→8` `3→12` `4→16` `5→20` `6→24` `8→32` `10→40` `12→48` `16→64` `20→80` `24→96` (px)

### Common Patterns

White space is the primary tool for a minimal, premium feel. **Bias toward the larger value** and give sections room to breathe.

| Context | Pattern |
|---------|---------|
| Component padding | `p-6`, `p-8` |
| Section padding | `py-24`, `py-32` |
| Horizontal | `px-6 sm:px-12 lg:px-24` |
| Margins | `mb-6`, `mb-12`, `mt-16` |
| Gaps | `gap-6`, `gap-8`, `gap-12` |
| Button padding | `px-6 py-3`, `px-8 py-4` |

### White Space Guidelines
- **Section rhythm**: Separate major sections with `py-24`+ for clear breathing room.
- **Line length**: Keep body text within `max-w-2xl`/`max-w-3xl` (~60–75 chars) even in wide containers.
- **Fewer, larger gaps**: Prefer one strong gap over several cramped ones; increase `gap`/padding before adding dividers.
- **Let content float**: Don't stretch elements to fill width — centered, narrower columns feel more considered.
- **Empty space is intentional**: Don't fill negative space with decoration; it signals quality.

### Container Widths
- `max-w-3xl` (768px) — forms, narrow content
- `max-w-5xl` (1024px) — main content
- `max-w-7xl` (1280px) — wide sections
- `max-w-screen-xl` (1536px) — hero sections

## Animation

### Motion Philosophy

Motion should be **purposeful and quiet** — used to orient (entrances, state changes, focus), never as decoration. Overused movement feels busy and undermines professionalism.

**Avoid:**
- Containers/cards that lift, translate, or scale on hover (`hover:-translate-y`, whole-card `hover:scale-105`).
- Continuous/looping animations on non-essential elements.
- Parallax, floating shapes, and attention-grabbing effects with no function.
- Multiple things animating at once in one viewport.

**Prefer:**
- Subtle, one-time entrance fades as content appears.
- Color/opacity transitions for hover and focus feedback.
- Removing any motion that doesn't help the user understand something.
- Respecting `prefers-reduced-motion`.

### Timing
```typescript
transition={{ duration: 0.3, ease: "easeInOut" }}  // standard
transition={{ duration: 0.5, ease: "easeOut" }}    // smooth entrance
```

> Keep durations short (0.2–0.5s). Avoid heavy spring/bounce on UI chrome — springs are for playful contexts, not professional layouts.

### FadeIn Delays
Stagger by +0.1s per element (`0.1`, `0.2`, `0.3`…). Keep groups small; long cascades feel slow and gimmicky.

### Hover

Prefer color, border, and opacity changes over movement — clear feedback without shifting layout.
- **Text**: `hover:text-[var(--color-foreground)] transition-colors`
- **Background**: `hover:bg-[var(--color-surface)] transition-colors`
- **Border**: `hover:border-[var(--color-accent)] transition-colors`
- **Opacity**: `hover:opacity-80 transition-opacity`

> **Don't move containers on hover.** Skip `hover:-translate-y-*` and whole-card `hover:scale-*`. If hinting interactivity with scale, keep it under `scale-[1.02]` on small controls only (buttons, icons).

### Reduced Motion
```tsx
className="motion-reduce:transition-none motion-reduce:transform-none"
```

## Responsive Breakpoints

`sm:640` `md:768` `lg:1024` `xl:1280` `2xl:1536` (px)

```tsx
className="text-4xl sm:text-5xl"                    // text (restrained)
className="px-6 sm:px-12 lg:px-24"                  // spacing
className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" // layout
className="hidden sm:inline"                        // visibility
className="flex-col md:flex-row"                    // direction
```

## Accessibility

### Focus States
```tsx
className="focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2"
className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
```

### ARIA
```tsx
<button aria-label="Close menu">...</button>
<div aria-hidden="true">...</div>
<nav aria-label="Main navigation">...</nav>
<div aria-live="polite" aria-atomic="true">...</div>
```

### Semantic HTML
`<button>` for actions · `<a>` for navigation · `<nav>` for nav sections · `<section>` for content · heading hierarchy `h1`→`h6`.

## Icons — Font Awesome
```tsx
<i className="fa-solid fa-briefcase" />
<i className="fa-regular fa-envelope" />
// Sizing: text-sm, text-base, text-lg, text-xl
```

## Border Radius
`rounded-sm` (2px) · `rounded` (4px, buttons/cards) · `rounded-md` (6px, inputs) · `rounded-lg` (8px, containers) · `rounded-xl` (12px, feature cards) · `rounded-full` (pills, avatars).

## Shadows

Use sparingly: `shadow-sm` → `shadow` → `shadow-md` → `shadow-lg` → `shadow-xl` (subtle to maximum elevation).

---

**Note**: Always prefer CSS variables over hardcoded values to maintain theme consistency.
