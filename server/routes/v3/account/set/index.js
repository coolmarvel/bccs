const router = require("express").Router();

const { logger } = require("../../../../utils/winston");

const setWallet = require("../../../../service/wallet/bitcoin/set");

router.post("/set", async (req, res) => {
  try {
    const { mnemonic, privateKey } = req.body;

    const result = await setWallet(mnemonic, privateKey);

    res.send(result);
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
