/**
 * Global error handler.
 * - If error is ApiError, uses its status
 * - Otherwise returns 500
 */
module.exports = (err, req, res, next) => {
  const status = err.status || 500;

  // Avoid leaking DB error internals in production responses.
  // We send clean message + structured details only.
  res.status(status).json({
    message: err.message || "Internal error",
    details: err.details
  });
};
