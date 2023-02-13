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
    const { address, wif } = req.body;
    const chainId = await isValidChainId(req);

    // const bitpay = await axios
    //   .get(
    //     `https://api.bitcore.io/api/BTC/testnet/address/${address}/txs?limit=1000`
    //   )
    //   .then((res) => {
    //     return res.data;
    //   });
    // const blockcypher = await axios
    //   .get(
    //     `https://api.blockcypher.com/v1/btc/test3/addrs/${address}/full?limit=50?unspentOnly=true&includeScript=true`
    //   )
    //   .then((res) => {
    //     return res.data;
    //   });
    // res.send({ bitpay, blockcypher });
    const network = bitcoin.networks.regtest;
    const keypair = ECPair.fromWIF(wif, network);
    const psbt = new bitcoin.Psbt({ network: network })
      .addInput({
        hash: "c0e1f48ef9bd41817ec1ffa63a3392258b5c7b16f698d2cd5874f5e06e71be5b", // TX_ID
        index: 0, // TX_OUT
        nonWitnessUtxo: Buffer.from(
          "02000000000101352f22875020b9a8335b669cff832f64aa8bfa6823c2f4368299a64af16821760000000000fdffffff0200e1f50500000000160014c63d7c16dbb7895438bbf522426c7ac326118bcd6f241a1e0100000016001437d32329e2616c4c5b0adde83395afd45443eabb0247304402202079552e3da695bab6314da9ac4856aa6944c1c4f86a62e0842ef95c23158cba02201c67bc859f7945c7d786eab8ac0b97542c5eab8cf3ba10914f509c692316ce52012103c67aef788e2a3a6111b9589e0b8de4532d4a3be34957816fc206e922d683e5d200000000",
          "hex"
        ), // TX_HEX
      })
      .addOutput({ address: address, value: 999e5 });

    res.send({ psbt });
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
