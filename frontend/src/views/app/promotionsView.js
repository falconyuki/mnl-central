import { Modal } from "bootstrap";

import { getAccessToken, hasPermission } from "../../services/authService.js";

import {
  listPromotions,
  createPromotion,
  updatePromotion,
  updatePromotionStatus,
} from "../../services/promotionService.js";

import { listCampaigns } from "../../services/campaignService.js";

import { escapeHtml, getStatusBadgeClass } from "../../utils/formatUtils.js";

const ACTIONS = {
  EDIT: "edit",
  ACTIVATE: "activate",
  DEACTIVATE: "deactivate",
};

const STATUS = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};

export function renderPromotionsView() {
  return `
    <div class="container-fluid p-3 p-md-4">

      <div
        class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4"
      >

        <div>
          <h2 class="h4 mb-1">
            Promotions
          </h2>

          <p class="text-body-secondary mb-0">
            Manage promotional offers for campaigns.
          </p>
        </div>

        ${
          hasPermission("PROMOTION_CREATE")
            ? `
        <button
          type="button"
          class="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#create-promotion-modal"
        >
          <i
            class="bi bi-gift me-2"
            aria-hidden="true"
          ></i>
          Create Promotion
        </button>`
            : ""
        }
      </div>

      <div
        id="promotions-error"
        class="alert alert-danger d-none"
        role="alert"
      ></div>

      <div class="card border-0 shadow-sm mb-3">

        <div class="card-body">

          <form id="promotions-filter-form">

            <div class="row g-3 align-items-end">

              <div class="col-12 col-lg-5">

                <label
                  for="promotions-filter-search"
                  class="form-label"
                >
                  Search
                </label>

                <input
                  type="search"
                  class="form-control"
                  id="promotions-filter-search"
                  name="search"
                  placeholder="Promotion name or description"
                  autocomplete="off"
                >

              </div>

              <div class="col-12 col-md-6 col-lg-3">

                <label
                  for="promotions-filter-status"
                  class="form-label"
                >
                  Status
                </label>

                <select
                  class="form-select"
                  id="promotions-filter-status"
                  name="status"
                >
                  <option value="">
                    All Statuses
                  </option>

                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>
                </select>

              </div>

              <div class="col-12 col-md-6 col-lg-3">

                <label
                  for="promotions-filter-campaign"
                  class="form-label"
                >
                  Campaign
                </label>

                <select
                  class="form-select"
                  id="promotions-filter-campaign"
                  name="campaignId"
                >
                  <option value="">
                    All Campaigns
                  </option>
                </select>

              </div>

              <div class="col-12 col-lg-1">

                <button
                  type="submit"
                  class="btn btn-primary w-100"
                >
                  <i
                    class="bi bi-search"
                    aria-hidden="true"
                  ></i>

                  <span class="d-lg-none ms-2">
                    Filter
                  </span>
                </button>

              </div>

            </div>

            <div class="mt-3">

              <button
                type="button"
                class="btn btn-link btn-sm px-0"
                id="promotions-filter-reset"
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

                  <th scope="col">
                    Promotion
                  </th>

                  <th scope="col">
                    Campaign
                  </th>

                  <th scope="col">
                    Description
                  </th>

                  <th scope="col">
                    Amount
                  </th>

                  <th scope="col">
                    Status
                  </th>

                  <th scope="col">
                    Created
                  </th>

                  <th
                    scope="col"
                    class="text-end"
                  >
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody id="promotions-table-body">

                <tr>

                  <td
                    colspan="7"
                    class="text-center text-body-secondary py-5"
                  >
                    Loading promotions...
                  </td>

                </tr>

              </tbody>

            </table>

          </div>

          <div
            id="promotions-pagination"
            class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 p-3 border-top"
          ></div>

        </div>

      </div>

      <!-- Create Promotion Modal -->

      <div
        class="modal fade"
        id="create-promotion-modal"
        tabindex="-1"
        aria-labelledby="create-promotion-modal-label"
        aria-hidden="true"
      >

        <div class="modal-dialog modal-lg modal-dialog-centered">

          <div class="modal-content">

            <form id="create-promotion-form">

              <div class="modal-header">

                <h2
                  class="modal-title fs-5"
                  id="create-promotion-modal-label"
                >
                  Create Promotion
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
                    for="create-promotion-campaign"
                    class="form-label"
                  >
                    Campaign
                  </label>

                  <select
                    class="form-select"
                    id="create-promotion-campaign"
                    name="campaignId"
                    required
                  >

                    <option value="">
                      Loading campaigns...
                    </option>

                  </select>

                </div>

                <div class="mb-3">

                  <label
                    for="create-promotion-name"
                    class="form-label"
                  >
                    Promotion Name
                  </label>

                  <input
                    type="text"
                    class="form-control"
                    id="create-promotion-name"
                    name="name"
                    required
                  >

                </div>

                <div class="mb-3">

                  <label
                    for="create-promotion-description"
                    class="form-label"
                  >
                    Description
                  </label>

                  <textarea
                    class="form-control"
                    id="create-promotion-description"
                    name="description"
                    rows="3"
                  ></textarea>

                </div>

                <div class="row g-3">

                  <div class="col-12 col-md-6">

                    <label
                      for="create-promotion-amount"
                      class="form-label"
                    >
                      Amount
                    </label>

                    <input
                      type="number"
                      class="form-control"
                      id="create-promotion-amount"
                      name="amount"
                      min="0"
                      step="0.01"
                    >

                  </div>

                  <div class="col-12 col-md-6">

                    <label
                      for="create-promotion-status"
                      class="form-label"
                    >
                      Status
                    </label>

                    <select
                      class="form-select"
                      id="create-promotion-status"
                      name="status"
                      required
                    >

                      <option value="Active">
                        Active
                      </option>

                      <option value="Inactive">
                        Inactive
                      </option>

                    </select>

                  </div>

                </div>

                <div
                  id="create-promotion-error"
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
                  id="create-promotion-submit"
                >
                  Create Promotion
                </button>

              </div>

            </form>

          </div>

        </div>

      </div>

      <!-- Promotion Action Modal -->

      <div
        class="modal fade"
        id="promotion-action-modal"
        tabindex="-1"
        aria-labelledby="promotion-action-modal-label"
        aria-hidden="true"
      >

        <div class="modal-dialog modal-lg modal-dialog-centered">

          <div class="modal-content">

            <form id="promotion-action-form">

              <div class="modal-header">

                <h2
                  class="modal-title fs-5"
                  id="promotion-action-modal-label"
                >
                  Promotion Action
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
                id="promotion-action-modal-body"
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
                  id="promotion-action-submit"
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

export async function initializePromotionsView(container) {
  const token = getAccessToken();

  const tableBody = container.querySelector("#promotions-table-body");

  const paginationContainer = container.querySelector("#promotions-pagination");

  const errorContainer = container.querySelector("#promotions-error");

  if (!tableBody) {
    return;
  }

  if (!token) {
    showError(tableBody, errorContainer, "Authentication is required.");

    return;
  }

  const state = {
    promotions: [],
    campaigns: [],

    action: null,
    selectedPromotion: null,

    page: 1,
    pageSize: 20,

    pagination: {
      page: 1,
      pageSize: 20,
      total: 0,
    },

    filters: {
      search: "",
      status: "",
      campaignId: "",
    },
  };

  try {
    await loadCampaigns({
      token,
      state,
      container,
    });

    await loadPromotions({
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

    initializeCreatePromotionForm({
      token,
      state,
      container,
      tableBody,
      paginationContainer,
      errorContainer,
    });

    initializePromotionActions({
      container,
      state,
    });

    initializePromotionActionForm({
      token,
      container,
      state,
      tableBody,
      paginationContainer,
      errorContainer,
    });

    initializePagination({
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
      error?.message || "Unable to load promotions.",
    );
  }
}

async function loadCampaigns({ token, state, container }) {
  const response = await listCampaigns({
    token,
    page: 1,
    pageSize: 100,
  });

  state.campaigns = response?.data ?? [];

  populateCampaignSelect(
    container.querySelector("#promotions-filter-campaign"),
    state.campaigns,
    "All Campaigns",
  );

  populateCampaignSelect(
    container.querySelector("#create-promotion-campaign"),
    state.campaigns,
    "Select campaign",
  );
}

function populateCampaignSelect(select, campaigns, placeholder) {
  if (!select) {
    return;
  }

  select.innerHTML = `
    <option value="">
      ${escapeHtml(placeholder)}
    </option>

    ${campaigns
      .map(
        (campaign) => `
          <option value="${escapeHtml(campaign.id)}">
            ${escapeHtml(campaign.name)}
          </option>
        `,
      )
      .join("")}
  `;
}

async function loadPromotions({
  token,
  state,
  tableBody,
  paginationContainer,
  errorContainer,
}) {
  const response = await listPromotions({
    token,
    page: state.page,
    pageSize: state.pageSize,
    search: state.filters.search,
    status: state.filters.status,
    campaignId: state.filters.campaignId,
  });

  state.promotions = response?.data ?? [];

  state.pagination = response?.pagination ?? {
    page: state.page,
    pageSize: state.pageSize,
    total: state.promotions.length,
  };

  renderPromotions(state.promotions, state.campaigns, tableBody);

  renderPagination(state.pagination, paginationContainer);

  if (errorContainer) {
    errorContainer.textContent = "";
    errorContainer.classList.add("d-none");
  }
}

function renderPromotions(promotions, campaigns, tableBody) {
  if (!tableBody) {
    return;
  }

  if (promotions.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td
          colspan="7"
          class="text-center text-body-secondary py-5"
        >
          No promotions found.
        </td>
      </tr>
    `;

    return;
  }

  const campaignMap = new Map(
    campaigns.map((campaign) => [campaign.id, campaign.name]),
  );

  tableBody.innerHTML = promotions
    .map((promotion) => {
      const campaignName =
        campaignMap.get(promotion.campaignId) || "Unknown Campaign";

      const amount =
        promotion.amount === null || promotion.amount === undefined
          ? "—"
          : Number(promotion.amount).toFixed(2);

      const createdAt = formatDate(promotion.createdAt);

      return `
        <tr>

          <td>
            <div class="fw-semibold">
              ${escapeHtml(promotion.name)}
            </div>
          </td>

          <td>
            ${escapeHtml(campaignName)}
          </td>

          <td>
            <span class="text-body-secondary">
              ${promotion.description ? escapeHtml(promotion.description) : "—"}
            </span>
          </td>

          <td>
            ${escapeHtml(amount)}
          </td>

          <td>
            <span
              class="badge ${getStatusBadgeClass(promotion.status)}"
            >
              ${escapeHtml(promotion.status)}
            </span>
          </td>

          <td>
            ${escapeHtml(createdAt)}
          </td>

          <td class="text-end">
            ${
              hasPermission("PROMOTION_UPDATE")
                ? `
            ${renderPromotionActions(promotion)}`
                : "—"
            }

          </td>

        </tr>
      `;
    })
    .join("");
}

