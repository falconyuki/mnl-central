import { Modal } from "bootstrap";

import { getAccessToken } from "../../services/authService.js";

import {
  listCustomers,
  createCustomer,
  updateCustomer,
  updateCustomerStatus,
} from "../../services/customerService.js";

import { listWebsites } from "../../services/websiteService.js";

import { escapeHtml, getStatusBadgeClass } from "../../utils/formatUtils.js";

const ACTIONS = {
  EDIT: "edit",
  ACTIVATE: "activate",
  INACTIVATE: "inactivate",
};

const STATUS = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};

export function renderCustomersView() {
  return `
    <div class="container-fluid p-3 p-md-4">

      <div
        class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4"
      >
        <div>
          <h2 class="h4 mb-1">Customers</h2>

          <p class="text-body-secondary mb-0">
            Manage customers used by the CRM.
          </p>
        </div>

        <button
          type="button"
          class="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#create-customer-modal"
        >
          <i
            class="bi bi-person-plus me-2"
            aria-hidden="true"
          ></i>

          Create Customer
        </button>
      </div>

      <div
        id="customers-error"
        class="alert alert-danger d-none"
        role="alert"
      ></div>

      <div class="card border-0 shadow-sm mb-3">
        <div class="card-body">

          <form id="customers-filter-form">

            <div class="row g-3 align-items-end">

              <div class="col-12 col-lg-7">

                <label
                  for="customers-filter-search"
                  class="form-label"
                >
                  Search
                </label>

                <input
                  type="search"
                  class="form-control"
                  id="customers-filter-search"
                  name="search"
                  placeholder="Username, name, or phone"
                  autocomplete="off"
                >

              </div>

              <div class="col-12 col-md-5 col-lg-3">

                <label
                  for="customers-filter-status"
                  class="form-label"
                >
                  Status
                </label>

                <select
                  class="form-select"
                  id="customers-filter-status"
                  name="status"
                >
                  <option value="">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
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
                id="customers-filter-reset"
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
                  <th scope="col">Website</th>
                  <th scope="col">Username</th>
                  <th scope="col">Name</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Status</th>
                  <th scope="col" class="text-end">Actions</th>
                </tr>

              </thead>

              <tbody id="customers-table-body">

                <tr>
                  <td
                    colspan="6"
                    class="text-center text-body-secondary py-5"
                  >
                    Loading customers...
                  </td>
                </tr>

              </tbody>

            </table>

          </div>

        </div>

      </div>

      <!-- Create Customer Modal -->

      <div
        class="modal fade"
        id="create-customer-modal"
        tabindex="-1"
        aria-labelledby="create-customer-modal-label"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg modal-dialog-centered">

          <div class="modal-content">

            <form id="create-customer-form">

              <div class="modal-header">

                <h2
                  class="modal-title fs-5"
                  id="create-customer-modal-label"
                >
                  Create Customer
                </h2>

                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>

              </div>

              <div class="modal-body">

                <div class="row g-3">

                  <div class="col-12 col-md-6">

                    <label
                      for="create-customer-website"
                      class="form-label"
                    >
                      Website
                    </label>

                    <select
                      class="form-select"
                      id="create-customer-website"
                      name="websiteId"
                      required
                    >
                      <option value="">
                        Loading websites...
                      </option>
                    </select>

                  </div>

                  <div class="col-12 col-md-6">

                    <label
                      for="create-customer-status"
                      class="form-label"
                    >
                      Status
                    </label>

                    <select
                      class="form-select"
                      id="create-customer-status"
                      name="status"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>

                  </div>

                  <div class="col-12">

                    <label
                      for="create-customer-username"
                      class="form-label"
                    >
                      Username
                    </label>

                    <input
                      type="text"
                      class="form-control"
                      id="create-customer-username"
                      name="username"
                      required
                    >

                    <div class="form-text">
                      Username is immutable after creation.
                    </div>

                  </div>

                  <div class="col-12 col-md-6">

                    <label
                      for="create-customer-name"
                      class="form-label"
                    >
                      Name
                    </label>

                    <input
                      type="text"
                      class="form-control"
                      id="create-customer-name"
                      name="name"
                      required
                    >

                  </div>

                  <div class="col-12 col-md-6">

                    <label
                      for="create-customer-phone"
                      class="form-label"
                    >
                      Phone
                    </label>

                    <input
                      type="text"
                      class="form-control"
                      id="create-customer-phone"
                      name="phone"
                      required
                    >

                  </div>

                </div>

                <div
                  id="create-customer-error"
                  class="alert alert-danger d-none mt-4 mb-0"
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
                  id="create-customer-submit"
                >
                  Create Customer
                </button>

              </div>

            </form>

          </div>

        </div>
      </div>

      <!-- Customer Action Modal -->

      <div
        class="modal fade"
        id="customer-action-modal"
        tabindex="-1"
        aria-labelledby="customer-action-modal-label"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered">

          <div class="modal-content">

            <form id="customer-action-form">

              <div class="modal-header">

                <h2
                  class="modal-title fs-5"
                  id="customer-action-modal-label"
                >
                  Customer Action
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
                id="customer-action-modal-body"
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
                  id="customer-action-submit"
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

export async function initializeCustomersView(container) {
  const tableBody = container.querySelector("#customers-table-body");

  const errorContainer = container.querySelector("#customers-error");

  if (!tableBody) {
    return;
  }

  const token = getAccessToken();

  if (!token) {
    showCustomersLoadError(
      tableBody,
      errorContainer,
      "Authentication is required.",
    );

    return;
  }

  const state = {
    customers: [],
    websites: [],
    websiteMap: new Map(),
    action: null,
    selectedCustomer: null,
    filters: {
      search: "",
      status: "",
    },
  };

  try {
    await loadWebsites({
      token,
      state,
      container,
    });

    await loadCustomers({
      token,
      state,
      tableBody,
      errorContainer,
    });

    initializeCreateCustomerForm({
      token,
      container,
      state,
      tableBody,
      errorContainer,
    });

    initializeCustomerFilters({
      token,
      container,
      state,
      tableBody,
      errorContainer,
    });

    initializeCustomerActionButtons({
      container,
      state,
    });

    initializeCustomerActionForm({
      token,
      container,
      state,
      tableBody,
      errorContainer,
    });
  } catch (error) {
    showCustomersLoadError(
      tableBody,
      errorContainer,
      error?.message || "Unable to load customers.",
    );
  }
}

async function loadWebsites({ token, state, container }) {
  const response = await listWebsites({
    token,
    page: 1,
    pageSize: 100,
    status: "Active",
  });

  state.websites = response?.data ?? [];

  state.websiteMap = new Map(
    state.websites.map((website) => [website.id, website.name]),
  );

  populateWebsiteSelect(
    container.querySelector("#create-customer-website"),
    state.websites,
  );
}

function populateWebsiteSelect(select, websites) {
  if (!select) {
    return;
  }

  if (websites.length === 0) {
    select.innerHTML = `
      <option value="">
        No active websites available
      </option>
    `;

    return;
  }

  select.innerHTML = `
    <option value="">
      Select website
    </option>

    ${websites
      .map(
        (website) => `
          <option value="${escapeHtml(website.id)}">
            ${escapeHtml(website.name)}
          </option>
        `,
      )
      .join("")}
  `;
}

async function loadCustomers({ token, state, tableBody, errorContainer }) {
  const response = await listCustomers({
    token,
    page: 1,
    pageSize: 20,
    search: state.filters.search,
    status: state.filters.status,
  });

  state.customers = response?.data ?? [];

  renderCustomers(state.customers, state.websiteMap, tableBody);

  if (errorContainer) {
    errorContainer.textContent = "";
    errorContainer.classList.add("d-none");
  }
}

function initializeCreateCustomerForm({
  token,
  container,
  state,
  tableBody,
  errorContainer,
}) {
  const form = container.querySelector("#create-customer-form");

  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = form.querySelector("#create-customer-submit");

    const formError = form.querySelector("#create-customer-error");

    if (submitButton) {
      submitButton.disabled = true;
    }

    if (formError) {
      formError.textContent = "";
      formError.classList.add("d-none");
    }

    try {
      const formData = new FormData(form);

      await createCustomer({
        token,
        websiteId: formData.get("websiteId"),
        username: formData.get("username"),
        name: formData.get("name"),
        phone: formData.get("phone"),
        status: formData.get("status"),
      });

      form.reset();

      const modalElement = form.closest(".modal");

      const modal = modalElement
        ? Modal.getOrCreateInstance(modalElement)
        : null;

      modal?.hide();

      await loadCustomers({
        token,
        state,
        tableBody,
        errorContainer,
      });
    } catch (error) {
      if (formError) {
        formError.textContent = error?.message || "Unable to create customer.";

        formError.classList.remove("d-none");
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}

function initializeCustomerFilters({
  token,
  container,
  state,
  tableBody,
  errorContainer,
}) {
  const form = container.querySelector("#customers-filter-form");

  const resetButton = container.querySelector("#customers-filter-reset");

  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    state.filters.search = String(formData.get("search") ?? "").trim();

    state.filters.status = String(formData.get("status") ?? "");

    try {
      await loadCustomers({
        token,
        state,
        tableBody,
        errorContainer,
      });
    } catch (error) {
      showCustomersLoadError(
        tableBody,
        errorContainer,
        error?.message || "Unable to load customers.",
      );
    }
  });

  resetButton?.addEventListener("click", async () => {
    state.filters.search = "";
    state.filters.status = "";

    form.reset();

    try {
      await loadCustomers({
        token,
        state,
        tableBody,
        errorContainer,
      });
    } catch (error) {
      showCustomersLoadError(
        tableBody,
        errorContainer,
        error?.message || "Unable to load customers.",
      );
    }
  });
}

function initializeCustomerActionButtons({ container, state }) {
  const tableBody = container.querySelector("#customers-table-body");

  if (!tableBody) {
    return;
  }

  tableBody.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-customer-action]");

    if (!actionButton) {
      return;
    }

    const customerId = actionButton.dataset.customerId;

    const action = actionButton.dataset.customerAction;

    const customer = state.customers.find((item) => item.id === customerId);

    if (!customer) {
      return;
    }

    openCustomerActionModal({
      container,
      state,
      customer,
      action,
    });
  });
}

function openCustomerActionModal({ container, state, customer, action }) {
  const modalElement = container.querySelector("#customer-action-modal");

  const modalBody = container.querySelector("#customer-action-modal-body");

  const modalTitle = container.querySelector("#customer-action-modal-label");

  const submitButton = container.querySelector("#customer-action-submit");

  if (!modalElement || !modalBody || !modalTitle || !submitButton) {
    return;
  }

  state.action = action;
  state.selectedCustomer = customer;

  modalBody.innerHTML = "";
  submitButton.disabled = false;

  if (action === ACTIONS.EDIT) {
    modalTitle.textContent = "Edit Customer";
    submitButton.textContent = "Save Changes";
    submitButton.className = "btn btn-primary";

    modalBody.innerHTML = renderEditCustomerForm(customer, state.websiteMap);
  } else {
    modalTitle.textContent =
      action === ACTIONS.ACTIVATE ? "Activate Customer" : "Inactivate Customer";

    submitButton.textContent =
      action === ACTIONS.ACTIVATE ? "Activate Customer" : "Inactivate Customer";

    submitButton.className =
      action === ACTIONS.ACTIVATE ? "btn btn-primary" : "btn btn-danger";

    modalBody.innerHTML = renderCustomerStatusConfirmation(customer, action);
  }

  Modal.getOrCreateInstance(modalElement).show();
}

function renderEditCustomerForm(customer, websiteMap) {
  const websiteName =
    customer.websiteName ||
    websiteMap.get(customer.websiteId) ||
    customer.websiteId;
  return `
    <div class="mb-3">

      <div class="mb-3">

        <label class="form-label">
          Website
        </label>

        <input
          type="text"
          class="form-control"
          value="${escapeHtml(websiteName)}"
          disabled
        >

      </div>

      <div class="mb-3">

        <label class="form-label">
          Username
        </label>

        <input
          type="text"
          class="form-control"
          value="${escapeHtml(customer.username)}"
          disabled
        >

        <div class="form-text">
          Username cannot be changed.
        </div>

      </div>

      <label
        for="customer-action-name"
        class="form-label"
      >
        Name
      </label>

      <input
        type="text"
        class="form-control"
        id="customer-action-name"
        name="name"
        value="${escapeHtml(customer.name)}"
        required
      >

    </div>

    <div class="mb-0">

      <label
        for="customer-action-phone"
        class="form-label"
      >
        Phone
      </label>

      <input
        type="text"
        class="form-control"
        id="customer-action-phone"
        name="phone"
        value="${escapeHtml(customer.phone)}"
        required
      >

    </div>

    <div
      id="customer-action-error"
      class="alert alert-danger d-none mt-3 mb-0"
      role="alert"
    ></div>
  `;
}

function renderCustomerStatusConfirmation(customer, action) {
  const targetStatus =
    action === ACTIONS.ACTIVATE ? STATUS.ACTIVE : STATUS.INACTIVE;

  return `
    <p class="mb-2">
      Are you sure you want to change
      <strong>${escapeHtml(customer.name)}</strong>
      to
      <strong>${escapeHtml(targetStatus)}</strong>?
    </p>

    <p class="text-body-secondary mb-0">
      The customer's existing CRM history will
      remain available.
    </p>

    <div
      id="customer-action-error"
      class="alert alert-danger d-none mt-3 mb-0"
      role="alert"
    ></div>
  `;
}

function initializeCustomerActionForm({
  token,
  container,
  state,
  tableBody,
  errorContainer,
}) {
  const form = container.querySelector("#customer-action-form");

  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = container.querySelector("#customer-action-submit");

    const formError = form.querySelector("#customer-action-error");

    if (submitButton) {
      submitButton.disabled = true;
    }

    if (formError) {
      formError.textContent = "";
      formError.classList.add("d-none");
    }

    try {
      const customer = state.selectedCustomer;

      if (!customer) {
        throw new Error("No customer was selected.");
      }

      if (state.action === ACTIONS.EDIT) {
        const formData = new FormData(form);

        await updateCustomer({
          token,
          id: customer.id,
          name: formData.get("name"),
          phone: formData.get("phone"),
        });
      } else {
        await updateCustomerStatus({
          token,
          id: customer.id,
          status:
            state.action === ACTIONS.ACTIVATE ? STATUS.ACTIVE : STATUS.INACTIVE,
        });
      }

      Modal.getOrCreateInstance(
        container.querySelector("#customer-action-modal"),
      ).hide();

      state.action = null;
      state.selectedCustomer = null;

      await loadCustomers({
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

function renderCustomers(customers, websiteMap, tableBody) {
  if (!tableBody) {
    return;
  }

  if (customers.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td
          colspan="6"
          class="text-center text-body-secondary py-5"
        >
          No customers found.
        </td>
      </tr>
    `;

    return;
  }

  tableBody.innerHTML = customers
    .map((customer) => {
      const websiteName =
        customer.websiteName ||
        websiteMap.get(customer.websiteId) ||
        customer.websiteId;

      return `
        <tr>

          <td>
            ${escapeHtml(websiteName)}
          </td>

          <td>
            <span class="fw-semibold">
              ${escapeHtml(customer.username)}
            </span>
          </td>

          <td>
            ${escapeHtml(customer.name)}
          </td>

          <td>
            ${escapeHtml(customer.phone)}
          </td>

          <td>
            <span
              class="badge ${getStatusBadgeClass(customer.status)}"
            >
              ${escapeHtml(customer.status)}
            </span>
          </td>

          <td class="text-end">

            ${renderCustomerActions(customer)}

          </td>

        </tr>
      `;
    })
    .join("");
}

