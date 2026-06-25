---
name: premium-frontend-ui
description: 'Craft premium, professional, and visually refined web experiences with intentional motion design, consistent polish, and high craft across every page — from hero sections to detail and utility pages. Use when: building any page that should feel polished, implementing scroll animations, adding micro-interactions, creating custom cursors, using GSAP/Framer Motion, applying glassmorphism or depth effects, optimizing animation performance, enforcing design consistency site-wide.'
---

# Premium & Professional Frontend UI

Apply these standards uniformly across **every page** — not just heroes or landing pages. A detail page, a utility view, or a secondary section deserves the same level of craft and professionalism as the main entry point.

---

## 1. Visual Identity & Tone

Commit to a consistent visual system across the entire site:

- **Color & Contrast**: Use a purposeful, restrained palette. High contrast where it matters, subtle tonal shifts elsewhere.
- **Typography Scale**: Apply fluid type scaling via `clamp()`. Headlines are expressive; body copy is crisp and readable (`16–18px` minimum). Use variable fonts over system defaults.
- **Spacing Rhythm**: Consistent spacing units create visual harmony. Avoid arbitrary values.
- **Depth & Texture**: Subtle noise overlays (`mix-blend-mode: overlay`, opacity `0.02–0.05`), `backdrop-filter: blur()` glass effects, and thin semi-transparent borders add sophistication without clutter.

Choose a clear direction and maintain it everywhere:
- **Editorial**: High contrast, sharp grid, oversized type.
- **Refined / Minimal**: Generous whitespace, soft gradients, clean hierarchy.
- **Technical / Dark**: Dark mode, accent glows, monospaced type.

---

## 2. Page Structure & Navigation

- **Navigation**: Sticky headers that react to scroll direction (hide on scroll down, reveal on scroll up). Smooth transitions between states.
- **Page Entries**: Every page should have a composed entrance — staggered reveals, fade-ins, or subtle slide-ups. No abrupt loads.
- **Consistency**: Secondary and detail pages share the same design language — grid system, spacing, typography, and interaction patterns as primary pages.

---

## 3. Motion & Interaction

Animation serves clarity and personality — not decoration.

- **Entrances**: Stagger element reveals on page load and on scroll using `IntersectionObserver`, GSAP ScrollTrigger, or Framer Motion.
- **Scroll Depth**: Parallax on layered elements, pinned sections, or scroll-linked progress — applied where appropriate, not forced on every page.
- **Micro-interactions**: Hover states with `scale`, `translate3d`, or opacity shifts give elements tactile weight. Magnetic button effects where fitting.
- **Custom Cursor**: Optional but impactful — lerp-interpolated cursor with context-aware states (hover, drag, idle).

---

## 4. Performance & Accessibility

- **Animate only** `transform` and `opacity` — never `width`, `height`, `top`, or `margin`.
- Apply `will-change: transform` on actively animating elements; remove after animation completes.
- Gate pointer/cursor effects behind `@media (hover: hover) and (pointer: fine)`.
- Wrap non-essential animations in `@media (prefers-reduced-motion: no-preference)`.

---

## 5. Implementation Stack

**React / Next.js**: Framer Motion for transitions and spring physics; Lenis (`@studio-freight/lenis`) for smooth scroll; React Three Fiber for 3D if needed.

**Vanilla / Astro / HTML**: GSAP for timeline sequencing; vanilla Lenis via CDN; SplitType for accessible typography chunking.

---

## Core Mandate

Every page — primary or secondary — should feel intentional, polished, and professional. Premium is not reserved for hero sections. It is expressed through consistency, restraint, and craft at every level of the experience.