function renderPromotionActions(promotion) {
  const items = [];

  items.push(`
    <li>

      <button
        type="button"
        class="dropdown-item"
        data-promotion-action="${ACTIONS.EDIT}"
        data-promotion-id="${escapeHtml(promotion.id)}"
      >

        <i
          class="bi bi-pencil me-2"
          aria-hidden="true"
        ></i>

        Edit Promotion

      </button>

    </li>
  `);

  if (promotion.status === STATUS.ACTIVE) {
    items.push(`
      <li>

        <button
          type="button"
          class="dropdown-item text-danger"
          data-promotion-action="${ACTIONS.DEACTIVATE}"
          data-promotion-id="${escapeHtml(promotion.id)}"
        >

          <i
            class="bi bi-pause-circle me-2"
            aria-hidden="true"
          ></i>

          Deactivate Promotion

        </button>

      </li>
    `);
  }

  if (promotion.status === STATUS.INACTIVE) {
    items.push(`
      <li>

        <button
          type="button"
          class="dropdown-item"
          data-promotion-action="${ACTIONS.ACTIVATE}"
          data-promotion-id="${escapeHtml(promotion.id)}"
        >

          <i
            class="bi bi-play-circle me-2"
            aria-hidden="true"
          ></i>

          Activate Promotion

        </button>

      </li>
    `);
  }

  if (items.length === 0) {
    return `
      <span class="text-body-secondary">
        —
      </span>
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

        ${items.join("")}

      </ul>

    </div>
  `;
}

function initializePromotionActions({ container, state }) {
  const tableBody = container.querySelector("#promotions-table-body");

  if (!tableBody) {
    return;
  }

  tableBody.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-promotion-action]");

    if (!actionButton) {
      return;
    }

    const promotionId = actionButton.dataset.promotionId;

    const action = actionButton.dataset.promotionAction;

    const promotion = state.promotions.find((item) => item.id === promotionId);

    if (!promotion) {
      return;
    }

    openPromotionActionModal({
      container,
      state,
      promotion,
      action,
    });
  });
}

