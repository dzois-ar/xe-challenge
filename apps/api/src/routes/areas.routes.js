const router = require("express").Router();
const { getAreas } = require("../controllers/areas.controller");

/**
 * Returns suggestions from upstream API (cached).
 */
router.get("/", getAreas);

module.exports = router;
