# Thesis Grey

A specialized application for managing grey literature in clinical guideline development. Built with Wasp, a declarative DSL that integrates React, Node.js, and Prisma.

## Project Overview

Thesis Grey helps researchers streamline the workflow for literature search, review, and reporting in the context of clinical guideline development. It leverages the Wasp framework to provide a robust and maintainable application structure.

The application focuses on:
- Efficient search strategy creation and management.
- Execution of searches via external APIs (e.g., Google Search API via Serper).
- Processing, deduplication, and review of search results.
- Generation of reports and statistics, supporting PRISMA-compliant workflows.

## Key Features (Organized by Verticals)

- **Auth**: User authentication and profile management.
- **Search Strategy**: Building and managing search queries and sessions.
- **SERP Execution**: Executing searches via external APIs and managing results.
- **Results Manager**: Processing and normalizing search results, including duplicate detection.
- **Review Results**: Tagging, annotating, and reviewing processed results.
- **Reporting**: Generating PRISMA flow diagrams, statistics, and data exports.

## Tech Stack

- **Framework**: Wasp (full-stack, declarative DSL)
- **Frontend**: React, TypeScript, TailwindCSS
- **Backend**: Node.js (via Wasp), Prisma ORM (via Wasp)
- **Database**: PostgreSQL
- **APIs**: Google Search API (via Serper)

## Architecture

Thesis Grey is built using the Wasp framework and follows a **Vertical Slice Architecture**.
- The `main.wasp` file in the root directory is the central configuration, defining entities, routes, pages, queries, and actions.
- Custom code (React components, server logic) resides in feature-specific directories under `src/client/` and `src/server/`.
- Each feature vertical (e.g., `auth`, `searchStrategy`) typically includes:
  - `pages/`: Page components
  - `components/`: UI components
  - `hooks/`: Custom React hooks
  - `utils/`: Utility functions
  - `types.ts`: TypeScript definitions
  - Server-side `queries.js` and `actions.js` for data operations.

This structure leverages Wasp's capabilities for authentication, database access (Prisma), and client-server communication (Wasp operations), minimizing boilerplate.

## Documentation

Detailed documentation about the project's architecture, features, and conventions can be found in the `project_docs/` directory, particularly under `project_docs/architecture/`.

Key documents include:
- Overview of Thesis Grey and Wasp
- Project Conventions and Rules
- Database, Entities, and Operations
- Authentication Flow
- Frontend and Styling Guidelines

## Development

This project is under active development. See the PRDs for implementation details and roadmap.

### Getting Started

1. **Install Wasp:**
   ```bash
   curl -sSL https://get.wasp-lang.dev/installer.sh | sh
   ```

2. **Start PostgreSQL:**
   ```bash
   wasp db start
   ```

3. **Run migrations:**
   ```bash
   wasp db migrate-dev
   ```

4. **Start the development server:**
   ```bash
   wasp start
   ```

5. Open your browser to `http://localhost:3000`