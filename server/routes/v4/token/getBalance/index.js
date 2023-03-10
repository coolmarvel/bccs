const router = require("express").Router();

const { logger } = require("../../../../utils/winston");

const isValidChainId = require("../../../../service/chainId");
const isValidAddress = require("../../../../service/checksum/address");
const getBalance = require("../../../../service/customToken/getBalance");

router.post("/balance", async (req, res) => {
  try {
    const { address, contractAddress } = req.body;

    const chainId = await isValidChainId(req);
    await isValidAddress(address);

    const balance = await getBalance(chainId, address, contractAddress);

    res.send({ balance });
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
