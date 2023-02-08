const router = require("express").Router();

const { logger } = require("../../../../../utils/winston");

const isValidChainId = require("../../../../../service/chainId");

const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    const { address } = req.body;
    const chainId = await isValidChainId(req);

    const balance = await axios
      .get("https://testnet.blockexplorer.com/api/addr/" + address + "/balance")
      .then((response) => {
        console.log(response);
      });

    res.send({ address, chainId });
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
