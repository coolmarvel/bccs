const router = require("express").Router();
const crypto = require("crypto");

const { logger } = require("../../../../utils/winston");

const createWallet = require("../../../../service/wallet");

const baobab = require("../../../../blockchain/klaytn/testnet");

const { PASSWORD } = process.env;

router.post("/create", async (req, res) => {
  try {
    const { mnemonic, password } = req.body;

    const sha256_hex = crypto
      .createHash("sha256")
      .update(PASSWORD)
      .digest("hex");

    if (mnemonic === undefined) {
      const { address, privateKey, seedPhrase } = await createWallet();
      const prefixPrivateKey = await baobab.utils.addHexPrefix(privateKey);
      const keystore = await baobab.klay.accounts.encryptV3(
        prefixPrivateKey,
        sha256_hex
      );

      res.send({
        address,
        privateKey: prefixPrivateKey,
        mnemonic: seedPhrase,
        password: sha256_hex,
        keystore,
      });
    } else if (mnemonic && password === undefined) {
      const { address, privateKey, seedPhrase } = await createWallet(
        mnemonic,
        sha256_hex
      );
      const prefixPrivateKey = await baobab.utils.addHexPrefix(privateKey);
      const keystore = await baobab.klay.accounts.encryptV3(
        prefixPrivateKey,
        sha256_hex
      );

      res.send({
        address,
        privateKey: prefixPrivateKey,
        mnemonic: seedPhrase,
        password: sha256_hex,
        keystore,
      });
    } else if (mnemonic && password) {
      const { address, privateKey, seedPhrase } = await createWallet(
        mnemonic,
        password
      );
      const prefixPrivateKey = await baobab.utils.addHexPrefix(privateKey);
      const keystore = await baobab.klay.accounts.encryptV3(
        prefixPrivateKey,
        password
      );

      res.send({
        address,
        privateKey: prefixPrivateKey,
        mnemonic: seedPhrase,
        password,
        keystore,
      });
    }
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
