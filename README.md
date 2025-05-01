# Thesis Grey

A specialized search application designed to facilitate the discovery and management of grey literature for clinical guideline development.

## Project Overview

Thesis Grey helps researchers create and execute systematic search strategies, process and review search results, and support PRISMA-compliant workflows for literature reviews.

The application follows a phased implementation approach:
- **Phase 1**: Core functionality with a streamlined feature set
- **Phase 2**: Advanced capabilities building on the Phase 1 foundation

## Key Features

- Search strategy building with PICO framework support
- Search execution via Google Search API 
- Results processing and management
- Review interface with tagging and notes
- PRISMA-compliant reporting and exports

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: PostgreSQL
- **Framework**: Wasp (full-stack framework)
- **APIs**: Google Search API via Serper

## Architecture

Thesis Grey follows a Vertical Slice Architecture (VSA) while leveraging Wasp's built-in capabilities:

### Core Layers

- **Domain Layer**: Business entities defined through Prisma schema
- **Application Layer**: Use cases implemented via Wasp actions and queries
- **Infrastructure Layer**: Minimized through Wasp's built-in capabilities:
  - Authentication via Wasp's auth system
  - Database access via Wasp's Prisma integration
  - API layer via Wasp operations
- **Presentation Layer**: React components with Wasp's routing and hooks

### Cross-cutting Concerns

- **Error Handling**: Wasp's HttpError for operation failures
- **Authentication**: Wasp's built-in auth system with JWT
- **Security**: Route protection via Wasp's authRequired property

## Documentation

Detailed documentation can be found in the `project_docs` directory:
- [Phase 1 PRD](project_docs/prd_phase_1.md)
- [Phase 2 PRD](project_docs/prd_phase_2-prd.md)

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