# MNL-Central Database Schema

## 1. Purpose

This document describes the approved MNL-Central database/domain model.

The schema is considered locked unless a schema change is explicitly approved.

Sensitive database configuration, credentials, connection information, and operational secrets are intentionally excluded.

---

# 2. Database Model

The current core database contains 14 tables:

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

# 3. Authorization Domain

## 3.1 users

Stores application users.

Important fields include:

```text
id
username
display_name
password_hash
role_id
status
must_change_password
last_login_at
created_at
updated_at
```

The username is unique and immutable through normal user management operations.

`role_id` references `roles.id`.

---

## 3.2 roles

Stores system roles.

Fields:

```text
id
name
description
created_at
updated_at
```

Role names are unique.

The current system contains four seeded roles:

```text
Administrator
Team Leader
CRM Staff
Customer Service
```

---

## 3.3 permissions

Stores individual authorization permissions.

The permission name is unique.

Permissions are associated with roles through `role_permissions`.

---

## 3.4 role_permissions

Associates roles with permissions.

Relationship:

```text
roles
  ↓
role_permissions
  ↓
permissions
```

The role/permission combination is unique.

---

## 3.5 user_website_access

Associates users with websites.

Fields:

```text
id
user_id
website_id
created_at
```

The combination of:

```text
user_id + website_id
```

is unique.

---

# 4. Website Domain

## 4.1 websites

Stores supported websites.

Fields include:

```text
id
name
code
description
status
created_at
updated_at
```

Allowed status values:

```text
Active
Disabled
```

A disabled website is not reactivated through the normal lifecycle.

---

# 5. Customer Domain

## 5.1 customers

Stores customer records.

Customer identity is:

```text
website_id + username
```

The combination is unique.

Username is immutable.

Customer statuses are:

```text
Active
Inactive
```

A customer belongs to one website.

---

# 6. Campaign Domain

## 6.1 campaigns

Stores campaigns.

Important fields include:

```text
id
website_id
name
description
start_date
end_date
status
created_by
created_at
updated_at
```

Campaign status values:

```text
Draft
Active
Expired
Cancelled
```

Campaign status transitions:

```text
Draft → Active
Draft → Cancelled
Active → Expired
Active → Cancelled
```

Expired and Cancelled are terminal.

A campaign must have at least one promotion.

---

## 6.2 campaign_participations

Associates customers with campaigns.

Important fields include:

```text
id
campaign_id
customer_id
status
created_at
updated_at
```

The combination of:

```text
campaign_id + customer_id
```

is unique.

The campaign website must match the customer website.

Participation status values:

```text
Active
Expired
```

---

# 7. Call Domain

## 7.1 call_attempts

Stores individual call attempts against customers.

Important fields include:

```text
id
customer_id
user_id
called_at
call_status
remarks
created_at
updated_at
```

Call attempts intentionally do not contain `campaign_id`.

The server determines `called_at`.

Allowed call statuses:

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

---

# 8. Campaign Discussion Domain

## 8.1 campaign_discussions

Associates a call attempt with a campaign participation.

Important fields include:

```text
id
call_attempt_id
campaign_participation_id
discussion_status
remarks
created_at
updated_at
```

Allowed discussion statuses:

```text
DISCUSSED
NOT_DISCUSSED
```

The relationship:

```text
call_attempt_id + campaign_participation_id
```

is unique.

Call Attempt + Discussion creation may be performed atomically.

---

# 9. Promotion Domain

## 9.1 promotions

Stores promotions belonging to campaigns.

Important fields include:

```text
id
campaign_id
...
status
created_at
updated_at
```

Promotions belong to exactly one campaign.

Promotion statuses:

```text
Active
Inactive
```

A campaign must have at least one promotion.

---

## 9.2 promotion_receipts

Stores promotion receipt events.

Important fields include:

```text
id
promotion_id
campaign_participation_id
received_at
staff_user_id
status
created_at
updated_at
```

The combination of:

```text
promotion_id + campaign_participation_id
```

is unique.

The promotion's campaign must equal the participation's campaign.

Receipt status:

```text
RECEIVED
```

---

# 10. Audit Domain

## 10.1 audit_logs

Stores audit records for important application operations.

The table exists in the schema and is part of the approved domain model.

Detailed audit event behavior is implemented as part of the Audit Logging phase.

---

# 11. Core Relationships

The primary relationships are:

```text
users
  └── role_id → roles.id

roles
  └── role_permissions → permissions

users
  └── user_website_access → websites

customers
  └── website_id → websites

campaigns
  └── website_id → websites

campaign_participations
  ├── campaign_id → campaigns
  └── customer_id → customers

call_attempts
  ├── customer_id → customers
  └── user_id → users

campaign_discussions
  ├── call_attempt_id → call_attempts
  └── campaign_participation_id → campaign_participations

promotions
  └── campaign_id → campaigns

promotion_receipts
  ├── promotion_id → promotions
  ├── campaign_participation_id → campaign_participations
  └── staff_user_id → users
```

---

# 12. Domain Integrity Rules

The following relationships are mandatory:

### Campaign / Customer

A campaign participation is valid only when the campaign website and customer website match.

### Call / Discussion

A discussion references a valid call attempt and campaign participation.

### Promotion / Participation

A promotion receipt is valid only when the promotion's campaign matches the participation's campaign.

### User / Website

User website access is represented by a dedicated relationship rather than fields embedded in the users table.

---

# 13. Deletion Policy

Core business records are not designed around destructive deletion.

Lifecycle/status operations are preferred where the domain supports them.

This preserves historical business information and supports auditability.

---

# 14. Migration Policy

Database changes are managed through migrations.

Migrations must:

1. be deterministic;
2. preserve existing data where applicable;
3. respect foreign-key relationships;
4. preserve locked domain invariants;
5. be tested before adoption.

Schema changes require explicit approval.

---

# 15. Naming Convention

Database columns use the established snake_case naming convention.

Application/domain objects use camelCase.

Examples:

```text
website_id    → websiteId
campaign_id   → campaignId
customer_id   → customerId
created_at    → createdAt
updated_at    → updatedAt
```

The mapping occurs at the repository/domain boundary.

---

# 16. Schema Change Policy

No table, field, relationship, enum/status value, or constraint should be added or changed solely for frontend convenience.

A schema change requires:

1. an identified domain requirement;
2. inspection of the existing model;
3. impact analysis;
4. explicit approval;
5. migration implementation;
6. testing;
7. documentation update.
