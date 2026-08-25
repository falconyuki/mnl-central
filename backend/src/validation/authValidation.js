export function validateLoginRequest(req, res, next) {
  const { username, password } = req.body ?? {};
  if (typeof username !== "string" || username.trim().length === 0) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Username is required",
      },
    });
  }

  if (typeof password !== "string" || password.length === 0) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Password is required",
      },
    });
  }
  req.body.username = username.trim();
  next();
}

export function validateChangePasswordRequest(req, res, next) {
  const { currentPassword, newPassword } = req.body ?? {};
  if (typeof currentPassword !== "string" || currentPassword.length === 0) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Current password is required",
      },
    });
  }

  if (typeof newPassword !== "string" || newPassword.length === 0) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "New password is required",
      },
    });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "New password must be at least 8 characters",
      },
    });
  }
  next();
}
