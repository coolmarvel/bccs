const router = require("express").Router();

const { logger } = require("../../../../../utils/winston");

const getBalance = require("../../../../../service/getBalance");
const isValidChainId = require("../../../../../service/chainId");
const isValidAddress = require("../../../../../service/checksum/address");

router.get("/", async (req, res) => {
  try {
    const { address } = req.body;

    const chainId = await isValidChainId(req);
    await isValidAddress(address);

    const balance = await getBalance(chainId, address);

    res.send({ balance });
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes("Invalid address")) {
      res.status(400).send({ message: error.message });
    } else if (error.message.includes("chainId required")) {
      res.status(403).send({ message: error.message });
    } else {
      res.status(404).send({ message: error.message });
    }
  }
});

module.exports = router;
