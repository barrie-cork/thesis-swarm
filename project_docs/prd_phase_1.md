# Thesis Grey: Phase 1 PRD

**Note:** This document outlines feature implementation using Wasp (version `^0.16.0` as specified in `project_docs/1-wasp-overview.md`). For the most up-to-date Wasp API details and general Wasp documentation, **developers should consult the Context7 MCP to fetch the latest Wasp documentation.** For Thesis Grey specific logic, component structure, UI, and detailed workflows, developers **must always refer to the UX/UI plans in the `project_docs/UI_by_feature/` directory, the `project_docs/architecture/workflow.mmd` diagram, and the overall architecture documented in `project_docs/architecture/`.**

## Project Overview

Thesis Grey is a specialised search application designed to facilitate the discovery and management of grey literature for clinical guideline development. The application follows a phased implementation approach where Phase 1 delivers core functionality with a streamlined feature set, establishing the foundation for more advanced capabilities in Phase 2. **Upon successful authentication, users are directed to the `Review Manager Dashboard`. This dashboard serves as the central hub where users can view and manage their existing review sessions or initiate new ones.**

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
│   │   ├── auth/             # Authentication UI components
│   │   ├── reviewManager/    # Review session listing and management (Review Manager Dashboard)
│   │   ├── searchStrategy/   # Search strategy builder components
│   │   ├── serpExecution/    # Search execution components
│   │   ├── resultsManager/   # Results processing components
│   │   ├── reviewResults/    # Review interface components
│   │   ├── reporting/        # Basic reporting components
│   │   └── shared/           # Shared UI components
│   ├── server/               # Server-side code
│   │   ├── auth/             # Authentication logic
│   │   ├── reviewManager/    # Server logic for review session management
│   │   ├── searchStrategy/   # Search strategy logic
│   │   ├── serpExecution/    # Search execution logic
│   │   ├── resultsManager/   # Results processing logic
│   │   ├── reviewResults/    # Review logic
│   │   ├── reporting/        # Reporting logic
│   │   └── shared/           # Shared server utilities
│   └── shared/               # Code shared between client and server
│       ├── types.ts          # TypeScript types
│       └── utils.ts          # Utility functions
├── public/                   # Public assets
└── migrations/               # Database migrations
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
    onAuthFailedRedirectTo: "/login"
  }
}

route RootRoute { path: "/", to: ReviewManagerDashboardPage }
page ReviewManagerDashboardPage {
  authRequired: true,
  component: import { ReviewManagerDashboardPage } from "@src/client/reviewManager/pages/ReviewManagerDashboardPage"
}

route LoginRoute { path: "/login", to: LoginPage }
page LoginPage {
  component: import { LoginPage } from "@src/client/auth/pages/LoginPage"
}

route SignupRoute { path: "/signup", to: SignupPage }
page SignupPage {
  component: import { SignupPage } from "@src/client/auth/pages/SignupPage"
}

route ProfileRoute { path: "/profile", to: ProfilePage }
page ProfilePage {
  authRequired: true,
  component: import { ProfilePage } from "@src/client/auth/pages/ProfilePage"
}
```

**Requirements:**
- User registration and login
- Profile management
- JWT-based authentication
- Basic role-based permissions (Researcher role)
- Integration with Wasp authentication system

**Extension points for Phase 2:**
- Advanced roles and permissions system
- Organization-based access control
- Collaboration features
- Navigation to a centralized `Session Hub Page` for detailed session management.

### 2. Search Strategy Builder

**Phase 1 Implementation:**

```wasp
route SearchStrategyRoute { path: "/search-strategy", to: SearchStrategyPage }
page SearchStrategyPage {
  authRequired: true,
  component: import { SearchStrategyPage } from "@src/client/searchStrategy/pages/SearchStrategyPage"
}

query getSearchSessions {
  fn: import { getSearchSessions } from "@src/server/searchStrategy/queries.js",
  entities: [SearchSession]
}

query getSearchSession {
  fn: import { getSearchSession } from "@src/server/searchStrategy/queries.js",
  entities: [SearchSession, SearchQuery]
}

