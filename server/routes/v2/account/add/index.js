const router = require("express").Router();

const { logger } = require("../../../../utils/winston");

const addWallet = require("../../../../service/wallet/ethereum/add");

router.post("/add", async (req, res) => {
  try {
    const { mnemonic, hdPath } = req.body;

    const result = await addWallet(mnemonic, hdPath);

    res.send(result);
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
