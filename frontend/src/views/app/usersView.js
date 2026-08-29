import { Modal } from "bootstrap";

import { getAccessToken } from "../../services/authService.js";

import {
  listUsers,
  createUser,
  updateUser,
  updateUserStatus,
  updateUserRole,
  resetUserPassword,
  listUserWebsiteAccess,
  grantUserWebsiteAccess,
  revokeUserWebsiteAccess,
} from "../../services/userService.js";

import { listRoles } from "../../services/roleService.js";
import { listWebsites } from "../../services/websiteService.js";

import { escapeHtml, getStatusBadgeClass } from "../../utils/formatUtils.js";

const ACTIONS = {
  EDIT: "edit",
  ROLE: "role",
  STATUS: "status",
  PASSWORD: "password",
  WEBSITE_ACCESS: "website-access",
};

export function renderUsersView() {
  return `
    <div class="container-fluid p-3 p-md-4">

      <div
        class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4"
      >
        <div>
          <h2 class="h4 mb-1">Users</h2>

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

      <div class="card border-0 shadow-sm mb-3">
        <div class="card-body">
          <form id="users-filter-form">
            <div class="row g-3 align-items-end">
              <div class="col-12 col-lg-5">
                <label for="users-filter-search" class="form-label">
                  Search
                </label>
                <input
                  type="search"
                  class="form-control"
                  id="users-filter-search"
                  name="search"
                  placeholder="Username or display name"
                  autocomplete="off"
                >
              </div>

              <div class="col-12 col-md-4 col-lg-3">
                <label for="users-filter-status" class="form-label">
                  Status
                </label>
                <select
                  class="form-select"
                  id="users-filter-status"
                  name="status"
                >
                  <option value="">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>

              <div class="col-12 col-md-4 col-lg-3">
                <label for="users-filter-role" class="form-label">
                  Role
                </label>
                <select
                  class="form-select"
                  id="users-filter-role"
                  name="roleId"
                >
                  <option value="">All Roles</option>
                </select>
              </div>

              <div class="col-12 col-md-4 col-lg-1">
                <div class="d-flex gap-2">
                  <button
                    type="submit"
                    class="btn btn-primary flex-grow-1"
                    title="Apply filters"
                  >
                    <i class="bi bi-search" aria-hidden="true"></i>
                    <span class="d-lg-none ms-2">Filter</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="mt-3">
              <button
                type="button"
                class="btn btn-link btn-sm px-0"
                id="users-filter-reset"
              >
                Reset Filters
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="card border-0 shadow-sm">
        <div class="card-body p-0">
          <div class="table-responsive page-table-container">

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

      <!-- Create User Modal -->

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

                <div
                  id="create-user-error"
                  class="alert alert-danger d-none mt-3 mb-0"
                  role="alert"
                ></div>

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

      <!-- User Action Modal -->

      <div
        class="modal fade"
        id="user-action-modal"
        tabindex="-1"
        aria-labelledby="user-action-modal-label"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered">

          <div class="modal-content">

            <form id="user-action-form">

              <div class="modal-header">

                <h2
                  class="modal-title fs-5"
                  id="user-action-modal-label"
                >
                  User Action
                </h2>

                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>

              </div>

              <div
                class="modal-body"
                id="user-action-modal-body"
              ></div>

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
                  id="user-action-submit"
                >
                  Save
                </button>

              </div>

            </form>

          </div>
        </div>
      </div>

    </div>
  `;
}

export async function initializeUsersView(container) {
  const tableBody = container.querySelector("#users-table-body");
  const errorContainer = container.querySelector("#users-error");

  const userActionModalElement = container.querySelector("#user-action-modal");

  if (!tableBody) {
    return;
  }

  const token = getAccessToken();

  if (!token) {
    showUsersLoadError(
      tableBody,
      errorContainer,
      "Authentication is required.",
    );

    return;
  }

  const state = {
    users: [],
    roles: [],
    action: null,
    selectedUser: null,
    filters: {
      search: "",
      status: "",
      roleId: "",
    },
  };

  try {
    state.roles = await loadRoles(token, container);

    await loadUsers({
      token,
      state,
      tableBody,
    });

    initializeCreateUserForm({
      token,
      container,
      state,
      tableBody,
    });

    initializeUserFilters({
      token,
      container,
      state,
      tableBody,
    });

    initializeUserActionForm({
      token,
      container,
      state,
      tableBody,
      userActionModalElement,
    });

    initializeUserActionButtons({
      container,
      state,
      userActionModalElement,
    });
  } catch (error) {
    showUsersLoadError(
      tableBody,
      errorContainer,
      error?.message || "Unable to load users.",
    );
  }
}

