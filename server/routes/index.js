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
const v2Router = require("./v2");

router.use("/v1", v1Router);
router.use("/v2", v2Router);

module.exports = router;
