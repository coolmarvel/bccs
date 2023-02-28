const router = require("express").Router();

const { logger } = require("../../../../utils/winston");

const createWallet = require("../../../../service/wallet/ethereum/create");

router.post("/create", async (req, res) => {
  try {
    const { mnemonic, password } = req.body;

    const { address, privateKey, publicKey, seedPhrase, pwd, keystore } =
      await createWallet(mnemonic, password);
    const result = {
      address: address,
      privateKey: privateKey,
      publicKey: publicKey,
      mnemonic: seedPhrase,
      password: pwd,
      keystore: keystore,
    };

    res.send(result);
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
