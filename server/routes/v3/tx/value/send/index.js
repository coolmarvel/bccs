const router = require("express").Router();

const { ECPairFactory } = require("ecpair");
const { BIP32Factory } = require("bip32");
const bitcoin = require("bitcoinjs-lib");
const ecc = require("tiny-secp256k1");
const ECPair = ECPairFactory(ecc);
const bip32 = BIP32Factory(ecc);
const bip39 = require("bip39");
const bip65 = require("bip65");
const axios = require("axios");

const { logger } = require("../../../../../utils/winston");

const isValidChainId = require("../../../../../service/chainId");

router.post("/", async (req, res) => {
  try {
    const { address, amount, username, password } = req.body;
    const chainId = await isValidChainId(req);

    const body = {
      jsonrpc: "1.0",
      method: "sendtoaddress",
      id: "curltest",
      params: {
        address: address,
        amount: amount,
      },
    };

    const txid = await axios
      .post("http://127.0.0.1:18443/", body, {
        auth: { username: username, password: password },
      })
      .then((response) => {
        return response.data.result;
      });

    res.send({ txid });
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

// const body = {
//   jsonrpc: "1.0",
//   method: "sendtoaddress",
//   id: "curltext",
//   parameter: [address, amount, "donation", "seans outpost"],
// };
// const result = await axios
//   .post("http://127.0.0.1:18443/", body, {
//     auth: { username: username, password: password },
//   })
//   .then((res) => {
//     return res.data.result;
//   });
// res.send({ result });
