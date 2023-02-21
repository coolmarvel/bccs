const router = require("express").Router();

const { logger } = require("../../../utils/winston");

const getPriceRouter = require("./getPrice");
const getQuoteRouter = require("./getQuote");
const swapTXRouter = require("./swapTX");

router.use("/", getPriceRouter);
router.use("/", getQuoteRouter);
router.use("/", swapTXRouter);

module.exports = router;

router.post("/", async (req, res) => {
  try {
    const { from, to, value } = req.body;

    // const accounts = await ganache.eth.accounts.wallet.add(privateKey);

    // let currentTrade = {};
    // let currentSelectSide = {};
    // let tokens = await axios
    //   .get("https://tokens.coingecko.com/uniswap/all.json")
    //   .then((response) => {
    //     return response.data.tokens;
    //   });

    res.send({ price, quote });
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});
