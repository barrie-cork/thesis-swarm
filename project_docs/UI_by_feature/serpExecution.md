# Search Execution Feature: UX and UI Implementation Plan

---
**Phase:** Both (Core execution/status in Phase 1, consolidated status/multi-API in Phase 2)
---

## Overview

The Search Execution feature handles the process of running the defined search strategies against external APIs (initially Google Search via Serper) and monitoring the progress. The `Search Execution Status Page` can be accessed either from the Review Manager Dashboard (for reviews in the executing state) or automatically after initiating execution from the `Search Strategy Page`. Phase 1 focuses on executing the search and displaying SERP query progress. Phase 2 enhances this page to show consolidated status including subsequent results processing and adds multi-API support.

## Core Requirements

This section outlines the core functional and technical requirements for the Search Execution feature, stratified by development phase. These requirements are derived from the overall project requirements (`project_docs/requirements/core_requirements.md`) and are specific to this feature's UI/UX implementation.

### Phase 1 Requirements

#### Functional Requirements
- **REQ-FR-SERP-1:** Integrate with Google Search API (Serper).
- **REQ-FR-SERP-2:** Handle result pagination from API.
- **REQ-FR-SERP-3:** Provide a `Search Execution Status Page` (`/search-execution/:sessionId`) displaying simple progress for SERP query execution (e.g., number of queries complete/remaining).
- **REQ-FR-SERP-4:** Store raw results (`RawSearchResult` entity).
- **REQ-FR-SERP-5:** Implement basic error handling and display messages on the status page.
- **REQ-FR-SERP-6:** Respect max results parameter from the strategy.
- **REQ-FR-SERP-7:** Transition from `Search Execution Status Page` to `Results Overview Page` upon completion of SERP execution *and* initial backend processing (signaled by Results Manager).

#### Technical Requirements
- **REQ-TR-SERP-1:** Robust API integration (keys, rate limits).
- **REQ-TR-SERP-2:** Asynchronous execution (background job), updating `SearchExecution` status.
- **REQ-TR-SERP-3:** Store raw results correctly in `RawSearchResult`.

### Phase 2 Requirements (Enhancements)

#### Functional Requirements
- **REQ-FR-SERP-P2-1:** Support multiple search APIs (Google, Bing, PubMed, etc.).
- **REQ-FR-SERP-P2-2:** Advanced rate limiting/quota management.
- **REQ-FR-SERP-P2-3:** Parallel execution support.
- **REQ-FR-SERP-P2-4:** Enhance `Search Execution Status Page` to show consolidated real-time status for **both** SERP query execution (this feature) **and** subsequent results processing stages (normalization, deduplication, etc., from `Results Manager` feature).
- **REQ-FR-SERP-P2-5:** Scheduling capabilities.
- **REQ-FR-SERP-P2-6:** Robust error recovery.
- **REQ-FR-SERP-P2-7:** API-specific parameter configuration (linked from `Search Strategy Page`).

#### Technical Requirements
- **REQ-TR-SERP-P2-1:** Flexible adapter pattern for multi-API.
- **REQ-TR-SERP-P2-2:** Consolidated status page requires robust communication/shared state between SERP execution and Results Manager pipelines.
- **REQ-TR-SERP-P2-3:** Background job system for scheduling/parallelism.
- **REQ-TR-SERP-P2-4:** Secure multi-API key management.

## Phase 1 Implementation

---
**Phase:** Phase 1
---

### 1. Search Execution Feature Structure

#### Standard Pages & Components:

*   **Search Execution Status Page (`/search-execution/:sessionId`):**
    *   Displays the status of SERP query execution for the given session.
    *   Accessed either:
        - From the Review Manager Dashboard for reviews in the executing state
        - Automatically after initiating execution from the `Search Strategy Page`
    *   Shows progress indicators (e.g., queries completed/total, basic progress bar).
    *   Displays status messages (Running, Completed, Failed).
    *   Provides navigation back to the Review Manager Dashboard or `Search Strategy Page` (if needed) and forward to the `Results Overview Page` (once ready).