function openPromotionActionModal({ container, state, promotion, action }) {
  const modalElement = container.querySelector("#promotion-action-modal");

  const modalBody = container.querySelector("#promotion-action-modal-body");

  const modalTitle = container.querySelector("#promotion-action-modal-label");

  const submitButton = container.querySelector("#promotion-action-submit");

  if (!modalElement || !modalBody || !modalTitle || !submitButton) {
    return;
  }

  state.action = action;
  state.selectedPromotion = promotion;

  modalBody.innerHTML = "";

  if (action === ACTIONS.EDIT) {
    modalTitle.textContent = "Edit Promotion";

    submitButton.textContent = "Save Changes";
    submitButton.className = "btn btn-primary";

    modalBody.innerHTML = renderEditPromotionForm(promotion);
  } else {
    modalTitle.textContent = getStatusActionTitle(action);

    submitButton.textContent = getStatusActionButtonText(action);

    submitButton.className =
      action === ACTIONS.DEACTIVATE ? "btn btn-danger" : "btn btn-primary";

    modalBody.innerHTML = renderStatusConfirmation(promotion, action);
  }

  Modal.getOrCreateInstance(modalElement).show();
}

function renderEditPromotionForm(promotion) {
  return `
    <div class="mb-3">

      <label
        for="promotion-action-name"
        class="form-label"
      >
        Promotion Name
      </label>

      <input
        type="text"
        class="form-control"
        id="promotion-action-name"
        name="name"
        value="${escapeHtml(promotion.name)}"
        required
      >

    </div>

    <div class="mb-3">

      <label
        for="promotion-action-description"
        class="form-label"
      >
        Description
      </label>

      <textarea
        class="form-control"
        id="promotion-action-description"
        name="description"
        rows="3"
      >${escapeHtml(promotion.description ?? "")}</textarea>

    </div>

    <div class="mb-3">

      <label
        for="promotion-action-amount"
        class="form-label"
      >
        Amount
      </label>

      <input
        type="number"
        class="form-control"
        id="promotion-action-amount"
        name="amount"
        min="0"
        step="0.01"
        value="${
          promotion.amount === null || promotion.amount === undefined
            ? ""
            : escapeHtml(promotion.amount)
        }"
      >

    </div>

    <div
      id="promotion-action-error"
      class="alert alert-danger d-none mt-3 mb-0"
      role="alert"
    ></div>
  `;
}

