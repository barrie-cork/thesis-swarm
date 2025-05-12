# Thesis Grey: Phase 2 PRD

**Note:** This document outlines feature implementation using Wasp (version `^0.16.0` as specified in `project_docs/1-wasp-overview.md`). For the most up-to-date Wasp API details and general Wasp documentation, **developers should consult the Context7 MCP to fetch the latest Wasp documentation.** For Thesis Grey specific logic, component structure, UI, and detailed workflows, developers **must always refer to the UX/UI plans in the `project_docs/UI_by_feature/` directory, the `project_docs/mermaid.mmd` diagram, and the overall architecture documented in `project_docs/architecture/`.**

## Project Overview

Thesis Grey is a specialised search application designed to facilitate the discovery and management of grey literature for clinical guideline development. Phase 2 builds upon the foundation established in Phase 1, enhancing the application with advanced features, improved user experience, and sophisticated data processing capabilities. **Authenticated users first land on the `Search Strategy Page` (the P1 main dashboard), which lists all their search sessions. For Phase 2 review sessions, selecting a session from this list navigates the user to the `Session Hub Page` for that specific session.** The `Session Hub Page` serves as a central dashboard for managing individual Phase 2 review sessions, offering role-dependent views and navigation to various session-specific functionalities.

This PRD outlines the Phase 2 implementation, which continues to follow Vertical Slice Architecture (VSA) principles while expanding on the core functionality delivered in Phase 1. Phase 2 focuses on advanced features, multi-user collaboration, and sophisticated data processing.

### Project Goals

1. Enhance search capabilities with multi-API integration and advanced query building
2. Implement sophisticated deduplication and metadata extraction
3. Support collaborative review workflows with multiple reviewers
4. Provide advanced reporting and analytics
5. Maintain backward compatibility with Phase 1 data and workflows

## Database Architecture

### Overview

Phase 2 will utilize the same database schema as Phase 1, now leveraging previously unused fields and adding new tables only for truly new functionality. The Prisma ORM integrated with the Wasp framework will continue to provide type-safe database operations.

### New/Enhanced Entities

```prisma
// Enhanced User model with roles
model User {
  // Existing fields from Phase 1...
  
  // New fields for Phase 2
  role              String            @default("researcher") // researcher, reviewer, admin
  organizationId    String?
  organization      Organization?     @relation(fields: [organizationId], references: [id])
  teams             TeamMembership[]
}

// New Organization model
model Organization {
  id                String            @id @default(uuid())
  name              String
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt
  users             User[]
  teams             Team[]
}

// New Team model
model Team {
  id                String            @id @default(uuid())
  name              String
  organizationId    String
  organization      Organization      @relation(fields: [organizationId], references: [id])
  members           TeamMembership[]
  searchSessions    SearchSession[]
}

// New TeamMembership model
model TeamMembership {
  id                String            @id @default(uuid())
  userId            String
  teamId            String
  role              String            // owner, admin, member
  user              User              @relation(fields: [userId], references: [id])
  team              Team              @relation(fields: [teamId], references: [id])
}

// Enhanced SearchSession model
model SearchSession {
  // Existing fields from Phase 1...
  
  // New fields for Phase 2
  teamId            String?
  team              Team?             @relation(fields: [teamId], references: [id])
  isTemplate        Boolean           @default(false)
  parentTemplateId  String?
  parentTemplate    SearchSession?    @relation("SessionTemplate", fields: [parentTemplateId], references: [id])
  derivedSessions   SearchSession[]   @relation("SessionTemplate")
}

// Enhanced SearchQuery model
model SearchQuery {
  // Existing fields from Phase 1...
  
  // New fields for Phase 2
  queryVersion      Int               @default(1)
  parentQueryId     String?
  parentQuery       SearchQuery?      @relation("QueryVersion", fields: [parentQueryId], references: [id])
  derivedQueries    SearchQuery[]     @relation("QueryVersion")
  conceptGroups     ConceptGroup[]
}

// New ConceptGroup model
model ConceptGroup {
  id                String            @id @default(uuid())
  name              String
  type              String            // population, interest, context
  queryId           String
  searchQuery       SearchQuery       @relation(fields: [queryId], references: [id])
  concepts          Concept[]
}

// New Concept model
model Concept {
  id                String            @id @default(uuid())
  term              String
  synonyms          String[]
  groupId           String
  conceptGroup      ConceptGroup      @relation(fields: [groupId], references: [id])
}

// Enhanced SearchExecution model
model SearchExecution {
  // Existing fields from Phase 1...
  
  // New fields for Phase 2
  searchEngine      String            // google, bing, duckduckgo, pubmed
  executionParams   Json              // API-specific parameters
}

// Enhanced ProcessedResult model
model ProcessedResult {
  // Existing fields from Phase 1...
  
  // New fields for Phase 2
  enhancedMetadata  Json              // Additional metadata from Phase 2 extraction
  fullText          String?           // Extracted or cached full text
  reviewAssignments ReviewAssignment[]
}

// Enhanced ReviewAssignment model
model ReviewAssignment {
  // Existing fields from Phase 1...
  
  // New fields for Phase 2
  resultId          String
  status            String            // pending, in_progress, completed
  assignedAt        DateTime          @default(now())
  completedAt       DateTime?
  result            ProcessedResult   @relation(fields: [resultId], references: [id])
}

// New ReviewConflict model
model ReviewConflict {
  id                String            @id @default(uuid())
  resultId          String
  conflictType      String            // tag_conflict, inclusion_conflict
  resolvedBy        String?
  resolvedAt        DateTime?
  reviewers         String[]
  result            ProcessedResult   @relation(fields: [resultId], references: [id])
}

// New ReportTemplate model
model ReportTemplate {
  id                String            @id @default(uuid())
  name              String
  template          Json
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt
  userId            String
  isPublic          Boolean           @default(false)
  user              User              @relation(fields: [userId], references: [id])
}
```

