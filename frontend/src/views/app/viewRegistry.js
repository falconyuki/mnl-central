import { getAccessToken } from "../../services/authService.js";
import { listUsers } from "../../services/userService.js";

const VIEW_REGISTRY = {
  dashboard: {
    id: "dashboard",
    title: "Dashboard",
    render() {
      return `
        <div class="container-fluid p-3 p-md-4">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h2 class="h5 mb-2">
                Dashboard
              </h2>

              <p class="text-body-secondary mb-0">
                Application shell is ready.
              </p>
            </div>
          </div>
        </div>
      `;
    },
  },

  users: {
    id: "users",
    title: "Users",

    render() {
      return `
        <div class="container-fluid p-3 p-md-4">
          <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
            <div>
              <h2 class="h4 mb-1">
                Users
              </h2>

              <p class="text-body-secondary mb-0">
                Manage system users and their access.
              </p>
            </div>

            <button
              type="button"
              class="btn btn-primary"
              id="create-user-button"
              data-bs-toggle="modal"
              data-bs-target="#create-user-modal"
            >
              <i
                class="bi bi-person-plus me-2"
                aria-hidden="true"
              ></i>
              Create User
            </button>
          </div>

          <div
            id="users-error"
            class="alert alert-danger d-none"
            role="alert"
          ></div>

          <div class="card border-0 shadow-sm">
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                  <thead class="table-light">
                    <tr>
                      <th scope="col">Username</th>
                      <th scope="col">Display Name</th>
                      <th scope="col">Role</th>
                      <th scope="col">Status</th>
                      <th scope="col" class="text-end">Actions</th>
                    </tr>
                  </thead>

                  <tbody id="users-table-body">
                    <tr>
                      <td
                        colspan="5"
                        class="text-center text-body-secondary py-5"
                      >
                        Loading users...
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div
            class="modal fade"
            id="create-user-modal"
            tabindex="-1"
            aria-labelledby="create-user-modal-label"
            aria-hidden="true"
          >
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <form id="create-user-form">
                  <div class="modal-header">
                    <h2
                      class="modal-title fs-5"
                      id="create-user-modal-label"
                    >
                      Create User
                    </h2>

                    <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>

                  <div class="modal-body">
                    <div class="mb-3">
                      <label
                        for="create-user-username"
                        class="form-label"
                      >
                        Username
                      </label>

                      <input
                        type="text"
                        class="form-control"
                        id="create-user-username"
                        name="username"
                        autocomplete="username"
                        required
                      >
                    </div>

                    <div class="mb-3">
                      <label
                        for="create-user-display-name"
                        class="form-label"
                      >
                        Display Name
                      </label>

                      <input
                        type="text"
                        class="form-control"
                        id="create-user-display-name"
                        name="displayName"
                        autocomplete="name"
                        required
                      >
                    </div>

                    <div class="mb-3">
                      <label
                        for="create-user-role"
                        class="form-label"
                      >
                        Role
                      </label>

                      <select
                        class="form-select"
                        id="create-user-role"
                        name="roleId"
                        required
                      >
                        <option value="">
                          Select a role
                        </option>
                      </select>
                    </div>

                    <div class="mb-0">
                      <label
                        for="create-user-password"
                        class="form-label"
                      >
                        Initial Password
                      </label>

                      <input
                        type="password"
                        class="form-control"
                        id="create-user-password"
                        name="password"
                        autocomplete="new-password"
                        required
                      >
                    </div>
                  </div>

                  <div class="modal-footer">
                    <button
                      type="button"
                      class="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      class="btn btn-primary"
                      id="create-user-submit"
                    >
                      Create User
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      `;
    },

    async initialize(container) {
      const tableBody = container.querySelector("#users-table-body");
      const errorContainer = container.querySelector("#users-error");

      if (!tableBody) {
        return;
      }

      try {
        const token = getAccessToken();

        if (!token) {
          throw {
            status: 401,
            code: "AUTHENTICATION_REQUIRED",
            message: "Authentication is required.",
          };
        }

        const response = await listUsers({
          token,
          page: 1,
          pageSize: 20,
        });

        const users = response?.data?.rows ?? [];

        if (users.length === 0) {
          tableBody.innerHTML = `
            <tr>
              <td
                colspan="5"
                class="text-center text-body-secondary py-5"
              >
                No users found.
              </td>
            </tr>
          `;

          return;
        }

        tableBody.innerHTML = users
          .map(
            (user) => `
              <tr>
                <td>${escapeHtml(user.username)}</td>
                <td>${escapeHtml(user.displayName)}</td>
                <td>${escapeHtml(user.roleName)}</td>
                <td>
                  <span class="badge ${getStatusBadgeClass(user.status)}">
                    ${escapeHtml(user.status)}
                  </span>
                </td>
                <td class="text-end">
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-secondary"
                    disabled
                  >
                    Actions
                  </button>
                </td>
              </tr>
            `,
          )
          .join("");
      } catch (error) {
        tableBody.innerHTML = `
          <tr>
            <td
              colspan="5"
              class="text-center text-body-secondary py-5"
            >
              Unable to load users.
            </td>
          </tr>
        `;

        if (errorContainer) {
          errorContainer.textContent =
            error?.message || "Unable to load users.";
          errorContainer.classList.remove("d-none");
        }
      }
    },
  },

  websites: {
    id: "websites",
    title: "Websites",
    render() {
      return `
        <div class="container-fluid p-3 p-md-4">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h2 class="h5 mb-2">
                Websites
              </h2>

              <p class="text-body-secondary mb-0">
                Website Management will be implemented here.
              </p>
            </div>
          </div>
        </div>
      `;
    },
  },

  campaigns: {
    id: "campaigns",
    title: "Campaigns",
    render() {
      return `
        <div class="container-fluid p-3 p-md-4">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h2 class="h5 mb-2">
                Campaigns
              </h2>

              <p class="text-body-secondary mb-0">
                Campaign Management will be implemented here.
              </p>
            </div>
          </div>
        </div>
      `;
    },
  },
};

export function resolveView(viewId) {
  return VIEW_REGISTRY[viewId] || null;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getStatusBadgeClass(status) {
  if (status === "Active") {
    return "text-bg-success";
  }

  if (status === "Disabled") {
    return "text-bg-secondary";
  }

  return "text-bg-light";
}
