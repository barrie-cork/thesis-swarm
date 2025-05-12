# Component Organization in Thesis Grey

This document outlines the component organization structure implemented in the Thesis Grey project, following the principles of Vertical Slice Architecture (VSA).

## Overview

Thesis Grey organizes code by feature rather than by technical layer, with each feature containing its own set of pages, components, hooks, and utilities. This approach enhances code cohesion and makes the codebase easier to navigate and maintain.

## Directory Structure

Each feature follows a standardized internal structure:

```
src/client/{featureName}/
├── pages/           # Page components that correspond to routes (e.g., SearchStrategyPage.tsx)
├── components/      # UI components specific to this feature (e.g., SearchSessionCard.tsx)
├── hooks/           # Custom React hooks for this feature (e.g., useSearchSessions.ts)
├── utils/           # Utility functions specific to this feature
└── types.ts         # Type definitions specific to this feature
```

## Feature Modules

The application is organized into the following feature modules:

1.  **auth**: Authentication and user profile management.
    *   Handles `LoginPage`, `SignupPage`, `UserProfilePage`.
    *   Contains auth-specific components and hooks.

2.  **reviewManager**: Central review management and navigation hub.
    *   Serves as the main landing page after authentication via the `Review Manager Dashboard`.
    *   Displays all review sessions categorized by status (Draft, In Progress, Completed).
    *   Provides navigation to appropriate feature pages based on review status.
    *   Components include:
        - `ReviewSessionCard`: Displays individual review session details
        - `ReviewSessionList`: Lists all review sessions with filtering and sorting
        - `CreateReviewForm`: Form for creating new reviews
        - `StatusFilter`: Filter reviews by status
        - `ReviewActionButtons`: Context-aware navigation buttons

3.  **searchStrategy**: Search session and query management.
    *   Accessed from the Review Manager Dashboard when creating a new review or accessing a draft review.
    *   Provides the strategy building interface (PIC framework, query configuration).

4.  **serpExecution**: Search execution against external APIs and status monitoring.
    *   Serves the `Search Execution Status Page`, which displays progress for SERP query execution (Phase 1) and, in Phase 2, consolidates this with results processing status.

5.  **resultsManager**: Backend processing of results and, in Phase 2, UIs for managing this process.
    *   Phase 1: Primarily backend logic with status integrated into `Search Execution Status Page`.
    *   Phase 2: Includes `Deduplication Overview Page` and `Processing Status Dashboard` for Lead Reviewers/Admins.

6.  **reviewResults**: Viewing, tagging, and annotating search results.
    *   Serves the `Results Overview Page` (listing results, filtering, quick actions) and the `Review Interface Page` (detailed view and tagging for a single result).

7.  **reporting**: PRISMA flow diagrams and data exports.
    *   Serves the `Reporting Page`.

8.  **sessionHub (Phase 2)**: Provides a centralized view and navigation for a specific active Phase 2 session.
    *   Serves the `Session Hub Page`, offering role-dependent views and navigation to various tools like strategy, results, team management, settings, and admin dashboards for that session.

Additionally, there is a `shared` directory for truly cross-cutting components:

```
src/client/shared/
└── components/      # Components used across multiple features (e.g., MainLayout.tsx)
    └── MainLayout.tsx
```

## Component Types

### Pages

Page components are the top-level components that correspond to routes defined in `main.wasp`. **Examples include `ReviewManagerPage` (central landing page), `SearchStrategyPage`, `SearchExecutionStatusPage`, `ResultsOverviewPage`, `ReviewInterfacePage`, `ReportingPage`, and the Phase 2 `SessionHubPage`.** They:
- Focus on composition rather than implementation
- Use hooks for data fetching and state management
- Delegate UI rendering to smaller components

Example page component:
```tsx
// src/client/reviewManager/pages/ReviewManagerPage.tsx
import React from 'react';
import { useQuery } from 'wasp/client/operations';
import { getReviewSessions } from 'wasp/client/operations';
import { ReviewSessionList } from '../components/ReviewSessionList';
import { CreateReviewForm } from '../components/CreateReviewForm';
import { StatusFilter } from '../components/StatusFilter';
import { useAuth } from 'wasp/client/auth';

export function ReviewManagerPage() {
  const { data: user } = useAuth();
  const [selectedStatus, setSelectedStatus] = React.useState<'all' | 'draft' | 'executing' | 'completed'>('all');
  const { data: sessions, isLoading, error } = useQuery(getReviewSessions);
  const [showCreateForm, setShowCreateForm] = React.useState(false);

  if (isLoading) return <div>Loading reviews...</div>;
  if (error) return <div>Error loading reviews: {error.message}</div>;

  const filteredSessions = sessions?.filter(session => 
    selectedStatus === 'all' ? true : session.status === selectedStatus
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Review Manager</h1>
        <button 
          onClick={() => setShowCreateForm(true)} 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create New Review
        </button>
      </div>

      <StatusFilter 
        selectedStatus={selectedStatus} 
        onStatusChange={setSelectedStatus} 
      />

      {showCreateForm && (
        <CreateReviewForm 
          onCreateReview={async (name, description) => {
            // Handle review creation
            setShowCreateForm(false);
          }}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      <ReviewSessionList 
        sessions={filteredSessions || []} 
      />
    </div>
  );
}
```

