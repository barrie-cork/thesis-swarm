# Search Strategy Page Feature: UX and UI Implementation Plan

---
**Phase:** Both (Core functionality in Phase 1, advanced query building in Phase 2)
---

## Overview

The `Search Strategy Page` enables researchers to create, refine, and manage structured search strategies for `SearchSession` entities. This page is accessed from the Review Manager Dashboard when creating a new review or accessing a draft review. This plan outlines the UI/UX for constructing effective search queries using the PIC framework, configuring search parameters, and initiating search execution.

## Core Requirements

This section outlines the core functional and technical requirements for the Search Strategy Builder feature, stratified by development phase. These requirements are derived from the overall project requirements (`project_docs/requirements/core_requirements.md`) and are specific to this feature's UI/UX implementation.

### Phase 1 Requirements

#### Functional Requirements
- **REQ-FR-SSB-1:** The `Search Strategy Page` (`/search-strategy`) allows users to manage `SearchSession` entities (create, name, describe, view list - list view integrated from previous `reviewManager.md` description).
- **REQ-FR-SSB-2:** Supports PIC framework input for basic concept grouping.
- **REQ-FR-SSB-3:** Allows domain/URL filtering.
- **REQ-FR-SSB-4:** Supports basic file type filtering.
- **REQ-FR-SSB-5:** Generates simple boolean queries (AND between PIC, OR within PIC).
- **REQ-FR-SSB-6:** Provides real-time query preview.
- **REQ-FR-SSB-7:** Allows specifying max results per query.
- **REQ-FR-SSB-8:** Allows saving the strategy (updates `SearchSession` and related `SearchQuery` entities) without execution.
- **REQ-FR-SSB-9:** Allows initiating search execution, transitioning to the `Search Execution Status Page`.

#### Technical Requirements
- **REQ-TR-SSB-1:** Uses `SearchSession` and `SearchQuery` entities.
- **REQ-TR-SSB-2:** Query generation logic translates inputs correctly.
- **REQ-TR-SSB-3:** UI provides clear feedback/validation.

### Phase 2 Requirements (Enhancements)

#### Functional Requirements
- **REQ-FR-SSB-P2-1:** Supports advanced operators (NOT, proximity).
- **REQ-FR-SSB-P2-2:** AI-assisted query suggestions/term expansion.
- **REQ-FR-SSB-P2-3:** Query history/versioning.
- **REQ-FR-SSB-P2-4:** Visual query builder interface.
- **REQ-FR-SSB-P2-5:** Save strategies as templates.
- **REQ-FR-SSB-P2-6:** MeSH/ontology integration.
- **REQ-FR-SSB-P2-7:** Configuration for multiple search APIs.
- **REQ-FR-SSB-P2-8:** Role-based editing/execution (Lead Reviewer edits/executes).

#### Technical Requirements
- **REQ-TR-SSB-P2-1:** Entity enhancements for versioning/templates.
- **REQ-TR-SSB-P2-2:** Adaptable query generation for multiple APIs.
- **REQ-TR-SSB-P2-3:** Real-time updates/conflict management for collaboration.

## Phase 1 Implementation

---
**Phase:** Phase 1
---

### 1. Search Strategy Page Structure

#### Standard Pages & Components:

*   **Search Strategy Page (`/search-strategy/:sessionId`):**
    *   Accessed from the Review Manager Dashboard when creating a new review or editing a draft review.
    *   Provides the builder interface for defining and configuring search strategies.
    *   Builder sections: Session details (name/description), PIC inputs, Configuration (domains, file types, scope), real-time Query Preview.
*   **PIC Input Panel (Component):** Dedicated area for P, I, C terms.
*   **Configuration Panel (Component):** Domain, file type, max results settings.
*   **Query Preview Panel (Component):** Real-time display of generated query.

#### Workflow & Transitions:

**Workflow (Creating/Editing Strategy):**

1.  User starts on Review Manager Dashboard (`/review-manager`).
2.  User clicks "Create New Review" or selects a review with 'Draft' status.
3.  System navigates to Search Strategy Page (`/search-strategy/:sessionId`).
4.  The builder interface (PIC, Config, Preview panels) displays for the new/selected review.
5.  User inputs terms into PIC panels, sets configuration options.
6.  `Query Preview Panel` updates in real-time.
7.  User clicks "Save Strategy" (saves session/query data, status remains Draft) or "Execute Searches".
8.  If "Execute Searches" is clicked:
    *   Strategy is saved.
    *   Session status updated to 'Executing'.
    *   User navigates to `Search Execution Status Page` (`/search-execution/:sessionId`).

