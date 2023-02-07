const { ECPairFactory } = require("ecpair");
const { BIP32Factory } = require("bip32");
const bitcoin = require("bitcoinjs-lib");
const ecc = require("tiny-secp256k1");
const ECPair = ECPairFactory(ecc);
const bip32 = BIP32Factory(ecc);
const bip39 = require("bip39");

const { logger } = require("../../../../utils/winston");

const setWallet = async (mnemonic, privateKey) => {
  return new Promise((resolve, reject) => {
    try {
      if (mnemonic && privateKey === undefined) {
        const isValidMnemonic = bip39.validateMnemonic(mnemonic);
        const network = bitcoin.networks.bitcoin;

        if (isValidMnemonic) {
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

          const result = {
            address: address,
            privateKey: privateKey,
            publicKey: publicKey,
            mnemonic: mnemonic,
          };

          resolve(result);
        } else {
          return reject({ message: "Invalid mnemonic" });
        }
      } else if (privateKey && mnemonic === undefined) {
        const keypair = privateKeyToKeyPair(privateKey);
        const { address } = bitcoin.payments.p2pkh({
          pubkey: keypair.publicKey,
        });
        const publicKey = keypair.publicKey.toString("hex");
        const result = {
          address: address,
          privateKe: privateKey,
          publicKey: publicKey,
        };
        resolve(result);
      }
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

const privateKeyToKeyPair = (privateKey) => {
  const keypair = ECPair.fromWIF(privateKey);
  return keypair;
};

module.exports = setWallet;
