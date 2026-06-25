---
name: nextjs-best-practices
description: 'Enforce Next.js code best practices, check formatting, structure, and maintainability. Use when: reviewing Next.js code, refactoring components, checking TypeScript types, validating App Router patterns, improving code readability, ensuring performance optimization, auditing React components, enforcing accessibility standards, checking file organization'
argument-hint: 'Path to file/directory to review (optional - defaults to current file or workspace)'
---

# Next.js Best Practices Enforcer

Comprehensive skill for enforcing Next.js best practices with focus on readability, maintainability, and modern patterns over complexity.

## When to Use

- Reviewing or refactoring Next.js components
- Checking code structure and organization
- Validating TypeScript types and interfaces
- Ensuring proper client/server component usage
- Optimizing performance and bundle size
- Auditing accessibility compliance
- Enforcing consistent code style
- Before committing major changes

## Core Philosophy

**Readability > Cleverness**: Simple, clear code that any team member can understand.  
**Maintainability > Performance**: Optimize only when needed, keep code easy to modify.  
**Standards > Custom**: Use established patterns and conventions.  
**Progressive Enhancement**: Start simple, add complexity only when justified.

## Review Process

### 1. **Initial Assessment**

First, determine the scope:
- Single file review (current editor file)
- Directory scan (specific folder path)
- Full workspace audit (all src files)

Identify file types:
- Client Components (`"use client"`)
- Server Components (default)
- Route handlers (app/api)
- Layouts and templates
- Configuration files

### 2. **Critical Checks** (Must Fix)

Run these checks in order, fixing issues before proceeding:

#### A. TypeScript & Type Safety
- [ ] All props have explicit TypeScript interfaces/types
- [ ] No `any` types (use `unknown` or proper types)
- [ ] Event handlers properly typed
- [ ] No type assertions unless absolutely necessary
- [ ] Proper generic type usage

#### B. Component Architecture
- [ ] Proper `"use client"` directive placement (only when needed)
- [ ] Server components for data fetching (when possible)
- [ ] Client components only for interactivity (useState, useEffect, event handlers)
- [ ] No unnecessary client boundaries
- [ ] Proper component file naming (PascalCase)

#### C. Performance & Optimization
- [ ] Images use `next/image` with proper sizing
- [ ] Dynamic imports for large client components
- [ ] No blocking operations in server components
- [ ] Proper loading states and Suspense boundaries
- [ ] Memoization only where needed (useMemo, useCallback, React.memo)

#### D. Code Organization
- [ ] One component per file (exceptions: small related components)
- [ ] Proper import ordering (React → Next → External → Internal → Types)
- [ ] Constants extracted to `/lib/constants.ts` or local const
- [ ] Types in `/types/` or co-located with components
- [ ] Utility functions in `/lib/` or `/utils/`

### 3. **Best Practices** (Should Fix)

#### A. React Patterns
```typescript
// ✅ GOOD: Clear, readable hooks
const [isOpen, setIsOpen] = useState(false);
const [count, setCount] = useState(0);

useEffect(() => {
  // Clear purpose
  document.title = `Count: ${count}`;
}, [count]); // Proper dependencies

// ❌ BAD: Complex nested logic
const [state, setState] = useState({ data: [], loading: false, error: null });
useEffect(() => {
  if (state.loading && !state.error) {
    // Nested complexity
  }
}, [state]);
```

#### B. Component Structure (Consistent Order)
1. Type definitions
2. Component function
3. Hooks (useState, useEffect, custom hooks)
4. Computed values and handlers
5. Return JSX
6. Export statement

```typescript
// ✅ GOOD: Clear structure
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export default function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleClick = async () => {
    setIsLoading(true);
    await onClick();
    setIsLoading(false);
  };
  
  return (
    <button 
      onClick={handleClick}
      disabled={isLoading}
      className={`btn-${variant}`}
    >
      {isLoading ? 'Loading...' : label}
    </button>
  );
}
```

#### C. File Naming & Organization
```
✅ GOOD:
src/
  components/
    sections/
      Hero.tsx          (PascalCase for components)
      About.tsx
    common/
      Button.tsx
      Card.tsx
  lib/
    utils.ts          (camelCase for utilities)
    constants.ts
  types/
    global.d.ts       (TypeScript declarations)

❌ BAD:
src/
  components/
    hero-section.tsx   (kebab-case for components)
    aboutUs.jsx        (wrong extension)
    BUTTON.tsx         (all caps)
```