*   **Status Indicator (Component):** Displays progress bars, status text, error messages.

#### Workflow & Transitions:

**Workflow (Execution & Status):**

1.  User accesses the page either:
    - By clicking on an executing review from the Review Manager Dashboard
    - By clicking "Execute Searches" on the `Search Strategy Page`
2.  The page displays the real-time progress of SERP queries being executed against the external API.
3.  Status indicators update (e.g., progress bar, text messages like "Running query 5 of 10...").
4.  If API errors occur, they are displayed.
5.  Once *all* SERP queries are complete, the status might indicate "Processing results..." (awaiting signal from Results Manager).
6.  When Results Manager confirms initial processing is done, the status updates to "Complete" and a button/link to navigate to the `Results Overview Page` becomes active/prominent.

*(Refer to `workflow.mmd` for the visual flow.)*

**Navigation:**

*   **Access Status Page:** 
    - From Review Manager Dashboard -> `/search-execution/:sessionId` (for executing reviews)
    - From `/search-strategy/:sessionId` (on execute) -> `/search-execution/:sessionId`
*   **From Status Page:** 
    - -> `/results-overview/:sessionId` (once complete)
    - -> `/review-manager` (cancel/back)

#### Role-Based Access (Phase 1):

*   Users who can execute searches (`Researcher`, `Admin`) will trigger navigation to this page.
*   All users with access to the session can likely view the status page to monitor progress.

*(Refer to `project_docs/standards/role_access_matrix.md` for full details.)*

### 2. UI Components

#### Search Execution Status Page Layout

* **Header Section:**
  * Session title and description
  * Navigation breadcrumbs
  * Return to Search Strategy button
  * Proceed to Results Manager button

* **Query Selection Section:**
  * List of available queries in current session
  * Visual indicators of execution status (not run, in progress, completed, failed)
  * Quick actions (execute, view results)
  * Query details (terms, parameters)

* **Execution Control Section:**
  * Search engine selection checkboxes
  * Result limit settings (total results, per query)
  * Advanced parameters expansion panel
  * Execute button with loading state
  * Pause/Cancel buttons during execution

* **Results Summary Section:**
  * Results count by search engine
  * Chart/graph of result distribution
  * Timestamp of most recent execution
  * Quick navigation to full results view

#### Execution Status Indicators (Component)

* **Progress Indicators:**
  * Overall progress bar for multi-engine searches
  * Per-engine progress indicators
  * Percentage complete display
  * Estimated time remaining

* **Status Messages:**
  * Clear text indication of current status
  * Color-coded status indicators
  * Error messages with resolution suggestions
  * Success confirmations

* **Results Snapshot:**
  * Preview of first few results
  * Distribution visualization (by source, type)
  * Quick metrics (total, unique, potential duplicates)
  * API usage/quota indicators

### 3. Interaction Patterns

#### Search Configuration

* **Engine Selection:**
  * Multiple selection of available search engines
  * Engine-specific parameter controls
  * Preset combinations for common search scenarios
  * Visual indicators of selected engines

* **Parameter Configuration:**
  * Date range selectors with calendar interface
  * Language filter dropdown with multiple selection
  * File type restriction options
  * Domain/site restrictions input

* **Execution Control:**
  * Primary execution button with clear state feedback
  * Confirmation for resource-intensive operations
  * Pause/resume functionality for long-running searches
  * Graceful cancellation with partial results preservation

#### Progress Monitoring

* **Visual Feedback:**
  * Animated progress indicators
  * Completion percentage display
  * Results counter updating in real-time
  * Eye-catching indicators for completion/failure

* **Status Updates:**
  * Clear textual status messages
  * Estimated completion time
  * Current operation description
  * Rate limiting information when applicable

* **Error Handling:**
  * Clear error messaging with error codes
  * Suggested resolution steps
  * Retry mechanisms with backoff
  * Partial results recovery when possible

