# Authentication Feature: UX and UI Implementation Plan

## Overview

The Authentication Feature establishes the entry point and identity management system for the Thesis Grey application. This implementation plan outlines a user-friendly authentication flow with clear transitions, focusing on security and usability while accommodating the role-based access controls required for collaborative research in phase 2. Wasp is leveraged through out.

## Phase 1 Implementation

### 1. Authentication Feature Structure

#### Pages & Screens:

* **Authentication Page:**
  * Single consolidated entry point with tab-based navigation
  * Login tab (default view) with username and password fields
  * Registration tab with required fields for new account creation
  * Password visibility toggle for both login and registration
  * Remember me option and forgot password link

* **Profile Update Page:**
  * Optional first-time setup for new users
  * Form for entering optional profile information
  * Option to upload a profile image
  * Field for specifying research interests and expertise

* **Password Recovery Page:**
  * Email input for password reset link
  * Confirmation screen after reset request
  * Reset password form (accessed via emailed link)
  * Success notification after password change

#### Transitions & Interactions:

* **Landing → Authentication:** Unauthenticated users directed to Authentication Page
* **Tab Toggle:** Simple switch between Login and Registration views
* **Login → Review Manager Dashboard:** Successful login directs to the main application dashboard, which is the Review Manager Dashboard.
* **Registration → Profile Update:** New users prompted to complete profile (optional)
* **Profile Update → Review Manager Dashboard:** After completion or skip, users reach the Review Manager Dashboard.
* **Authentication → Password Recovery → Authentication:** Complete reset flow returns to login

### 2. UI Components

#### Authentication Layout

* **Header Section:**
  * Application logo and name
  * Brief description of the application
  * Language selector (for internationalization)

* **Content Section:**
  * Tab navigation between Login and Registration
  * Form fields with inline validation
  * Error messaging area for authentication failures
  * Action buttons (Login/Register/Reset)
  * OAuth provider buttons (prepared for Phase 2)

* **Footer Section:**
  * Brief terms of service summary
  * Privacy policy link
  * Help/support contact information

#### Login Component

* **Username Field:**
  * Clear labeling and placeholder text
  * Validation for required entry
  * Autocomplete support

* **Password Field:**
  * Masking with visibility toggle
  * Password strength indicator
  * Clear error messaging for failed attempts

* **Action Controls:**
  * Remember me checkbox
  * Forgot password link
  * Primary login button with loading state
  * Registration tab link

#### Registration Component

* **Required Fields:**
  * Username with availability checker
  * Password with strength requirements and confirmation
  * Agreement to terms checkbox

* **Optional Fields:**
  * Email address for recovery (recommended)
  * First and last name

* **Action Controls:**
  * Register button with loading state
  * Back to login link
  * Clear form option

### 3. Interaction Patterns

#### Form Validation

* **Inline Validation:**
  * Real-time feedback as users type
  * Username availability check
  * Password strength meter
  * Clear error messaging with resolution guidance

* **Submission Validation:**
  * Comprehensive check before form submission
  * Preventing multiple submissions
  * Graceful error handling with specific messages
  * Focus management after validation failures

#### Authentication Flow

* **Login Process:**
  * Submit credentials
  * Show loading indicator
  * Handle success or display specific errors
  * Maintain entered username on failure
  * Redirect to intended destination or dashboard

* **Registration Process:**
  * Submit registration details
  * Show processing indicator
  * Confirm successful account creation
  * Optional email verification (prepared for Phase 2)
  * Transition to profile completion

* **Session Management:**
  * Secure cookie-based session tracking
  * Automatic renewal of authentication tokens
  * Session timeout handling
  * Remember me functionality

### 4. Visual Design and Styling Guidelines

This section details the specific visual styling for the Authentication feature, drawing from the global Thesis Grey UI/UX Style Guide.

#### 4.1. General Colour System (from Style Guide)

*   **Primary action buttons (Login, Register):** Teal (`#6A9CAB`).
*   **Success indicators/messages:** Light Teal (`#8BBAC7`) or a dedicated green if specified for general UI.
*   **Error states/messages (e.g., validation errors):** Error Red (`#D64045`).
*   **Information states:** A designated blue (e.g., `#3B82F6` as previously mentioned, though the style guide primary palette should be checked for an info blue).
*   **Text Fields & Borders:**
    *   Light Mode: Input fields white with Light Taupe (`#CEC9BC`) border. Focus: Teal border. Text: Dark Charcoal (`#3C3F41`).
    *   Dark Mode: Input fields Slate (`#5D6977`) with darker borders. Focus: Teal border. Text: White (`#FFFFFF`).
*   **Page Backgrounds:**
    *   Light Mode: Pure White (`#FFFFFF`).
    *   Dark Mode: Dark Charcoal (`#3C3F41`).
