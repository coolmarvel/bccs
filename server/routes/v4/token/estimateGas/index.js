const router = require("express").Router();

const { logger } = require("../../../../utils/winston");

const isValidChainId = require("../../../../service/chainId");
const isValidAddress = require("../../../../service/checksum/address");
const isValidPrivateKey = require("../../../../service/checksum/privateKey");
const estimatedGas = require("../../../../service/estimateGas/tokenTransfer");

router.post("/estimate", async (req, res) => {
  try {
    const { fromAddress, fromPrivateKey, toAddress, contractAddress, value } =
      req.body;

    await isValidAddress(toAddress);
    await isValidAddress(fromAddress);
    await isValidPrivateKey(fromPrivateKey);

    const chainId = await isValidChainId(req);

    const result = await estimatedGas(
      chainId,
      fromAddress,
      fromPrivateKey,
      toAddress,
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
