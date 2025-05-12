# Reporting & Export Feature: UX and UI Implementation Plan

---
**Phase:** Both (Core functionality in Phase 1, enhancements in Phase 2)
---

## Overview

The Reporting & Export feature provides researchers with tools to generate structured reports from their systematic reviews, ensuring compliance with PRISMA guidelines. This plan outlines a phased implementation for the `Reporting Page`, delivering essential capabilities in Phase 1, with enhanced visualization, customization, and export options in Phase 2.

## Core Requirements

This section outlines the core functional and technical requirements for the Reporting & Export feature, stratified by development phase. These requirements are derived from the overall project requirements (`project_docs/requirements/core_requirements.md`) and are specific to this feature's UI/UX implementation.

### Phase 1 Requirements

#### Functional Requirements
- **REQ-FR-RE-1:** System must generate basic PRISMA flow diagrams (text-based or simple visual representation).
- **REQ-FR-RE-2:** System must support simple report generation, displaying key statistics and search parameters in a structured, copyable format.
- **REQ-FR-RE-3:** System must allow export of included/excluded results lists in CSV and JSON formats.
- **REQ-FR-RE-4:** System must provide basic statistics on search results, including counts for each stage of the review (retrieved, duplicates, reviewed, included, excluded).

#### Technical Requirements
- **REQ-TR-RE-1:** Report generation logic must accurately reflect data from `SearchSession`, `ProcessedResult`, and `ReviewTagAssignment` entities.
- **REQ-TR-RE-2:** Export functionality must be implemented via Wasp actions ensuring correct data formatting and file generation.

### Phase 2 Requirements (Enhancements)

#### Functional Requirements
- **REQ-FR-RE-P2-1:** System must provide advanced, interactive PRISMA flow diagram visualizations with export options (PNG, SVG).
- **REQ-FR-RE-P2-2:** System must support custom report templates for structuring and branding reports.
- **REQ-FR-RE-P2-3:** System must allow export of full reports in PDF format and data in additional formats (e.g., RIS for reference managers).
- **REQ-FR-RE-P2-4:** System must provide an extended analytics dashboard with metrics like inter-reviewer reliability and source distribution.
- **REQ-FR-RE-P2-5:** System must support publication-ready tables and figures, and potentially integrate with citation management tools.
- **REQ-FR-RE-P2-6:** System must allow for the creation, saving, and sharing of report templates.

#### Technical Requirements
- **REQ-TR-RE-P2-1:** Advanced visualization components (e.g., for PRISMA diagrams) should be performant and interactive.
- **REQ-TR-RE-P2-2:** PDF generation should handle complex layouts and potentially large datasets efficiently.
- **REQ-TR-RE-P2-3:** Template management system should allow for flexible definition and application of templates to report data.

## Phase 1 Implementation

---
**Phase:** Phase 1
---

### 1. Reporting & Export Feature Structure

#### Standard Pages:

*   **Reporting Page (`/reporting/:sessionId`):**
    *   Central interface for viewing statistics, PRISMA flow data, and generating basic reports for a specific `SearchSession`.
    *   Accessed from the relevant `SearchSession` context (e.g., via a button on the `Results Overview Page`).
    *   Organized into distinct sections: PRISMA Flow Summary, Search Strategy Summary, Query Execution Summary.
    *   Presents key statistics and search parameters in a structured, copyable format.

#### Panels/Sections within Reporting Page:

*   **PRISMA Flow Summary Panel:**
    *   Displays key PRISMA metrics (retrieved, duplicates, reviewed, included, excluded).
    *   Simple, text-based presentation optimized for copy/paste.
*   **Search Strategy Summary Panel:**
    *   Lists defined PICO terms and other search parameters (domains, file types, etc.).
*   **Query Execution Summary Panel:**
    *   Lists executed search queries, associated engine (SERP), timestamps, and result counts.

#### Workflow & Transitions:

**Workflow:**

1.  The user navigates from a specific session context (e.g., `Results Overview Page` for the relevant `sessionId`) to the `Reporting Page` (`/reporting/:sessionId`).
2.  On the `Reporting Page`, the user views the generated statistics and summaries.
3.  The user can copy specific sections or the entire basic report to the clipboard.

*(Refer to `workflow.mmd` for the visual flow.)*

**Navigation:**

*   **Access:** Via a link/button from the `Results Overview Page` (or potentially the Phase 2 `Session Hub Page`) for a specific session.
*   **Path Example:** `Dashboard > Search Sessions > [Session Name] > Results Overview > Reporting`

#### Role-Based Access (Phase 1):

*   **Researcher, Reviewer, User, Admin:** Can view the `Reporting Page` for sessions they have access to.
*   Functionality is primarily read-only (viewing stats, copying text).

*(Refer to `project_docs/standards/role_access_matrix.md` for full details.)*

### 2. UI Components

#### Reporting Page Layout (`ReportingPage` component)

*   **Header Section:**
    *   `SearchSession` title/identifier.
    *   Report generation timestamp.
    *   Copy to clipboard buttons (per section and potentially full report).