## Project Structure

Phase 2 will maintain the Vertical Slice Architecture (VSA) using the Wasp framework, expanding on the existing features while preserving the cohesive organization around features.

### Enhanced Structure

```
thesis-grey/
├── main.wasp                 # Main Wasp configuration
├── src/
│   ├── client/               # Client-side code
│   │   ├── auth/             # Enhanced authentication UI with roles
│   │   ├── organization/     # New organization management
│   │   ├── team/             # New team collaboration features
│   │   ├── searchStrategy/   # `SearchStrategyPage` (enhanced for P2 templates, history)
│   │   ├── sessionHub/       # `SessionHubPage` specific components/logic
│   │   ├── serpExecution/    # `SearchExecutionStatusPage` (enhanced for multi-API, consolidated status)
│   │   ├── resultsManager/   # Advanced results processing UIs (`DeduplicationOverviewPage`, `ProcessingStatusDashboardPage`)
│   │   ├── reviewResults/    # `ResultsOverviewPage`, `ReviewInterfacePage` (enhanced for collaboration)
│   │   ├── reporting/        # `ReportingPage` (enhanced for P2 templates, exports)
│   │   └── shared/           # Shared UI components
│   ├── server/               # Server-side code
│   │   ├── auth/             # Enhanced authentication with roles
│   │   ├── organization/     # Organization management logic
│   │   ├── team/             # Team collaboration logic
│   │   ├── searchStrategy/   # Advanced search strategy logic
│   │   ├── sessionHub/       # Server logic for SessionHubPage
│   │   ├── serpExecution/    # Multi-API search execution
│   │   ├── resultsManager/   # Advanced deduplication and processing
│   │   ├── reviewResults/    # Collaborative review logic
│   │   ├── reporting/        # Advanced reporting logic
│   │   └── shared/           # Shared server utilities
│   └── shared/               # Code shared between client and server
│       ├── types.ts          # Enhanced TypeScript types
│       └── utils.ts          # Utility functions
├── public/                   # Public assets
└── migrations/               # Database migrations for Phase 2
```

## Tech Stack

Phase 2 will continue to utilize the Wasp full-stack framework while introducing additional technologies to support advanced features:

### Frontend (Enhancements)
- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **TailwindCSS**: Utility-first CSS framework
- **React Query**: Advanced data fetching (provided by Wasp)
- **D3.js**: Advanced data visualizations
- **React PDF**: PDF generation for reports

