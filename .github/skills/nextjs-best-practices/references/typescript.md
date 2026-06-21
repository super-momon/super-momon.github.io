# TypeScript Best Practices for Next.js

Guidelines for writing clean, type-safe TypeScript code.

## Core Principles

1. **Explicit over Implicit**: Always define types, don't rely on inference for public APIs
2. **Strict Mode**: Enable all strict TypeScript checks
3. **No `any`**: Use `unknown` or proper types
4. **Type Safety at Boundaries**: Props, API responses, event handlers

## Component Props

### Basic Props

```typescript
// ✅ GOOD: Explicit interface
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  className?: string;
}

export default function Button({ 
  label, 
  onClick, 
  variant = 'primary',
  disabled = false,
  className 
}: ButtonProps) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`btn-${variant} ${className}`}
    >
      {label}
    </button>
  );
}

// ❌ BAD: No types
export default function Button({ label, onClick, variant, disabled, className }) {
  return <button onClick={onClick}>{label}</button>;
}
```

### Children Props

```typescript
// ✅ GOOD: Explicit children type
interface CardProps {
  children: React.ReactNode;
  title?: string;
}

// For more specific children:
interface TabsProps {
  children: React.ReactElement<TabProps> | React.ReactElement<TabProps>[];
}
```

### Event Handlers

```typescript
// ✅ GOOD: Properly typed events
interface FormProps {
  onSubmit: (data: FormData) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

// Common event types:
// - React.ChangeEvent<HTMLInputElement>
// - React.MouseEvent<HTMLButtonElement>
// - React.FocusEvent<HTMLInputElement>
// - React.KeyboardEvent<HTMLInputElement>
// - React.FormEvent<HTMLFormElement>
```

### Generic Props

```typescript
// ✅ GOOD: Generic component with type safety
interface SelectProps<T> {
  options: T[];
  value: T;
  onChange: (value: T) => void;
  getLabel: (option: T) => string;
  getValue: (option: T) => string;
}

export default function Select<T>({ 
  options, 
  value, 
  onChange, 
  getLabel, 
  getValue 
}: SelectProps<T>) {
  return (
    <select 
      value={getValue(value)}
      onChange={(e) => {
        const selected = options.find(opt => getValue(opt) === e.target.value);
        if (selected) onChange(selected);
      }}
    >
      {options.map((option) => (
        <option key={getValue(option)} value={getValue(option)}>
          {getLabel(option)}
        </option>
      ))}
    </select>
  );
}
```

## Data Types

### API Responses

```typescript
// ✅ GOOD: Explicit response types
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
}

interface ApiResponse<T> {
  data: T;
  error: string | null;
  status: number;
}

async function fetchUser(id: string): Promise<ApiResponse<User>> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

// ❌ BAD: any or untyped
async function fetchUser(id: string) {
  const response = await fetch(`/api/users/${id}`);
  return response.json(); // Returns 'any'
}
```

### Union Types

```typescript
// ✅ GOOD: Discriminated unions
interface SuccessState {
  status: 'success';
  data: User;
}

interface ErrorState {
  status: 'error';
  error: string;
}

interface LoadingState {
  status: 'loading';
}

type FetchState = SuccessState | ErrorState | LoadingState;

function handleState(state: FetchState) {
  switch (state.status) {
    case 'success':
      return <div>{state.data.name}</div>; // Type narrowing works!
    case 'error':
      return <div>Error: {state.error}</div>;
    case 'loading':
      return <div>Loading...</div>;
  }
}
```

### Enums vs Union Types

```typescript
// ✅ PREFER: Union types (more lightweight)
type Status = 'idle' | 'loading' | 'success' | 'error';

// ⚠️ USE SPARINGLY: Enums (add runtime code)
enum Status {
  Idle = 'idle',
  Loading = 'loading',
  Success = 'success',
  Error = 'error',
}

// ✅ IF YOU NEED ENUMS: Use const enums (no runtime)
const enum Status {
  Idle = 'idle',
  Loading = 'loading',
  Success = 'success',
  Error = 'error',
}
```

## Utility Types

### Common Patterns

```typescript
// Pick - Select specific properties
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

type PublicUser = Pick<User, 'id' | 'name' | 'email'>;
// { id: string; name: string; email: string; }

// Omit - Exclude specific properties
type UserWithoutPassword = Omit<User, 'password'>;
// { id: string; name: string; email: string; }

// Partial - Make all properties optional
type PartialUser = Partial<User>;
// { id?: string; name?: string; email?: string; password?: string; }

// Required - Make all properties required
type RequiredUser = Required<Partial<User>>;

// Record - Create object type with specific keys
type UserRoles = Record<string, 'admin' | 'user' | 'guest'>;
// { [key: string]: 'admin' | 'user' | 'guest' }

// ReturnType - Extract return type of function
function getUser() {
  return { id: '1', name: 'John' };
}
type User = ReturnType<typeof getUser>;
// { id: string; name: string; }
```

