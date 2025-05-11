# Review Manager Feature: UX and UI Implementation Plan

## Overview

The Review Manager feature serves as the central hub where users manage their systematic review sessions. It provides an overview of all reviews the user is involved in, facilitates the creation of new reviews, and (in Phase 2) manages collaborations and invitations. This implementation plan outlines a structured approach for building this feature across both phases of development.

## Phase 1 Implementation

### 1. Review Manager Feature Structure

#### Pages & Screens:

* **Review Manager Dashboard:**
  * Serves as the main landing page after authentication
  * Displays all review sessions owned by the user
  * Categorises reviews by status (Draft, In Progress, Completed)
  * Features a prominent "Create New Review" call-to-action

* **Review Session Card:**
  * Compact representation of each review session
  * Displays review name, creation date, and current status
  * Shows a simple progress indicator for In Progress reviews
  * Provides quick action buttons (Continue, View Results, Delete)

* **Create New Review Modal:**
  * Simple Button to initiate a new review session in Search Strategy Builder

#### Transitions & Interactions:

* **Dashboard → Review Manager:** Default landing after authentication
* **Review Manager → Session Details:** Clicking on a review session card
* **"Create New Review" → Search Strategy Builder:** Direct flow to begin defining search parameters
* **In Progress Review → Continue Review:** Takes user to current stage in the review process
* **Completed Review → View Results:** Takes user to the Review Results page

### 2. UI Components

#### Review Manager Dashboard Layout

* **Header Section:**
  * User welcome message
  * Summary statistics (total reviews, reviews in progress, completed reviews)
  * Primary "Create New Review" button
  * Optional quick filters (All, In Progress, Completed)

* **Review Categories Section:**
  * Tabbed interface for different review states
  * Empty states for each category when no reviews exist
  * Sort controls (by date created, name, progress)
  * Simple toggle for different view modes (card/list)

* **Review Session Cards Grid:**
  * Responsive grid layout adapting to screen size
  * Card-based design with consistent height/width
  * Visual status indicators using colour and icons
  * Hover states revealing additional actions

#### Review Session Card Component

* **Default State:**
  * Review name and truncated description
  * Creation date and elapsed time
  * Status badge (Draft, In Progress, Completed)
  * Progress indicator for In Progress reviews
  * Primary action button based on status

* **Hover State:**
  * Elevation effect or subtle highlight
  * Reveal of secondary actions (Edit, Delete)
  * "Continue" button emphasis

* **Empty State:**
  * Friendly illustration
  * Encouraging message to create first review
  * Direct "Create Review" button

### 3. Interaction Patterns

#### Review Management Workflow

* **Creating a Review:**
  * Click prominent "Create New Review" button
  * Brought to Search Strategy Builder

* **Continuing a Review:**
  * Click on In Progress review card
  * System determines last active stage
  * Redirect to appropriate page (Strategy Builder, Search Execution, Results Review)

* **Managing Reviews:**
  * Hover on card to reveal additional options
  * Delete with confirmation dialog
  * Edit basic details without leaving dashboard

#### Session Organisation

* **Filtering and Sorting:**
  * Tabs for quick filtering by status
  * Sort dropdown for ordering by different criteria
  * Search box for finding specific reviews by name

* **Visual Categorisation:**
  * Colour coding by status (blue for draft, amber for in-progress, green for completed)
  * Clear status labels
  * Progress indicators showing completion percentage

### 4. Visual Design and Styling Guidelines

This section details the specific visual styling for the Review Manager feature, drawing from the global Thesis Grey UI/UX Style Guide.

#### 4.1. General Dashboard Styling

*   **Page Backgrounds:** Pure White (`#FFFFFF`) for light mode; Dark Charcoal (`#3C3F41`) for dark mode.
*   **Header Section (within Review Manager Dashboard):**
    *   Typography for welcome message and summary statistics: Use H2 (20px, Medium) or Body Text (14px, Regular) as appropriate, with Dark Charcoal (light mode) / White (dark mode) text.
    *   "Create New Review" Button: Primary button styling - Teal (`#6A9CAB`) background, white text.
    *   Filter Controls (Dropdowns, Segmented Buttons for status): Standard Thesis Grey form control styling. Active filters should use a Teal (`#6A9CAB`) accent.
