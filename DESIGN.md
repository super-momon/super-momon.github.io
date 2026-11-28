---
name: super-momon Portfolio & Quiz Hub
description: Full Stack Developer portfolio and interactive CS quiz application
colors:
  primary: "#08ca5f"
  primary-hover: "#23d873"
  primary-contrast: "#052e16"
  neutral-bg: "#0a0a0f"
  surface: "#111827"
  border: "#273449"
  foreground: "#f1f5f9"
  muted: "#9aa8bd"
  warning: "#fbbf24"
  overlay: "#0a0a0f"
  light-primary: "#067a3a"
  light-primary-hover: "#05602e"
  light-primary-contrast: "#ffffff"
  status-easy: "#166534"
  status-medium: "#854d0e"
  status-hard: "#9a3412"
  status-extra-hard: "#b91c1c"
  status-info: "#6d28d9"
  status-info-strong: "#5b21b6"
  status-success-strong: "#15803d"
  status-danger-strong: "#b91c1c"
  status-easy-dark: "#4ade80"
  status-medium-dark: "#fbbf24"
  status-hard-dark: "#fb923c"
  status-extra-hard-dark: "#f87171"
  status-info-dark: "#c4b5fd"
  status-info-strong-dark: "#7c3aed"
typography:
  display:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 5vw, 4rem)"
    fontWeight: 700
    lineHeight: 1.1
  caption:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    lineHeight: 1.5
rounded:
  sm: "6px"
  md: "12px"
  lg: "24px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-contrast}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
---

# Design System: super-momon Portfolio & Quiz Hub

## Overview

**Creative North Star: "Cyber-Engineered Arcade"**

A high-performance, dark-mode-first developer workspace combined with an immersive gaming aesthetic. Built around vibrant emerald/neon green accents set against ultra-deep obsidian space (`#0a0a0f`) and glassmorphic elevated surfaces (`#111827`). Crisp typography, high contrast, and dynamic micro-animations reflect engineering precision.

**Key Characteristics:**
- Dark mode glassmorphic UI with vibrant emerald green (`#08ca5f`) key actions
- High-contrast typography powered by Geist sans & Geist mono
- Tactical borders (`#273449`) and subtle glow effects
- Responsive, gaming-inspired layouts with interactive feedback

## Motion

Motion must explain feedback, state, continuity, or spatial relationships without delaying interaction. Follow [UI_ANIMATION_GUIDELINES.md](UI_ANIMATION_GUIDELINES.md) for timing, easing, press feedback, popover origins, touch behavior, staggering, performance, and reduced-motion implementation.

## Colors

The palette pairs deep dark backgrounds with crisp neon emerald highlights for a tech-focused, tactile feel.

### Primary
- **Emerald Pulse** (`#08ca5f`): Used for key call-to-actions, score indicators, active states, and focus rings.
- **Primary contrast** (`#052e16`): Dark foreground on the bright dark-theme accent; it provides 6.83:1 contrast.
- **Light theme accent** (`#067a3a`): Paired with white action text for 5.45:1 contrast; hover uses `#05602e`.

### Neutral
- **Obsidian Deep** (`#0a0a0f`): Core background color.
- **Surface Elevation** (`#111827`): Cards, modal containers, and elevated surfaces.
- **Slate Border** (`#273449`): Crisp structural divider and card border line.
- **Foreground Text** (`#f1f5f9`): Primary high-contrast reading text.
- **Muted Slate** (`#9aa8bd`): Secondary text, subtitles, and metadata labels.
- Light surfaces use `#f6f8fa`, borders use `#d5dbe2`, and muted text uses `#4b5563`.
- Quiz difficulty and feedback labels use semantic status colors with separate light- and dark-theme values; these indicate state and never replace the emerald action accent. Light-theme statuses use darker foregrounds, while dark-theme values remain vivid against elevated surfaces.

### Named Rules
**The Single-Accent Anchor.** The emerald accent is reserved for interactive affordances, key scores, and active selections.

## Typography

**Display Font:** Geist Sans (fallback: system-ui, sans-serif)
**Mono Font:** Geist Mono (fallback: ui-monospace, monospace)

