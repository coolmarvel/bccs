const router = require("express").Router();

const { logger } = require("../../../../utils/winston");

const isValidChainId = require("../../../../service/chainId");
const getBalance = require("../../../../service/swap/getWrapTokenBalance");
const isValidPrivateKey = require("../../../../service/checksum/privateKey");

router.post("/get", async (req, res) => {
  try {
    const { token, privateKey } = req.body;
    const chainId = await isValidChainId(req);
    await isValidPrivateKey(privateKey);

    const balance = await getBalance(chainId, token, privateKey);

    res.send({ balance });
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