### Backend (Enhancements)
- **Node.js**: JavaScript runtime
- **Express**: Web server framework (provided by Wasp)
- **Prisma**: ORM for database operations
- **JWT**: Authentication tokens
- **Bull**: Background job processing for search operations
- **NLP libraries**: For text analysis and similarity detection

### Database (Same as Phase 1)
- **PostgreSQL**: Relational database

### DevOps (Enhancements)
- **Docker**: Containerization
- **GitHub Actions**: CI/CD
- **Monitoring**: Performance monitoring with Prometheus

### APIs (Expanded)
- **Google Search API via Serper**: Search execution
- **Bing Search API**: Additional search engine
- **DuckDuckGo Search API**: Additional search engine
- **PubMed API**: Specialized academic search

## Core Requirements by Feature

### 1. Authentication Feature (Enhancements)

```wasp
app ThesisGrey {
  // ...
  wasp: { version: "^0.16.0" }, 
  auth: {
    userEntity: User,
    methods: {
      usernameAndPassword: {},
      google: {}, // Added in Phase 2
    },
    onAuthFailedRedirectTo: "/login",
    onAuthSucceededRedirectTo: "/search-strategy", // Default landing remains Search Strategy Page
    // Roles are now primarily handled at the application/feature level, not directly in Wasp auth config for this version
  }
}

// SearchStrategyPage is the root for authenticated users.
// Its definition is in the searchStrategy feature section of the PRD Phase 1 or main.wasp.

// Admin specific pages might be introduced if needed, access controlled by app logic.
// Example (if an explicit admin dashboard is created):
// route AdminDashboardRoute { path: "/admin-dashboard", to: AdminDashboardPage }
// page AdminDashboardPage {
//   authRequired: true,
//   component: import { AdminDashboardPage } from "@src/client/admin/pages/AdminDashboardPage"
// }
```

**Phase 2 Enhancements:**
*   User roles (Researcher, Reviewer, Lead Reviewer, Admin) defined and managed within the application.
*   Organization-based access control (future enhancement, initial focus on session-level roles).
*   Team collaboration features, managed and accessed via the `Session Hub Page` for specific review sessions.
*   Enhanced security features.
*   OAuth integrations (e.g., Google).
*   Role-based authorization is critical for controlling access to different sections of the `Session Hub Page` and specialized dashboards like `DeduplicationOverviewPage` and `ProcessingStatusDashboardPage`.

### 2. Search Strategy (`SearchStrategyPage` Enhancements)

```wasp
// Existing SearchStrategyPage and related queries/actions from Phase 1 are enhanced.
// New queries and actions for P2 features:
query getSearchStrategyTemplates {
  fn: import { getSearchStrategyTemplates } from "@src/server/searchStrategy/queries.js",
  entities: [SearchSession] // Templates are also SearchSession entities marked as isTemplate
}

action saveSearchStrategyAsTemplate {
  fn: import { saveSearchStrategyAsTemplate } from "@src/server/searchStrategy/actions.js",
  entities: [SearchSession]
}

action createSearchStrategyFromTemplate {
  fn: import { createSearchStrategyFromTemplate } from "@src/server/searchStrategy/actions.js",
  entities: [SearchSession, SearchQuery]
}

// Potentially actions for managing query versions if implemented with explicit version entities
```

**Phase 2 Enhancements (to `Search Strategy Page`):**
*   Advanced concept relationships and operators within the query builder.
*   AI-assisted query suggestions and term expansion.
*   Query history and versioning (within a session context).
*   Visual query builder interface (optional, advanced enhancement).
*   Saving search strategies as templates and creating new strategies from templates.
*   MeSH term integration or other ontology support.
*   Configuration for multiple search APIs (Google, Bing, PubMed, etc.).
*   Executing searches (by Lead Reviewer) transitions to the enhanced Phase 2 `Search Execution Status Page`.

### 3. SERP Execution (`SearchExecutionStatusPage` Enhancements)

