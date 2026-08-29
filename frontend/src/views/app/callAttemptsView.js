import { listCallAttempts } from "../../services/callAttemptService.js";

import { listCustomers } from "../../services/customerService.js";

import { listUsers } from "../../services/userService.js";

import { getAccessToken } from "../../services/authService.js";

import { escapeHtml, getStatusBadgeClass } from "../../utils/formatUtils.js";

const CALL_STATUSES = [
  "NO_ANSWER",
  "ANSWERED",
  "DROP_CALL",
  "INTERESTED",
  "NOT_INTERESTED",
  "CALL_BACK",
  "WRONG_NUMBER",
  "INVALID_NUMBER",
];

export function renderCallAttemptsView() {
  return `
    <div class="container-fluid p-3 p-md-4">

      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">

        <div>
          <h1 class="h4 mb-1">
            Call Attempts
          </h1>

          <p class="text-body-secondary mb-0">
            Historical record of customer call attempts.
          </p>
        </div>

      </div>

      <div class="card border-0 shadow-sm mb-4">

        <div class="card-body">

          <form id="call-attempts-filter-form">

            <div class="row g-3">
              <div class="col-12 col-md-4">

                <label
                  for="call-attempts-filter-customer-search"
                  class="form-label"
                >
                  Customer
                </label>

                <div class="position-relative">

                  <input
                    type="search"
                    id="call-attempts-filter-customer-search"
                    class="form-control"
                    placeholder="Username, name, or phone"
                    autocomplete="off"
                  >

                  <div
                    id="call-attempts-customer-search-results"
                    class="list-group position-absolute w-100 d-none"
                    style="z-index: 1050;"
                  ></div>

                </div>

                <input
                  type="hidden"
                  id="call-attempts-filter-customer-id"
                  name="customerId"
                  value=""
                >

                <div
                  id="call-attempts-selected-customer"
                  class="small text-body-secondary mt-1 d-none"
                ></div>

              </div>

              <div class="col-12 col-md-4">

                <label
                  for="call-attempts-filter-status"
                  class="form-label"
                >
                  Call Status
                </label>

                <select
                  id="call-attempts-filter-status"
                  name="callStatus"
                  class="form-select"
                >
                  <option value="">
                    All Call Statuses
                  </option>

                  ${CALL_STATUSES.map(
                    (status) => `
                        <option value="${escapeHtml(status)}">
                          ${escapeHtml(status)}
                        </option>
                      `,
                  ).join("")}
                </select>

              </div>

              <div class="col-12 col-md-4">

                <label
                  for="call-attempts-filter-user"
                  class="form-label"
                >
                  User
                </label>

                <select
                  id="call-attempts-filter-user"
                  name="userId"
                  class="form-select"
                >
                  <option value="">
                    All Users
                  </option>
                </select>

              </div>

            </div>

            <div class="d-flex gap-2 mt-3">

              <button
                type="submit"
                class="btn btn-primary"
              >
                <i
                  class="bi bi-funnel me-2"
                  aria-hidden="true"
                ></i>
                Apply Filters
              </button>

              <button
                type="button"
                class="btn btn-outline-secondary"
                id="call-attempts-filter-reset"
              >
                Reset
              </button>

            </div>

          </form>

        </div>

      </div>

      <div
        id="call-attempts-error"
        class="alert alert-danger d-none"
        role="alert"
      ></div>

      <div class="card border-0 shadow-sm">

        <div class="card-body p-0">

          <div class="table-responsive page-table-container">

            <table class="table table-hover align-middle mb-0">

              <thead>
                <tr>
                  <th>Customer</th>
                  <th>User</th>
                  <th>Call Status</th>
                  <th>Called At</th>
                  <th>Remarks</th>
                </tr>
              </thead>

              <tbody id="call-attempts-table-body">

                <tr>
                  <td
                    colspan="5"
                    class="text-center text-body-secondary py-5"
                  >
                    Loading call attempts...
                  </td>
                </tr>

              </tbody>

            </table>

          </div>

        </div>

        <div
          class="card-footer bg-body border-0 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2"
          id="call-attempts-pagination"
        ></div>

      </div>

    </div>
  `;
}

