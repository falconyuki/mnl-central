import { Modal } from "bootstrap";

import { getAccessToken } from "../../services/authService.js";

import {
  listCampaignParticipations,
  createCampaignParticipation,
  updateCampaignParticipationStatus,
} from "../../services/campaignParticipationService.js";

import { listCampaigns } from "../../services/campaignService.js";
import { listCustomers } from "../../services/customerService.js";
import { listWebsites } from "../../services/websiteService.js";

import { escapeHtml, getStatusBadgeClass } from "../../utils/formatUtils.js";

const STATUS = {
  ACTIVE: "Active",
  EXPIRED: "Expired",
};

const ACTIONS = {
  ACTIVATE: "activate",
  EXPIRE: "expire",
};

export function renderCampaignParticipationsView() {
  return `
    <div class="container-fluid p-3 p-md-4">

      <div
        class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4"
      >
        <div>
          <h2 class="h4 mb-1">Campaign Participations</h2>

          <p class="text-body-secondary mb-0">
            Manage customer participation in campaigns.
          </p>
        </div>

        <button
          type="button"
          class="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#create-campaign-participation-modal"
        >
          <i
            class="bi bi-person-plus me-2"
            aria-hidden="true"
          ></i>

          Create Participation
        </button>
      </div>

      <div
        id="campaign-participations-error"
        class="alert alert-danger d-none"
        role="alert"
      ></div>

      <div class="card border-0 shadow-sm mb-3">
        <div class="card-body">

          <form id="campaign-participations-filter-form">

            <div class="row g-3 align-items-end">

              <div class="col-12 col-md-4">

                <label
                  for="campaign-participations-filter-status"
                  class="form-label"
                >
                  Status
                </label>

                <select
                  class="form-select"
                  id="campaign-participations-filter-status"
                  name="status"
                >
                  <option value="">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Expired">Expired</option>
                </select>

              </div>

              <div class="col-12 col-md-4">

                <label
                  for="campaign-participations-filter-campaign"
                  class="form-label"
                >
                  Campaign
                </label>

                <select
                  class="form-select"
                  id="campaign-participations-filter-campaign"
                  name="campaignId"
                >
                  <option value="">All Campaigns</option>
                </select>

              </div>

              <div class="col-12 col-md-4">

                <label
                  for="campaign-participations-filter-customer"
                  class="form-label"
                >
                  Customer
                </label>

                <select
                  class="form-select"
                  id="campaign-participations-filter-customer"
                  name="customerId"
                >
                  <option value="">All Customers</option>
                </select>

              </div>

              <div class="col-12">

                <div class="d-flex gap-2">

                  <button
                    type="submit"
                    class="btn btn-primary"
                  >
                    <i
                      class="bi bi-funnel me-2"
                      aria-hidden="true"
                    ></i>

                    Filter
                  </button>

                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    id="campaign-participations-filter-reset"
                  >
                    Reset
                  </button>

                </div>

              </div>

            </div>

          </form>

        </div>
      </div>

      <div class="card border-0 shadow-sm">

        <div class="card-body p-0">

          <div
            class="table-responsive page-table-container"
          >

            <table class="table table-hover align-middle mb-0">

              <thead class="table-light">

                <tr>
                  <th scope="col">Campaign</th>
                  <th scope="col">Customer</th>
                  <th scope="col">Website</th>
                  <th scope="col">Status</th>
                  <th scope="col">Created</th>
                  <th scope="col" class="text-end">
                    Actions
                  </th>
                </tr>

              </thead>

              <tbody id="campaign-participations-table-body">

                <tr>
                  <td
                    colspan="6"
                    class="text-center text-body-secondary py-5"
                  >
                    Loading participations...
                  </td>
                </tr>

              </tbody>

            </table>

          </div>

          <div
            id="campaign-participations-pagination"
            class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 p-3 border-top"
          ></div>

        </div>

      </div>

      <!-- Create Participation Modal -->

      <div
        class="modal fade"
        id="create-campaign-participation-modal"
        tabindex="-1"
        aria-labelledby="create-campaign-participation-modal-label"
        aria-hidden="true"
      >

        <div class="modal-dialog modal-dialog-centered">

          <div class="modal-content">

            <form id="create-campaign-participation-form">

              <div class="modal-header">

                <h2
                  class="modal-title fs-5"
                  id="create-campaign-participation-modal-label"
                >
                  Create Participation
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
                    for="create-campaign-participation-campaign"
                    class="form-label"
                  >
                    Campaign
                  </label>

                  <select
                    class="form-select"
                    id="create-campaign-participation-campaign"
                    name="campaignId"
                    required
                  >
                    <option value="">
                      Select campaign
                    </option>
                  </select>

                </div>

                <div class="mb-0">

                  <label
                    for="create-campaign-participation-customer"
                    class="form-label"
                  >
                    Customer
                  </label>

                  <select
                    class="form-select"
                    id="create-campaign-participation-customer"
                    name="customerId"
                    required
                    disabled
                  >
                    <option value="">
                      Select a campaign first
                    </option>
                  </select>

                </div>

                <div
                  id="create-campaign-participation-error"
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
                  id="create-campaign-participation-submit"
                >
                  Create Participation
                </button>

              </div>

            </form>

          </div>

        </div>

      </div>

      <!-- Status Action Modal -->

      <div
        class="modal fade"
        id="campaign-participation-action-modal"
        tabindex="-1"
        aria-labelledby="campaign-participation-action-modal-label"
        aria-hidden="true"
      >

        <div class="modal-dialog modal-dialog-centered">

          <div class="modal-content">

            <form id="campaign-participation-action-form">

              <div class="modal-header">

                <h2
                  class="modal-title fs-5"
                  id="campaign-participation-action-modal-label"
                >
                  Participation Action
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
                id="campaign-participation-action-modal-body"
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
                  id="campaign-participation-action-submit"
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

export async function initializeCampaignParticipationsView(container) {
  const tableBody = container.querySelector(
    "#campaign-participations-table-body",
  );

  const paginationContainer = container.querySelector(
    "#campaign-participations-pagination",
  );

  const errorContainer = container.querySelector(
    "#campaign-participations-error",
  );

  if (!tableBody) {
    return;
  }

  const token = getAccessToken();

  if (!token) {
    showError(tableBody, errorContainer, "Authentication is required.");

    return;
  }

  const state = {
    participations: [],
    campaigns: [],
    customers: [],
    websites: [],
    campaignMap: new Map(),
    customerMap: new Map(),
    websiteMap: new Map(),
    selectedParticipation: null,
    action: null,
    page: 1,
    pageSize: 20,
    pagination: {
      page: 1,
      pageSize: 20,
      total: 0,
    },
    filters: {
      status: "",
      campaignId: "",
      customerId: "",
    },
  };

  try {
    await loadSupportingData({
      token,
      state,
      container,
    });

    await loadParticipations({
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

    initializeCreateForm({
      token,
      state,
      container,
      tableBody,
      paginationContainer,
      errorContainer,
    });

    initializeActions({
      token,
      state,
      container,
      tableBody,
      paginationContainer,
      errorContainer,
    });
  } catch (error) {
    showError(
      tableBody,
      errorContainer,
      error?.message || "Unable to load campaign participations.",
    );
  }
}

async function loadSupportingData({ token, state, container }) {
  const [campaignsResponse, customersResponse, websitesResponse] =
    await Promise.all([
      listCampaigns({
        token,
        page: 1,
        pageSize: 100,
      }),

      listCustomers({
        token,
        page: 1,
        pageSize: 100,
      }),

      listWebsites({
        token,
        page: 1,
        pageSize: 100,
      }),
    ]);

  state.campaigns = campaignsResponse?.data ?? [];

  state.customers = customersResponse?.data ?? [];

  state.websites = websitesResponse?.data ?? [];

  state.campaignMap = new Map(
    state.campaigns.map((campaign) => [campaign.id, campaign]),
  );

  state.customerMap = new Map(
    state.customers.map((customer) => [customer.id, customer]),
  );

  state.websiteMap = new Map(
    state.websites.map((website) => [website.id, website]),
  );

  populateCampaignSelects(container, state.campaigns);

  populateCustomerFilter(container, state.customers);
}

function populateCampaignSelects(container, campaigns) {
  const filterSelect = container.querySelector(
    "#campaign-participations-filter-campaign",
  );

  const createSelect = container.querySelector(
    "#create-campaign-participation-campaign",
  );

  const options = campaigns
    .map(
      (campaign) => `
        <option value="${escapeHtml(campaign.id)}">
          ${escapeHtml(campaign.name)}
        </option>
      `,
    )
    .join("");

  if (filterSelect) {
    filterSelect.innerHTML = `
      <option value="">All Campaigns</option>
      ${options}
    `;
  }

  if (createSelect) {
    createSelect.innerHTML = `
      <option value="">Select campaign</option>
      ${options}
    `;
  }
}

function populateCustomerFilter(container, customers) {
  const select = container.querySelector(
    "#campaign-participations-filter-customer",
  );

  if (!select) {
    return;
  }

  select.innerHTML = `
    <option value="">All Customers</option>

    ${customers
      .map(
        (customer) => `
          <option value="${escapeHtml(customer.id)}">
            ${escapeHtml(customer.username)} — ${escapeHtml(customer.name)}
          </option>
        `,
      )
      .join("")}
  `;
}

async function loadParticipations({
  token,
  state,
  tableBody,
  paginationContainer,
  errorContainer,
}) {
  const response = await listCampaignParticipations({
    token,
    page: state.page,
    pageSize: state.pageSize,
    status: state.filters.status,
    campaignId: state.filters.campaignId,
    customerId: state.filters.customerId,
  });

  state.participations = response?.data ?? [];

  state.pagination = response?.pagination ?? {
    page: state.page,
    pageSize: state.pageSize,
    total: 0,
  };

  renderParticipations(state, tableBody);

  renderPagination(state, paginationContainer);

  errorContainer?.classList.add("d-none");
}

function renderParticipations(state, tableBody) {
  if (state.participations.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td
          colspan="6"
          class="text-center text-body-secondary py-5"
        >
          No campaign participations found.
        </td>
      </tr>
    `;

    return;
  }

  tableBody.innerHTML = state.participations
    .map((participation) => {
      const campaign = state.campaignMap.get(participation.campaignId);

      const customer = state.customerMap.get(participation.customerId);

      const website = campaign
        ? state.websiteMap.get(campaign.websiteId)
        : null;

      return `
          <tr>

            <td>
              ${escapeHtml(campaign?.name ?? participation.campaignId)}
            </td>

            <td>
              <div class="fw-semibold">
                ${escapeHtml(customer?.username ?? participation.customerId)}
              </div>

              ${
                customer?.name
                  ? `
                    <div class="small text-body-secondary">
                      ${escapeHtml(customer.name)}
                    </div>
                  `
                  : ""
              }
            </td>

            <td>
              ${escapeHtml(website?.name ?? campaign?.websiteId ?? "")}
            </td>

            <td>
              <span
                class="badge ${getStatusBadgeClass(participation.status)}"
              >
                ${escapeHtml(participation.status)}
              </span>
            </td>

            <td>
              ${formatDate(participation.createdAt)}
            </td>

            <td class="text-end">
              ${renderActions(participation)}
            </td>

          </tr>
        `;
    })
    .join("");
}