action createSearchSession {
  fn: import { createSearchSession } from "@src/server/searchStrategy/actions.js",
  entities: [SearchSession]
}

action createSearchQuery {
  fn: import { createSearchQuery } from "@src/server/searchStrategy/actions.js",
  entities: [SearchQuery]
}

action updateSearchQuery {
  fn: import { updateSearchQuery } from "@src/server/searchStrategy/actions.js",
  entities: [SearchQuery]
}
```

**Requirements:**
- Basic concept grouping (Population, Interest, Context)
- Domain selection
- File type filtering
- Simple query generation
- Query preview
- PICO framework support
- Executing searches transitions the user to the `Search Execution Status Page`.

**Extension points for Phase 2:**
- Advanced concept relationships
- Query suggestion system
- Query history and versioning
- Visual query builder
- Template library

### 3. SERP Execution

**Phase 1 Implementation:**

```wasp
// Route for the Search Execution Status Page
route SearchExecutionStatusRoute { path: "/session/:sessionId/status", to: SearchExecutionStatusPage }
page SearchExecutionStatusPage {
  authRequired: true,
  component: import { SearchExecutionStatusPage } from "@src/client/serpExecution/pages/SearchExecutionStatusPage"
}

query getSearchQueries { // This might be used by SearchStrategy or pre-execution checks
  fn: import { getSearchQueries } from "@src/server/serpExecution/queries.js",
  entities: [SearchQuery]
}

query getSearchExecutions {
  fn: import { getSearchExecutions } from "@src/server/serpExecution/queries.js",
  entities: [SearchExecution]
}

action executeSearchQuery {
  fn: import { executeSearchQuery } from "@src/server/serpExecution/actions.js",
  entities: [SearchQuery, SearchExecution, RawSearchResult]
}
```

**Requirements:**
- Single API integration (Google Search API via Serper)
- Basic pagination handling
- Simple progress tracking via the dedicated `Search Execution Status Page`. This page displays the progress of SERP query execution and, upon completion, transitions the user to the `Results Overview Page`.
- Search execution initiation
- Raw result storage
- Basic error handling

**Extension points for Phase 2:**
- Multi-API integration
- Advanced rate limiting and quota management
- Sophisticated error recovery
- Enhanced progress visualization
- Parallel query execution
- Search execution scheduling

### 4. Results Manager

**Phase 1 Implementation:**

```wasp
// Route for the Results Overview Page
route ResultsOverviewRoute { path: "/session/:sessionId/overview", to: ResultsOverviewPage }
page ResultsOverviewPage {
  authRequired: true,
  component: import { ResultsOverviewPage } from "@src/client/resultsManager/pages/ResultsOverviewPage"
}

query getRawResults { // Typically used by the backend processing
  fn: import { getRawResults } from "@src/server/resultsManager/queries.js",
  entities: [RawSearchResult]
}

query getProcessedResults {
  fn: import { getProcessedResults } from "@src/server/resultsManager/queries.js",
  entities: [ProcessedResult]
}

action processSessionResults {
  fn: import { processSessionResults } from "@src/server/resultsManager/actions.js",
  entities: [RawSearchResult, ProcessedResult, DuplicateRelationship]
}
```

**Requirements:**
- Basic result processing and normalization (occurs server-side after SERP execution).
- Simple URL normalization (for consistency, not for deduplication).
- Basic metadata extraction (domain, file type).
- Display of processed results on the `Results Overview Page`, including filtering and sorting.
- Result preview interface on the `Results Overview Page`.
- Storage of search engine source for each result.
- This page is accessed after the `Search Execution Status Page` indicates completion of SERP execution and initial processing.

**Extension points for Phase 2:**
- Multi-stage deduplication pipeline
- Advanced metadata extraction
- Manual duplicate management
- Advanced filtering and categorization
- Full-text search within results

### 5. Review Results

**Phase 1 Implementation:**

```wasp
route ReviewRoute { path: "/review/:sessionId", to: ReviewPage }
page ReviewPage {
  authRequired: true,
  component: import { ReviewPage } from "@src/client/reviewResults/pages/ReviewPage"
}

