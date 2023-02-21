const router = require("express").Router();
const axios = require("axios");

const { logger } = require("../../../../utils/winston");

router.get("/tokens", async (req, res) => {
  try {
    const result = await axios
      .get("https://tokens.coingecko.com/uniswap/all.json")
      .then((response) => {
        const result = {
          timestamp: response.data.timestamp,
          tokens: response.data.tokens,
        };
        return result;
      });
    res.send(result);
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
