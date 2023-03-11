const router = require("express").Router();
const axios = require("axios");

const { logger } = require("../../../../utils/winston");

router.post("/test", async (req, res) => {
  try {
    const unsupported = await axios
      .get("https://gateway.ipfs.io/ipns/unsupportedtokens.uniswap.org")
      .then((response) => response.data);

    const tokens = await axios
      .get("https://gateway.ipfs.io/ipns/tokens.uniswap.org")
      .then((response) => response.data);

    res.send({ tokens });
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
