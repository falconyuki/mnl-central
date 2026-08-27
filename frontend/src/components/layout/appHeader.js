export function renderAppHeader(container, { user, onLogout } = {}) {
  container.innerHTML = `
    <header class="app-header border-bottom bg-body">
      <div class="d-flex align-items-center justify-content-between px-3 py-2">
        <div class="d-flex align-items-center gap-2">
          <button
            type="button"
            class="btn btn-outline-secondary d-lg-none"
            id="sidebar-toggle"
            aria-label="Toggle navigation"
            aria-controls="app-sidebar"
            aria-expanded="false"
          >
            <i
              class="bi bi-list"
              aria-hidden="true"
            ></i>
          </button>

          <h1
            class="h5 mb-0"
            id="page-title"
          >
            Dashboard
          </h1>
        </div>

        <div class="dropdown">
          <button
            type="button"
            class="btn btn-link text-body text-decoration-none d-flex align-items-center gap-2"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <span
              class="rounded-circle bg-primary-subtle text-primary d-inline-flex align-items-center justify-content-center"
              style="width: 36px; height: 36px;"
            >
              <i
                class="bi bi-person-fill"
                aria-hidden="true"
              ></i>
            </span>

            <span class="d-none d-sm-inline">
              ${user?.displayName || user?.username || "User"}
            </span>

            <i
              class="bi bi-chevron-down small"
              aria-hidden="true"
            ></i>
          </button>

          <ul class="dropdown-menu dropdown-menu-end">
            <li>
              <span class="dropdown-item-text text-body-secondary">
                ${user?.username || ""}
              </span>
            </li>

            <li>
              <hr class="dropdown-divider">
            </li>

            <li>
              <button
                type="button"
                class="dropdown-item"
                id="logout-button"
              >
                <i
                  class="bi bi-box-arrow-right me-2"
                  aria-hidden="true"
                ></i>
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  `;

  const logoutButton = container.querySelector("#logout-button");

  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      logoutButton.disabled = true;

      try {
        if (typeof onLogout === "function") {
          await onLogout();
        }
      } finally {
        logoutButton.disabled = false;
      }
    });
  }
}