async function loadRoles(token, container) {
  const createRoleSelect = container.querySelector("#create-user-role");

  const filterRoleSelect = container.querySelector("#users-filter-role");

  const rolesResponse = await listRoles({ token });
  const roles = rolesResponse?.data ?? [];

  populateRoleSelect(createRoleSelect, roles, "", "Select a role");

  populateRoleSelect(filterRoleSelect, roles, "", "All Roles");

  return roles;
}

function populateRoleSelect(
  select,
  roles,
  selectedRoleId = "",
  placeholder = "Select a role",
) {
  if (!select) {
    return;
  }

  select.innerHTML = `
    <option value="">
      ${escapeHtml(placeholder)}
    </option>
  `;

  roles.forEach((role) => {
    const option = document.createElement("option");

    option.value = role.id;
    option.textContent = role.name;
    option.selected = role.id === selectedRoleId;

    select.appendChild(option);
  });
}

async function loadUsers({ token, state, tableBody, errorContainer }) {
  const response = await listUsers({
    token,
    page: 1,
    pageSize: 20,
    search: state.filters.search,
    status: state.filters.status,
    roleId: state.filters.roleId,
  });

  if (errorContainer) {
    errorContainer.textContent = "";
    errorContainer.classList.add("d-none");
  }

  state.users = response?.data?.rows ?? [];

  renderUsers(state.users, tableBody);
}

function initializeCreateUserForm({ token, container, state, tableBody }) {
  const form = container.querySelector("#create-user-form");

  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    await handleCreateUserSubmit({
      event,
      form,
      token,
      state,
      tableBody,
    });
  });
}

async function handleCreateUserSubmit({ form, token, state, tableBody }) {
  const submitButton = form.querySelector("#create-user-submit");

  const formError = form.querySelector("#create-user-error");

  if (submitButton) {
    submitButton.disabled = true;
  }

  if (formError) {
    formError.textContent = "";
    formError.classList.add("d-none");
  }

  try {
    const formData = new FormData(form);

    await createUser({
      token,
      username: formData.get("username"),
      displayName: formData.get("displayName"),
      password: formData.get("password"),
      roleId: formData.get("roleId"),
    });

    form.reset();

    const modalElement = form.closest(".modal");

    const modal = modalElement ? Modal.getOrCreateInstance(modalElement) : null;

    modal?.hide();

    await loadUsers({
      token,
      state,
      tableBody,
    });
  } catch (error) {
    if (formError) {
      formError.textContent = error?.message || "Unable to create user.";

      formError.classList.remove("d-none");
    }
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
    }
  }
}

function initializeUserActionButtons({
  container,
  state,
  userActionModalElement,
}) {
  const tableBody = container.querySelector("#users-table-body");

  if (!tableBody || !userActionModalElement) {
    return;
  }

  tableBody.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-user-action]");

    if (!actionButton) {
      return;
    }

    const userId = actionButton.dataset.userId;

    const action = actionButton.dataset.userAction;

    const user = state.users.find((item) => item.id === userId);

    if (!user) {
      return;
    }

    openUserActionModal({
      container,
      state,
      user,
      action,
    });
  });
}

function openUserActionModal({ container, state, user, action }) {
  const modalElement = container.querySelector("#user-action-modal");
  const modalBody = container.querySelector("#user-action-modal-body");
  const modalTitle = container.querySelector("#user-action-modal-label");
  const submitButton = container.querySelector("#user-action-submit");

  if (!modalElement || !modalBody || !modalTitle || !submitButton) {
    return;
  }

  state.action = action;
  state.selectedUser = user;

  modalBody.innerHTML = "";
  submitButton.disabled = false;

  if (action === ACTIONS.EDIT) {
    modalTitle.textContent = "Edit User";
    submitButton.textContent = "Save Changes";

    modalBody.innerHTML = renderEditUserForm(user);
  } else if (action === ACTIONS.ROLE) {
    modalTitle.textContent = "Change Role";
    submitButton.textContent = "Change Role";

    modalBody.innerHTML = renderRoleForm(user, state.roles);
  } else if (action === ACTIONS.STATUS) {
    modalTitle.textContent =
      user.status === "Active" ? "Disable User" : "Activate User";

    submitButton.textContent =
      user.status === "Active" ? "Disable User" : "Activate User";

    modalBody.innerHTML = renderStatusForm(user);
  } else if (action === ACTIONS.PASSWORD) {
    modalTitle.textContent = "Reset Password";
    submitButton.textContent = "Reset Password";

    modalBody.innerHTML = renderPasswordForm();
  } else if (action === ACTIONS.WEBSITE_ACCESS) {
    modalTitle.textContent = "Manage Website Access";
    submitButton.textContent = "Save Access";

    modalBody.innerHTML = `
      <div class="text-center text-body-secondary py-3">
        Loading website access...
      </div>
    `;

    loadWebsiteAccessModal({
      container,
      user,
    }).catch((error) => {
      modalBody.innerHTML = renderActionError(
        error?.message || "Unable to load website access.",
      );
    });
  }

  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
}

