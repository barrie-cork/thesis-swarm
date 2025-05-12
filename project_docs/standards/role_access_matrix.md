# Role-Access Matrix

This document maps user roles to accessible pages and features within Thesis Grey, noting differences between Phase 1 and Phase 2.

## Roles

*   **User**: Basic access role.
*   **Researcher**: Manages search strategy and execution.
*   **Reviewer**: Focuses on reviewing and tagging results.
*   **Lead Reviewer**: Oversees the review process (primarily Phase 2).
*   **Admin**: Full system administration capabilities.

## Access Control

| Page/Feature                    | User (P1) | Researcher (P1) | Reviewer (P1) | Admin (P1) | User (P2) | Researcher (P2) | Reviewer (P2) | Lead Reviewer (P2) | Admin (P2) |
| :------------------------------ | :-------: | :-------------: | :-----------: | :--------: | :-------: | :-------------: | :-----------: | :----------------: | :--------: |
| **Authentication**              |           |                 |               |            |           |                 |               |                    |            |
| Login Page                      |    ✅    |        ✅        |      ✅      |     ✅    |    ✅    |        ✅        |      ✅      |         ✅        |     ✅    |
| Signup Page                     |    ✅    |        ✅        |      ✅      |     ✅    |    ✅    |        ✅        |      ✅      |         ✅        |     ✅    |
| User Profile Page               |    ✅    |        ✅        |      ✅      |     ✅    |    ✅    |        ✅        |      ✅      |         ✅        |     ✅    |
| **Search Strategy**             |           |                 |               |            |           |                 |               |                    |            |
| Search Strategy Page (View Own) |    ✅    |        ✅        |      ✅      |     ✅    |    ✅    |        ✅        |      ✅      |         ✅        |     ✅    |
| Search Strategy Page (Create)   |    ❌    |        ✅        |      ❌      |     ✅    |    ❌    |        ✅        |      ❌      |         ❌        |     ✅    |
| **Search Execution**            |           |                 |               |            |           |                 |               |                    |            |
| Search Execution Status Page    |    ✅    |        ✅        |      ✅      |     ✅    |    ✅    |        ✅        |      ✅      |         ✅        |     ✅    |
| Execute Search                  |    ❌    |        ✅        |      ❌      |     ✅    |    ❌    |        ✅        |      ❌      |         ❌        |     ✅    |
| **Results Management**          |           |                 |               |            |           |                 |               |                    |            |
| Results Overview Page           |    ✅    |        ✅        |      ✅      |     ✅    |    ✅    |        ✅        |      ✅      |         ✅        |     ✅    |
| Process Results                 |    ❌    |        ✅        |      ❌      |     ✅    |    ❌    |        ✅        |      ❌      |         ❌        |     ✅    |
| **Review Results**              |           |                 |               |            |           |                 |               |                    |            |
| Review Interface Page           |    ✅    |        ✅        |      ✅      |     ✅    |    ✅    |        ✅        |      ✅      |         ✅        |     ✅    |
| Add/Remove Tags                 |    ❌    |        ❌        |      ✅      |     ✅    |    ❌    |        ❌        |      ✅      |         ✅        |     ✅    |
| Add Notes                       |    ❌    |        ❌        |      ✅      |     ✅    |    ❌    |        ❌        |      ✅      |         ✅        |     ✅    |
| Manage Tags (Admin)             |    ❌    |        ❌        |      ❌      |     ✅    |    ❌    |        ❌        |      ❌      |         ✅        |     ✅    |
| **Reporting**                   |           |                 |               |            |           |                 |               |                    |            |
| Reporting Page                  |    ✅    |        ✅        |      ✅      |     ✅    |    ✅    |        ✅        |      ✅      |         ✅        |     ✅    |
| **Phase 2 Features**            |           |                 |               |            |           |                 |               |                    |            |
| Session Hub Page                |    N/A    |       N/A       |      N/A      |    N/A    |    ✅    |        ✅        |      ✅      |         ✅        |     ✅    |
| Collaboration Features          |    N/A    |       N/A       |      N/A      |    N/A    |    TBD    |       TBD       |      TBD      |        TBD       |    TBD    |
| Advanced Review Tools           |    N/A    |       N/A       |      N/A      |    N/A    |    TBD    |       TBD       |      TBD      |        TBD       |    TBD    |
| **Administration**              |           |                 |               |            |           |                 |               |                    |            |
| User Management                 |    ❌    |        ❌        |      ❌      |     ✅    |    ❌    |        ❌        |      ❌      |         ❌        |     ✅    |

*   ✅ = Access Granted
*   ❌ = Access Denied
*   N/A = Not Applicable for this Phase
*   TBD = To Be Determined 