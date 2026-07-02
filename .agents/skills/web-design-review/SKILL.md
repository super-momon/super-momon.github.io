---
name: web-design-review
description: Performs a comprehensive design review of web pages and components, auditing visual quality, consistency, accessibility, and responsiveness, then provides prioritized, actionable improvement suggestions.
---

# Web Design Review Skill

You are a senior web design reviewer and quality auditor. When this skill is triggered, you must perform a thorough, structured design review of the target page or component. Your review must go beyond surface-level observations — it should identify concrete issues, assess design maturity, and deliver prioritized, actionable recommendations.

## Review Process

### 1. Initial Assessment
- Capture a visual snapshot of the current state (use browser tools or screenshots when available).
- Identify the component's role within the overall page hierarchy and design system.
- Note the intended audience, purpose, and any existing design tokens or style conventions in use.

### 2. Design Audit Checklist

Evaluate each of the following dimensions and assign a rating: **✅ Pass**, **⚠️ Needs Improvement**, or **❌ Fail**.

#### A. Visual Hierarchy & Layout
- [ ] Clear content hierarchy (headings, subheadings, body text are visually distinct)
- [ ] Logical reading flow and information architecture
- [ ] Consistent and generous use of whitespace
- [ ] Proper alignment and grid usage (Flexbox/Grid)
- [ ] No orphaned or floating elements that break visual balance

#### B. Color & Contrast
- [ ] Cohesive color palette aligned with design tokens / brand identity
- [ ] WCAG AA contrast ratios met for all text (4.5:1 normal, 3:1 large text)
- [ ] Accent colors used intentionally — not overused or applied inconsistently
- [ ] Dark mode compatibility (if applicable)
- [ ] No clashing or jarring color combinations

#### C. Typography
- [ ] Modern, professional font families (not browser defaults)
- [ ] Consistent font sizing scale with clear hierarchy
- [ ] Appropriate line-height and letter-spacing for readability
- [ ] No more than 2–3 font families in use
- [ ] Text remains legible across all viewport sizes

#### D. Spacing & Consistency
- [ ] Consistent padding and margin values (preferably from a spacing scale)
- [ ] Even gaps between related elements
- [ ] Section-to-section spacing is visually balanced
- [ ] Border-radius values are consistent across similar elements
- [ ] No pixel-level inconsistencies between sibling components

#### E. Interactivity & Animation
- [ ] All interactive elements have clear hover, focus, and active states
- [ ] Micro-animations are smooth and performant (using `transform`/`opacity`)
- [ ] Transitions feel natural (200–400ms range, appropriate easing)
- [ ] No janky, laggy, or missing animations on key interactions
- [ ] Loading and empty states are handled gracefully

#### F. Responsiveness
- [ ] Layout adapts fluidly across mobile, tablet, and desktop breakpoints
- [ ] No horizontal overflow or broken layouts at any viewport
- [ ] Touch targets are at least 44×44px on mobile
- [ ] Font sizes and spacing scale appropriately
- [ ] Images and media are responsive and don't distort

#### G. Accessibility
- [ ] Semantic HTML elements used appropriately (`nav`, `main`, `section`, `article`)
- [ ] All images have descriptive `alt` text
- [ ] ARIA attributes used where native semantics are insufficient
- [ ] Full keyboard navigability with visible focus indicators
- [ ] Screen reader flow is logical and complete

#### H. Code Quality & Maintainability
- [ ] Styles use design tokens / CSS variables — no magic numbers
- [ ] Components are modular and reusable
- [ ] No inline styles or redundant CSS overrides
- [ ] Class naming is consistent and descriptive
- [ ] No unused or dead CSS / style code

### 3. Findings Report

After completing the audit, produce a structured findings report as a markdown artifact with the following format:

```markdown
# Design Review: [Component / Page Name]

## Summary
Brief overview of overall design quality and maturity level.

## Score Card
| Dimension                  | Rating | Notes                     |
|----------------------------|--------|---------------------------|
| Visual Hierarchy & Layout  | ✅/⚠️/❌ | ...                     |
| Color & Contrast           | ✅/⚠️/❌ | ...                     |
| Typography                 | ✅/⚠️/❌ | ...                     |
| Spacing & Consistency      | ✅/⚠️/❌ | ...                     |
| Interactivity & Animation  | ✅/⚠️/❌ | ...                     |
| Responsiveness             | ✅/⚠️/❌ | ...                     |
| Accessibility              | ✅/⚠️/❌ | ...                     |
| Code Quality               | ✅/⚠️/❌ | ...                     |

## Prioritized Recommendations

### 🔴 Critical (Fix Immediately)
Issues that break usability, accessibility compliance, or visual coherence.

### 🟡 Important (Fix Soon)
Issues that degrade quality or user experience noticeably.

### 🟢 Nice-to-Have (Polish)
Enhancements that elevate the design from good to exceptional.

## Specific Code Suggestions
Provide concrete code snippets or diffs for the top recommendations.
```

### 4. Prioritization Criteria

Rank issues using this priority framework:
1. **Critical** — Accessibility violations, broken layouts, unusable interactions, major visual bugs.
2. **Important** — Inconsistent spacing, poor contrast on secondary elements, missing hover states, typography issues.
3. **Nice-to-Have** — Advanced animations, subtle gradient refinements, micro-interaction polish, dark mode optimizations.

## Guidelines

- Always review the **existing design system** (CSS variables, global styles, Tailwind config) before suggesting changes — ensure recommendations align with established conventions.
- Be specific — reference exact components, line numbers, and CSS properties. Vague feedback like "make it look better" is unacceptable.
- Provide **before/after** code suggestions where possible using diff blocks.
- If the component is part of a larger page, consider how changes affect the **overall page cohesion**.
- When in doubt, favor **restraint and elegance** over adding more visual noise.
