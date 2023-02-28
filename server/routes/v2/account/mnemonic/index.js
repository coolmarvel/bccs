const router = require("express").Router();

const bip39 = require("bip39");

const { logger } = require("../../../../utils/winston");

router.post("/mnemonic", (req, res) => {
  try {
    const mnemonic = bip39.generateMnemonic();

    res.send({ mnemonic: mnemonic });
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
