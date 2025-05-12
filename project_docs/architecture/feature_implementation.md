# Feature Implementation Details

**Note:** This document outlines feature implementation using Wasp (version `^0.16.0` as specified in `project_docs/1-wasp-overview.md`). For the most up-to-date Wasp API details and general Wasp documentation, **developers should consult the Context7 MCP to fetch the latest Wasp documentation.** For Thesis Grey specific logic, component structure, UI, and detailed workflows, developers **must always refer to the UX/UI plans in the `project_docs/UI_by_feature/` directory, the `project_docs/mermaid.mmd` diagram (formerly workflow.mmd), and the overall architecture documented in `project_docs/architecture/`.**

This document provides an overview of how each core feature of Thesis Grey is implemented using the Wasp framework.

## 1. Authentication Feature

The authentication feature is implemented using Wasp's built-in authentication system.

### Configuration in main.wasp
```wasp
app ThesisGrey {
  // ... other app settings
  auth: {
    userEntity: User,
    methods: {
      usernameAndPassword: {},
    },
    onAuthFailedRedirectTo: "/login",
    onAuthSucceededRedirectTo: "/review-manager" // Central landing page
  }
}

route LoginRoute { path: "/login", to: LoginPage }
page LoginPage {
  component: import { LoginPage } from "@src/client/auth/pages/LoginPage"
}

route SignupRoute { path: "/signup", to: SignupPage }
page SignupPage {
  component: import { SignupPage } from "@src/client/auth/pages/SignupPage"
}

route ProfileRoute { path: "/profile", to: UserProfilePage }
page UserProfilePage {
  authRequired: true,
  component: import { UserProfilePage } from "@src/client/auth/pages/UserProfilePage"
}

route ReviewManagerRoute { path: "/review-manager", to: ReviewManagerPage }
page ReviewManagerPage {
  authRequired: true,
  component: import { ReviewManagerPage } from "@src/client/reviewManager/pages/ReviewManagerPage"
}
```

### Client Implementation
```tsx
// src/client/auth/pages/LoginPage.tsx
import { LoginForm } from 'wasp/client/auth';
// ... layout and styling ...
export function LoginPage() { return <LoginForm />; }

// src/client/auth/pages/UserProfilePage.tsx
import { useAuth, logout } from 'wasp/client/auth';
// ... layout and styling ...
export function UserProfilePage() {
  const { data: user } = useAuth();
  return (
    <div>
      <h1>User Profile</h1>
      <p>Username: {user?.username}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Authorization in Operations
Authorization is enforced in every operation. In Phase 2, this becomes more granular, often checking a user's specific role within a review session (e.g., 'Lead Reviewer', 'Reviewer') to control access to sensitive operations or administrative UIs.

```typescript
// Example from a query, demonstrating conceptual RBAC check for Phase 2
export const getSearchSession = async ({ id }, context) => {
  if (!context.user) {
    throw new HttpError(401, "Unauthorized");
  }
  
  const session = await context.entities.SearchSession.findUnique({
    where: { id }
    // In Phase 2, might also include fetching related UserSessionRole entity
    // to determine the user's role for this specific session.
  });
  
  if (!session) { throw new HttpError(404, "Session not found"); }

  // Example of combined ownership (P1) and role-based access check (P2 concept)
  // Actual RBAC logic will depend on how roles are stored and retrieved.
  const canAccess = (session.userId === context.user.id) || 
                  (context.user.isAdmin) || // Example admin override
                  (isUserMemberOfSessionTeam(context.user, session.id, context.entities)); // Placeholder for P2 team/role check

  if (!canAccess) {
    throw new HttpError(403, "You don't have access to this session");
  }
  
  // Further checks for specific actions within the session would verify specific roles,
  // e.g., if trying to edit settings, check if user is 'Lead Reviewer' for this session.
  return session;
};
```

## 2. Review Manager Dashboard (`ReviewManagerPage`)

The Review Manager Dashboard serves as the central landing page after authentication, providing users with a comprehensive overview of their reviews and navigation to other features.

### Configuration in main.wasp
```wasp
query getReviewSessions {
  fn: import { getReviewSessions } from "@src/server/reviewManager/queries.js",
  entities: [SearchSession]
}

action createReview {
  fn: import { createReview } from "@src/server/reviewManager/actions.js",
  entities: [SearchSession]
}

