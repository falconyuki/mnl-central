# MNL-Central Roadmap & Release Plan

## 1. Purpose

This document defines the development roadmap for MNL-Central from the current implementation through the first production release and subsequent product extensions.

The roadmap separates:

- development phases;
- production release scope;
- post-release enhancements;
- deferred work.

Development phase numbers are project planning identifiers and are not automatically semantic-version releases.

---

# 2. Versioning Strategy

MNL-Central follows Semantic Versioning:

```text
MAJOR.MINOR.PATCH
```

The first production release is:

```text
v1.0.0
```

Before `v1.0.0`, phase numbers describe development progress and do not necessarily correspond to released versions.

---

# 3. Release Philosophy

The project has two major product milestones:

```text
MNL-Central Core
        ↓
v1.0.0 Production Release
        ↓
Extended Administration
        ↓
v1.1.0+
```

The core product should be stable and production-ready before advanced role administration is introduced.

---

# 4. Phase Overview

The planned development sequence is:

```text
Phase 1   Project Foundation
Phase 2   Database & Domain Model
Phase 3   Authentication
Phase 4   Authorization & RBAC Foundation
Phase 5   Website Management
Phase 6   Customer Management
Phase 7   Campaign Management
Phase 8   Atomic Business Operations
Phase 9   Promotion & Receipt Workflow
Phase 10  Frontend Foundation
Phase 11  User Management
Phase 12  User Website Access
Phase 13  Role Discovery & User Integration
Phase 14  Audit Logging
Phase 15  Reporting
Phase 16  Frontend Workflow Completion
Phase 17  Production Hardening
Phase 18  Documentation & Release Preparation
Phase 19  v1.0.0 Production Release
Phase 20  Extended Role & Permission Management
```

Some phases may be completed earlier than their roadmap position during implementation. The roadmap describes the logical product progression rather than forcing already-completed work to be repeated.

---

# 5. Phase 1 — Project Foundation

## Objective

Establish the project structure and technology foundation.

## Scope

- repository structure;
- backend application foundation;
- frontend application foundation;
- environment/configuration structure;
- development tooling;
- basic application startup;
- foundational error handling;
- logging foundation;
- graceful shutdown.

## Completion Criteria

- backend starts correctly;
- frontend starts correctly;
- project structure is established;
- environment configuration works;
- foundational infrastructure is tested.

## Status

Completed.

---

# 6. Phase 2 — Database & Domain Model

## Objective

Establish the approved CRM database model.

## Scope

Create and validate the core schema:

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

## Completion Criteria

- migrations are operational;
- foreign keys are enforced;
- required constraints exist;
- authorization seed data exists;
- core domain relationships are established.

## Status

Completed.

---

# 7. Phase 3 — Authentication

## Objective

Provide secure user authentication.

## Scope

- login;
- authenticated user retrieval;
- password management;
- JWT authentication;
- token revocation;
- authentication middleware.

## Completion Criteria

- valid users can authenticate;
- invalid authentication is rejected;
- protected endpoints require authentication;
- logout/revocation works;
- password-change workflow works.

## Status

Completed.

---

# 8. Phase 4 — Authorization & RBAC Foundation

## Objective

Establish the authorization architecture.

## Scope

- roles;
- permissions;
- role/permission relationships;
- authorization context;
- permission middleware;
- website access authorization;
- administrator behavior.

## Completion Criteria

- permissions are enforced server-side;
- authorization context is constructed correctly;
- website access is respected;
- administrator behavior is correct;
- frontend is not treated as an authorization boundary.

## Status

Completed.

---

# 9. Phase 5 — Website Management

## Objective

Manage supported CRM websites.

## Scope

- website creation;
- website retrieval;
- website listing;
- website updates;
- website disabling;
- website lifecycle rules.

## Completion Criteria

- website CRUD behavior works where supported;
- Active/Disabled rules are enforced;
- disabled websites cannot be reactivated through the normal lifecycle;
- authorization is enforced.

## Status

Completed.

---

# 10. Phase 6 — Customer Management

## Objective

Centralize customer management.

## Scope

- customer creation;
- customer retrieval;
- customer listing;
- customer updates;
- customer status;
- website ownership;
- customer identity rules.

## Completion Criteria

- Website + Username uniqueness is enforced;
- username remains immutable;
- customer phone requirements are enforced;
- website authorization works;
- CRUD workflows are tested.

## Status

Completed.

---

# 11. Phase 7 — Campaign Management

## Objective

Implement campaign lifecycle and management.

## Scope

- campaign creation;
- campaign retrieval;
- campaign listing;
- campaign updates;
- campaign lifecycle;
- campaign website ownership;
- initial promotion requirement.

## Completion Criteria

- campaign lifecycle transitions are enforced;
- invalid transitions are rejected;
- campaign website is maintained;
- campaign creation with initial promotion is atomic;
- duplicate constraints work.

