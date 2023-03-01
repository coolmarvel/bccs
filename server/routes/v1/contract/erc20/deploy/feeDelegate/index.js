const router = require("express").Router();

const { logger } = require("../../../../../../utils/winston");

router.post("/deploy", async (req, res) => {
  try {
    res.send({ message: true });
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