function renderEditUserForm(user) {
  return `
    <div class="mb-0">
      <label
        for="user-action-display-name"
        class="form-label"
      >
        Display Name
      </label>

      <input
        type="text"
        class="form-control"
        id="user-action-display-name"
        name="displayName"
        value="${escapeHtml(user.displayName)}"
        required
      >
    </div>

    <div
      id="user-action-error"
      class="alert alert-danger d-none mt-3 mb-0"
      role="alert"
    ></div>
  `;
}

function renderRoleForm(user, roles) {
  return `
    <div class="mb-0">

      <label
        for="user-action-role"
        class="form-label"
      >
        Role
      </label>

      <select
        class="form-select"
        id="user-action-role"
        name="roleId"
        required
      >
        ${roles
          .map(
            (role) => `
              <option
                value="${escapeHtml(role.id)}"
                ${role.id === user.roleId ? "selected" : ""}
              >
                ${escapeHtml(role.name)}
              </option>
            `,
          )
          .join("")}
      </select>

    </div>

    <div
      id="user-action-error"
      class="alert alert-danger d-none mt-3 mb-0"
      role="alert"
    ></div>
  `;
}

function renderStatusForm(user) {
  const nextStatus = user.status === "Active" ? "Disabled" : "Active";
  const actionText = nextStatus === "Disabled" ? "disable" : "activate";

  return `
    <p class="mb-0">
      Are you sure you want to
      <strong>${actionText}</strong>
      user
      <strong>${escapeHtml(user.displayName)}</strong>
     ?
    </p>

    <div
      id="user-action-error"
      class="alert alert-danger d-none mt-3 mb-0"
      role="alert"
    ></div>
  `;
}

function renderPasswordForm() {
  return `
    <div class="mb-3">

      <label
        for="user-action-password"
        class="form-label"
      >
        New Password
      </label>

      <input
        type="password"
        class="form-control"
        id="user-action-password"
        name="password"
        autocomplete="new-password"
        required
      >

    </div>

    <div class="mb-0">

      <label
        for="user-action-password-confirmation"
        class="form-label"
      >
        Confirm New Password
      </label>

      <input
        type="password"
        class="form-control"
        id="user-action-password-confirmation"
        name="passwordConfirmation"
        autocomplete="new-password"
        required
      >

    </div>

    <div
      id="user-action-error"
      class="alert alert-danger d-none mt-3 mb-0"
      role="alert"
    ></div>
  `;
}

async function loadWebsiteAccessModal({ container, user }) {
  const modalBody = container.querySelector("#user-action-modal-body");
  if (!modalBody) {
    return;
  }

  const token = getAccessToken();
  if (!token) {
    throw new Error("Authentication is required.");
  }

  const [websitesResponse, accessResponse] = await Promise.all([
    listWebsites({
      token,
      page: 1,
      pageSize: 100,
      status: "Active",
    }),

    listUserWebsiteAccess({
      token,
      id: user.id,
    }),
  ]);

  const websites = websitesResponse?.data ?? [];

  const access = accessResponse?.data ?? [];

  const accessIds = new Set(access.map((item) => item.websiteId));

  if (websites.length === 0) {
    modalBody.innerHTML = `
      <div class="text-body-secondary">
        No active websites are available.
      </div>

      <div
        id="user-action-error"
        class="alert alert-danger d-none mt-3 mb-0"
        role="alert"
      ></div>
    `;

    return;
  }

  modalBody.innerHTML = `
    <p class="text-body-secondary mb-3">
      Select the websites this user can access.
    </p>

    <div class="list-group">
      ${websites
        .map(
          (website) => `
            <label
              class="list-group-item d-flex align-items-center gap-3"
            >
              <input
                type="checkbox"
                class="form-check-input flex-shrink-0"
                name="websiteIds"
                value="${escapeHtml(website.id)}"
                ${accessIds.has(website.id) ? "checked" : ""}
              >

              <span>
                <span class="fw-semibold">
                  ${escapeHtml(website.name)}
                </span>

                <span
                  class="d-block text-body-secondary small"
                >
                  ${escapeHtml(website.code)}
                </span>
              </span>
            </label>
          `,
        )
        .join("")}
    </div>

    <div
      id="user-action-error"
      class="alert alert-danger d-none mt-3 mb-0"
      role="alert"
    ></div>
  `;
}

