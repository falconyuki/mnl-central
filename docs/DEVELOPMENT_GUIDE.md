# MNL-Central Development Guide

## 1. Purpose

This document defines the development standards and workflow for MNL-Central.

The purpose is to keep implementation consistent, controlled, testable, maintainable, and aligned with the approved project architecture.

This document applies to backend, frontend, database, API, authorization, and documentation changes.

---

# 2. Core Development Principle

MNL-Central follows an inspection-first development process.

The standard workflow is:

```text
Inspect
  ↓
Understand
  ↓
Determine the smallest required change
  ↓
Implement
  ↓
Test
  ↓
Verify
  ↓
Document
  ↓
Proceed
```

Development must not begin by assuming how the existing application works.

The actual current source is the source of truth for implementation details.

---

# 3. Source-of-Truth Hierarchy

When determining how the application should behave, use the following priority:

1. Approved project/domain requirements
2. Locked database/domain rules
3. Existing tested implementation
4. Existing API contracts
5. Established neighboring implementation patterns
6. Documentation
7. Developer assumptions

Documentation must not be used to justify changing working source code when the actual implementation has already established a valid behavior.

If documentation and implementation disagree, investigate the discrepancy and update the documentation or implementation according to the approved requirement.

---

# 4. Inspection Before Implementation

Before implementing a new feature or modifying an existing feature, inspect the relevant layers.

For a backend feature, normally inspect:

```text
Route
Controller
Validation
Service
Repository
Related repositories
Authorization
Database schema/migrations
Existing tests or Postman coverage
```

For a frontend feature, normally inspect:

```text
View
Navigation
Feature service
Shared API client
Session handling
Existing UI patterns
Relevant backend API
```

For a cross-layer feature, inspect both backend and frontend before making the first change.

---

# 5. New Area Inspection Rule

When starting a new functional area, perform one thorough inspection of all relevant dependencies and layers before implementation.

After the area has been sufficiently inspected, do not repeatedly stop for unnecessary repository inspections after every small change.

Instead:

```text
Thorough area inspection
        ↓
Isolated implementation
        ↓
Test
        ↓
Next isolated implementation
```

This provides both architectural awareness and efficient development.

---

# 6. No Speculative Changes

Do not modify code because a change:

- appears cleaner;
- appears more modern;
- might be useful later;
- could theoretically prevent a future problem;
- makes the frontend easier without a backend requirement;
- resembles a pattern from another project.

A change must have an identifiable requirement or verified implementation defect.

---

# 7. Small Isolated Changes

Changes should be implemented in small logical units.

Examples:

```text
Repository
    ↓
test
    ↓
Service
    ↓
test
    ↓
Controller
    ↓
test
    ↓
Routes
    ↓
test
```

For frontend work:

```text
Service integration
    ↓
test
    ↓
View integration
    ↓
test
    ↓
User interaction
    ↓
test
```

Do not combine unrelated features into one change merely because they belong to the same screen.

---

# 8. Backend Layer Responsibilities

## Routes

Routes define endpoint composition and middleware.

Routes should not contain business logic or database operations.

---

## Controllers

Controllers remain thin.

They should:

- receive the request;
- obtain validated request data;
- obtain authentication/authorization context;
- call the appropriate service;
- return the established response.

Controllers should not become repositories or business-rule engines.

---

## Services

Services own application and domain rules.

Business invariants should be enforced here where appropriate.

Services may coordinate multiple repositories.

Atomic operations should use the established transaction abstraction.

---

## Repositories

Repositories own database access.

Repositories should:

- execute database queries;
- perform persistence operations;
- map database records into application/domain objects;
- expose focused persistence operations.

Repositories should not become the primary location for application business rules.

---

# 9. Repository Naming and Reuse

Before creating a repository, inspect existing repositories for the same domain.

Do not create a second repository for an area that already has an established repository unless there is a demonstrated requirement.

For example, user-related operations intentionally use the existing `userRepository`.

Do not create a separate user-management repository merely for organizational preference.

---

# 10. Domain Naming

Database columns use snake_case.

Application/domain objects use camelCase.

Example:

```text
database:
campaign_participation_id

application:
campaignParticipationId
```

Mappings belong at the persistence/application boundary.

Do not introduce inconsistent naming into neighboring modules.

---

# 11. Validation

Validation must happen before business processing.

Validation should establish that the request has the correct structure and acceptable basic values.

Business rules remain the responsibility of the service/application layer.

Do not move domain rules into validation simply because they can technically be expressed there.

---

# 12. Authorization

Authentication and authorization are separate concerns.

Authentication answers:

```text
Who is the user?
```