## Status

Completed.

---

# 12. Phase 8 — Atomic Business Operations

## Objective

Implement business operations that require multiple related records to succeed together.

## Scope

- transaction infrastructure;
- campaign + initial promotion;
- call attempt + discussion;
- relationship validation.

## Completion Criteria

- atomic operations succeed correctly;
- partial records are not left after failure;
- transaction rollback works;
- relationship validation occurs at the service/application layer.

## Status

Completed.

---

# 13. Phase 9 — Promotion & Receipt Workflow

## Objective

Complete the promotion lifecycle.

## Scope

- promotion management;
- promotion status;
- promotion receipts;
- campaign/participation relationship validation;
- receipt uniqueness.

## Completion Criteria

- promotions belong to valid campaigns;
- campaigns require at least one promotion;
- receipts reference valid promotion/participation relationships;
- duplicate receipts are rejected;
- receipt status is correctly enforced.

## Status

Completed.

---

# 14. Phase 10 — Frontend Foundation

## Objective

Establish the browser application foundation.

## Scope

- Vite;
- Vanilla JavaScript modules;
- Bootstrap;
- Bootstrap Icons;
- application shell;
- navigation;
- session handling;
- API client;
- login integration;
- logout.

## Completion Criteria

- frontend builds;
- login works;
- authenticated session is stored correctly;
- application shell works;
- navigation works;
- logout works.

## Status

Completed.

---

# 15. Phase 11 — User Management

## Objective

Provide administrative user management.

## Scope

- user listing;
- user retrieval;
- user creation;
- display-name updates;
- status management;
- role management;
- password reset.

## Completion Criteria

- user APIs are implemented;
- authorization is enforced;
- username remains immutable;
- user creation requires the approved fields;
- frontend list is integrated;
- Create User modal exists and validates correctly.

## Status

Completed.

---

# 16. Phase 12 — User Website Access

## Objective

Manage user-to-website authorization relationships.

## Scope

- list website access;
- grant access;
- revoke access;
- duplicate handling;
- website lifecycle validation.

## Completion Criteria

- relationship uniqueness is enforced;
- active website grant rule is enforced;
- revocation works;
- authorization is enforced.

## Status

Completed.

---

# 17. Phase 13 — Role Discovery & User Integration

## Objective

Expose legitimate role information required by User Management and the frontend.

## Current Problem

Roles exist in the database and are used internally by authorization, but there is currently no public role-discovery API.

The frontend must not hard-code role identifiers.

## Planned Scope

First inspect and confirm the smallest required capability.

If confirmed, implement:

```text
Role Repository
    ↓
Role Service
    ↓
Role Controller
    ↓
Role Route
    ↓
Frontend Role Service
    ↓
Create User Role Selector
```

The likely first capability is read-only role discovery.

## Important Constraint

Do not automatically implement role CRUD.

The existence of:

```text
ROLE_VIEW
ROLE_MANAGE
```

does not by itself define the complete CRUD contract.

Role administration requires a separate approved design.

## Completion Criteria

- role data is exposed through an approved API;
- frontend uses real role data;
- role IDs are not hard-coded;
- User creation can select a valid role;
- existing authorization behavior remains unchanged.

## Status

Next planned implementation phase.

---

# 18. Phase 14 — Audit Logging

## Objective

Complete system auditability.

## Scope

- audit repository;
- audit service/application integration;
- important event definitions;
- transaction participation;
- audit record creation;
- audit retrieval where required.

## Completion Criteria

- required operations produce audit records;
- sensitive information is not unnecessarily recorded;
- audit operations respect transaction boundaries;
- audit behavior is tested.

## Status

Deferred.

---

# 19. Phase 15 — Reporting

## Objective

Implement approved CRM reporting.

## Scope

At minimum:

- customers called;
- promotion received;
- conversion rate;
- date-range filtering;
- appropriate website scoping.

## Completion Criteria

The implementation matches the approved reporting definitions.

### Customers Called

Distinct customers with at least one call in the selected period.

### Promotion Received

Promotion receipt events during the selected period.

### Conversion Rate

```text
Distinct customers receiving at least one promotion
÷
Distinct customers called
× 100
```

## Status

Pending.

---

# 20. Phase 16 — Frontend Workflow Completion

## Objective

Complete the frontend representation of the implemented CRM workflows.

## Scope

- user management UI;
- website access UI;
- role integration;
- user actions;
- remaining CRM views;
- campaign workflows;
- call/discussion workflows;
- promotion workflows;
- reporting UI.

## Completion Criteria

- frontend workflows consume real APIs;
- loading states work;
- empty states work;
- error states work;
- forms submit correctly;
- backend authorization remains authoritative.

## Status

In progress.

---

# 21. Phase 17 — Production Hardening

## Objective

Prepare the application for production operation.

## Scope