function renderActions(participation) {
  if (participation.status === STATUS.ACTIVE) {
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
              class="dropdown-item text-danger"
              data-participation-action="${ACTIONS.EXPIRE}"
              data-participation-id="${escapeHtml(participation.id)}"
            >
              <i
                class="bi bi-calendar-x me-2"
                aria-hidden="true"
              ></i>
              Expire Participation
            </button>
          </li>

        </ul>

      </div>
    `;
  }

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
            data-participation-action="${ACTIONS.ACTIVATE}"
            data-participation-id="${escapeHtml(participation.id)}"
          >
            <i
              class="bi bi-arrow-counterclockwise me-2"
              aria-hidden="true"
            ></i>
            Activate Participation
          </button>
        </li>

      </ul>

    </div>
  `;
}

function initializeFilters({
  token,
  state,
  container,
  tableBody,
  paginationContainer,
  errorContainer,
}) {
  const form = container.querySelector("#campaign-participations-filter-form");

  const resetButton = container.querySelector(
    "#campaign-participations-filter-reset",
  );

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    state.filters.status = String(formData.get("status") ?? "");

    state.filters.campaignId = String(formData.get("campaignId") ?? "");

    state.filters.customerId = String(formData.get("customerId") ?? "");

    state.page = 1;

    await refreshParticipations({
      token,
      state,
      tableBody,
      paginationContainer,
      errorContainer,
    });
  });

  resetButton?.addEventListener("click", async () => {
    state.filters.status = "";
    state.filters.campaignId = "";
    state.filters.customerId = "";
    state.page = 1;

    form?.reset();

    await refreshParticipations({
      token,
      state,
      tableBody,
      paginationContainer,
      errorContainer,
    });
  });
}

