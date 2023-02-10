const router = require("express").Router();
const axios = require("axios");

const { logger } = require("../../../../../utils/winston");

const isValidChainId = require("../../../../../service/chainId");

router.get("/", async (req, res) => {
  try {
    const { username, password } = req.body;
    await isValidChainId(req);

    const body = {
      jsonrpc: "1.0",
      method: "getbalance",
      id: "curltext",
      parameter: [],
    };

    const balance = await axios
      .post("http://127.0.0.1:18443/", body, {
        auth: { username: username, password: password },
      })
      .then((response) => {
        return response.data.result;
      });

    res.send({ balance });
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
