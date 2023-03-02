const router = require("express").Router();

const { logger } = require("../../../../../../../utils/winston");

const isValidChainId = require("../../../../../../../service/chainId");
const isValidPrivateKey = require("../../../../../../../service/checksum/privateKey");
const feeDelegateEstimateGas = require("../../../../../../../service/estimateGas/deployContract/feeDelegate");

router.post("/estimate", async (req, res) => {
  try {
    const { abi, bytecode, fromPrivateKey, feePayPrivateKey } = req.body;

    const chainId = await isValidChainId(req);
    await isValidPrivateKey(feePayPrivateKey);
    await isValidPrivateKey(fromPrivateKey);

    const result = await feeDelegateEstimateGas(
      chainId,
      abi,
      bytecode,
      fromPrivateKey,
      feePayPrivateKey
    );

    res.send(result);
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
