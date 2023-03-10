const router = require("express").Router();

const { logger } = require("../../../../../utils/winston");

const isValidChainId = require("../../../../../service/chainId");
const isValidAddress = require("../../../../../service/checksum/address");
const isValidPrivateKey = require("../../../../../service/checksum/privateKey");
const estimateGas = require("../../../../../service/estimateGas/tokenTransfer/feeDelegate");

router.post("/estimate", async (req, res) => {
  try {
    const {
      value,
      toAddress,
      contractAddress,
      fromAddress,
      fromPrivateKey,
      feePayAddress,
      feePayPrivateKey,
    } = req.body;

    const chainId = await isValidChainId(req);
    await isValidPrivateKey(feePayPrivateKey);
    await isValidPrivateKey(fromPrivateKey);
    await isValidAddress(feePayAddress);
    await isValidAddress(fromAddress);
    await isValidAddress(toAddress);

    const result = await estimateGas(
      chainId,
      fromAddress,
      fromPrivateKey,
      toAddress,
      feePayAddress,
      feePayPrivateKey,
      contractAddress,
      value
    );

    res.send(result);
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
