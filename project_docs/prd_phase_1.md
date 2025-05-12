# Thesis Grey: Phase 1 PRD

**Note:** This document outlines feature implementation using Wasp (version `^0.16.0` as specified in `project_docs/1-wasp-overview.md`). For the most up-to-date Wasp API details and general Wasp documentation, **developers should consult the Context7 MCP to fetch the latest Wasp documentation.** For Thesis Grey specific logic, component structure, UI, and detailed workflows, developers **must always refer to the UX/UI plans in the `project_docs/UI_by_feature/` directory, the `project_docs/mermaid.mmd` diagram, and the overall architecture documented in `project_docs/architecture/`.**

## Project Overview

Thesis Grey is a specialised search application designed to facilitate the discovery and management of grey literature for clinical guideline development. The application follows a phased implementation approach where Phase 1 delivers core functionality with a streamlined feature set, establishing the foundation for more advanced capabilities in Phase 2. **Upon successful authentication, users are directed to the `Search Strategy Page` (`/search-strategy`). This page serves as the central hub where users can view and manage their existing search sessions or initiate new ones.**

This PRD outlines the Phase 1 implementation, which follows Vertical Slice Architecture (VSA) principles to deliver a complete working application focused on essential features while providing clear extension points for future development.

### Project Goals

1. Provide researchers with tools to create and execute systematic search strategies
2. Enable efficient processing and review of search results
3. Support PRISMA-compliant workflows for literature reviews
4. Establish a foundation that can be extended in Phase 2 without significant refactoring

## Database Architecture

### Overview

Phase 1 will implement the full database schema designed to support both phases, with some fields remaining unused but available for Phase 2. The application will use Prisma ORM integrated with the Wasp framework for type-safe database operations.

### Database System

```wasp
app ThesisGrey {
  title: "Thesis Grey",
  wasp: { version: "^0.16.0" },
  db: {
    system: PostgreSQL,
    prisma: {
      clientPreviewFeatures: ["extendedWhereUnique"]
    }
  }
}
```

### Core Entities

```prisma
// User and Authentication
model User {
  id                 String            @id @default(uuid())
  username           String            @unique
  email              String?           @unique
  password           String            // Hashed password
  createdAt          DateTime          @default(now())
  updatedAt          DateTime          @updatedAt
  searchSessions     SearchSession[]
  reviewAssignments  ReviewAssignment[]
}

// Search Session
model SearchSession {
  id                String            @id @default(uuid())
  name              String
  description       String?
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt
  userId            String
  user              User              @relation(fields: [userId], references: [id])
  searchQueries     SearchQuery[]
  searchExecutions  SearchExecution[]
  processedResults  ProcessedResult[]
  reviewTags        ReviewTag[]
}

// Search Query
model SearchQuery {
  id                String            @id @default(uuid())
  query             String
  description       String?
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt
  sessionId         String
  searchSession     SearchSession     @relation(fields: [sessionId], references: [id])
  searchExecutions  SearchExecution[]
  rawSearchResults  RawSearchResult[]
}

// Search Execution
model SearchExecution {
  id                String            @id @default(uuid())
  status            String            // running, completed, failed
  startTime         DateTime          @default(now())
  endTime           DateTime?
  resultCount       Int?
  error             String?
  queryId           String
  sessionId         String
  searchQuery       SearchQuery       @relation(fields: [queryId], references: [id])
  searchSession     SearchSession     @relation(fields: [sessionId], references: [id])
}

// Raw Search Result
model RawSearchResult {
  id                String            @id @default(uuid())
  queryId           String
  title             String
  url               String
  snippet           String?
  rank              Int
  searchEngine      String
  rawResponse       Json
  searchQuery       SearchQuery       @relation(fields: [queryId], references: [id])
  processedResult   ProcessedResult?
}

// Processed Result
model ProcessedResult {
  id                String            @id @default(uuid())
  rawResultId       String            @unique
  sessionId         String
  title             String
  url               String
  snippet           String?
  metadata          Json
  rawSearchResult   RawSearchResult   @relation(fields: [rawResultId], references: [id])
  searchSession     SearchSession     @relation(fields: [sessionId], references: [id])
  reviewTags        ReviewTagAssignment[]
  notes             Note[]
  duplicateOf       DuplicateRelationship[] @relation("primaryResult")
  duplicates        DuplicateRelationship[] @relation("duplicateResult")
}

// Duplicate Relationship (Basic implementation for Phase 1)
model DuplicateRelationship {
  id                String            @id @default(uuid())
  primaryResultId   String
  duplicateResultId String
  similarityScore   Float
  duplicateType     String
  primaryResult     ProcessedResult   @relation("primaryResult", fields: [primaryResultId], references: [id])
  duplicateResult   ProcessedResult   @relation("duplicateResult", fields: [duplicateResultId], references: [id])
}

// Review Tag
model ReviewTag {
  id                String            @id @default(uuid())
  name              String
  color             String
  sessionId         String
  searchSession     SearchSession     @relation(fields: [sessionId], references: [id])
  assignments       ReviewTagAssignment[]
}

// Review Tag Assignment
model ReviewTagAssignment {
  id                String            @id @default(uuid())
  tagId             String
  resultId          String
  tag               ReviewTag         @relation(fields: [tagId], references: [id])
  result            ProcessedResult   @relation(fields: [resultId], references: [id])
}

// Review Assignment (Simplified for Phase 1)
model ReviewAssignment {
  id                String            @id @default(uuid())
  userId            String
  user              User              @relation(fields: [userId], references: [id])
}

// Note
model Note {
  id                String            @id @default(uuid())
  content           String
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt
  resultId          String
  result            ProcessedResult   @relation(fields: [resultId], references: [id])
}
```