route ReviewManagerRoute { path: "/review-manager", to: ReviewManagerPage }
page ReviewManagerPage {
  authRequired: true,
  component: import { ReviewManagerPage } from "@src/client/reviewManager/pages/ReviewManagerPage"
}
```

### Implementation Highlights

1. **Review Session Overview**: Displays all review sessions owned by the user, categorized by status (Draft, In Progress, Completed).
2. **Navigation Hub**: Provides context-aware navigation to other features based on review status:
   - Draft reviews → Search Strategy Page
   - Executing reviews → Search Execution Status Page
   - Completed reviews → Results Overview Page
3. **Review Management**: Allows users to create new reviews, filter existing reviews by status, and manage their review portfolio.

### Client Implementation
```tsx
// src/client/reviewManager/pages/ReviewManagerPage.tsx
import { useQuery } from 'wasp/client/operations';
import { getReviewSessions, createReview } from 'wasp/client/operations';
import { ReviewSessionList } from '../components/ReviewSessionList';
import { CreateReviewForm } from '../components/CreateReviewForm';

export function ReviewManagerPage() {
  const { data: sessions, isLoading, error } = useQuery(getReviewSessions);

  const handleCreateReview = async (name: string, description: string) => {
    try {
      await createReview({ name, description });
      // Handle success (e.g., show notification, refresh list)
    } catch (error) {
      // Handle error
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1>Review Manager</h1>
      <CreateReviewForm onSubmit={handleCreateReview} />
      <ReviewSessionList sessions={sessions} />
    </div>
  );
}
```

### Server Implementation
```typescript
// src/server/reviewManager/queries.js
export const getReviewSessions = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, "Unauthorized");
  }

  return context.entities.SearchSession.findMany({
    where: { userId: context.user.id },
    orderBy: { updatedAt: 'desc' },
    include: {
      searchQueries: true,
      searchExecutions: true
    }
  });
};

// src/server/reviewManager/actions.js
export const createReview = async ({ name, description }, context) => {
  if (!context.user) {
    throw new HttpError(401, "Unauthorized");
  }

  return context.entities.SearchSession.create({
    data: {
      name,
      description,
      userId: context.user.id
    }
  });
};
```

## 3. Search Strategy & Session Management (`SearchStrategyPage`)

The `Search Strategy Page` allows users to list, create, and manage search sessions, and to define/edit search queries within a selected session.

### Configuration in main.wasp
```wasp
query getSearchSessions {
  fn: import { getSearchSessions } from "@src/server/searchStrategy/queries.js",
  entities: [SearchSession]
}

query getSearchSessionDetails { // For editing a specific session's strategy
  fn: import { getSearchSessionDetails } from "@src/server/searchStrategy/queries.js",
  entities: [SearchSession, SearchQuery]
}

action createSearchSession {
  fn: import { createSearchSession } from "@src/server/searchStrategy/actions.js",
  entities: [SearchSession]
}

action updateSearchSessionStrategy { // Includes creating/updating/deleting queries for that session
  fn: import { updateSearchSessionStrategy } from "@src/server/searchStrategy/actions.js",
  entities: [SearchSession, SearchQuery]
}

// Route for the main Search Strategy Page
route SearchStrategyRoute { path: "/search-strategy", to: SearchStrategyPage }
page SearchStrategyPage {
  authRequired: true,
  component: import { SearchStrategyPage } from "@src/client/searchStrategy/pages/SearchStrategyPage"
}
```

### Implementation Highlights

1.  **Session Listing & Creation**: Users can view their existing `SearchSession` entities and create new ones (name, description).
2.  **Strategy Building**: For a selected (new or draft) session, users define PIC terms, configure filters (domains, file types), and set other parameters (max results). The query preview updates in real-time.
3.  **Saving & Execution**: Users can save the strategy (updating `SearchSession` and its `SearchQuery` children) or initiate execution, which transitions to the `Search Execution Status Page`.

### Client Implementation
```tsx
// src/client/searchStrategy/pages/SearchStrategyPage.tsx (Conceptual)
import { useQuery } from 'wasp/client/operations';
import { getSearchSessions, createSearchSession } from 'wasp/client/operations';
// ... other imports for components like SearchSessionList, StrategyEditor ...