- centralized database constraint error normalization;
- pagination hardening;
- page-size limits;
- operational logging;
- error handling review;
- graceful shutdown verification;
- CORS verification;
- security review;
- regression testing;
- production configuration review.

## Future Infrastructure Consideration

The current JWT revocation implementation is process-local.

Persistent/distributed token revocation may require future infrastructure work, but this must not be implemented through an unapproved schema redesign.

## Completion Criteria

- known production risks are addressed;
- regression suite passes;
- configuration is reviewed;
- no sensitive configuration is committed.

## Status

Pending.

---

# 22. Phase 18 — Documentation & Release Preparation

## Objective

Ensure the project can be maintained and operated professionally.

## Documentation Set

The project documentation should include, where applicable:

```text
README.md
docs/
├── PROJECT_REQUIREMENTS.md
├── DATABASE_SCHEMA.md
├── API_SPECIFICATION.md
├── ARCHITECTURE.md
├── DEVELOPMENT_GUIDE.md
└── ROADMAP.md
```

Additional feature-specific documentation should only be created when it provides meaningful value.

## Completion Criteria

- documentation reflects actual implementation;
- completed and planned features are distinguished;
- sensitive information is excluded;
- release scope is documented;
- version is prepared for production.

## Status

In progress.

---

# 23. Phase 19 — v1.0.0 Production Release

## Objective

Release the complete core MNL-Central product.

## v1.0.0 Scope

The first production release should include:

- authentication;
- authorization;
- RBAC foundation;
- website management;
- customer management;
- campaign management;
- campaign participation;
- call attempts;
- campaign discussions;
- promotions;
- promotion receipts;
- user management;
- user website access;
- role discovery required by User Management;
- audit logging;
- reporting;
- completed frontend workflows;
- production hardening;
- complete project documentation.

## Release Criteria

`v1.0.0` should not be released until:

1. required core features are implemented;
2. critical workflows are tested;
3. authorization is verified;
4. data integrity is verified;
5. frontend workflows are functional;
6. production hardening is complete;
7. documentation reflects the actual release;
8. no known release-blocking defects remain.

---

# 24. Phase 20 — Extended Role & Permission Management

## Objective

Extend the system beyond the fixed system-role model to support controlled role administration.

This is the major planned post-v1.0.0 authorization extension.

---

## 24.1 Role Management

Potential capabilities:

```text
List Roles
View Role
Create Role
Update Role
```

The exact API contract must be designed before implementation.

---

## 24.2 Role Permission Management

Potential capabilities:

```text
View Role Permissions
Assign Permission to Role
Remove Permission from Role
Replace Role Permission Set
```

The exact operations must be determined from the approved domain requirements.

---

## 24.3 Custom Roles

The extended system may allow administrators to create additional roles beyond the initial seeded roles.

Example conceptual model:

```text
System Roles
    ├── Administrator
    ├── Team Leader
    ├── CRM Staff
    └── Customer Service

Custom Roles
    ├── ...
    └── ...
```

Custom roles must still use the existing permission architecture.

A second authorization mechanism must not be introduced.

---

## 24.4 Role Administration UI

The frontend may eventually provide:

```text
Roles
 ├── Role List
 ├── Role Details
 ├── Create Role
 ├── Edit Role
 └── Permission Assignment
```

The UI must consume backend authorization and role APIs rather than implementing authorization rules locally.

---

## 24.5 Extended RBAC Release

The first release containing this expanded capability may be:

```text
v1.1.0
```

provided the changes are backward compatible with the v1.0.0 API and domain.

If the extension requires incompatible API or domain changes, the appropriate major/minor version must be determined according to Semantic Versioning.

---

# 25. Deferred Work

The following items remain intentionally deferred unless a concrete requirement promotes them:

- persistent/distributed JWT revocation;
- expanded infrastructure changes;
- schema redesign;
- unrelated architectural refactoring;
- speculative frontend permission systems;
- arbitrary role CRUD before role requirements are approved.

---

# 26. Roadmap Governance

The roadmap is a living project document.

When scope changes:

1. identify the requirement;
2. determine its impact;
3. decide whether it belongs in the current release or a future release;
4. update this roadmap;
5. update affected technical documentation;
6. implement only after the scope decision is clear.

---

# 27. Roadmap Rule

The roadmap does not override the source code or approved domain requirements.

It provides project direction.

Actual implementation status must always be verified against the current repository.

---

# 28. Current Priority

The immediate development sequence is:

```text
Role / Permission backend inspection
        ↓
Confirm minimal role-discovery capability
        ↓
Implement role discovery
        ↓
Test
        ↓
Populate frontend Role selector
        ↓
Test
        ↓
Wire Create User submission
        ↓
Test
        ↓
Continue User Management UI
```

Audit logging remains deferred.

The extended custom-role and editable-permission system remains post-v1.0.0 scope.
