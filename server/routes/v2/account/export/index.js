const router = require("express").Router();

const { logger } = require("../../../../utils/winston");

const isValidPrivateKey = require("../../../../service/checksum/privateKey");
const exportWallet = require("../../../../service/wallet/ethereum/export");

router.post("/export", async (req, res) => {
  try {
    const { privateKey, password } = req.body;

    await isValidPrivateKey(privateKey);

    const keystore = await exportWallet(privateKey, password);

    res.send({ password, keystore });
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
