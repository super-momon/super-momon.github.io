---
name: super-momon Portfolio & Quiz Hub
description: Full Stack Developer portfolio and interactive CS quiz application
colors:
  primary: "#08ca5f"
  primary-hover: "#07ce60"
  neutral-bg: "#0a0a0f"
  surface: "#111827"
  border: "#1e293b"
  foreground: "#f1f5f9"
  muted: "#94a3b8"
  warning: "#facc15"
typography:
  display:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 5vw, 4rem)"
    fontWeight: 700
    lineHeight: 1.1
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
    textColor: "#000000"
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
- Tactical borders (`#1e293b`) and subtle glow effects
- Responsive, gaming-inspired layouts with interactive feedback

## Colors

The palette pairs deep dark backgrounds with crisp neon emerald highlights for a tech-focused, tactile feel.

### Primary
- **Emerald Pulse** (`#08ca5f`): Used for key call-to-actions, score indicators, active states, and focus rings.

### Neutral
- **Obsidian Deep** (`#0a0a0f`): Core background color.
- **Surface Elevation** (`#111827`): Cards, modal containers, and elevated surfaces.
- **Slate Border** (`#1e293b`): Crisp structural divider and card border line.
- **Foreground Text** (`#f1f5f9`): Primary high-contrast reading text.
- **Muted Slate** (`#94a3b8`): Secondary text, subtitles, and metadata labels.

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

## Layout

12-column fluid grid system on desktop, collapsing smoothly to single-column flex/grid containers on mobile. Spatial rhythm relies on an 8px base unit with generous breathing room (gap-4, gap-6, gap-8).

## Elevation & Depth

Surfaces are dark, semi-transparent glassmorphic panels (`bg-surface/80 backdrop-blur-md`) separated by fine 1px borders (`border-border`). Shadows are subtle ambient glows used primarily for hover and active selection states.

## Shapes

Card radii default to `rounded-xl` (12px) to `rounded-2xl` (16px), with pill badges (`rounded-full`) for active tags and status indicators.

## Components

### Buttons
- **Shape:** Rounded 12px or full pill.
- **Primary:** Background `#08ca5f`, text black/dark slate, font weight 600. Hover: slight scale effect and elevated glow.
- **Ghost / Outline:** Background transparent, border `#1e293b`, hover border `#08ca5f`.

### Cards
- **Background:** `#111827` with optional backdrop blur.
- **Border:** 1px `#1e293b`, transitions to `#08ca5f` on active/focus.

## Do's and Don'ts

### Do:
- **Do** use `#08ca5f` consistently as the sole interactive accent color.
- **Do** maintain high contrast with `#f1f5f9` text against deep dark backgrounds.

### Don't:
- **Don't** use light mode backgrounds or low-contrast gray text on dark surfaces.
- **Don't** introduce arbitrary un-themed accent colors.
