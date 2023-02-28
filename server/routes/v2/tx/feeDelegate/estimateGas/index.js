const router = require("express").Router();

const { logger } = require("../../../../../utils/winston");

const isValidChainId = require("../../../../../service/chainId");
const isValidAddress = require("../../../../../service/checksum/address");
const isValidPrivateKey = require("../../../../../service/checksum/privateKey");
const feeDelegateEstimateGas = require("../../../../../service/estimateGas/valueTransfer/feeDelegate");

router.post("/estimate", async (req, res) => {
  try {
    const {
      value,
      toAddress,
      fromAddress,
      fromPrivateKey,
      feePayAddress,
      feePayPrivateKey,
    } = req.body;

    const chainId = await isValidChainId(req);
    await isValidAddress(toAddress);
    await isValidAddress(fromAddress);
    await isValidAddress(feePayAddress);
    await isValidPrivateKey(fromPrivateKey);
    await isValidPrivateKey(feePayPrivateKey);

    const result = await feeDelegateEstimateGas(
      chainId,
      fromAddress,
      fromPrivateKey,
      toAddress,
      feePayAddress,
      feePayPrivateKey,
      value
    );

    res.send(result);
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes("chainId required")) {
      res.status(403).send({ message: error.message });
    } else {
      res.status(404).send({ message: error.message });
    }
  }
});

module.exports = router;