export async function initializeCallAttemptsView(container) {
  const tableBody = container.querySelector("#call-attempts-table-body");

  const paginationContainer = container.querySelector(
    "#call-attempts-pagination",
  );

  const errorContainer = container.querySelector("#call-attempts-error");

  if (!tableBody) {
    return;
  }

  const token = getAccessToken();

  if (!token) {
    showError(tableBody, errorContainer, "Authentication is required.");

    return;
  }

  const state = {
    callAttempts: [],
    users: [],
    userMap: new Map(),
    customerSearchResults: [],
    page: 1,
    pageSize: 20,
    pagination: {
      page: 1,
      pageSize: 20,
      total: 0,
    },
    filters: {
      callStatus: "",
      customerId: "",
      userId: "",
    },
  };

  try {
    await loadSupportingData({
      token,
      state,
      container,
    });

    await loadCallAttempts({
      token,
      state,
      tableBody,
      paginationContainer,
      errorContainer,
    });

    initializeFilters({
      token,
      state,
      container,
      tableBody,
      paginationContainer,
      errorContainer,
    });

    initializeCustomerSearch({
      token,
      state,
      container,
    });
  } catch (error) {
    showError(
      tableBody,
      errorContainer,
      error?.message || "Unable to load call attempts.",
    );
  }
}

async function loadSupportingData({ token, state, container }) {
  const usersResponse = await listUsers({
    token,
    page: 1,
    pageSize: 100,
  });

  state.users = usersResponse?.data.rows ?? [];
  state.userMap = new Map(state.users.map((user) => [user.id, user]));
  populateUserFilter(container, state.users);
}

function populateUserFilter(container, users) {
  const select = container.querySelector("#call-attempts-filter-user");

  if (!select) {
    return;
  }

  select.innerHTML = `
    <option value="">
      All Users
    </option>

    ${users
      .map(
        (user) => `
          <option value="${escapeHtml(user.id)}">
            ${escapeHtml(user.displayName ?? user.username ?? user.id)}
          </option>
        `,
      )
      .join("")}
  `;
}

async function loadCallAttempts({
  token,
  state,
  tableBody,
  paginationContainer,
  errorContainer,
}) {
  const response = await listCallAttempts({
    token,
    page: state.page,
    pageSize: state.pageSize,
    callStatus: state.filters.callStatus,
    customerId: state.filters.customerId,
    userId: state.filters.userId,
  });

  state.callAttempts = response?.data ?? [];

  state.pagination = response?.pagination ?? {
    page: state.page,
    pageSize: state.pageSize,
    total: 0,
  };

  renderCallAttempts(state, tableBody);

  renderPagination(state, paginationContainer);

  errorContainer?.classList.add("d-none");
}

