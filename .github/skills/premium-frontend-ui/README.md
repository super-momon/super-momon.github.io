# Premium Frontend UI Skill

Craft immersive, high-performance web experiences with advanced motion design, animations, and architectural craftsmanship.

## What It Does

Guides you through building award-level frontend experiences with:
- 🎨 Strong visual identity (Brutalism, Organic Fluidity, Cyber/Technical, Cinematic)
- ✨ Advanced motion design (GSAP, Framer Motion, scroll-driven animations)
- 🎭 Immersive hero sections with depth and parallax
- 🖱️ High-fidelity micro-interactions and custom cursors
- 📐 Premium typography and visual texture
- ⚡ Performance-optimized animations
- 🎬 Scroll-driven narratives and pinned containers

## How to Use

### In Copilot Chat

Type `/premium-frontend-ui` in chat to invoke the skill:

```
Create a premium landing page with cinematic hero section
```

```
Add scroll-driven animations to my portfolio
```

```
Implement a custom magnetic cursor effect
```

## Core Principles

### 1. Creative Foundation
Establish strong visual identity before coding:
- **Editorial Brutalism**: High-contrast, oversized typography, raw grids
- **Organic Fluidity**: Soft gradients, glassmorphism, bouncy animations
- **Cyber/Technical**: Dark mode, neon accents, monospaced fonts
- **Cinematic Pacing**: Full-viewport, slow cross-fades, scroll storytelling

### 2. Immersive Architecture
- **Entry Sequences**: Preloader with fluid transitions
- **Hero Sections**: Full-bleed containers with depth and floating elements
- **Contextual Navigation**: Scroll-reactive headers, rich hover states

### 3. Motion Design System
- **Scroll-Driven Narratives**: GSAP ScrollTrigger, pinned containers
- **Horizontal Journeys**: Vertical scroll → horizontal movement
- **Micro-Interactions**: Magnetic buttons, custom cursors, dimensional hovers

### 4. Premium Typography
- **Extreme Scale**: Headlines up to 12vw with clamp()
- **Variable Fonts**: Premium typefaces over system defaults
- **Atmospheric Effects**: Noise overlays, frosted-glass depth

### 5. Performance First
- Animate only `transform` and `opacity`
- Use `will-change` intelligently
- Wrap animations in `@media (prefers-reduced-motion)`
- Touch device optimization with `@media (hover: hover)`

## Framework Support

### React / Next.js
- **Framer Motion**: Layout transitions, spring physics
- **Lenis**: Smooth scrolling
- **React Three Fiber**: WebGL/3D interactions

### Vanilla / Astro
- **GSAP**: Timeline sequencing, advanced animations

## Files in This Skill

```
premium-frontend-ui/
├── SKILL.md                     # Complete craftsmanship guide
├── README.md                    # This file
├── references/
│   └── design-tokens.md         # Design system tokens (if applicable)
└── scripts/
    └── validate.js              # Legacy validation (consider removing)
```

## Example Use Cases

### Creating a Premium Hero
```
Build a cinematic hero section with:
- Full viewport height
- Parallax background
- Staggered text reveal animation
- Floating depth elements
```

### Adding Scroll Animations
```
Implement scroll-driven narrative with GSAP ScrollTrigger:
- Pin the hero while content flows
- Fade and scale elements on scroll
- Horizontal gallery triggered by vertical scroll
```

### Custom Cursor
```
Create a magnetic cursor that:
- Follows mouse with smooth lerp
- Enlarges and pulls buttons on hover
- Shows custom states for links vs buttons
```

## When to Use

- ✅ Building premium landing pages or portfolios
- ✅ Creating immersive hero sections
- ✅ Implementing advanced scroll animations
- ✅ Adding micro-interactions and custom cursors
- ✅ Designing with cinematic pacing
- ✅ Optimizing animation performance
- ✅ Creating glassmorphism and depth effects

## Key Technologies

- **GSAP** - Advanced timeline animations
- **Framer Motion** - React animations & spring physics
- **Lenis** - Smooth scroll
- **React Three Fiber** - WebGL/3D
- **CSS Transforms** - Hardware-accelerated animations

---

**Need help?** Ask in chat: "Create a premium hero section with parallax" or "Add scroll-driven animations"

