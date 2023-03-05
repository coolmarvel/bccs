const router = require("express").Router();

const { logger } = require("../../../utils/winston");

const scan = require("../../../service/scan");
const isValidChainId = require("../../../service/chainId");
const isValidAddress = require("../../../service/checksum/address");

router.post("/", async (req, res) => {
  try {
    const { address } = req.body;

    const chainId = await isValidChainId(req);
    await isValidAddress(address);

    const result = await scan(chainId, address);

    res.send(result);
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
