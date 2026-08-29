# MNL-Central Project Requirements

## 1. Document Purpose

This document defines the approved functional, domain, architectural, security, and operational requirements for MNL-Central.

It describes the intended behavior of the system without exposing sensitive implementation information such as credentials, secrets, private infrastructure configuration, or security-bypass procedures.

---

# 2. Project Overview

MNL-Central is a centralized Customer Relationship Management (CRM) system intended to replace spreadsheet-based customer management workflows.

The system centralizes customer information and the operational workflow surrounding:

```text
Customer
    ↓
Campaign Participation
    ↓
Call Attempt
    ↓
Campaign Discussion
    ↓
Promotion
    ↓
Promotion Receipt
```

The system must support multiple websites while enforcing the appropriate website access restrictions for users and domain resources.

---

# 3. Project Objectives

The system shall:

1. Centralize customer information.
2. Replace spreadsheet-based operational workflows.
3. Support multiple websites.
4. Manage campaigns and customer participation.
5. Record call attempts.
6. Record campaign discussions.
7. Manage promotions.
8. Track promotion receipts.
9. Provide reporting capabilities.
10. Provide controlled user management.
11. Enforce role and permission-based authorization.
12. Enforce website-level access where applicable.
13. Maintain an auditable record of important operations.
14. Provide a maintainable frontend and backend architecture.
15. Provide a production-ready first release as `v1.0.0`.

---

# 4. Users and Roles

The initial system defines four system roles.

## 4.1 Administrator

The Administrator is the global administrative role.

Administrator access is not restricted by individual website access in the same manner as non-administrative users.

---

## 4.2 Team Leader

A Team Leader is associated with exactly one website.

Team Leader capabilities are controlled by assigned permissions and applicable website authorization rules.

---

## 4.3 CRM Staff

CRM Staff may be associated with one or more websites.

The initial operational configuration is expected to support access to both initial websites.

---

## 4.4 Customer Service

Customer Service is associated with exactly one website.

Customer Service access is restricted according to the applicable permissions and website authorization rules.

---

# 5. Website Requirements

The system must support multiple websites.

A website contains:

- identifier;
- name;
- code;
- description;
- status;
- creation/update metadata.

Website status values are exactly:

```text
Active
Disabled
```

A disabled website is not reactivated through the normal website lifecycle.

Website authorization must consider both:

1. the user's permission; and
2. the user's access to the applicable website.

Administrators are subject to the established administrator authorization behavior.

---

# 6. Customer Requirements

Customer identity is defined by:

```text
Website + Username
```

The combination must be unique.

Username is immutable after customer creation.

Customers have a status of:

```text
Active
Inactive
```

Customer information must remain associated with its website.

---

# 7. Campaign Requirements

A campaign belongs to exactly one website.

Campaign statuses are:

```text
Draft
Active
Expired
Cancelled
```

Allowed lifecycle transitions are:

```text
Draft → Active
Draft → Cancelled
Active → Expired
Active → Cancelled
```

Expired and Cancelled are terminal states.

A campaign must contain at least one promotion.

Campaign creation and creation of the initial promotion must be atomic.

---

# 8. Campaign Participation Requirements

A campaign participation associates a customer with a campaign.

The combination of:

```text
Campaign + Customer
```

must be unique.

The campaign website must match the customer's website.

Participation statuses are:

```text
Active
Expired
```

Participation may expire according to the campaign lifecycle rules.

---

# 9. Call Attempt Requirements

Call attempts represent call activity against customers.

A call attempt does not contain a campaign identifier.

The server determines the call timestamp.

Allowed call statuses are:

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

Call attempts may contain remarks.

---

# 10. Campaign Discussion Requirements

A campaign discussion associates a call attempt with a campaign participation.

Discussion statuses are:

```text
DISCUSSED
NOT_DISCUSSED
```

The relationship between call attempt and campaign participation must satisfy the established domain rules.

The system supports an atomic operation that creates a call attempt and its associated campaign discussion together.

If either operation fails, the combined operation must not leave a partial result.

---

# 11. Promotion Requirements

Promotions belong to campaigns.

A campaign must contain at least one promotion.

Promotions contain the defined promotion information and may contain a fixed monetary amount.

Promotion statuses are:

```text
Active
Inactive
```

---

# 12. Promotion Receipt Requirements

A promotion receipt records that a promotion was received for a campaign participation.

A receipt connects:

```text
Promotion
+
Campaign Participation
```

The combination must be unique.

The promotion's campaign must match the campaign associated with the participation.