```wasp
// SearchExecutionStatusPage route and component definition remains as in P1,
// but its internal logic and display are enhanced.

// executeSearchQueriesForSession action from P1 is enhanced for multi-API
action executeMultiApiSearchQueriesForSession { // Renamed for clarity or use existing one with more params
  fn: import { executeMultiApiSearchQueriesForSession } from "@src/server/serpExecution/actions.js",
  entities: [SearchSession, SearchQuery, SearchExecution, RawSearchResult]
}

// Potentially new actions for scheduling
action scheduleSearchExecution {
  fn: import { scheduleSearchExecution } from "@src/server/serpExecution/actions.js",
  entities: [SearchExecution] // Or a new ScheduledSearch entity
}

// Potentially new queries for scheduler UI or advanced stats
query getScheduledSearches {
  fn: import { getScheduledSearches } from "@src/server/serpExecution/queries.js",
  entities: [/* ScheduledSearchEntity */]
}
```

**Phase 2 Enhancements:**
*   Support for executing searches across multiple APIs (configured on `Search Strategy Page`).
*   Advanced rate limiting and quota management for multiple APIs.
*   Parallel query execution across different search engines where feasible.
*   **`Search Execution Status Page` provides a consolidated, real-time view of both SERP query execution progress AND subsequent results processing stages (from `ResultsManagerService`), including normalization, metadata extraction, and deduplication progress. Upon full completion, users are transitioned to the `Results Overview Page`.**
*   Search execution scheduling (optional advanced feature).
*   More robust error recovery mechanisms for API failures.

### 4. Results Management (Enhancements & New Admin UIs: `DeduplicationOverviewPage`, `ProcessingStatusDashboardPage`)

```wasp
// ResultsOverviewPage route and component definition remains as in P1.
// Its data source (getProcessedResultsForSession) is enhanced by backend processing.

// New routes for P2 Admin UIs (access controlled by app logic for Lead Reviewer/Admin)
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

// New/enhanced queries and actions
query getDeduplicationClusters { // For DeduplicationOverviewPage
  fn: import { getDeduplicationClusters } from "@src/server/resultsManager/queries.js",
  entities: [ProcessedResult, DuplicateRelationship]
}

action resolveDuplicateCluster {
  fn: import { resolveDuplicateCluster } from "@src/server/resultsManager/actions.js",
  entities: [DuplicateRelationship, ProcessedResult]
}

action runAdvancedDeduplication { // Triggers the full P2 pipeline
  fn: import { runAdvancedDeduplication } from "@src/server/resultsManager/actions.js",
  entities: [ProcessedResult, DuplicateRelationship] // And RawSearchResult indirectly
}

query getProcessingPipelineStatus { // For ProcessingStatusDashboardPage
  fn: import { getProcessingPipelineStatus } from "@src/server/resultsManager/queries.js",
  entities: [/* Entities related to logging/monitoring processing stages */]
}
```

**Phase 2 Enhancements:**
*   Advanced metadata extraction (authors, publication dates, etc.) stored in `ProcessedResult.enhancedMetadata`.
*   Multi-stage deduplication pipeline (URL similarity, title, snippet, cross-engine).
*   **Manual duplicate management interface on the `Deduplication Overview Page` for Lead Reviewers.**
*   **Monitoring of processing pipeline via the `Processing Status Dashboard Page` for Lead Reviewers/Admins.**
*   Full-text search within results on the `Results Overview Page`.
*   Advanced filtering and categorization options on the `Results Overview Page`.

### 5. Results Review (`ResultsOverviewPage`, `ReviewInterfacePage` Enhancements)

```wasp
// Existing routes for ResultsOverviewPage and ReviewInterfacePage from P1 are used.
// Their functionalities are enhanced.

// New queries and actions for collaborative review and custom tags
query getReviewAssignmentsForSession { // For multi-reviewer scenarios
  fn: import { getReviewAssignmentsForSession } from "@src/server/reviewResults/queries.js",
  entities: [ReviewAssignment, User, ProcessedResult]
}

query getReviewConflictsForSession { // For conflict resolution
  fn: import { getReviewConflictsForSession } from "@src/server/reviewResults/queries.js",
  entities: [ReviewConflict, ProcessedResult]
}

action assignResultToReviewer {
  fn: import { assignResultToReviewer } from "@src/server/reviewResults/actions.js",
  entities: [ReviewAssignment]
}

action resolveReviewConflict {
  fn: import { resolveReviewConflict } from "@src/server/reviewResults/actions.js",
  entities: [ReviewConflict, ReviewTagAssignment]
}

action createCustomSessionTag {
  fn: import { createCustomSessionTag } from "@src/server/reviewResults/actions.js",
  entities: [ReviewTag] // Tags are session-specific
}

// Action for full-text annotation (conceptual)
action addAnnotationToFullText {
    fn: import { addAnnotationToFullText } from "@src/server/reviewResults/actions.js",
    entities: [/* AnnotationEntity */]
}
```

