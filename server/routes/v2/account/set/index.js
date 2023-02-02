const router = require("express").Router();

const { logger } = require("../../../../utils/winston");

const baobab = require("../../../../blockchain/klaytn/testnet");

const isValidPrivateKey = require("../../../../service/checksum/privateKey");

router.post("/set", async (req, res) => {
  try {
    const { privateKey, keystore, password } = req.body;

    if (privateKey) {
      const publicKey = await isValidPrivateKey(privateKey);
      const account = await baobab.klay.accounts.privateKeyToAccount(
        privateKey
      );
      const address = account.address;

      res.send({ address, privateKey, publicKey });
    } else if (privateKey === undefined && keystore && password) {
      const account = await baobab.klay.accounts.decrypt(keystore, password);
      const address = account.address;
      const privateKey = account.privateKey;
      const publicKey = await isValidPrivateKey(privateKey);

      res.send({ address, privateKey, publicKey });
    }
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes("Invalid privateKey")) {
      res.status(400).send({ message: error.message });
    } else if (error.message.includes("Key derivation failed")) {
      res.status(400).send({ message: error.message });
    } else {
      res.status(404).send({ message: error.message });
    }
  }
});

module.exports = router;
