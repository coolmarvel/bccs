const router = require("express").Router();

const { logger } = require("../../../../../utils/winston");

const { ECPairFactory } = require("ecpair");
const { BIP32Factory } = require("bip32");
const bitcoin = require("bitcoinjs-lib");
const ecc = require("tiny-secp256k1");
const ECPair = ECPairFactory(ecc);
const bip32 = BIP32Factory(ecc);
const bip39 = require("bip39");
const bip65 = require("bip65");

const axios = require("axios");

router.post("/", async (req, res) => {
  try {
    const { address, amount, username, password } = req.body;

    const body = {
      jsonrpc: "1.0",
      method: "sendtoaddress",
      id: "curltext",
      parameter: [address, amount, "donation", "seans outpost"],
    };

    const result = await axios.post("http://127.0.0.1:18443/", body, {
      auth: { username: username, password: password },
    });

    res.send({ message: result.data.result });
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

const toOutputScript = (address) => {
  return bitcoin.address.toOutputScript(address);
};

const idToHash = (txid) => {
  return Buffer.from(txid, "hex").reverse();
};

module.exports = router;