*(Refer to `workflow.mmd` for the visual flow.)*

**Navigation:**

*   **Entry:** From Review Manager Dashboard (`/review-manager`).
*   **Builder View:** `/search-strategy/:sessionId`.
*   **Execute:** `/search-strategy/:sessionId` -> `/search-execution/:sessionId`.
*   **Cancel:** Returns to Review Manager Dashboard.

#### Role-Based Access (Phase 1):

*   **Researcher, Admin:** Can view list, create sessions, edit draft strategies, execute searches.
*   **User, Reviewer:** Can view list (sessions they have access to), but typically cannot create/edit/execute (permissions vary).

*(Refer to `project_docs/standards/role_access_matrix.md` for full details.)*

### 2. UI Components

#### Search Strategy Page Layout (Combined List & Builder)

*   Layout likely shows session list by default. Selecting/creating session shows builder panels.
*   Header needs session name/description inputs when in builder mode.
*   Action buttons (Save, Execute) appear in builder mode.

#### PIC Framework Section / Term Input / Configuration Section / Query Preview Panel / Action Controls

* **Header Section:**
  * Session name input (required)
  * Description input (optional)
  * Session metadata (creation date, owner)
  * Action buttons (save, execute, cancel)

* **PIC Framework Section:**
  * Three distinct panels for Population, Interest, and Context
  * Explanatory tooltips describing each component
  * Example suggestions to guide proper term selection
  * Visual indication of Boolean relationships (AND between categories, OR within categories)

* **Term Input Component:**
  * Multi-term input with individual term chips
  * Add/remove controls for each term
  * Batch input option for multiple terms

* **Configuration Section:**
  * Domain/URL restriction inputs with validation
  * File type limitation checkboxes (PDF, DOC, etc.)
  * Optional additional domain search toggles (Web, Scholar)
  * SERP selection (Phase 1: Google only)
  * User inputted to specifiy maximum search results returned per query 

* **Query Preview Panel:**
  * Simplified representation of the generated search query
  * Syntax highlighting for different query components
  * Indication of file type restritions
  * Copy-to-clipboard functionality or clickable stright to new webbroswer to the google search website using the search query embedded in the url

* **Action Controls:**
  * Primary button for executing search
  * Secondary button for saving without execution
  * Cancel option with confirmation if changes exist
  * Visual loading states during saving/execution

### 3. Interaction Patterns

#### Query Building Workflow

* **Guided Input:** Clear visual progression through the PIC framework
* **Real-time Feedback:** Query preview updates as terms are added/modified
* **Input Validation:** Immediate feedback for invalid inputs or empty required fields (empty fields are allowed for PIC inputs)
* **Auto-save:** Automatically saving of draft strategies for each input or selection to prevent loss

#### Execution Flow

* **Pre-execution Validation:** Automatic check for required inputs
* **Confirmation Dialog:** Summary of search parameters before execution
* **Error Handling:** Informative error messages with recovery options
* **Success Transition:** Smooth transition to Review Results feature following succesful exececution of the search queries.

### 4. Visual Design and Styling Guidelines

This section details the specific visual styling for the Search Strategy Builder feature, drawing from and expanding upon the global Thesis Grey UI/UX Style Guide. It covers typography, color usage, component-specific styling for light and dark modes, and accessibility considerations.

#### 4.1. General Page Layout & Colors

*   **Overall Page Background:**
    *   Light Mode: Pure White (`#FFFFFF`).
    *   Dark Mode: Dark Charcoal (`#3C3F41`).
*   **Main Sections (Header, PIC Framework, Configuration, Query Preview):** These sections will be visually distinct, often using card-like containers or clear separators.
    *   Light Mode Cards/Containers: Typically White (`#FFFFFF`) or Light Taupe (`#CEC9BC`) backgrounds with subtle shadows and Taupe borders (e.g., `border: 1px solid #CEC9BC; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); padding: 16px;`).
    *   Dark Mode Cards/Containers: Typically Slate (`#5D6977`) backgrounds with deeper shadows and darker borders (e.g., `background-color: #5D6977; border-color: #3C3F41; box-shadow: 0 2px 8px rgba(0,0,0,0.2);`).
*   **Sticky Header/Action Controls:** If implemented for larger strategies, these should maintain good contrast and clear separation from scrolling content, using appropriate background colors from the theme (e.g., White/Light Taupe for light mode, Dark Charcoal/Slate for dark mode).

