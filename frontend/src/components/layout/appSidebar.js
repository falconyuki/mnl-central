export function renderAppSidebar(container) {
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
              class="bi bi-speedometer2 me-2"
              aria-hidden="true"
            ></i>
            Dashboard
          </a>

          <a
            href="#"
            class="nav-link"
            data-nav-item="campaigns"
          >
            <i
              class="bi bi-megaphone me-2"
              aria-hidden="true"
            ></i>
            Campaigns
          </a>

          <a
            href="#"
            class="nav-link"
            data-nav-item="customers"
          >
            <i
              class="bi bi-person"
              aria-hidden="true"
            ></i>
            Customers
          </a>

          <a
            href="#"
            class="nav-link"
            data-nav-item="websites"
          >
            <i
              class="bi bi-globe2 me-2"
              aria-hidden="true"
            ></i>
            Websites
          </a>

          <a
            href="#"
            class="nav-link"
            data-nav-item="users"
          >
            <i
              class="bi bi-person-gear"
              aria-hidden="true"
            ></i>
            Users
          </a>
        </div>
      </nav>
    </aside>
  `;
}
