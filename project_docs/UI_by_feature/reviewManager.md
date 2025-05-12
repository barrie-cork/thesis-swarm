# Review Manager Feature: UX and UI Implementation Plan

---
**Phase:** Both (Review Manager Dashboard in P1, evolves to include Session Hub Page in P2)
---

## Overview

The Review Manager serves as the central hub for managing systematic reviews in Thesis Grey. In Phase 1, the `Review Manager Dashboard` (`/review-manager`) is the primary landing page after authentication, providing a comprehensive view of all review sessions and their statuses. In Phase 2, this evolves to include the `Session Hub Page`, offering enhanced features, role-based views, and team collaboration tools for specific sessions.

## Core Requirements

This section outlines the core functional and technical requirements for the Review Manager feature, stratified by development phase. These requirements are derived from the overall project requirements (`project_docs/requirements/core_requirements.md`) and are specific to this feature's UI/UX implementation.

### Phase 1 Requirements (Review Manager Dashboard)

#### Functional Requirements
- **REQ-FR-RMGR-1:** System must provide a `Review Manager Dashboard` (`/review-manager`) as the main landing page after user authentication.
- **REQ-FR-RMGR-2:** The dashboard must display a list of all review sessions owned by the authenticated user.
- **REQ-FR-RMGR-3:** Reviews must be categorized by status (Draft, In Progress, Completed).
- **REQ-FR-RMGR-4:** Each review must be represented by a `Review Card` displaying its name, creation date, status, and progress indicator.
- **REQ-FR-RMGR-5:** System must provide a clear "Create New Review" button/form.
- **REQ-FR-RMGR-6:** Users must be able to navigate from a review card to the appropriate page based on status:
  - Draft reviews -> Search Strategy Page
  - Executing reviews -> Search Execution Status Page
  - Completed reviews -> Results Overview Page

#### Technical Requirements
- **REQ-TR-RMGR-1:** The dashboard must query and display review sessions for the user.
- **REQ-TR-RMGR-2:** Navigation uses Wasp routing.

### Phase 2 Requirements (Session Hub Page Enhancements)

#### Functional Requirements
- **REQ-FR-RMGR-P2-1:** For Phase 2 reviews, selecting a session may navigate to a dedicated `Session Hub Page` (`/session-hub/:sessionId` TBC).
- **REQ-FR-RMGR-P2-2:** The `Session Hub Page` must provide role-based views and navigation (Strategy, Results, Team, Settings, Reporting, Admin tools like Deduplication/Processing Status).
- **REQ-FR-RMGR-P2-3:** The `Search Strategy Page` (or Hub) must support team indicators.
- **REQ-FR-RMGR-P2-4:** Lead Reviewers configure settings via the `Session Hub Page`.
- **REQ-FR-RMGR-P2-5:** Invitation management integrated into the Hub or main dashboard.
- **REQ-FR-RMGR-P2-6:** Advanced filtering/sorting/archiving on the main session list (`Search Strategy Page` or Hub).
- **REQ-FR-RMGR-P2-7:** Session template creation/use.
- **REQ-FR-RMGR-P2-8:** Progress/productivity analytics on the Hub.

#### Technical Requirements
- **REQ-TR-RMGR-P2-1:** `Session Hub Page` renders dynamically based on role/session context.
- **REQ-TR-RMGR-P2-2:** Team/role integration required.
- **REQ-TR-RMGR-P2-3:** Invitation/template actions/queries needed.

## Phase 1 Implementation (Review Manager Dashboard)

---
**Phase:** Phase 1
---

### 1. Review Manager Dashboard Structure

#### Standard Pages & Components:

*   **Review Manager Dashboard (`/review-manager`):**
    *   Main landing page after authentication.
    *   Displays categorized list of user's review sessions.
    *   Mechanism to create new reviews (e.g., inline form or modal triggered by button).
*   **Review Card (Component):**
    *   Compact representation of a review session.
    *   Displays name, creation date, status, progress.
    *   Provides navigation actions based on status.
*   **Create New Review Form (Component/Modal):**
    *   Input fields for review name and description.
    *   Submit button triggers creation and navigates to Search Strategy Page.

#### Workflow & Transitions:

**Workflow (Review Management):**

1.  User logs in and lands on the `Review Manager Dashboard` (`/review-manager`).
2.  User views existing reviews categorized by status (Draft, In Progress, Completed).
3.  User can:
    - Create a new review (navigates to Search Strategy Page)
    - Access a draft review (navigates to Search Strategy Page)
    - Monitor an executing review (navigates to Search Execution Status Page)
    - View completed review results (navigates to Results Overview Page)
4.  All navigation maintains the Review Manager Dashboard as the central hub.

*(Refer to `workflow.mmd` for the visual flow.)*

**Navigation:**

