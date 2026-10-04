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
