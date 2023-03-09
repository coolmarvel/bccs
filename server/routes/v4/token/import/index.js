const router = require("express").Router();

const { logger } = require("../../../../utils/winston");

const isValidChainId = require("../../../../service/chainId");
const importToken = require("../../../../service/importToken");
const isValidAddress = require("../../../../service/checksum/address");

router.post("/import", async (req, res) => {
  try {
    const { address, contractAddress } = req.body;

    await isValidAddress(address);
    const chainId = await isValidChainId(req);

    const result = await importToken(chainId, contractAddress, address);

    res.send(result);
  } catch (error) {
    logger.error(error.message);
    if (
      error.message.includes("Returned values aren't valid") ||
      error.message.includes("the capitalization checksum test failed")
    ) {
      res.status(400).send({ message: "Invalid contractAddress" });
    } else if (error.message.includes("Invalid address")) {
      res.status(400).send({ message: "Invalid address" });
    } else if (error.message.includes("chainId required")) {
      res.status(412).send({ message: "chainId required" });
    } else if (error.message.includes("Unsupported chainId")) {
      res.status(416).send({ message: "Unsupported chainId" });
    } else {
      res.status(404).send({ message: error.message });
    }
  }
});

module.exports = router;
