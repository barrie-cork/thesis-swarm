# Results Manager Feature: UX and UI Implementation Plan

---
**Phase:** Both (Core backend in Phase 1, dedicated UI in Phase 2)
---

## Overview

The Results Manager feature is a critical backend-driven system responsible for processing, normalising, and enhancing raw search results before they are displayed on the `Results Overview Page`. Phase 1 focuses on the background service with status notifications integrated into other pages. Phase 2 introduces dedicated UI pages (`Processing Status Dashboard`, `Deduplication Overview Page`) primarily for Lead Reviewer and Admin roles.

## Core Requirements

This section outlines the core functional and technical requirements for the Results Manager feature, stratified by development phase. These requirements are derived from the overall project requirements (`project_docs/requirements/core_requirements.md`) and are specific to this feature's UI/UX implementation.

### Phase 1 Requirements

#### Functional Requirements
- **REQ-FR-RM-1:** System must process and normalize search results (primarily as a background server-side operation).
- **REQ-FR-RM-2:** System must implement basic URL normalization for consistency (e.g., removing tracking parameters, standardizing protocols).
- **REQ-FR-RM-3:** System must extract basic metadata (domain, file type from URL patterns/MIME types).
- **REQ-FR-RM-4:** Processed results, when available, must support filtering and sorting on the `Results Overview Page`.
- **REQ-FR-RM-5:** System must provide a result preview interface (typically on the `Results Overview Page` after processing is complete).
- **REQ-FR-RM-6:** System must store the search engine source for each result.
- **REQ-FR-RM-7:** System must provide user notifications (e.g., within Search Execution Status or global notifications) regarding processing status (progress, completion, errors).

#### Technical Requirements
- **REQ-TR-RM-1:** Result processing logic must be implemented as a modular, asynchronous pipeline.
- **REQ-TR-RM-2:** Processed results must be stored efficiently in the `ProcessedResult` entity, linked to `RawSearchResult`.
- **REQ-TR-RM-3:** Basic deduplication (e.g., based on exact URL match after normalization) should occur during processing to create initial `DuplicateRelationship` records if applicable.

### Phase 2 Requirements (Enhancements)

#### Functional Requirements
- **REQ-FR-RM-P2-1:** System must implement an advanced, multi-stage deduplication pipeline (URL similarity, title similarity, snippet similarity, cross-engine referencing).
- **REQ-FR-RM-P2-2:** System must provide a dedicated `Deduplication Overview Page` and `Duplicate Resolution Interface` for Lead Reviewers to manage and manually resolve duplicate clusters.
- **REQ-FR-RM-P2-3:** System must provide a `Processing Status Dashboard` for Lead Reviewers to monitor the real-time status of processing and deduplication pipelines.
- **REQ-FR-RM-P2-4:** System must support advanced metadata extraction (e.g., authors, publication dates, affiliations) and store it in `ProcessedResult.enhancedMetadata`.
- **REQ-FR-RM-P2-5:** System must allow configuration of the processing pipeline (e.g., intensity, enabling/disabling specific steps) via the `Processing Configuration Panel` for authorized users.
- **REQ-FR-RM-P2-6:** System should support full-text extraction for certain document types and make it searchable.

#### Technical Requirements
- **REQ-TR-RM-P2-1:** The deduplication pipeline must be configurable and handle large volumes of results efficiently.
- **REQ-TR-RM-P2-2:** The `Deduplication Management Interface` must allow for efficient review and resolution of potential duplicates, updating `DuplicateRelationship` entities.
- **REQ-TR-RM-P2-3:** Advanced metadata extraction may involve NLP libraries or external services and should be robust.
- **REQ-TR-RM-P2-4:** All processing stages must be logged for audit and debugging purposes.

## Phase 1 Implementation

---
**Phase:** Phase 1
---

### 1. Results Manager Core Functionality (Backend Focus)

#### Standard Pages:

*   **No dedicated UI page in Phase 1.** Functionality is background processing.
*   **Integration with `Search Execution Status Page`:** Displays processing progress and status.
*   **Integration with `Results Overview Page`:** Processed results are displayed here once ready.

#### Background Processing System:

