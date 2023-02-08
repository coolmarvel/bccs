const { ECPairFactory } = require("ecpair");
const { BIP32Factory } = require("bip32");
const bitcoin = require("bitcoinjs-lib");
const ecc = require("tiny-secp256k1");
const ECPair = ECPairFactory(ecc);
const bip32 = BIP32Factory(ecc);
const bip39 = require("bip39");

const { logger } = require("../../../../utils/winston");

const setWallet = async (mnemonic, privateKey, chainId) => {
  return new Promise((resolve, reject) => {
    try {
      if (chainId == "BTC") {
        const network = bitcoin.networks.bitcoin;
        const path = "m/44'/0'/0'/0/0";

        if (mnemonic && privateKey === undefined) {
          const isValidMnemonic = bip39.validateMnemonic(mnemonic);

          if (isValidMnemonic) {
            const seed = bip39.mnemonicToSeedSync(mnemonic);
            const root = bip32.fromSeed(seed);
            const child = root.derivePath(path);
            const p2pkh = bitcoin.payments.p2pkh({
              pubkey: child.publicKey,
              network: network,
            }).address; // base58
            const p2wpkh = bitcoin.payments.p2wpkh({
              pubkey: child.publicKey,
            }).address; // bech32
            const p2sh = bitcoin.payments.p2sh({
              redeem: bitcoin.payments.p2wpkh({ pubkey: child.publicKey }),
            }).address; // base58
            const publicKey = child.publicKey.toString("hex");
            const privateKey = child.toWIF();

            const result = {
              address: { p2pkh, p2wpkh, p2sh },
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
          const p2pkh = bitcoin.payments.p2pkh({
            pubkey: keypair.publicKey,
            network: network,
          }).address; // base58
          const p2wpkh = bitcoin.payments.p2wpkh({
            pubkey: keypair.publicKey,
          }).address; // bech32
          const p2sh = bitcoin.payments.p2sh({
            redeem: bitcoin.payments.p2wpkh({ pubkey: keypair.publicKey }),
          }).address; // base58
          const publicKey = keypair.publicKey.toString("hex");

          const result = {
            address: { p2pkh, p2wpkh, p2sh },
            privateKey: privateKey,
            publicKey: publicKey,
            mnemonic: mnemonic,
          };

          resolve(result);
        }
      } else if (chainId == "BTCTEST") {
        const network = bitcoin.networks.testnet;
        const path = "m/44'/1'/0'/0/0";

        if (mnemonic && privateKey === undefined) {
          const isValidMnemonic = bip39.validateMnemonic(mnemonic);

          if (isValidMnemonic) {
            const seed = bip39.mnemonicToSeedSync(mnemonic);
            const root = bip32.fromSeed(seed);
            const child = root.derivePath(path);
            const p2pkh = bitcoin.payments.p2pkh({
              pubkey: child.publicKey,
              network: network,
            }).address; // base58
            const p2wpkh = bitcoin.payments.p2wpkh({
              pubkey: child.publicKey,
            }).address; // bech32
            const p2sh = bitcoin.payments.p2sh({
              redeem: bitcoin.payments.p2wpkh({ pubkey: child.publicKey }),
            }).address; // base58
            const publicKey = child.publicKey.toString("hex");
            const privateKey = child.toWIF();

            const result = {
              address: { p2pkh, p2wpkh, p2sh },
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
          const p2pkh = bitcoin.payments.p2pkh({
            pubkey: keypair.publicKey,
            network: network,
          }).address; // base58
          const p2wpkh = bitcoin.payments.p2wpkh({
            pubkey: keypair.publicKey,
          }).address; // bech32
          const p2sh = bitcoin.payments.p2sh({
            redeem: bitcoin.payments.p2wpkh({ pubkey: keypair.publicKey }),
          }).address; // base58
          const publicKey = keypair.publicKey.toString("hex");

          const result = {
            address: { p2pkh, p2wpkh, p2sh },
            privateKey: privateKey,
            publicKey: publicKey,
            mnemonic: mnemonic,
          };

          resolve(result);
        }
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
