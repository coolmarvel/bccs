const router = require("express").Router();

const { logger } = require("../../../../utils/winston");

const addNetwork = require("../../../../service/rpcURL/add");
const isValidChainId = require("../../../../service/chainId");

router.post("/add", async (req, res) => {
  try {
    const { url } = req.body;

    const chains = await addNetwork(url);
    console.log(chains);

    res.send({ message: true });
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
