const router = require("express").Router();
const axios = require("axios");

const { logger } = require("../../../../utils/winston");

router.post("/new", async (req, res) => {
  try {
    const { username, password } = req.body;

    const body = {
      jsonrpc: "1.0",
      method: "createwallet",
      id: "curltext",
      params: ["/Users/security/Desktop/bitcoin/wallet/test"],
    };

    const uxtos = await axios
      .post("http://127.0.0.1:18443/", body, {
        auth: { username: username, password: password },
      })
      .then((response) => {
        return response.data.result;
      });

    res.send({ uxtos });
  } catch (error) {
    logger.error(error.message);
    res.send({ message: error.message });
  }
});

module.exports = router;
