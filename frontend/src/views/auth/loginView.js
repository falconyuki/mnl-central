import { login } from "../../services/index.js";

export function renderLoginView(container, { onAuthenticated } = {}) {
  container.innerHTML = `
    <main class="min-vh-100 d-flex align-items-center bg-body-tertiary">
      <div class="container py-5">
        <div class="row justify-content-center">
          <div class="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">
            <section class="card border-0 shadow-sm">
              <div class="card-body p-4 p-md-5">
                <div class="text-center mb-4">
                  <div
                    class="text-primary fs-1 mb-3"
                    aria-hidden="true"
                  >
                    <i class="bi bi-grid-1x2-fill"></i>
                  </div>

                  <h1 class="h3 mb-2">MNL-Central</h1>

                  <p class="text-body-secondary mb-0">
                    Sign in to continue
                  </p>
                </div>

                <div
                  id="login-error"
                  class="alert alert-danger d-none"
                  role="alert"
                ></div>

                <form id="login-form" novalidate>
                  <div class="mb-3">
                    <label
                      for="login-username"
                      class="form-label"
                    >
                      Username
                    </label>

                    <input
                      type="text"
                      class="form-control"
                      id="login-username"
                      name="username"
                      autocomplete="username"
                      required
                    />
                  </div>

                  <div class="mb-4">
                    <label
                      for="login-password"
                      class="form-label"
                    >
                      Password
                    </label>

                    <input
                      type="password"
                      class="form-control"
                      id="login-password"
                      name="password"
                      autocomplete="current-password"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    class="btn btn-primary w-100"
                    id="login-submit"
                  >
                    <span
                      class="spinner-border spinner-border-sm me-2 d-none"
                      id="login-spinner"
                      aria-hidden="true"
                    ></span>

                    <span id="login-submit-text">Sign In</span>
                  </button>
                </form>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  `;

  const form = container.querySelector("#login-form");
  const usernameInput = container.querySelector("#login-username");
  const passwordInput = container.querySelector("#login-password");
  const submitButton = container.querySelector("#login-submit");
  const spinner = container.querySelector("#login-spinner");
  const submitText = container.querySelector("#login-submit-text");
  const errorContainer = container.querySelector("#login-error");

  function setLoading(isLoading) {
    submitButton.disabled = isLoading;
    usernameInput.disabled = isLoading;
    passwordInput.disabled = isLoading;

    spinner.classList.toggle("d-none", !isLoading);
    submitText.textContent = isLoading ? "Signing in..." : "Sign In";
  }

  function showError(message) {
    errorContainer.textContent = message;
    errorContainer.classList.remove("d-none");
  }

  function clearError() {
    errorContainer.textContent = "";
    errorContainer.classList.add("d-none");
  }

  function getValidationError() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username) {
      return "Username is required.";
    }

    if (!password) {
      return "Password is required.";
    }

    return null;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    clearError();

    const validationError = getValidationError();

    if (validationError) {
      showError(validationError);
      return;
    }

    setLoading(true);

    try {
      const result = await login(
        usernameInput.value.trim(),
        passwordInput.value,
      );

      if (typeof onAuthenticated === "function") {
        onAuthenticated(result.user);
      }
    } catch (error) {
      showError(error?.message || "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  });
}
