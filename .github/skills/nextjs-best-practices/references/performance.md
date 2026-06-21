# Performance Optimization

Next.js performance best practices focused on Core Web Vitals and user experience.

## Core Web Vitals

Target metrics:
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

## Image Optimization

### Use next/image

```typescript
// ❌ BAD: Native img tag
<img 
  src="/hero.jpg" 
  alt="Hero" 
  width="800" 
  height="600" 
/>

// ✅ GOOD: Next.js Image component
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero"
  width={800}
  height={600}
  priority // For above-the-fold images
  placeholder="blur" // Optional: blur while loading
/>
```

### Image Sizing

```typescript
// ✅ GOOD: Responsive images
<Image
  src="/hero.jpg"
  alt="Hero"
  fill // Fills parent container
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="object-cover"
/>

// ✅ GOOD: Fixed dimensions for layout stability
<Image
  src="/profile.jpg"
  alt="Profile"
  width={200}
  height={200}
  className="rounded-full"
/>
```

### Priority Loading

```typescript
// ✅ GOOD: Priority for above-the-fold images
export default function Hero() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero"
      width={1920}
      height={1080}
      priority // Loads immediately, not lazy
    />
  );
}

// ✅ GOOD: Lazy loading for below-the-fold
export default function Gallery() {
  return (
    <div>
      {images.map((img) => (
        <Image
          key={img.id}
          src={img.src}
          alt={img.alt}
          width={400}
          height={300}
          loading="lazy" // Default behavior
        />
      ))}
    </div>
  );
}
```

## Code Splitting

### Dynamic Imports

```typescript
// ❌ BAD: Large component always loaded
import HeavyChart from '@/components/HeavyChart';

export default function Dashboard() {
  return <HeavyChart data={data} />;
}

// ✅ GOOD: Lazy load large components
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false, // If it doesn't need SSR
});

export default function Dashboard() {
  return <HeavyChart data={data} />;
}
```

### Conditional Loading

```typescript
// ✅ GOOD: Load only when needed
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const VideoPlayer = dynamic(() => import('@/components/VideoPlayer'));

export default function VideoSection() {
  const [showVideo, setShowVideo] = useState(false);
  
  return (
    <div>
      <button onClick={() => setShowVideo(true)}>
        Watch Video
      </button>
      
      {showVideo && <VideoPlayer src="/video.mp4" />}
    </div>
  );
}
```

### Route-Based Splitting (Automatic)

```typescript
// ✅ Next.js automatically code-splits routes
// app/dashboard/page.tsx
export default function Dashboard() {
  return <div>Dashboard</div>;
}

// app/profile/page.tsx
export default function Profile() {
  return <div>Profile</div>;
}
// Each route bundles only what it needs!
```

## React Optimization

### Memoization (Use Sparingly!)

```typescript
// ⚠️ Only memoize if proven performance issue

// ❌ BAD: Premature optimization
const MemoizedComponent = React.memo(SimpleComponent);

// ✅ GOOD: Memoize expensive computations
import { useMemo } from 'react';

function ExpensiveList({ items }: { items: Item[] }) {
  const sortedItems = useMemo(() => {
    // Expensive sort operation
    return items.sort((a, b) => 
      a.name.localeCompare(b.name)
    );
  }, [items]);
  
  return <ul>{sortedItems.map(item => ...)}</ul>;
}

// ✅ GOOD: Memoize callbacks passed to children
import { useCallback } from 'react';

function Parent() {
  const [count, setCount] = useState(0);
  
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []); // Stable reference
  
  return <ExpensiveChild onClick={handleClick} />;
}
```

### When to Use React.memo

```typescript
// ✅ GOOD: Heavy rendering + same props often
const HeavyListItem = React.memo(function ListItem({ item }: Props) {
  // Complex rendering logic
  return <div>{/* ... */}</div>;
});

// ❌ BAD: Simple component
const SimpleText = React.memo(function Text({ text }: Props) {
  return <span>{text}</span>; // Not worth memoizing
});
```

### Avoid Inline Objects/Arrays

```typescript
// ❌ BAD: New object every render
<Component style={{ margin: 10 }} />
<Component data={[1, 2, 3]} />

// ✅ GOOD: Stable references
const STYLE = { margin: 10 };
const DATA = [1, 2, 3];

<Component style={STYLE} />
<Component data={DATA} />

// ✅ GOOD: useMemo for dynamic values
const style = useMemo(() => ({ 
  margin: isLarge ? 20 : 10 
}), [isLarge]);
```

## Data Fetching

### Server Components for Data

```typescript
// ✅ GOOD: Fetch in server component (default)
export default async function Posts() {
  const posts = await fetch('https://api.example.com/posts', {
    next: { revalidate: 60 } // Revalidate every 60 seconds
  }).then(res => res.json());
  
  return <PostsList posts={posts} />;
}
```

### Parallel Data Fetching

```typescript
// ❌ BAD: Sequential (slower)
export default async function Page() {
  const user = await fetchUser();
  const posts = await fetchPosts();
  return <div>...</div>;
}

// ✅ GOOD: Parallel (faster)
export default async function Page() {
  const [user, posts] = await Promise.all([
    fetchUser(),
    fetchPosts(),
  ]);
  return <div>...</div>;
}
```

