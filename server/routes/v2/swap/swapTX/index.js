const router = require("express").Router();

const { logger } = require("../../../../utils/winston");

const swapTX = require("../../../../service/swap/tx");
const getQuote = require("../../../../service/swap/getQuote");

router.post("/tx", async (req, res) => {
  try {
    const { from, to, value, privateKey } = req.body;

    const result = await getQuote(from, to, value);
    const receipt = await swapTX(from, result, privateKey);

    res.send({ message: true });
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