function renderStatusConfirmation(promotion, action) {
  const targetStatus =
    action === ACTIONS.ACTIVATE ? STATUS.ACTIVE : STATUS.INACTIVE;

  return `
    <p class="mb-2">

      Are you sure you want to change

      <strong>
        ${escapeHtml(promotion.name)}
      </strong>

      to

      <strong>
        ${escapeHtml(targetStatus)}
      </strong>?

    </p>

    <p class="text-body-secondary mb-0">
      This changes whether the promotion
      is available for use.
    </p>

    <div
      id="promotion-action-error"
      class="alert alert-danger d-none mt-3 mb-0"
      role="alert"
    ></div>
  `;
}

function initializePromotionActionForm({
  token,
  container,
  state,
  tableBody,
  paginationContainer,
  errorContainer,
}) {
  const form = container.querySelector("#promotion-action-form");

  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = container.querySelector("#promotion-action-submit");

    const formError = form.querySelector("#promotion-action-error");

    if (submitButton) {
      submitButton.disabled = true;
    }

    if (formError) {
      formError.textContent = "";
      formError.classList.add("d-none");
    }

    try {
      const promotion = state.selectedPromotion;

      if (!promotion) {
        throw new Error("No promotion was selected.");
      }

      if (state.action === ACTIONS.EDIT) {
        const formData = new FormData(form);

        const name = String(formData.get("name") ?? "").trim();

        const description = String(formData.get("description") ?? "").trim();

        const amountRaw = String(formData.get("amount") ?? "").trim();

        const amount = amountRaw === "" ? null : Number(amountRaw);

        if (!name) {
          throw new Error("Promotion name is required.");
        }

        if (amount !== null && (!Number.isFinite(amount) || amount < 0)) {
          throw new Error("Amount must be a non-negative number.");
        }

        await updatePromotion({
          token,
          id: promotion.id,
          name,
          description: description || null,
          amount,
        });
      } else {
        await updatePromotionStatus({
          token,
          id: promotion.id,
          status:
            state.action === ACTIONS.ACTIVATE ? STATUS.ACTIVE : STATUS.INACTIVE,
        });
      }

      Modal.getOrCreateInstance(
        container.querySelector("#promotion-action-modal"),
      ).hide();

      state.action = null;
      state.selectedPromotion = null;

      await loadPromotions({
        token,
        state,
        tableBody,
        paginationContainer,
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

  const modalElement = container.querySelector("#promotion-action-modal");

  if (modalElement) {
    modalElement.addEventListener("hidden.bs.modal", () => {
      state.action = null;
      state.selectedPromotion = null;
      form.reset();

      const modalBody = container.querySelector("#promotion-action-modal-body");

      if (modalBody) {
        modalBody.innerHTML = "";
      }

      const submitButton = container.querySelector("#promotion-action-submit");

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Save";
        submitButton.className = "btn btn-primary";
      }
    });
  }
}

function getStatusActionTitle(action) {
  switch (action) {
    case ACTIONS.ACTIVATE:
      return "Activate Promotion";

    case ACTIONS.DEACTIVATE:
      return "Deactivate Promotion";

    default:
      return "Promotion Action";
  }
}

function getStatusActionButtonText(action) {
  switch (action) {
    case ACTIONS.ACTIVATE:
      return "Activate Promotion";

    case ACTIONS.DEACTIVATE:
      return "Deactivate Promotion";

    default:
      return "Save";
  }
}

function renderPagination(pagination, container) {
  if (!container) {
    return;
  }

  const page = Number(pagination?.page ?? 1);

  const pageSize = Number(pagination?.pageSize ?? 20);

  const total = Number(pagination?.total ?? 0);

  const totalPages = total === 0 ? 1 : Math.ceil(total / pageSize);

  if (total === 0) {
    container.innerHTML = `
      <div class="text-body-secondary small">
        No results
      </div>
    `;

    return;
  }

  const start = (page - 1) * pageSize + 1;

  const end = Math.min(page * pageSize, total);

  container.innerHTML = `
    <div class="text-body-secondary small">
      Showing ${start}–${end} of ${total}
    </div>

    <div
      class="btn-group"
      role="group"
      aria-label="Pagination"
    >

      <button
        type="button"
        class="btn btn-outline-secondary btn-sm"
        data-promotion-page="${page - 1}"
        ${page <= 1 ? "disabled" : ""}
      >
        Previous
      </button>

      <button
        type="button"
        class="btn btn-outline-secondary btn-sm"
        disabled
      >
        Page ${page} of ${totalPages}
      </button>

      <button
        type="button"
        class="btn btn-outline-secondary btn-sm"
        data-promotion-page="${page + 1}"
        ${page >= totalPages ? "disabled" : ""}
      >
        Next
      </button>

    </div>
  `;
}

function initializePagination({
  token,
  state,
  tableBody,
  paginationContainer,
  errorContainer,
}) {
  if (!paginationContainer) {
    return;
  }

  paginationContainer.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-promotion-page]");

    if (!button || button.disabled) {
      return;
    }

    const nextPage = Number(button.dataset.promotionPage);

    if (!Number.isInteger(nextPage) || nextPage < 1) {
      return;
    }

    state.page = nextPage;

    try {
      await loadPromotions({
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
        error?.message || "Unable to load promotions.",
      );
    }
  });
}