*   **Card/Container Backgrounds (for Login/Signup form areas):**
    *   Light Mode: Light Taupe (`#CEC9BC`) or Pure White (`#FFFFFF`) with subtle shadows.
    *   Dark Mode: Slate (`#5D6977`) with deeper shadows.

#### 4.2. Typography (from Style Guide)

*   **Primary Font:** Inter (Sans-serif).
*   **Headings (e.g., "Log in to Thesis Grey", "Create an account"):**
    *   Light Mode: 24px (H1) or 20px (H2), Dark Charcoal (`#3C3F41`), Medium weight.
    *   Dark Mode: 24px (H1) or 20px (H2), White (`#FFFFFF`), Medium weight.
*   **Body Text (Labels, descriptive text):**
    *   Light Mode: 14px, Dark Charcoal (`#3C3F41`), Regular weight.
    *   Dark Mode: 14px, White (`#FFFFFF`), Regular weight.
*   **Small/Caption Text (e.g., "Remember me", forgot password link):**
    *   Light Mode: 12px, Slate Blue-Gray (`#5D6977`), Regular weight.
    *   Dark Mode: 12px, Light Taupe (`#CEC9BC`), Regular weight.

#### 4.3. Component Styling for Authentication

##### Buttons (Login, Register, Reset Password)

*   **Primary Button (e.g., "Login", "Sign Up"):**
    *   Light Mode: Teal (`#6A9CAB`) background, white text, subtle shadow. `padding: 8px 16px; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);`
    *   Dark Mode: Teal (`#6A9CAB`) background, white text, subtle glow. `box-shadow: 0 1px 5px rgba(106,156,171,0.2);`
    *   Hover: Light Teal (`#8BBAC7`).
    *   Active/Pressed: Dark Teal (`#4A7A89`).
    *   Disabled: Light Taupe (`#E4E0D5`) (light mode), Slate (`#5D6977`) (dark mode).
*   **Secondary/Link Buttons (e.g., "Forgot password?", "Back to login"):**
    *   Styled as links using Teal (`#6A9CAB`) for text color, with appropriate hover states (e.g., Light Teal or underline).

##### Form Controls (Username, Password, Email Inputs)

*   **Input Fields:**
    *   Light Mode: White (`#FFFFFF`) background, Light Taupe (`#CEC9BC`) border, Dark Charcoal (`#3C3F41`) text.
    *   Dark Mode: Slate (`#5D6977`) background, darker border (e.g., `#4A5662`), White (`#FFFFFF`) text.
    *   Focus (both modes): Teal (`#6A9CAB`) border (e.g., `focus:border-teal focus:ring-1 focus:ring-teal`).
    *   Padding: e.g., `px-3 py-2`.
    *   Border Radius: e.g., `rounded-md`.
*   **Labels:** Styled according to Body Text typography.
*   **Checkboxes (e.g., "Remember me", "Agree to terms"):**
    *   Selected: Teal (`#6A9CAB`) accent.
    *   Unselected: Slate Blue-Gray (`#5D6977`) border (light mode), Light Taupe (`#CEC9BC`) border (dark mode).

##### Cards/Containers (for the form area)

*   **Standard Card styling for the form container:**
    *   Light Mode: White (`#FFFFFF`) background, subtle shadow, Light Taupe (`#CEC9BC`) border (or no border if using shadow primarily). `border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); padding: 16px` (or more, e.g., `px-4 py-8 sm:px-10` as in existing examples).
    *   Dark Mode: Slate (`#5D6977`) background, darker shadow, darker border (e.g., `#3C3F41` or `#4A5662`). `box-shadow: 0 2px 8px rgba(0,0,0,0.2);`

#### 4.4. Mode Switching Considerations

*   The authentication pages must fully support the application's light/dark mode switching.
*   A toggle (e.g., sun/moon icon, typically in a shared header/layout) will control the mode.
*   User preference should be stored (e.g., in local storage) and system preference (`prefers-color-scheme`) used as a default.
*   Transitions between modes should be smooth (e.g., 150ms).

#### 4.5. Accessibility

*   **Contrast Ratios:** Adhere to WCAG AA standards.
    *   Light Mode: Dark Charcoal text on White, Dark Charcoal on Light Taupe.
    *   Dark Mode: White text on Dark Charcoal, White on Slate.
*   **Focus States:** All interactive elements (buttons, inputs, links) must have highly visible focus states using the Teal (`#6A9CAB`) outline.
*   **ARIA Attributes:** Use appropriate ARIA attributes for form fields, error messages, and dynamic content changes.
*   **Keyboard Navigation:** Ensure all parts of the authentication flow are fully navigable and operable using a keyboard.

