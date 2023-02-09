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
      parameter: [],
    };

    const uxtos = await axios
      .post("http://127.0.0.1:18443/", body, {
        auth: { username: username, password: password },
        params: { wallet_name: "/Users/security/Desktop/bitcoin/wallet/test1" },
      })
      .then((response) => {
        return response.data.result;
      });

    res.send({ uxtos });
  } catch (error) {
    logger.error(error.message);
    res.send({ message: error });
  }
});

module.exports = router;
