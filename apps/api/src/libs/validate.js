/**
 * Validate incoming data using Zod schemas.
 * Throws ApiError(400) with details, handled by global error middleware.
 */
const { ApiError } = require("./errors");

function validate(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ApiError(400, "Validation error", result.error.flatten());
  }
  return result.data;
}

module.exports = { validate };