*   **Landing:** `/review-manager` after login.
*   **Create/Draft:** -> `/search-strategy/:sessionId`.
*   **Executing:** -> `/search-execution/:sessionId`.
*   **Completed:** -> `/results-overview/:sessionId`.
*   **All pages have navigation to return to:** `/review-manager`.

#### Role-Based Access (Phase 1):

*   **Researcher, Admin:** Can view, create, and manage their sessions.
*   **User, Reviewer:** Can view sessions they own/are part of, but typically cannot create new sessions (refer to matrix). Navigation follows standard flow.

*(Refer to `project_docs/standards/role_access_matrix.md` for full details.)*

### 2. UI Components

#### Review Manager Dashboard Layout

*   **Header Section:**
    *   User welcome message
    *   Summary statistics (total sessions, sessions in progress, completed sessions)
    *   Primary "Create New Review" button
    *   Optional quick filters (All, In Progress, Completed)

*   **Review Categories Section:**
    *   Tabbed interface for different review states
    *   Empty states for each category when no sessions exist
    *   Sort controls (by date created, name, progress)
    *   Simple toggle for different view modes (card/list)

*   **Review Cards Grid:**
    *   Responsive grid layout adapting to screen size
    *   Card-based design with consistent height/width
    *   Visual status indicators using colour and icons
    *   Hover states revealing additional actions

#### Review Card Component

*   **Default State:**
    *   Review name and truncated description
    *   Creation date and elapsed time
    *   Status badge (Draft, Executing, Ready/Completed)
    *   Progress indicator for In Progress sessions
    *   Primary action button based on status

*   **Hover State:**
    *   Elevation effect or subtle highlight
    *   Reveal of secondary actions (Edit, Delete)
    *   "Continue" button emphasis

*   **Empty State:**
    *   Friendly illustration
    *   Encouraging message to create first session
    *   Direct "Create Session" button

### 3. Interaction Patterns

#### Review Management Workflow

*   **Creating a Review:**
    *   Click prominent "Create New Review" button
    *   Brought to Search Strategy Builder

*   **Continuing a Review:**
    *   Click on In Progress session card
    *   System determines last active stage
    *   Redirect to appropriate page (Strategy Builder, Search Execution, Results Review)

*   **Managing Reviews:**
    *   Hover on card to reveal additional options
    *   Delete with confirmation dialog
    *   Edit basic details without leaving dashboard

#### Review Organisation

*   **Filtering and Sorting:**
    *   Tabs for quick filtering by status
    *   Sort dropdown for ordering by different criteria
    *   Search box for finding specific sessions by name

*   **Visual Categorisation:**
    *   Colour coding by status (blue for draft, amber for in-progress, green for completed)
    *   Clear status labels
    *   Progress indicators showing completion percentage

### 4. Visual Design and Styling Guidelines

This section details the specific visual styling for the Review Manager feature, drawing from the global Thesis Grey UI/UX Style Guide.

#### 4.1. General Dashboard Styling

*   **Page Backgrounds:** Pure White (`#FFFFFF`) for light mode; Dark Charcoal (`#3C3F41`) for dark mode.
*   **Header Section (within Review Manager Dashboard):**
    *   Typography for welcome message and summary statistics: Use H2 (20px, Medium) or Body Text (14px, Regular) as appropriate, with Dark Charcoal (light mode) / White (dark mode) text.
    *   "Create New Review" Button: Primary button styling - Teal (`#6A9CAB`) background, white text.
    *   Filter Controls (Dropdowns, Segmented Buttons for status): Standard Thesis Grey form control styling. Active filters should use a Teal (`#6A9CAB`) accent.
*   **Review Categories Section (Tabs for Draft, Executing, Completed):**
    *   Tabs: Active tab with Teal (`#6A9CAB`) accent (e.g., border-bottom or background highlight), text color Dark Charcoal/White. Inactive tabs with standard text colors on the page/card background.
    *   Empty States: Use a gentle illustration (if designed) and informative text styled as Body Text (14px).
    *   Sort Controls/View Toggles: Standard form control/button styling.

#### 4.2. Review Card Component

*   **Overall Card Styling:** Adheres to the standard `.card` definition from the Thesis Grey Style Guide.
    *   Light Mode: White (`#FFFFFF`) background, subtle shadow, Light Taupe (`#CEC9BC`) border. `border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); padding: 16px;`
    *   Dark Mode: Slate (`#5D6977`) background, darker shadow, darker border (e.g., `#3C3F41`). `background-color: #5D6977; border-color: #3C3F41; box-shadow: 0 2px 8px rgba(0,0,0,0.2);`
