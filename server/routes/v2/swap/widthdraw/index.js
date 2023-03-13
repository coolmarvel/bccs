const router = require("express").Router();

const { logger } = require("../../../../utils/winston");

const withdraw = require("../../../../service/swap/withdraw");
const isValidChainId = require("../../../../service/chainId");
const isValidPrivateKey = require("../../../../service/checksum/privateKey");

router.post("/widthdraw", async (req, res) => {
  try {
    const { token, privateKey, amount } = req.body;

    await isValidChainId(req);
    await isValidPrivateKey(privateKey);

    const receipt = await withdraw(token, privateKey, amount);

    res.send({ receipt });
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