Authorization answers:

```text
Is this user allowed to perform this operation?
```

The authenticated `req.user` object must not be treated as the complete authorization context.

The established authorization process must be reused.

Do not create duplicate authorization logic in individual controllers or frontend code.

---

# 13. Resource Authorization

Website-scoped resources must use the established resource authorization mechanism.

The standard concept is:

```text
Authentication
    ↓
Authorization Context
    ↓
Permission
    ↓
Resource / Website Authorization
```

Do not make the general authentication middleware automatically perform resource-specific authorization.

---

# 14. Frontend Authorization

The frontend is not an authorization boundary.

UI decisions such as:

- hiding buttons;
- hiding navigation items;
- disabling controls;

must never be treated as backend security.

The backend must independently enforce authorization.

Do not hard-code role-to-permission mappings in the frontend.

Do not invent permission information that is not part of the established frontend/session/API contract.

---

# 15. Frontend API Integration

Feature-specific frontend services must use the existing shared API client.

Do not create a second HTTP abstraction for individual features.

The frontend should consume the actual backend contract.

Do not invent:

- response fields;
- request fields;
- endpoints;
- permissions;
- role identifiers;
- filtering parameters.

If the frontend requires information that the backend does not expose, first determine whether the information is actually an approved domain/API requirement.

---

# 16. Database Changes

The database schema is locked unless a change is explicitly approved.

Before proposing a schema change:

1. inspect the existing schema;
2. inspect relevant migrations;
3. inspect existing repositories;
4. identify why the current model cannot satisfy the requirement;
5. determine whether the requirement can be satisfied without a schema change.

Do not add fields or tables merely to make frontend implementation easier.

Approved schema changes must use migrations.

---

# 17. Transactions

Use the established transaction abstraction for operations that must succeed or fail together.

Examples include:

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

Do not manually implement an unrelated transaction abstraction when the existing infrastructure already satisfies the requirement.

---

# 18. Testing

Every isolated implementation change must be tested before proceeding to the next dependent change.

Testing should verify:

### Happy path

The intended valid operation succeeds.

### Validation

Invalid input is rejected correctly.

### Authorization

Unauthorized operations are rejected.

### Business rules

Domain invariants are enforced.

### Relationships

Related records are validated correctly.

### Database integrity

Relevant uniqueness and foreign-key constraints behave correctly.

### Regression

Existing functionality remains operational.

---

# 19. Testing Status

During development, use clear test conclusions.

Preferred status language:

```text
Normal
```

when the tested behavior works as expected.

If a problem occurs:

```text
Error
```

or describe the specific failure.

Do not mark a feature complete merely because the code has no syntax errors.

---

# 20. Postman / API Testing

API endpoints should be tested through the established API testing workflow.

Tests should verify:

- authentication;
- authorization;
- request validation;
- successful response;
- invalid request behavior;
- business-rule failures;
- relevant relationship constraints.

Where an endpoint is protected, test with both authorized and unauthorized scenarios where appropriate.

---

# 21. Frontend Testing

Frontend feature testing should verify:

- navigation;
- loading state;
- successful API response;
- empty state;
- error state;
- user interaction;
- modal behavior where applicable;
- form validation;
- API submission;
- successful state update;
- logout/session behavior where relevant.

A successful build is not by itself proof that the feature works.

---

# 22. Build Verification

After meaningful frontend changes, verify:

```text
npm run build
```

The build must complete successfully before considering the affected frontend work complete.

Do not reopen already resolved build configuration problems unless a new concrete failure occurs.

---

# 23. Error Handling

Use the existing centralized backend error-handling architecture.

Do not create unrelated error-response formats inside individual controllers.

New errors should use the established application error conventions.

---

# 24. Security Rules

Security-sensitive information must never be committed to source control or documentation.

Do not document:

- passwords;
- password hashes;
- JWT secrets;
- private API keys;
- database credentials;
- private connection strings;
- environment secrets;
- security bypass procedures;
- information whose primary purpose would be to circumvent authorization.

Documentation should explain security architecture and legitimate usage without providing a bypass path.

---

# 25. Environment Configuration

Environment-specific configuration must remain outside committed sensitive configuration.

Use the established environment/configuration mechanism.

Example configuration names may be documented when useful, but actual secret values must never be included.

---

# 26. Git Workflow

The developer controls commits and pushes.

The assistant must not:

- commit changes;
- push changes;
- rewrite Git history;

unless the user explicitly requests the operation.

Normal development flow:

```text
Implement locally
    ↓
Test locally
    ↓
Verify
    ↓
User commits
    ↓
User pushes
```

---

# 27. Git Scope

