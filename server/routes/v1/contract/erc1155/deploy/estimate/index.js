const router = require("express").Router();

const { logger } = require("../../../../../../utils/winston");

const isValidChainId = require("../../../../../../service/chainId");
const isValidPrivateKey = require("../../../../../../service/checksum/privateKey");
const estimateGas = require("../../../../../../service/estimateGas/deployContract");

router.post("/estimate", async (req, res) => {
  try {
    const { privateKey, abi, bytecode } = req.body;

    const chainId = await isValidChainId(req);
    await isValidPrivateKey(privateKey);

    const result = await estimateGas(chainId, abi, bytecode, privateKey);
    res.send(result);
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

const fdRouter = require("./feeDelegate");

router.use("/fd", fdRouter);

module.exports = router;