### 4. Visual Design and Styling Guidelines

This section details the specific visual styling for the Search Execution feature, drawing from the global Thesis Grey UI/UX Style Guide.

#### 4.1. General Colour System (from Style Guide)

*   **Primary action buttons (Execute, Cancel):** Teal (`#6A9CAB`) for positive actions, Error Red (`#D64045`) for destructive actions.
*   **Progress indicators:** Light Teal (`#8BBAC7`) for progress bars and spinners.
*   **Status indicators:**
    *   Completed: Success Green (`#4CAF50`)
    *   In Progress: Processing Blue (`#3B82F6`)
    *   Error: Error Red (`#D64045`)
    *   Not Started: Neutral Gray (`#9CA3AF`)
*   **Information panels:**
    *   Light Mode: White (`#FFFFFF`) background with Light Taupe (`#CEC9BC`) borders.
    *   Dark Mode: Slate (`#5D6977`) background with darker borders.

#### 4.2. Typography (from Style Guide)

*   **Primary Font:** Inter (Sans-serif).
*   **Panel Headings:** 18px, Medium weight, Dark Charcoal (`#3C3F41`) in light mode, White (`#FFFFFF`) in dark mode.
*   **Status Messages:** 14px, Regular weight with appropriate status colors.
*   **Parameter Labels:** 14px, Medium weight, Dark Charcoal (`#3C3F41`) in light mode, Light Taupe (`#CEC9BC`) in dark mode.
*   **Result Counts:** 16px, Semi-bold, Dark Charcoal (`#3C3F41`) in light mode, White (`#FFFFFF`) in dark mode.

#### 4.3. Component Styling for Search Execution

##### Execution Controls

*   **Primary Button (Execute):**
    *   Light Mode: Teal (`#6A9CAB`) background, white text, subtle shadow.
    *   Dark Mode: Teal (`#6A9CAB`) background, white text, subtle glow.
    *   Hover: Light Teal (`#8BBAC7`).
    *   Active/Pressed: Dark Teal (`#4A7A89`).
    *   Loading State: Reduced opacity with spinner.
*   **Secondary Buttons (Cancel, Pause):**
    *   Light Mode: Light Taupe (`#CEC9BC`) background, Dark Charcoal (`#3C3F41`) text.
    *   Dark Mode: Slate Blue-Gray (`#5D6977`) background, White (`#FFFFFF`) text.
    *   Cancel Button: Error Red (`#D64045`) border or icon to indicate destructive action.

##### Progress Indicators

*   **Progress Bars:**
    *   Track: Light Gray (`#E5E7EB`) in light mode, Dark Gray (`#374151`) in dark mode.
    *   Fill: Teal (`#6A9CAB`) with subtle animation.
    *   Height: 8px with rounded ends.
*   **Spinners:**
    *   Color: Teal (`#6A9CAB`).
    *   Size: 24px for primary operations, 16px for secondary operations.
*   **Status Badges:**
    *   Completed: Green background (`#4CAF50`), white text, pill shape.
    *   In Progress: Blue background (`#3B82F6`), white text, pill shape.
    *   Error: Red background (`#D64045`), white text, pill shape.
    *   Not Started: Gray background (`#9CA3AF`), white text, pill shape.

##### Query Cards

*   **Card Container:**
    *   Light Mode: White background, subtle shadow, 1px Light Taupe border.
    *   Dark Mode: Slate background, deeper shadow, darker border.
    *   Border Radius: 8px.
    *   Padding: 16px.
*   **Selected State:**
    *   Light Mode: Light Teal (`#8BBAC7`) left border (3px).
    *   Dark Mode: Teal (`#6A9CAB`) left border (3px).
    *   Subtle background tint to indicate selection.

#### 4.4. Layout and Spacing

