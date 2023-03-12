const router = require("express").Router();
const axios = require("axios");

const { logger } = require("../../../../utils/winston");

const isValidChainId = require("../../../../service/chainId");

router.post("/test", async (req, res) => {
  try {
    const chainId = await isValidChainId(req);

    const tokens = await axios
      .get("https://gateway.ipfs.io/ipns/tokens.uniswap.org")
      .then((response) => {
        const tokens = response.data.tokens;
        let result = [];
        tokens.map((v) => {
          if (v.chainId == chainId) {
            result.push(v);
          }
        });
        return result;
      });

    res.send(tokens);
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
