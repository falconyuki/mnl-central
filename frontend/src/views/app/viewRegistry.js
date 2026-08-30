import { renderUsersView, initializeUsersView } from "./usersView.js";
import { renderWebsitesView, initializeWebsitesView } from "./websitesView.js";
import {
  renderCampaignsView,
  initializeCampaignsView,
} from "./campaignsView.js";
import {
  renderCustomersView,
  initializeCustomersView,
} from "./customersView.js";
import {
  renderCampaignParticipationsView,
  initializeCampaignParticipationsView,
} from "./campaignParticipationsView.js";

import {
  renderCallAttemptsView,
  initializeCallAttemptsView,
} from "./callAttemptsView.js";

import {
  renderPromotionsView,
  initializePromotionsView,
} from "./promotionsView.js";

import {
  renderPromotionLogView,
  initializePromotionLogView,
} from "./promotionsLogView.js";

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
    render: renderWebsitesView,
    initialize: initializeWebsitesView,
  },

  campaigns: {
    id: "campaigns",
    title: "Campaigns",
    render: renderCampaignsView,
    initialize: initializeCampaignsView,
  },

  customers: {
    id: "customers",
    title: "Customers",
    render: renderCustomersView,
    initialize: initializeCustomersView,
  },

  participations: {
    id: "participations",
    title: "Participations",
    render: renderCampaignParticipationsView,
    initialize: initializeCampaignParticipationsView,
  },

  callAttempts: {
    id: "callAttempts",
    title: "Call Attempts",
    render: renderCallAttemptsView,
    initialize: initializeCallAttemptsView,
  },

  promotions: {
    id: "promotions",
    title: "Promotions",
    render: renderPromotionsView,
    initialize: initializePromotionsView,
  },

  promotionsLog: {
    id: "promotionsLog",
    title: "Promotions Log",
    render: renderPromotionLogView,
    initialize: initializePromotionLogView,
  },
};

export function resolveView(viewId) {
  return VIEW_REGISTRY[viewId] || null;
}
