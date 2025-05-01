# Feature Implementation Details

This document provides an overview of how each core feature of Thesis Grey is implemented using the Wasp framework.

## 1. Authentication Feature

The authentication feature is implemented using Wasp's built-in authentication system.

### Configuration in main.wasp
```wasp
auth: {
  userEntity: User,
  methods: {
    usernameAndPassword: {},
  },
  onAuthFailedRedirectTo: "/login"
}

route LoginRoute { path: "/login", to: LoginPage }
route SignupRoute { path: "/signup", to: SignupPage }
route ProfileRoute { path: "/profile", to: ProfilePage }

page LoginPage {
  component: import { LoginPage } from "@src/client/auth/pages/LoginPage"
}

page SignupPage {
  component: import { SignupPage } from "@src/client/auth/pages/SignupPage"
}

page ProfilePage {
  authRequired: true,
  component: import { ProfilePage } from "@src/client/auth/pages/ProfilePage"
}
```

### Client Implementation
The client-side implementation uses Wasp's pre-built components and hooks:

```tsx
// LoginPage.tsx
import { LoginForm } from 'wasp/client/auth';

export function LoginPage() {
  return (
    <div className="container">
      <h1>Login</h1>
      <LoginForm />
    </div>
  );
}

// ProfilePage.tsx - Using useAuth hook
import { useAuth, logout } from 'wasp/client/auth';

export function ProfilePage() {
  const { data: user } = useAuth();
  
  return (
    <div>
      <h1>Profile</h1>
      <p>Username: {user?.username}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Authorization in Operations
Authorization is enforced in every operation:

```typescript
// Example from a query
export const getSearchSession = async ({ id }, context) => {
  if (!context.user) {
    throw new HttpError(401, "Unauthorized");
  }
  
  const session = await context.entities.SearchSession.findUnique({
    where: { id }
  });
  
  if (session.userId !== context.user.id) {
    throw new HttpError(403, "You don't have access to this session");
  }
  
  return session;
};
```

## 2. Search Strategy Builder

The search strategy builder allows users to create and manage search sessions and queries.

### Configuration in main.wasp
```wasp
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

### Implementation Highlights

1. **Session Management**
   - User-specific sessions
   - CRUD operations with automatic authorization checks

2. **Query Building**
   - PICO framework support (Population, Interest, Context)
   - Query preview functionality
   - Domain and file type filtering

3. **Client Implementation**
   ```tsx
   // Using Wasp's query hooks
   const { data: sessions, isLoading } = useQuery(getSearchSessions);
   
   // Creating a session
   const handleCreateSession = async () => {
     try {
       await createSearchSession({ name: sessionName, description });
       refetch();
     } catch (error) {
       console.error("Failed to create session:", error);
     }
   };
   ```

## 3. SERP Execution

The SERP execution feature handles the running of search queries against external APIs.