Example component:
```tsx
// src/client/reviewManager/components/ReviewSessionCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReviewSession } from '../types';

interface ReviewSessionCardProps {
  session: ReviewSession;
}

export function ReviewSessionCard({ session }: ReviewSessionCardProps) {
  const navigate = useNavigate();

  const getNavigationPath = () => {
    switch (session.status) {
      case 'draft':
        return `/search-strategy/${session.id}`;
      case 'executing':
        return `/search-execution/${session.id}`;
      case 'completed':
        return `/results-overview/${session.id}`;
      default:
        return `/search-strategy/${session.id}`;
    }
  };

  return (
    <div className="p-4 border rounded-lg mb-4 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-medium">{session.name}</h3>
      <p className="text-gray-600 mt-1">{session.description || 'No description'}</p>
      <div className="mt-4 flex justify-between items-center">
        <span className={`px-2 py-1 rounded text-sm ${
          session.status === 'draft' ? 'bg-gray-200' :
          session.status === 'executing' ? 'bg-blue-200' :
          'bg-green-200'
        }`}>
          {session.status}
        </span>
        <button
          onClick={() => navigate(getNavigationPath())}
          className="text-blue-600 hover:text-blue-800"
        >
          {session.status === 'draft' ? 'Edit Strategy' :
           session.status === 'executing' ? 'View Progress' :
           'View Results'}
        </button>
      </div>
    </div>
  );
}
```

### Components

Components are reusable UI elements specific to a feature. They:
- Encapsulate a specific piece of UI functionality
- Accept props for configuration
- Maintain their own internal state when needed

Example component:
```tsx
// src/client/searchStrategy/components/CreateSessionForm.tsx
import React, { useState } from 'react';

interface CreateSessionFormProps {
  onCreateSession: (name: string, description: string) => Promise<void>;
  onCancel: () => void;
}

export function CreateSessionForm({ onCreateSession, onCancel }: CreateSessionFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await onCreateSession(name, description);
    setName('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg mb-6">
      <div className="mb-4">
        <label htmlFor="sessionName" className="block text-sm font-medium text-gray-700">Session Name*</label>
        <input
          id="sessionName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="sessionDescription" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="sessionDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div className="flex space-x-2">
        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Save Session</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
      </div>
    </form>
  );
}
```

### Hooks

Custom hooks encapsulate reusable logic specific to a feature. They:
- Abstract away data fetching, state management, and side effects
- Return data and functions for use by components
- Follow the React hooks naming convention (use*)

Example hook:
```tsx
// src/client/searchStrategy/hooks/useSearchSessions.ts
import { useState, useCallback } from 'react';
import { useQuery, useAction } from 'wasp/client/operations';
import { getSearchSessions, createSearchSession } from 'wasp/client/operations'; // Assuming createSearchSession is an action
import type { SearchSession } from 'wasp/entities';

export function useSearchSessions(userId?: string) { // userId might be optional or handled by Wasp context
  const [selectedSession, setSelectedSession] = useState<SearchSession | null>(null);

  const { 
    data: sessions, 
    isLoading, 
    error, 
    refetch 
  } = useQuery(getSearchSessions, undefined, { enabled: !!userId }); // Fetch only if userId is available

  const createSearchSessionAction = useAction(createSearchSession);

  const handleCreateSession = useCallback(async (name: string, description: string) => {
    if (!name.trim()) return;
    try {
      await createSearchSessionAction({ name, description });
      refetch(); // Refetch the list of sessions after creation
    } catch (err: any) {
      console.error('Failed to create session:', err.message || err);
      // Potentially rethrow or handle error state in UI
    }
  }, [createSearchSessionAction, refetch]);

  return {
    sessions,
    isLoading,
    error,
    selectedSession,
    selectSession: setSelectedSession, // Function to update selected session
    createSession: handleCreateSession,
    refetchSessions: refetch,
  };
}
```

### Types

Type definitions specific to a feature are placed in a `types.ts` file at the root of the feature directory:

```typescript
// src/client/resultsManager/types.ts
import { ProcessedResult } from 'wasp/entities';

export interface FilterState {
  searchTerm: string;
  sortBy: 'relevance' | 'title' | 'date';
  sortOrder: 'asc' | 'desc';
  domains: string[];
  fileTypes: string[];
}
```

## Benefits of This Organization

1. **Improved maintainability**: Components are clearly separated by responsibility
2. **Better discoverability**: Developers can quickly find the right component by purpose
3. **Easier testing**: Components can be tested in isolation
4. **Simplified refactoring**: Changes to one component won't affect unrelated code
5. **Cleaner page components**: Page components now focus on composition rather than implementation details

## Best Practices

- **Keep pages focused on composition**: Pages should focus on layout and composition of components
- **Extract reusable UI elements**: Any UI element used more than once should be extracted to a component
- **Use hooks for logic**: Complex logic should be extracted to hooks
- **Name components consistently**: Use descriptive names that reflect the component's purpose
- **Prefer small, focused components**: Each component should have a single responsibility
- **Use proper typing**: Use TypeScript interfaces for component props and hook return types 