#### 4.2. Typography

*   **Primary Font:** Inter (Sans-serif) for all UI text except where specified.
*   **Monospace Font:** Roboto Mono for the Query Preview panel text.
*   **Font Scale & Color (referencing Style Guide sections 2 & 3):
    *   **Page Title/Session Name (Header Section):** H1 (24px, Medium) or H2 (20px, Medium).
        *   Light Mode Text: Dark Charcoal (`#3C3F41`).
        *   Dark Mode Text: White (`#FFFFFF`).
    *   **Section Headings (e.g., "PIC Framework", "Configuration", "Query Preview"):** H3 (16px, Medium).
        *   Light Mode Text: Dark Charcoal (`#3C3F41`).
        *   Dark Mode Text: White (`#FFFFFF`).
    *   **Input Labels & Body Text:** 14px, Regular.
        *   Light Mode Text: Dark Charcoal (`#3C3F41`).
        *   Dark Mode Text: White (`#FFFFFF`).
    *   **Term Chip Text:** 14px or 12px, Regular, ensuring contrast with chip background.
        *   Light Mode: White (`#FFFFFF`) on Slate (`#5D6977`) chips.
        *   Dark Mode: White (`#FFFFFF`) on Dark Charcoal (`#3C3F41`) chips.
    *   **Query Preview Text:** 14px, Roboto Mono.
        *   Light Mode: Dark Charcoal (`#3C3F41`).
        *   Dark Mode: White (`#FFFFFF`).
    *   **Small/Caption Text (Tooltips, helper text):** 12px, Regular.
        *   Light Mode: Slate Blue-Gray (`#5D6977`).
        *   Dark Mode: Light Taupe (`#CEC9BC`).

#### 4.3. Component-Specific Styling (from Style Guide section 5.1, adapted and expanded)

##### Header Section Inputs (Session Name, Description)
*   **Input Fields:** Standard Thesis Grey form control styling.
    *   Light Mode: White (`#FFFFFF`) background, Light Taupe (`#CEC9BC`) border, Dark Charcoal (`#3C3F41`) text.
    *   Dark Mode: Slate (`#5D6977`) background, darker border (e.g., `#4A5662`), White (`#FFFFFF`) text.
    *   Focus (both modes): Teal (`#6A9CAB`) border.

##### PIC Framework Component
*   **Panel Styling:** Each PIC component (Population, Interest, Context) should be a clearly defined area, likely using card styling.
    *   Light Mode Card Background: White (`#FFFFFF`); Border: Light Taupe (`#CEC9BC`).
    *   Dark Mode Card Background: Slate (`#5D6977`); Border: Darker Slate (`#4A5662`).
*   **Headings (Population, Interest, Context):** Styled as H3 (see Typography).
*   **Term Input Area (within each PIC panel):
    *   Standard input field styling for text entry before adding as a chip.
*   **"Add Term" Buttons:**
    *   Light & Dark Mode: Primary Button style - Teal (`#6A9CAB`) background, white text.
*   **Term Chips:**
    *   Light Mode: Slate Blue-Gray (`#5D6977`) background, White (`#FFFFFF`) text. Padding `px-3 py-1`, `rounded-full`.
    *   Dark Mode: Dark Charcoal (`#3C3F41`) background (or a slightly lighter shade of dark like `#4A5662` for better separation from page background, if needed), White (`#FFFFFF`) text. Padding `px-3 py-1`, `rounded-full`.
    *   Remove/Delete icon on chip: White, opacity 0.7, hover opacity 1.

##### Configuration Panel
*   **Panel Styling:** Use card styling.
*   **Input Fields (Domain/URL restrictions, Max Results):** Standard Thesis Grey form control styling (as per Header Section Inputs).
*   **File Type Limitation Checkboxes:**
    *   Selected: Teal (`#6A9CAB`) accent (the checkmark and/or box border).
    *   Unselected Box Border: Slate Blue-Gray (`#5D6977`) (light mode), Light Taupe (`#CEC9BC`) (dark mode).
    *   Label Text: Standard body text styling.
*   **SERP Selection / Domain Search Toggles:** If using toggles, style with Teal (`#6A9CAB`) for the active state.

##### Query Preview Panel
*   **Panel Styling:** Use card styling with a distinct background.
    *   Light Mode Background: Light Taupe (`#CEC9BC`).
    *   Dark Mode Background: Dark Charcoal (`#3C3F41`) or a slightly darker shade like `#2D2F31` if Dark Charcoal is the page background.
