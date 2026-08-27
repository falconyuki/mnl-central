import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles/app.css";

import { renderLoginView } from "./views/auth/loginView.js";

const app = document.querySelector("#app");

renderLoginView(app, {
  onAuthenticated(user) {
    app.innerHTML = `
      <main class="min-vh-100 d-flex align-items-center justify-content-center bg-body-tertiary">
        <div class="container py-5">
          <div class="row justify-content-center">
            <div class="col-12 col-md-8 col-lg-6">
              <section class="card shadow-sm">
                <div class="card-body p-4 p-md-5 text-center">
                  <div class="text-success fs-1 mb-3" aria-hidden="true">
                    <i class="bi bi-check-circle-fill"></i>
                  </div>

                  <h1 class="h4 mb-2">Sign in successful</h1>

                  <p class="text-body-secondary mb-0">
                    Welcome, ${user.displayName}.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    `;
  },
});