### Configuration in main.wasp
```wasp
query getSearchQueries {
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

### Implementation Highlights

1. **Query Execution**
   - Integration with Google Search API via Serper
   - Asynchronous execution to handle long-running operations
   - Progress tracking

2. **Error Handling**
   - Robust error handling for API failures
   - Status updates for failed executions

3. **Server Implementation**
   ```typescript
   // In src/server/serpExecution/actions.js
   export const executeSearchQuery = async ({ queryId, maxResults = 100 }, context) => {
     if (!context.user) {
       throw new HttpError(401, "Unauthorized");
     }
     
     // Create execution record
     const execution = await context.entities.SearchExecution.create({
       data: {
         queryId,
         sessionId: query.sessionId,
         status: 'running',
         startTime: new Date()
       }
     });
     
     // Execute search in background
     executeSearch(context.entities, execution.id, query, maxResults);
     
     return { executionId: execution.id, status: 'running' };
   };
   
   // Helper function for search execution
   async function executeSearch(entities, executionId, query, maxResults) {
     try {
       // Call Google Search API via Serper
       const results = await searchGoogle(query.query, maxResults);
       
       // Store results
       for (const result of results) {
         await entities.RawSearchResult.create({
           data: {
             queryId: query.id,
             title: result.title,
             url: result.link,
             snippet: result.snippet,
             rank: result.position,
             searchEngine: 'google',
             rawResponse: result
           }
         });
       }
       
       // Update execution status
       await entities.SearchExecution.update({
         where: { id: executionId },
         data: { status: 'completed', endTime: new Date() }
       });
     } catch (error) {
       // Handle errors
       await entities.SearchExecution.update({
         where: { id: executionId },
         data: { status: 'failed', error: error.message }
       });
     }
   }
   ```

## 4. Results Manager

The results manager processes raw search results into normalized entries and handles duplicate detection.

### Configuration in main.wasp
```wasp
query getRawResults {
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

### Implementation Highlights

1. **Result Processing**
   - URL normalization for consistency
   - Metadata extraction (domain, file type)
   - Basic duplicate detection based on normalized URLs

2. **Client Implementation**
   ```tsx
   // Fetch raw and processed results
   const rawResultsQuery = useQuery(getRawResults, { sessionId });
   const processedResultsQuery = useQuery(getProcessedResults, { sessionId });
   
   // Process results
   const handleProcessResults = async () => {
     try {
       setIsProcessing(true);
       const result = await processSessionResults({ sessionId });
       // Refresh data
       rawResultsQuery.refetch();
       processedResultsQuery.refetch();
     } catch (error) {
       console.error("Failed to process results:", error);
     } finally {
       setIsProcessing(false);
     }
   };
   ```

3. **Server Implementation**
   ```typescript
   // URL normalization
   function normalizeUrl(url) {
     let normalized = url.trim().toLowerCase();
     normalized = normalized.replace(/^https?:\/\//, '');
     normalized = normalized.replace(/^www\./, '');
     normalized = normalized.replace(/\/$/, '');
     return normalized;
   }
   
   // Duplicate detection
   async function findDuplicates(context, newResult, duplicateRelationships) {
     const normalizedUrl = normalizeUrl(newResult.url);
     
     const potentialDuplicates = await context.entities.ProcessedResult.findMany({
       where: {
         url: normalizedUrl,
         id: { not: newResult.id }
       }
     });
     
     for (const duplicate of potentialDuplicates) {
       await context.entities.DuplicateRelationship.create({
         data: {
           primaryResultId: duplicate.id < newResult.id ? duplicate.id : newResult.id,
           duplicateResultId: duplicate.id < newResult.id ? newResult.id : duplicate.id,
           similarityScore: 1.0,
           duplicateType: 'url_match'
         }
       });
     }
   }
   ```

## 5. Review Results

The review interface allows users to tag and annotate processed results.

### Configuration in main.wasp
```wasp
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

### Implementation Highlights

1. **Tag Management**
   - Create custom tags with colors
   - Apply tags to search results
   - Filter results by tag

2. **Note Taking**
   - Add notes to search results
   - View notes chronologically

3. **Client Implementation**
   ```tsx
   // Fetch tags and results
   const tagsQuery = useQuery(getReviewTags, { sessionId });
   const resultsQuery = useQuery(getResultsWithTags, {
     sessionId,
     tagId: selectedTagId,
     untaggedOnly,
     page: currentPage
   });
   
   // Assign tag to result
   const handleAssignTag = async (resultId, tagId) => {
     try {
       await assignTag({ resultId, tagId });
       resultsQuery.refetch();
     } catch (error) {
       console.error("Failed to assign tag:", error);
     }
   };
   ```

## 6. Reporting & Export

The reporting feature generates statistics and exports results in various formats.

### Configuration in main.wasp
```wasp
query getReportData {
  fn: import { getReportData } from "@src/server/reporting/queries.js",
  entities: [SearchSession, ProcessedResult, ReviewTagAssignment, ReviewTag]
}

action exportResults {
  fn: import { exportResults } from "@src/server/reporting/actions.js"
}
```

### Implementation Highlights

1. **PRISMA Flow Diagram**
   - Visual representation of the review workflow
   - Statistics for each stage of the process

2. **Result Export**
   - Export to CSV and JSON formats
   - Filter exports by tag
   - Include metadata and annotations

3. **Server Implementation**
   ```typescript
   // Generate report data
   export const getReportData = async ({ sessionId }, context) => {
     // Gather statistics
     const rawResultsCount = await context.entities.RawSearchResult.count({...});
     const processedResultsCount = await context.entities.ProcessedResult.count({...});
     const taggedResultsCount = await context.entities.ProcessedResult.count({...});
     
     return {
       summary: {
         name: session.name,
         queriesCount: session.searchQueries.length,
         rawResultsCount,
         processedResultsCount,
         taggedResultsCount,
         // ... other stats
       },
       tags: tagCounts,
       fileTypes: fileTypeCounts
     };
   };
   
   // Export functionality
   export const exportResults = async ({ sessionId, format, tagId }, context) => {
     // Get filtered results
     const results = await context.entities.ProcessedResult.findMany({...});
     
     // Format for export
     const formattedResults = results.map(result => ({
       title: result.title,
       url: result.url,
       tags: result.reviewTags.map(rt => rt.tag.name).join(', '),
       // ... other fields
     }));
     
     // Generate CSV or JSON
     switch (format) {
       case 'csv':
         return { format: 'csv', content: generateCSV(formattedResults) };
       case 'json':
         return { format: 'json', content: JSON.stringify(formattedResults) };
     }
   };
   ```

## Conclusion

Each feature implementation follows the same pattern of defining operations in `main.wasp` and implementing them in the corresponding server and client files. This consistent approach, combined with Wasp's built-in capabilities, results in a clean, maintainable codebase that focuses on business logic rather than infrastructure concerns. 