*   **Typography within Card:**
    *   Review Name: H3 style (16px, Medium). Dark Charcoal (`#3C3F41`) (light mode) / White (`#FFFFFF`) (dark mode).
    *   Description (truncated): Body Text (14px, Regular).
    *   Creation Date/Elapsed Time: Small/Caption text (12px, Regular). Slate Blue-Gray (`#5D6977`) (light mode) / Light Taupe (`#CEC9BC`) (dark mode).
*   **Status Badges/Indicators:** Small, pill-shaped badges with padding (e.g., `px-2 py-0.5`).
    *   Draft: Slate Blue-Gray (`#5D6977`) background, White (`#FFFFFF`) text.
    *   Executing: Light Teal (`#8BBAC7`) background, Dark Charcoal (`#3C3F41`) or White text (ensure contrast).
    *   Ready/Completed: Teal (`#6A9CAB`) background, White (`#FFFFFF`) text.
*   **Progress Indicator:** A thin horizontal bar. Teal (`#6A9CAB`) fill for progress against a Light Taupe (`#E4E0D5`) (light mode) or Slate (`#4A5662` - a darker variant of Slate for track) (dark mode) track.
*   **Action Buttons on Card (e.g., Continue, View Results, Edit, Delete):**
    *   Primary Action (e.g., "Continue", "View Results"): Styled as a Primary Button (Teal (`#6A9CAB`)).
    *   Secondary/Hover Actions (e.g., "Edit", "Delete"): May use Secondary Button styling (Slate in light mode, Light Taupe in dark mode) or Icon Buttons. For "Delete", consider using an Error Red (`#D64045`) accent (e.g., icon color or border on a secondary button) with a confirmation dialog.
*   **Hover State:** Subtle elevation (increased `box-shadow`) or a Teal (`#6A9CAB`) border highlight on the card.

#### 4.3. Styling for Phase 2 Enhancements

*   **Team/Role Indicators on Cards:** Use Small/Caption text (12px) with secondary text colors (Slate/Light Taupe) or small icons with Teal (`#6A9CAB`) fill. Member avatars, if used, should be circular and consistently sized (e.g., 24x24px).
*   **Review Settings Panel & Team Management Panel (within Session Hub Page):**
    *   These panels should use standard `.card` styling for their container.
    *   Internal elements like forms, input fields (for validation rules, allocation settings), dropdowns, and buttons should follow the global Form Control and Button guidelines from the Thesis Grey Style Guide.
*   **Invitation Dashboard & Invitation Cards:**
    *   Invitation cards should adopt the `.card` styling.
    *   Text content within cards adheres to standard typography.
    *   "Accept" Button: Primary Teal (`#6A9CAB`) button.
    *   "Decline" Button: Secondary Slate/Light Taupe button, or a neutral subtle button.
*   **Advanced Filtering/Search Inputs:** Standard input field styling (White/Light Taupe border in light mode; Slate/darker border in dark mode; Teal focus border).
*   **Analytics Visualizations:** If any simple charts/graphs are displayed on the dashboard (e.g., session counts), they should use the core palette: Teal (`#6A9CAB`) for primary data, Slate Blue-Gray (`#5D6977`) or Light Taupe (`#CEC9BC`) for secondary data or axes.
*   **Admin Controls (within Admin section if separate):** Standard styling for tables, lists, and action buttons as per global guidelines.

#### 4.4. Mode Switching

*   All Review Manager UI components (Dashboard, Cards, Panels, Modals) must fully support the application's light/dark mode switching, utilizing CSS variables or Tailwind's `dark:` prefix as defined in the global style guide.

#### 4.5. Accessibility

*   **Contrast Ratios:** Ensure all text, especially on colored status badges, meets WCAG AA contrast standards in both light and dark modes.
*   **Focus States:** All interactive elements (buttons, tabs, input fields, links on cards) must have a visible focus state using the Teal (`#6A9CAB`) outline.
*   **ARIA Attributes:** Implement appropriate ARIA roles for tabs, cards (as list items if applicable), buttons, and dynamic content regions to ensure screen reader compatibility.
*   **Keyboard Navigation:** The dashboard, including navigating between cards and activating card actions, must be fully keyboard operable.

## Phase 2 Enhancements (Session Hub Page)

---
**Phase:** Phase 2
---

### 1. Session Hub Page Structure & Collaboration

#### Standard Pages & Components:

*   **Session Hub Page (`/session-hub/:sessionId` - TBC):**
    *   Central dashboard for a *specific* Phase 2 session.
    *   Accessed by selecting a Phase 2 session (potentially from the main `/review-manager` list).
    *   Layout dynamically changes based on user's role within *that session* (Lead Reviewer, Reviewer).
    *   Provides navigation to all session-specific tools: Strategy, Results, Team, Settings, Reporting, Admin (Deduplication, Processing Status).
*   **Team Management Panel (Component within Hub):**
*   **Session Settings Panel (Component within Hub):**
*   **Invitation Management (Integrated into Hub or main list):**

