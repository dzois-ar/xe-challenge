const { validate } = require("../libs/validate");
const { areasQuerySchema } = require("../schemas/areas.schema");
const areasService = require("../services/areas.service");

/**
 * GET /api/areas?input=...
 * Requirement: suggestions appear after the first 3 characters.
 */
async function getAreas(req, res, next) {
  try {
    const { input } = validate(areasQuerySchema, req.query);
    const trimmed = input.trim();

    // If less than 3 chars, return empty list (better UX than error).
    if (trimmed.length < 3) return res.json([]);

    const items = await areasService.autocomplete(trimmed);
    res.json(items);
  } catch (e) {
    next(e);
  }
}

module.exports = { getAreas };