* **Raw Result Ingestion:**
  * Automated collection of results from search execution
  * Queueing system for handling large result sets
  * Progress tracking for processing status

* **Result Normalisation Pipeline:**
  * URL standardisation (removing tracking parameters, standardising protocols)
  * Title and snippet cleaning (removing HTML entities, standardising whitespace)
  * Basic metadata extraction from URLs and snippets
  * File type detection based on URL patterns and MIME types

* **Basic Data Enhancement:**
  * Domain extraction for source categorisation
  * Simple organisation/publisher identification
  * Document type classification (webpage, PDF, DOC)
  * Search engine source attribution

* **Storage and Indexing:**
  * Efficient database schema for processed results
  * Indexing for fast filtering and retrieval
  * Relationship maintenance between raw and processed results

#### Integration Points:

* **Search Execution → Results Manager:**
  * Automatic triggering after search completion
  * Batch processing of newly retrieved results
  * Status communication back to search execution feature

* **Results Manager → Review Results:**
  * Provision of processed results for review
  * Support for filtering and sorting operations
  * Metadata enrichment for improved review experience

#### Workflow & Transitions (Phase 1 - User Perspective):

**Workflow:**

1.  Researcher initiates search execution from the `Search Strategy Page`.
2.  Execution status (including result retrieval) is monitored on the `Search Execution Status Page`.
3.  Upon completion of retrieval, the `Search Execution Status Page` indicates that results are now being processed by the Results Manager (background task).
4.  Users may see notifications about processing progress (e.g., on the status page or via global notifications).
5.  Once processing is complete, the status updates, and users can navigate to the `Results Overview Page` to view the processed results.

*(Refer to `workflow.mmd` for the visual flow, noting Results Manager is a step between Execution and Results Overview.)*

**Navigation:**

*   No direct navigation *to* a Results Manager page in Phase 1.
*   Users navigate *from* the `Search Execution Status Page` *to* the `Results Overview Page` once processing is complete.

#### Role-Based Access (Phase 1):

*   **All Roles:** Interact indirectly. They trigger processing via search execution and view the final output on the `Results Overview Page`. Status updates are informational.

*(Refer to `project_docs/standards/role_access_matrix.md` for full details.)*

### 2. User Notifications (Integrated UI)

Phase 1 communicates processing status via:

*   **Processing Status Indicators:** Displayed on the `Search Execution Status Page` or via global notifications (progress, completion, errors).
*   **Result Availability Communication:** Status updates indicating when results are ready on the `Results Overview Page`.

### 3. Visual Design and Styling Guidelines (Phase 1 Notifications)

This section details the specific visual styling for the Results Manager feature, drawing from the global Thesis Grey UI/UX Style Guide. Phase 1 has minimal direct UI, while Phase 2 introduces dedicated interfaces.

#### 3.1. Phase 1: User Notifications Styling

While Phase 1 of the Results Manager lacks its own dedicated UI, any notifications or status updates it provides (often displayed within other features like the Search Execution Status Page or via global application notifications) must adhere to the Thesis Grey Style Guide:

*   **Colors for Status:**
    *   Success/Completion/Positive Progress: Teal (`#6A9CAB`) or Light Teal (`#8BBAC7`).
    *   Error/Alerts: Error Red (`#D64045`).
    *   In-Progress/Warning: A designated amber/yellow (e.g., `#F59E0B` - if not in the primary style guide, ensure consistency if used elsewhere for warnings).
*   **Text and Backgrounds:** Text within notifications should use standard primary/secondary text colors (Dark Charcoal for light mode, White for dark mode) on appropriate backgrounds (Pure White/Light Taupe for light mode, Dark Charcoal/Slate for dark mode), depending on the mode and the context of the notification's display.
*   **Typography:** All text within notifications must use the Inter font and follow the general typographic scales defined in the style guide.

## Phase 2 Enhancements

---
**Phase:** Phase 2
---

Introduces dedicated UI pages for managing and monitoring the results processing pipeline.

### 1. Processing Status Dashboard

#### Standard Pages & UI Panels:

*   **Processing Status Dashboard Page:** (New Page)
    *   Real-time visualization of processing stages for ongoing/recent sessions.
    *   Progress statistics, history, performance metrics.
    *   Accessible primarily by Lead Reviewers and Admins.
