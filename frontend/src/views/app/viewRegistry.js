import { renderUsersView, initializeUsersView } from "./usersView.js";

const VIEW_REGISTRY = {
  dashboard: {
    id: "dashboard",
    title: "Dashboard",
    render() {
      return `
        <div class="container-fluid p-3 p-md-4">
          <div class="card border-0 shadow-sm">
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
      `;
    },
  },

  users: {
    id: "users",
    title: "Users",
    render: renderUsersView,
    initialize: initializeUsersView,
  },

  websites: {
    id: "websites",
    title: "Websites",
    render() {
      return `
        <div class="container-fluid p-3 p-md-4">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h2 class="h5 mb-2">
                Websites
              </h2>

              <p class="text-body-secondary mb-0">
                Website Management will be implemented here.
              </p>
            </div>
          </div>
        </div>
      `;
    },
  },

  campaigns: {
    id: "campaigns",
    title: "Campaigns",
    render() {
      return `
        <div class="container-fluid p-3 p-md-4">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h2 class="h5 mb-2">
                Campaigns
              </h2>

              <p class="text-body-secondary mb-0">
                Campaign Management will be implemented here.
              </p>
            </div>
          </div>
        </div>
      `;
    },
  },
};

export function resolveView(viewId) {
  return VIEW_REGISTRY[viewId] || null;
}
