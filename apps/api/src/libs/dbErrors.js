/**
 * Translate Postgres errors (pg) to API-friendly errors.
 * This keeps the rest of the app clean and consistent.
 */
const { ApiError } = require("./errors");

// Postgres error codes reference:
// 23514 = check_violation
// 23505 = unique_violation
// 23503 = foreign_key_violation
// 22P02 = invalid_text_representation (e.g. invalid UUID)
function translatePgError(err) {
  // CHECK constraint violations
  if (err?.code === "23514") {
    // Map by constraint name (because you named them explicitly in SQL)
    switch (err.constraint) {
      case "ads_type_chk":
        return new ApiError(
          400,
          "Validation error",
          { field: "type", message: "type must be one of: Rent, Buy, Exchange, Donation" }
        );

      case "ads_price_non_negative_chk":
        return new ApiError(
          400,
          "Validation error",
          { field: "price", message: "price must be >= 0" }
        );

      default:
        // Fallback for other CHECK constraints (if you add more later)
        return new ApiError(400, "Validation error", {
          message: "Database constraint violation",
          constraint: err.constraint
        });
    }
  }

  // Example: invalid uuid string passed where uuid is expected
  if (err?.code === "22P02") {
    return new ApiError(400, "Validation error", {
      message: "Invalid input format"
    });
  }

  // Unique violations if you add unique indexes later
  if (err?.code === "23505") {
    return new ApiError(409, "Conflict", {
      message: "Duplicate value violates unique constraint",
      constraint: err.constraint
    });
  }

  // Foreign key violations (if you add FK later)
  if (err?.code === "23503") {
    return new ApiError(409, "Conflict", {
      message: "Referenced record does not exist",
      constraint: err.constraint
    });
  }

  return null; // not a recognized PG error
}

module.exports = { translatePgError };
