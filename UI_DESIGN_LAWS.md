# UI Design Laws

## Purpose

Use these principles as guidance when designing, reviewing, or implementing interfaces in this project. They describe user perception and behavior; they are not rigid rules or substitutes for usability testing. Prefer the simplest implementation that preserves clarity, accessibility, and the project's `Cyber-Engineered Arcade` identity.

Refer to `DESIGN.md` for project-specific visual tokens and component contracts, and to `PRODUCT.md` for audience and product principles.

## How to Use This Guide

- Start with the user's goal and choose the few laws that directly support it.
- Resolve conflicts with evidence, accessibility, and existing design conventions rather than with intuition alone.
- Preserve the semantic design system shared by Tailwind utilities and design-specific CSS.
- Use text, labels, focus indicators, and semantic structure in addition to visual grouping or motion.
- Test decisions at desktop and mobile sizes, in light and dark themes, and with keyboard navigation.

---

## Aesthetic-Usability Effect

Users perceive attractive, polished interfaces as easier to use.

**Follow by**

- Maintaining consistent spacing, typography, contrast, surfaces, and interaction states.
- Removing avoidable visual noise before adding decoration.
- Using motion and visual effects to clarify state, not to compensate for unclear structure.

**Avoid**

- Assuming an attractive interface is usable without usability testing.
- Allowing glass, glow, or animation to reduce readability or control discoverability.

## Law of Proximity

Related elements appear related when they are placed close together.

**Follow by**

- Grouping labels with their controls and related controls with their result.
- Using spacing to separate distinct tasks or content sections.
- Keeping high-value actions close to the information they act upon.

**Project application:** In quiz cards, mode selectors, leaderboard summaries, and game HUDs, keep status, controls, and feedback visually connected.

## Von Restorff Effect

An item that differs distinctly from its neighbors is more likely to be noticed.

**Follow by**

- Giving one primary action or critical status a deliberate visual distinction.
- Using the emerald accent for the primary action or most important state.
- Limiting strong emphasis so every important item does not compete for attention.

**Avoid**

- Using multiple high-emphasis buttons or competing colors in the same view.

## Zeigarnik Effect

People remember interrupted or incomplete tasks more strongly than completed tasks.

**Follow by**

- Making progress toward a task visible.
- Saving or restoring meaningful state when interruption is unavoidable.
- Closing loops with clear success, completion, or cancellation states.

**Project application:** Timers, quiz progress, game objectives, upgrade choices, and form submissions should communicate what remains and what is complete.

## Tesler's Law

Every application has irreducible complexity; it should be assigned to the layer that makes the experience simplest for the user.

**Follow by**

- Hiding implementation complexity behind clear defaults and workflows.
- Keeping advanced controls available without making them the first-run default.
- Doing necessary calculations and validation without exposing raw configuration to users.

**Avoid**

- Shifting ambiguity or technical complexity onto the user unless that information is genuinely required.

## Law of Pragnanz

People interpret complex forms as the simplest coherent shapes and structures.

**Follow by**

- Favoring clear hierarchy, alignment, grouping, and predictable patterns.
- Removing redundant separators, panels, labels, and decoration.
- Organizing a screen so its structure can be understood at a glance.

**Project application:** Prefer a calm reading hierarchy over densely stacked cards or decorative geometry.

## Serial Position Effect

People tend to remember the first and last items in a sequence more readily than middle items.

**Follow by**

- Placing the most important navigation or actions at the beginning or end of a sequence.
- Using clear section framing when middle items contain essential content.
- Auditing the order of menus, steps, and result summaries.

**Avoid**

- Assuming sequence order alone makes a middle item important.

## Progressive Disclosure

Show only the information or controls needed for the current step.

**Follow by**

- Starting with the essential task and exposing detail on demand.
- Using clear labels, dialogs, drawers, tabs, or accordions for secondary information.
- Preserving the user's place when detail is revealed or dismissed.

**Project application:** Keep detailed game statistics and balance information secondary to the live objective and essential controls.

## Law of Common Region

Elements enclosed within a visible boundary are perceived as belonging together.

**Follow by**

- Using surfaces, borders, cards, or background regions only when they communicate a real relationship.
- Keeping region boundaries consistent with spacing and hierarchy.
- Avoiding nested containers that do not add organizational meaning.

**Project application:** Use `design-surface`, `design-elevated-control`, `design-dialog`, and semantic borders for intentional grouping.

## Goal-Gradient Effect

Motivation increases as people perceive themselves approaching a goal.

**Follow by**

- Showing visible progress for finite tasks.
- Making remaining steps or thresholds clear and realistic.
- Providing useful feedback after milestones.

**Avoid**

