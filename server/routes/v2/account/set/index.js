const router = require("express").Router();

const { logger } = require("../../../../utils/winston");

const setWallet = require("../../../../service/wallet/ethereum/set");

router.post("/set", async (req, res) => {
  try {
    const { privateKey, keystore, password } = req.body;

    const result = await setWallet(privateKey, keystore, password);
    res.send(result);
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
