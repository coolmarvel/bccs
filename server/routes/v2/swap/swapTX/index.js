const router = require("express").Router();

const { logger } = require("../../../../utils/winston");

const swapTx = require("../../../../service/swap/tx");
const isValidChainId = require("../../../../service/chainId");
const isValidAddress = require("../../../../service/checksum/address");
const isValidPrivateKey = require("../../../../service/checksum/privateKey");

router.post("/tx", async (req, res) => {
  try {
    const { address, privateKey, fromToken, toToken, amount } = req.body;

    const chainId = parseInt(await isValidChainId(req));
    await isValidPrivateKey(privateKey);
    await isValidAddress(address);

    const result = await swapTx(
      chainId,
      address,
      privateKey,
      fromToken,
      toToken,
      amount
    );

    res.send(result);
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
