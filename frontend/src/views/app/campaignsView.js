import { Modal } from "bootstrap";

import {
  getAccessToken,
  hasPermission,
  getAuthorizationContext,
} from "../../services/authService.js";

import {
  listCampaigns,
  createCampaign,
  updateCampaign,
  updateCampaignStatus,
} from "../../services/campaignService.js";

import { listWebsites } from "../../services/websiteService.js";

import { escapeHtml, getStatusBadgeClass } from "../../utils/formatUtils.js";

const ACTIONS = {
  EDIT: "edit",
  ACTIVATE: "activate",
  CANCEL: "cancel",
  EXPIRE: "expire",
};

const STATUS = {
  DRAFT: "Draft",
  ACTIVE: "Active",
  EXPIRED: "Expired",
  CANCELLED: "Cancelled",
};

export function renderCampaignsView() {
  return `
    <div class="container-fluid p-3 p-md-4">

      <div
        class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4"
      >
        <div>
          <h2 class="h4 mb-1">Campaigns</h2>

          <p class="text-body-secondary mb-0">
            Manage campaigns and their promotional offers.
          </p>
        </div>

        ${
          hasPermission("CAMPAIGN_CREATE")
            ? `
        <button
          type="button"
          class="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#create-campaign-modal"
        >
          <i
            class="bi bi-megaphone me-2"
            aria-hidden="true"
          ></i>

          Create Campaign
        </button>`
            : ""
        }
      </div>

      <div
        id="campaigns-error"
        class="alert alert-danger d-none"
        role="alert"
      ></div>

      <div class="card border-0 shadow-sm mb-3">
        <div class="card-body">

          <form id="campaigns-filter-form">

            <div class="row g-3 align-items-end">

              <div class="col-12 col-lg-7">
                <label
                  for="campaigns-filter-search"
                  class="form-label"
                >
                  Search
                </label>

                <input
                  type="search"
                  class="form-control"
                  id="campaigns-filter-search"
                  name="search"
                  placeholder="Campaign name or description"
                  autocomplete="off"
                >
              </div>

              <div class="col-12 col-md-5 col-lg-3">
                <label
                  for="campaigns-filter-status"
                  class="form-label"
                >
                  Status
                </label>

                <select
                  class="form-select"
                  id="campaigns-filter-status"
                  name="status"
                >
                  <option value="">All Statuses</option>
                  <option value="Draft">Draft</option>
                  <option value="Active">Active</option>
                  <option value="Expired">Expired</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div class="col-12 col-md-7 col-lg-2">
                <button
                  type="submit"
                  class="btn btn-primary w-100"
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
                id="campaigns-filter-reset"
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
                  <th scope="col">Campaign</th>
                  <th scope="col">Description</th>
                  <th scope="col">Start</th>
                  <th scope="col">End</th>
                  <th scope="col">Status</th>
                  <th scope="col" class="text-end">Actions</th>
                </tr>

              </thead>

              <tbody id="campaigns-table-body">

                <tr>
                  <td
                    colspan="7"
                    class="text-center text-body-secondary py-5"
                  >
                    Loading campaigns...
                  </td>
                </tr>

              </tbody>

            </table>

          </div>

        </div>

      </div>

      <!-- Create Campaign Modal -->

      <div
        class="modal fade"
        id="create-campaign-modal"
        tabindex="-1"
        aria-labelledby="create-campaign-modal-label"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg modal-dialog-centered">

          <div class="modal-content">

            <form id="create-campaign-form">

              <div class="modal-header">

                <h2
                  class="modal-title fs-5"
                  id="create-campaign-modal-label"
                >
                  Create Campaign
                </h2>

                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>

              </div>

              <div class="modal-body">

                <h3 class="h6 mb-3">
                  Campaign Details
                </h3>

                <div class="row g-3">

                  <div class="col-12 col-md-6">

                    <label
                      for="create-campaign-website"
                      class="form-label"
                    >
                      Website
                    </label>

                    <select
                      class="form-select"
                      id="create-campaign-website"
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
                      for="create-campaign-status"
                      class="form-label"
                    >
                      Status
                    </label>

                    <select
                      class="form-select"
                      id="create-campaign-status"
                      name="status"
                      required
                    >
                      <option value="Draft">Draft</option>
                      <option value="Active">Active</option>
                    </select>

                  </div>

                  <div class="col-12">

                    <label
                      for="create-campaign-name"
                      class="form-label"
                    >
                      Campaign Name
                    </label>

                    <input
                      type="text"
                      class="form-control"
                      id="create-campaign-name"
                      name="name"
                      required
                    >

                  </div>

                  <div class="col-12">

                    <label
                      for="create-campaign-description"
                      class="form-label"
                    >
                      Description
                    </label>

                    <textarea
                      class="form-control"
                      id="create-campaign-description"
                      name="description"
                      rows="3"
                    ></textarea>

                  </div>

                  <div class="col-12 col-md-6">

                    <label
                      for="create-campaign-start-date"
                      class="form-label"
                    >
                      Start Date
                    </label>

                    <input
                      type="date"
                      class="form-control"
                      id="create-campaign-start-date"
                      name="startDate"
                      required
                    >

                  </div>

                  <div class="col-12 col-md-6">

                    <label
                      for="create-campaign-end-date"
                      class="form-label"
                    >
                      End Date
                    </label>

                    <input
                      type="date"
                      class="form-control"
                      id="create-campaign-end-date"
                      name="endDate"
                      required
                    >

                  </div>

                </div>

                <hr class="my-4">

                <h3 class="h6 mb-3">
                  Initial Promotion
                </h3>

                <div class="row g-3">

                  <div class="col-12">

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
                      name="promotionName"
                      required
                    >

                  </div>

                  <div class="col-12">

                    <label
                      for="create-promotion-description"
                      class="form-label"
                    >
                      Promotion Description
                    </label>

                    <textarea
                      class="form-control"
                      id="create-promotion-description"
                      name="promotionDescription"
                      rows="3"
                    ></textarea>

                  </div>

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
                      name="promotionAmount"
                      min="0"
                      step="0.01"
                    >

                  </div>

                  <div class="col-12 col-md-6">

                    <label
                      for="create-promotion-status"
                      class="form-label"
                    >
                      Promotion Status
                    </label>

                    <select
                      class="form-select"
                      id="create-promotion-status"
                      name="promotionStatus"
                      required
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>

                  </div>

                </div>

                <div
                  id="create-campaign-error"
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
                  id="create-campaign-submit"
                >
                  Create Campaign
                </button>

              </div>

            </form>

          </div>

        </div>
      </div>

      <!-- Campaign Action Modal -->

      <div
        class="modal fade"
        id="campaign-action-modal"
        tabindex="-1"
        aria-labelledby="campaign-action-modal-label"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg modal-dialog-centered">

          <div class="modal-content">

            <form id="campaign-action-form">

              <div class="modal-header">

                <h2
                  class="modal-title fs-5"
                  id="campaign-action-modal-label"
                >
                  Campaign Action
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
                id="campaign-action-modal-body"
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
                  id="campaign-action-submit"
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

export async function initializeCampaignsView(container) {
  const token = getAccessToken();

  const tableBody = container.querySelector("#campaigns-table-body");

  const errorContainer = container.querySelector("#campaigns-error");

  if (!tableBody) {
    return;
  }

  if (!token) {
    showCampaignsError(
      tableBody,
      errorContainer,
      "Authentication is required.",
    );

    return;
  }

  const state = {
    campaigns: [],
    websites: [],
    websiteMap: new Map(),
    action: null,
    selectedCampaign: null,
    filters: {
      search: "",
      status: "",
    },
  };

  try {
    const authorization = getAuthorizationContext();
    if (authorization?.isAdministrator) {
      await loadWebsites({
        token,
        state,
        container,
      });
    } else {
      state.websites = authorization?.websites ?? [];
      populateWebsiteSelect(
        container.querySelector("#create-campaign-website"),
        state.websites,
      );
    }

    await loadCampaigns({
      token,
      state,
      tableBody,
      errorContainer,
    });

    initializeCreateCampaignForm({
      token,
      container,
      state,
      tableBody,
      errorContainer,
    });

    initializeCampaignFilters({
      token,
      container,
      state,
      tableBody,
      errorContainer,
    });

    initializeCampaignActions({
      container,
      state,
    });

    initializeCampaignActionForm({
      token,
      container,
      state,
      tableBody,
      errorContainer,
    });
  } catch (error) {
    showCampaignsError(
      tableBody,
      errorContainer,
      error?.message || "Unable to load campaigns.",
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
    container.querySelector("#create-campaign-website"),
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

async function loadCampaigns({ token, state, tableBody, errorContainer }) {
  const response = await listCampaigns({
    token,
    page: 1,
    pageSize: 20,
    search: state.filters.search,
    status: state.filters.status,
  });

  state.campaigns = response?.data ?? [];

  renderCampaigns(state.campaigns, state.websiteMap, tableBody);

  if (errorContainer) {
    errorContainer.textContent = "";
    errorContainer.classList.add("d-none");
  }
}

function initializeCreateCampaignForm({
  token,
  container,
  state,
  tableBody,
  errorContainer,
}) {
  const form = container.querySelector("#create-campaign-form");

  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = form.querySelector("#create-campaign-submit");

    const formError = form.querySelector("#create-campaign-error");

    if (submitButton) {
      submitButton.disabled = true;
    }

    if (formError) {
      formError.textContent = "";
      formError.classList.add("d-none");
    }

    try {
      const formData = new FormData(form);

      const promotionAmountRaw = String(
        formData.get("promotionAmount") ?? "",
      ).trim();

      await createCampaign({
        token,
        websiteId: formData.get("websiteId"),
        name: formData.get("name"),
        description: formData.get("description"),
        startDate: formData.get("startDate"),
        endDate: formData.get("endDate"),
        status: formData.get("status"),
        promotion: {
          name: formData.get("promotionName"),
          description: formData.get("promotionDescription"),
          amount: promotionAmountRaw === "" ? null : Number(promotionAmountRaw),
          status: formData.get("promotionStatus"),
        },
      });

      form.reset();

      const modalElement = form.closest(".modal");

      const modal = modalElement
        ? Modal.getOrCreateInstance(modalElement)
        : null;

      modal?.hide();

      await loadCampaigns({
        token,
        state,
        tableBody,
        errorContainer,
      });
    } catch (error) {
      if (formError) {
        formError.textContent = error?.message || "Unable to create campaign.";

        formError.classList.remove("d-none");
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}

function initializeCampaignFilters({
  token,
  container,
  state,
  tableBody,
  errorContainer,
}) {
  const form = container.querySelector("#campaigns-filter-form");

  const resetButton = container.querySelector("#campaigns-filter-reset");

  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    state.filters.search = String(formData.get("search") ?? "").trim();

    state.filters.status = String(formData.get("status") ?? "");

    try {
      await loadCampaigns({
        token,
        state,
        tableBody,
        errorContainer,
      });
    } catch (error) {
      showCampaignsError(
        tableBody,
        errorContainer,
        error?.message || "Unable to load campaigns.",
      );
    }
  });

  resetButton?.addEventListener("click", async () => {
    state.filters.search = "";
    state.filters.status = "";

    form.reset();

    try {
      await loadCampaigns({
        token,
        state,
        tableBody,
        errorContainer,
      });
    } catch (error) {
      showCampaignsError(
        tableBody,
        errorContainer,
        error?.message || "Unable to load campaigns.",
      );
    }
  });
}

function initializeCampaignActions({ container, state }) {
  const tableBody = container.querySelector("#campaigns-table-body");

  if (!tableBody) {
    return;
  }

  tableBody.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-campaign-action]");

    if (!actionButton) {
      return;
    }

    const campaignId = actionButton.dataset.campaignId;

    const action = actionButton.dataset.campaignAction;

    const campaign = state.campaigns.find((item) => item.id === campaignId);

    if (!campaign) {
      return;
    }

    openCampaignActionModal({
      container,
      state,
      campaign,
      action,
    });
  });
}

function openCampaignActionModal({ container, state, campaign, action }) {
  const modalElement = container.querySelector("#campaign-action-modal");

  const modalBody = container.querySelector("#campaign-action-modal-body");

  const modalTitle = container.querySelector("#campaign-action-modal-label");

  const submitButton = container.querySelector("#campaign-action-submit");

  if (!modalElement || !modalBody || !modalTitle || !submitButton) {
    return;
  }

  state.action = action;
  state.selectedCampaign = campaign;

  modalBody.innerHTML = "";

  if (action === ACTIONS.EDIT) {
    modalTitle.textContent = "Edit Campaign";
    submitButton.textContent = "Save Changes";
    submitButton.className = "btn btn-primary";

    modalBody.innerHTML = renderEditCampaignForm(campaign);
  } else {
    modalTitle.textContent = getStatusActionTitle(action);

    submitButton.textContent = getStatusActionButtonText(action);

    submitButton.className =
      action === ACTIONS.CANCEL ? "btn btn-danger" : "btn btn-primary";

    modalBody.innerHTML = renderStatusConfirmation(campaign, action);
  }

  Modal.getOrCreateInstance(modalElement).show();
}

function renderEditCampaignForm(campaign) {
  return `
    <div class="mb-3">

      <label
        for="campaign-action-name"
        class="form-label"
      >
        Campaign Name
      </label>

      <input
        type="text"
        class="form-control"
        id="campaign-action-name"
        name="name"
        value="${escapeHtml(campaign.name)}"
        required
      >

    </div>

    <div class="mb-3">

      <label
        for="campaign-action-description"
        class="form-label"
      >
        Description
      </label>

      <textarea
        class="form-control"
        id="campaign-action-description"
        name="description"
        rows="3"
      >${escapeHtml(campaign.description ?? "")}</textarea>

    </div>

    <div class="row g-3">

      <div class="col-12 col-md-6">

        <label
          for="campaign-action-start-date"
          class="form-label"
        >
          Start Date
        </label>

        <input
          type="date"
          class="form-control"
          id="campaign-action-start-date"
          name="startDate"
          value="${escapeHtml(campaign.startDate)}"
          required
        >

      </div>

      <div class="col-12 col-md-6">

        <label
          for="campaign-action-end-date"
          class="form-label"
        >
          End Date
        </label>

        <input
          type="date"
          class="form-control"
          id="campaign-action-end-date"
          name="endDate"
          value="${escapeHtml(campaign.endDate)}"
          required
        >

      </div>

    </div>

    <div
      id="campaign-action-error"
      class="alert alert-danger d-none mt-3 mb-0"
      role="alert"
    ></div>
  `;
}

function renderStatusConfirmation(campaign, action) {
  const targetStatus = getTargetStatus(action);

  return `
    <p class="mb-2">
      Are you sure you want to change
      <strong>${escapeHtml(campaign.name)}</strong>
      to
      <strong>${escapeHtml(targetStatus)}</strong>?
    </p>

    <p class="text-body-secondary mb-0">
      This action follows the campaign lifecycle rules
      and cannot be reversed once the campaign reaches
      a terminal state.
    </p>

    <div
      id="campaign-action-error"
      class="alert alert-danger d-none mt-3 mb-0"
      role="alert"
    ></div>
  `;
}

function initializeCampaignActionForm({
  token,
  container,
  state,
  tableBody,
  errorContainer,
}) {
  const form = container.querySelector("#campaign-action-form");

  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = container.querySelector("#campaign-action-submit");

    const formError = form.querySelector("#campaign-action-error");

    if (submitButton) {
      submitButton.disabled = true;
    }

    if (formError) {
      formError.textContent = "";
      formError.classList.add("d-none");
    }

    try {
      const campaign = state.selectedCampaign;

      if (!campaign) {
        throw new Error("No campaign was selected.");
      }

      if (state.action === ACTIONS.EDIT) {
        const formData = new FormData(form);

        await updateCampaign({
          token,
          id: campaign.id,
          name: formData.get("name"),
          description: formData.get("description"),
          startDate: formData.get("startDate"),
          endDate: formData.get("endDate"),
        });
      } else {
        await updateCampaignStatus({
          token,
          id: campaign.id,
          status: getTargetStatus(state.action),
        });
      }

      Modal.getOrCreateInstance(
        container.querySelector("#campaign-action-modal"),
      ).hide();

      state.action = null;
      state.selectedCampaign = null;

      await loadCampaigns({
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

function getTargetStatus(action) {
  switch (action) {
    case ACTIONS.ACTIVATE:
      return STATUS.ACTIVE;

    case ACTIONS.CANCEL:
      return STATUS.CANCELLED;

    case ACTIONS.EXPIRE:
      return STATUS.EXPIRED;

    default:
      return null;
  }
}

function getStatusActionTitle(action) {
  switch (action) {
    case ACTIONS.ACTIVATE:
      return "Activate Campaign";

    case ACTIONS.CANCEL:
      return "Cancel Campaign";

    case ACTIONS.EXPIRE:
      return "Expire Campaign";

    default:
      return "Campaign Action";
  }
}

function getStatusActionButtonText(action) {
  switch (action) {
    case ACTIONS.ACTIVATE:
      return "Activate Campaign";

    case ACTIONS.CANCEL:
      return "Cancel Campaign";

    case ACTIONS.EXPIRE:
      return "Expire Campaign";

    default:
      return "Save";
  }
}

function renderCampaigns(campaigns, websiteMap, tableBody) {
  if (!tableBody) {
    return;
  }

  if (campaigns.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td
          colspan="7"
          class="text-center text-body-secondary py-5"
        >
          No campaigns found.
        </td>
      </tr>
    `;

    return;
  }

  tableBody.innerHTML = campaigns
    .map((campaign) => {
      const websiteName = campaign.websiteName || campaign.websiteId;

      return `
        <tr>

          <td>
            ${escapeHtml(websiteName)}
          </td>

          <td>
            <span class="fw-semibold">
              ${escapeHtml(campaign.name)}
            </span>
          </td>

          <td>
            ${
              campaign.description
                ? escapeHtml(campaign.description)
                : `<span class="text-body-secondary">—</span>`
            }
          </td>

          <td>
            ${escapeHtml(campaign.startDate)}
          </td>

          <td>
            ${escapeHtml(campaign.endDate)}
          </td>

          <td>
            <span
              class="badge ${getStatusBadgeClass(campaign.status)}"
            >
              ${escapeHtml(campaign.status)}
            </span>
          </td>

          <td class="text-end">
            ${
              hasPermission("CAMPAIGN_UPDATE")
                ? `
            ${renderCampaignActions(campaign)} `
                : "—"
            }
          </td>

        </tr>
      `;
    })
    .join("");
}

