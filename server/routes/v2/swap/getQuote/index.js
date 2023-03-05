const router = require("express").Router();

const { logger } = require("../../../../utils/winston");

const getQuote = require("../../../../service/swap/getQuote");

router.post("/quote", async (req, res) => {
  try {
    const { from, to, address, value } = req.body;

    const quote = await getQuote(from, to, value, address);
    res.send(quote);
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
