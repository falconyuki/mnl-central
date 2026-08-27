import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles/app.css";

import { AUTH_STATES, resolveAuthentication } from "./services/index.js";

import { renderLoginView } from "./views/auth/loginView.js";
import { renderChangePasswordView } from "./views/auth/changePasswordView.js";

import { renderAppShell } from "./views/app/appShell.js";

const app = document.querySelector("#app");

function renderAuthenticatedApplication(user) {
  renderAppShell(app, { user });
}

function renderAuthenticationState(result) {
  if (result.state === AUTH_STATES.PASSWORD_CHANGE_REQUIRED) {
    renderChangePasswordView(app, {
      user: result.user,
      onPasswordChanged() {
        renderAuthenticatedApplication(result.user);
      },
    });

    return;
  }

  if (result.state === AUTH_STATES.AUTHENTICATED) {
    renderAuthenticatedApplication(result.user);
    return;
  }

  renderLoginView(app, {
    onAuthenticated(user) {
      if (user.mustChangePassword) {
        renderChangePasswordView(app, {
          user,
          onPasswordChanged() {
            renderAuthenticatedApplication(user);
          },
        });

        return;
      }

      renderAuthenticatedApplication(user);
    },
  });
}

async function initializeApplication() {
  const authentication = await resolveAuthentication();

  renderAuthenticationState(authentication);
}

initializeApplication();
