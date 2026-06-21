# Design Tokens Reference

Complete color palette, typography system, and spacing conventions for the project.

## Color System

### Light Theme
```css
--color-background: #ffffff    /* Page background */
--color-foreground: #0f172a    /* Primary text */
--color-surface: #f8fafc       /* Card/section backgrounds */
--color-border: #e2e8f0        /* Borders and dividers */
--color-accent: #00c758        /* Primary actions, links */
--color-accent-hover: #00a64c  /* Hover state */
--color-muted: #64748b         /* Secondary text */
--color-warning: #facc15       /* Warning states */
--color-highlight-01: #6ec038  /* Special highlights */
```

### Dark Theme
```css
--color-background: #0a0a0f    /* Page background */
--color-foreground: #f1f5f9    /* Primary text */
--color-surface: #111827       /* Card/section backgrounds */
--color-border: #1e293b        /* Borders and dividers */
--color-accent: #08ca5f        /* Primary actions, links */
--color-accent-hover: #07ce60  /* Hover state */
--color-muted: #94a3b8         /* Secondary text */
--color-warning: #facc15       /* Warning states */
--color-highlight-01: #6ec038  /* Special highlights */
```

## Usage Patterns

### Text Colors
- **Primary**: `text-[var(--color-foreground)]`
- **Secondary/Muted**: `text-[var(--color-muted)]`
- **Accent**: `text-[var(--color-accent)]`
- **Warning**: `text-[var(--color-warning)]`
- **Highlight**: `text-[var(--color-highlight-01)]`

### Background Colors
- **Page**: `bg-[var(--color-background)]`
- **Surface**: `bg-[var(--color-surface)]`
- **Accent**: `bg-[var(--color-accent)]`
- **Accent Hover**: `hover:bg-[var(--color-accent-hover)]`
- **Highlight**: `bg-[var(--color-highlight-01)]`

### Border Colors
- **Default**: `border-[var(--color-border)]`
- **Accent**: `border-[var(--color-accent)]`

## Typography System

### Font Families
```css
--font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif
--font-mono: var(--font-geist-mono), ui-monospace, monospace
```

### Font Sizes & Hierarchy

| Element | Class | Size | Usage |
|---------|-------|------|-------|
| H1 (Hero) | `text-5xl sm:text-7xl` | 3rem/4.5rem → 4.5rem/6rem | Main hero headings |
| H2 (Section) | `text-4xl` | 2.25rem/2.5rem | Section titles |
| H3 | `text-2xl` | 1.5rem/2rem | Subsection headings |
| H4 | `text-xl` | 1.25rem/1.75rem | Card titles |
| Body Large | `text-lg` | 1.125rem/1.75rem | Intro paragraphs |
| Body | `text-base` | 1rem/1.5rem | Standard text |
| Small | `text-sm` | 0.875rem/1.25rem | Labels, captions |
| Tiny | `text-xs` | 0.75rem/1rem | Footnotes |

### Font Weights
- **Normal**: `font-normal` (400)
- **Medium**: `font-medium` (500)
- **Semibold**: `font-semibold` (600)
- **Bold**: `font-bold` (700)

### Font Classes
- **Sans-serif**: Default (inherits from root)
- **Monospace**: `font-mono` (for code, labels, timestamps)

## Spacing System

### Standard Increments (Tailwind Scale)
```
0   → 0px
1   → 4px
2   → 8px
3   → 12px
4   → 16px
5   → 20px
6   → 24px
8   → 32px
10  → 40px
12  → 48px
16  → 64px
20  → 80px
24  → 96px
```

### Common Spacing Patterns

| Context | Pattern | Example |
|---------|---------|---------|
| Component padding | `p-4`, `p-6`, `p-8` | `<div className="p-6">` |
| Section padding | `py-16`, `py-24` | `<section className="py-16">` |
| Horizontal spacing | `px-6`, `px-12` | `<div className="px-6 sm:px-12">` |
| Margins | `mb-4`, `mb-8`, `mt-12` | `<h2 className="mb-8">` |
| Gaps (flex/grid) | `gap-4`, `gap-6`, `gap-8` | `<div className="flex gap-4">` |
| Button padding | `px-6 py-3`, `px-8 py-4` | `<button className="px-6 py-3">` |

### Container Widths
- **Small**: `max-w-3xl` (768px) - Forms, narrow content
- **Medium**: `max-w-5xl` (1024px) - Main content
- **Large**: `max-w-7xl` (1280px) - Wide sections
- **Full**: `max-w-screen-xl` (1536px) - Hero sections

## Animation System

### Timing Functions
```typescript
// Standard easing
transition={{ duration: 0.3, ease: "easeInOut" }}

// Smooth entrance
transition={{ duration: 0.5, ease: "easeOut" }}

// Bouncy effect
transition={{ type: "spring", stiffness: 100, damping: 15 }}
```

### FadeIn Delays
- **First element**: `delay={0.1}`
- **Second element**: `delay={0.2}`
- **Third element**: `delay={0.3}`
- **Increment**: +0.1s per element

### Hover Transitions
- **Text color**: `hover:text-[var(--color-foreground)] transition-colors`
- **Background**: `hover:bg-[var(--color-surface)] transition-colors`
- **Scale**: `hover:scale-105 transition-transform`
- **Opacity**: `hover:opacity-80 transition-opacity`

## Responsive Breakpoints

```
sm:  640px  (Small tablets)
md:  768px  (Tablets)
lg:  1024px (Laptops)
xl:  1280px (Desktops)
2xl: 1536px (Large desktops)
```

### Common Responsive Patterns
```tsx
// Text sizing
className="text-5xl sm:text-7xl"

// Spacing
className="px-6 sm:px-12 lg:px-24"

// Layout
className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

// Visibility
className="hidden sm:inline"
className="sm:hidden"

// Flex direction
className="flex-col md:flex-row"
```

## Accessibility Standards

### Focus States
```tsx
// Interactive elements
className="focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2"

// Buttons
className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
```

### ARIA Patterns
```tsx
// Buttons
<button aria-label="Close menu">...</button>

// Decorative elements
<div aria-hidden="true">...</div>

// Landmarks
<nav aria-label="Main navigation">...</nav>

// Live regions
<div aria-live="polite" aria-atomic="true">...</div>
```

### Semantic HTML Priority
1. Use `<button>` for actions
2. Use `<a>` for navigation
3. Use `<nav>` for navigation sections
4. Use `<section>` for content sections
5. Use heading hierarchy (`h1` → `h6`)

## Icon System

### Font Awesome
```tsx
// Solid icons
<i className="fa-solid fa-briefcase" />

// Regular icons
<i className="fa-regular fa-envelope" />

// Sizing
text-sm, text-base, text-lg, text-xl
```

## Border Radius

- **Small**: `rounded-sm` (2px) - Subtle elements
- **Default**: `rounded` (4px) - Buttons, cards
- **Medium**: `rounded-md` (6px) - Inputs, badges
- **Large**: `rounded-lg` (8px) - Containers
- **XL**: `rounded-xl` (12px) - Feature cards
- **Full**: `rounded-full` - Pills, avatars, indicators

## Shadow System

Tailwind shadow classes (use sparingly):
- `shadow-sm` - Subtle depth
- `shadow` - Default elevation
- `shadow-md` - Moderate elevation
- `shadow-lg` - High elevation
- `shadow-xl` - Maximum elevation

---

**Note**: Always prefer CSS variables over hardcoded values to maintain theme consistency.