export function SearchStrategyPage() {
  const { data: sessions, refetch } = useQuery(getSearchSessions);
  // ... logic to handle selected session, display list or editor ...

  const handleCreateSession = async (name: string, description: string) => {
    try {
      await createSearchSession({ name, description });
      refetch();
    } catch (error) {
      console.error("Failed to create session:", error);
    }
  };
  // ... JSX for listing sessions, showing create form, or strategy editor ...
}
```

## 4. Session Hub (Phase 2 - `SessionHubPage`)

The `Session Hub Page` is a Phase 2 feature providing a central dashboard for a specific, active review session, with role-based navigation and functionalities.

### Configuration in `main.wasp` (Phase 2)
```wasp
route SessionHubRoute { path: "/session/:sessionId/hub", to: SessionHubPage } // Example path
page SessionHubPage {
  authRequired: true,
  component: import { SessionHubPage } from "@src/client/sessionHub/pages/SessionHubPage" // Assuming dedicated feature folder
}

query getSessionHubData { // Fetches all data needed for the hub based on session and user role
  fn: import { getSessionHubData } from "@src/server/sessionHub/queries.js",
  entities: [SearchSession, /* potentially Team, UserSessionRole, etc. */]
}
```

### Implementation Highlights

1.  **Centralized View**: Links to Strategy (`Search Strategy Page` for this session), Results (`Results Overview Page`), Team Management, Session Settings, Reporting (`Reporting Page`), and Admin tools (like `Deduplication Overview Page`, `Processing Status Dashboard`).
2.  **Role-Based Content**: Dynamically renders content and actions based on the user's role within that specific session (e.g., Lead Reviewer vs. Reviewer).

## 5. SERP Execution (`SearchExecutionStatusPage`)

This feature executes defined search strategies against external APIs and displays progress.

### Configuration in `main.wasp`
```wasp
// Queries to get SearchExecution status, if needed directly by client beyond what page receives
query getSearchExecutionStatus {
  fn: import { getSearchExecutionStatus } from "@src/server/serpExecution/queries.js",
  entities: [SearchExecution]
}

action executeSearchQueriesForSession { // Action to trigger all queries in a session
  fn: import { executeSearchQueriesForSession } from "@src/server/serpExecution/actions.js",
  entities: [SearchSession, SearchQuery, SearchExecution, RawSearchResult]
}

route SearchExecutionStatusRoute { path: "/search-execution/:sessionId", to: SearchExecutionStatusPage }
page SearchExecutionStatusPage {
  authRequired: true,
  component: import { SearchExecutionStatusPage } from "@src/client/serpExecution/pages/SearchExecutionStatusPage"
}
```

### Implementation Highlights

1.  **Query Execution**: Asynchronous execution against external APIs (e.g., Serper for Google Search). Status (running, completed, failed) is tracked in `SearchExecution` entities.
2.  **Status Display**: The `Search Execution Status Page` shows progress for SERP API calls. In Phase 2, this page is enhanced to provide a consolidated view of both SERP query execution *and* subsequent results processing stages (from the `ResultsManagerService`), with the UI for this consolidated view managed by the `serpExecution` feature.

### Server Implementation (Conceptual `executeSearchQueriesForSession`)
```typescript
// In src/server/serpExecution/actions.js
export const executeSearchQueriesForSession = async ({ sessionId }, context) => {
  // ... authorization ...
  const searchQueries = await context.entities.SearchQuery.findMany({ where: { sessionId } });
  
  for (const query of searchQueries) {
    const execution = await context.entities.SearchExecution.create({
      data: { queryId: query.id, sessionId, status: 'pending', startTime: new Date() }
    });
    // Trigger background job for individual query execution (e.g., _executeSingleSearchQueryJob)
    // This job would call the external API, store RawSearchResults, and update SearchExecution status.
    // Example: _executeSingleSearchQueryJob.performAsync({ executionId: execution.id, queryText: query.queryText, maxResults: query.maxResults });
  }
  return { message: "Search execution started for session " + sessionId };
};
```

## 6. Results Management (`ResultsOverviewPage`, Phase 2 Admin UIs)

Handles backend processing of raw results and provides UIs for review and (in P2) admin management.

### Configuration in `main.wasp`
```wasp
query getProcessedResultsForSession { // For ResultsOverviewPage
  fn: import { getProcessedResultsForSession } from "@src/server/resultsManager/queries.js",
  entities: [ProcessedResult, SearchSession /* + other related entities for display */]
}

