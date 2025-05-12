# Leveraging Wasp Framework Features

**Note:** This document outlines feature implementation using Wasp (version `^0.16.0` as specified in `project_docs/1-wasp-overview.md`). For the most up-to-date Wasp API details and general Wasp documentation, **developers should consult the Context7 MCP to fetch the latest Wasp documentation.** For Thesis Grey specific logic, component structure, UI, and detailed workflows, developers **must always refer to the UX/UI plans in the `project_docs/UI_by_feature/` directory, the `project_docs/mermaid.mmd` diagram, and the overall architecture documented in `project_docs/architecture/`.**

## Overview

Thesis Grey leverages the Wasp framework's built-in capabilities to eliminate custom boilerplate code and focus on the core business logic. This document outlines how we've utilized Wasp's features instead of building custom infrastructure.

## Key Wasp Features Utilized

### 1. Declarative App Configuration

The `main.wasp` file serves as the central configuration for the entire application:

- Application metadata and settings
- Entity (database model) definitions
- Routes and pages with authentication requirements. **This includes routes and page definitions for key workflow stages such as the `Search Strategy Page` (for session listing and strategy building), `Search Execution Status Page`, `Results Overview Page`, `Review Interface Page`, `Reporting Page`, and in Phase 2, the `Session Hub Page` and specialized Lead Reviewer UIs like `Deduplication Overview Page` and `Processing Status Dashboard Page`.**
- Client-server operations (queries and actions)

This declarative approach eliminates the need for manual configuration of routing, authentication flows, and database connections.

### 2. Authentication System

Rather than building a custom authentication system, we leverage Wasp's built-in auth:

```wasp
app ThesisGrey {
  // ...
  auth: {
    userEntity: User,
    methods: {
      usernameAndPassword: {},
    },
    onAuthFailedRedirectTo: "/login",
    onAuthSucceededRedirectTo: "/search-strategy" // Default P1 landing page
  }
  // ...
}
```

This provides:
- JWT token management
- User registration (`SignupPage`) and login (`LoginPage`) flows
- Session handling
- Protected routes with the `authRequired: true` property. **This core authentication is the foundation upon which Thesis Grey's Phase 2 Role-Based Access Control (RBAC) is built. While Wasp handles the basic authentication, application-level logic within operations and components uses the authenticated user's context (and potentially session-specific role data) to determine their capabilities, thereby controlling access to features and data on pages like the Phase 2 `Session Hub Page` or administrative interfaces like the `Deduplication Overview Page`.**

### 3. Operation System (Queries & Actions)

Wasp's operations system provides a standardized approach to client-server communication:

```wasp
// Example for fetching search sessions for the Search Strategy Page
query getSearchSessions {
  fn: import { getSearchSessions } from "@src/server/searchStrategy/queries.js",
  entities: [SearchSession]
}

// Example for creating a new search session from the Search Strategy Page
action createSearchSession {
  fn: import { createSearchSession } from "@src/server/searchStrategy/actions.js",
  entities: [SearchSession]
}
```

Benefits:
- Type-safe client-server communication
- Automatic data fetching and caching via React Query
- Entity-based access control. **Wasp operations are central to fetching data for all workflow pages (e.g., progress data for the `Search Execution Status Page`, session data for the `Search Strategy Page`, or aggregated information for the Phase 2 `Session Hub Page`) and performing role-aware actions based on the authenticated user.**
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
src/
├── client/
│   ├── {featureName}/
│   │   ├── components/     # React components
│   │   └── pages/          # Page components (e.g., SearchStrategyPage.tsx)
│   └── shared/             # Shared components like MainLayout.tsx
└── server/
    └── {featureName}/
        ├── actions.js      # Write operations
        └── queries.js      # Read operations
```

This organization:
- Groups related code together (e.g., all client and server logic for the `serpExecution` feature, including its `SearchExecutionStatusPage.tsx` and related components, resides within `src/client/serpExecution/` and `src/server/serpExecution/`). **Similarly, the Phase 2 `Session Hub Page` and its logic would typically reside within a dedicated `sessionHub` feature's directories or be part of an expanded `searchStrategy` or a new `reviewCollaboration` feature.**
- Minimizes cross-feature dependencies
- Makes features easier to understand and maintain

### Authentication and Authorization

Authentication leverages Wasp's built-in system:

```tsx
// Page definition in main.wasp (Example for Phase 2 Session Hub Page)
page SessionHubPage { // Path might be /session/:sessionId/hub
  authRequired: true,
  component: import { SessionHubPage } from "@src/client/sessionHub/pages/SessionHubPage"
}

// Client-side usage
import { useAuth } from 'wasp/client/auth';

function SomeAuthenticatedPage() {
  const { data: user } = useAuth();
  if (!user) return <div>Not authenticated</div>;
  // ... page content for authenticated user ...
}
```

Authorization is enforced in operations:

```typescript
export const getSearchSession = async ({ id }, context) => {
  if (!context.user) {
    throw new HttpError(401, "Unauthorized");
  }
  
  // Check if the user has access to this session (Phase 1)
  // if (session.userId !== context.user.id) { ... }
  
  // In Phase 2, this check becomes more nuanced, involving the user's role 
  // within the specific session (e.g., Lead Reviewer, Reviewer) to grant access 
  // to the session data or specific administrative actions.
  // Conceptual example:
  // const userRoleForSession = await getUserRoleForSession(context.user.id, session.id, context.entities);
  // if (userRoleForSession !== 'Lead Reviewer' && session.userId !== context.user.id) {
  //   throw new HttpError(403, "Access Denied or Insufficient Privileges");
  // }
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

After (using Wasp's auth for login/signup forms on `LoginPage`/`SignupPage`):
```tsx
// src/client/auth/pages/LoginPage.tsx
import { LoginForm } from 'wasp/client/auth';
// ... other layout ...
export function LoginPage() {
  return <LoginForm />;
}
```

## Conclusion

By leveraging Wasp's built-in capabilities, we've created a more maintainable, secure, and efficient implementation of Thesis Grey. This approach allows us to focus on the core business logic and user experience rather than reinventing infrastructure components. 