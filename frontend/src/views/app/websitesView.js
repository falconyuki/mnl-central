import { Modal } from "bootstrap";

import { getAccessToken } from "../../services/authService.js";

import {
  listWebsites,
  createWebsite,
  updateWebsite,
  disableWebsite,
} from "../../services/websiteService.js";

import { escapeHtml, getStatusBadgeClass } from "../../utils/formatUtils.js";

const ACTIONS = {
  EDIT: "edit",
  DISABLE: "disable",
};

export function renderWebsitesView() {
  return `
    <div class="container-fluid p-3 p-md-4">

      <div
        class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4"
      >
        <div>
          <h2 class="h4 mb-1">Websites</h2>

          <p class="text-body-secondary mb-0">
            Manage websites used by the CRM.
          </p>
        </div>

        <button
          type="button"
          class="btn btn-primary"
          id="create-website-button"
          data-bs-toggle="modal"
          data-bs-target="#create-website-modal"
        >
          <i
            class="bi bi-globe2 me-2"
            aria-hidden="true"
          ></i>

          Create Website
        </button>
      </div>

      <div
        id="websites-error"
        class="alert alert-danger d-none"
        role="alert"
      ></div>

      <div class="card border-0 shadow-sm mb-3">
        <div class="card-body">
          <form id="websites-filter-form">

            <div class="row g-3 align-items-end">

              <div class="col-12 col-lg-7">
                <label
                  for="websites-filter-search"
                  class="form-label"
                >
                  Search
                </label>

                <input
                  type="search"
                  class="form-control"
                  id="websites-filter-search"
                  name="search"
                  placeholder="Website name or code"
                  autocomplete="off"
                >
              </div>

              <div class="col-12 col-md-5 col-lg-3">
                <label
                  for="websites-filter-status"
                  class="form-label"
                >
                  Status
                </label>

                <select
                  class="form-select"
                  id="websites-filter-status"
                  name="status"
                >
                  <option value="">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>

              <div class="col-12 col-md-7 col-lg-2">
                <button
                  type="submit"
                  class="btn btn-primary w-100"
                  title="Apply filters"
                >
                  <i
                    class="bi bi-search me-2"
                    aria-hidden="true"
                  ></i>
                  Filter
                </button>
              </div>

            </div>

            <div class="mt-3">
              <button
                type="button"
                class="btn btn-link btn-sm px-0"
                id="websites-filter-reset"
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
                  <th scope="col">Name</th>
                  <th scope="col">Code</th>
                  <th scope="col">Description</th>
                  <th scope="col">Status</th>
                  <th scope="col" class="text-end">Actions</th>
                </tr>
              </thead>

              <tbody id="websites-table-body">

                <tr>
                  <td
                    colspan="5"
                    class="text-center text-body-secondary py-5"
                  >
                    Loading websites...
                  </td>
                </tr>

              </tbody>

            </table>

          </div>

        </div>

      </div>

      <!-- Create Website Modal -->

      <div
        class="modal fade"
        id="create-website-modal"
        tabindex="-1"
        aria-labelledby="create-website-modal-label"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered">

          <div class="modal-content">

            <form id="create-website-form">

              <div class="modal-header">

                <h2
                  class="modal-title fs-5"
                  id="create-website-modal-label"
                >
                  Create Website
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
                    for="create-website-name"
                    class="form-label"
                  >
                    Name
                  </label>

                  <input
                    type="text"
                    class="form-control"
                    id="create-website-name"
                    name="name"
                    required
                  >

                </div>

                <div class="mb-3">

                  <label
                    for="create-website-code"
                    class="form-label"
                  >
                    Code
                  </label>

                  <input
                    type="text"
                    class="form-control"
                    id="create-website-code"
                    name="code"
                    required
                  >

                </div>

                <div class="mb-0">

                  <label
                    for="create-website-description"
                    class="form-label"
                  >
                    Description
                  </label>

                  <textarea
                    class="form-control"
                    id="create-website-description"
                    name="description"
                    rows="3"
                  ></textarea>

                </div>

                <div
                  id="create-website-error"
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
                  id="create-website-submit"
                >
                  Create Website
                </button>

              </div>

            </form>

          </div>

        </div>
      </div>

      <!-- Website Action Modal -->

      <div
        class="modal fade"
        id="website-action-modal"
        tabindex="-1"
        aria-labelledby="website-action-modal-label"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered">

          <div class="modal-content">

            <form id="website-action-form">

              <div class="modal-header">

                <h2
                  class="modal-title fs-5"
                  id="website-action-modal-label"
                >
                  Website Action
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
                id="website-action-modal-body"
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
                  id="website-action-submit"
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

export async function initializeWebsitesView(container) {
  const tableBody = container.querySelector("#websites-table-body");
  const errorContainer = container.querySelector("#websites-error");

  const actionModalElement = container.querySelector("#website-action-modal");

  if (!tableBody) {
    return;
  }

  const token = getAccessToken();

  if (!token) {
    showWebsitesLoadError(
      tableBody,
      errorContainer,
      "Authentication is required.",
    );

    return;
  }

  const state = {
    websites: [],
    action: null,
    selectedWebsite: null,
    filters: {
      search: "",
      status: "",
    },
  };

  try {
    await loadWebsites({
      token,
      state,
      tableBody,
      errorContainer,
    });

    initializeCreateWebsiteForm({
      token,
      container,
      state,
      tableBody,
      errorContainer,
    });

    initializeWebsiteFilters({
      token,
      container,
      state,
      tableBody,
      errorContainer,
    });

    initializeWebsiteActionButtons({
      container,
      state,
      actionModalElement,
    });

    initializeWebsiteActionForm({
      token,
      container,
      state,
      tableBody,
      errorContainer,
      actionModalElement,
    });
  } catch (error) {
    showWebsitesLoadError(
      tableBody,
      errorContainer,
      error?.message || "Unable to load websites.",
    );
  }
}

async function loadWebsites({ token, state, tableBody, errorContainer }) {
  const response = await listWebsites({
    token,
    page: 1,
    pageSize: 20,
    search: state.filters.search,
    status: state.filters.status,
  });

  state.websites = response?.data ?? [];

  renderWebsites(state.websites, tableBody);

  if (errorContainer) {
    errorContainer.textContent = "";
    errorContainer.classList.add("d-none");
  }
}

function initializeCreateWebsiteForm({
  token,
  container,
  state,
  tableBody,
  errorContainer,
}) {
  const form = container.querySelector("#create-website-form");

  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = form.querySelector("#create-website-submit");

    const formError = form.querySelector("#create-website-error");

    if (submitButton) {
      submitButton.disabled = true;
    }

    if (formError) {
      formError.textContent = "";
      formError.classList.add("d-none");
    }

    try {
      const formData = new FormData(form);

      await createWebsite({
        token,
        name: formData.get("name"),
        code: formData.get("code"),
        description: formData.get("description"),
      });

      form.reset();

      const modalElement = form.closest(".modal");

      const modal = modalElement
        ? Modal.getOrCreateInstance(modalElement)
        : null;

      modal?.hide();

      await loadWebsites({
        token,
        state,
        tableBody,
        errorContainer,
      });
    } catch (error) {
      if (formError) {
        formError.textContent = error?.message || "Unable to create website.";

        formError.classList.remove("d-none");
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}

function initializeWebsiteFilters({
  token,
  container,
  state,
  tableBody,
  errorContainer,
}) {
  const form = container.querySelector("#websites-filter-form");

  const resetButton = container.querySelector("#websites-filter-reset");

  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    state.filters.search = String(formData.get("search") ?? "").trim();

    state.filters.status = String(formData.get("status") ?? "");

    try {
      await loadWebsites({
        token,
        state,
        tableBody,
        errorContainer,
      });
    } catch (error) {
      showWebsitesLoadError(
        tableBody,
        errorContainer,
        error?.message || "Unable to load websites.",
      );
    }
  });

  resetButton?.addEventListener("click", async () => {
    state.filters.search = "";
    state.filters.status = "";

    form.reset();

    try {
      await loadWebsites({
        token,
        state,
        tableBody,
        errorContainer,
      });
    } catch (error) {
      showWebsitesLoadError(
        tableBody,
        errorContainer,
        error?.message || "Unable to load websites.",
      );
    }
  });
}

function initializeWebsiteActionButtons({
  container,
  state,
  actionModalElement,
}) {
  const tableBody = container.querySelector("#websites-table-body");

  if (!tableBody || !actionModalElement) {
    return;
  }

  tableBody.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-website-action]");

    if (!actionButton) {
      return;
    }

    const websiteId = actionButton.dataset.websiteId;
    const action = actionButton.dataset.websiteAction;

    const website = state.websites.find((item) => item.id === websiteId);

    if (!website) {
      return;
    }

    openWebsiteActionModal({
      container,
      state,
      website,
      action,
    });
  });
}

function openWebsiteActionModal({ container, state, website, action }) {
  const modalElement = container.querySelector("#website-action-modal");

  const modalBody = container.querySelector("#website-action-modal-body");

  const modalTitle = container.querySelector("#website-action-modal-label");

  const submitButton = container.querySelector("#website-action-submit");

  if (!modalElement || !modalBody || !modalTitle || !submitButton) {
    return;
  }

  state.action = action;
  state.selectedWebsite = website;

  modalBody.innerHTML = "";
  submitButton.disabled = false;

  if (action === ACTIONS.EDIT) {
    modalTitle.textContent = "Edit Website";
    submitButton.textContent = "Save Changes";
    submitButton.className = "btn btn-primary";

    modalBody.innerHTML = renderEditWebsiteForm(website);
  } else if (action === ACTIONS.DISABLE) {
    modalTitle.textContent = "Disable Website";
    submitButton.textContent = "Disable Website";
    submitButton.className = "btn btn-danger";

    modalBody.innerHTML = renderDisableWebsiteForm(website);
  }

  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
}

function renderEditWebsiteForm(website) {
  return `
    <div class="mb-3">

      <label
        for="website-action-name"
        class="form-label"
      >
        Name
      </label>

      <input
        type="text"
        class="form-control"
        id="website-action-name"
        name="name"
        value="${escapeHtml(website.name)}"
        required
      >

    </div>

    <div class="mb-3">

      <label
        for="website-action-code"
        class="form-label"
      >
        Code
      </label>

      <input
        type="text"
        class="form-control"
        id="website-action-code"
        name="code"
        value="${escapeHtml(website.code)}"
        required
      >

    </div>

    <div class="mb-0">

      <label
        for="website-action-description"
        class="form-label"
      >
        Description
      </label>

      <textarea
        class="form-control"
        id="website-action-description"
        name="description"
        rows="3"
      >${escapeHtml(website.description ?? "")}</textarea>

    </div>

    <div
      id="website-action-error"
      class="alert alert-danger d-none mt-3 mb-0"
      role="alert"
    ></div>
  `;
}

function renderDisableWebsiteForm(website) {
  return `
    <p class="mb-2">
      Are you sure you want to
      <strong>disable</strong>
      website
      <strong>${escapeHtml(website.name)}</strong>?
    </p>

    <p class="text-body-secondary mb-0">
      This action cannot be reversed.
    </p>

    <div
      id="website-action-error"
      class="alert alert-danger d-none mt-3 mb-0"
      role="alert"
    ></div>
  `;
}

function initializeWebsiteActionForm({
  token,
  container,
  state,
  tableBody,
  errorContainer,
  actionModalElement,
}) {
  const form = container.querySelector("#website-action-form");

  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = container.querySelector("#website-action-submit");

    const formError = form.querySelector("#website-action-error");

    if (submitButton) {
      submitButton.disabled = true;
    }

    if (formError) {
      formError.textContent = "";
      formError.classList.add("d-none");
    }

    try {
      const website = state.selectedWebsite;

      if (!website) {
        throw new Error("No website was selected.");
      }

      if (state.action === ACTIONS.EDIT) {
        await submitEditWebsite({
          token,
          form,
          website,
        });
      } else if (state.action === ACTIONS.DISABLE) {
        await submitDisableWebsite({
          token,
          website,
        });
      }

      const modal = Modal.getOrCreateInstance(actionModalElement);

      modal.hide();

      state.action = null;
      state.selectedWebsite = null;

      await loadWebsites({
        token,
        state,
        tableBody,
        errorContainer,
      });
    } catch (error) {
      if (formError) {
        formError.textContent =
          error?.message || "Unable to complete this action.";

        formError.classList.remove("d-none");
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}

async function submitEditWebsite({ token, form, website }) {
  const formData = new FormData(form);

  await updateWebsite({
    token,
    id: website.id,
    name: formData.get("name"),
    code: formData.get("code"),
    description: formData.get("description"),
  });
}

async function submitDisableWebsite({ token, website }) {
  await disableWebsite({
    token,
    id: website.id,
  });
}

function renderWebsites(websites, tableBody) {
  if (!tableBody) {
    return;
  }

  if (websites.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td
          colspan="5"
          class="text-center text-body-secondary py-5"
        >
          No websites found.
        </td>
      </tr>
    `;

    return;
  }

  tableBody.innerHTML = websites
    .map(
      (website) => `
        <tr>

          <td>
            <span class="fw-semibold">
              ${escapeHtml(website.name)}
            </span>
          </td>

          <td>
            <code>
              ${escapeHtml(website.code)}
            </code>
          </td>

          <td>
            ${
              website.description
                ? escapeHtml(website.description)
                : `<span class="text-body-secondary">—</span>`
            }
          </td>

          <td>
            <span
              class="badge ${getStatusBadgeClass(website.status)}"
            >
              ${escapeHtml(website.status)}
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
                    data-website-action="${ACTIONS.EDIT}"
                    data-website-id="${escapeHtml(website.id)}"
                  >
                    <i
                      class="bi bi-pencil me-2"
                      aria-hidden="true"
                    ></i>
                    Edit Website
                  </button>
                </li>

                ${
                  website.status === "Active"
                    ? `
                      <li>
                        <hr class="dropdown-divider">
                      </li>

                      <li>
                        <button
                          type="button"
                          class="dropdown-item text-danger"
                          data-website-action="${ACTIONS.DISABLE}"
                          data-website-id="${escapeHtml(website.id)}"
                        >
                          <i
                            class="bi bi-globe2 me-2"
                            aria-hidden="true"
                          ></i>
                          Disable Website
                        </button>
                      </li>
                    `
                    : ""
                }

              </ul>

            </div>

          </td>

        </tr>
      `,
    )
    .join("");
}

function showWebsitesLoadError(tableBody, errorContainer, message) {
  if (tableBody) {
    tableBody.innerHTML = `
      <tr>
        <td
          colspan="5"
          class="text-center text-body-secondary py-5"
        >
          Unable to load websites.
        </td>
      </tr>
    `;
  }

  if (errorContainer) {
    errorContainer.textContent = message;
    errorContainer.classList.remove("d-none");
  }
}
