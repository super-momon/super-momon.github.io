# Component Patterns

Common Next.js component patterns prioritizing simplicity and readability.

## Server vs Client Components

### Decision Tree

```
Need interactivity? (useState, useEffect, event handlers, browser APIs)
  ├─ YES → "use client"
  └─ NO → Server Component (default)
       ├─ Can fetch data directly
       └─ Better performance
```

### Server Components (Default)

**Use for:**
- Static content
- Data fetching from APIs/databases
- SEO-critical content
- Reading cookies/headers
- Reducing JavaScript bundle size

```typescript
// ✅ Server Component (no directive needed)
export default async function UserProfile({ userId }: { userId: string }) {
  const user = await fetchUser(userId);
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.bio}</p>
    </div>
  );
}
```

### Client Components

**Use for:**
- Interactive UI (buttons, forms, modals)
- Browser APIs (localStorage, geolocation)
- React hooks (useState, useEffect, useContext)
- Event handlers
- Third-party libraries that use React hooks

```typescript
// ✅ Client Component
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

### Hybrid Pattern (Server + Client)

```typescript
// page.tsx - Server Component
import ClientButton from "@/components/ClientButton";

export default async function Page() {
  const data = await fetchData(); // Server-side fetch
  
  return (
    <main>
      <h1>{data.title}</h1>
      <ClientButton data={data} /> {/* Client interactivity */}
    </main>
  );
}

// ClientButton.tsx - Client Component
"use client";

export default function ClientButton({ data }) {
  const [liked, setLiked] = useState(false);
  
  return (
    <button onClick={() => setLiked(!liked)}>
      {liked ? '❤️' : '🤍'} {data.likes}
    </button>
  );
}
```

## Component Composition

### Small, Focused Components

```typescript
// ❌ BAD: Monolithic component
export default function ProductCard({ product }) {
  return (
    <div>
      <img src={product.image} />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <div>
        <span>${product.price}</span>
        <button>Add to Cart</button>
      </div>
      <div>
        {product.reviews.map(review => (
          <div key={review.id}>
            <span>{review.author}</span>
            <span>{review.rating}</span>
            <p>{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ✅ GOOD: Composed from smaller components
export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="product-card">
      <ProductImage src={product.image} alt={product.name} />
      <ProductInfo name={product.name} description={product.description} />
      <ProductPricing price={product.price} onAddToCart={handleAddToCart} />
      <ProductReviews reviews={product.reviews} />
    </article>
  );
}
```

### Props Drilling vs Context

**Use Props** (default) for 1-2 levels:
```typescript
<Parent>
  <Child data={data} /> {/* Props - simple and explicit */}
</Parent>
```

**Use Context** for 3+ levels or cross-cutting concerns:
```typescript
// theme, auth, user preferences
<ThemeProvider theme={theme}>
  <DeepChild /> {/* Accesses theme via useContext */}
</ThemeProvider>
```

## Layout Patterns

### Consistent Layout Structure

```typescript
// app/layout.tsx - Root Layout
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

// app/dashboard/layout.tsx - Nested Layout
export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="content">
        {children}
      </div>
    </div>
  );
}
```

### Loading & Error States

```typescript
// app/dashboard/loading.tsx
export default function Loading() {
  return <Spinner />;
}

// app/dashboard/error.tsx
'use client';

export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

## Data Fetching Patterns

### Server Component Data Fetching

```typescript
// ✅ GOOD: Async server component
export default async function Posts() {
  const posts = await fetch('https://api.example.com/posts', {
    cache: 'force-cache', // or 'no-store' for dynamic data
  }).then(res => res.json());
  
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

### Parallel Data Fetching

```typescript
// ✅ GOOD: Parallel fetching
export default async function Page() {
  const [user, posts] = await Promise.all([
    fetchUser(),
    fetchPosts(),
  ]);
  
  return (
    <>
      <UserProfile user={user} />
      <PostsList posts={posts} />
    </>
  );
}
```

### Sequential with Suspense

```typescript
// ✅ GOOD: Progressive loading
export default function Page() {
  return (
    <>
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

## Reusable Component Patterns

### Compound Components

```typescript
// ✅ GOOD: Flexible composition
export function Card({ children }: { children: React.ReactNode }) {
  return <div className="card">{children}</div>;
}

Card.Header = function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="card-header">{children}</div>;
};

Card.Body = function CardBody({ children }: { children: React.ReactNode }) {
  return <div className="card-body">{children}</div>;
};

// Usage:
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
</Card>
```

### Render Props (When Needed)

```typescript
// Use sparingly - prefer composition
interface DataFetcherProps<T> {
  url: string;
  children: (data: T, loading: boolean, error: Error | null) => React.ReactNode;
}

export function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    fetchData(url)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);
  
  return children(data, loading, error);
}
```

## Anti-Patterns to Avoid

### ❌ Prop Drilling Hell
```typescript
// BAD: Passing props through 5 levels
<A prop={x}>
  <B prop={x}>
    <C prop={x}>
      <D prop={x}>
        <E prop={x} /> // Finally used here
      </D>
    </C>
  </B>
</A>

// GOOD: Use Context or composition
<DataProvider value={x}>
  <ComponentTree />
</DataProvider>
```

### ❌ Giant Components
```typescript
// BAD: 500+ lines in one component
export default function Dashboard() {
  // 50 state variables
  // 30 functions
  // 400 lines of JSX
}

// GOOD: Split into logical pieces
export default function Dashboard() {
  return (
    <>
      <DashboardHeader />
      <DashboardStats />
      <DashboardCharts />
      <DashboardTable />
    </>
  );
}
```

### ❌ Unnecessary Client Components
```typescript
// BAD: Client component for static content
"use client";

export default function About() {
  return <div>Static content</div>;
}

// GOOD: Server component (no directive)
export default function About() {
  return <div>Static content</div>;
}
```
