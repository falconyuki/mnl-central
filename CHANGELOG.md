# MNL-Central Changelog

All notable changes to MNL-Central are documented in this file.

This changelog records the development history of the project and should remain consistent with the actual implementation.

The project follows Semantic Versioning for formal releases:

```text
MAJOR.MINOR.PATCH
```

---

# Unreleased

Current development work toward the first production release.

## User Management

### Added

- User listing.
- User retrieval.
- User creation.
- User display-name updates.
- User status management.
- User role management.
- Password reset workflow.
- User website access management.
- User Management permissions.
- User Management API routes.

### Frontend

- Users navigation.
- Users view.
- User table.
- User list API integration.
- Create User modal.
- Role selector foundation.

### Current Work

- Role discovery capability required by User Management.
- Real role data integration into the frontend.
- Create User API submission.
- Remaining User Management UI actions.

---

# Core Backend Implementation

## Customer Management

### Added

- Customer domain implementation.
- Customer repository.
- Customer service.
- Customer validation.
- Customer controller.
- Customer routes.
- Customer website relationship.
- Customer identity enforcement.
- Customer status handling.

### Business Rules

- Customer identity is Website + Username.
- Username is immutable.
- Duplicate Website + Username combinations are rejected.
- Customer website relationships are validated.

---

## Campaign Management

### Added

- Campaign domain implementation.
- Campaign repository.
- Campaign service.
- Campaign validation.
- Campaign controller.
- Campaign routes.
- Campaign lifecycle.
- Campaign participation.
- Participation expiration.

### Business Rules

- Campaigns belong to a website.
- Campaign lifecycle transitions are enforced.
- Campaign creation requires an initial promotion.
- Campaign and initial promotion creation is atomic.
- Campaign participation is unique per campaign/customer combination.
- Campaign participation respects website relationships.

---

## Calls and Campaign Discussions

### Added

- Call attempt domain implementation.
- Call attempt repository/service/controller/routes.
- Campaign discussion implementation.
- Call status model.
- Discussion status model.
- Relationship validation.
- Atomic Call Attempt + Discussion operation.

### Business Rules

Call statuses:

```text
NO_ANSWER
ANSWERED
DROP_CALL
INTERESTED
NOT_INTERESTED
CALL_BACK
WRONG_NUMBER
INVALID_NUMBER
```

Discussion statuses:

```text
DISCUSSED
NOT_DISCUSSED
```

The server sets the call timestamp.

---

## Promotions

### Added

- Promotion implementation.
- Promotion repository/service/controller/routes.
- Promotion receipt implementation.
- Promotion receipt validation.
- Campaign/promotion relationship validation.
- Promotion/participation relationship validation.

### Business Rules

- Promotions belong to campaigns.
- Campaigns require at least one promotion.
- Promotion receipts belong to both a promotion and campaign participation.
- Promotion campaign must match participation campaign.
- Duplicate promotion receipts are rejected.

---

# Authentication and Authorization

### Added

- Authentication foundation.
- JWT authentication.
- Password hashing.
- Token revocation support.
- Authorization context construction.
- Permission-based authorization.
- Website access authorization.
- Role-based authorization foundation.
- User website access relationship.

### Authorization Rules

Authentication establishes the identity of the requester.

Authorization determines whether that requester may perform a protected operation.

Website-scoped authorization is evaluated where required.

The frontend is not an authorization authority.

---

# Database and Domain Foundation

### Added

- Core database schema.
- Migration system.
- Database seed data.
- Foreign-key integrity.
- Authorization tables.
- User website access table.
- Core CRM domain tables.

The database model currently contains:

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

---

# Frontend Foundation

### Added

- Vite frontend application.
- Vanilla JavaScript architecture.
- ES Module structure.
- Bootstrap integration.
- Bootstrap Icons integration.
- Application shell.
- Header/user menu.
- Responsive sidebar.
- Main content area.
- Dashboard view.
- Users view.
- Websites view foundation.
- Campaigns view foundation.
- Authentication flow.
- Session handling.
- API client.
- Frontend service layer.
- Navigation/view orchestration.

### Session

The frontend uses the established local session storage mechanism.

The frontend stores the access token and current user using the established application keys.

The current user object does not contain a permissions array.

The frontend therefore does not hard-code role-to-permission mappings.

---

# Architectural Corrections

The following corrections were made during implementation:

- Domain/repository objects were standardized around camelCase mappings.
- `callAttempt.customerId` is the established domain field.
- Campaign participation mappings were corrected to the established camelCase contract.
- Campaign Discussion authorization uses the authorization context.
- Campaign Discussion relationship resolution was moved from the controller into the service/application layer.
- Promotion repository website scoping was corrected to use the campaign website relationship.
- User management intentionally uses `userRepository` rather than introducing a separate user-management repository.
- User website access remains a separate repository/domain relationship.

---

# Documentation Policy

Project documentation is maintained as part of the development process.

Documentation must describe the actual implemented system and must not introduce unsupported API contracts, database structures, permissions, status values, or architectural behavior.

Repository documentation must not contain secrets, credentials, private keys, sensitive infrastructure details, or security-bypass instructions.

---

# Formal Releases

Formal semantic versions will be added below as releases are completed.

---

## v1.0.0

**Status:** Planned

The first production release.

Release details will be documented in:

```text
docs/releases/RELEASE_NOTES_v1.0.0.md
```

---

# Future Releases

Future releases will follow Semantic Versioning.

Examples of planned post-v1.0.0 functionality include:

- Advanced role management.
- Role permission administration.
- Role management UI.
- Extended authorization administration.

These features are not considered part of v1.0.0 unless explicitly added to the approved production scope.
