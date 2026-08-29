# MNL-Central Architecture

## 1. Purpose

This document describes the architecture of MNL-Central and the responsibilities of its major application layers.

The architecture is intentionally documented at a level that explains system design without exposing sensitive infrastructure configuration or security-sensitive operational details.

---

# 2. System Overview

MNL-Central consists of two primary application layers:

```text
Frontend
   ↓
REST API
   ↓
Backend
   ↓
Database
```

The frontend is a browser-based Vanilla JavaScript application.

The backend provides the authoritative application and authorization boundary.

The database stores persistent domain information.

---

# 3. Technology Stack

## Backend

- Node.js
- Express
- JavaScript ES Modules
- REST API
- `@libsql/client`
- JWT
- bcrypt
- CORS

The backend package is an ES-module application and uses the established Node/Express architecture.

---

## Frontend

- HTML5
- CSS3
- Vanilla JavaScript
- ES Modules
- Vite
- Bootstrap 5.3.8
- Bootstrap Icons 1.13.1

The frontend does not use a JavaScript UI framework.

---

# 4. Backend Layering

The backend follows:

```text
Routes
  ↓
Middleware
  ↓
Controllers
  ↓
Services
  ↓
Repositories
  ↓
Database
```

Each layer has a defined responsibility.

---

# 5. Routes

Routes define HTTP endpoints and compose the request pipeline.

A typical protected endpoint follows:

```text
Authentication
→ Permission
→ Validation
→ Controller
```

Routes should not contain business logic or direct database access.

---

# 6. Authentication Middleware

Authentication determines whether a request has a valid authenticated identity.

Authentication is responsible for:

- validating the authentication token;
- handling token revocation;
- loading the current authenticated user;
- placing the authenticated user on the request.

Authentication does not replace authorization.

---

# 7. Authorization

Authorization is a separate layer.

The authenticated user is used to construct an authorization context.

The authorization context contains the information required for permission and website-access decisions.

Conceptually:

```text
req.user
   ↓
buildAuthorizationContext()
   ↓
authorizationContext
   ↓
permission/resource authorization
```

The request authentication identity must not be treated as the authorization context.

---

# 8. Permission Authorization

Permission checks use the established authorization middleware.

The general pattern is:

```text
requireAuthentication
    ↓
requirePermission(permission)
```

For resource-specific operations, authorization may additionally use the relevant website identifier.

The Administrator role has the established global authorization behavior.

Non-administrative users are subject to website access restrictions where applicable.

---

# 9. Validation

Validation occurs before application/business processing.

Validation responsibilities include:

- request body validation;
- query validation;
- path parameter validation;
- enum/status validation;
- required-field validation;
- basic input normalization where established.

Validation must not replace business-rule validation.

---

# 10. Controllers

Controllers are intentionally thin.

A controller should primarily:

1. receive the validated HTTP request;
2. obtain required request/context information;
3. call the appropriate service/application operation;
4. return the established HTTP response.

Controllers should not:

- execute raw database queries;
- implement domain rules;
- duplicate authorization logic;
- resolve complex domain relationships that belong in the service layer.

---

# 11. Services / Application Layer

The service/application layer owns business rules and application orchestration.

Examples include:

- customer identity validation;
- campaign lifecycle enforcement;
- campaign/promotion atomic creation;
- campaign participation validation;
- discussion relationship resolution;
- promotion receipt relationship validation;
- user management rules;
- user website access rules.

Complex multi-step operations use the established transaction abstraction.

---

# 12. Repositories

Repositories own database access.

Repositories are responsible for:

- querying;
- inserting;
- updating;
- deleting relationships where explicitly supported;
- mapping database records to domain/application objects.

Repositories should not become the primary location for business policy.

---

# 13. Domain Object Naming

Database columns use snake_case.

Application/domain objects use camelCase.

Example:

```text
database:
campaign_participation_id

domain:
campaignParticipationId
```

Repository boundaries perform the mapping.

---

# 14. User Repository Exception

User-related operations intentionally use the established `userRepository`.

This repository serves both authentication-oriented user retrieval and user-management operations.

A separate user-management repository should not be introduced merely for organizational style.

---

# 15. Transactions

Atomic business operations use the established transaction abstraction.

Important examples include:

```text
Campaign
+
Initial Promotion
```

and:

```text
Call Attempt
+
Campaign Discussion
```

A transaction is used where the domain requires all participating operations to succeed or fail together.

---

# 16. Database

The database is the persistent source of truth for application state.

The core domain contains:

