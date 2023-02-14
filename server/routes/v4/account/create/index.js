const router = require("express").Router();

const { logger } = require("../../../../utils/winston");

const createWallet = require("../../../../service/wallet/eos/create");

router.post("/create", async (req, res) => {
  try {
    const { mnemonic } = req.body;

    await createWallet(mnemonic);

    res.send({ message: true });
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
