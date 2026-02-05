const { validate } = require("../libs/validate");
const { createAdSchema, adIdParamsSchema } = require("../schemas/ads.schema");
const adsService = require("../services/ads.service");

/**
 * POST /api/ads
 * Saves ad to Postgres and returns created object + id.
 */
async function createAd(req, res, next) {
  try {
    const payload = validate(createAdSchema, req.body);
    const created = await adsService.create(payload);
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
}

/**
 * GET /api/ads/:id
 * Returns persisted ad .
 */
async function getAdById(req, res, next) {
  try {
    const { id } = validate(adIdParamsSchema, req.params);
    const ad = await adsService.getById(id);
    res.json(ad);
  } catch (e) {
    next(e);
  }
}

module.exports = { createAd, getAdById };
