const { z } = require("zod");

/** Query param schema for /areas */
const areasQuerySchema = z.object({
  input: z.string().min(1, "input is required")
});

module.exports = { areasQuerySchema };
