# Technology Stack Documentation

## Core Technology
- **Wasp** - 0.16.0

## Required Dependencies

### Frontend
- **React** - 18.2.0
  - **Purpose:** UI library for building the user interface
  - **Rationale:** Integrated with Wasp framework, provides component-based architecture
- **TypeScript** - 5.1.6
  - **Purpose:** Type-safe JavaScript for frontend and backend
  - **Rationale:** Enhances code quality and developer experience, required in technical specs
- **TailwindCSS** - 3.3.3
  - **Purpose:** Utility-first CSS framework for styling
  - **Rationale:** Enables rapid UI development with consistent design
- **React Router** - 6.14.2
  - **Purpose:** Client-side routing
  - **Rationale:** Provided by Wasp, handles navigation between pages

### Backend
- **Node.js** - 18.16.1
  - **Purpose:** JavaScript runtime for backend
  - **Rationale:** LTS version compatible with Wasp, stable and well-supported
- **Express** - 4.18.2
  - **Purpose:** Web server framework
  - **Rationale:** Provided by Wasp, handles HTTP requests and routing

### Database
- **PostgreSQL** - 15.3
  - **Purpose:** Relational database system
  - **Rationale:** Required in technical specs, provides robust data storage
- **Prisma** - 5.1.1
  - **Purpose:** ORM for database operations
  - **Rationale:** Required in technical specs, provides type-safe database access

### Authentication
- **JWT** - 9.0.1
  - **Purpose:** Authentication tokens
  - **Rationale:** Required in technical specs, secure authentication mechanism
- **bcryptjs** - 2.4.3
  - **Purpose:** Password hashing
  - **Rationale:** Secure password storage for user authentication

### API Integration
- **Axios** - 1.4.0
  - **Purpose:** HTTP client for API requests
  - **Rationale:** Modern, promise-based HTTP client for making requests to external APIs
- **Serper API Client** - Custom implementation
  - **Purpose:** Integration with Google Search API via Serper
  - **Rationale:** Required for search execution functionality

### Development & Deployment
- **Docker** - 24.0.5
  - **Purpose:** Containerization for production
  - **Rationale:** Required in technical specs, ensures consistent deployment
- **ESLint** - 8.46.0
  - **Purpose:** Code linting
  - **Rationale:** Ensures code quality and consistency
- **Prettier** - 3.0.1
  - **Purpose:** Code formatting
  - **Rationale:** Ensures consistent code style

## Compatibility Matrix
| Dependency | Compatible With | Notes |
|------------|-----------------|-------|
| React 18.2.0 | Wasp 0.16.0, TypeScript 5.1.6 | Core UI library |
| TypeScript 5.1.6 | Wasp 0.16.0, React 18.2.0 | Type system |
| Node.js 18.16.1 | Wasp 0.16.0, Express 4.18.2 | Runtime environment |
| PostgreSQL 15.3 | Prisma 5.1.1 | Database system |
| Prisma 5.1.1 | Wasp 0.16.0, PostgreSQL 15.3 | ORM |
| TailwindCSS 3.3.3 | React 18.2.0 | Styling |
| JWT 9.0.1 | Wasp 0.16.0 | Authentication |
| Docker 24.0.5 | All components | Containerization |

## Version Locking Rationale
- All versions are locked to ensure reproducibility and stability.
- Wasp 0.16.0 is explicitly required in the PRD.
- React 18.2.0 is the latest stable version compatible with Wasp 0.16.0.
- Node.js 18.16.1 is an LTS version compatible with all other dependencies.
- PostgreSQL 15.3 is the latest stable version with long-term support.
- All other dependencies are selected for compatibility with these core components.
