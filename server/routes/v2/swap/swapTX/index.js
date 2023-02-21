const router = require("express").Router();

const { logger } = require("../../../../utils/winston");

router.post("/tx", async (req, res) => {
  try {
    const { from, to, value } = req.body;
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
