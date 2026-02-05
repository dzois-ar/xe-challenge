/**
 * Shared contracts (schemas/DTOs) used by BOTH frontend and backend.
 */
const { z } = require("zod");

/** Allowed ad types (must match backend + DB enum) */
const AdTypeEnum = z.enum(["Rent", "Buy", "Exchange", "Donation"]);

/**
 * Payload sent by frontend when creating an ad.
 * - title: max 155 chars (requirement)
 * - area.placeId: REQUIRED (requirement)
 * - price: integer >= 0 (requirement "numbers only")
 */
const CreateAdSchema = z.object({
  title: z.string().min(1).max(155),
  type: AdTypeEnum,
  area: z.object({
    placeId: z.string().min(1),
    label: z.string().min(1) // label for display 
  }),
  price: z.number().int().nonnegative(),
  description: z.string().max(5000).optional().or(z.literal("")),
});

module.exports = { AdTypeEnum, CreateAdSchema };
