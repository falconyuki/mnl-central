import { executeMultiple } from "../database.js";

const statements = [
  // ============================================================
  // Roles
  // ============================================================

  `
    INSERT INTO roles (
        id,
        name,
        description,
        created_at,
        updated_at
    )
    VALUES
        (
            '00000000-0000-4000-8000-000000000001',
            'Administrator',
            'Full system access across all websites and capabilities.',
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        ),
        (
            '00000000-0000-4000-8000-000000000002',
            'Team Leader',
            'Management access scoped to one authorized website.',
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        ),
        (
            '00000000-0000-4000-8000-000000000003',
            'CRM Staff',
            'Calling and customer campaign workflow access.',
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        ),
        (
            '00000000-0000-4000-8000-000000000004',
            'Customer Service',
            'Read-only customer and campaign access for one website.',
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        )
    `,

  // ============================================================
  // Permissions
  // ============================================================

  `
    INSERT INTO permissions (
        id,
        code,
        description,
        created_at,
        updated_at
    )
    VALUES
        ('10000000-0000-4000-8000-000000000001', 'AUTH_LOGIN', 'Authenticate into the CRM.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('10000000-0000-4000-8000-000000000002', 'AUTH_LOGOUT', 'Terminate the current authenticated session.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('10000000-0000-4000-8000-000000000003', 'AUTH_CHANGE_PASSWORD', 'Change the authenticated user password.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

        ('10000000-0000-4000-8000-000000000004', 'USER_VIEW', 'View users.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('10000000-0000-4000-8000-000000000005', 'USER_CREATE', 'Create users.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('10000000-0000-4000-8000-000000000006', 'USER_UPDATE', 'Update users.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('10000000-0000-4000-8000-000000000007', 'USER_DISABLE', 'Disable users.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('10000000-0000-4000-8000-000000000008', 'USER_RESET_PASSWORD', 'Reset a user password.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('10000000-0000-4000-8000-000000000009', 'USER_MANAGE_ROLE', 'Manage user roles.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('10000000-0000-4000-8000-000000000010', 'USER_MANAGE_WEBSITE_ACCESS', 'Manage user website access.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

        ('10000000-0000-4000-8000-000000000011', 'ROLE_VIEW', 'View roles.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('10000000-0000-4000-8000-000000000012', 'ROLE_MANAGE', 'Manage role definitions.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('10000000-0000-4000-8000-000000000013', 'PERMISSION_VIEW', 'View permissions.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('10000000-0000-4000-8000-000000000014', 'PERMISSION_MANAGE', 'Manage permission definitions.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

        ('10000000-0000-4000-8000-000000000015', 'WEBSITE_VIEW', 'View websites.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('10000000-0000-4000-8000-000000000016', 'WEBSITE_CREATE', 'Create websites.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('10000000-0000-4000-8000-000000000017', 'WEBSITE_UPDATE', 'Update websites.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('10000000-0000-4000-8000-000000000018', 'WEBSITE_DISABLE', 'Disable websites.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

        ('10000000-0000-4000-8000-000000000019', 'CUSTOMER_VIEW', 'View customers.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('10000000-0000-4000-8000-000000000020', 'CUSTOMER_CREATE', 'Create customers.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('10000000-0000-4000-8000-000000000021', 'CUSTOMER_UPDATE', 'Update customers.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('10000000-0000-4000-8000-000000000022', 'CUSTOMER_STATUS_UPDATE', 'Update customer active/inactive status.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

        ('10000000-0000-4000-8000-000000000023', 'CAMPAIGN_VIEW', 'View campaigns.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('10000000-0000-4000-8000-000000000024', 'CAMPAIGN_CREATE', 'Create campaigns.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('10000000-0000-4000-8000-000000000025', 'CAMPAIGN_UPDATE', 'Update campaigns.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('10000000-0000-4000-8000-000000000026', 'CAMPAIGN_STATUS_UPDATE', 'Change campaign lifecycle status.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

        ('10000000-0000-4000-8000-000000000027', 'CAMPAIGN_IMPORT', 'Import customers into campaigns.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

        ('10000000-0000-4000-8000-000000000028', 'PARTICIPATION_VIEW', 'View campaign participations.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('10000000-0000-4000-8000-000000000029', 'PARTICIPATION_CREATE', 'Create campaign participations.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('10000000-0000-4000-8000-000000000030', 'PARTICIPATION_STATUS_UPDATE', 'Update participation status.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

        ('10000000-0000-4000-8000-000000000031', 'CALL_VIEW', 'View call attempts.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('10000000-0000-4000-8000-000000000032', 'CALL_CREATE', 'Create call attempts.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

        ('10000000-0000-4000-8000-000000000033', 'DISCUSSION_VIEW', 'View campaign discussions.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('10000000-0000-4000-8000-000000000034', 'DISCUSSION_CREATE', 'Create campaign discussions.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

        ('10000000-0000-4000-8000-000000000035', 'PROMOTION_VIEW', 'View promotions.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('10000000-0000-4000-8000-000000000036', 'PROMOTION_CREATE', 'Create promotions.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('10000000-0000-4000-8000-000000000037', 'PROMOTION_UPDATE', 'Update promotions.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('10000000-0000-4000-8000-000000000038', 'PROMOTION_STATUS_UPDATE', 'Update promotion status.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

        ('10000000-0000-4000-8000-000000000039', 'PROMOTION_RECEIPT_VIEW', 'View promotion receipts.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('10000000-0000-4000-8000-000000000040', 'PROMOTION_RECEIPT_CREATE', 'Create promotion receipts.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

        ('10000000-0000-4000-8000-000000000041', 'AUDIT_VIEW', 'View audit logs.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

        ('10000000-0000-4000-8000-000000000042', 'REPORT_VIEW', 'View reports.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('10000000-0000-4000-8000-000000000043', 'REPORT_EXPORT', 'Export reports.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `,
];