query getReviewTags {
  fn: import { getReviewTags } from "@src/server/reviewResults/queries.js",
  entities: [ReviewTag]
}

query getResultsWithTags {
  fn: import { getResultsWithTags } from "@src/server/reviewResults/queries.js",
  entities: [ProcessedResult, ReviewTagAssignment, ReviewTag, Note]
}

action createReviewTag {
  fn: import { createReviewTag } from "@src/server/reviewResults/actions.js",
  entities: [ReviewTag]
}

action assignTag {
  fn: import { assignTag } from "@src/server/reviewResults/actions.js",
  entities: [ReviewTagAssignment]
}

action createNote {
  fn: import { createNote } from "@src/server/reviewResults/actions.js",
  entities: [Note]
}
```

**Requirements:**
- Basic inclusion/exclusion tagging
- Simple notes system
- Basic filtering
- Progress tracking
- PRISMA-compliant workflow

**Extension points for Phase 2:**
- Advanced tagging system
- Multi-reviewer support
- Conflict resolution
- Annotation tools
- Bulk operations
- Review analytics

### 6. Reporting & Export

**Phase 1 Implementation:**

```wasp
route ReportingRoute { path: "/reporting/:sessionId", to: ReportingPage }
page ReportingPage {
  authRequired: true,
  component: import { ReportingPage } from "@src/client/reporting/pages/ReportingPage"
}

query getReportData {
  fn: import { getReportData } from "@src/server/reporting/queries.js",
  entities: [SearchSession, ProcessedResult, ReviewTagAssignment, ReviewTag]
}

action exportResults {
  fn: import { exportResults } from "@src/server/reporting/actions.js"
}
```

**Requirements:**
- Basic PRISMA flow diagram
- Simple report generation
- CSV and JSON export
- Basic statistics

**Extension points for Phase 2:**
- Advanced PRISMA visualizations
- Custom report templates
- PDF export
- Interactive dashboards
- Extended analytics
- Reference management integration

## API Implementation Strategy

For each feature, Phase 1 will implement a simplified version of the API that supports core functionality, using Wasp's operations pattern.

### Example: SERP Execution API

```typescript
// src/server/serpExecution/actions.js
import { executeSearchInBackground } from '../shared/services/googleSearchApi';
import { HttpError } from 'wasp/server';

export const executeSearchQuery = async ({ queryId, maxResults = 100 }, context) => {
  if (!context.user) {
    throw new HttpError(401, "Unauthorized");
  }

  try {
    // Fetch the query
    const query = await context.entities.SearchQuery.findUnique({
      where: { id: queryId },
      include: { searchSession: true } // Ensures searchSession is loaded to get sessionId
    });
    
    if (!query) {
      throw new HttpError(404, 'Query not found');
    }
    
    if (query.searchSession.userId !== context.user.id) {
      throw new HttpError(403, "User not authorized for this session's query");
    }
    
    // Create execution record
    const execution = await context.entities.SearchExecution.create({
      data: {
        queryId: query.id,
        sessionId: query.sessionId, // Ensure query.sessionId is available and correct
        status: 'running', // Initial status for the Search Execution Status Page
        startTime: new Date()
        // resultCount will be updated upon completion
      }
    });
    
    // Execute search (single API only in Phase 1)
    // Use Google Search API via Serper
    // This function should not block; it should run in the background.
    // The client will poll or use other mechanisms to get status updates from SearchExecution entity.
    executeSearchInBackground(context.entities, execution.id, query, maxResults);
    
    return {
      executionId: execution.id,
      queryId: query.id,
      status: 'running', // Return initial status
      startTime: execution.startTime
    };
  } catch (error) {
    console.error('Error executing query:', error);
    // Potentially update SearchExecution to 'failed' here if synchronous error before backgrounding
    throw new HttpError(500, 'An unexpected error occurred during search initiation');
  }
};
```

```typescript
// src/shared/services/googleSearchApi.js // Path might vary
// ... existing code ...
