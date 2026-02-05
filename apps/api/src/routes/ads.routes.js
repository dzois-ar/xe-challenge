const router = require("express").Router();
const { createAd, getAdById } = require("../controllers/ads.controller");

/**
 * POST /api/ads  -> creates and stores an ad in Postgres
 * GET  /api/ads/:id -> fetch persisted ad (bonus show page)
 */
router.post("/", createAd);
router.get("/:id", getAdById);

module.exports = router;
