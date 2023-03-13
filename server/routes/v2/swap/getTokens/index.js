const router = require("express").Router();
const axios = require("axios");

const { logger } = require("../../../../utils/winston");

const isValidChainId = require("../../../../service/chainId");

router.post("/tokens", async (req, res) => {
  try {
    const { symbol } = req.body;
    const chainId = await isValidChainId(req);

    const token = await axios
      // .get("https://tokens.coingecko.com/uniswap/all.json")
      .get("https://gateway.ipfs.io/ipns/tokens.uniswap.org")
      .then((response) => {
        let result;
        response.data.tokens.map((v) => {
          if (v.chainId == chainId && v.symbol == symbol.toUpperCase()) {
            result = v;
          }
        });
        return result;
      });
    res.send({ token });
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
