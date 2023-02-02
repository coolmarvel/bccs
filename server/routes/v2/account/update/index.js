const router = require("express").Router();
const { logger } = require("../../../../utils/winston");

const baobab = require("../../../../blockchain/klaytn/testnet");

router.post("/update", async (req, res) => {
  try {
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
