const router = require("express").Router();

const { logger } = require("../../../../utils/winston");

const addNetwork = require("../../../../service/rpcURL/add");

router.post("/add", async (req, res) => {
  try {
    const { url } = req.body;

    const chains = await addNetwork(url);
    logger.info(chains);

    res.send(chains);
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;

// const axios = require("axios");
// const { hexToDecimal } = require("../../../../utils/converter");

// const body = {
//   id: "",
//   jsonrpc: "2.0",
//   method: "eth_chainId",
//   params: [],
// };

// await axios
//   .post("https://testnet.gather.network", body)
//   .then((response) => {
//     console.log("data: ", hexToDecimal(response.data.result));
//   });
