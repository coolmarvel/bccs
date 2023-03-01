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
    res.send({ message: error.message });
  }
});

module.exports = router;
