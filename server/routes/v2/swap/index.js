const router = require("express").Router();

const { logger } = require("../../../utils/winston");

const axios = require("axios");
const qs = require("qs");

router.post("/", async (req, res) => {
  try {
    const { privateKey, amountIn } = req.body;

    const accounts = await ganache.eth.accounts.wallet.add(privateKey);

    let currentTrade = {};
    let currentSelectSide = {};
    let tokens = await axios
      .get("https://tokens.coingecko.com/uniswap/all.json")
      .then((response) => {
        return response.data.tokens;
      });

    res.send({ tokens });
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