export const migration002 = {
  version: 2,
  name: "seed_authorization",

  async up() {
    await executeMultiple(statements);

    const permissionIds = Array.from(
      { length: 43 },
      (_, index) =>
        `10000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
    );

    const roleIds = {
      administrator: "00000000-0000-4000-8000-000000000001",
      teamLeader: "00000000-0000-4000-8000-000000000002",
      crmStaff: "00000000-0000-4000-8000-000000000003",
      customerService: "00000000-0000-4000-8000-000000000004",
    };

    const rolePermissionStatements = [];

    for (const permissionId of permissionIds) {
      rolePermissionStatements.push({
        sql: `
                    INSERT INTO role_permissions (
                        id,
                        role_id,
                        permission_id,
                        created_at
                    )
                    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
                `,
        args: [crypto.randomUUID(), roleIds.administrator, permissionId],
      });
    }

    const teamLeaderPermissions = [
      "10000000-0000-4000-8000-000000000001",
      "10000000-0000-4000-8000-000000000002",
      "10000000-0000-4000-8000-000000000003",
      "10000000-0000-4000-8000-000000000004",
      "10000000-0000-4000-8000-000000000005",
      "10000000-0000-4000-8000-000000000006",
      "10000000-0000-4000-8000-000000000008",
      "10000000-0000-4000-8000-000000000009",
      "10000000-0000-4000-8000-000000000010",
      "10000000-0000-4000-8000-000000000011",
      "10000000-0000-4000-8000-000000000013",
      "10000000-0000-4000-8000-000000000015",
      "10000000-0000-4000-8000-000000000016",
      "10000000-0000-4000-8000-000000000017",
      "10000000-0000-4000-8000-000000000018",
      "10000000-0000-4000-8000-000000000019",
      "10000000-0000-4000-8000-000000000020",
      "10000000-0000-4000-8000-000000000021",
      "10000000-0000-4000-8000-000000000022",
      "10000000-0000-4000-8000-000000000023",
      "10000000-0000-4000-8000-000000000024",
      "10000000-0000-4000-8000-000000000025",
      "10000000-0000-4000-8000-000000000026",
      "10000000-0000-4000-8000-000000000027",
      "10000000-0000-4000-8000-000000000028",
      "10000000-0000-4000-8000-000000000031",
      "10000000-0000-4000-8000-000000000033",
      "10000000-0000-4000-8000-000000000035",
      "10000000-0000-4000-8000-000000000036",
      "10000000-0000-4000-8000-000000000037",
      "10000000-0000-4000-8000-000000000038",
      "10000000-0000-4000-8000-000000000039",
      "10000000-0000-4000-8000-000000000040",
      "10000000-0000-4000-8000-000000000042",
      "10000000-0000-4000-8000-000000000043",
    ];

    const crmStaffPermissions = [
      "10000000-0000-4000-8000-000000000001",
      "10000000-0000-4000-8000-000000000002",
      "10000000-0000-4000-8000-000000000003",
      "10000000-0000-4000-8000-000000000019",
      "10000000-0000-4000-8000-000000000023",
      "10000000-0000-4000-8000-000000000031",
      "10000000-0000-4000-8000-000000000032",
      "10000000-0000-4000-8000-000000000033",
      "10000000-0000-4000-8000-000000000034",
      "10000000-0000-4000-8000-000000000035",
      "10000000-0000-4000-8000-000000000039",
      "10000000-0000-4000-8000-000000000042",
    ];

    const customerServicePermissions = [
      "10000000-0000-4000-8000-000000000001",
      "10000000-0000-4000-8000-000000000002",
      "10000000-0000-4000-8000-000000000003",
      "10000000-0000-4000-8000-000000000019",
      "10000000-0000-4000-8000-000000000023",
      "10000000-0000-4000-8000-000000000028",
      "10000000-0000-4000-8000-000000000031",
      "10000000-0000-4000-8000-000000000033",
      "10000000-0000-4000-8000-000000000035",
      "10000000-0000-4000-8000-000000000039",
      "10000000-0000-4000-8000-000000000042",
    ];

    for (const [roleId, permissions] of [
      [roleIds.teamLeader, teamLeaderPermissions],
      [roleIds.crmStaff, crmStaffPermissions],
      [roleIds.customerService, customerServicePermissions],
    ]) {
      for (const permissionId of permissions) {
        rolePermissionStatements.push({
          sql: `
                        INSERT INTO role_permissions (
                            id,
                            role_id,
                            permission_id,
                            created_at
                        )
                        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
                    `,
          args: [crypto.randomUUID(), roleId, permissionId],
        });
      }
    }

    await executeMultiple(rolePermissionStatements);
  },
};