### Streaming with Suspense

```typescript
// ✅ GOOD: Progressive rendering
export default function Page() {
  return (
    <>
      {/* Render immediately */}
      <Header />
      
      {/* Stream in as ready */}
      <Suspense fallback={<UserSkeleton />}>
        <UserProfile />
      </Suspense>
      
      <Suspense fallback={<PostsSkeleton />}>
        <PostsList />
      </Suspense>
    </>
  );
}
```

### Caching Strategies

```typescript
// ✅ Static - Cache forever
fetch(url, { cache: 'force-cache' })

// ✅ Dynamic - Never cache
fetch(url, { cache: 'no-store' })

// ✅ Revalidate - Cache with time-based revalidation
fetch(url, { next: { revalidate: 3600 } }) // 1 hour

// ✅ Tag-based revalidation
fetch(url, { next: { tags: ['posts'] } })
// Later: revalidateTag('posts')
```

## Bundle Size

### Analyze Bundle

```bash
# Install
npm install @next/bundle-analyzer

# next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);

# Run
ANALYZE=true npm run build
```

### Tree Shaking

```typescript
// ✅ GOOD: Named imports (tree-shakeable)
import { Button, Card } from '@/components';

// ❌ BAD: Default import of large library
import _ from 'lodash'; // Entire library!

// ✅ GOOD: Specific imports
import debounce from 'lodash/debounce';
```

### External Dependencies

```typescript
// Monitor package sizes before installing
// Use https://bundlephobia.com

// ✅ GOOD: Lightweight alternatives
- date-fns (instead of moment.js)
- zustand (instead of redux)
- clsx (instead of classnames)

// ❌ BAD: Importing entire icon libraries
import { FaHome, FaUser } from 'react-icons/fa'; // Imports all icons!

// ✅ GOOD: Font Awesome tree-shakeable
import { faHome } from '@fortawesome/free-solid-svg-icons';
```

## Font Optimization

### next/font

```typescript
// ✅ GOOD: Optimized font loading
import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Prevents invisible text
  variable: '--font-inter',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
});

export default function RootLayout({ children }) {
  return (
    <html className={`${inter.variable} ${robotoMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}

// CSS
.text {
  font-family: var(--font-inter);
}
```

### Local Fonts

```typescript
import localFont from 'next/font/local';

const customFont = localFont({
  src: './fonts/CustomFont.woff2',
  display: 'swap',
  variable: '--font-custom',
});
```

## CSS Optimization

### Tailwind JIT

```typescript
// ✅ GOOD: Use Tailwind's purge
// tailwind.config.ts
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  // Only includes used classes
};
```

### CSS Modules

```typescript
// ✅ GOOD: CSS Modules (scoped automatically)
import styles from './Button.module.css';

export default function Button() {
  return <button className={styles.button}>Click</button>;
}
```

### Avoid Inline Styles

```typescript
// ❌ BAD: Inline styles (harder to optimize)
<div style={{ 
  backgroundColor: 'blue', 
  padding: '20px' 
}}>

// ✅ GOOD: Tailwind classes (purged unused)
<div className="bg-blue-500 p-5">

// ✅ GOOD: CSS Modules (optimized by Next.js)
<div className={styles.container}>
```

## Runtime Performance

### Virtualization for Long Lists

```typescript
// ❌ BAD: Rendering 10,000 items
{items.map(item => <Item key={item.id} {...item} />)}

// ✅ GOOD: Virtualize with react-window
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={items.length}
  itemSize={50}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <Item {...items[index]} />
    </div>
  )}
</FixedSizeList>
```

### Debounce/Throttle User Input

```typescript
// ✅ GOOD: Debounce search input
import { useDeferredValue, useState } from 'react';

function SearchResults() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  
  const results = useSearchResults(deferredQuery);
  
  return (
    <>
      <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Results data={results} />
    </>
  );
}
```

### Web Workers for Heavy Computation

```typescript
// ✅ GOOD: Offload to worker
// worker.ts
self.onmessage = (e) => {
  const result = heavyComputation(e.data);
  self.postMessage(result);
};

// Component
useEffect(() => {
  const worker = new Worker(new URL('./worker.ts', import.meta.url));
  
  worker.postMessage(data);
  worker.onmessage = (e) => {
    setResult(e.data);
  };
  
  return () => worker.terminate();
}, [data]);
```

## Monitoring

### Web Vitals

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Custom Web Vitals Reporting

```typescript
// lib/analytics.ts
export function reportWebVitals(metric) {
  console.log(metric);
  
  // Send to analytics service
  if (window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.value),
      event_label: metric.id,
    });
  }
}

// app/layout.tsx
import { reportWebVitals } from '@/lib/analytics';

export { reportWebVitals };
```

## Performance Checklist

Before deploying:

- [ ] All images use `next/image` with proper dimensions
- [ ] Above-the-fold images have `priority` flag
- [ ] Large components use dynamic imports
- [ ] Server components used for data fetching
- [ ] Fonts optimized with `next/font`
- [ ] Bundle analyzed for large dependencies
- [ ] No unnecessary client components
- [ ] Proper caching strategies in place
- [ ] Long lists virtualized
- [ ] User input debounced/throttled
- [ ] Web Vitals tracking enabled