function initializeUserActionForm({
  token,
  container,
  state,
  tableBody,
  userActionModalElement,
}) {
  const form = container.querySelector("#user-action-form");

  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    await handleUserActionSubmit({
      event,
      token,
      container,
      form,
      state,
      tableBody,
      userActionModalElement,
    });
  });
}

async function handleUserActionSubmit({
  token,
  container,
  form,
  state,
  tableBody,
  userActionModalElement,
}) {
  const submitButton = container.querySelector("#user-action-submit");

  const formError = form.querySelector("#user-action-error");

  if (submitButton) {
    submitButton.disabled = true;
  }

  if (formError) {
    formError.textContent = "";
    formError.classList.add("d-none");
  }

  try {
    const user = state.selectedUser;

    if (!user) {
      throw new Error("No user was selected.");
    }

    if (state.action === ACTIONS.EDIT) {
      await submitEditUser({
        token,
        form,
        user,
      });
    } else if (state.action === ACTIONS.ROLE) {
      await submitRoleChange({
        token,
        form,
        user,
      });
    } else if (state.action === ACTIONS.STATUS) {
      await submitStatusChange({
        token,
        user,
      });
    } else if (state.action === ACTIONS.PASSWORD) {
      await submitPasswordReset({
        token,
        form,
        user,
      });
    } else if (state.action === ACTIONS.WEBSITE_ACCESS) {
      await submitWebsiteAccess({
        token,
        form,
        user,
      });
    }

    const modal = Modal.getOrCreateInstance(userActionModalElement);

    modal.hide();

    state.action = null;
    state.selectedUser = null;

    await loadUsers({
      token,
      state,
      tableBody,
    });
  } catch (error) {
    const errorMessage = error?.message || "Unable to complete this action.";

    if (formError) {
      formError.textContent = errorMessage;
      formError.classList.remove("d-none");
    }
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
    }
  }
}

async function submitEditUser({ token, form, user }) {
  const formData = new FormData(form);

  const displayName = formData.get("displayName");

  await updateUser({
    token,
    id: user.id,
    displayName,
  });
}

async function submitRoleChange({ token, form, user }) {
  const formData = new FormData(form);

  const roleId = formData.get("roleId");

  await updateUserRole({
    token,
    id: user.id,
    roleId,
  });
}

async function submitStatusChange({ token, user }) {
  const status = user.status === "Active" ? "Disabled" : "Active";

  await updateUserStatus({
    token,
    id: user.id,
    status,
  });
}

async function submitPasswordReset({ token, form, user }) {
  const formData = new FormData(form);

  const password = formData.get("password");

  const passwordConfirmation = formData.get("passwordConfirmation");

  if (password !== passwordConfirmation) {
    throw new Error("Passwords do not match.");
  }

  await resetUserPassword({
    token,
    id: user.id,
    password,
  });
}

async function submitWebsiteAccess({ token, form, user }) {
  const selectedIds = new Set(
    Array.from(form.querySelectorAll('input[name="websiteIds"]:checked')).map(
      (input) => input.value,
    ),
  );

  const currentResponse = await listUserWebsiteAccess({
    token,
    id: user.id,
  });

  const currentAccess = currentResponse?.data ?? [];

  const currentIds = new Set(currentAccess.map((item) => item.websiteId));

  const idsToGrant = Array.from(selectedIds).filter(
    (websiteId) => !currentIds.has(websiteId),
  );

  const idsToRevoke = Array.from(currentIds).filter(
    (websiteId) => !selectedIds.has(websiteId),
  );

  for (const websiteId of idsToRevoke) {
    await revokeUserWebsiteAccess({
      token,
      id: user.id,
      websiteId,
    });
  }

  for (const websiteId of idsToGrant) {
    await grantUserWebsiteAccess({
      token,
      id: user.id,
      websiteId,
    });
  }
}

