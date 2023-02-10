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
    const { address } = req.body;

    const bitpay = await axios
      .get(
        `https://api.bitcore.io/api/BTC/testnet/address/${address}/txs?limit=1000`
      )
      .then((res) => {
        return res.data;
      });

    const blockcypher = await axios
      .get(
        `https://api.blockcypher.com/v1/btc/test3/addrs/${address}/full?limit=50?unspentOnly=true&includeScript=true`
      )
      .then((res) => {
        return res.data;
      });

    res.send({ bitpay, blockcypher });
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