### 4. **Style & Readability**

#### A. JSX/TSX Formatting
- [ ] Max 100 characters per line
- [ ] Props on new lines if more than 2 or line too long
- [ ] Logical grouping of props (data → handlers → styling)
- [ ] Self-closing tags when no children
- [ ] Consistent quotation (prefer double quotes)

```typescript
// ✅ GOOD: Readable formatting
<Button
  label="Submit"
  onClick={handleSubmit}
  variant="primary"
  disabled={isLoading}
  className="mt-4"
/>

// ❌ BAD: Hard to read
<Button label="Submit" onClick={handleSubmit} variant="primary" disabled={isLoading} className="mt-4" />
```

#### B. Naming Conventions
- Components: `PascalCase` (Hero.tsx, UserProfile.tsx)
- Functions/Variables: `camelCase` (handleClick, isLoading)
- Constants: `UPPER_SNAKE_CASE` (API_URL, MAX_RETRIES)
- Types/Interfaces: `PascalCase` (UserProps, ApiResponse)
- Boolean variables: `is`, `has`, `should` prefix (isLoading, hasError)
- Event handlers: `handle` prefix (handleClick, handleSubmit)

#### C. Comments & Documentation
- JSDoc for exported functions
- Inline comments for complex logic only
- No commented-out code (use git history)
- TODO comments with ticket/issue references

### 5. **Accessibility (WCAG 2.1 AA)**

- [ ] Semantic HTML (`<nav>`, `<main>`, `<section>`, `<article>`)
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] Alt text for images (descriptive, not decorative)
- [ ] ARIA labels for icon buttons
- [ ] Keyboard navigation support
- [ ] Sufficient color contrast (4.5:1 for text)
- [ ] Focus indicators visible
- [ ] Form labels properly associated

### 6. **Refactoring Strategy**

When refactoring code that doesn't meet standards:

1. **Preserve Functionality**: Don't change behavior, only structure
2. **Small Commits**: One improvement at a time
3. **Test After Each Change**: Ensure nothing breaks
4. **Extract Before Optimize**: Move code to proper locations first
5. **Document Changes**: Note what was improved and why

#### Common Refactoring Patterns

**Extract Complex JSX to Components:**
```typescript
// Before: Large component with nested JSX
export default function Dashboard() {
  return (
    <div>
      {/* 200 lines of JSX */}
    </div>
  );
}

// After: Extracted into smaller components
export default function Dashboard() {
  return (
    <div>
      <DashboardHeader />
      <DashboardStats />
      <DashboardContent />
    </div>
  );
}
```

**Extract Inline Styles to Tailwind/CSS:**
```typescript
// ❌ BAD: Inline style objects
<div style={{ 
  backgroundColor: 'blue', 
  padding: '20px',
  borderRadius: '8px' 
}}>

// ✅ GOOD: Tailwind classes
<div className="bg-blue-500 p-5 rounded-lg">
```

**Extract Constants:**
```typescript
// ❌ BAD: Magic numbers and strings
if (items.length > 10) { /* ... */ }
fetch('https://api.example.com/data');

// ✅ GOOD: Named constants
const MAX_ITEMS = 10;
const API_BASE_URL = 'https://api.example.com';

if (items.length > MAX_ITEMS) { /* ... */ }
fetch(`${API_BASE_URL}/data`);
```

### 7. **Output Format**

After review, provide:

1. **Summary**: Overall code health (Excellent/Good/Needs Improvement/Poor)
2. **Critical Issues**: Must-fix items with file:line references
3. **Improvements**: Should-fix items prioritized by impact
4. **Refactoring Plan**: Step-by-step changes if major refactoring needed
5. **Code Samples**: Before/after examples for complex changes

## Advanced Patterns

For deeper guidance on specific areas, see:
- [Component Patterns](./references/component-patterns.md)
- [Performance Optimization](./references/performance.md)
- [TypeScript Best Practices](./references/typescript.md)

## Example Invocation

```
/nextjs-best-practices
/nextjs-best-practices src/components/Hero.tsx
/nextjs-best-practices src/components/sections/
```

## Post-Review Actions

After identifying issues:
1. Implement fixes using multi_replace_string_in_file for efficiency
2. Run linter: `npm run lint` or `next lint`
3. Verify build: `npm run build`
4. Test functionality manually
5. Update tests if applicable
