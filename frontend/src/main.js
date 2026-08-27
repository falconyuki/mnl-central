import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles/app.css";

const app = document.querySelector("#app");

app.innerHTML = `
  <main class="min-vh-100 d-flex align-items-center justify-content-center bg-body-tertiary">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-6">
          <section class="card shadow-sm">
            <div class="card-body p-4 p-md-5">
              <div class="d-flex align-items-center gap-3 mb-3">
                <span class="fs-2 text-primary" aria-hidden="true">
                  <i class="bi bi-grid-1x2-fill"></i>
                </span>

                <div>
                  <h1 class="h3 mb-1">MNL-Central</h1>
                  <p class="text-body-secondary mb-0">
                    Frontend foundation
                  </p>
                </div>
              </div>

              <p class="mb-0">
                The frontend application foundation is ready.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  </main>
`;
