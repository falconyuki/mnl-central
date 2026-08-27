import { changePassword } from "../../services/index.js";

export function renderChangePasswordView(
  container,
  { user, onPasswordChanged } = {},
) {
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
                    <i class="bi bi-shield-lock-fill"></i>
                  </div>

                  <h1 class="h3 mb-2">Change Password</h1>

                  <p class="text-body-secondary mb-0">
                    ${
                      user?.displayName
                        ? `Welcome, ${user.displayName}.`
                        : "Please update your password to continue."
                    }
                  </p>
                </div>

                <div
                  id="change-password-error"
                  class="alert alert-danger d-none"
                  role="alert"
                ></div>

                <div
                  id="change-password-success"
                  class="alert alert-success d-none"
                  role="alert"
                ></div>

                <form id="change-password-form" novalidate>
                  <div class="mb-3">
                    <label
                      for="current-password"
                      class="form-label"
                    >
                      Current Password
                    </label>

                    <input
                      type="password"
                      class="form-control"
                      id="current-password"
                      name="currentPassword"
                      autocomplete="current-password"
                      required
                    />
                  </div>

                  <div class="mb-3">
                    <label
                      for="new-password"
                      class="form-label"
                    >
                      New Password
                    </label>

                    <input
                      type="password"
                      class="form-control"
                      id="new-password"
                      name="newPassword"
                      autocomplete="new-password"
                      required
                    />
                  </div>

                  <div class="mb-4">
                    <label
                      for="confirm-password"
                      class="form-label"
                    >
                      Confirm New Password
                    </label>

                    <input
                      type="password"
                      class="form-control"
                      id="confirm-password"
                      name="confirmPassword"
                      autocomplete="new-password"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    class="btn btn-primary w-100"
                    id="change-password-submit"
                  >
                    <span
                      class="spinner-border spinner-border-sm me-2 d-none"
                      id="change-password-spinner"
                      aria-hidden="true"
                    ></span>

                    <span id="change-password-submit-text">
                      Change Password
                    </span>
                  </button>
                </form>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  `;

  const form = container.querySelector("#change-password-form");
  const currentPasswordInput = container.querySelector("#current-password");
  const newPasswordInput = container.querySelector("#new-password");
  const confirmPasswordInput = container.querySelector("#confirm-password");
  const submitButton = container.querySelector("#change-password-submit");
  const spinner = container.querySelector("#change-password-spinner");
  const submitText = container.querySelector("#change-password-submit-text");
  const errorContainer = container.querySelector("#change-password-error");
  const successContainer = container.querySelector("#change-password-success");

  function setLoading(isLoading) {
    submitButton.disabled = isLoading;
    currentPasswordInput.disabled = isLoading;
    newPasswordInput.disabled = isLoading;
    confirmPasswordInput.disabled = isLoading;

    spinner.classList.toggle("d-none", !isLoading);
    submitText.textContent = isLoading
      ? "Changing Password..."
      : "Change Password";
  }

  function showError(message) {
    errorContainer.textContent = message;
    errorContainer.classList.remove("d-none");
  }

  function clearError() {
    errorContainer.textContent = "";
    errorContainer.classList.add("d-none");
  }

  function showSuccess(message) {
    successContainer.textContent = message;
    successContainer.classList.remove("d-none");
  }

  function clearSuccess() {
    successContainer.textContent = "";
    successContainer.classList.add("d-none");
  }

  function getValidationError() {
    const currentPassword = currentPasswordInput.value;
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!currentPassword) {
      return "Current password is required.";
    }

    if (!newPassword) {
      return "New password is required.";
    }

    if (!confirmPassword) {
      return "Please confirm your new password.";
    }

    if (newPassword !== confirmPassword) {
      return "New passwords do not match.";
    }

    return null;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    clearError();
    clearSuccess();

    const validationError = getValidationError();

    if (validationError) {
      showError(validationError);
      return;
    }

    setLoading(true);

    try {
      await changePassword(currentPasswordInput.value, newPasswordInput.value);

      showSuccess("Password changed successfully.");

      form.reset();

      if (typeof onPasswordChanged === "function") {
        onPasswordChanged();
      }
    } catch (error) {
      showError(
        error?.message || "Unable to change your password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  });
}
