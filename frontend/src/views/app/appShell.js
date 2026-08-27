import { renderAppHeader } from "../../components/layout/appHeader.js";
import { renderAppSidebar } from "../../components/layout/appSidebar.js";

export function renderAppShell(container, { user } = {}) {
  container.innerHTML = `
    <div class="app-shell min-vh-100 d-flex">
      <div id="app-sidebar-container"></div>

      <div class="app-main flex-grow-1 d-flex flex-column min-vh-100">
        <div id="app-header-container"></div>

        <main
          class="app-content flex-grow-1 bg-body-tertiary"
          id="app-content"
        >
          <div class="container-fluid p-3 p-md-4">
            <div
              class="card border-0 shadow-sm"
            >
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
        </main>
      </div>
    </div>
  `;

  const sidebarContainer = container.querySelector("#app-sidebar-container");

  const headerContainer = container.querySelector("#app-header-container");

  renderAppSidebar(sidebarContainer);
  renderAppHeader(headerContainer, { user });

  initializeSidebarToggle(container);
}

function initializeSidebarToggle(container) {
  const sidebar = container.querySelector("#app-sidebar");
  const toggleButton = container.querySelector("#sidebar-toggle");

  if (!sidebar || !toggleButton) {
    return;
  }

  toggleButton.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("is-open");

    toggleButton.setAttribute("aria-expanded", String(isOpen));
  });
}