## Project Structure

Phase 1 will follow Vertical Slice Architecture (VSA) using the Wasp framework. This approach organizes code around features rather than technical layers, leading to better cohesion and simpler testing.

### Core Structure

```
thesis-grey/
├── main.wasp                 # Main Wasp configuration
├── src/
│   ├── client/               # Client-side code
│   │   ├── auth/             # Authentication (`LoginPage`, `SignupPage`, `UserProfilePage`)
│   │   ├── searchStrategy/   # `SearchStrategyPage` (session list, creation, strategy building)
│   │   ├── serpExecution/    # `SearchExecutionStatusPage`
│   │   ├── reviewResults/    # `ResultsOverviewPage`, `ReviewInterfacePage`
│   │   ├── reporting/        # `ReportingPage`
│   │   └── shared/           # Shared UI components (e.g., MainLayout)
│   ├── server/               # Server-side code
│   │   ├── auth/
│   │   ├── searchStrategy/
│   │   ├── serpExecution/
│   │   ├── resultsManager/   # Backend logic for processing results
│   │   ├── reviewResults/
│   │   ├── reporting/
│   │   └── shared/
│   └── shared/               # Code shared between client and server
│       ├── types.ts
│       └── utils.ts
├── public/
└── migrations/
```

### Vertical Slice Implementation

Each feature will follow a vertical slice structure:

```
feature/
├── client/
│   ├── components/           # React components
│   ├── hooks/                # React hooks
│   └── pages/                # Page components
├── server/
│   ├── actions.ts            # Wasp actions
│   ├── queries.ts            # Wasp queries
│   └── utils.ts              # Server-side utilities
└── shared/
    └── types.ts              # Shared types
```

## Tech Stack

Phase 1 will utilize the Wasp full-stack framework, which integrates several modern technologies:

### Frontend
- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **TailwindCSS**: Utility-first CSS framework
- **React Router**: Client-side routing (provided by Wasp)

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web server framework (provided by Wasp)
- **Prisma**: ORM for database operations
- **JWT**: Authentication tokens

### Database
- **PostgreSQL**: Relational database

### DevOps
- **Docker**: Containerization (for production)
- **GitHub Actions**: CI/CD

### APIs
- **Google Search API via Serper**: For search execution

## Core Requirements by Feature

### 1. Authentication Feature

**Full Implementation in Phase 1**

```wasp
app ThesisGrey {
  // ...
  wasp: { version: "^0.16.0" },
  auth: {
    userEntity: User,
    methods: {
      usernameAndPassword: {},
    },
    onAuthFailedRedirectTo: "/login",
    onAuthSucceededRedirectTo: "/search-strategy" // Default landing page for P1
  }
}

// Root route now directs to Search Strategy Page after login
route RootRoute { path: "/", to: SearchStrategyPage } 
// SearchStrategyPage definition is under its own feature section

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
```

**Requirements:**
*   User registration (`SignupPage`) and login (`LoginPage`).
*   Profile management (`UserProfilePage`).
*   JWT-based authentication.
*   Basic role-based permissions (Researcher role initially).
*   Integration with Wasp authentication system.

**Extension points for Phase 2:**
*   Advanced roles and permissions system.
*   Organization-based access control.
*   Collaboration features.
*   Navigation to a centralized `Session Hub Page` for detailed session management.

### 2. Search Strategy & Session Management (`SearchStrategyPage`)