#### 4.6. Information Hierarchy & Consistency

*   Clear visual distinction between required and optional fields.
*   Prominent primary actions (Login, Register buttons).
*   Secondary actions (e.g., "Forgot Password") styled appropriately to be less prominent but clearly interactive.
*   Error messages directly associated with relevant fields, using Error Red (`#D64045`).
*   Consistent spacing, alignment, and typography across all authentication screens, following the global style guide.
*   While Wasp's `LoginForm` and `SignupForm` provide base structures, they should be styled to match these Thesis Grey specific guidelines. This might involve custom CSS targeting Wasp's generated elements or wrapping them if necessary.

## Phase 2 Enhancements

### 1. Enhanced Authentication Options

#### OAuth Integration

* **Social Login Providers:**
  * Google OAuth integration
  * ORCID integration for academic users
  * Institutional SSO options
  * Clear visual distinction between provider options

* **Authentication Linking:**
  * Ability to link multiple authentication methods to one account
  * Management interface for connected accounts
  * Primary account designation
  * Secure account merging process

#### Advanced Security Features

* **Multi-factor Authentication:**
  * Optional MFA setup during registration or profile management
  * Support for authenticator apps
  * Recovery codes generation and management
  * Clear setup instructions with fallback options

* **Security Notifications:**
  * Email alerts for significant account actions
  * Unusual login detection and verification
  * Session management with active sessions list
  * Remote session termination capability

### 2. Role and Organization Management

#### User Role System

* **Role Management Interface:**
  * Global role display (Researcher, Admin)
  * Session-specific role display (Lead Reviewer, Reviewer)
  * Role change request workflow
  * Role permission explanations

* **Admin Controls:**
  * User search and filtering
  * Bulk role assignments
  * Account status management (active/suspended)
  * Access logs and audit trails

#### Organization Integration

* **Organization Selection:**
  * Organization dropdown during registration or profile update
  * Organization creation request workflow
  * Pending organization invitations display
  * Organization switching interface

* **Team Management:**
  * Team membership display
  * Team role indicators
  * Team invitation management
  * Default team selection

### 3. Profile Enhancement

#### Extended Profile Management

* **Comprehensive Profile Editor:**
  * Professional information (affiliations, position)
  * Research specialties and interests
  * Publication links
  * ORCID integration
  * Contact preferences

* **Visibility Controls:**
  * Profile information visibility settings
  * Granular privacy controls
  * Public profile option
  * Contact permission settings

#### User Preferences

* **Application Preferences:**
  * Theme selection (light/dark/system)
  * Language preference
  * Notification settings
  * Display density options
  * Default views and filters

* **Keyboard Shortcut Customization:**
  * Personalized keyboard shortcuts
  * Shortcut map display
  * Accessibility preferences
  * Input method preferences

### 4. Collaboration Features

#### Invitation Management

* **Invitation Dashboard:**
  * Pending invitations list
  * Historical invitations record
  * Batch invitation actions
  * Custom invitation messages

* **Access Requests:**
  * Request to join teams or organizations
  * Request status tracking
  * Request cancellation
  * Custom justification fields

#### Permission Management

* **Granular Permissions:**
  * Feature-based permission settings
  * Session-specific permission controls
  * Temporary access grants
  * Permission delegation

* **Permission Templates:**
  * Predefined permission sets
  * Custom template creation
  * Template assignment to users
  * Permission inheritance controls

## Implementation Guidelines

### Technical Approach

1. **Authentication Framework:**
   * JWT-based authentication through Wasp's auth system
   * Secure password hashing and storage
   * Session management with appropriate security controls
   * Role-based access control infrastructure

2. **Security Considerations:**
   * HTTPS enforcement
   * Protection against common vulnerabilities (CSRF, XSS)
   * Rate limiting for authentication attempts
   * Input sanitization and validation
   * Security headers implementation

3. **Accessibility Compliance:**
   * WCAG 2.1 AA compliance for all authentication interfaces
   * Keyboard navigation support
   * Screen reader compatibility
   * Focus management during form transitions
   * Clear error identification and resolution guidance

4. **Responsive Design:**
   * Mobile-optimized authentication forms
   * Touch-friendly input controls
   * Appropriate input types for mobile keyboards
   * Simplified flows for smaller screens

### Integration Points

1. **User Entity Integration:**
   * Direct integration with User, Role, and SessionMembership entities
   * Profile data mapping to user preferences
   * Role mapping to permission sets

2. **Feature Access Control:**
   * Authentication state checks for protected routes
   * Role-based component rendering
   * Permission-based action availability
   * Contextual UI adaptation based on user role

3. **Notification Integration:**
   * Authentication event notifications
   * Security alert delivery
   * Invitation and request notifications
   * Session status updates