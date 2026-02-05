/**
 * Standard API error with HTTP status code.
 */
class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}
module.exports = { ApiError };
