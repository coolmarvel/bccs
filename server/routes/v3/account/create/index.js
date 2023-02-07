const router = require("express").Router();

const { logger } = require("../../../../utils/winston");

const createWallet = require("../../../../service/wallet/bitcoin/create");

router.post("/create", async (req, res) => {
  try {
    const { mnemonic } = req.body;

    if (mnemonic === undefined) {
      const { address, privateKey, publicKey, mnemonic } = await createWallet();
      res.send({ address, privateKey, publicKey, mnemonic });
    } else if (mnemonic) {
      const { address, privateKey, publicKey, seedPhrase } = await createWallet(
        mnemonic
      );
      res.send({ address, privateKey, publicKey, mnemonic: seedPhrase });
    }
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