The receipt status is:

```text
RECEIVED
```

The receiving staff user is recorded.

---

# 13. User Management Requirements

The system shall provide controlled user management.

Current capabilities include:

- list users;
- retrieve a user;
- create a user;
- update a user's display name;
- change user status;
- change user role;
- reset a user's password;
- manage user website access.

Username is immutable.

A normal user update does not change the username.

User creation requires:

```text
username
displayName
password
roleId
```

Role identifiers must reference an existing role.

---

# 14. User Website Access Requirements

User website access is represented as a separate relationship.

The system shall support:

- viewing a user's website access;
- granting website access;
- revoking website access.

The same user/website relationship cannot be granted more than once.

A website grant must satisfy the active-website rule established by the domain.

Revoking an existing relationship does not require the website to remain active.

---

# 15. Roles and Permissions Requirements

The authorization model uses:

```text
Role
    ↓
Role Permissions
    ↓
Permissions
```

The current system contains system-defined roles and permissions.

The initial system roles are:

- Administrator
- Team Leader
- CRM Staff
- Customer Service

The current implementation uses permissions to control API operations.

Role and permission administration is intentionally treated separately from the initial User Management implementation.

Advanced functionality for:

- creating custom roles;
- editing role definitions;
- assigning permissions to roles;
- removing permissions from roles;

is planned as a post-v1.0.0 extension unless the approved release scope changes.

---

# 16. Authentication Requirements

The system shall authenticate users before protected API operations are performed.

Authentication uses JWT-based access tokens.

The authentication layer is responsible for establishing the authenticated user identity.

Authentication and authorization are separate concerns.

The authenticated request user must not be treated as the complete authorization context.

---

# 17. Authorization Requirements

Authorization must be permission-based.

The backend constructs an authorization context containing the information required for authorization decisions.

The established authorization flow is:

```text
Authentication
    ↓
Authorization Context
    ↓
Permission Check
    ↓
Resource Authorization
```

Website-scoped resources must additionally enforce applicable website access.

The backend is the authoritative authorization boundary.

Frontend visibility must never be considered a security boundary.

---

# 18. Audit Requirements

Important system operations must be auditable.

The database contains an audit log table.

Audit logging is required for the production release.

The exact audit events and transaction integration are defined during the Audit Logging implementation phase.

---

# 19. Reporting Requirements

The production system must support reporting based on the approved reporting definitions.

At minimum, the reporting model includes:

### Customers Called

The number of distinct customers with at least one call during the selected period.

### Promotion Received

The number of promotion receipt events during the selected period.

### Conversion Rate

```text
Distinct customers receiving at least one promotion
÷
Distinct customers called
× 100
```

Reporting implementation is part of the remaining v1.0.0 work.

---

# 20. Frontend Requirements

The frontend must use:

- HTML5;
- CSS3;
- Vanilla JavaScript;
- ES Modules;
- Vite;
- Bootstrap;
- Bootstrap Icons.

Frontend frameworks such as React, Vue, and Angular are not part of the project architecture.

The frontend must consume backend APIs rather than directly accessing the database.

The frontend must use the established authentication/session mechanism.

The frontend must not duplicate backend authorization rules.

---

# 21. Backend Requirements

The backend must use:

- Node.js;
- Express;
- ES Modules;
- REST APIs;
- libSQL-compatible database access;
- JWT authentication;
- bcrypt password hashing.

The backend must maintain the established layered architecture.

Repositories own database access.

Services own business rules.

Controllers remain thin.

Routes define endpoint composition and middleware.

---

# 22. Data Integrity Requirements

The system must enforce important business invariants at the application/service boundary and database boundary where appropriate.

Examples include:

- unique customer identity;
- unique campaign participation;
- unique promotion receipt;
- valid campaign lifecycle transitions;
- valid website relationships;
- valid promotion/campaign relationships;
- valid receipt/campaign relationships;
- valid user/website relationships.

Destructive deletion of core business records is not part of the approved domain model.

---

# 23. Production Release Requirement

`v1.0.0` is the first production release.

The production release must include the complete core CRM workflow, authentication, authorization, user management, website access, reporting, auditability, frontend workflows, production hardening, regression testing, and project documentation.

---

# 24. Future Product Extensions

Post-v1.0.0 development may include:

- custom role creation;
- role editing;
- role permission administration;
- permission assignment/removal;
- role administration UI;
- expanded authorization administration;
- additional reporting;
- further operational improvements.

Future extensions must preserve the established domain and authorization architecture unless an explicitly approved architectural change is made.