*   **Processing Configuration Panel:** (Likely part of the Dashboard or a separate Admin settings area)
    *   Controls for pipeline customization (intensity, API keys, scheduling).
    *   Accessible primarily by Admins.

#### UI Components:

* **Pipeline Visualisation:**
  * Interactive flowchart of processing stages
  * Status indicators for each pipeline stage
  * Completion percentages and counts
  * Bottleneck identification

* **Processing Metrics Panel:**
  * Processing speed indicators
  * Resource utilisation charts
  * Time estimates for completion
  * Historical performance comparison

* **Configuration Controls:**
  * Toggle switches for optional processing features
  * Priority adjustment for processing queue
  * Advanced settings expandable section

#### Workflow & Navigation (Phase 2 Dashboard):

**Workflow:**

1.  A Lead Reviewer or Admin navigates to the `Processing Status Dashboard Page` (e.g., via an Admin menu or potentially linked from the `Session Hub Page`).
2.  They monitor ongoing processing, view history, and potentially adjust settings via the `Processing Configuration Panel`.

**Navigation:**

*   **Access:** Typically via Admin/Lead Reviewer specific navigation (e.g., Admin sidebar, `Session Hub Page` tools section).
*   **Path Example:** `Admin Dashboard > Processing Status` or `Session Hub > Tools > Processing Status`

#### Role-Based Access (Phase 2 Dashboard):

*   **Lead Reviewer:** View dashboard, potentially some basic configuration.
*   **Admin:** Full access to dashboard and configuration panel.
*   **Other Roles:** No direct access.

*(Refer to `project_docs/standards/role_access_matrix.md` for full details.)*

### 2. Deduplication Management Interface

#### Standard Pages & UI Panels:

*   **Deduplication Overview Page:** (New Page)
    *   Summary statistics of duplicate detection for a specific session.
    *   Visualization of duplicate clusters.
    *   Filtering and batch action controls.
    *   Accessible primarily by Lead Reviewers.
*   **Duplicate Resolution Interface:** (Likely a modal or dedicated view accessed from the Overview Page)
    *   Side-by-side comparison of potential duplicates.
    *   Difference highlighting, merge preview, decision controls.

#### UI Components:

* **Duplicate Cluster View:**
  * Grouped display of identified duplicates
  * Primary result indication with selection controls
  * Similarity score visualisation
  * Expandable details for each result in cluster

* **Comparison Panel:**
  * Multi-column view of duplicate candidates
  * Field-by-field difference highlighting
  * Merge field selectors for choosing primary data
  * Origin indicators (search engine source)

* **Decision Controls:**
  * Confirm/reject duplication buttons
  * Keep all/merge/discard options
  * Justification field for decision recording
  * Apply to similar cases option

#### Workflow & Navigation (Phase 2 Deduplication):

**Workflow:**

1.  A Lead Reviewer navigates to the `Deduplication Overview Page` for a specific session (e.g., via the `Results Overview Page` or `Session Hub Page`).
2.  They review duplicate clusters and select a cluster for detailed resolution.
3.  The `Duplicate Resolution Interface` is presented.
4.  The Lead Reviewer compares items, makes a decision (merge, keep separate, etc.), and confirms.
5.  The system updates the `DuplicateRelationship` records, and the reviewer returns to the overview or moves to the next cluster.

**Navigation:**

*   **Access:** Via link/button from `Results Overview Page` or `Session Hub Page` (for a specific session).
*   **Path Example:** `Session Hub > [Session Name] > Results Overview > Manage Duplicates` or `Session Hub > [Session Name] > Tools > Deduplication Overview`

#### Role-Based Access (Phase 2 Deduplication):

*   **Lead Reviewer:** Full access to overview and resolution interface.
*   **Admin:** Likely full access (TBD based on final role definitions).
*   **Other Roles:** No direct access.

*(Refer to `project_docs/standards/role_access_matrix.md` for full details.)*

### 3. Advanced Metadata Enhancement (Backend Focus)

#### Metadata Extraction System:

