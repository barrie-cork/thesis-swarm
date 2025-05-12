# Naming Conventions and Standards

This document defines the standard terminology, naming conventions, and phase designations for the Thesis Grey project.

## Authoritative Source

The master workflow diagram (`workflow.mmd`) is the authoritative source for workflow steps and page names where applicable.

## Standard Page Names

*   **Login Page**: `/login`
*   **Signup Page**: `/signup`
*   **Search Strategy Page**: `/search-strategy` (Manages search sessions and queries)
*   **Search Execution Status Page**: `/search-execution/:sessionId` (Shows status of query executions for a session)
*   **Results Overview Page**: `/results-overview/:sessionId` (Displays processed results for a session)
*   **Review Interface Page**: `/review/:resultId` (Detailed view and tagging for a single result)
*   **Reporting Page**: `/reporting/:sessionId` (Generates reports and statistics for a session)
*   **User Profile Page**: `/profile`
*   *(Phase 2)* **Session Hub Page**: `/session-hub` (Central dashboard for Phase 2)
*   *(Add other standard names as defined)*

## Workflow Terminology

*   **Search Session**: The overall container for a research topic.
*   **Search Query**: A specific query string run within a session.
*   **Search Execution**: An instance of running a search query.
*   **Raw Result**: A result directly from the search API.
*   **Processed Result**: A normalized and potentially deduplicated result.
*   **Review Tag**: A label applied during the review process.
*   *(Add other standard terms)*

## Phase Designations

*   **Phase 1**: Initial core functionality (Search, Execution, Basic Review, Reporting).
*   **Phase 2**: Enhanced features (Advanced Review, Collaboration, Session Hub).
*   Features/UI elements specific to a phase should be clearly marked `(Phase 1)` or `(Phase 2)`.

## Role Definitions

*   **User**: Basic access, can view own sessions and results. (Phase 1)
*   **Researcher**: Can create/manage sessions, execute searches, perform initial review. (Phase 1 & 2)
*   **Reviewer**: Can apply tags and notes during review. (Phase 1 & 2)
*   **Lead Reviewer**: Can manage tags, resolve conflicts, oversee review process. (Phase 2)
*   **Admin**: Full system access, user management. (Phase 1 & 2) 