A commit should represent a coherent change.

Avoid mixing unrelated changes such as:

```text
User Management
+
Campaign changes
+
Documentation
+
Unrelated refactoring
```

unless there is a clear reason to combine them.

---

# 28. Documentation Updates

Documentation is part of the development process.

When an implemented change affects:

- requirements;
- database behavior;
- API behavior;
- architecture;
- user workflow;
- release status;

the relevant documentation should be updated.

Documentation must describe the implementation that actually exists.

Do not document future functionality as implemented.

---

# 29. Documentation Accuracy

Use explicit terminology:

```text
Implemented
Tested
Planned
Deferred
Post-v1.0.0
```

Avoid language that implies an unimplemented feature already exists.

For example:

```text
Correct:
"Role discovery is planned."

Incorrect:
"The system provides GET /api/v1/roles."
```

unless that endpoint actually exists and has been tested.

---

# 30. Feature Completion

A feature is considered complete only when the applicable layers are implemented and verified.

Typical backend completion:

```text
Requirement
    ↓
Repository
    ↓
Service
    ↓
Validation
    ↓
Controller
    ↓
Route
    ↓
Authorization
    ↓
Testing
    ↓
Documentation
```

Typical frontend completion:

```text
Backend contract verified
    ↓
Frontend service
    ↓
View
    ↓
Interaction
    ↓
Error/loading/empty states
    ↓
Build
    ↓
Manual/API integration test
    ↓
Documentation if applicable
```

Not every feature requires every layer; use the existing architecture rather than adding layers unnecessarily.

---

# 31. Refactoring Policy

Do not refactor working code solely because another implementation appears cleaner.

A refactor should have a demonstrated benefit such as:

- correcting a verified defect;
- eliminating duplication that creates maintenance risk;
- enabling an approved requirement;
- correcting an architectural violation;
- improving reliability without changing the established contract.

Refactoring must preserve existing behavior unless the behavior change is explicitly required.

---

# 32. Naming and Patterns

Before introducing a new filename, function, repository method, service method, or response structure:

1. inspect neighboring modules;
2. identify the established naming pattern;
3. follow the existing convention.

Do not invent conventions when an established pattern already exists.

---

# 33. API Contract Protection

Existing API contracts should be treated as stable interfaces.

Before changing an existing request or response:

1. inspect backend consumers;
2. inspect frontend consumers;
3. inspect tests;
4. determine compatibility impact;
5. verify the requirement;
6. make the smallest compatible change possible.

---

# 34. No Frontend-Driven Backend Changes

The frontend must not dictate backend changes solely for convenience.

If a frontend requirement exposes a missing backend capability:

```text
Frontend need
    ↓
Determine domain requirement
    ↓
Inspect existing backend capability
    ↓
Determine whether API addition/change is justified
    ↓
Implement backend capability
    ↓
Test
    ↓
Integrate frontend
```

---

# 35. Release Development

MNL-Central uses semantic versioning:

```text
MAJOR.MINOR.PATCH
```

The first production release is:

```text
v1.0.0
```

Before `v1.0.0`, development phases may be tracked internally without representing them as formal production releases.

---

# 36. Versioning Rules

### MAJOR

Used for incompatible public/API or major product changes.

Example:

```text
v1.x.x → v2.0.0
```

### MINOR

Used for backward-compatible feature additions.

Example:

```text
v1.0.0 → v1.1.0
```

### PATCH

Used for backward-compatible bug fixes and maintenance.

Example:

```text
v1.0.0 → v1.0.1
```

Version numbers must reflect actual release decisions rather than arbitrary development milestones.

---

# 37. Post-v1.0.0 Development

The first major extension planned after the core production release is expanded role and permission management.

Potential capabilities include:

```text
Role Discovery
Role Creation
Role Editing
Role Permission Assignment
Role Permission Removal
Role Administration UI
```

These features must build upon the existing roles, permissions, and authorization model.

They must not introduce a second authorization system.

---

# 38. Definition of Done

A feature is considered done when:

- the requirement is understood;
- the existing implementation has been inspected;
- the smallest appropriate implementation has been completed;
- authorization is correct;
- validation is correct;
- business rules are enforced;
- relevant tests pass;
- no unrelated regressions are introduced;
- documentation is updated where necessary.

---

# 39. Development Philosophy

MNL-Central favors:

```text
Correctness over speed
Existing patterns over invention
Small changes over large rewrites
Explicit requirements over assumptions
Backend authorization over frontend assumptions
Tested behavior over theoretical correctness
Documentation that reflects reality
```

The goal is a maintainable production system, not merely a functioning prototype.