*   **Border:** Teal (`#6A9CAB`) in both modes to emphasize its importance.
*   **Text:** Roboto Mono, 14px.
    *   Light Mode Text Color: Dark Charcoal (`#3C3F41`).
    *   Dark Mode Text Color: White (`#FFFFFF`).
*   **Syntax Highlighting (Conceptual):** Use subtle variations in text color (e.g., main keywords in Teal, operators in Slate) if implemented, ensuring high contrast.
*   **Copy-to-Clipboard Button:** Small, secondary-styled button (e.g., Slate button or an icon button with Teal icon).

##### Action Controls (Save, Execute, Cancel Buttons)
*   **"Execute Search" Button:** Primary Button style.
    *   Light & Dark Mode: Teal (`#6A9CAB`) background, white text.
*   **"Save Strategy" Button:** Secondary Button style.
    *   Light Mode: Slate Blue-Gray (`#5D6977`) background, white text.
    *   Dark Mode: Light Taupe (`#CEC9BC`) background, Dark Charcoal (`#3C3F41`) text.
*   **"Cancel" Button:** Tertiary/Link style, possibly using Error Red (`#D64045`) text for destructive implication, or a more subdued gray link.
*   **Loading States:** Buttons should indicate a loading state (e.g., spinner, disabled with text change) using appropriate colors.

#### 4.4. Feedback Indicators

*   **Validation Errors:** Text in Error Red (`#D64045`), associated clearly with the problematic input field. Input field border might also turn Error Red.
*   **Success Notifications (e.g., "Strategy Saved"):** Use a light green (if defined in global alerts, e.g., `#10B981` from other docs) or Light Teal (`#8BBAC7`) background with contrasting text.
*   **Loading Indicators:** Subtle spinners or progress indicators, using Teal or Slate Blue-Gray accents.

#### 4.5. Mode Switching

*   All elements within the Search Strategy Builder, including text, backgrounds, borders, and interactive components, must adapt to the selected light or dark mode, referencing the CSS variables or Tailwind `dark:` prefixes from the global style guide.

#### 4.6. Accessibility Considerations

*   **Contrast Ratios:** Strictly adhere to WCAG AA for all text on backgrounds, text on buttons, and icons. Pay special attention to text on colored term chips and within the query preview.
*   **Focus States:** All interactive elements (inputs, buttons, checkboxes, term chips if removable, links) must have a highly visible focus state, typically a 2px Teal (`#6A9CAB`) outline with a 2px offset.
*   **Keyboard Navigation:** Ensure logical tab order and full operability via keyboard for all form fields, term management, configuration options, and action buttons.
*   **ARIA Attributes:** Use appropriate ARIA roles (e.g., `listbox`, `option` for term inputs if they behave like comboboxes), states (e.g., `aria-invalid` for validation), and properties (e.g., `aria-describedby` for error messages, `aria-live` for the query preview if it updates dynamically) to enhance screen reader compatibility.
*   Labels must be programmatically associated with their respective form controls.

*Component Organisation, Input Styling, and general Feedback Indicators from the original section are now integrated above.*

## Phase 2 Enhancements

---
**Phase:** Phase 2
---

(Enhancements add advanced query features, templates, collaboration, and multi-API support to the `Search Strategy Page` builder view. Role restrictions on editing/execution apply.)

### 1. Advanced Query Building

#### Visual Query Builder

* **Interactive Query Canvas:**
  * Drag-and-drop interface for creating complex queries
  * Visual representation of Boolean operators (AND, OR, NOT)
  * Grouping of terms with nested operations
  * Direct manipulation of query structure

* **Concept Relationship Mapping:**
  * Visual mapping of relationships between concepts
  * Weight indicators for term importance
  * Proximity controls for phrase searching
  * Synonyms and related terms visualisation

#### AI-Assisted Query Construction

* **Term Suggestion Panel:**
  * AI-generated suggestions for related terms
  * Synonyms and alternative phrasing recommendations
  * Domain-specific vocabulary suggestions
  * Impact prediction for term additions/removals

* **Query Optimisation Assistant:**
  * Automated analysis of query effectiveness
  * Suggestions for improving recall and precision
  * Warning indicators for potentially problematic patterns
  * One-click application of suggested improvements

### 2. Multi-API Configuration

#### Search API Management

* **API Selection Interface:**
  * Visual selection of multiple search APIs
  * Priority ordering controls
  * API-specific parameter configuration
  * Quota and rate limit indicators