function initializeFilters({
  token,
  state,
  container,
  tableBody,
  paginationContainer,
  errorContainer,
}) {
  const form = container.querySelector("#promotions-filter-form");

  const resetButton = container.querySelector("#promotions-filter-reset");

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      state.filters.search =
        container.querySelector("#promotions-filter-search")?.value.trim() ||
        "";

      state.filters.status =
        container.querySelector("#promotions-filter-status")?.value || "";

      state.filters.campaignId =
        container.querySelector("#promotions-filter-campaign")?.value || "";

      state.page = 1;

      try {
        await loadPromotions({
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
          error?.message || "Unable to filter promotions.",
        );
      }
    });
  }

  if (resetButton) {
    resetButton.addEventListener("click", async () => {
      state.filters = {
        search: "",
        status: "",
        campaignId: "",
      };

      const searchInput = container.querySelector("#promotions-filter-search");

      const statusSelect = container.querySelector("#promotions-filter-status");

      const campaignSelect = container.querySelector(
        "#promotions-filter-campaign",
      );

      if (searchInput) {
        searchInput.value = "";
      }

      if (statusSelect) {
        statusSelect.value = "";
      }

      if (campaignSelect) {
        campaignSelect.value = "";
      }

      state.page = 1;

      try {
        await loadPromotions({
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
          error?.message || "Unable to reset promotions.",
        );
      }
    });
  }
}

