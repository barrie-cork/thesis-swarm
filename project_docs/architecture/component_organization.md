# Component Organization in Thesis Grey

This document outlines the component organization structure implemented in the Thesis Grey project, following the principles of Vertical Slice Architecture (VSA).

## Overview

Thesis Grey organizes code by feature rather than by technical layer, with each feature containing its own set of pages, components, hooks, and utilities. This approach enhances code cohesion and makes the codebase easier to navigate and maintain.

## Directory Structure

Each feature follows a standardized internal structure:

```
feature/
├── pages/           # Page components that correspond to routes
├── components/      # UI components specific to this feature
├── hooks/           # Custom React hooks for this feature
├── utils/           # Utility functions specific to this feature
└── types.ts         # Type definitions specific to this feature
```

## Feature Modules

The application is organized into the following feature modules:

1. **auth**: Authentication and user profile management
   - Login, signup, and profile pages
   - Authentication-specific components

2. **home**: Homepage and landing page
   - Homepage with feature overview
   - Feature navigation cards

3. **searchStrategy**: Search session and query management
   - Session creation and management
   - Query building interface

4. **serpExecution**: Search execution against external APIs
   - Search execution interface
   - Progress tracking

5. **resultsManager**: Results processing and management
   - Results display and filtering
   - Duplicate detection

6. **reviewResults**: Review workflow with tagging
   - Tagging interface
   - Note-taking functionality

7. **reporting**: PRISMA flow diagrams and exports
   - Report generation
   - Data export functionality

Additionally, there is a `shared` directory for truly cross-cutting components:

```
shared/
└── components/      # Components used across multiple features
    └── MainLayout.tsx  # Main application layout
```

## Component Types

### Pages

Page components are the top-level components that correspond to routes defined in `main.wasp`. They:
- Focus on composition rather than implementation
- Use hooks for data fetching and state management
- Delegate UI rendering to smaller components

Example page component:
```tsx
// src/client/searchStrategy/pages/SearchStrategyPage.tsx
import React from 'react';
import { CreateSessionForm } from '../components/CreateSessionForm';
import { SearchSessionList } from '../components/SearchSessionList';
import { useSearchSessions } from '../hooks/useSearchSessions';

export function SearchStrategyPage() {
  const {
    sessions,
    isLoading,
    error,
    isCreating,
    setIsCreating,
    createSession
  } = useSearchSessions();
  
  // Page composition pattern
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Search Strategy</h1>
      
      <div className="mb-6">
        {!isCreating ? (
          <button onClick={() => setIsCreating(true)}>
            Create New Session
          </button>
        ) : (
          <CreateSessionForm 
            onCreateSession={createSession}
            onCancel={() => setIsCreating(false)}
          />
        )}
      </div>
      
      <SearchSessionList sessions={sessions || []} />
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
  onCreateSession: (name: string) => Promise<void>;
  onCancel: () => void;
}

export function CreateSessionForm({ onCreateSession, onCancel }: CreateSessionFormProps) {
  const [newSessionName, setNewSessionName] = useState('');

  const handleSubmit = async () => {
    if (!newSessionName.trim()) return;
    await onCreateSession(newSessionName);
    setNewSessionName('');
  };

  return (
    <div className="flex flex-col space-y-2">
      <input
        type="text"
        value={newSessionName}
        onChange={(e) => setNewSessionName(e.target.value)}
        placeholder="Session name"
      />
      <div className="flex space-x-2">
        <button onClick={handleSubmit}>Save</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
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
import { useState } from 'react';
import { useQuery } from 'wasp/client/operations';
import { getSearchSessions } from 'wasp/client/operations';

export function useSearchSessions() {
  const [isCreating, setIsCreating] = useState(false);
  
  const { 
    data: sessions, 
    isLoading, 
    error, 
    refetch 
  } = useQuery(getSearchSessions);

  const handleCreateSession = async (name: string) => {
    if (!name.trim()) return;
    
    try {
      // This would be replaced with the actual createSearchSession action
      // await createSearchSession({ name });
      setIsCreating(false);
      refetch();
    } catch (error) {
      console.error('Failed to create session:', error);
      throw error;
    }
  };

  return {
    sessions,
    isLoading,
    error,
    isCreating,
    setIsCreating,
    createSession: handleCreateSession,
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