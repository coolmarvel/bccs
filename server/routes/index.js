const router = require("express").Router();

const { logger } = require("../utils/winston");

router.get("/", (req, res) => {
  try {
    res.send({ message: "server-client connected" });
  } catch (error) {
    logger.error(error.message);
    res.send({ message: error.message });
  }
});

const v1Router = require("./v1");
const v2Router = require("./v2"); // ethereum
const v3Router = require("./v3"); // bitcoin
const v4Router = require("./v4"); // eos

router.use("/v1", v1Router);
router.use("/v2", v2Router);
router.use("/v3", v3Router);
router.use("/v4", v4Router);

module.exports = router;