function renderCallAttempts(state, tableBody) {
  if (state.callAttempts.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td
          colspan="5"
          class="text-center text-body-secondary py-5"
        >
          No call attempts found.
        </td>
      </tr>
    `;

    return;
  }

  tableBody.innerHTML = state.callAttempts
    .map((callAttempt) => {
      const user = state.userMap.get(callAttempt.userId);

      return `
        <tr>

          <td>
            <div class="fw-semibold">
              ${escapeHtml(callAttempt.customerUsername || "—")}
            </div>

            ${
              callAttempt.customerName
                ? `
                  <div class="small text-body-secondary">
                    ${escapeHtml(callAttempt.customerName)}
                  </div>
                `
                : ""
            }
          </td>

          <td>
            ${escapeHtml(callAttempt.displayName || callAttempt.username || "—")}
          </td>

          <td>
            <span
              class="badge ${getCallStatusBadgeClass(callAttempt.callStatus)}"
            >
              ${escapeHtml(callAttempt.callStatus ?? "—")}
            </span>
          </td>

          <td>
            ${formatDate(callAttempt.calledAt)}
          </td>

          <td>
            ${
              callAttempt.remarks
                ? `
                  <span
                    class="d-inline-block text-truncate"
                    style="max-width: 320px;"
                    title="${escapeHtml(callAttempt.remarks)}"
                  >
                    ${escapeHtml(callAttempt.remarks)}
                  </span>
                `
                : "—"
            }
          </td>

        </tr>
      `;
    })
    .join("");
}

function getCallStatusBadgeClass(status) {
  if (status === "ANSWERED" || status === "INTERESTED") {
    return "text-bg-success";
  }

  if (
    status === "NOT_INTERESTED" ||
    status === "WRONG_NUMBER" ||
    status === "INVALID_NUMBER"
  ) {
    return "text-bg-danger";
  }

  if (status === "CALL_BACK" || status === "DROP_CALL") {
    return "text-bg-warning";
  }

  if (status === "NO_ANSWER") {
    return "text-bg-secondary";
  }

  return "text-bg-light";
}

function initializeFilters({
  token,
  state,
  container,
  tableBody,
  paginationContainer,
  errorContainer,
}) {
  const form = container.querySelector("#call-attempts-filter-form");

  const resetButton = container.querySelector("#call-attempts-filter-reset");

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    state.filters.callStatus = String(formData.get("callStatus") ?? "");

    state.filters.customerId = String(formData.get("customerId") ?? "");

    state.filters.userId = String(formData.get("userId") ?? "");

    state.page = 1;

    await refreshCallAttempts({
      token,
      state,
      tableBody,
      paginationContainer,
      errorContainer,
    });
  });

  resetButton?.addEventListener("click", async () => {
    state.filters.callStatus = "";
    state.filters.customerId = "";
    state.filters.userId = "";
    state.page = 1;

    form?.reset();

    await refreshCallAttempts({
      token,
      state,
      tableBody,
      paginationContainer,
      errorContainer,
    });
  });
}

function initializeCustomerSearch({ token, state, container }) {
  const input = container.querySelector(
    "#call-attempts-filter-customer-search",
  );

  const hiddenInput = container.querySelector(
    "#call-attempts-filter-customer-id",
  );

  const resultsContainer = container.querySelector(
    "#call-attempts-customer-search-results",
  );

  const selectedCustomer = container.querySelector(
    "#call-attempts-selected-customer",
  );

  if (!input || !hiddenInput || !resultsContainer || !selectedCustomer) {
    return;
  }

  let searchTimer = null;

  input.addEventListener("input", () => {
    clearTimeout(searchTimer);

    const search = input.value.trim();

    hiddenInput.value = "";
    selectedCustomer.textContent = "";
    selectedCustomer.classList.add("d-none");

    if (!search) {
      resultsContainer.innerHTML = "";
      resultsContainer.classList.add("d-none");
      return;
    }

    searchTimer = setTimeout(async () => {
      try {
        const response = await listCustomers({
          token,
          page: 1,
          pageSize: 20,
          search,
        });

        state.customerSearchResults = response?.data ?? [];

        renderCustomerSearchResults({
          resultsContainer,
          selectedCustomer,
          input,
          hiddenInput,
          customers: state.customerSearchResults,
        });
      } catch (error) {
        resultsContainer.innerHTML = `
          <div class="list-group-item text-danger">
            ${escapeHtml(error?.message || "Unable to search customers.")}
          </div>
        `;

        resultsContainer.classList.remove("d-none");
      }
    }, 300);
  });

  document.addEventListener("click", (event) => {
    if (!container.contains(event.target)) {
      resultsContainer.classList.add("d-none");
    }
  });
}

function renderCustomerSearchResults({
  resultsContainer,
  selectedCustomer,
  input,
  hiddenInput,
  customers,
}) {
  if (customers.length === 0) {
    resultsContainer.innerHTML = `
      <div class="list-group-item text-body-secondary">
        No customers found.
      </div>
    `;

    resultsContainer.classList.remove("d-none");

    return;
  }

  resultsContainer.innerHTML = customers
    .map(
      (customer) => `
        <button
          type="button"
          class="list-group-item list-group-item-action"
          data-customer-id="${escapeHtml(customer.id)}"
        >
          <div class="fw-semibold">
            ${escapeHtml(customer.username ?? "—")}
          </div>

          <div class="small text-body-secondary">
            ${escapeHtml(customer.name ?? "")}

            ${customer.phone ? ` · ${escapeHtml(customer.phone)}` : ""}
          </div>
        </button>
      `,
    )
    .join("");

  resultsContainer.classList.remove("d-none");

  resultsContainer.querySelectorAll("[data-customer-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const customer = customers.find(
        (item) => item.id === button.dataset.customerId,
      );

      if (!customer) {
        return;
      }

      hiddenInput.value = customer.id;

      input.value = customer.username ?? "";

      selectedCustomer.textContent = `Selected: ${
        customer.username ?? customer.name ?? customer.id
      }`;

      selectedCustomer.classList.remove("d-none");

      resultsContainer.classList.add("d-none");
    });
  });
}

async function refreshCallAttempts({
  token,
  state,
  tableBody,
  paginationContainer,
  errorContainer,
}) {
  try {
    await loadCallAttempts({
      token,
      state,
      tableBody,
      paginationContainer,
      errorContainer,
    });
  } catch (error) {
    showError(
      tableBody,
      errorContainer,
      error?.message || "Unable to load call attempts.",
    );
  }
}

function renderPagination(state, container) {
  if (!container) {
    return;
  }

  const total = Number(state.pagination.total) || 0;

  const page = Number(state.pagination.page) || state.page;

  const pageSize = Number(state.pagination.pageSize) || state.pageSize;

  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) {
    container.innerHTML = `
      <div class="small text-body-secondary">
        ${total}
        call attempt${total === 1 ? "" : "s"}
      </div>
    `;

    return;
  }

  const start = (page - 1) * pageSize + 1;

  const end = Math.min(page * pageSize, total);

  container.innerHTML = `
    <div class="small text-body-secondary">
      Showing ${start}–${end} of ${total}
    </div>

    <div class="btn-group" role="group">

      <button
        type="button"
        class="btn btn-outline-secondary btn-sm"
        data-pagination-action="previous"
        ${page <= 1 ? "disabled" : ""}
      >
        Previous
      </button>

      <button
        type="button"
        class="btn btn-outline-secondary btn-sm"
        data-pagination-action="next"
        ${page >= totalPages ? "disabled" : ""}
      >
        Next
      </button>

    </div>
  `;

  container.querySelectorAll("[data-pagination-action]").forEach((button) => {
    button.addEventListener("click", async () => {
      if (button.dataset.paginationAction === "previous") {
        state.page = Math.max(1, page - 1);
      } else {
        state.page = Math.min(totalPages, page + 1);
      }

      const token = getAccessToken();

      await refreshCallAttempts({
        token,
        state,
        tableBody: container
          .closest(".card")
          ?.querySelector("#call-attempts-table-body"),
        paginationContainer: container,
        errorContainer: container
          .closest(".container-fluid")
          ?.querySelector("#call-attempts-error"),
      });
    });
  });
}

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function showError(tableBody, errorContainer, message) {
  if (tableBody) {
    tableBody.innerHTML = `
      <tr>
        <td
          colspan="5"
          class="text-center text-body-secondary py-5"
        >
          Unable to load call attempts.
        </td>
      </tr>
    `;
  }

  if (errorContainer) {
    errorContainer.textContent = message;
    errorContainer.classList.remove("d-none");
  }
}