### Hierarchy
- **Display** (700, clamp(2rem, 5vw, 4rem), 1.1): Hero titles and category headers.
- **Headline** (600, 1.5rem, 1.25): Card headings, section titles.
- **Body** (400, 1rem, 1.5): Standard reading prose and question prompts.
- **Label** (500, 0.875rem, tracking-wide, uppercase): Badges, mode tags, timer displays.
- **Caption** (500, 0.75rem, 1.4): Dense secondary metadata only; interactive text and core labels use the label size or larger.

## Layout

12-column fluid grid system on desktop, collapsing smoothly to single-column flex/grid containers on mobile. Spatial rhythm relies on an 8px base unit with generous breathing room (gap-4, gap-6, gap-8).

## Elevation & Depth

Surfaces are dark, semi-transparent glassmorphic panels (`bg-surface/80 backdrop-blur-md`) separated by fine 1px borders (`border-border`). Shadows are subtle ambient glows used primarily for hover and active selection states.

## Shapes

Card radii default to `rounded-xl` (12px) to `rounded-2xl` (16px), with pill badges (`rounded-full`) for active tags and status indicators.

## Components

### Buttons
- **Shape:** Rounded 12px or full pill.
- **Primary:** Background `#08ca5f`, text `#052e16`, font weight 600. In light mode use `#067a3a` with white text. Hover uses the theme-specific contrast-safe color.
- **Ghost / Outline:** Background transparent, border `#1e293b`, hover border `#08ca5f`.

### Floating Actions
- **Placement:** Lower-right on the portfolio, offset with viewport and mobile safe-area spacing.
- **Hierarchy:** Use a single compact pill at a lower stacking level than navigation and dialogs; do not cover primary content or add a second competing accent.
- **Feedback:** Keep the control footprint stable while showing loading, saving, completed, and error states. On an unrecorded visit, attach a concise invitation to the control and keep it visible until the visitor activates the button. Dynamic counts use tabular numerals, state changes use text and icons, and errors remain visible until the visitor retries.
- **Accessibility:** Preserve a 44px minimum target, visible focus ring, explicit accessible label, live status announcements, and reduced-motion/reduced-transparency behavior.

### Cards
- **Background:** `#111827` with optional backdrop blur.
- **Border:** 1px `#1e293b`, transitions to `#08ca5f` on active/focus.

## Do's and Don'ts

### Do:
- **Do** use `#08ca5f` consistently as the sole interactive accent color.
- **Do** maintain contrast-safe foregrounds in both light and dark themes.

### Don't:
- **Don't** use low-contrast text against either theme's background.
- **Don't** introduce arbitrary un-themed accent colors.

## Reusable Design Architecture

### Liquid Glass visual contract

The Liquid Glass design uses a mobile-app inspired frosted surface language:

- Light mode uses cool pearl backgrounds, soft sky-blue glass, pale cyan ambient light, and clear navy text.
- Dark mode uses a deeper ink-navy base (`#080f1c`), softened blue-navy surfaces, and ice-blue highlights for a floating optical-lens effect.
- Functional glass is used for navigation, menus, dialogs, elevated controls, section cards, and primary accent actions. Underlying content remains readable because each layer uses a translucent but bounded surface.
- Section cards use the `design-surface` contract; selected tab navigation uses a distinct high-opacity control state, especially in dark mode, so the selected surface stays separated from the parent card; primary accent actions use the `liquid-glass-action` contract with a near-solid fill and only the optical highlight kept translucent.
- Surface treatments use 12-20px backdrop blur on supported screens, a fine 1px border, one soft top-edge highlight, and restrained offset depth.
- Cards retain the documented 12-16px radius scale. The navbar uses a pill or 20px mobile radius, and the dialog family keeps the 24px radius scale.
- Emerald remains the action accent. Blue and cyan are atmospheric and structural, so they do not introduce competing action colors.
- Hover states use only a subtle border and soft depth change; they do not introduce glare, shimmer, or moving light effects.
- Mobile uses the lower 12px blur tier, avoids fixed atmospheric backgrounds, and keeps all touch targets and text at the existing responsive spacing.
- Reduced transparency replaces glass variables with solid cream/navy surfaces. Reduced motion removes transition movement.

The reusable design switch is implemented with a central registry and design-specific CSS, while keeping components on semantic contracts so they do not need design-name branches.

### Registry and contract