* **Enhanced Extraction Capabilities:**
  * Author detection and normalisation
  * Publication date identification and formatting
  * Organisation affiliation extraction
  * Geographic location recognition
  * Topic and keyword extraction

* **Metadata Merging Intelligence:**
  * Smart consolidation of metadata from duplicate results
  * Cross-reference enhancement between results
  * Confidence scoring for extracted metadata
  * User feedback incorporation for improved accuracy

#### UI Integration:

* **Metadata Quality Indicators:**
  * Completeness scores for extracted metadata
  * Confidence ratings for automatic extractions
  * Source attribution for each metadata field
  * Enhancement suggestions for review

* **Manual Enhancement Controls:**
  * Edit options for incorrect metadata
  * Verification buttons for confirming extractions
  * Bulk application of corrections to similar results
  * Template creation for common metadata patterns

### 4. Integration with Review Process

* **Bidirectional Communication:**
  * Feedback loop from reviewers to improve processing
  * Automatic reprocessing based on manual corrections
  * Learning from reviewer decisions for future enhancements

* **Processing Analytics:**
  * Impact reports on processing quality
  * Reviewer effort reduction metrics
  * Error rate tracking and improvement monitoring
  * Processing optimisation recommendations

### Styling Guidelines (Phase 2 UI)

This section describing Phase 2 UI styling remains, ensuring component references match the descriptions above.

##### Overall Page & Panel Styling

*   **Page Backgrounds:** Pure White (`#FFFFFF`) for light mode; Dark Charcoal (`#3C3F41`) for dark mode.
*   **Cards/Containers/Panels (for dashboards, configuration areas, deduplication sections):**
    *   Light Mode: Light Taupe (`#CEC9BC`) or Pure White (`#FFFFFF`) with subtle shadows, following the `.card` styling (e.g., `border: 1px solid #CEC9BC; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); padding: 16px;`).
    *   Dark Mode: Slate (`#5D6977`) with deeper shadows, following the `.dark .card` styling (e.g., `background-color: #5D6977; border-color: #3C3F41; box-shadow: 0 2px 8px rgba(0,0,0,0.2);`).

##### Typography (Primary Font: Inter)

*   **Dashboard/Page Titles (e.g., "Processing Pipeline Dashboard", "Deduplication Overview"):** H1 (24px, Medium) or H2 (20px, Medium).
    *   Light Mode: Dark Charcoal (`#3C3F41`).
    *   Dark Mode: White (`#FFFFFF`).
*   **Section Headings (e.g., "Pipeline Visualisation", "Configuration Controls"):** H3 (16px, Medium).
    *   Light Mode: Dark Charcoal (`#3C3F41`).
    *   Dark Mode: White (`#FFFFFF`).
*   **Body Text (Labels, descriptive text, statistics, text in tables/lists):** 14px, Regular.
    *   Light Mode: Dark Charcoal (`#3C3F41`).
    *   Dark Mode: White (`#FFFFFF`).
*   **Small/Caption Text (Tooltips, secondary info):** 12px, Regular.
    *   Light Mode: Slate Blue-Gray (`#5D6977`).
    *   Dark Mode: Light Taupe (`#CEC9BC`).

##### Color Usage & Component-Specific Styling

*   **Processing Status Dashboard & Pipeline Visualization:**
    *   Pipeline Stages: Represented as cards or distinct blocks using standard card styling.
    *   Status Indicators (within stages or for metrics): Teal (`#6A9CAB`) for 'complete/successful', an amber/yellow (e.g., `#F59E0B`) for 'in-progress/pending/warning', Error Red (`#D64045`) for 'failed'. Ensure sufficient contrast for text on these colored indicators.
    *   Connectors/Flow Lines: Slate Blue-Gray (`#5D6977`) (light mode), Light Taupe (`#CEC9BC`) (dark mode).
    *   Progress Bars: Teal (`#6A9CAB`) fill for progress against a Light Taupe (light mode) or Slate (dark mode) track.