* **Advanced Configuration Panel:**
  * API-specific search parameters
  * Custom header and authentication settings
  * Response format customisation
  * Fallback configurations

#### Specialised Search Integration

* **Academic Database Controls:**
  * Google Scholar optimisation settings
  * Field-specific search parameters

* **Grey Literature Sources:**
  * Specialised repository selections such as GIN guideline repositary using website search tools
  * Conference proceedings search options
  * European grey literature database API integration


#### Query Versioning

* **Version History Interface:**
  * Timeline visualisation of query versions
  * Side-by-side comparison of versions
  * Restore points for previous versions
  * Annotated changes between versions

* **Branching and Experimentation:**
  * Creation of query variants from base strategies
  * A/B testing of different query approaches
  * Merge functionality for combining strategies
  * Performance comparison between versions

### 4. Collaborative Strategy Building

#### Team Collaboration Tools

* **Collaborative Editing:**
  * Real-time multi-user editing of strategies (users can indepenantly review ie two or more users need to tag a search result, or review together all search results i.e one user needed to tag each search result)
  * User presence indicators
  * Edit attribution and tracking
  * Comment and suggestion system

* **Review and Approval Workflow:**
  * Strategy review requests
  * Approval controls for team leads
  * Feedback collection interface
  * Change acceptance/rejection tools

#### Knowledge Base Integration

* **Term Repository:**
  * Organisation-specific term library
  * Preferred terminology standardisation
  * Concept hierarchies and relationships
  * Import/export of controlled vocabularies

* **Strategy Sharing:**
  * Cross-team strategy discovery
  * Best practices recommendations
  * Performance benchmarking
  * Adaptation suggestions from similar strategies

### 5. Advanced Preview and Testing

#### Search Preview Panel

* **Enhanced Query Preview:**
  * Full syntax highlighting with expandable sections
  * Translation between different search syntaxes
  * Line-by-line explanation of query components
  * Estimated result count predictions

* **Test Search Functionality:**
  * Sample result preview without full execution
  * Quick relevance feedback tools
  * Term effectiveness highlighting
  * Iterative refinement interface

#### Performance Analysis

* **Query Analysis Dashboard:**
  * Predicted recall and precision metrics
  * Term frequency analysis
  * Search coverage visualisation
  * Comparison with previous strategies

* **Improvement Suggestions:**
  * Automated gap analysis
  * Term redundancy identification
  * Query simplification recommendations
  * Advanced operator suggestions

### 6. Phase 2 Transitions & Interactions

*   **Session Hub Page (Lead Reviewer) → Search Strategy Page:** Allows Lead Reviewer to navigate back to the builder view for the specific session to edit the strategy.
*   **Search Strategy Page → Execute Searches button click (Lead Reviewer Only):** Saves strategy, updates status, navigates to the **consolidated** `Search Execution Status Page` (as defined in `serpExecution.md` UI plan) which shows both SERP execution *and* results processing status.
*   **Consolidated Search Execution Status Page → Results Overview Page:** Navigation occurs after *all* execution and processing steps shown on the status page are complete.

## Implementation Guidelines

### Technical Approach

1. **Component Architecture:**
   * Build modular components for each functional area
   * Create a consistent state management approach
   * Design clear interfaces between components
   * Implement progressive enhancement for advanced features

2. **Responsiveness and Performance:**
   * Optimise for both desktop and tablet interfaces
   * Implement efficient state updates for real-time preview
   * Use lazy loading for advanced features
   * Consider offline support for draft strategies

3. **Accessibility Considerations:**
   * Ensure keyboard navigability throughout the interface
   * Provide meaningful labels and ARIA attributes
   * Create screen reader compatible interactions
   * Test with assistive technologies
   * Ensure sufficient colour contrast for all states

4. **Error Handling and Validation:**
   * Implement client-side validation for immediate feedback
   * Provide clear, actionable error messages
   * Include recovery paths for common issues
   * Preserve user input during error recovery

### Integration Points

1. **Review Manager Integration:**
   * Seamless transitions between review management and strategy building
   * Consistent metadata sharing between components
   * Status updates visible across the application

2. **Search Execution Integration:**
   * Clear handoff of search parameters to execution engine
   * Progress feedback during execution
   * Error propagation and handling
   * Result set connection to original strategy

3. **Results Management Integration:**
   * Strategy metadata attached to result sets
   * Strategy refinement from results interface
   * Performance metrics feedback loop