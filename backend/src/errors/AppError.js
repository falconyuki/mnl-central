export class AppError extends Error {
  constructor(
    message,
    { code, statusCode = 500, details = null, cause = null } = {},
  ) {
    super(message);

    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.cause = cause;

    Error.captureStackTrace?.(this, AppError);
  }
}