- Inventing artificial progress or overstating completion.

## Law of Similarity

Elements that share visual characteristics are perceived as related.

**Follow by**

- Reusing consistent visual patterns for equivalent actions and statuses.
- Applying one semantic color and icon pattern to one meaning.
- Reserving different styles for genuinely different states or priorities.

**Project application:** All primary actions should feel related through shape and the single-accent design contract. Difficulty and result statuses should use the documented semantic status tokens.

## Recognition Over Recall

Interfaces should help users recognize options instead of forcing them to remember information.

**Follow by**

- Keeping controls, labels, icons, and current status visible.
- Providing in-context guidance and examples.
- Using recent choices or explicit summaries instead of relying on memory.

**Avoid**

- Relying on unexplained icons or hidden workflows for essential tasks.
- Requiring users to remember data shown on a previous step.

## Pareto Principle

A small portion of features or actions often accounts for most user value.

**Follow by**

- Prioritizing the few workflows and controls used most often.
- Keeping secondary and rare features discoverable without competing with primary tasks.
- Measuring or observing real usage before broadening scope.

**Project application:** Portfolio navigation and the primary game actions deserve stronger prominence than low-level detail panels or optional settings.

## Occam's Razor

Prefer the simplest explanation or solution that satisfies the real requirement.

**Follow by**

- Removing steps, controls, copy, and states that do not serve the task.
- Choosing direct behavior over speculative flexibility.
- Using established components and patterns before introducing new ones.

**Avoid**

- Removing necessary safeguards or error states merely to simplify the interface.

## Parkinson's Law

Work expands to fill the time and space available.

**Follow by**

- Setting appropriate time limits, task boundaries, and content density.
- Designing fixed, clear scopes for dialogs and workflows.
- Avoiding oversized containers that encourage unnecessary content or decisions.

**Project application:** Timers and game modes should have explicit boundaries. Keep dialogs and setup panels focused on the decision at hand.

## Uniform Connectedness

Elements are perceived as related when they share a consistent visual connection.

**Follow by**

- Using consistent lines, borders, connectors, transitions, or grouping cues.
- Reinforcing relationships through hierarchy and spacing, not color alone.
- Applying one interaction pattern to one relationship across the interface.

**Avoid**

- Adding a connector or shared container that implies a relationship that does not exist.

## Paradox of the Active User

Users prefer to act immediately and often postpone learning long instructions.

**Follow by**

- Making the default workflow usable before detailed onboarding.
- Pairing short contextual guidance with examples or in-place hints.
- Keeping help available rather than blocking progress behind a mandatory tutorial.

**Project application:** Introduce game and quiz concepts through concise instructions, visible first actions, and optional detailed help.

## Cognitive Load

Working memory is limited; interfaces should reduce unnecessary mental effort.

**Follow by**

- Presenting one primary goal or decision at a time.
- Chunking information into short groups and predictable layouts.
- Reusing familiar patterns and explaining unfamiliar terms in context.
- Minimizing simultaneous alerts, animations, and competing statuses.

**Avoid**

- Requiring users to correlate many disconnected values without labels or visual relationships.

## Default Effect

People are likely to keep a suggested default when it is reasonable.

**Follow by**

- Choosing safe, accessible defaults that match the most common user need.
- Clearly communicating defaults and the effect of changing them.
- Making it easy to return to a default or previous value.

**Project application:** Preserve the documented `liquid-glass` design default on eligible routes, keep game routes on `classic`, and preserve light/dark system behavior unless the user chooses otherwise.

## Peak-End Rule

People judge experiences heavily by their most intense moment and how they end.

**Follow by**

- Designing the high-value moment and completion state with care.
- Providing clear, useful final feedback and next actions.
- Handling success, failure, timeout, and interruption without abrupt or confusing transitions.

**Project application:** Quiz results, leaderboard submission, game victory/defeat screens, and form completion should summarize the outcome clearly and offer a direct next step.

---

## Implementation Checklist

Before completing a UI change, confirm:

- [ ] The primary goal and primary action are obvious.
- [ ] The interface has a clear visual hierarchy and grouped relationships.
- [ ] Only essential information appears at the start of the task.
- [ ] The most important items do not compete for emphasis.
- [ ] Controls are recognizable and labeled where text improves understanding.
- [ ] Defaults are safe, visible, and easy to change or recover.
- [ ] The task communicates progress, completion, errors, and next steps.
- [ ] Keyboard focus, screen-reader labels, touch targets, contrast, and motion remain intact.
- [ ] The layout works in light/dark themes and across desktop/mobile sizes.
- [ ] The implementation follows `DESIGN.md` and uses the reusable design contracts rather than ad hoc styling.