**Phase 2 Enhancements:**
*   Advanced tagging system with custom, session-specific tags on the `Review Interface Page`.
*   Multi-reviewer support: assigning results, tracking progress (visible on `Results Overview Page` / `Session Hub Page`).
*   Conflict detection and resolution tools (potentially on `Review Interface Page` or a dedicated view linked from `Results Overview Page`).
*   Full-text preview and annotation tools on the `Review Interface Page`.
*   AI-assisted screening suggestions (optional, on `Review Interface Page`).
*   Enhanced review analytics dashboard (potentially part of `Reporting Page` or `Session Hub Page`).

### 6. Reporting & Export (`ReportingPage` Enhancements)

```wasp
// ReportingPage route remains as in P1, but functionality expands.

// New queries and actions for templates and advanced exports
query getReportTemplatesForUser {
  fn: import { getReportTemplatesForUser } from "@src/server/reporting/queries.js",
  entities: [ReportTemplate]
}

action createReportTemplate {
  fn: import { createReportTemplate } from "@src/server/reporting/actions.js",
  entities: [ReportTemplate]
}

action generatePdfReportForSession {
  fn: import { generatePdfReportForSession } from "@src/server/reporting/actions.js" // Likely a complex action
}

action exportResultsInRisFormat {
  fn: import { exportResultsInRisFormat } from "@src/server/reporting/actions.js"
}
```

**Phase 2 Enhancements (to `Reporting Page`):**
*   Advanced PRISMA visualizations.
*   Custom report templates (creation, selection, application).
*   Multiple export formats (PDF, Word - conceptual, RIS).
*   Interactive dashboards for review statistics and analytics.
*   Reference management integration (e.g., RIS export).

### 7. New Feature: Session Hub & Collaboration (`SessionHubPage`)

This feature introduces the `Session Hub Page` as the central coordination point for Phase 2 sessions, leveraging new Organization and Team entities for context if implemented, but primarily focused on session-level roles and collaboration.

```wasp
// Route and Page for the Session Hub - accessed for a specific session
route SessionHubRoute { path: "/session/:sessionId/hub", to: SessionHubPage }
page SessionHubPage {
  authRequired: true,
  component: import { SessionHubPage } from "@src/client/sessionHub/pages/SessionHubPage" // Assuming dedicated feature folder for P2 hub
}

// Queries for Session Hub data
query getSessionHubDetails { // Combines session data, user role for this session, team info if applicable
  fn: import { getSessionHubDetails } from "@src/server/sessionHub/queries.js",
  entities: [SearchSession, User, /* Team, TeamMembership, UserSessionRole */]
}

// Actions related to team management within a session context if not globally managed
action manageSessionTeamMember { // Add, remove, change role for a session
  fn: import { manageSessionTeamMember } from "@src/server/sessionHub/actions.js",
  entities: [/* UserSessionRole or similar linking table */]
}

action updateSessionSettings { // For Lead Reviewer to change session parameters
  fn: import { updateSessionSettings } from "@src/server/sessionHub/actions.js",
  entities: [SearchSession]
}
```

**Requirements for `Session Hub Page`:**
*   **Central Dashboard for a Session:** Accessed from the main `Search Strategy Page` (session list) for Phase 2 sessions.
*   **Role-Based Views:** Dynamically displays content, navigation, and actions based on user's role for *that specific session* (Lead Reviewer, Reviewer).
*   **Navigation Hub:** Links to:
    *   `Search Strategy Page` (for this session: edit for LR, view for Reviewer).
    *   `Results Overview Page`.
    *   `Review Interface Page` (via Results Overview).
    *   `ReportingPage`.
    *   Team Management panel (within Hub, for LR: manage members/roles for this session).
    *   Session Settings panel (within Hub, for LR: e.g., review parameters, deadlines).
    *   Links to `Deduplication Overview Page` and `Processing Status Dashboard Page` (for LR).
