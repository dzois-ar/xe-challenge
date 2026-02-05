const { z } = require("zod");
const { CreateAdSchema } = require("@xe/shared");

/**
 * Body schema for POST /ads
 * Imported from shared to keep FE/BE aligned.
 */
const createAdSchema = CreateAdSchema;

/** Params schema for GET /ads/:id */
const adIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

module.exports = { createAdSchema, adIdParamsSchema };