- The design registry is `src/lib/designSystem.ts`.
- `DESIGN_IDS`, `DesignId`, `DESIGN_REGISTRY`, `DEFAULT_DESIGN`, `DESIGN_STORAGE_KEY`, and `DESIGN_URL_PARAM` define the supported design list, labels/descriptions, fallback, persistence key (`design-preference`), and URL parameter (`design`).
- `DESIGN_REGISTRY` is the display metadata contract. `isDesignId()` is the runtime allowlist; update it whenever `DESIGN_IDS` gains a design.
- `src/components/DesignProvider.tsx` owns the active design state and writes `html[data-design="<id>"]`. That attribute is the CSS selector contract for every design.

### Dedicated CSS and semantic classes

- Design CSS lives in `src/styles/designs/classic.css` and `src/styles/designs/liquid-glass.css`.
- Both files are imported by `src/app/globals.css`.
- Each design must cover its own light and dark values and style these shared semantic classes:
  - `design-surface`
  - `design-elevated-control`
  - `design-navbar`
  - `design-dialog`
  - `design-ambient`
- Designs should provide the shared color and elevation variables used by components, including `--color-background`, `--color-foreground`, `--color-surface`, `--color-border`, `--color-accent`, `--color-accent-hover`, `--color-accent-contrast`, `--color-muted`, `--color-warning`, `--color-overlay`, `--color-highlight-01`, and the semantic status tokens. Component markup should use these classes and variables rather than branching on a design ID.

### Tailwind and design CSS responsibilities

- Tailwind is responsible for layout, spacing, typography, responsive behavior, state utilities, and composition. Semantic Tailwind colors such as `bg-surface`, `text-accent`, and `border-border` resolve from CSS variables.
- Design CSS is responsible for what the selected design *means*: `html[data-design]`-scoped palettes, glass or solid surface treatment, shadows, borders, ambient effects, and design-only fallbacks.
- Tailwind utilities such as `.dark:` are theme behavior, not design behavior. Keep `html.dark` handling independent from `html[data-design="..."]` handling.

### Persistence and URL precedence

For non-game routes, precedence is:

1. `/games` and `/games/*` resolve to `classic`
2. A valid `?design=<id>` URL parameter
3. the `design-preference` local-storage value
4. `DEFAULT_DESIGN`

Selecting a design updates the `data-design` attribute, local storage, and the `design` URL parameter. Invalid URL values are ignored. The head initializer in `src/app/layout.tsx` mirrors this resolution during pre-hydration to avoid a flash of the wrong design; `DesignProvider` keeps the attribute and preferences synchronized after navigation.

### Game route exclusion

`isGameRoute()` currently excludes `/games` and every `/games/*` route. Those routes always receive `classic`, the design toggle is hidden, and setting a design through context is ignored there. Route opt-outs must update the centralized `isGameRoute()` check and the matching pre-hydration game-route check in `src/app/layout.tsx` together.

### Adding a future design

1. Add the ID to `DESIGN_IDS`, `DesignId`, `DESIGN_REGISTRY`, and `isDesignId()` in `src/lib/designSystem.ts`.
2. Add `src/styles/designs/<design-id>.css` with `html[data-design="<design-id>"]` rules for both `:not(.dark)`/light and `.dark`, including the semantic variables and required `design-*` classes.
3. Import the new CSS file from `src/app/globals.css`; preserve it after Tailwind and the existing design imports.
4. Update shared components only as needed to satisfy the semantic contract; do not add design-specific markup branches. Extend the semantic contract deliberately if a component truly needs a new design capability.
5. If the design must not apply to a route, add that route to `isGameRoute()` and update the matching inline initializer in `src/app/layout.tsx`.

### Light/dark independence and fallbacks

The design and light/dark theme are independent axes: the design provider changes `html[data-design]`, while `next-themes` changes `html.dark`. Every design should define a complete light and dark variant without leaking the current theme into design-specific component code.

The global reduced-motion rule disables looping animations and restores normal scroll behavior. The Liquid Glass design additionally removes specular pseudo-elements and transitions under `prefers-reduced-motion: reduce`. When `prefers-reduced-transparency: reduce` is set, it replaces translucent glass tokens with opaque light/dark fallbacks and disables `backdrop-filter`. If `backdrop-filter` is unsupported, the design's base opaque/tinted values remain the fallback. Future designs should provide equivalent reduced-motion and reduced-transparency fallbacks for their own effects.
