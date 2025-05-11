# Results Manager Feature: UX and UI Implementation Plan

## Overview

The Results Manager feature is a critical backend-driven system responsible for processing, normalising, and enhancing raw search results before they become available for review. In Phase 1, it will operate primarily as a background service with no dedicated UI, whilst Phase 2 will introduce specialised interfaces for monitoring and managing the results processing pipeline, with particular focus on deduplication management.

## Phase 1 Implementation

### 1. Results Manager Core Functionality

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

#### Technical Approach:

* **Processing Pipeline Architecture:**
  * Modular pipeline with distinct processing stages
  * Configurable processing steps for easy extension
  * Logging and error handling for process transparency
  * Asynchronous processing for optimal performance
  * Optimised for reliability and feasability. Speed does not matter.

* **Data Quality Assurance:**
  * Validation checks for required fields
  * Fallback strategies for failed processing steps
  * Handling of edge cases (malformed URLs, unusual character sets)
  * Consistent data formatting for downstream features

### 2. User Notifications

While Phase 1 doesn't include dedicated UI pages for the Results Manager, it will communicate processing status to users through:

* **Processing Status Indicators:**
  * Integration with search execution status display
  * Progress notifications (number of results processed)
  * Completion notifications when results are ready for review
  * Error alerts for processing issues

* **Result Availability Communication:**
  * Transition prompts to Review Results when processing completes
  * Basic statistics on processed results (total count, document types)
  * Estimated time to completion for large result sets

### 3. Visual Design and Styling Guidelines

This section details the specific visual styling for the Results Manager feature, drawing from the global Thesis Grey UI/UX Style Guide. Phase 1 has minimal direct UI, while Phase 2 introduces dedicated interfaces.

#### 3.1. Phase 1: User Notifications Styling

While Phase 1 of the Results Manager lacks its own dedicated UI, any notifications or status updates it provides (often displayed within other features like the Search Execution Status Page or via global application notifications) must adhere to the Thesis Grey Style Guide:

*   **Colors for Status:**
    *   Success/Completion/Positive Progress: Teal (`#6A9CAB`) or Light Teal (`#8BBAC7`).
    *   Error/Alerts: Error Red (`#D64045`).
    *   In-Progress/Warning: A designated amber/yellow (e.g., `#F59E0B` - if not in the primary style guide, ensure consistency if used elsewhere for warnings).
*   **Text and Backgrounds:** Text within notifications should use standard primary/secondary text colors (Dark Charcoal for light mode, White for dark mode) on appropriate backgrounds (Pure White/Light Taupe for light mode, Dark Charcoal/Slate for dark mode), depending on the mode and the context of the notification's display.
*   **Typography:** All text within notifications must use the Inter font and follow the general typographic scales defined in the style guide.

#### 3.2. Phase 2: Styling for Dedicated UIs

The following guidelines apply to the dedicated UIs introduced in Phase 2, including the "Processing Status Dashboard," "Processing Configuration Panel," and the "Deduplication Management Interface."

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

## Phase 2 Enhancements

### 1. Processing Status Dashboard

#### Pages & Screens:

* **Processing Pipeline Dashboard:**
  * Real-time visualisation of results processing stages
  * Detailed progress statistics for each processing step
  * Timeline view of processing history
  * Performance metrics and processing time analysis

* **Processing Configuration Panel:**
  * Controls for pipeline customisation
  * Options for processing intensity (basic/advanced)
  * API selection for metadata enhancement services
  * Scheduling options for resource-intensive tasks

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

### 2. Deduplication Management Interface

#### Pages & Screens:

* **Deduplication Overview:**
  * Summary statistics of duplication detection
  * Visualisation of duplicate clusters
  * Filter controls for viewing different duplicate types
  * Batch actions for handling duplicate sets

* **Duplicate Resolution Interface:**
  * Side-by-side comparison of potential duplicates
  * Difference highlighting between similar results
  * Merge preview showing combined metadata
  * Manual override controls for automated decisions

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

#### Interaction Patterns:

* **Duplicate Resolution Workflow:**
  * Queue-based interface for systematic review
  * Keyboard shortcuts for quick decisions
  * Batch resolution for obvious duplicates
  * Decision recording for audit purposes

* **Manual Deduplication Tools:**
  * Search and matching tools for identifying unlisted duplicates
  * Drag-and-drop interface for manual clustering
  * Similarity threshold adjustment
  * Custom rule creation for repeat patterns

### 3. Advanced Metadata Enhancement

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