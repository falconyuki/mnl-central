import { listPromotionReceipts } from "../../services/promotionReceiptService.js";
import { getAccessToken } from "../../services/authService.js";
import { escapeHtml } from "../../utils/formatUtils.js";

export function renderPromotionLogView() {
  return `
    <div class="container-fluid p-3 p-md-4">

      <div
        class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4"
      >
        <div>
          <h1 class="h4 mb-1">
            Promotion Log
          </h1>

          <p class="text-body-secondary mb-0">
            Historical record of promotions received by customers.
          </p>
        </div>
      </div>

      <div
        id="promotion-log-error"
        class="alert alert-danger d-none"
        role="alert"
      ></div>

      <div class="card border-0 shadow-sm">

        <div class="card-body p-0">

          <div class="table-responsive page-table-container">

            <table class="table table-hover align-middle mb-0">

              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Campaign Name</th>
                  <th>Promotion Name</th>
                  <th>Date Received</th>
                  <th>Given By</th>
                </tr>
              </thead>

              <tbody id="promotion-log-table-body">

                <tr>
                  <td
                    colspan="5"
                    class="text-center text-body-secondary py-5"
                  >
                    Loading promotion log...
                  </td>
                </tr>

              </tbody>

            </table>

          </div>

        </div>

        <div
          class="card-footer bg-body border-0 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2"
          id="promotion-log-pagination"
        ></div>

      </div>

    </div>
  `;
}

export async function initializePromotionLogView(container) {
  const tableBody = container.querySelector("#promotion-log-table-body");

  const paginationContainer = container.querySelector(
    "#promotion-log-pagination",
  );

  const errorContainer = container.querySelector("#promotion-log-error");

  if (!tableBody) {
    return;
  }

  const token = getAccessToken();

  if (!token) {
    showError(tableBody, errorContainer, "Authentication is required.");

    return;
  }

  const state = {
    promotionReceipts: [],
    page: 1,
    pageSize: 20,
    pagination: {
      page: 1,
      pageSize: 20,
      total: 0,
    },
  };

  try {
    await loadPromotionLog({
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
      error?.message || "Unable to load promotion log.",
    );
  }
}

async function loadPromotionLog({
  token,
  state,
  tableBody,
  paginationContainer,
  errorContainer,
}) {
  const response = await listPromotionReceipts({
    token,
    page: state.page,
    pageSize: state.pageSize,
  });

  state.promotionReceipts = response?.data ?? [];

  state.pagination = response?.pagination ?? {
    page: state.page,
    pageSize: state.pageSize,
    total: 0,
  };

  renderPromotionLog(state, tableBody);

  renderPagination(state, paginationContainer);

  errorContainer?.classList.add("d-none");
}

function renderPromotionLog(state, tableBody) {
  if (state.promotionReceipts.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td
          colspan="5"
          class="text-center text-body-secondary py-5"
        >
          No promotion records found.
        </td>
      </tr>
    `;

    return;
  }

  tableBody.innerHTML = state.promotionReceipts
    .map(
      (receipt) => `
        <tr>

          <td>
            ${escapeHtml(receipt.customerName || "—")}
          </td>

          <td>
            ${escapeHtml(receipt.campaignName || "—")}
          </td>

          <td>
            ${escapeHtml(receipt.promotionName || "—")}
          </td>

          <td>
            ${formatDate(receipt.receivedAt)}
          </td>

          <td>
            ${escapeHtml(receipt.staffDisplayName || "—")}
          </td>

        </tr>
      `,
    )
    .join("");
}

function renderPagination(state, paginationContainer) {
  if (!paginationContainer) {
    return;
  }

  const total = Number(state.pagination.total ?? 0);
  const page = Number(state.pagination.page ?? state.page);
  const pageSize = Number(state.pagination.pageSize ?? state.pageSize);

  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) {
    paginationContainer.innerHTML = "";

    return;
  }

  const previousDisabled = page <= 1 ? "disabled" : "";
  const nextDisabled = page >= totalPages ? "disabled" : "";

  paginationContainer.innerHTML = `
    <div class="text-body-secondary small">
      Page ${page} of ${totalPages}
    </div>

    <div class="btn-group" role="group" aria-label="Promotion log pagination">

      <button
        type="button"
        class="btn btn-outline-secondary btn-sm"
        data-promotion-log-page="${page - 1}"
        ${previousDisabled}
      >
        Previous
      </button>

      <button
        type="button"
        class="btn btn-outline-secondary btn-sm"
        data-promotion-log-page="${page + 1}"
        ${nextDisabled}
      >
        Next
      </button>

    </div>
  `;

  initializePagination(state, paginationContainer);
}

function initializePagination(state, paginationContainer) {
  paginationContainer
    .querySelectorAll("[data-promotion-log-page]")
    .forEach((button) => {
      button.addEventListener("click", async () => {
        const nextPage = Number(button.dataset.promotionLogPage);

        if (!Number.isInteger(nextPage) || nextPage < 1) {
          return;
        }

        const total = Number(state.pagination.total ?? 0);
        const pageSize = Number(state.pagination.pageSize ?? state.pageSize);
        const totalPages = Math.ceil(total / pageSize);

        if (nextPage > totalPages || nextPage === state.page) {
          return;
        }

        state.page = nextPage;

        const container = paginationContainer.closest(".container-fluid");

        const tableBody = container?.querySelector("#promotion-log-table-body");

        const errorContainer = container?.querySelector("#promotion-log-error");

        if (!tableBody) {
          return;
        }

        try {
          await loadPromotionLog({
            token: getAccessToken(),
            state,
            tableBody,
            paginationContainer,
            errorContainer,
          });
        } catch (error) {
          showError(
            tableBody,
            errorContainer,
            error?.message || "Unable to load promotion log.",
          );
        }
      });
    });
}

function showError(tableBody, errorContainer, message) {
  tableBody.innerHTML = `
    <tr>
      <td
        colspan="5"
        class="text-center text-body-secondary py-5"
      >
        Unable to load promotion log.
      </td>
    </tr>
  `;

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
    return escapeHtml(value);
  }

  return escapeHtml(
    new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date),
  );
}