*   **Content Area:** Contains the specific summary panels.

#### PRISMA Flow Section (Component within `ReportingPage`)

* **PRISMA Flow Section:**
  * Structured display of PRISMA metrics:
    * Total search results retrieved
    * Number of duplicates identified
    * Number remaining after deduplication
    * Number accessed by reviewer
    * Number included in review
    * Number excluded from review
    * Number marked as "maybe" (pending final decision)
  * Simple textual representation with clear labels and values
  * Copy section button

#### Search Strategy Section (Component within `ReportingPage`)

* **Search Strategy Section:**
  * PIC Framework subsection:
    * Population terms (grouped)
    * Interest terms (grouped)
    * Context terms (grouped)
  * Search Scope subsection:
    * Targeted websites/domains
    * Search engines used (Google Scholar, standard Google)
    * File type limitations (PDF, DOC)
  * Search Parameters subsection:
    * Maximum results per query
    * Date ranges (if applicable)
    * Language restrictions (if applicable)
  * Copy section button

#### Query Execution Section (Component within `ReportingPage`)

* **Query Execution Section:**
  * Tabular display of executed queries
  * Columns for:
    * Search engine/SERP used
    * Full query string
    * Execution timestamp
    * Results retrieved
  * Copy section button

#### Interaction Elements

* **Copy Controls:**
  * Section-specific copy buttons with clear tooltips
  * Visual feedback on successful copy operation
  * Formatting preserved for pasting into word processors

* **Section Navigation:**
  * Tabs for switching between major report sections
  * Collapsible panels for subsections
  * Breadcrumb navigation for context

* **Accessibility Features:**
  * Semantic HTML structure for screen readers
  * Keyboard navigation between sections
  * Clear focus indicators for interactive elements

### 3. Visual Design

* **Information Hierarchy:**
  * Primary statistics and key findings emphasized visually
  * Secondary information (detailed parameters) available but visually subordinate
  * Clear section headings and subheadings
  * Consistent formatting for similar data types

* **Typography and Spacing:**
  * Clear, readable typography for data points
  * Proper hierarchy achieved through font weights and sizes
  * Adequate spacing between sections for visual separation
  * Consistent alignment of labels and values

* **Copy Formatting:**
  * Structured text output optimized for pasting into documents
  * Clear headings and subheadings in copied text
  * Proper indentation for hierarchical information
  * Tabular formatting preserved where appropriate

## Phase 2 Enhancements

---
**Phase:** Phase 2
---

### 1. Advanced Visualization Features

#### Interactive PRISMA Diagram

* **Visual Flow Diagram:**
  * Interactive, standards-compliant PRISMA flow diagram
  * Boxes with accurate counts for each stage
  * Animated transitions when data changes
  * Tooltip explanations for each stage

* **Customization Options:**
  * Adjustable diagram styles and colours
  * Ability to add custom stages or annotations
  * Toggle between simplified and detailed views
  * Preview of export appearance

* **Export Controls:**
  * High-resolution PNG export
  * Vector SVG export for publication
  * Size and scale options
  * White or transparent background options

### 2. Enhanced Export Capabilities

#### Document Export Options

* **PDF Generation:**
  * Complete report export as professionally formatted PDF
  * Customizable headers, footers, and page numbers
  * Organization/institution branding options
  * Publication-ready formatting

* **Data Export Options:**
  * CSV export of result data for further analysis
  * Excel-compatible formatting
  * Reference list in multiple citation styles
  * Machine-readable dataset exports

* **Partial Exports:**
  * Export specific sections of the report
  * Select which elements to include in exports
  * Batch export of multiple report components

### 3. Template Management

* **Report Template Library:**
  * Pre-defined templates for common report types
  * User-created custom templates
  * Template sharing within organizations
  * Version control for templates

* **Template Customization:**
  * Visual editor for template structure
  * Custom fields and sections
  * Conditional sections based on data availability
  * Custom branding and styling

* **Template Application:**
  * One-click application of templates to reports
  * Preview before applying
  * Ability to override template defaults
  * Template parameter adjustments

### 4. Advanced Analytics

* **Extended Metrics Panel:**
  * Inter-reviewer reliability statistics
  * Temporal analysis of review process
  * Source/domain distribution analysis
  * Inclusion rate by source type

* **Comparative Analytics:**
  * Comparison with previous reviews
  * Benchmark against similar reviews
  * Trend identification across multiple reviews
  * Aggregated metrics from related reviews

### 5. Publication Support

* **Citation Management:**
  * Export of citations in multiple formats
  * Direct integration with reference management tools
  * Custom citation style support
  * Bulk export of all included references

* **PRISMA Checklist Compliance:**
  * Interactive PRISMA checklist tracking
  * Automatic identification of missing elements
  * Guided completion of required reporting items
  * Validation against current PRISMA guidelines

* **Journal-specific Formatting:**
  * Templates for common academic journals
  * Format validation for submission requirements
  * Preview in journal-specific layouts
  * Export optimized for specific publishers 