**Phase 1 Implementation:**

```wasp
// SearchStrategyPage is the main landing for authenticated users.
page SearchStrategyPage { // Path defined by RootRoute or SearchStrategyRoute
  authRequired: true,
  component: import { SearchStrategyPage } from "@src/client/searchStrategy/pages/SearchStrategyPage"
}

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

// Action to update session strategy, including its queries
action updateSearchSessionStrategy {
  fn: import { updateSearchSessionStrategy } from "@src/server/searchStrategy/actions.js",
  entities: [SearchSession, SearchQuery]
}
```

**Requirements:**
*   The `Search Strategy Page` (`/search-strategy`) serves as the primary interface for authenticated users.
*   Lists user's `SearchSession` entities.
*   Allows creation of new sessions (name, description).
*   For a selected session (new or draft), provides an interface for:
    *   Basic concept grouping (Population, Interest, Context).
    *   Domain selection.
    *   File type filtering.
    *   Simple query generation & real-time preview.
*   Saving the strategy updates the session and its queries.
*   Executing searches transitions the user to the `Search Execution Status Page`.

**Extension points for Phase 2:**
*   Advanced concept relationships & operators.
*   Query suggestion system, history, versioning.
*   Visual query builder, template library.
*   (Phase 2) `Session Hub Page` will provide enhanced context-specific navigation and management originating from a selected session.

### 3. SERP Execution (`SearchExecutionStatusPage`)

**Phase 1 Implementation:**

```wasp
// Route for the Search Execution Status Page
route SearchExecutionStatusRoute { path: "/search-execution/:sessionId", to: SearchExecutionStatusPage }
page SearchExecutionStatusPage {
  authRequired: true,
  component: import { SearchExecutionStatusPage } from "@src/client/serpExecution/pages/SearchExecutionStatusPage"
}

// Action to trigger all queries in a session and monitor them
action executeSearchQueriesForSession {
  fn: import { executeSearchQueriesForSession } from "@src/server/serpExecution/actions.js",
  entities: [SearchSession, SearchQuery, SearchExecution, RawSearchResult] 
}

// Query to get execution status, if needed for polling by the status page
query getSearchExecutionDetails { 
  fn: import { getSearchExecutionDetails } from "@src/server/serpExecution/queries.js",
  entities: [SearchExecution, SearchQuery]
}
```

**Requirements:**
*   Single API integration (Google Search API via Serper).
*   Basic pagination handling (API-side).
*   Simple progress tracking on the `Search Execution Status Page` for SERP query execution (e.g., queries completed/total).
*   Asynchronous search execution initiation.
*   Raw result storage (`RawSearchResult` entity).
*   Basic error handling displayed on the status page.
*   Upon completion of SERP execution AND signal of initial backend processing (from Results Manager), the user is transitioned to the `Results Overview Page`.

**Extension points for Phase 2:**
*   Multi-API integration.
*   Advanced rate limiting, error recovery.
*   `Search Execution Status Page` enhanced for consolidated SERP + Results Manager processing status.
*   Search execution scheduling.

### 4. Results Management & Overview (`ResultsOverviewPage`)

**Phase 1 Implementation:**

```wasp
// Route for the Results Overview Page
route ResultsOverviewRoute { path: "/results-overview/:sessionId", to: ResultsOverviewPage }
page ResultsOverviewPage {
  authRequired: true,
  component: import { ResultsOverviewPage } from "@src/client/reviewResults/pages/ResultsOverviewPage"
  // Note: Component is in reviewResults as it's for viewing/starting review
}

// Query to get processed results for a session
query getProcessedResultsForSession {
  fn: import { getProcessedResultsForSession } from "@src/server/resultsManager/queries.js", 
  // Server logic for resultsManager handles processing and provides data for this query
  entities: [ProcessedResult, SearchSession]
}

// Action to trigger backend processing (if not fully automatic post-SERP execution)
action processSessionResults {
  fn: import { processSessionResults } from "@src/server/resultsManager/actions.js",
  entities: [RawSearchResult, ProcessedResult, DuplicateRelationship]
}
```

**Requirements:**
*   Backend processing of `RawSearchResult` to `ProcessedResult` (normalization, basic metadata extraction). This is largely a server-side operation post-SERP execution.
*   Display of processed results on the `Results Overview Page` (`/results-overview/:sessionId`).
*   `Results Overview Page` supports filtering (e.g., by tag status after review starts) and sorting.
*   Provides a preview/details of individual results, linking to the `Review Interface Page`.
*   This page is accessed after the `Search Execution Status Page` indicates completion of SERP execution and initial results processing.

