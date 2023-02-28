const router = require("express").Router();

const { logger } = require("../../../../../utils/winston");

const isValidChainId = require("../../../../../service/chainId");
const isValidAddress = require("../../../../../service/checksum/address");
const isValidPrivateKey = require("../../../../../service/checksum/privateKey");

const estimateGas = require("../../../../../service/estimateGas/valueTransfer");

router.post("/estimate", async (req, res) => {
  try {
    const { fromAddress, fromPrivateKey, toAddress, value } = req.body;

    const chainId = await isValidChainId(req);
    await isValidPrivateKey(fromPrivateKey);
    await isValidAddress(fromAddress);
    await isValidAddress(toAddress);

    const result = await estimateGas(
      chainId,
      fromAddress,
      fromPrivateKey,
      toAddress,
      value
    );

    res.send(result);
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes("chainId required")) {
      res.status(412).send({ message: error.message });
    } else if (
      error.message.includes("Invalid address") ||
      error.message.includes("Invalid privateKey")
    ) {
      res.status(400).send({ message: error.message });
    } else if (error.message.includes("Unsupported chainId")) {
      res.status(416).send({ message: error.message });
    } else {
      res.status(404).send({ message: error.message });
    }
  }
});

module.exports = router;
