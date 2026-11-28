# UI Design Criteria

## Purpose

Use this checklist when creating or reviewing user interfaces in this project. It complements `UI_DESIGN_LAWS.md` with concrete implementation criteria for clarity, hierarchy, polish, and interaction feedback.

Follow `DESIGN.md` for the project-specific palette, typography, shapes, surfaces, and responsive requirements. Follow [UI_ANIMATION_GUIDELINES.md](UI_ANIMATION_GUIDELINES.md) for motion behavior, timing, and implementation review. Follow `PRODUCT.md` for audience and product goals.

## Delete Filter Badges

Remove filter badges that duplicate a visible filter state, active control, or selected option.

- Keep the active state in the filter control itself.
- Remove badges that add no new filtering context or available action.
- Preserve a badge only when it provides a useful count, status, or way to remove a filter.

## Drop Redundant Labels

Do not repeat information when its context already makes the meaning clear.

- Prefer "Save" over "Save changes" when the surrounding dialog already says "Unsaved changes."
- Remove labels that restate the page heading, section heading, or control purpose.
- Keep labels when they improve clarity, accessibility, or data interpretation.

## Unitalicize Random Words

Italic text should communicate a deliberate meaning, such as an emphasized term or a quote.

- Use weight, size, spacing, color, or text structure instead of italicizing isolated words for decoration.
- Preserve intentional editorial italics only when they support hierarchy or language convention.
- Avoid italic body text in dense interfaces.

## Mono Only Where Needed

Use Geist Mono for data or technical content that benefits from fixed-width characters, such as timers, scores, code, or numeric diagnostics.

- Use Geist Sans for general reading and interface copy.
- Do not mix mono and sans type unnecessarily within a single label or sentence.
- Limit mono emphasis to values whose alignment or technical meaning needs it.

## Use a Design System

Build interfaces from the project's documented tokens and reusable patterns.

- Use the semantic Tailwind colors and shared `design-*` classes.
- Use components already in `src/components/` before creating new variants.
- Reuse `src/lib/designSystem.ts`, design CSS, and theme variables.
- Add a new design or token only after it has a documented purpose.

## Show Actual Product

Prefer real interface states and authentic output over abstract mockups or decorative placeholders.

- Show real portfolio projects, quiz questions, leaderboard records, game states, and product data.
- Use realistic placeholders only when a backend or asset is genuinely unavailable.
- Do not present invented metrics or success states as live product evidence.
- Keep screenshot, demo, and loading states clearly representative of actual behavior.

## Enlarge the Main Feature

Give the primary feature or artifact enough visual weight to become the focus.

- Treat the portfolio content, quiz question, game arena, or primary result as the visual anchor.
- Give supporting navigation and metadata a lower hierarchy.
- Resize based on the task and viewport, not to fill empty space.

## Group with Spacing

Use consistent spacing to communicate relationships before adding borders or containers.

- Keep closer spacing inside a group and larger spacing between groups.
- Prefer 8px-based spacing scales.
- Separate independent decisions or workflows rather than placing everything in one card.
- Remove nested containers that add boundaries without organizational meaning.

## Make Headlines Specific

Headlines should say what the interface contains or what the user can accomplish.

- Prefer "Choose a Quiz Category" over "Choose Category."
- Prefer "Colony Defense Field Report" over "Results."
- Keep headlines short enough to wrap clearly across mobile widths.
- Avoid vague promotional language as the only heading for a task.

## Emphasize the CTA

Make the primary action visually and structurally obvious.

- Use one primary CTA in a decision view.
- Use the emerald accent for the primary action; keep secondary actions quieter.
- Place the CTA near the result or information it completes.
- Use clear action language such as "Start Quiz," "Submit Score," or "Save Profile."

## Add an Accent Colour

Use one intentional accent to identify action, selection, and focus.

- The project uses emerald as the interactive accent:
  - Dark theme: `#08ca5f`
  - Light theme: `#067a3a`
- Reserve the accent for meaningful affordances and important active states.
- Do not introduce competing accents for decoration or visual novelty.
- Use documented semantic status colors for success, warning, difficulty, and error states.

## Keep Icons Consistent

Icons should share a visual family, sizing logic, and semantic role.

- Reuse the project's Font Awesome setup and existing icon conventions.
- Use outline or solid variants consistently within a control family.
- Pair essential icon-only actions with accessible labels or tooltips.
- Do not use an icon only to add visual decoration.

## Remove Embellishments

