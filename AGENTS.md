# AGENTS.md

## Start Here

Read the documents that govern the area you are changing before implementation:

- `README.md` - setup, architecture, feature summary, and project conventions.
- `PRODUCT.md` - product audience, purpose, capabilities, constraints, and principles.
- `DESIGN.md` - canonical visual, theme, spacing, component, accessibility, and responsive design contract.
- `UI_DESIGN_LAWS.md` - shared principles for hierarchy, perception, cognitive load, and interaction decisions.
- `UI_DESIGN_CRITERIA.md` - concrete interface quality criteria for clarity, hierarchy, typography, states, and motion.
- `src/app/games/colony-defense/COLONY_DEFENSE_GDD.md` - requirements for Colony Defense behavior, balancing, and UI.
- Relevant feature code and existing tests or components - use nearby patterns before adding abstractions.

Do not contradict these documents without updating the directly relevant source document.

## Project Summary

This is a Next.js 16 App Router portfolio and interactive games site built with React 19, TypeScript, Tailwind CSS 4, Motion, Supabase, and Font Awesome. It is configured for static export to `out/` and GitHub Pages.

Primary experiences:

- A portfolio at `/`
- A timed technical quiz at `/games/quiz`
- Chain Reaction at `/games/chain-reaction`
- The Colony Defense prototype at `/games/colony-defense`

## Repository Map

- `src/app/` - App Router pages, route-level components, and route-specific styles.
- `src/components/` - shared layout, portfolio sections, and reusable UI.
- `src/components/sections/` - portfolio page sections.
- `src/components/common/` - cross-route UI primitives.
- `src/lib/` - Supabase, leaderboard, analytics, constants, icons, and design-system logic.
- `src/hooks/` - reusable React hooks.
- `src/types/` - TypeScript models.
- `src/data/quiz/` - quiz question data.
- `src/styles/designs/` - design-specific CSS implementations.
- `public/` - files served as-is, including PDFs and images.
- `out/` - generated static build output; do not edit or commit generated changes.

Use the `@/*` TypeScript alias for imports from `src/` (for example, `@/components/Navbar`).

## Setup and Commands

Use the checked-in npm lockfile:

```bash
npm ci
npm run dev
npm run lint
npm run build
```

Development runs through `next dev`. The build is a static export; `npm run build` writes to `out/`.

Quiz leaderboard features require:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Keep environment variables in `.env.local`. Never expose service-role credentials or hardcode secrets.

There is no dedicated test script in `package.json`. Validate code with the smallest relevant lint/type/build check and, for UI changes, exercise the affected route in a browser at desktop and mobile sizes.

## Implementation Workflow

1. Learn the route, component, data flow, and governing Markdown document.
2. Plan the smallest complete change and identify affected UI, accessibility, and data surfaces.
3. Implement using existing components, hooks, types, and design contracts.
4. Run lint or build checks; test the behavior at the route level.
5. Update README, PRODUCT, DESIGN, or the Colony Defense GDD only when behavior or documented architecture changes.
6. Review for unintended changes, especially in the existing dirty worktree.

## Next.js and React Conventions

- Use App Router pages under `src/app/`.
- Mark components with `"use client"` only when they use browser APIs or React hooks/state.
- Preserve server/component boundaries and Next.js metadata conventions.
- Keep static export compatibility. Do not introduce server-only routes or server-dependent APIs.
- Optimize images for the existing static-hosting setup; `next.config.ts` already sets `images.unoptimized`.
- Use TypeScript strict types. Avoid `any` and unnecessary casts.
- Preserve existing route, import, formatting, and component patterns.
- Run effects and browser-only access safely; account for hydration and pre-hydration theme/design initialization.

## Design System Contract

The design and theme systems are independent:

- Theme uses `html.dark` through `next-themes`.
- Design uses `html[data-design="<id>"]` through `DesignProvider`.
- Supported designs are registered in `src/lib/designSystem.ts`.
- Design-specific CSS lives in `src/styles/designs/`.
- Shared CSS imports are owned by `src/app/globals.css`.
- Game routes always resolve to `Classic`; `/games` and `/games/*` must not expose or persist another design.

For non-game routes, design precedence is URL `design`, then `design-preference` local storage, then `DEFAULT_DESIGN`.

Keep Tailwind for layout, spacing, typography, responsive utilities, and state composition. Keep design meaning in design CSS: palette, surfaces, shadows, borders, transparency, and design-only fallback behavior.

Use semantic Tailwind colors and shared classes such as `design-surface`, `design-elevated-control`, `design-navbar`, `design-dialog`, and `design-ambient`. Prefer semantic variables over hardcoded colors.

When adding a design:

1. Add it to `DESIGN_IDS`, `DesignId`, `DESIGN_REGISTRY`, and `isDesignId()`.
2. Create `src/styles/designs/<design-id>.css`.
3. Import it after Tailwind and the existing design imports in `src/app/globals.css`.
4. Define complete light and dark values plus the shared `design-*` contracts.
5. Update both `isGameRoute()` and the inline initializer in `src/app/layout.tsx` if route opt-outs change.

For UI changes, follow `DESIGN.md` rather than adding arbitrary colors or competing accents. Emerald is the primary action/highlight accent. Preserve contrast, focus states, touch target size, responsive behavior, reduced motion, and reduced transparency fallbacks.

## Product and Copy

- Treat `PRODUCT.md` and `DESIGN.md` as the source of truth for product positioning and brand intent.
- Keep portfolio copy professional and consistent with the owner's current experience.
- Keep game language concise and stateful: current objective, threat, target, cost, and outcome must be understandable in context.
- Avoid mock success states or fake persistence. If data or environment configuration is unavailable, surface a real error or explicitly disable the dependent feature.

## Supabase and Data

Supabase access lives in `src/lib/supabase.ts` and `src/lib/leaderboard.ts`.

- Preserve strict leaderboard payload types.
- Surface database failures; do not silently return success-shaped fallback data.
- Abort in-flight leaderboard requests when the UI lifecycle requires it.
- Do not add secret keys to client code.
- Use parameterized Supabase queries and existing data types.

## Quiz and Game Work

- Keep quiz definitions and scoring types aligned across `src/data/quiz`, `src/hooks/useQuizGame.ts`, `src/types/`, and quiz components.
- Preserve timer, score, lives/survival, and leaderboard behavior unless the requested change explicitly alters it.
- For Colony Defense, treat `COLONY_DEFENSE_GDD.md` as the gameplay source of truth. Keep the HUD readable and the target, nutrient, cache, wall, threat, and repair states visible and reversible.
- Support keyboard and touch controls where applicable.
- Use text and labels in addition to color for state and status.
- Respect reduced-motion preferences and avoid flashing or rapidly pulsing UI.

## Accessibility

- Use semantic HTML and clear labels.
- Ensure visible keyboard focus and logical tab order.
- Add accessible names to icon-only controls.
- Preserve text contrast in both themes and every design.
- Use `aria-*` attributes to describe dynamic state, dialogs, timers, and controls rather than as decoration.
- Check the page with keyboard navigation and one browser at mobile width.

## Change Safety

- Make surgical changes and preserve unrelated work in the dirty worktree.
- Do not edit generated `.next/` or `out/` files.
- Do not commit `.env*`, credentials, build output, or local inspection artifacts.
- Do not use destructive Git commands or reset user changes.
- For UI changes, avoid replacing established sections or design contracts when a local component change will suffice.
