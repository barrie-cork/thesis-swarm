# Search Strategy Builder Feature: UX and UI Implementation Plan

## Overview

The Search Strategy Builder feature enables researchers to create, refine, and execute structured search strategies for systematic reviews. This implementation plan outlines a comprehensive approach for building an intuitive, powerful interface that guides users through the process of constructing effective search queries using the PIC (Population, Interest, Context) framework whilst providing immediate feedback and query previews.

## Core Requirements

This section outlines the core functional and technical requirements for the Search Strategy Builder feature, stratified by development phase. These requirements are derived from the overall project requirements (`project_docs/requirements/core_requirements.md`) and are specific to this feature's UI/UX implementation.

### Phase 1 Requirements

#### Functional Requirements
- **REQ-FR-SSB-1:** System must allow users to create and manage search sessions, including naming and describing them.
- **REQ-FR-SSB-2:** System must support basic concept grouping using the PIC framework (Population, Interest, Context) where users can input terms for each category.
- **REQ-FR-SSB-3:** System must allow domain selection/URL filtering for searches (e.g., restricting search to specific websites).
- **REQ-FR-SSB-4:** System must support basic file type filtering (e.g., PDF, DOC).
- **REQ-FR-SSB-5:** System must provide simple query generation based on PIC inputs and filters, forming a boolean query (AND between PIC categories, OR within terms of a category).
- **REQ-FR-SSB-6:** System must offer a real-time query preview that updates as the user modifies terms and filters.
- **REQ-FR-SSB-7:** Users must be able to specify the maximum number of search results to retrieve per query.
- **REQ-FR-SSB-8:** Users must be able to save the search strategy (session and queries) without immediate execution.
- **REQ-FR-SSB-9:** Users must be able to initiate search execution, which then transitions to the `Search Execution Status Page`.

#### Technical Requirements
- **REQ-TR-SSB-1:** Search session and query data must be stored and managed via `SearchSession` and `SearchQuery` entities.
- **REQ-TR-SSB-2:** The query generation logic must correctly translate PIC inputs and filters into valid search engine query strings.
- **REQ-TR-SSB-3:** The UI must provide clear feedback and validation for inputs.

### Phase 2 Requirements (Enhancements)

#### Functional Requirements
- **REQ-FR-SSB-P2-1:** System should support advanced concept relationships and operators within the query builder (e.g., NOT, proximity operators if supported by search engines).
- **REQ-FR-SSB-P2-2:** System may provide AI-assisted query suggestions or term expansion.
- **REQ-FR-SSB-P2-3:** System must support query history and versioning for search strategies.
- **REQ-FR-SSB-P2-4:** System may include a visual query builder interface for more complex query construction.
- **REQ-FR-SSB-P2-5:** System must allow users to save search strategies as templates and create new strategies from these templates.
- **REQ-FR-SSB-P2-6:** System should integrate with MeSH terms or other relevant ontologies for term suggestion/expansion.
- **REQ-FR-SSB-P2-7:** System must support configuration for multiple search APIs (Google, Bing, PubMed, etc.) from within the strategy builder.
- **REQ-FR-SSB-P2-8:** Lead Reviewers should be able to edit the last saved strategy; execution of searches is restricted to Lead Reviewers.

#### Technical Requirements
- **REQ-TR-SSB-P2-1:** Query versioning and template management will require enhancements to `SearchSession` and `SearchQuery` entities or new related entities.
- **REQ-TR-SSB-P2-2:** Integration with multiple search APIs will require adaptable query generation logic and parameter handling.
- **REQ-TR-SSB-P2-3:** Collaborative strategy building features will necessitate real-time updates and conflict management if implemented.

## Phase 1 Implementation

### 1. Search Strategy Builder Structure

#### Pages & Screens:

* **Strategy Builder Page:**
  * All-in-one interface for creating and managing search queries for a new or existing review session.
  * Sections for session naming/description, PIC framework inputs, domain/URL filtering, file type limitations, and search scope selection.
  * Real-time query preview that updates as users make changes.
  * Save, edit, and execute controls with clear visual hierarchy.

* **Search Execution Status Page (Phase 1):**
  * Dedicated, persistent page displayed after clicking the "Execute Searches" button.
  * Features a basic progress bar showing the status of remaining SERP queries being executed.
  * Transitions to the Results Overview Page upon completion of SERP query execution and initial backend processing.

* **Concept Input Panels:**
  * Dedicated input areas for each PIC component (Population, Interest, Context)
  * Term entry with add/remove functionality
  * Visual indication of Boolean relationships between terms
  * Input validation with helpful error messaging

* **Configuration Panel:**
  * Options for domain/URL restrictions
  * File type limitations (PDF, DOC, etc.)
  * Search scope additional options (Phase 1: Google Search only)
  * Search parameters customisation (max results count, etc.)

#### Transitions & Interactions:

* **Review Manager Dashboard → Strategy Builder:** Entry point to create a new search strategy or edit an existing one (if in draft state).
* **Term Input → Query Preview:** Real-time updates as terms are added/modified.
* **Strategy Builder → Execute Searches button click → Search Execution Status Page (Phase 1):** Transition after validating and confirming search.
* **Search Execution Status Page (Phase 1) → Results Overview Page:** Occurs after all SERP queries are executed and initial backend processing is complete.
* **Strategy Builder → Save Strategy:** Save current strategy for later execution or modification.

### 2. UI Components

#### Strategy Builder Layout

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

* **Session Hub Page (Lead Reviewer) → Strategy Builder:** Allows Lead Reviewer to return to the `Search Strategy Builder` to edit the last saved strategy. The builder loads the strategy as it was before any previous execution.
* **Strategy Builder → Execute Searches button click (Lead Reviewer Only) → Search Execution Status Page (Phase 2):** Transition after validating and confirming search. Only Lead Reviewers can execute/re-execute searches.
* **Search Execution Status Page (Phase 2):**
    * This enhanced, single page displays consolidated real-time status for:
        *   SERP query execution (progress bar, streaming text, stages ticked off – data from `SERP Execution` feature).
        *   Results processing stages (normalization, metadata extraction, deduplication progress, etc. – progress bar, streaming text, stages ticked off – data from `Results Manager` feature).
    *   The UI for this consolidated status page is handled by the `SERP Execution` feature.
* **Search Execution Status Page (Phase 2) → Results Overview Page:** Occurs after all SERP execution and results processing are complete.

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