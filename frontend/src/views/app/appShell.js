import { renderAppHeader } from "../../components/layout/appHeader.js";
import { renderAppSidebar } from "../../components/layout/appSidebar.js";
import { resolveView } from "./viewRegistry.js";

export function renderAppShell(container, { user, onLogout } = {}) {
  container.innerHTML = `
    <div class="app-shell min-vh-100 d-flex">
      <div id="app-sidebar-container"></div>

      <div class="app-main flex-grow-1 d-flex flex-column min-vh-100">
        <div id="app-header-container"></div>

        <main
          class="app-content flex-grow-1 bg-body-tertiary"
          id="app-content"
        >
        </main>
      </div>
    </div>
  `;

  const sidebarContainer = container.querySelector("#app-sidebar-container");

  const headerContainer = container.querySelector("#app-header-container");

  renderAppSidebar(sidebarContainer);
  renderAppHeader(headerContainer, { user, onLogout });
  renderInitialView(container);

  initializeSidebarToggle(container);
  initializeNavigation(container);
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

function renderInitialView(container) {
  const contentContainer = container.querySelector("#app-content");

  if (!contentContainer) {
    return;
  }

  const view = resolveView("dashboard");

  if (!view) {
    return;
  }

  contentContainer.innerHTML = view.render();

  const pageTitle = container.querySelector("#page-title");

  if (pageTitle) {
    pageTitle.textContent = view.title;
  }
}

function initializeNavigation(container) {
  const navigationItems = container.querySelectorAll("[data-nav-item]");
  const contentContainer = container.querySelector("#app-content");
  const pageTitle = container.querySelector("#page-title");

  if (!contentContainer) {
    return;
  }

  navigationItems.forEach((navigationItem) => {
    navigationItem.addEventListener("click", (event) => {
      event.preventDefault();

      const viewId = navigationItem.dataset.navItem;
      const view = resolveView(viewId);

      if (!view) {
        return;
      }

      contentContainer.innerHTML = view.render();

      if (pageTitle) {
        pageTitle.textContent = view.title;
      }

      navigationItems.forEach((item) => {
        item.classList.toggle("active", item === navigationItem);
      });
    });
  });
}
