const statements = [
  // ============================================================
  // Security / Authorization
  // ============================================================

  `CREATE TABLE roles (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        description TEXT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    )`,

  `CREATE TABLE permissions (
        id TEXT PRIMARY KEY,
        code TEXT NOT NULL UNIQUE,
        description TEXT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    )`,

  `CREATE TABLE websites (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        code TEXT NOT NULL UNIQUE,
        description TEXT NULL,
        status TEXT NOT NULL DEFAULT 'Active'
            CHECK (status IN ('Active', 'Disabled')),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    )`,

  `CREATE TABLE users (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        display_name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        role_id TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Active'
            CHECK (status IN ('Active', 'Disabled')),
        must_change_password INTEGER NOT NULL DEFAULT 1
            CHECK (must_change_password IN (0, 1)),
        last_login_at TEXT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,

        FOREIGN KEY (role_id)
            REFERENCES roles(id)
    )`,

  `CREATE TABLE role_permissions (
        id TEXT PRIMARY KEY,
        role_id TEXT NOT NULL,
        permission_id TEXT NOT NULL,
        created_at TEXT NOT NULL,

        UNIQUE (role_id, permission_id),

        FOREIGN KEY (role_id)
            REFERENCES roles(id),

        FOREIGN KEY (permission_id)
            REFERENCES permissions(id)
    )`,

  `CREATE TABLE user_website_access (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        website_id TEXT NOT NULL,
        created_at TEXT NOT NULL,

        UNIQUE (user_id, website_id),

        FOREIGN KEY (user_id)
            REFERENCES users(id),

        FOREIGN KEY (website_id)
            REFERENCES websites(id)
    )`,

  // ============================================================
  // Business
  // ============================================================

  `CREATE TABLE customers (
        id TEXT PRIMARY KEY,
        website_id TEXT NOT NULL,
        username TEXT NOT NULL,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Active'
            CHECK (status IN ('Active', 'Inactive')),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,

        UNIQUE (website_id, username),

        FOREIGN KEY (website_id)
            REFERENCES websites(id)
    )`,

  `CREATE TABLE campaigns (
        id TEXT PRIMARY KEY,
        website_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Draft'
            CHECK (
                status IN (
                    'Draft',
                    'Active',
                    'Expired',
                    'Cancelled'
                )
            ),
        created_by TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,

        CHECK (end_date >= start_date),

        FOREIGN KEY (website_id)
            REFERENCES websites(id),

        FOREIGN KEY (created_by)
            REFERENCES users(id)
    )`,

  `CREATE TABLE campaign_participations (
        id TEXT PRIMARY KEY,
        campaign_id TEXT NOT NULL,
        customer_id TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Active'
            CHECK (status IN ('Active', 'Expired')),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,

        UNIQUE (campaign_id, customer_id),

        FOREIGN KEY (campaign_id)
            REFERENCES campaigns(id),

        FOREIGN KEY (customer_id)
            REFERENCES customers(id)
    )`,

  `CREATE TABLE call_attempts (
        id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        called_at TEXT NOT NULL,
        call_status TEXT NOT NULL
            CHECK (
                call_status IN (
                    'NO_ANSWER',
                    'ANSWERED',
                    'DROP_CALL',
                    'INTERESTED',
                    'NOT_INTERESTED',
                    'CALL_BACK',
                    'WRONG_NUMBER',
                    'INVALID_NUMBER'
                )
            ),
        remarks TEXT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,

        FOREIGN KEY (customer_id)
            REFERENCES customers(id),

        FOREIGN KEY (user_id)
            REFERENCES users(id)
    )`,

  `CREATE TABLE campaign_discussions (
        id TEXT PRIMARY KEY,
        call_attempt_id TEXT NOT NULL,
        campaign_participation_id TEXT NOT NULL,
        discussion_status TEXT NOT NULL
            CHECK (
                discussion_status IN (
                    'DISCUSSED',
                    'NOT_DISCUSSED'
                )
            ),
        remarks TEXT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,

        UNIQUE (
            call_attempt_id,
            campaign_participation_id
        ),

        FOREIGN KEY (call_attempt_id)
            REFERENCES call_attempts(id),

        FOREIGN KEY (campaign_participation_id)
            REFERENCES campaign_participations(id)
    )`,

  `CREATE TABLE promotions (
        id TEXT PRIMARY KEY,
        campaign_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT NULL,
        amount INTEGER NULL,
        status TEXT NOT NULL DEFAULT 'Active'
            CHECK (status IN ('Active', 'Inactive')),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,

        FOREIGN KEY (campaign_id)
            REFERENCES campaigns(id)
    )`,

  `CREATE TABLE promotion_receipts (
        id TEXT PRIMARY KEY,
        promotion_id TEXT NOT NULL,
        campaign_participation_id TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'RECEIVED'
            CHECK (status = 'RECEIVED'),
        received_at TEXT NOT NULL,
        staff_user_id TEXT NOT NULL,
        remarks TEXT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,

        UNIQUE (
            promotion_id,
            campaign_participation_id
        ),

        FOREIGN KEY (promotion_id)
            REFERENCES promotions(id),

        FOREIGN KEY (campaign_participation_id)
            REFERENCES campaign_participations(id),

        FOREIGN KEY (staff_user_id)
            REFERENCES users(id)
    )`,

  // ============================================================
  // Accountability
  // ============================================================

  `CREATE TABLE audit_logs (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        module TEXT NOT NULL,
        action TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        description TEXT NULL,
        ip_address TEXT NULL,
        created_at TEXT NOT NULL,

        FOREIGN KEY (user_id)
            REFERENCES users(id)
    )`,

  // ============================================================
  // Indexes
  // ============================================================

  `CREATE INDEX idx_customers_website
        ON customers (website_id)`,

  `CREATE INDEX idx_customers_status
        ON customers (status)`,

  `CREATE INDEX idx_customers_phone
        ON customers (phone)`,

  `CREATE INDEX idx_campaigns_website
        ON campaigns (website_id)`,

  `CREATE INDEX idx_campaigns_status
        ON campaigns (status)`,

  `CREATE INDEX idx_campaigns_start_date
        ON campaigns (start_date)`,

  `CREATE INDEX idx_campaigns_end_date
        ON campaigns (end_date)`,

  `CREATE INDEX idx_participations_customer
        ON campaign_participations (customer_id)`,

  `CREATE INDEX idx_participations_campaign
        ON campaign_participations (campaign_id)`,

  `CREATE INDEX idx_participations_status
        ON campaign_participations (status)`,

  `CREATE INDEX idx_calls_customer
        ON call_attempts (customer_id)`,

  `CREATE INDEX idx_calls_called_at
        ON call_attempts (called_at)`,

  `CREATE INDEX idx_calls_user
        ON call_attempts (user_id)`,

  `CREATE INDEX idx_calls_status
        ON call_attempts (call_status)`,

  `CREATE INDEX idx_calls_customer_called_at
        ON call_attempts (customer_id, called_at)`,

  `CREATE INDEX idx_discussions_participation
        ON campaign_discussions (campaign_participation_id)`,

  `CREATE INDEX idx_promotions_campaign
        ON promotions (campaign_id)`,

  `CREATE INDEX idx_promotions_status
        ON promotions (status)`,

  `CREATE INDEX idx_receipts_participation
        ON promotion_receipts (campaign_participation_id)`,

  `CREATE INDEX idx_receipts_received_at
        ON promotion_receipts (received_at)`,

  `CREATE INDEX idx_receipts_staff
        ON promotion_receipts (staff_user_id)`,

  `CREATE INDEX idx_audit_user
        ON audit_logs (user_id)`,

  `CREATE INDEX idx_audit_entity
        ON audit_logs (entity_type, entity_id)`,

  `CREATE INDEX idx_audit_created_at
        ON audit_logs (created_at)`,

  `CREATE INDEX idx_user_website_access_website
        ON user_website_access (website_id)`,
];

export const migration001 = {
  version: 1,
  name: "initial_schema",

  async up(transaction) {
    await transaction.batch(statements);
  },
};
