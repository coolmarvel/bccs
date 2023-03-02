const router = require("express").Router();

const { logger } = require("../../../../../utils/winston");

const isValidChainId = require("../../../../../service/chainId");
const deployContract = require("../../../../../service/deployContract");
const isValidPrivateKey = require("../../../../../service/checksum/privateKey");

router.post("/deploy", async (req, res) => {
  try {
    const { abi, bytecode, privateKey } = req.body;

    await isValidPrivateKey(privateKey);
    const chainId = await isValidChainId(req);

    const receipt = await deployContract(chainId, abi, bytecode, privateKey);

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

const fdRouter = require("./feeDelegate");

router.use("/fd", fdRouter);

module.exports = router;
