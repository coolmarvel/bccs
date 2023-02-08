const router = require("express").Router();

const { logger } = require("../../../../../utils/winston");

const isValidChainId = require("../../../../../service/chainId");

const axios = require("axios");
const qrcode = require("qrcode");

router.get("/", async (req, res) => {
  try {
    const { address } = req.body;
    const chainId = await isValidChainId(req);

    qrcode.toString(
      "1EgdZo8hReMD4guF5gNURhoch9rvo2MAuN",
      { type: "terminal" },
      (err, code) => {
        if (err) {
          return res.status(400).send({ message: err.message });
        } else {
          console.log(code);
        }
      }
    );

    qrcode.toDataURL("1EgdZo8hReMD4guF5gNURhoch9rvo2MAuN", (err, url) => {
      if (err) {
        return res.status(400).send({ message: err.message });
      } else {
        console.log(url);
      }
    });

    res.send({ address, chainId });
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
