# Authentication Feature: UX and UI Implementation Plan

---
**Phase:** Both (Core functionality in Phase 1, enhancements in Phase 2)
---

## Overview

The Authentication Feature establishes the entry point and identity management system for the Thesis Grey application. This implementation plan outlines a user-friendly authentication flow using the standard `Login Page` and `Signup Page`, focusing on security and usability. It leverages Wasp's built-in authentication and accommodates role-based access controls.

## Core Requirements

This section outlines the core functional and technical requirements for the Authentication feature, stratified by development phase. These requirements are derived from the overall project requirements (`project_docs/requirements/core_requirements.md`) and are specific to this feature's UI/UX implementation.

### Phase 1 Requirements

#### Functional Requirements
- **REQ-FR-AUTH-1:** System must provide a `Login Page` (`/login`) with username and password fields.
- **REQ-FR-AUTH-2:** System must provide a `Signup Page` (`/signup`) with username, password, and confirmation fields.
- **REQ-FR-AUTH-3:** System must provide a `User Profile Page` (`/profile`) for authenticated users to manage their account.
- **REQ-FR-AUTH-4:** System must redirect unauthenticated users to the `Login Page`.
- **REQ-FR-AUTH-5:** System must redirect authenticated users to the `Review Manager Dashboard` after successful login/signup.
- **REQ-FR-AUTH-6:** System must display appropriate error messages for authentication failures.
- **REQ-FR-AUTH-7:** System must provide password visibility toggle on login/signup forms.
- **REQ-FR-AUTH-8:** System must provide "Remember me" functionality on the login form.
- **REQ-FR-AUTH-9:** System must provide navigation between login and signup pages.
- **REQ-FR-AUTH-10:** System must support basic password change functionality on the profile page.

#### Technical Requirements
- **REQ-TR-AUTH-1:** System must use Wasp's built-in authentication components and hooks.
- **REQ-TR-AUTH-2:** System must implement JWT-based authentication.
- **REQ-TR-AUTH-3:** System must securely store and validate user credentials.
- **REQ-TR-AUTH-4:** System must provide proper form validation and error handling.

### Phase 2 Requirements (Enhancements)

#### Functional Requirements
- **REQ-FR-AUTH-P2-1:** System must support OAuth integration (Google, ORCID).
- **REQ-FR-AUTH-P2-2:** System must support Multi-Factor Authentication (MFA).
- **REQ-FR-AUTH-P2-3:** System must provide organization/team account creation and management.
- **REQ-FR-AUTH-P2-4:** System must support domain-based automatic team joining.
- **REQ-FR-AUTH-P2-5:** System must provide enhanced user profile management with academic/professional affiliations.
- **REQ-FR-AUTH-P2-6:** System must support public profile options with privacy settings.
- **REQ-FR-AUTH-P2-7:** System must provide administrative user management interface.
- **REQ-FR-AUTH-P2-8:** System must support session monitoring and management.
- **REQ-FR-AUTH-P2-9:** System must provide account recovery options.
- **REQ-FR-AUTH-P2-10:** System must support role-based access control within organizations.

#### Technical Requirements
- **REQ-TR-AUTH-P2-1:** System must implement secure OAuth provider integration.
- **REQ-TR-AUTH-P2-2:** System must support TOTP-based MFA implementation.
- **REQ-TR-AUTH-P2-3:** System must provide secure backup codes for MFA recovery.
- **REQ-TR-AUTH-P2-4:** System must implement organization/team data structures.
- **REQ-TR-AUTH-P2-5:** System must support secure session management and monitoring.

## Phase 1 Implementation

---
**Phase:** Phase 1
---

### 1. Authentication Feature Structure

#### Standard Pages:

*   **Login Page (`/login`):**
    *   Standard Wasp `LoginForm` component.
    *   Username and password fields.
    *   Password visibility toggle.
    *   "Remember me" option (if configured).
    *   Link to the `Signup Page`.
    *   Forgot password link/functionality (Wasp default or custom implementation).
*   **Signup Page (`/signup`):**
    *   Standard Wasp `SignupForm` component.
    *   Username, password, and password confirmation fields.
    *   Optional fields (like email) if configured in `main.wasp`.
    *   Link back to the `Login Page`.
*   **User Profile Page (`/profile`):** (Post-authentication)
    *   Accessed via navigation after login.
    *   Displays basic user information (e.g., username).
    *   Allows password updates.
    *   (Future enhancements can add more profile fields).
*   **(Optional) Password Recovery Pages:**
    *   Standard Wasp flow or custom implementation if needed.
    *   Typically involves an email input page, a confirmation message, and a password reset page accessed via email link.

#### Workflow & Transitions:

**Workflow (Login):**

1.  Unauthenticated user accesses the application or a protected route.
2.  User is redirected to the `Login Page` (`/login`).
3.  User enters credentials and submits the form.
4.  On successful login, the user is redirected to the `Review Manager Dashboard` (`/review-manager`), which serves as the central landing page.
5.  On failure, an error message is displayed on the `Login Page`.

*(Refer to `workflow.mmd` for the visual flow.)*

**Workflow (Signup):**

