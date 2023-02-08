const router = require("express").Router();

const { logger } = require("../../../../utils/winston");

const isValidChainId = require("../../../../service/chainId");
const createWallet = require("../../../../service/wallet/bitcoin/create");

router.post("/create", async (req, res) => {
  try {
    const { mnemonic } = req.body;
    const chainId = await isValidChainId(req);

    const result = await createWallet(mnemonic, chainId);
    res.send(result);
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
