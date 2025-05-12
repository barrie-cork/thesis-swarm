# Documentation Update Templates

These templates provide standard text snippets to ensure consistency when updating project documentation.

## 1. Phase Designation Header

Use this at the top of documents or sections describing features specific to a phase.

```markdown
---
**Phase:** [Phase 1 / Phase 2 / Both]
---
```

## 2. Workflow Description Template

When describing a user flow, reference the standard page names and `workflow.mmd`.

**Example:**

```markdown
**Workflow:**

1.  The user navigates from the `[Starting Page Name]` to the `[Current Page Name]`.
2.  On the `[Current Page Name]`, the user [performs an action].
3.  Upon completion, the user is directed to the `[Next Page Name]`.

*(Refer to `workflow.mmd` for the complete visual flow.)*
```

## 3. Navigation Path Template

Use consistent breadcrumbs or path descriptions.

**Example (Breadcrumb):**

```markdown
**Navigation:** `Dashboard > Search Sessions > [Session Name] > Search Strategy`
```

**Example (Descriptive):**

```markdown
**Access:** This page is accessed by clicking the 'Execute Searches' button on the `Search Strategy Page`.
```

## 4. Role-Based Access Template

Include a section detailing which roles can access the described feature/page, referencing the `role_access_matrix.md`.

**Example:**

```markdown
**Role-Based Access (Phase 1):**

*   **Researcher**: Can create, view, edit, and execute searches.
*   **Admin**: Full access.
*   **User/Reviewer**: View-only access.

**Role-Based Access (Phase 2):**

*   **Lead Reviewer**: Can manage strategy, execution, and settings.
*   **Researcher**: Can contribute to strategy (if enabled), view execution.
*   **Reviewer**: View-only access.
*   **Admin**: Full access.

*(Refer to `project_docs/standards/role_access_matrix.md` for full details.)*
```

*Remember to tailor the specific roles and permissions based on the feature being documented and the phase.* 