1.  User navigates to the `Signup Page` (`/signup`), typically via a link on the `Login Page`.
2.  User enters required details (username, password) and submits the form.
3.  On successful registration, the user is logged in and redirected to the `Review Manager Dashboard` (`/review-manager`).
4.  On failure (e.g., username taken), an error message is displayed on the `Signup Page`.

*(Refer to `workflow.mmd` for the visual flow.)*

**Navigation:**

*   Unauthenticated Access: Redirected to `/login`.
*   From `/login`: Link to `/signup`.
*   From `/signup`: Link to `/login`.
*   Successful Login/Signup: Redirect to `/review-manager`.
*   Authenticated Navigation: Access to `/profile` via user menu/navbar.

#### Role-Based Access (Phase 1):

*   **All Roles (Unauthenticated):** Can access `Login Page` (`/login`) and `Signup Page` (`/signup`).
*   **All Roles (Authenticated):** Can access `User Profile Page` (`/profile`) to manage their own account. Access to other application pages depends on specific role permissions defined elsewhere.

*(Refer to `project_docs/standards/role_access_matrix.md` for full details.)*

### 2. UI Components (Leveraging Wasp Auth Components)

#### Authentication Layout (Shared for Login/Signup Pages)

*   **Structure:** Typically a centered card/container holding the Wasp auth form.
    *   Application logo/name header.
    *   The `LoginForm` or `SignupForm` component.
    *   Links for toggling between Login/Signup.
    *   Optional footer with terms/privacy links.

#### Login Component (`LoginForm` from `wasp/client/auth`)

*   Provides standard username/password fields and submission logic.
*   Customization can be done via CSS/Tailwind targeting Wasp's generated class names or by wrapping the component.

#### Signup Component (`SignupForm` from `wasp/client/auth`)

*   Provides standard username/password/confirmation fields.
*   Handles registration logic.
*   Customization similar to `LoginForm`.

### 3. Interaction Patterns

#### Form Validation

*   Leverages Wasp's built-in validation for required fields, password matching, etc.
*   Error messages are displayed automatically by the Wasp components.

#### Authentication Flow

*   Handled primarily by Wasp's auth system (`useAuth`, `login`, `signup` functions).
*   Session management (cookies/tokens) is handled by Wasp.

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

*   The authentication interface should respect system preferences for light/dark mode.
*   If applicable, a manual toggle should be accessible but not prominent in the authentication screens.
*   Transitions between modes should be smooth (e.g., `transition: colors 0.3s ease-in-out`).

#### 4.5. Responsive Behavior

*   **Desktop Presentation:** Full-width form with generous whitespace, centered on page. Max width approximately 24rem (384px) for the form itself, contained in a wider card/container.
*   **Mobile Adjustments:** Full-width with smaller horizontal margins (e.g., 16px), vertical stacking of all elements, appropriately sized touch targets (minimum 44×44px for interactive elements).
*   **Tablet/Mid-size:** Similar to desktop but with slightly reduced whitespace.

### 5. Accessibility Considerations

*   Wasp's default components aim for accessibility.
*   Ensure custom wrappers or styling maintain accessibility standards (proper labels, keyboard navigation, contrast, etc.).
*   Follow general accessibility best practices outlined previously.

## Phase 2 Enhancements

---
**Phase:** Phase 2
---

### 1. Enhanced Authentication Methods

#### OAuth Integration

*   **Provider Selection:**
    *   Google authentication option
    *   ORCID integration for academic users
    *   Option to link existing accounts

*   **Provider-specific UI:**
    *   Branded provider buttons with icons
    *   Clear flow for authorization and permission requests
    *   Account linking interface for existing users

#### Multi-factor Authentication

*   **Setup Interface:**
    *   Step-by-step guide for enabling MFA
    *   QR code display for authenticator apps
    *   Backup codes generation and management

*   **Verification Interface:**
    *   Clear input field for verification codes
    *   Countdown timer for time-based codes
    *   Fallback options for access recovery

### 2. Team and Organization Management

#### Organization Creation & Management

*   **Organization Setup:**
    *   Organization profile creation form
    *   Branding upload options
    *   Domain verification for email-based automatic joining

*   **Member Management:**
    *   Directory of organization members
    *   Role assignment interface
    *   Invitation system for new members

#### Team Workspace Interface

*   **Team Navigation:**
    *   Team selector in global navigation
    *   Team-specific dashboard views
    *   Clear visual indicators of current context

*   **Collaboration Tools:**
    *   Access control management interface
    *   Activity feeds for team operations
    *   Resource sharing controls

### 3. Enhanced Profile Management

*   **Extended Profile Fields:**
    *   Academic/professional affiliations
    *   Research interests and specializations
    *   Publication links

*   **Public Profile Options:**
    *   Privacy settings management
    *   Profile visibility controls
    *   Connection/networking features (if implemented)

*   **Activity Dashboard:**
    *   User activity history and statistics
    *   Contribution metrics visualization
    *   Achievement/gamification elements (if implemented)

### 4. Administrative Control Panel

*   **User Management:**
    *   Admin view of all system users
    *   Account status controls (suspend, activate)
    *   Manual verification options

*   **System Monitoring:**
    *   Basic analytics dashboard
    *   Session monitoring tools
    *   Access logs and security alerts

*   **Configuration Options:**
    *   Global settings management
    *   Feature toggles for beta capabilities
    *   API access management 