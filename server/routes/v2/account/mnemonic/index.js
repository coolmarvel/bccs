const router = require("express").Router();

const Mnemonic = require("eth-lightwallet/node_modules/bitcore-mnemonic");

const { logger } = require("../../../../utils/winston");

router.post("/mnemonic", (req, res) => {
  try {
    const entropy = new Mnemonic(Mnemonic.Words.ENGLISH);
    const seedPhrase = entropy.toString();

    res.send({ mnemonic: seedPhrase });
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