function renderCampaignActions(campaign) {
  const items = [];

  if (campaign.status === STATUS.DRAFT || campaign.status === STATUS.ACTIVE) {
    items.push(`
      <li>
        <button
          type="button"
          class="dropdown-item"
          data-campaign-action="${ACTIONS.EDIT}"
          data-campaign-id="${escapeHtml(campaign.id)}"
        >
          <i
            class="bi bi-pencil me-2"
            aria-hidden="true"
          ></i>
          Edit Campaign
        </button>
      </li>
    `);
  }

  if (campaign.status === STATUS.DRAFT) {
    items.push(`
      <li>
        <button
          type="button"
          class="dropdown-item"
          data-campaign-action="${ACTIONS.ACTIVATE}"
          data-campaign-id="${escapeHtml(campaign.id)}"
        >
          <i
            class="bi bi-play-circle me-2"
            aria-hidden="true"
          ></i>
          Activate Campaign
        </button>
      </li>

      <li>
        <button
          type="button"
          class="dropdown-item text-danger"
          data-campaign-action="${ACTIONS.CANCEL}"
          data-campaign-id="${escapeHtml(campaign.id)}"
        >
          <i
            class="bi bi-x-circle me-2"
            aria-hidden="true"
          ></i>
          Cancel Campaign
        </button>
      </li>
    `);
  }

  if (campaign.status === STATUS.ACTIVE) {
    items.push(`
      <li>
        <button
          type="button"
          class="dropdown-item"
          data-campaign-action="${ACTIONS.EXPIRE}"
          data-campaign-id="${escapeHtml(campaign.id)}"
        >
          <i
            class="bi bi-check-circle me-2"
            aria-hidden="true"
          ></i>
          Mark Expired
        </button>
      </li>

      <li>
        <button
          type="button"
          class="dropdown-item text-danger"
          data-campaign-action="${ACTIONS.CANCEL}"
          data-campaign-id="${escapeHtml(campaign.id)}"
        >
          <i
            class="bi bi-x-circle me-2"
            aria-hidden="true"
          ></i>
          Cancel Campaign
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

function showCampaignsError(tableBody, errorContainer, message) {
  if (tableBody) {
    tableBody.innerHTML = `
      <tr>
        <td
          colspan="7"
          class="text-center text-body-secondary py-5"
        >
          Unable to load campaigns.
        </td>
      </tr>
    `;
  }

  if (errorContainer) {
    errorContainer.textContent = message;
    errorContainer.classList.remove("d-none");
  }
}
