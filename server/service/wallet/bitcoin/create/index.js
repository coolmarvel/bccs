const { ECPairFactory } = require("ecpair");
const { BIP32Factory } = require("bip32");
const bitcoin = require("bitcoinjs-lib");
const ecc = require("tiny-secp256k1");
const ECPair = ECPairFactory(ecc);
const bip32 = BIP32Factory(ecc);
const bip39 = require("bip39");

const { logger } = require("../../../../utils/winston");

const createWallet = async (mnemonic) => {
  return new Promise((resolve, reject) => {
    try {
      const network = bitcoin.networks.bitcoin;

      if (mnemonic === undefined) {
        const mnemonic = bip39.generateMnemonic();
        const seed = bip39.mnemonicToSeedSync(mnemonic);
        const root = bip32.fromSeed(seed, network);
        const account = root.derivePath(`m/49'/0'/0'/0'`);
        const node = account.derive(0).derive(0);
        const { address } = bitcoin.payments.p2pkh({
          pubkey: node.publicKey,
          network: network,
        });
        const publicKey = node.publicKey.toString("hex");
        const privateKey = node.toWIF();

        resolve({ address, privateKey, publicKey, mnemonic: mnemonic });
      } else {
        const seed = bip39.mnemonicToSeedSync(mnemonic);
        const root = bip32.fromSeed(seed, network);
        const account = root.derivePath(`m/49'/0'/0'/0'`);
        const node = account.derive(0).derive(0);
        const { address } = bitcoin.payments.p2pkh({
          pubkey: node.publicKey,
          network: network,
        });
        const publicKey = node.publicKey.toString("hex");
        const privateKey = node.toWIF();

        resolve({ address, privateKey, publicKey, seedPhrase: mnemonic });
      }
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

// const privateKeyToKeyPair = (privateKey) => {
//   const keypair = ECPair.fromWIF(privateKey);
//   const { address } = bitcoin.payments.p2pkh({ pubkey: keypair.publicKey });
//   console.log(address);
// };

// privateKeyToKeyPair(privateKey);

module.exports = createWallet;