**Extension points for Phase 2:**
*   Multi-stage deduplication pipeline.
*   Advanced metadata extraction.
*   Dedicated Admin UIs (`Deduplication Overview Page`, `Processing Status Dashboard Page`).
*   Full-text search within results.

### 5. Results Review (`ResultsOverviewPage`, `ReviewInterfacePage`)

**Phase 1 Implementation:**

```wasp
// ResultsOverviewPage and its query are defined under Results Management
// ReviewInterfacePage for detailed single result review
route ReviewInterfaceRoute { path: "/review/:resultId", to: ReviewInterfacePage }
page ReviewInterfacePage {
  authRequired: true,
  component: import { ReviewInterfacePage } from "@src/client/reviewResults/pages/ReviewInterfacePage"
}

query getReviewTagsForSession {
  fn: import { getReviewTagsForSession } from "@src/server/reviewResults/queries.js",
  entities: [ReviewTag]
}

query getSingleProcessedResultDetails { // For ReviewInterfacePage
  fn: import { getSingleProcessedResultDetails } from "@src/server/reviewResults/queries.js",
  entities: [ProcessedResult, ReviewTagAssignment, ReviewTag, Note]
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
```

**Requirements:**
*   `Results Overview Page`: Lists processed results, allows filtering/sorting, shows review progress, and links to detailed review.
*   `Review Interface Page` (`/review/:resultId`): Allows basic inclusion/exclusion tagging (Include, Exclude, Maybe) for a single result.
*   Requires exclusion reason when tagging as "Exclude".
*   Simple notes system per result on the `Review Interface Page`.
*   PRISMA-compliant workflow (tagging supports screening/eligibility stages).

**Extension points for Phase 2:**
*   Advanced/custom tagging system.
*   Multi-reviewer support, conflict resolution.
*   Full-text annotation tools on `Review Interface Page`.
*   Bulk operations, review analytics.

### 6. Reporting & Export (`ReportingPage`)

**Phase 1 Implementation:**

```wasp
route ReportingRoute { path: "/reporting/:sessionId", to: ReportingPage }
page ReportingPage {
  authRequired: true,
  component: import { ReportingPage } from "@src/client/reporting/pages/ReportingPage"
}

query getReportDataForSession {
  fn: import { getReportDataForSession } from "@src/server/reporting/queries.js",
  entities: [SearchSession, ProcessedResult, ReviewTagAssignment, ReviewTag, SearchQuery, SearchExecution]
}

action exportSessionResults {
  fn: import { exportSessionResults } from "@src/server/reporting/actions.js"
}
```

**Requirements:**
*   Basic PRISMA flow diagram data generation for display on `Reporting Page`.
*   Simple report generation showing key statistics and search parameters.
*   CSV and JSON export of included/excluded results lists.

**Extension points for Phase 2:**
*   Advanced PRISMA visualizations.
*   Custom report templates, PDF export.
*   Interactive dashboards, extended analytics.
*   Reference management integration.

## API Implementation Strategy

For each feature, Phase 1 will implement a simplified version of the API that supports core functionality, using Wasp's operations pattern.

### Example: SERP Execution API

```typescript
// src/server/serpExecution/actions.js
import { executeSearchInBackground } from '../shared/services/googleSearchApi';
import { HttpError } from 'wasp/server';

export const executeSearchQueriesForSession = async ({ sessionId }, context) => {
  if (!context.user) { throw new HttpError(401, "Unauthorized"); }
  const session = await context.entities.SearchSession.findUnique({ where: { id: sessionId }, include: { searchQueries: true } });
  if (!session || session.userId !== context.user.id) { throw new HttpError(403, "Access Denied"); }

  for (const query of session.searchQueries) {
    const execution = await context.entities.SearchExecution.create({
      data: { queryId: query.id, sessionId: session.id, status: 'pending', startTime: new Date() }
    });
    // Trigger background job for individual query execution, e.g.:
    // _executeSingleSearchQueryJob.performAsync({ executionId: execution.id, queryText: query.query, maxResults: query.maxResults });
  }
  return { message: `Search execution started for session ${sessionId}` };
};

// The _executeSingleSearchQueryJob (not shown) would then call the actual API (e.g., Google Search via Serper),
// create RawSearchResult records, and update the SearchExecution status to 'running', 'completed', or 'failed'.

// src/shared/services/googleSearchApi.js (Conceptual update for executeSearchQueriesForSession)
// ... existing code ...
```

```typescript
// src/shared/services/googleSearchApi.js // Path might vary
// ... existing code ...
