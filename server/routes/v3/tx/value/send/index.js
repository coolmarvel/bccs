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

const regtestUtils = require("../../../../../service/regTest");

router.post("/", async (req, res) => {
  try {
    const { privateKey } = req.body;

    const keypair = ECPair.fromWIF(privateKey);
    const { address } = bitcoin.payments.p2pkh({
      pubkey: keypair.publicKey,
    });
    const wallet = { address: address, privateKey: privateKey };

    res.send({ message: true });
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