function initializeCreatePromotionForm({
  token,
  state,
  container,
  tableBody,
  paginationContainer,
  errorContainer,
}) {
  const form = container.querySelector("#create-promotion-form");

  const modalElement = container.querySelector("#create-promotion-modal");

  if (!form || !modalElement) {
    return;
  }

  const modal = Modal.getOrCreateInstance(modalElement);

  modalElement.addEventListener("show.bs.modal", () => {
    const formError = form.querySelector("#create-promotion-error");

    if (formError) {
      formError.textContent = "";
      formError.classList.add("d-none");
    }
  });

  modalElement.addEventListener("hidden.bs.modal", () => {
    form.reset();

    const statusSelect = form.querySelector("#create-promotion-status");

    if (statusSelect) {
      statusSelect.value = STATUS.ACTIVE;
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = form.querySelector("#create-promotion-submit");

    const formError = form.querySelector("#create-promotion-error");

    const campaignId =
      form.querySelector("#create-promotion-campaign")?.value || "";

    const name =
      form.querySelector("#create-promotion-name")?.value.trim() || "";

    const description =
      form.querySelector("#create-promotion-description")?.value.trim() || "";

    const amountValue =
      form.querySelector("#create-promotion-amount")?.value.trim() || "";

    const status =
      form.querySelector("#create-promotion-status")?.value || STATUS.ACTIVE;

    const amount = amountValue === "" ? null : Number(amountValue);

    if (!campaignId || !name) {
      showFormError(formError, "Campaign and promotion name are required.");

      return;
    }

    if (amount !== null && (!Number.isFinite(amount) || amount < 0)) {
      showFormError(formError, "Amount must be a non-negative number.");

      return;
    }

    if (submitButton) {
      submitButton.disabled = true;

      submitButton.innerHTML = `
          <span
            class="spinner-border spinner-border-sm me-2"
            aria-hidden="true"
          ></span>
          Creating...
        `;
    }

    if (formError) {
      formError.textContent = "";
      formError.classList.add("d-none");
    }

    try {
      await createPromotion({
        token,
        campaignId,
        name,
        description: description || null,
        amount,
        status,
      });

      modal.hide();

      state.page = 1;

      await loadPromotions({
        token,
        state,
        tableBody,
        paginationContainer,
        errorContainer,
      });
    } catch (error) {
      showFormError(formError, error?.message || "Unable to create promotion.");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;

        submitButton.innerHTML = "Create Promotion";
      }
    }
  });
}

function showFormError(container, message) {
  if (!container) {
    return;
  }

  container.textContent = message;
  container.classList.remove("d-none");
}

function showError(tableBody, errorContainer, message) {
  if (tableBody) {
    tableBody.innerHTML = `
      <tr>
        <td
          colspan="7"
          class="text-center text-body-secondary py-5"
        >
          Unable to load promotions.
        </td>
      </tr>
    `;
  }

  if (errorContainer) {
    errorContainer.textContent = message;
    errorContainer.classList.remove("d-none");
  }
}

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString();
}
