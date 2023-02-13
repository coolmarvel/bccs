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
    if (error.message.includes("Invalid mnemonic")) {
      res.status(400).send({ message: error.message });
    } else if (error.message.includes("chainId required")) {
      res.status(412).send({ message: error.message });
    } else if (error.message.includes("Unsupported chainId")) {
      res.status(416).send({ message: error.message });
    } else {
      res.status(400).send({ message: error.message });
    }
  }
});

module.exports = router;
