---
name: nextjs-best-practices
description: 'Enforce Next.js code best practices, check formatting, structure, and maintainability. Use when: reviewing Next.js code, refactoring components, checking TypeScript types, validating App Router patterns, improving code readability, ensuring performance optimization, auditing React components, enforcing accessibility standards, checking file organization'
argument-hint: 'Path to file/directory to review (optional - defaults to current file or workspace)'
---

# Next.js Best Practices Enforcer

Enforce readability, maintainability, and modern patterns. Prefer simple and clear code over clever or complex solutions.

## Core Philosophy

- **Readability > Cleverness** — code should be easy for any teammate to understand
- **Maintainability > Premature Optimization** — optimize only when justified
- **Standards > Custom Solutions** — follow established conventions
- **Progressive Enhancement** — start simple, add complexity only when needed

## Review Checklist

### TypeScript & Type Safety
- All props have explicit interfaces/types; no `any` (use `unknown` or specific types)
- Event handlers properly typed; avoid unnecessary type assertions

### Component Architecture
- Use `"use client"` only when required (interactivity, browser APIs)
- Prefer server components for data fetching; minimize client boundaries
- One component per file; PascalCase filenames

### Performance
- Use `next/image` with explicit dimensions
- Dynamic imports for large client-only components
- Add Suspense boundaries and loading states where needed
- Use memoization (`useMemo`, `useCallback`, `React.memo`) only where measurably beneficial

### File Modularity (Critical)
Avoid monolithic files. Extract when:
- A subcomponent is reused in 2+ places → move to `components/common/`
- A subcomponent exceeds ~50 lines → extract to its own file
- A subcomponent has its own state/hooks → extract for independent testability
- A utility function is pure and reusable → move to `lib/utils/`
- A custom hook is used across components → move to `hooks/` with `use` prefix

**File size targets:** components < 200 lines, utilities < 300 lines, hooks < 100 lines

### Recommended Directory Structure
```
src/
├── app/              # App Router pages and layouts
├── components/
│   ├── common/       # Shared reusable components
│   ├── sections/     # Page-level sections
│   └── ui/           # Base UI primitives
├── hooks/            # Custom React hooks (use* prefix)
├── lib/              # Utilities, constants, API helpers
└── types/            # Shared TypeScript definitions
```

### Code Organization
- Import order: React → Next.js → external libs → internal modules → types
- Constants in `lib/constants.ts`; types in `types/` or co-located
- No utility functions or custom hooks defined inside component files
- No magic numbers or inline string literals — extract to named constants

### Naming Conventions
- Components & types: `PascalCase`
- Functions, variables, hooks: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Booleans: `is`, `has`, or `should` prefix
- Event handlers: `handle` prefix

### JSX Formatting
- Max ~100 characters per line; props on separate lines when more than 2
- Group props: data → handlers → styling
- Self-closing tags when no children; consistent double quotes

### Comments
- JSDoc only for exported functions
- Inline comments only for non-obvious logic
- No commented-out code; use git history instead

### Accessibility (WCAG 2.1 AA)
- Semantic HTML (`<nav>`, `<main>`, `<section>`, `<article>`)
- Proper heading hierarchy; descriptive alt text; ARIA labels for icon buttons
- Keyboard navigable; visible focus indicators; sufficient color contrast (4.5:1)

## Refactoring Strategy

1. Preserve existing behavior — only change structure
2. Make one improvement at a time
3. Extract before optimizing
4. Verify build and functionality after each change

## Output Format

After review, provide:
1. **Summary** — overall health (Excellent / Good / Needs Improvement / Poor)
2. **Critical Issues** — must-fix with file and line references
3. **Improvements** — should-fix, ordered by impact
4. **Refactoring Plan** — step-by-step if major changes are needed

## Post-Review Actions

1. Apply fixes with `multi_replace_string_in_file` for efficiency
2. Run `npm run lint` or `next lint`
3. Verify with `npm run build`
4. Manually test affected functionality
