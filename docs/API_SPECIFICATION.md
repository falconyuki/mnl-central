# MNL-Central API Specification

## 1. Purpose

This document describes the MNL-Central REST API.

The API uses:

```text
/api/v1
```

Only implemented and established API behavior is documented as active.

Future endpoints are explicitly marked as planned.

---

# 2. General API Architecture

Protected requests follow the established flow:

```text
HTTP Request
    ↓
Authentication
    ↓
Authorization
    ↓
Validation
    ↓
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

Controllers remain responsible for HTTP-level concerns.

Business rules belong to the service/application layer.

Database access belongs to repositories.

---

# 3. Authentication

## POST `/api/v1/auth/login`

Authenticates a user.

Authentication establishes the user identity and returns the established authenticated-user response.

---

## GET `/api/v1/auth/me`

Requires authentication.

Returns the currently authenticated user according to the established authentication contract.

---

## POST `/api/v1/auth/logout`

Requires authentication.

Revokes the current authentication session according to the established token-revocation mechanism.

---

## POST `/api/v1/auth/change-password`

Requires authentication.

Changes the authenticated user's password.

Request validation is applied before the operation reaches the controller.

---

# 4. Websites

All website endpoints require authentication and the appropriate website permission.

## GET `/api/v1/websites`

Permission:

```text
WEBSITE_VIEW
```

Lists websites according to the established list contract.

---

## GET `/api/v1/websites/:id`

Permission:

```text
WEBSITE_VIEW
```

Retrieves a website.

---

## POST `/api/v1/websites`

Permission:

```text
WEBSITE_CREATE
```

Creates a website.

---

## PATCH `/api/v1/websites/:id`

Permission:

```text
WEBSITE_UPDATE
```

Updates a website.

---

## POST `/api/v1/websites/:id/disable`

Permission:

```text
WEBSITE_DISABLE
```

Disables a website.

---

# 5. Customers

## GET `/api/v1/customers`

Permission:

```text
CUSTOMER_VIEW
```

Lists customers using the established customer-list contract.

---

## GET `/api/v1/customers/:id`

Permission:

```text
CUSTOMER_VIEW
```

Retrieves a customer.

---

## POST `/api/v1/customers`

Permission:

```text
CUSTOMER_CREATE
```

Creates a customer.

---

## PATCH `/api/v1/customers/:id`

Permission:

```text
CUSTOMER_UPDATE
```

Updates a customer.

---

## PATCH `/api/v1/customers/:id/status`

Permission:

```text
CUSTOMER_STATUS_UPDATE
```

Updates customer status.

---

# 6. Campaigns

## GET `/api/v1/campaigns`

Permission:

```text
CAMPAIGN_VIEW
```

Lists campaigns.

---

## GET `/api/v1/campaigns/:id`

Permission:

```text
CAMPAIGN_VIEW
```

Retrieves a campaign.

---

## POST `/api/v1/campaigns`

Permission:

```text
CAMPAIGN_CREATE
```

Creates a campaign.

Campaign creation includes the required initial promotion and uses the established atomic operation.

---

## PATCH `/api/v1/campaigns/:id`

Permission:

```text
CAMPAIGN_UPDATE
```

Updates a campaign.

---

## PATCH `/api/v1/campaigns/:id/status`

Permission:

```text
CAMPAIGN_STATUS_UPDATE
```

Updates campaign lifecycle status according to the permitted transitions.

---

# 7. Campaign Participations

## GET `/api/v1/campaign-participations`

Permission:

```text
PARTICIPATION_VIEW
```

Lists campaign participations.

---

## GET `/api/v1/campaign-participations/:id`

Permission:

```text
PARTICIPATION_VIEW
```

Retrieves a campaign participation.

---

## POST `/api/v1/campaign-participations`

Permission:

```text
PARTICIPATION_CREATE
```

Creates a campaign participation.

---

## PATCH `/api/v1/campaign-participations/:id/status`

Permission:

```text
PARTICIPATION_STATUS_UPDATE
```

Updates participation status.

---

# 8. Call Attempts

## GET `/api/v1/call-attempts`

Permission:

```text
CALL_VIEW
```

Lists call attempts.

---

## GET `/api/v1/call-attempts/:id`

Permission:

```text
CALL_VIEW
```

Retrieves a call attempt.

---

## POST `/api/v1/call-attempts`

Permission:

```text
CALL_CREATE
```

Creates a call attempt.

The server sets the call timestamp.

---

## POST `/api/v1/call-attempts/with-discussion`

Permissions:

```text
CALL_CREATE
DISCUSSION_CREATE
```

Creates a call attempt and campaign discussion atomically.

The operation must not leave a partial call/discussion result when one side fails.

---

# 9. Campaign Discussions

## GET `/api/v1/campaign-discussions`

Permission:

```text
DISCUSSION_VIEW
```

Lists campaign discussions.

---

## GET `/api/v1/campaign-discussions/:id`

Permission:

```text
DISCUSSION_VIEW
```

Retrieves a campaign discussion.

---

## POST `/api/v1/campaign-discussions`

Permission:

```text
DISCUSSION_CREATE
```

Creates a campaign discussion.

Relationship validation is handled by the service/application layer.

---

# 10. Promotions

## GET `/api/v1/promotions`

Permission:

```text
PROMOTION_VIEW
```

Lists promotions.

---

## GET `/api/v1/promotions/:id`

Permission:

```text
PROMOTION_VIEW
```

Retrieves a promotion.

---

## POST `/api/v1/promotions`

Permission:

```text
PROMOTION_CREATE
```

Creates a promotion.

---

## PATCH `/api/v1/promotions/:id`

Permission:

```text
PROMOTION_UPDATE
```

Updates a promotion.

---

## PATCH `/api/v1/promotions/:id/status`

Permission:

```text
PROMOTION_STATUS_UPDATE
```

Updates promotion status.

---

# 11. Promotion Receipts

## GET `/api/v1/promotion-receipts`

Permission:

```text
PROMOTION_RECEIPT_VIEW
```

Lists promotion receipts.

---

## GET `/api/v1/promotion-receipts/:id`

Permission:

```text
PROMOTION_RECEIPT_VIEW
```

Retrieves a promotion receipt.

---

## POST `/api/v1/promotion-receipts`

Permission:

```text
PROMOTION_RECEIPT_CREATE
```

Creates a promotion receipt.

The service validates the promotion/participation campaign relationship.

---

# 12. Users

## GET `/api/v1/users`

Permission:

```text
USER_VIEW
```

Lists users.

The current implementation supports the established list query parameters, including:

```text
page
pageSize
search
status
```

The current user list response has the following envelope:

```text id="v6z3kr"
{
  data: {
    rows: [
      {
        id,
        username,
        displayName,
        roleId,
        roleName,
        status,
        mustChangePassword,
        lastLoginAt,
        createdAt,
        updatedAt
      }
    ],
    total
  }
}
```

Role information is therefore already included in the user-list representation.

---

## GET `/api/v1/users/:id`

Permission:

```text
USER_VIEW
```

Retrieves a user.

---

## POST `/api/v1/users`

Permission:

```text
USER_CREATE
```

Creates a user.

Required request fields:

```text
username
displayName
password
roleId
```

---

## PATCH `/api/v1/users/:id`

Permission:

```text
USER_UPDATE
```

Updates the supported user fields.

Username is immutable.

---

## PATCH `/api/v1/users/:id/status`

Permission:

```text
USER_DISABLE
```

Changes user status according to the established user-management rules.

---

## PATCH `/api/v1/users/:id/role`

Permission:

```text
USER_MANAGE_ROLE
```

Changes the user's role.

---

## POST `/api/v1/users/:id/reset-password`

Permission:

```text
USER_RESET_PASSWORD
```

Resets the user's password according to the established password-management workflow.

---

# 13. User Website Access

## GET `/api/v1/users/:id/websites`

Permission:

```text
USER_MANAGE_WEBSITE_ACCESS
```

Lists the websites currently associated with the user.

---

## POST `/api/v1/users/:id/websites`

Permission:

```text
USER_MANAGE_WEBSITE_ACCESS
```

Grants website access to the user.

The service validates user and website existence, active website requirements, and duplicate relationships.

---

## DELETE `/api/v1/users/:id/websites`

Permission:

```text
USER_MANAGE_WEBSITE_ACCESS
```

Revokes a user's website access relationship.

---

# 14. Current API Scope Not Yet Implemented

The following areas exist in the domain model or approved roadmap but do not currently have implemented public endpoints.

## Roles

The database contains roles and the backend internally resolves roles.

There is currently no public role-discovery endpoint.

Therefore the following is **not currently an implemented API**:

```text
GET /api/v1/roles
```

A role-discovery endpoint may be introduced after the role API requirement is formally confirmed and implemented.

---

## Role Administration

The following are planned post-v1.0.0 capabilities:

- create role;
- update role;
- manage role permissions;
- add permissions to roles;
- remove permissions from roles.

No corresponding API contract is declared until those capabilities are formally designed and implemented.

---

## Reports

Reporting is part of the approved production scope, but the current source does not yet provide a public reports route.

Therefore report endpoints must not be invented in this document until their API contracts are implemented and verified.

---

# 15. Authorization Contract

Protected API endpoints use the established middleware architecture.

Conceptually:

```text
requireAuthentication
        ↓
requirePermission
        ↓
validation
        ↓
controller
```

Resource-specific authorization is performed where required using the established authorization context and website/resource relationship.

---

# 16. Error Handling

The API uses centralized error handling.

Controllers should not independently implement unrelated error-response formats.

Validation errors, authorization failures, missing resources, business-rule failures, and unexpected errors must follow the established centralized error-handling architecture.

---

# 17. API Change Policy

An API contract must not be changed merely for frontend convenience.

Before changing an existing endpoint:

1. identify the actual requirement;
2. inspect current consumers;
3. inspect the service/repository implementation;
4. determine compatibility impact;
5. make the smallest legitimate change;
6. test the change;
7. update this specification.

New endpoints require an actual domain/application requirement.

---

# 18. Versioning

All current endpoints are under:

```text
/api/v1
```

Breaking API changes require an appropriate versioning decision.

The first production API release is part of MNL-Central `v1.0.0`.