Delete decorative elements that do not support hierarchy, brand, or feedback.

- Remove gratuitous glow, gradients, glass layers, shadows, borders, badges, and motion.
- Keep the effects documented in `DESIGN.md` when they reinforce depth or the cyber-arcade identity.
- Prefer a restrained surface treatment with clear structure over accumulated visual effects.

## Inner Radius Equals Outer Radius Minus Padding

When a nested surface or control sits inside a larger rounded container, calculate the inner radius from the outer radius and the available padding.

```text
inner radius = outer radius - padding
```

- A 24px outer radius with 8px padding can use a 16px inner radius.
- Preserve consistent radius relationships across cards, dialogs, controls, and nested surfaces.
- Follow the documented 12-16px card scale and 24px dialog scale instead of introducing arbitrary values.

## Improve Text Contrast

Every reading level should remain readable in both themes and designs.

- Use semantic `foreground`, `muted`, and contrast-safe accent tokens.
- Avoid placing low-contrast text over imagery, glass, or gradients.
- Preserve documented contrast-safe accent foregrounds.
- Provide a text label or non-color indicator for state.
- Verify text, focus, and selected states with keyboard and screen magnification.

## Wrap Headlines Properly

Set intentional line breaks and preserve readable line lengths.

- Use `text-wrap: balance` for short centered or symmetric headings when supported.
- Use `text-wrap: pretty` for longer prose headings to reduce weak final lines.
- Avoid widowed words such as a one-word last line unless it is visually intentional.
- Keep the headline hierarchy stable across desktop and mobile widths.

## Align by Eye Not Pixels

Use visual alignment and optical balance rather than treating every element as a mechanical grid problem.

- Check alignment against the shape, text box, icon, and surrounding elements.
- Optically adjust icons or typography when exact boxes create an uneven appearance.
- Preserve an underlying grid and consistent spacing for the overall layout.
- Use edge alignment for control families and baseline alignment for mixed text labels.

## Use Tabular Numbers

Use tabular numerals for values that change, compare, or align.

- Apply tabular numerals with `font-variant-numeric: tabular-nums`.
- Use tabular digits for timers, scores, counters, leaderboards, prices, percentages, and tables.
- Keep moving values fixed in width where layout stability matters.
- Use mono typography only when fixed-width character alignment is itself useful, not as the default for every number.

## Add Loading States

Every asynchronous action needs an immediate, understandable loading state.

- Preserve the layout and content footprint when possible.
- Disable or clearly indicate controls that cannot be repeated safely.
- Use a concise label or progress indicator for operations that take longer than a brief transition.
- Announce loading and completion where assistive technology requires it.
- Surface errors explicitly instead of leaving a permanent skeleton or spinner.

## Animate Useful Feedback

Motion should confirm an action, explain a state change, or preserve spatial context.

- Animate success, selection, disclosure, navigation, target, and error feedback when the motion adds meaning.
- Keep transitions short and restrained.
- Use the timing, easing, origin, and interruption rules in `UI_ANIMATION_GUIDELINES.md`.
- Respect `prefers-reduced-motion` and disable nonessential motion.
- Avoid decorative looping effects that compete with quiz timers or game feedback.
- Do not use animation to delay an action or force a user to wait.

---

## Interface Review Checklist

Before completing a UI change, confirm:

- [ ] Duplicate filter badges and redundant labels have been removed.
- [ ] Italics and mono typography are used only for a clear purpose.
- [ ] Components reuse the design system and semantic tokens.
- [ ] The interface shows actual product content or clearly honest loading/error states.
- [ ] The main feature has the strongest appropriate visual weight.
- [ ] Related items are grouped with spacing and meaningful boundaries.
- [ ] Headlines describe the content or task specifically.
- [ ] One primary CTA is visually dominant.
- [ ] Emerald is the only interaction accent, with semantic colors reserved for status.
- [ ] Icons are consistent in style, size, and meaning.
- [ ] Decorative embellishments are necessary rather than habitual.
- [ ] Nested surfaces use a correct inner-radius relationship.
- [ ] Text contrast and dynamic states remain accessible.
- [ ] Headlines wrap cleanly across viewport sizes.
- [ ] Alignment looks balanced and preserves the layout grid.
- [ ] Numeric values use tabular digits where they improve stability.
- [ ] Loading, success, error, and completion states are clear.
- [ ] Motion communicates useful feedback, follows `UI_ANIMATION_GUIDELINES.md`, and supports reduced-motion preferences.