*   **Dashboard Grid:** Two-column layout on desktop, single column on mobile.
*   **Section Spacing:** 24px between major sections.
*   **Card Spacing:** 16px between query cards.
*   **Internal Padding:** 16px inside panels and cards.
*   **Control Groups:** Related controls grouped with 8px spacing between elements.

#### 4.5. Responsive Behavior

*   **Desktop Presentation:** Two-column layout with query list on left, execution panel on right.
*   **Tablet Adjustments:** Either stacked layout or reduced size two-column layout depending on orientation.
*   **Mobile Presentation:** Single column with expandable/collapsible sections for better space usage.
*   **Touch Targets:** Minimum 44×44px for interactive elements on touch devices.

### 5. Accessibility Considerations

*   **Screen Reader Support:**
    *   ARIA attributes for dynamic content updates
    *   Progress announcements for screen readers
    *   Clear labeling of all controls
    *   Semantic HTML structure

*   **Keyboard Navigation:**
    *   Logical tab order through execution controls
    *   Keyboard shortcuts for common actions (execute, cancel)
    *   Focus indicators for all interactive elements
    *   Skip links for main content sections

*   **Visual Accessibility:**
    *   High contrast mode support
    *   Status indicators using both color and shape/icon
    *   Text alternatives for graphical information
    *   Scalable text and controls

*   **Cognitive Considerations:**
    *   Clear, jargon-free status messages
    *   Consistent positioning of controls
    *   Simplified interface with progressive disclosure
    *   Confirmation for potentially destructive actions

## Phase 2 Enhancements

---
**Phase:** Phase 2
---

(Enhancements focus on multi-API support via the `Search Strategy Page` and enriching the `Search Execution Status Page` to show consolidated progress.)

### 1. Consolidated Status View (`Search Execution Status Page`)

*   **Enhanced Layout:** The page now displays progress for *both* SERP execution *and* subsequent Results Manager processing stages.
*   **Dual Progress Tracking:** May show separate progress indicators/checklists for:
    *   SERP API Calls (e.g., Google Query 1..N, Bing Query 1..N).
    *   Results Manager Pipeline (e.g., Normalization, Metadata Extraction, Deduplication).
*   **Real-time Updates:** Leverages communication mechanism (WebSockets, polling) to get updates from both backend processes.
*   **Clear Final Transition:** Navigation to `Results Overview Page` enabled only after *all* steps (SERP + Processing) are complete.

### 2. Multi-API Support
*   Configuration happens on `Search Strategy Page`.
*   `Search Execution Status Page` adapts to show progress for all selected APIs (e.g., separate sections or combined progress).

### 3. Advanced Monitoring & Scheduling
*   Scheduling configured elsewhere (e.g., Strategy Page or Admin Panel).
*   Status page might show status for scheduled/recurring runs.
*   Advanced analytics might be linked from here.

### 4. Collaborative Execution
*   Status page might show who initiated the run.
*   Permissions (e.g., canceling) may be role-based.

## Implementation Guidelines

*   **Background Jobs:** Ensure robust background job system for handling asynchronous operations.
*   **Status Communication:** Leverage WebSockets or polling mechanisms for real-time updates.
*   **Error Handling:** Implement robust error handling mechanisms to manage API failures and user notifications.
*   **Security:** Secure multi-API key management and access control.
*   **Scalability:** Design for horizontal scalability to handle increased load and API integrations.
*   **User Experience:** Focus on clear, intuitive user interface for monitoring progress and managing executions.
*   **Analytics:** Integrate advanced analytics capabilities for performance tracking and optimization.
*   **Scheduling:** Implement flexible scheduling options for recurring searches and batch executions.
*   **Collaboration:** Facilitate collaborative search monitoring and team communication.
*   **Role-Based Access:** Ensure role-based access control for managing execution permissions and access.
*   **Testing:** Conduct thorough testing to validate feature functionality and performance under various scenarios.
*   **Documentation:** Provide comprehensive documentation for feature implementation and usage guidelines.
*   **User Feedback:** Collect and incorporate user feedback for continuous improvement and feature enhancements. 