### Advanced Patterns

```typescript
// ✅ GOOD: Conditional types for flexibility
type MessageProps<T extends boolean> = T extends true
  ? { message: string; onClose: () => void }
  : { message: string };

function Message<T extends boolean>(
  props: MessageProps<T> & { closeable: T }
) {
  // Type-safe based on closeable flag
}

// ✅ GOOD: Readonly for immutability
interface Config {
  readonly apiUrl: string;
  readonly timeout: number;
}

const config: Readonly<Config> = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
};
// config.apiUrl = 'new'; // Error!
```

## Type Guards

### Runtime Type Checking

```typescript
// ✅ GOOD: Type guards for runtime safety
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    typeof (obj as User).id === 'string' &&
    typeof (obj as User).name === 'string'
  );
}

// Usage:
function processData(data: unknown) {
  if (isUser(data)) {
    console.log(data.name); // TypeScript knows it's User
  }
}

// ❌ BAD: Type assertion without checking
function processData(data: unknown) {
  const user = data as User; // Unsafe!
  console.log(user.name);
}
```

### Discriminated Unions

```typescript
// ✅ GOOD: Exhaustive type checking
interface Square {
  kind: 'square';
  size: number;
}

interface Rectangle {
  kind: 'rectangle';
  width: number;
  height: number;
}

type Shape = Square | Rectangle;

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case 'square':
      return shape.size ** 2;
    case 'rectangle':
      return shape.width * shape.height;
    default:
      // Exhaustive check
      const _exhaustive: never = shape;
      return _exhaustive;
  }
}
```

## Hooks Typing

### useState

```typescript
// ✅ GOOD: Explicit type for complex state
interface User {
  id: string;
  name: string;
}

const [user, setUser] = useState<User | null>(null);

// ✅ GOOD: Type inference for simple state
const [count, setCount] = useState(0); // Inferred as number
const [name, setName] = useState(''); // Inferred as string
```

### useRef

```typescript
// ✅ GOOD: Proper ref typing
const inputRef = useRef<HTMLInputElement>(null);
const divRef = useRef<HTMLDivElement>(null);
const buttonRef = useRef<HTMLButtonElement>(null);

// Usage:
useEffect(() => {
  inputRef.current?.focus(); // Optional chaining for safety
}, []);
```

### useContext

```typescript
// ✅ GOOD: Typed context
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

### Custom Hooks

```typescript
// ✅ GOOD: Typed return values
interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const refetch = useCallback(() => {
    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);
  
  useEffect(() => {
    refetch();
  }, [refetch]);
  
  return { data, loading, error, refetch };
}
```

## Type Organization

### File Structure

```typescript
// ✅ GOOD: Co-located types
// components/Button.tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
}

export default function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}

// ✅ GOOD: Shared types in /types
// types/api.ts
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Post {
  id: string;
  title: string;
  author: User;
}

// types/global.d.ts
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
```

## Avoiding Common Pitfalls

### ❌ Don't Use `any`

```typescript
// ❌ BAD
function processData(data: any) {
  return data.name.toUpperCase(); // No type safety!
}

// ✅ GOOD
interface Data {
  name: string;
}

function processData(data: Data) {
  return data.name.toUpperCase(); // Type-safe!
}

// ✅ GOOD: Use unknown when type is truly unknown
function processData(data: unknown) {
  if (isData(data)) {
    return data.name.toUpperCase();
  }
}
```

### ❌ Don't Overuse Type Assertions

```typescript
// ❌ BAD: Blind assertion
const user = response as User;

// ✅ GOOD: Type guard
if (isUser(response)) {
  const user = response; // TypeScript knows it's User
}
```

### ❌ Don't Ignore Null/Undefined

```typescript
// ❌ BAD: Assuming value exists
function greet(user: User | null) {
  return `Hello, ${user.name}`; // Error if user is null!
}

// ✅ GOOD: Handle null case
function greet(user: User | null) {
  if (!user) return 'Hello, Guest';
  return `Hello, ${user.name}`;
}

// ✅ GOOD: Optional chaining
return `Hello, ${user?.name ?? 'Guest'}`;
```

## TypeScript Config

### Recommended tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    
    // Strict checks (all enabled)
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    
    // Additional checks
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```
