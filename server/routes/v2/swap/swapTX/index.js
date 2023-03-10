const router = require("express").Router();

const { logger } = require("../../../../utils/winston");

const swapTX = require("../../../../service/swap/tx");
const getQuote = require("../../../../service/swap/getQuote");

router.post("/tx", async (req, res) => {
  try {
    const { from, to, value, address, privateKey } = req.body;

    const quote = await getQuote(from, to, value, address);
    const receipt = await swapTX(from, quote, privateKey);

    res.send(receipt);
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