*   **Review Categories Section (Tabs for Draft, In Progress, Completed):**
    *   Tabs: Active tab with Teal (`#6A9CAB`) accent (e.g., border-bottom or background highlight), text color Dark Charcoal/White. Inactive tabs with standard text colors on the page/card background.
    *   Empty States: Use a gentle illustration (if designed) and informative text styled as Body Text (14px).
    *   Sort Controls/View Toggles: Standard form control/button styling.

#### 4.2. Review Session Card Component

*   **Overall Card Styling:** Adheres to the standard `.card` definition from the Thesis Grey Style Guide.
    *   Light Mode: White (`#FFFFFF`) background, subtle shadow, Light Taupe (`#CEC9BC`) border. `border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); padding: 16px;`
    *   Dark Mode: Slate (`#5D6977`) background, darker shadow, darker border (e.g., `#3C3F41`). `background-color: #5D6977; border-color: #3C3F41; box-shadow: 0 2px 8px rgba(0,0,0,0.2);`
*   **Typography within Card:**
    *   Review Name: H3 style (16px, Medium). Dark Charcoal (`#3C3F41`) (light mode) / White (`#FFFFFF`) (dark mode).
    *   Description (truncated): Body Text (14px, Regular).
    *   Creation Date/Elapsed Time: Small/Caption text (12px, Regular). Slate Blue-Gray (`#5D6977`) (light mode) / Light Taupe (`#CEC9BC`) (dark mode).
*   **Status Badges/Indicators:** Small, pill-shaped badges with padding (e.g., `px-2 py-0.5`).
    *   Draft: Slate Blue-Gray (`#5D6977`) background, White (`#FFFFFF`) text.
    *   In Progress: Light Teal (`#8BBAC7`) background, Dark Charcoal (`#3C3F41`) or White text (ensure contrast).
    *   Completed: Teal (`#6A9CAB`) background, White (`#FFFFFF`) text.
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
*   **Analytics Visualizations:** If any simple charts/graphs are displayed on the dashboard (e.g., review counts), they should use the core palette: Teal (`#6A9CAB`) for primary data, Slate Blue-Gray (`#5D6977`) or Light Taupe (`#CEC9BC`) for secondary data or axes.
*   **Admin Controls (within Admin section if separate):** Standard styling for tables, lists, and action buttons as per global guidelines.

#### 4.4. Mode Switching

*   All Review Manager UI components (Dashboard, Cards, Panels, Modals) must fully support the application's light/dark mode switching, utilizing CSS variables or Tailwind's `dark:` prefix as defined in the global style guide.

#### 4.5. Accessibility

*   **Contrast Ratios:** Ensure all text, especially on colored status badges, meets WCAG AA contrast standards in both light and dark modes.
*   **Focus States:** All interactive elements (buttons, tabs, input fields, links on cards) must have a visible focus state using the Teal (`#6A9CAB`) outline.
*   **ARIA Attributes:** Implement appropriate ARIA roles for tabs, cards (as list items if applicable), buttons, and dynamic content regions to ensure screen reader compatibility.
*   **Keyboard Navigation:** The dashboard, including navigating between cards and activating card actions, must be fully keyboard operable.

## Phase 2 Enhancements

### 1. Collaborative Review Management

#### Team-based Reviews

* **Team Indicator in Review Cards:**
  * Visual indication of team ownership
  * Member avatars or counts
  * Role badge for user (Lead Reviewer, Reviewer)

* **Role-Based Actions and Views:**
  * Different action options based on user role:
    * **Lead Reviewer capabilities:**
      * Full management of review settings and configuration
      * Configure validation rules (single vs multi-reviewer validation)
      * Define number of reviewers required per search result
      * Set up result allocation rules and workload distribution
      * Manage reviewer assignments and reassignments
      * Access to comprehensive analytics and progress tracking
    * **Reviewer capabilities:**
      * View-only access to review settings and rules
      * See list of other reviewers and their assigned workloads
      * Access personal progress statistics and assigned results
      * Submit completed reviews for lead reviewer approval

