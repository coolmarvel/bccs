const router = require("express").Router();
const axios = require("axios");

const { logger } = require("../../../../../utils/winston");

router.get("/utxos", async (req, res) => {
  try {
    const { index, username, password } = req.body;

    const body = {
      jsonrpc: "1.0",
      method: "listunspent",
      id: "curltext",
      params: [], // min confirmations, max confirmations [6, 99999]
    };

    const utxos = await axios
      .post("http://127.0.0.1:18443/", body, {
        auth: { username: username, password: password },
      })
      .then((response) => {
        return response.data.result;
      });

    res.send({ utxos });
  } catch (error) {
    logger.error(error.message);
    res.send({ message: error.message });
  }
});

module.exports = router;