function renderUsers(users, tableBody) {
  if (!tableBody) {
    return;
  }

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

          <td>
            ${escapeHtml(user.username)}
          </td>

          <td>
            ${escapeHtml(user.displayName)}
          </td>

          <td>
            ${escapeHtml(user.roleName)}
          </td>

          <td>
            <span
              class="badge ${getStatusBadgeClass(user.status)}"
            >
              ${escapeHtml(user.status)}
            </span>
          </td>

          <td class="text-end">

            <div class="dropdown">

              <button
                type="button"
                class="btn btn-sm btn-outline-secondary dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Actions
              </button>

              <ul class="dropdown-menu dropdown-menu-end">

                <li>
                  <button
                    type="button"
                    class="dropdown-item"
                    data-user-action="${ACTIONS.EDIT}"
                    data-user-id="${escapeHtml(user.id)}"
                  >
                    <i
                      class="bi bi-pencil me-2"
                      aria-hidden="true"
                    ></i>
                    Edit User
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    class="dropdown-item"
                    data-user-action="${ACTIONS.ROLE}"
                    data-user-id="${escapeHtml(user.id)}"
                  >
                    <i
                      class="bi bi-person-badge me-2"
                      aria-hidden="true"
                    ></i>
                    Change Role
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    class="dropdown-item"
                    data-user-action="${ACTIONS.WEBSITE_ACCESS}"
                    data-user-id="${escapeHtml(user.id)}"
                  >
                    <i
                      class="bi bi-globe2 me-2"
                      aria-hidden="true"
                    ></i>
                    Website Access
                  </button>
                </li>

                <li>
                  <hr class="dropdown-divider">
                </li>

                <li>
                  <button
                    type="button"
                    class="dropdown-item"
                    data-user-action="${ACTIONS.PASSWORD}"
                    data-user-id="${escapeHtml(user.id)}"
                  >
                    <i
                      class="bi bi-key me-2"
                      aria-hidden="true"
                    ></i>
                    Reset Password
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    class="dropdown-item ${
                      user.status === "Active" ? "text-danger" : "text-success"
                    }"
                    data-user-action="${ACTIONS.STATUS}"
                    data-user-id="${escapeHtml(user.id)}"
                  >
                    <i
                      class="bi ${
                        user.status === "Active"
                          ? "bi-person-x"
                          : "bi-person-check"
                      } me-2"
                      aria-hidden="true"
                    ></i>

                    ${
                      user.status === "Active"
                        ? "Disable User"
                        : "Activate User"
                    }
                  </button>
                </li>

              </ul>

            </div>

          </td>

        </tr>
      `,
    )
    .join("");
}

function showUsersLoadError(tableBody, errorContainer, message) {
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
    errorContainer.textContent = message;
    errorContainer.classList.remove("d-none");
  }
}

function renderActionError(message) {
  return `
    <div
      id="user-action-error"
      class="alert alert-danger mb-0"
      role="alert"
    >
      ${escapeHtml(message)}
    </div>
  `;
}

function initializeUserFilters({ token, container, state, tableBody }) {
  const form = container.querySelector("#users-filter-form");
  const resetButton = container.querySelector("#users-filter-reset");

  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    state.filters.search = String(formData.get("search") ?? "").trim();

    state.filters.status = String(formData.get("status") ?? "");

    state.filters.roleId = String(formData.get("roleId") ?? "");

    try {
      await loadUsers({
        token,
        state,
        tableBody,
      });
    } catch (error) {
      const errorContainer = container.querySelector("#users-error");

      if (errorContainer) {
        errorContainer.textContent = error?.message || "Unable to load users.";

        errorContainer.classList.remove("d-none");
      }
    }
  });

  resetButton?.addEventListener("click", async () => {
    state.filters.search = "";
    state.filters.status = "";
    state.filters.roleId = "";

    form.reset();

    try {
      await loadUsers({
        token,
        state,
        tableBody,
      });
    } catch (error) {
      const errorContainer = container.querySelector("#users-error");

      if (errorContainer) {
        errorContainer.textContent = error?.message || "Unable to load users.";

        errorContainer.classList.remove("d-none");
      }
    }
  });
}