```text
users
roles
permissions
role_permissions
user_website_access
websites
customers
campaigns
campaign_participations
call_attempts
campaign_discussions
promotions
promotion_receipts
audit_logs
```

The schema is managed through migrations.

---

# 17. Frontend Architecture

The frontend uses a modular Vanilla JavaScript architecture.

The application is divided into concerns such as:

```text
Views
Services
API Client
Navigation
Session
Application orchestration
```

The frontend communicates with the backend through the REST API.

The frontend does not access the database directly.

---

# 18. Frontend API Client

HTTP communication is centralized through the existing API client.

Feature-specific services call the shared API client.

For example:

```text
User View
    ↓
userService
    ↓
apiClient
    ↓
REST API
```

A second independent HTTP abstraction should not be introduced without a demonstrated architectural requirement.

---

# 19. Frontend Session

The frontend maintains the established authenticated session using the existing application session mechanism.

The current user representation contains identity and role information.

It does not contain a permissions array.

The frontend therefore must not invent role-to-permission mappings.

---

# 20. Frontend Authorization Boundary

Frontend navigation and visibility are user-interface concerns only.

They are not security controls.

The backend remains authoritative for:

- authentication;
- permissions;
- website access;
- resource authorization.

A hidden frontend button must never be treated as protection against unauthorized API requests.

---

# 21. Navigation

The frontend uses the established view/navigation architecture.

Navigation identifiers resolve to application view definitions.

The main content area is replaced by the selected view.

No routing framework is required by the current architecture.

---

# 22. Error Handling

Backend errors are processed through centralized error handling.

Frontend services and views should consume the established API error contract.

Individual feature views should not create unrelated error-response formats.

---

# 23. Logging

Structured application logging is part of the backend architecture.

Logging should provide operational visibility without exposing secrets or sensitive authentication information.

---

# 24. Graceful Shutdown

The backend supports graceful shutdown behavior.

Shutdown handling must allow active application resources to close cleanly according to the established server/database lifecycle.

---

# 25. Configuration

Application configuration is supplied through the established environment/configuration mechanism.

Sensitive values must not be committed to the repository.

Documentation must describe configuration concepts rather than publish actual secret values.

---

# 26. Security Architecture

The security model is based on several independent controls:

```text
Authentication
    +
Permission Authorization
    +
Website Authorization
    +
Input Validation
    +
Database Constraints
    +
Business Rules
```

No single frontend control is considered sufficient for security.

---

# 27. Multi-Website Authorization

Website access is represented as a relationship between users and websites.

The authorization context loads the applicable website access.

For non-administrative users, access to a website-scoped resource requires the applicable website to be active and accessible.

This prevents frontend-only website filtering from becoming the authorization mechanism.

---

# 28. Domain Boundary

The application distinguishes between:

### Authentication

"Who is this user?"

### Authorization

"Is this user allowed to perform this operation on this resource?"

### Business Logic

"Is this operation valid according to the domain?"

### Persistence

"How is the resulting state stored?"

These concerns should remain separated.

---

# 29. Architectural Invariants

The following rules are architectural invariants:

1. Repositories own database access.
2. Services own business rules.
3. Controllers remain thin.
4. Authentication and authorization remain separate.
5. Authorization uses the established authorization context.
6. Resource authorization is performed at the appropriate service/middleware boundary.
7. Domain objects use camelCase.
8. Existing transaction infrastructure is reused.
9. The frontend does not access the database.
10. The frontend does not become an authorization authority.
11. Existing working architecture is not redesigned without a demonstrated requirement.
12. Database schema changes require explicit approval.

---

# 30. Extension Architecture

Future role-management functionality is expected to build on the existing role and permission model.

The planned direction is:

```text
Role
   ↓
Role Permissions
   ↓
Permissions
```

Future functionality may introduce:

```text
Role Discovery
Role Creation
Role Editing
Permission Assignment
Permission Removal
Role Administration UI
```

These capabilities must reuse the existing authorization/domain architecture.

They must not bypass or replace the existing authorization context.

---

# 31. Architectural Change Policy

Architectural changes require evidence that the current architecture cannot satisfy the requirement appropriately.

Before changing architecture:

1. inspect the existing implementation;
2. identify the limitation;
3. inspect neighboring established patterns;
4. identify the smallest viable change;
5. evaluate compatibility;
6. obtain approval where the change affects the locked architecture;
7. implement incrementally;
8. test;
9. update this document.

Style preference alone is not sufficient reason to re-architect working code.
