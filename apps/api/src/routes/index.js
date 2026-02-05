/**
 * API router aggregator.
 */
const router = require("express").Router();

router.use("/areas", require("./areas.routes"));
router.use("/ads", require("./ads.routes"));

module.exports = router;
