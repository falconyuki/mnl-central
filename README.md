# MNL-Central

**MNL-Central** is a centralized Customer Relationship Management (CRM) system designed to replace spreadsheet-based customer management workflows with a structured, secure, maintainable application.

The system centralizes customer management, campaign participation, call activity, campaign discussions, promotions, promotion receipts, user management, website access, reporting, and audit logging.

---

## Project Status

**Status:** Active Development

**Production Target:** `v1.0.0`

MNL-Central is currently being developed incrementally. Each major development phase is inspected, implemented, tested, and documented before proceeding to the next phase.

The project is not considered production-ready until the requirements for `v1.0.0` have been completed and verified.

---

## Core Workflow

```text
Customer
    ↓
Campaign
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
    ↓
Reporting
```

---

## Key Capabilities

The completed and planned system includes:

- Authentication
- Role-based authorization
- Permission-based access control
- Multi-website access management
- User management
- Customer management
- Campaign management
- Campaign participation
- Call attempt recording
- Campaign discussions
- Promotion management
- Promotion receipt tracking
- Reporting
- Audit logging
- Frontend CRM interface

---

## Technology Stack

### Backend

- Node.js
- Express
- JavaScript ES Modules
- REST API
- libSQL / SQLite-compatible database
- JWT authentication
- bcrypt password hashing

### Frontend

- HTML5
- CSS3
- Vanilla JavaScript
- ES Modules
- Vite
- Bootstrap
- Bootstrap Icons
- Chart.js where required

The frontend does not use React, Vue, Angular, or another frontend framework.

---

## Architecture

MNL-Central follows a layered backend architecture.

```text
HTTP Request
     ↓
Authentication
     ↓
Authorization
     ↓
Validation
     ↓
Service / Application Layer
     ↓
Repository / Transaction
     ↓
Database
```

The primary responsibilities are:

- **Routes** — define API endpoints and middleware composition.
- **Controllers** — handle HTTP input/output and remain thin.
- **Services** — enforce application and business rules.
- **Repositories** — own database access.
- **Database** — persist authoritative domain data.

The frontend communicates with the backend through established REST API contracts.

---

## Core Domain

The current database/domain model contains:

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

The database schema is treated as locked unless an explicit schema change is approved.

---

## Initial Roles

The initial application defines four system roles:

- Administrator
- Team Leader
- CRM Staff
- Customer Service

The authorization model is permission-based and may also apply website-level access restrictions where required.

Advanced role and permission administration is planned as a post-v1.0.0 extension.

---

## Documentation

Project documentation is maintained under `docs/`.

| Document                                             | Description                          |
| ---------------------------------------------------- | ------------------------------------ |
| [Roadmap](docs/ROADMAP.md)                           | Development phases and release plan  |
| [Changelog](docs/CHANGELOG.md)                       | Project change history               |
| [Project Requirements](docs/PROJECT_REQUIREMENTS.md) | Approved product requirements        |
| [Database Schema](docs/DATABASE_SCHEMA.md)           | Database structure and relationships |
| [API Specification](docs/API_SPECIFICATION.md)       | API contracts                        |
| [Architecture](docs/ARCHITECTURE.md)                 | System architecture                  |
| [Development Guide](docs/DEVELOPMENT_GUIDE.md)       | Development standards and workflow   |

Release-specific documentation is maintained under:

```text
docs/releases/
```

---

## Development Philosophy

MNL-Central is developed using an inspection-first workflow.

Before making a change:

1. Inspect the current implementation.
2. Inspect relevant neighboring modules.
3. Confirm the existing architecture and contracts.
4. Determine the smallest legitimate change.
5. Implement one isolated change.
6. Test the change.
7. Update documentation when the change affects project behavior or contracts.
8. Proceed to the next change.

Existing working architecture is not redesigned merely for style.

---

## API

The API uses the versioned prefix:

```text
/api/v1
```

API behavior must follow the contracts documented in `docs/API_SPECIFICATION.md`.

---

## Security Documentation Policy

Repository documentation is written under a **public-safe-by-default** principle.

Documentation must not contain:

- passwords;
- API keys;
- access tokens;
- JWT secrets;
- encryption keys;
- database credentials;
- private keys or certificates;
- production credentials;
- sensitive infrastructure details;
- authorization bypass procedures;
- exploitable security information.

Sensitive configuration belongs outside source-controlled documentation and source code.

---

## Versioning

MNL-Central follows Semantic Versioning:

```text
MAJOR.MINOR.PATCH
```

The first production release is:

```text
v1.0.0
```

Future versions may introduce additional functionality while preserving established contracts unless a documented major-version change is required.

---

## Repository Rules

- Do not commit secrets.
- Do not invent API contracts.
- Do not invent database fields or status values.
- Do not bypass the service/repository architecture.
- Do not duplicate backend authorization logic in the frontend.
- Do not hard-code role IDs in the frontend.
- Do not modify the locked database schema without approval.
- Do not commit or push changes unless explicitly requested by the project owner.

---

## License

Internal project.

License and distribution policy are subject to project ownership requirements.
