# Leveraging Wasp Framework Features

## Overview

Thesis Grey leverages the Wasp framework's built-in capabilities to eliminate custom boilerplate code and focus on the core business logic. This document outlines how we've utilized Wasp's features instead of building custom infrastructure.

## Key Wasp Features Utilized

### 1. Declarative App Configuration

The `main.wasp` file serves as the central configuration for the entire application:

- Application metadata and settings
- Entity (database model) definitions
- Routes and pages with authentication requirements
- Client-server operations (queries and actions)

This declarative approach eliminates the need for manual configuration of routing, authentication flows, and database connections.

### 2. Authentication System

Rather than building a custom authentication system, we leverage Wasp's built-in auth:

```wasp
auth: {
  userEntity: User,
  methods: {
    usernameAndPassword: {},
  },
  onAuthFailedRedirectTo: "/login"
}
```

This provides:
- JWT token management
- User registration and login flows
- Session handling
- Protected routes with the `authRequired: true` property

### 3. Operation System (Queries & Actions)

Wasp's operations system provides a standardized approach to client-server communication:

```wasp
query getSearchSessions {
  fn: import { getSearchSessions } from "@src/server/searchStrategy/queries.js",
  entities: [SearchSession]
}

action createSearchSession {
  fn: import { createSearchSession } from "@src/server/searchStrategy/actions.js",
  entities: [SearchSession]
}
```

Benefits:
- Type-safe client-server communication
- Automatic data fetching and caching via React Query
- Entity-based access control
- Optimistic UI updates

### 4. Error Handling

We've replaced the custom error hierarchy with Wasp's `HttpError`:

```typescript
import { HttpError } from "wasp/server";

if (!session) {
  throw new HttpError(404, "Search session not found");
}
```

This provides:
- Standardized HTTP error responses
- Automatic error handling in the client
- Consistent error patterns across the application

### 5. Type Safety

Wasp generates TypeScript types based on Prisma schema and operations:

```typescript
import type { SearchSession } from 'wasp/entities';
import type { GetSearchSessions } from 'wasp/server/operations';
```

Benefits:
- Single source of truth for types
- Automatic type updates when schema changes
- Enhanced developer experience with autocompletion

## Implementation Patterns

### Vertical Slice Architecture

Each feature follows a vertical slice architecture pattern:

```
feature/
├── client/
│   ├── components/     # React components
│   └── pages/          # Page components
└── server/
    ├── actions.js      # Write operations
    └── queries.js      # Read operations
```

This organization:
- Groups related code together
- Minimizes cross-feature dependencies
- Makes features easier to understand and maintain

### Authentication and Authorization

Authentication leverages Wasp's built-in system:

```tsx
// Page definition in main.wasp
page ProfilePage {
  authRequired: true,
  component: import { ProfilePage } from "@src/client/auth/pages/ProfilePage"
}

// Client-side usage
import { useAuth } from 'wasp/client/auth';

function ProfilePage() {
  const { data: user } = useAuth();
  // ...
}
```

Authorization is enforced in operations:

```typescript
export const getSearchSession = async ({ id }, context) => {
  if (!context.user) {
    throw new HttpError(401, "Unauthorized");
  }
  
  // Check if the user has access to this session
  if (session.userId !== context.user.id) {
    throw new HttpError(403, "You don't have access to this session");
  }
}
```

### Database Access

Wasp's Prisma integration provides clean, type-safe database access:

```typescript
// Entity access via context
const sessions = await context.entities.SearchSession.findMany({
  where: { userId: context.user.id },
  include: { searchQueries: true }
});
```

## Benefits of the Wasp Approach

1. **Reduced Codebase Size**: By eliminating custom infrastructure, the codebase is significantly smaller and more focused.

2. **Faster Development**: Less time spent on boilerplate means more time implementing core features.

3. **Better Maintainability**: Standard patterns make the code easier to maintain and extend.

4. **Enhanced Security**: Using built-in authentication and authorization reduces security risks.

5. **Improved Developer Experience**: Type safety and consistent patterns improve developer productivity.

## Implementation Examples

### Error Handling Example

Before (custom error hierarchy):
```typescript
import { NotFoundError, UnauthorizedError } from '../shared/errors';

if (!session) {
  throw new NotFoundError('Session not found');
}
```

After (using Wasp's HttpError):
```typescript
import { HttpError } from 'wasp/server';

if (!session) {
  throw new HttpError(404, 'Session not found');
}
```

### Authentication Example

Before (custom JWT handling):
```typescript
import jwt from 'jsonwebtoken';
import { config } from '../shared/config';

const token = jwt.sign({ userId: user.id }, config.auth.jwtSecret, {
  expiresIn: config.auth.jwtExpiresIn
});
```

After (using Wasp's auth):
```tsx
import { LoginForm } from 'wasp/client/auth';

function LoginPage() {
  return <LoginForm />;
}
```

## Conclusion

By leveraging Wasp's built-in capabilities, we've created a more maintainable, secure, and efficient implementation of Thesis Grey. This approach allows us to focus on the core business logic and user experience rather than reinventing infrastructure components. 