*   **Processing Metrics Panel / Statistics:** Key numerical data can be emphasized using Medium font weight or Teal (`#6A9CAB`) color if appropriate and contrasts well.
*   **Processing Configuration Panel:**
    *   **Toggle Switches:** Teal (`#6A9CAB`) when active. Background of the switch track could be Light Taupe (light) / Slate (dark).
    *   **Input Fields/Dropdowns:** Standard Thesis Grey form control styling:
        *   Light Mode: White (`#FFFFFF`) background, Light Taupe (`#CEC9BC`) border, Dark Charcoal (`#3C3F41`) text.
        *   Dark Mode: Slate (`#5D6977`) background, darker border (e.g., `#4A5662`), White (`#FFFFFF`) text.
        *   Focus (both modes): Teal (`#6A9CAB`) border.
*   **Deduplication Management Interface:**
    *   **Duplicate Cluster View:** Clusters displayed within cards. Primary/selected result in a cluster could be highlighted with a Teal (`#6A9CAB`) border or a distinct background tint (e.g., very light teal).
    *   **Comparison Panel (Side-by-side):** Use standard card styling for each result being compared. Field-level differences could be highlighted with a subtle background color (e.g., a very light yellow like `#FFF9C4` if it fits palette, ensuring text contrast) or by making differing text bold.
    *   **Decision Controls (Buttons):**
        *   Confirm/Merge/Keep/Apply: Primary Button style - Teal (`#6A9CAB`) background, white text.
        *   Reject/Discard/Cancel: Secondary Button style - Slate (`#5D6977`) background, white text (light mode); Light Taupe (`#CEC9BC`) background, charcoal text (dark mode).
        *   Consider a tertiary, less prominent style for less critical actions if needed.
*   **Tables (if used for processing history, etc.):**
    *   Header: Light Taupe background, Dark Charcoal text (light mode); Slate background, White text (dark mode).
    *   Cell Borders: Light Taupe (light mode); Slate Blue-Gray (`#5D6977`) or darker (`#4A5662`) (dark mode).
    *   Row striping (optional): Use a very subtle shade like Lighter Taupe (`#E4E0D5`) for alternate rows in light mode.

##### Mode Switching

*   All Phase 2 UIs (Processing Status Dashboard, Configuration Panel, Deduplication Interface) must fully support the application's light/dark mode switching, using CSS variables or Tailwind's `dark:` prefix as defined in the global style guide.

##### Accessibility

*   **Contrast Ratios:** Ensure all text (on colored backgrounds, buttons, within visualizations) meets WCAG AA contrast standards in both light and dark modes.
*   **Focus States:** All interactive elements (buttons, toggles, input fields, links, items in visualizations if interactive) must have a visible focus state using the Teal (`#6A9CAB`) outline.
*   **ARIA Attributes:** Implement appropriate ARIA roles, states, and properties for dynamic content, dashboard controls, progress indicators, and complex UI components like the deduplication interface to ensure screen reader compatibility.
*   **Keyboard Navigation:** All functionalities must be accessible and operable via keyboard.

## Implementation Guidelines

### Technical Approach

1. **Pipeline Architecture:**
   * Design modular, extensible processing pipeline
   * Implement plugin system for easy addition of new processors
   * Create robust error handling and recovery mechanisms
   * Develop logging system for process transparency and debugging

2. **Performance Optimisation:**
   * Implement parallel processing where appropriate
   * Design for horizontal scaling to handle large result sets
   * Develop caching strategies for repeated operations
   * Create batching mechanisms for database operations

3. **Storage Efficiency:**
   * Design storage scheme for efficient querying
   * Implement versioning for processed results
   * Create indexing strategy for common query patterns
   * Develop archiving system for completed sessions

4. **UI Design Principles (Phase 2):**
   * Focus on clarity for complex deduplication decisions
   * Provide sufficient context for informed judgments
   * Design for efficiency in high-volume processing
   * Create intuitive visualisations for duplicate relationships

### Integration Points

1. **Search Execution Integration:**
   * Direct pipeline from search results to processing
   * Status reporting back to search execution feature
   * Configuration options for processing depth

2. **Review Results Integration:**
   * Seamless provision of processed results
   * Support for filtering and sorting operations
   * Metadata enhancement for improved review experience

3. **Reporting Integration:**
   * Processing statistics for quality reporting
   * Duplication metrics for PRISMA diagrams
   * Audit trail for processing decisions