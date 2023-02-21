const router = require("express").Router();

const { logger } = require("../../../../utils/winston");

const getPrice = require("../../../../service/swap/getPrice");

router.get("/price", async (req, res) => {
  try {
    const { from, to, value } = req.body;

    const price = await getPrice(from, to, value);

    res.send(price);
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
