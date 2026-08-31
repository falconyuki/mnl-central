import { hasPermission } from "../../services/authService.js";

export function renderAppSidebar(container) {
  const navigationItems = [
    {
      viewId: "campaigns",
      permission: "CAMPAIGN_VIEW",
      icon: "bi-megaphone",
      label: "Campaigns",
    },
    {
      viewId: "promotions",
      permission: "PROMOTION_VIEW",
      icon: "bi-gift",
      label: "Promotions",
    },
    {
      viewId: "customers",
      permission: "CUSTOMER_VIEW",
      icon: "bi-person",
      label: "Customers",
    },
    {
      viewId: "participations",
      permissions: ["PARTICIPATION_VIEW", "CALL_VIEW"],
      icon: "bi-person-up",
      label: "Participations",
    },
    {
      viewId: "callAttempts",
      permission: "CALL_VIEW",
      icon: "bi-clock-history",
      label: "Call Logs",
    },
    {
      viewId: "promotionsLog",
      permission: "PROMOTION_RECEIPT_VIEW",
      icon: "bi-gift-fill",
      label: "Promotion Log",
    },
    {
      viewId: "websites",
      permission: "WEBSITE_VIEW",
      icon: "bi-globe2 me-2",
      label: "Websites",
    },
    {
      viewId: "users",
      permission: "USER_VIEW",
      icon: "bi-person-gear",
      label: "Users",
    },
  ];

  const visibleNavigationItems = navigationItems.filter((item) =>
    canAccessNavItem(item),
  );

  const navigationMarkup = visibleNavigationItems
    .map(
      (item) => `
        <a
          href="#"
          class="nav-link"
          data-nav-item="${item.viewId}"
        >
          <i
            class="bi ${item.icon}"
            aria-hidden="true"
          ></i>
          ${item.label}
        </a>
      `,
    )
    .join("");

  container.innerHTML = `
    <aside
      class="app-sidebar d-flex flex-column border-end bg-body"
      id="app-sidebar"
    >
      <div class="p-3 border-bottom">
        <div class="d-flex align-items-center gap-2">
          <span
            class="text-primary fs-4"
            aria-hidden="true"
          >
            <i class="bi bi-grid-1x2-fill"></i>
          </span>

          <span class="fw-semibold">
            MNL-Central
          </span>
        </div>
      </div>

      <nav
        class="flex-grow-1 p-3"
        aria-label="Main navigation"
      >
        <div class="nav flex-column gap-1">
          <a
            href="#"
            class="nav-link active"
            data-nav-item="dashboard"
          >
            <i
              class="bi bi-speedometer2"
              aria-hidden="true"
            ></i>
            Dashboard
          </a>

          ${navigationMarkup}
        </div>
      </nav>
    </aside>
  `;
}

function canAccessNavItem(item) {
  if (Array.isArray(item.permissions)) {
    return item.permissions.some((permission) => hasPermission(permission));
  }

  return item.permission ? hasPermission(item.permission) : true;
}
