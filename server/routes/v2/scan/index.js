const router = require("express").Router();

const { logger } = require("../../../utils/winston");

const scanTX = require("../../../service/scanTX");
const isValidChainId = require("../../../service/chainId");
const isValidAddress = require("../../../service/checksum/address");

router.post("/", async (req, res) => {
  try {
    const { address, page } = req.body;

    const chainId = await isValidChainId(req);
    await isValidAddress(address);

    const result = await scanTX(chainId, address, page);

    res.send(result);
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
