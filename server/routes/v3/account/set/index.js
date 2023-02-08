const router = require("express").Router();

const { logger } = require("../../../../utils/winston");

const isValidChainId = require("../../../../service/chainId");
const setWallet = require("../../../../service/wallet/bitcoin/set");

router.post("/set", async (req, res) => {
  try {
    const { mnemonic, privateKey } = req.body;
    const chainId = await isValidChainId(req);

    const result = await setWallet(mnemonic, privateKey, chainId);

    res.send(result);
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