*   **Session Status & Overview:** Displays key session information (progress, metrics, team activity).
*   **Action Initiation:** Allows role-appropriate actions (e.g., LR re-executing searches, Reviewer submitting completed work).

## API Implementation Examples

### Example: Multi-API Search Execution

```typescript
// src/server/serpExecution/actions.js
import { executeSearchInBackground } from '../shared/services/searchApi';

export const executeMultiApiSearch = async ({ queryId, engines, maxResults = 100 }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  try {
    // Fetch the query
    const query = await context.entities.SearchQuery.findUnique({
      where: { id: queryId },
      include: { searchSession: true }
    });
    
    if (!query) {
      throw new HttpError(404, 'Query not found');
    }
    
    // Create execution records for each engine
    const executions = [];
    for (const engine of engines) {
      const execution = await context.entities.SearchExecution.create({
        data: {
          queryId: query.id,
          sessionId: query.sessionId,
          status: 'running',
          startTime: new Date(),
          searchEngine: engine,
          executionParams: { maxResults }
        }
      });
      
      executions.push(execution);
      
      // Execute search in parallel for each engine
      executeSearchInBackground(context.entities, execution.id, query, engine, maxResults);
    }
    
    return {
      executions: executions.map(e => ({
        executionId: e.id,
        queryId: query.id,
        engine: e.searchEngine,
        status: e.status,
        startTime: e.startTime
      }))
    };
  } catch (error) {
    console.error('Error executing multi-API search:', error);
    throw new HttpError(500, 'An unexpected error occurred');
  }
};
```

### Example: Advanced Deduplication Pipeline

```typescript
// src/server/resultsManager/actions.js
import { 
  normalizeUrls, 
  calculateTitleSimilarity, 
  calculateSnippetSimilarity,
  crossReferenceResults
} from '../shared/services/deduplication';

export const runDeduplicationPipeline = async ({ sessionId }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  try {
    // Fetch all raw results for the session
    const rawResults = await context.entities.RawSearchResult.findMany({
      where: {
        searchQuery: {
          sessionId
        }
      }
    });
    
    // 1. URL Similarity Analysis
    const urlGroups = normalizeUrls(rawResults);
    
    // 2. Title Similarity Analysis
    const titleGroups = calculateTitleSimilarity(urlGroups);
    
    // 3. Snippet Similarity Analysis
    const snippetGroups = calculateSnippetSimilarity(titleGroups);
    
    // 4. Cross-reference between search engines
    const finalGroups = crossReferenceResults(snippetGroups);
    
    // Process duplicate groups
    let uniqueCount = 0;
    let duplicateCount = 0;
    
    for (const group of finalGroups) {
      if (group.length === 1) {
        // Not a duplicate
        uniqueCount++;
        
        // Create or update processed result
        await processUniqueResult(context.entities, sessionId, group[0]);
      } else {
        // Found duplicates
        duplicateCount += group.length - 1;
        
        // Process duplicate group
        await processDuplicateGroup(context.entities, sessionId, group);
        
        uniqueCount++;
      }
    }
    
    return {
      sessionId,
      totalResults: rawResults.length,
      uniqueResults: uniqueCount,
      duplicateCount,
      status: 'completed'
    };
  } catch (error) {
    console.error('Error running deduplication pipeline:', error);
    throw new HttpError(500, 'An unexpected error occurred');
  }
};

async function processUniqueResult(entities, sessionId, result) {
  // Check if processed result already exists
  let processedResult = await entities.ProcessedResult.findFirst({
    where: {
      rawResultId: result.id
    }
  });
  
  if (!processedResult) {
    // Create processed result
    processedResult = await entities.ProcessedResult.create({
      data: {
        rawResultId: result.id,
        sessionId,
        title: result.title,
        url: result.url,
        snippet: result.snippet,
        metadata: {
          domain: extractDomain(result.url),
          fileType: extractFileType(result.url)
        },
        enhancedMetadata: {
          authors: extractAuthors(result),
          publicationDate: extractDate(result),
          publicationType: classifyPublication(result)
        }
      }
    });
  }
  
  return processedResult;
}

async function processDuplicateGroup(entities, sessionId, group) {
  // Find the best result (highest rank or most complete)
  const primaryResult = findBestResult(group);
  
  // Create or get primary processed result
  const processedResult = await processUniqueResult(entities, sessionId, primaryResult);
  
  // Create duplicate relationships
  for (const result of group) {
    if (result.id !== primaryResult.id) {
      await entities.DuplicateRelationship.create({
        data: {
          primaryResultId: processedResult.id,
          duplicateResultId: result.id,
          similarityScore: calculateSimilarityScore(primaryResult, result),
          duplicateType: determineDuplicateType(primaryResult, result)
        }
      });
    }
  }
  
  return processedResult;
}
```

