const router = require("express").Router();

const { logger } = require("../../../../utils/winston");

const isValidChainId = require("../../../../service/chainId");
const importToken = require("../../../../service/importToken");

router.post("/import", async (req, res) => {
  try {
    const { contractAddress } = req.body;

    const chainId = await isValidChainId(req);
    const result = await importToken(chainId, contractAddress);

    res.send({ message: true });
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