#### Workflow & Transitions (Phase 2):

**Workflow:**

1.  User selects a Phase 2 session from the main list (`/review-manager` or a dedicated hub list).
2.  User navigates to the `Session Hub Page` for that session.
3.  The Hub displays relevant information and navigation options based on the user's role (e.g., Lead Reviewer sees settings, team management; Reviewer sees assigned tasks).
4.  User navigates from the Hub to specific tools like `Results Overview Page`, `Reporting Page`, `Deduplication Overview Page`, etc., all within the context of that session.

*(Refer to `workflow.mmd` for the visual flow.)*

**Navigation:**

*   **Access Hub:** From main session list (`/review-manager`) select Phase 2 session -> `/session-hub/:sessionId`.
*   **From Hub:** Links to `/results-overview/:sessionId`, `/reporting/:sessionId`, `/deduplication-overview/:sessionId` (new Phase 2 page), etc.

#### Role-Based Access (Phase 2 Session Hub):

*   Access to the Hub itself depends on being part of the session.
*   *Within* the Hub, displayed components and available actions depend on the user's role (Lead Reviewer vs. Reviewer) for *that specific session*.
*   **Lead Reviewer:** Access to settings, team management, all tool views.
*   **Reviewer:** Access to assigned tasks, results view, team view (read-only), reporting.

*(Refer to `project_docs/standards/role_access_matrix.md` for full details.)*

### 2. Enhanced Session Management (on main list /review-manager)

#### Advanced Filtering and Organisation

* **Advanced Search and Filter:**
  * Filter by team membership
  * Filter by role
  * Search across all session metadata
  * Saved filter presets

* **Organisational Tools:**
  * Tagging/labelling system for sessions
  * Grouping by project or theme
  * Custom sorting options
  * Archiving functionality for completed sessions

#### Session Templates

* **Template Management:**
  * Save sessions as templates
  * Create new sessions from existing templates
  * Organisation-wide template library
  * Template version control

### 3. Analytics (on Session Hub)

* **Session Dashboard Analytics:**
  * Time-to-completion metrics
  * Team productivity visualisation
  * Status change history
  * Bottleneck identification

* **Validation Analytics:**
  * Inter-session agreement metrics
  * Conflict frequency analysis
  * Decision time analysis per session
  * Validation rule effectiveness tracking

* **Progress Tracking:**
  * Detailed breakdown of progress by stage
  * Comparison against target timelines
  * Team member contribution metrics
  * Milestone tracking and notification

### 4. Styling / Implementation Guidelines

*   **Team/Role Indicators on Cards:** Use Small/Caption text (12px) with secondary text colors (Slate/Light Taupe) or small icons with Teal (`#6A9CAB`) fill. Member avatars, if used, should be circular and consistently sized (e.g., 24x24px).
*   **Review Settings Panel & Team Management Panel (within Session Hub Page):**
    *   These panels should use standard `.card` styling for their container.
    *   Internal elements like forms, input fields (for validation rules, allocation settings), dropdowns, and buttons should follow the global Form Control and Button guidelines from the Thesis Grey Style Guide.
*   **Invitation Dashboard & Invitation Cards:**
    *   Invitation cards should adopt the `.card` styling.
    *   Text content within cards adheres to standard typography.
    *   "Accept" Button: Primary Teal (`#6A9CAB`) button.
    *   "Decline" Button: Secondary Slate/Light Taupe button, or a neutral subtle button.
*   **Advanced Filtering/Search Inputs:** Standard input field styling (White/Light Taupe border in light mode; Slate/darker border in dark mode; Teal focus border).
*   **Analytics Visualizations:** If any simple charts/graphs are displayed on the dashboard (e.g., session counts), they should use the core palette: Teal (`#6A9CAB`) for primary data, Slate Blue-Gray (`#5D6977`) or Light Taupe (`#CEC9BC`) for secondary data or axes.
*   **Admin Controls (within Admin section if separate):** Standard styling for tables, lists, and action buttons as per global guidelines.

*   **Mode Switching:**
    *   All Review Manager UI components (Dashboard, Cards, Panels, Modals) must fully support the application's light/dark mode switching, utilizing CSS variables or Tailwind's `dark:` prefix as defined in the global style guide.

*   **Accessibility:**
    *   **Contrast Ratios:** Ensure all text, especially on colored status badges, meets WCAG AA contrast standards in both light and dark modes.
    *   **Focus States:** All interactive elements (buttons, tabs, input fields, links on cards) must have a visible focus state using the Teal (`#6A9CAB`) outline.
    *   **ARIA Attributes:** Implement appropriate ARIA roles for tabs, cards (as list items if applicable), buttons, and dynamic content regions to ensure screen reader compatibility.
    *   **Keyboard Navigation:** The dashboard, including navigating between cards and activating card actions, must be fully keyboard operable.