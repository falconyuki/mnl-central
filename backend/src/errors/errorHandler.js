import { AppError } from "./AppError.js";
import { ERROR_CODES } from "./errorCodes.js";

export function errorHandler(error, req, res, _next) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    });
  }

  console.error("Unhandled application error:", error);
  return res.status(500).json({
    success: false,
    error: {
      code: ERROR_CODES.SYSTEM_ERROR,
      message: "An unexpected error occurred",
    },
  });
}