function renderCustomerActions(customer) {
  return `
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
            data-customer-action="${ACTIONS.EDIT}"
            data-customer-id="${escapeHtml(customer.id)}"
          >
            <i
              class="bi bi-pencil me-2"
              aria-hidden="true"
            ></i>
            Edit Customer
          </button>
        </li>

        ${
          customer.status === STATUS.ACTIVE
            ? `
              <li>
                <button
                  type="button"
                  class="dropdown-item text-danger"
                  data-customer-action="${ACTIONS.INACTIVATE}"
                  data-customer-id="${escapeHtml(customer.id)}"
                >
                  <i
                    class="bi bi-person-dash me-2"
                    aria-hidden="true"
                  ></i>
                  Inactivate Customer
                </button>
              </li>
            `
            : `
              <li>
                <button
                  type="button"
                  class="dropdown-item"
                  data-customer-action="${ACTIONS.ACTIVATE}"
                  data-customer-id="${escapeHtml(customer.id)}"
                >
                  <i
                    class="bi bi-person-check me-2"
                    aria-hidden="true"
                  ></i>
                  Activate Customer
                </button>
              </li>
            `
        }

      </ul>

    </div>
  `;
}

function showCustomersLoadError(tableBody, errorContainer, message) {
  if (tableBody) {
    tableBody.innerHTML = `
      <tr>
        <td
          colspan="6"
          class="text-center text-body-secondary py-5"
        >
          Unable to load customers.
        </td>
      </tr>
    `;
  }

  if (errorContainer) {
    errorContainer.textContent = message;
    errorContainer.classList.remove("d-none");
  }
}