// Phase 2 Admin Pages for Results Manager
route DeduplicationOverviewRoute { path: "/session/:sessionId/deduplication", to: DeduplicationOverviewPage } 
page DeduplicationOverviewPage {
  authRequired: true,
  component: import { DeduplicationOverviewPage } from "@src/client/resultsManager/pages/DeduplicationOverviewPage"
}

route ProcessingStatusDashboardRoute { path: "/session/:sessionId/processing-status", to: ProcessingStatusDashboardPage }
page ProcessingStatusDashboardPage {
  authRequired: true,
  component: import { ProcessingStatusDashboardPage } from "@src/client/resultsManager/pages/ProcessingStatusDashboardPage"
}

// Results Overview Page (primarily for reviewResults feature, but relies on processed data)
route ResultsOverviewRoute { path: "/results-overview/:sessionId", to: ResultsOverviewPage }
page ResultsOverviewPage {
  authRequired: true,
  component: import { ResultsOverviewPage } from "@src/client/reviewResults/pages/ResultsOverviewPage"
}
```

### Implementation Highlights

1.  **Backend Processing**: Normalization, metadata extraction, basic deduplication. Status updates contribute to the consolidated P2 `Search Execution Status Page`.
2.  **Results Display**: Processed results are shown on the `Results Overview Page`.
3.  **Phase 2 Admin UIs**: `Deduplication Overview Page` and `Processing Status Dashboard Page` for Lead Reviewers/Admins.

## 7. Results Review (`ResultsOverviewPage`, `ReviewInterfacePage`)

Allows users to view, tag, and annotate processed search results.

### Configuration in main.wasp
```wasp
// getProcessedResultsForSession query (defined under Results Manager) is used by ResultsOverviewPage

query getSingleProcessedResultDetails { // For ReviewInterfacePage
  fn: import { getSingleProcessedResultDetails } from "@src/server/reviewResults/queries.js",
  entities: [ProcessedResult, ReviewTagAssignment, ReviewTag, Note]
}

query getReviewTagsForSession {
  fn: import { getReviewTagsForSession } from "@src/server/reviewResults/queries.js",
  entities: [ReviewTag]
}

action createReviewTag {
  fn: import { createReviewTag } from "@src/server/reviewResults/actions.js",
  entities: [ReviewTag]
}

action assignTagToResult {
  fn: import { assignTagToResult } from "@src/server/reviewResults/actions.js",
  entities: [ReviewTagAssignment]
}

action createNoteForResult {
  fn: import { createNoteForResult } from "@src/server/reviewResults/actions.js",
  entities: [Note]
}

// ResultsOverviewPage is defined under Results Manager as it displays processed data
// ReviewInterfacePage for detailed single result review
route ReviewInterfaceRoute { path: "/review/:resultId", to: ReviewInterfacePage }
page ReviewInterfacePage {
  authRequired: true,
  component: import { ReviewInterfacePage } from "@src/client/reviewResults/pages/ReviewInterfacePage"
}
```

### Implementation Highlights

1.  **Results Listing**: `Results Overview Page` lists `ProcessedResult` entities with filtering and sorting.
2.  **Detailed Review**: `Review Interface Page` provides a focused view for one result, allowing tagging (Include/Exclude/Maybe), exclusion reasons, and note-taking.

## 8. Reporting & Export (`ReportingPage`)

Generates statistics and exports results.

### Configuration in main.wasp
```wasp
query getReportDataForSession {
  fn: import { getReportDataForSession } from "@src/server/reporting/queries.js",
  entities: [SearchSession, ProcessedResult, ReviewTagAssignment, ReviewTag, SearchQuery, SearchExecution]
}

action exportSessionResults {
  fn: import { exportSessionResults } from "@src/server/reporting/actions.js"
  // This action likely doesn't modify entities directly but reads them to produce a file/data.
}

route ReportingRoute { path: "/reporting/:sessionId", to: ReportingPage }
page ReportingPage {
  authRequired: true,
  component: import { ReportingPage } from "@src/client/reporting/pages/ReportingPage"
}
```

### Implementation Highlights

1.  **PRISMA Data**: The `Reporting Page` displays PRISMA flow data and other statistics.
2.  **Export**: Supports CSV/JSON export of results.

## Conclusion

Each feature implementation follows the pattern of defining Wasp entities, routes, pages, queries, and actions in `main.wasp`, with corresponding server-side logic in `src/server/{featureName}/` and client-side UI in `src/client/{featureName}/`. This consistent approach leverages Wasp's capabilities for a clean and maintainable codebase. 