function initializeCreateForm({
  token,
  state,
  container,
  tableBody,
  paginationContainer,
  errorContainer,
}) {
  const form = container.querySelector("#create-campaign-participation-form");

  const campaignSelect = container.querySelector(
    "#create-campaign-participation-campaign",
  );

  const customerSelect = container.querySelector(
    "#create-campaign-participation-customer",
  );

  if (!form || !campaignSelect || !customerSelect) {
    return;
  }

  campaignSelect.addEventListener("change", () => {
    const campaign = state.campaignMap.get(campaignSelect.value);

    customerSelect.value = "";

    if (!campaign) {
      customerSelect.disabled = true;

      customerSelect.innerHTML = `
          <option value="">
            Select a campaign first
          </option>
        `;

      return;
    }

    const customers = state.customers.filter(
      (customer) => customer.websiteId === campaign.websiteId,
    );

    customerSelect.disabled = customers.length === 0;

    customerSelect.innerHTML = `
        <option value="">
          ${
            customers.length
              ? "Select customer"
              : "No customers available for this campaign"
          }
        </option>

        ${customers
          .map(
            (customer) => `
              <option value="${escapeHtml(customer.id)}">
                ${escapeHtml(customer.username)} — ${escapeHtml(customer.name)}
              </option>
            `,
          )
          .join("")}
      `;
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = container.querySelector(
      "#create-campaign-participation-submit",
    );

    const formError = container.querySelector(
      "#create-campaign-participation-error",
    );

    if (submitButton) {
      submitButton.disabled = true;
    }

    formError?.classList.add("d-none");

    try {
      const formData = new FormData(form);

      await createCampaignParticipation({
        token,
        campaignId: formData.get("campaignId"),
        customerId: formData.get("customerId"),
      });

      form.reset();

      customerSelect.disabled = true;

      customerSelect.innerHTML = `
          <option value="">
            Select a campaign first
          </option>
        `;

      Modal.getOrCreateInstance(
        container.querySelector("#create-campaign-participation-modal"),
      ).hide();

      await refreshParticipations({
        token,
        state,
        tableBody,
        paginationContainer,
        errorContainer,
      });
    } catch (error) {
      if (formError) {
        formError.textContent =
          error?.message || "Unable to create participation.";

        formError.classList.remove("d-none");
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}

function initializeActions({
  token,
  state,
  container,
  tableBody,
  paginationContainer,
  errorContainer,
}) {
  tableBody.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-participation-action]");

    if (!actionButton) {
      return;
    }

    const participationId = actionButton.dataset.participationId;

    const action = actionButton.dataset.participationAction;

    const participation = state.participations.find(
      (item) => item.id === participationId,
    );

    if (!participation) {
      return;
    }

    state.selectedParticipation = participation;

    state.action = action;

    openActionModal({
      container,
      participation,
      action,
    });
  });

  const form = container.querySelector("#campaign-participation-action-form");

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const participation = state.selectedParticipation;

    if (!participation) {
      return;
    }

    const targetStatus =
      state.action === ACTIONS.EXPIRE ? STATUS.EXPIRED : STATUS.ACTIVE;

    const submitButton = container.querySelector(
      "#campaign-participation-action-submit",
    );

    const formError = container.querySelector(
      "#campaign-participation-action-error",
    );

    if (submitButton) {
      submitButton.disabled = true;
    }

    formError?.classList.add("d-none");

    try {
      await updateCampaignParticipationStatus({
        token,
        id: participation.id,
        status: targetStatus,
      });

      Modal.getOrCreateInstance(
        container.querySelector("#campaign-participation-action-modal"),
      ).hide();

      state.selectedParticipation = null;

      state.action = null;

      await refreshParticipations({
        token,
        state,
        tableBody,
        paginationContainer,
        errorContainer,
      });
    } catch (error) {
      if (formError) {
        formError.textContent =
          error?.message || "Unable to update participation status.";

        formError.classList.remove("d-none");
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}

function openActionModal({ container, participation, action }) {
  const modalElement = container.querySelector(
    "#campaign-participation-action-modal",
  );

  const modalTitle = container.querySelector(
    "#campaign-participation-action-modal-label",
  );

  const modalBody = container.querySelector(
    "#campaign-participation-action-modal-body",
  );

  const submitButton = container.querySelector(
    "#campaign-participation-action-submit",
  );

  if (!modalElement || !modalTitle || !modalBody || !submitButton) {
    return;
  }

  const targetStatus =
    action === ACTIONS.EXPIRE ? STATUS.EXPIRED : STATUS.ACTIVE;

  modalTitle.textContent =
    action === ACTIONS.EXPIRE
      ? "Expire Participation"
      : "Activate Participation";

  submitButton.textContent =
    action === ACTIONS.EXPIRE
      ? "Expire Participation"
      : "Activate Participation";

  submitButton.className =
    action === ACTIONS.EXPIRE ? "btn btn-danger" : "btn btn-primary";

  modalBody.innerHTML = `
    <p class="mb-2">
      Are you sure you want to change this
      participation to
      <strong>${escapeHtml(targetStatus)}</strong>?
    </p>

    <p class="text-body-secondary mb-0">
      Existing CRM history will remain available.
    </p>

    <div
      id="campaign-participation-action-error"
      class="alert alert-danger d-none mt-3 mb-0"
      role="alert"
    ></div>
  `;

  Modal.getOrCreateInstance(modalElement).show();
}

async function refreshParticipations({
  token,
  state,
  tableBody,
  paginationContainer,
  errorContainer,
}) {
  try {
    await loadParticipations({
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
      error?.message || "Unable to load campaign participations.",
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
        ${total} participation${total === 1 ? "" : "s"}
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

      const tableBody = container
        .closest(".card")
        ?.querySelector("#campaign-participations-table-body");

      const root = container.closest(".container-fluid");

      if (!tableBody || !root) {
        return;
      }

      const errorContainer = root.querySelector(
        "#campaign-participations-error",
      );

      const token = getAccessToken();

      await refreshParticipations({
        token,
        state,
        tableBody,
        paginationContainer: container,
        errorContainer,
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
          colspan="6"
          class="text-center text-body-secondary py-5"
        >
          Unable to load campaign participations.
        </td>
      </tr>
    `;
  }

  if (errorContainer) {
    errorContainer.textContent = message;
    errorContainer.classList.remove("d-none");
  }
}
