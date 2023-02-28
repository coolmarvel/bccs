const router = require("express").Router();

const { logger } = require("../../../../../utils/winston");

const isValidChainId = require("../../../../../service/chainId");
const valueTransfer = require("../../../../../service/valueTransfer");
const isValidAddress = require("../../../../../service/checksum/address");
const isValidPrivateKey = require("../../../../../service/checksum/privateKey");

router.post("/", async (req, res) => {
  try {
    const { fromAddress, fromPrivateKey, toAddress, value } = req.body;

    const chainId = await isValidChainId(req);
    await isValidPrivateKey(fromPrivateKey);
    await isValidAddress(fromAddress);
    await isValidAddress(toAddress);

    const receipt = await valueTransfer(
      chainId,
      fromAddress,
      fromPrivateKey,
      toAddress,
      value
    );
    res.send({ receipt });
  } catch (error) {
    logger.error(error.message);
    res.send({ message: error.message });
  }
});

module.exports = router;