* **Review Settings Panel:**
  * **Validation Configuration:**
    * Toggle between single and multi-reviewer validation modes
    * When multi-reviewer selected, specify required number of reviewers per result (2-5)
    * Set conflict resolution rules (automatic or lead reviewer mediation)
    * Configure consensus thresholds for automatic validation
  
  * **Allocation Settings:**
    * Select allocation method (manual, random, round-robin, expertise-based)
    * Set workload distribution parameters (equal, proportional to availability)
    * Establish deadlines and time allocations per reviewer
    * Configure overlap percentage for quality control

* **Team Management Panel:**
  * Add/remove team members
  * Assign roles and permissions
  * View member activity and contributions
  * Communication tools (comments, notifications)

### 2. Invitation Management

#### Pending Invites Section

* **Invitation Dashboard:**
  * Dedicated tab or section for pending invites
  * Clear display of review details and requester
  * Accept/Decline buttons with confirmation
  * Optional "View More Details" before accepting

* **Invitation Card:**
  * Requesting user's name and role
  * Review title and brief description
  * Requested role and responsibilities
  * Expiration date for the invitation

* **Invitation Management Tools:**
  * Notification system for new invites
  * Batch actions for multiple invites
  * History of past invitations (accepted/declined)

### 3. Enhanced Session Management

#### Advanced Filtering and Organisation

* **Advanced Search and Filter:**
  * Filter by team membership
  * Filter by role
  * Search across all review metadata
  * Saved filter presets

* **Organisational Tools:**
  * Tagging/labelling system for reviews
  * Grouping by project or theme
  * Custom sorting options
  * Archiving functionality for completed reviews

#### Session Templates

* **Template Management:**
  * Save review sessions as templates
  * Create new reviews from existing templates
  * Organisation-wide template library
  * Template version control

### 4. Review Process Analytics

* **Review Dashboard Analytics:**
  * Time-to-completion metrics
  * Team productivity visualisation
  * Status change history
  * Bottleneck identification

* **Validation Analytics:**
  * Inter-reviewer agreement metrics
  * Conflict frequency analysis
  * Decision time analysis per reviewer
  * Validation rule effectiveness tracking

* **Progress Tracking:**
  * Detailed breakdown of progress by stage
  * Comparison against target timelines
  * Team member contribution metrics
  * Milestone tracking and notification

### 5. Administrative Functions

* **Admin Controls:**
  * Global overview of all organisational reviews
  * User permission management
  * Bulk operations (archive, transfer ownership)
  * Activity logs and audit trails

* **Quality Assurance Tools:**
  * Review standard enforcement
  * Checkpoint validation
  * Methodology compliance indicators
  * Review process analytics

## Implementation Guidelines

### Technical Approach

1. **Component Architecture:**
   * Build modular components with clear interfaces
   * Separate presentation from business logic
   * Create reusable patterns for cards, lists, and modalities
   * Implement state management for filtering and sorting

2. **Scalability Considerations:**
   * Design database queries for efficient filtering
   * Implement pagination for large sets of reviews
   * Consider caching strategies for review metadata
   * Optimize for quick dashboard loading

3. **Progressive Enhancement:**
   * Build Phase 1 with extension points for Phase 2
   * Use feature flags to manage capabilities
   * Design UI elements that can accommodate additional information
   * Create component APIs that support expanded functionality

4. **Responsive Behaviour:**
   * Adapt layout for different screen sizes
   * Adjust card grid based on available space
   * Ensure primary actions remain accessible on mobile
   * Consider touch interactions for tablet usage

### Integration Points

1. **Authentication and Role Management:**
   * User identification for review ownership
   * Role-based interface adaptations
   * Permission checking for actions
   * Role assignment and transition workflows

2. **Database Integration:**
   * Direct integration with SearchSession entity
   * User relationship tracking
   * Status and progress calculations
   * Session metadata management
   * Validation rule storage and enforcement

3. **Search Strategy Integration:**
   * Seamless transition to strategy builder
   * Strategy status reflection in review cards
   * Quick review of defined search parameters

4. **Notification System:**
   * Invitation alerts
   * Status change notifications
   * Review progress milestones
   * Team activity updates
   * Validation completion and conflict alerts