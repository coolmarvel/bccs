const router = require("express").Router();

const { logger } = require("../../../../../../utils/winston");

const isValidChainId = require("../../../../../../service/chainId");
const isValidPrivateKey = require("../../../../../../service/checksum/privateKey");
const deployContractFeeDelegate = require("../../../../../../service/deployContract/feeDelegate");

router.post("/deploy", async (req, res) => {
  try {
    const { abi, bytecode, fromPrivateKey, feePayPrivateKey } = req.body;

    const chainId = await isValidChainId(req);
    await isValidPrivateKey(feePayPrivateKey);
    await isValidPrivateKey(fromPrivateKey);

    const receipt = await deployContractFeeDelegate(
      chainId,
      abi,
      bytecode,
      fromPrivateKey,
      feePayPrivateKey
    );

    res.send({ receipt });
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes("Invalid PrivateKey")) {
      res.status(400).send({ message: error.message });
    } else if (error.message.includes("chainId required")) {
      res.status(412).send({ message: error.message });
    } else if (error.message.includes("Unsupported chainId")) {
      res.status(416).send({ message: error.message });
    } else {
      res.status(404).send({ message: error.message });
    }
  }
});

module.exports = router;
