const { ApiError } = require("../libs/errors");
const adsRepo = require("../repositories/ads.repo");

/**
 * Service layer: business rules.
 * For now it's small, but it keeps architecture clean and testable.
 */
async function create(payload) {
  return adsRepo.create(payload);
}

async function getById(id) {
  const ad = await adsRepo.getById(id);
  if (!ad) throw new ApiError(404, "Ad not found");
  return ad;
}

module.exports = { create, getById };