## Deployment Strategy

Phase 2 will continue to leverage Wasp's deployment capabilities with enhanced infrastructure:

1. **Production Deployment Options**
   - Docker containers with `wasp build` output
   - Fly.io using Wasp's built-in deployment command: `wasp deploy fly`
   - Kubernetes deployment for larger installations
   - Standard Node.js hosting providers using the generated artifacts

2. **Scaling Considerations**
   - Horizontal scaling for API services
   - Database optimization for larger datasets
   - Caching strategies for frequently accessed data
   - Background job processing for resource-intensive operations

## Timeline and Milestones

1. **Organization & Team Management** - 3 weeks
   - Implement organization structure
   - Create team management
   - Configure role-based permissions

2. **Enhanced Search Strategy Builder** - 4 weeks
   - Implement advanced concept relationships
   - Create visual query builder
   - Build template system

3. **Multi-API SERP Execution** - 3 weeks
   - Integrate additional search APIs
   - Implement parallel execution
   - Create scheduling system

4. **Advanced Results Manager** - 4 weeks
   - Build sophisticated deduplication pipeline
   - Implement advanced metadata extraction
   - Create manual duplicate management

5. **Collaborative Review System** - 3 weeks
   - Implement multi-reviewer support
   - Create conflict resolution tools
   - Build annotation system

6. **Advanced Reporting & Export** - 3 weeks
   - Create custom report templates
   - Implement multiple export formats
   - Build interactive dashboards

7. **Testing & Refinement** - 2 weeks
   - Comprehensive testing
   - Performance optimization
   - Bug fixes and refinements

**Total Duration: 22 weeks (5.5 months)**

## Migration Strategy from Phase 1

A key consideration for Phase 2 is ensuring a smooth transition from Phase 1:

1. **Database Migration**
   - Run migration scripts to add new tables and fields
   - Preserve all existing data
   - Backfill computed fields where possible

2. **Feature Transition**
   - Ensure all Phase 1 features continue to work
   - Gradually introduce new features without disrupting existing workflows
   - Provide clear documentation and guidance for new capabilities

3. **User Experience**
   - Maintain consistent UI patterns between phases
   - Introduce progressive disclosure for advanced features
   - Provide tutorials and tooltips for new functionality

## Success Criteria

1. All Phase 1 functionality continues to work seamlessly
2. Multi-API search and advanced deduplication significantly improve result quality
3. Team collaboration features enable effective multi-user workflows
4. Advanced reporting provides actionable insights
5. System performance remains strong with larger datasets
6. User satisfaction increases with new capabilities

## Risks and Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Migration complexity | High | Medium | Thorough testing and rollback capability |
| API integration challenges | Medium | Medium | Modular design with fallback options |
| Performance with large datasets | High | Medium | Performance profiling and optimization |
| User learning curve | Medium | High | Progressive disclosure and user guidance |
| Scope creep | Medium | High | Strict feature prioritization and phased rollout |
| Framework limitations | Medium | Low | Custom implementations for critical features if needed |

## Future Directions (Beyond Phase 2)

After completing Phase 2, potential future directions include:

1. **AI Integration**
   - Machine learning for result classification
   - Natural language processing for content analysis
   - Predictive suggestions for search queries

2. **Extended Integrations**
   - Reference management systems
   - Clinical guideline authoring tools
   - Institutional repositories

3. **Advanced Collaboration**
   - Real-time collaborative review
   - Enhanced commentary and discussion
   - External stakeholder input

4. **Custom Domains**
   - Domain-specific search templates
   - Specialized metadata extraction
   - Field-specific reporting templates

The Phase 2 implementation builds upon the solid foundation established in Phase 1, delivering a comprehensive, enterprise-grade application for systematic literature review that supports collaborative research workflows and sophisticated data processing.
