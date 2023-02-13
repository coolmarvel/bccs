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
      // 비트코인 메인넷
      if (chainId == "BTC") {
        const network = bitcoin.networks.bitcoin;
        const path = "m/44'/0'/0'/0/0";

        // 니모닉o 비밀키x
        if (mnemonic && privateKey === undefined) {
          const isValidMnemonic = bip39.validateMnemonic(mnemonic);

          if (isValidMnemonic) {
            const entropy = bip39.mnemonicToEntropy(mnemonic);
            const seed = bip39.mnemonicToSeedSync(mnemonic);
            const root = bip32.fromSeed(seed); // =master
            const xprivRoot = root.toBase58();
            const privKeyRoot = root.privateKey.toString("hex");
            const wifRoot = root.toWIF();
            const xpubRoot = root.neutered().toBase58();
            const pubKeyRoot = root.publicKey.toString("hex");
            const pubKeyFingerprintRoot = bitcoin.crypto
              .hash160(root.publicKey)
              .slice(0, 4)
              .toString("hex");

            const child = root.derivePath(path);
            const xpriv = child.toBase58();
            const privKey = child.privateKey.toString("hex");
            const wif = child.toWIF();
            const xpub = child.neutered().toBase58();
            const pubKey = child.publicKey.toString("hex");
            const pubKeyHash = bitcoin.crypto
              .hash160(child.publicKey)
              .toString("hex");
            const pubKeyFingerprint = bitcoin.crypto
              .hash160(child.publicKey)
              .slice(0, 4)
              .toString("hex");
            const p2pkh = bitcoin.payments.p2pkh({
              pubkey: child.publicKey,
              network: network,
            }).address; // base58
            const p2wpkh = bitcoin.payments.p2wpkh({
              pubkey: child.publicKey,
              network: network,
            }).address; // bech32
            const p2sh = bitcoin.payments.p2sh({
              redeem: bitcoin.payments.p2wpkh({
                pubkey: child.publicKey,
                network: network,
              }),
              network: network,
            }).address; // base58

            logger.info("entropy: " + entropy);
            logger.info("mnemonic: " + mnemonic);
            logger.info("seed: " + seed.toString("hex"));
            logger.info("xprivRoot: " + xprivRoot);
            logger.info("privKeyRoot: " + privKeyRoot);
            logger.info("wifRoot: " + wifRoot);
            logger.info("xpubRoot: " + xpubRoot);
            logger.info("pubKeyRoot: " + pubKeyRoot);
            logger.info("pubKeyFingerprintRoot: " + pubKeyFingerprintRoot);

            logger.info("xpriv: " + xpriv);
            logger.info("privKey: " + privKey);
            logger.info("wif: " + wif);
            logger.info("xpub: " + xpub);
            logger.info("pubKey: " + pubKey);
            logger.info("pubKeyHash: " + pubKeyHash);
            logger.info("pubKeyFingerprint: " + pubKeyFingerprint);

            const result = {
              entropy: entropy,
              mnemonic: mnemonic,
              seed: seed.toString("hex"),
              xpriv: xpriv,
              privKey: privKey,
              wif: wif,
              xpub: xpub,
              pubKey: pubKey,
              pubKeyHash: pubKeyHash,
              pubKeyFingerprint: pubKeyFingerprint,
              p2pkh: p2pkh,
              p2wpkh: p2wpkh,
              p2sh: p2sh,
              path: path,
            };

            resolve(result);
          } else {
            return reject({ message: "Invalid mnemonic" });
          }
        }
        // 니모닉x 비밀키o
        else if (privateKey && mnemonic === undefined) {
          const keypair = privateKeyToKeyPair(privateKey);
          const privKey = keypair.privateKey.toString("hex");
          const wif = keypair.toWIF();
          const pubKey = keypair.publicKey.toString("hex");
          const pubKeyHash = bitcoin.crypto
            .hash160(keypair.publicKey)
            .toString("hex");
          const pubKeyFingerprint = bitcoin.crypto
            .hash160(keypair.publicKey)
            .slice(0, 4)
            .toString("hex");
          const p2pkh = bitcoin.payments.p2pkh({
            pubkey: keypair.publicKey,
            network: network,
          }).address; // base58
          const p2wpkh = bitcoin.payments.p2wpkh({
            pubkey: keypair.publicKey,
            network: network,
          }).address; // bech32
          const p2sh = bitcoin.payments.p2sh({
            redeem: bitcoin.payments.p2wpkh({
              pubkey: keypair.publicKey,
              network: network,
            }),
            network: network,
          }).address; // base58

          const result = {
            wif: wif,
            privKey: privKey,
            pubKey: pubKey,
            pubKeyHash: pubKeyHash,
            pubKeyFingerprint: pubKeyFingerprint,
            p2pkh: p2pkh,
            p2wpkh: p2wpkh,
            p2sh: p2sh,
            path: path,
          };
          resolve(result);
        }
      }
      // 비트코인 테스트넷
      else if (chainId == "BTCTEST") {
        const network = bitcoin.networks.testnet;
        const path = "m/44'/1'/0'/0/0";

        // 니모닉o 비밀키x
        if (mnemonic && privateKey === undefined) {
          const isValidMnemonic = bip39.validateMnemonic(mnemonic);

          if (isValidMnemonic) {
            const entropy = bip39.mnemonicToEntropy(mnemonic);
            const seed = bip39.mnemonicToSeedSync(mnemonic);
            const root = bip32.fromSeed(seed); // =master
            const xprivRoot = root.toBase58();
            const privKeyRoot = root.privateKey.toString("hex");
            const wifRoot = root.toWIF();
            const xpubRoot = root.neutered().toBase58();
            const pubKeyRoot = root.publicKey.toString("hex");
            const pubKeyFingerprintRoot = bitcoin.crypto
              .hash160(root.publicKey)
              .slice(0, 4)
              .toString("hex");

            const child = root.derivePath(path);
            const xpriv = child.toBase58();
            const privKey = child.privateKey.toString("hex");
            const wif = child.toWIF();
            const xpub = child.neutered().toBase58();
            const pubKey = child.publicKey.toString("hex");
            const pubKeyHash = bitcoin.crypto
              .hash160(child.publicKey)
              .toString("hex");
            const pubKeyFingerprint = bitcoin.crypto
              .hash160(child.publicKey)
              .slice(0, 4)
              .toString("hex");
            const p2pkh = bitcoin.payments.p2pkh({
              pubkey: child.publicKey,
              network: network,
            }).address; // base58
            const p2wpkh = bitcoin.payments.p2wpkh({
              pubkey: child.publicKey,
              network: network,
            }).address; // bech32
            const p2sh = bitcoin.payments.p2sh({
              redeem: bitcoin.payments.p2wpkh({
                pubkey: child.publicKey,
                network: network,
              }),
              network: network,
            }).address; // base58

            logger.info("entropy: " + entropy);
            logger.info("mnemonic: " + mnemonic);
            logger.info("seed: " + seed.toString("hex"));
            logger.info("xprivRoot: " + xprivRoot);
            logger.info("privKeyRoot: " + privKeyRoot);
            logger.info("wifRoot: " + wifRoot);
            logger.info("xpubRoot: " + xpubRoot);
            logger.info("pubKeyRoot: " + pubKeyRoot);
            logger.info("pubKeyFingerprintRoot: " + pubKeyFingerprintRoot);

            logger.info("xpriv: " + xpriv);
            logger.info("privKey: " + privKey);
            logger.info("wif: " + wif);
            logger.info("xpub: " + xpub);
            logger.info("pubKey: " + pubKey);
            logger.info("pubKeyHash: " + pubKeyHash);
            logger.info("pubKeyFingerprint: " + pubKeyFingerprint);

            const result = {
              entropy: entropy,
              mnemonic: mnemonic,
              seed: seed.toString("hex"),
              xpriv: xpriv,
              privKey: privKey,
              wif: wif,
              xpub: xpub,
              pubKey: pubKey,
              pubKeyHash: pubKeyHash,
              pubKeyFingerprint: pubKeyFingerprint,
              p2pkh: p2pkh,
              p2wpkh: p2wpkh,
              p2sh: p2sh,
              path: path,
            };

            resolve(result);
          } else {
            return reject({ message: "Invalid mnemonic" });
          }
        }
        // 니모닉x 비밀키o
        else if (privateKey && mnemonic === undefined) {
          const keypair = privateKeyToKeyPair(privateKey);
          const privKey = keypair.privateKey.toString("hex");
          const wif = keypair.toWIF();
          const pubKey = keypair.publicKey.toString("hex");
          const pubKeyHash = bitcoin.crypto
            .hash160(keypair.publicKey)
            .toString("hex");
          const pubKeyFingerprint = bitcoin.crypto
            .hash160(keypair.publicKey)
            .slice(0, 4)
            .toString("hex");
          const p2pkh = bitcoin.payments.p2pkh({
            pubkey: keypair.publicKey,
            network: network,
          }).address; // base58
          const p2wpkh = bitcoin.payments.p2wpkh({
            pubkey: keypair.publicKey,
            network: network,
          }).address; // bech32
          const p2sh = bitcoin.payments.p2sh({
            redeem: bitcoin.payments.p2wpkh({
              pubkey: keypair.publicKey,
              network: network,
            }),
            network: network,
          }).address; // base58

          const result = {
            wif: wif,
            privKey: privKey,
            pubKey: pubKey,
            pubKeyHash: pubKeyHash,
            pubKeyFingerprint: pubKeyFingerprint,
            p2pkh: p2pkh,
            p2wpkh: p2wpkh,
            p2sh: p2sh,
            path: path,
          };
          resolve(result);
        }
      }
      // 라이트코인
      else if (chainId == "LTC") {
        const LITECOIN = {
          messagePrefix: "\x19Litecoin Signed Message:\n",
          bech32: "ltc",
          bip32: {
            public: 0x019da462,
            private: 0x19d9cfe,
          },
          pubKeyHash: 0x30,
          scriptHash: 0x32,
          wif: 0xb0,
        };
        const path = "m/44'/0'/0'/0/0";

        // 니모닉o 비밀키x
        if (mnemonic && privateKey === undefined) {
          const isValidMnemonic = bip39.validateMnemonic(mnemonic);

          if (isValidMnemonic) {
            const entropy = bip39.mnemonicToEntropy(mnemonic);
            const seed = bip39.mnemonicToSeedSync(mnemonic);
            const root = bip32.fromSeed(seed); // =master
            const xprivRoot = root.toBase58();
            const privKeyRoot = root.privateKey.toString("hex");
            const wifRoot = root.toWIF();
            const xpubRoot = root.neutered().toBase58();
            const pubKeyRoot = root.publicKey.toString("hex");
            const pubKeyFingerprintRoot = bitcoin.crypto
              .hash160(root.publicKey)
              .slice(0, 4)
              .toString("hex");

            const child = root.derivePath(path);
            const xpriv = child.toBase58();
            const privKey = child.privateKey.toString("hex");
            const wif = child.toWIF();
            const xpub = child.neutered().toBase58();
            const pubKey = child.publicKey.toString("hex");
            const pubKeyHash = bitcoin.crypto
              .hash160(child.publicKey)
              .toString("hex");
            const pubKeyFingerprint = bitcoin.crypto
              .hash160(child.publicKey)
              .slice(0, 4)
              .toString("hex");
            const p2pkh = bitcoin.payments.p2pkh({
              pubkey: child.publicKey,
              network: LITECOIN,
            }).address; // base58
            const p2wpkh = bitcoin.payments.p2wpkh({
              pubkey: child.publicKey,
              network: LITECOIN,
            }).address; // bech32
            const p2sh = bitcoin.payments.p2sh({
              redeem: bitcoin.payments.p2wpkh({
                pubkey: child.publicKey,
                network: LITECOIN,
              }),
              network: LITECOIN,
            }).address; // base58

            logger.info("entropy: " + entropy);
            logger.info("mnemonic: " + mnemonic);
            logger.info("seed: " + seed.toString("hex"));
            logger.info("xprivRoot: " + xprivRoot);
            logger.info("privKeyRoot: " + privKeyRoot);
            logger.info("wifRoot: " + wifRoot);
            logger.info("xpubRoot: " + xpubRoot);
            logger.info("pubKeyRoot: " + pubKeyRoot);
            logger.info("pubKeyFingerprintRoot: " + pubKeyFingerprintRoot);

            logger.info("xpriv: " + xpriv);
            logger.info("privKey: " + privKey);
            logger.info("wif: " + wif);
            logger.info("xpub: " + xpub);
            logger.info("pubKey: " + pubKey);
            logger.info("pubKeyHash: " + pubKeyHash);
            logger.info("pubKeyFingerprint: " + pubKeyFingerprint);

            const result = {
              entropy: entropy,
              mnemonic: mnemonic,
              seed: seed.toString("hex"),
              xpriv: xpriv,
              privKey: privKey,
              wif: wif,
              xpub: xpub,
              pubKey: pubKey,
              pubKeyHash: pubKeyHash,
              pubKeyFingerprint: pubKeyFingerprint,
              p2pkh: p2pkh,
              p2wpkh: p2wpkh,
              p2sh: p2sh,
              path: path,
            };

            resolve(result);
          } else {
            return reject({ message: "Invalid mnemonic" });
          }
        }
        // 니모닉x 비밀키o
        else if (privateKey && mnemonic === undefined) {
          const keypair = privateKeyToKeyPair(privateKey);
          const privKey = keypair.privateKey.toString("hex");
          const wif = keypair.toWIF();
          const pubKey = keypair.publicKey.toString("hex");
          const pubKeyHash = bitcoin.crypto
            .hash160(keypair.publicKey)
            .toString("hex");
          const pubKeyFingerprint = bitcoin.crypto
            .hash160(keypair.publicKey)
            .slice(0, 4)
            .toString("hex");
          const p2pkh = bitcoin.payments.p2pkh({
            pubkey: keypair.publicKey,
            network: LITECOIN,
          }).address; // base58
          const p2wpkh = bitcoin.payments.p2wpkh({
            pubkey: keypair.publicKey,
            network: LITECOIN,
          }).address; // bech32
          const p2sh = bitcoin.payments.p2sh({
            redeem: bitcoin.payments.p2wpkh({
              pubkey: keypair.publicKey,
              network: LITECOIN,
            }),
            network: LITECOIN,
          }).address; // base58

          const result = {
            wif: wif,
            privKey: privKey,
            pubKey: pubKey,
            pubKeyHash: pubKeyHash,
            pubKeyFingerprint: pubKeyFingerprint,
            p2pkh: p2pkh,
            p2wpkh: p2wpkh,
            p2sh: p2sh,
            path: path,
          };
          resolve(result);
        }
      }
      // REGTEST
      else if (chainId == "REGTEST") {
        const network = bitcoin.networks.regtest;
        const path = "m/44'/1'/0'/0/0";

        // 니모닉o 비밀키x
        if (mnemonic && privateKey === undefined) {
          const isValidMnemonic = bip39.validateMnemonic(mnemonic);

          if (isValidMnemonic) {
            const entropy = bip39.mnemonicToEntropy(mnemonic);
            const seed = bip39.mnemonicToSeedSync(mnemonic);
            const root = bip32.fromSeed(seed); // =master
            const xprivRoot = root.toBase58();
            const privKeyRoot = root.privateKey.toString("hex");
            const wifRoot = root.toWIF();
            const xpubRoot = root.neutered().toBase58();
            const pubKeyRoot = root.publicKey.toString("hex");
            const pubKeyFingerprintRoot = bitcoin.crypto
              .hash160(root.publicKey)
              .slice(0, 4)
              .toString("hex");

            const child = root.derivePath(path);
            const xpriv = child.toBase58();
            const privKey = child.privateKey.toString("hex");
            const wif = child.toWIF();
            const xpub = child.neutered().toBase58();
            const pubKey = child.publicKey.toString("hex");
            const pubKeyHash = bitcoin.crypto
              .hash160(child.publicKey)
              .toString("hex");
            const pubKeyFingerprint = bitcoin.crypto
              .hash160(child.publicKey)
              .slice(0, 4)
              .toString("hex");
            const p2pkh = bitcoin.payments.p2pkh({
              pubkey: child.publicKey,
              network: network,
            }).address; // base58
            const p2wpkh = bitcoin.payments.p2wpkh({
              pubkey: child.publicKey,
              network: network,
            }).address; // bech32
            const p2sh = bitcoin.payments.p2sh({
              redeem: bitcoin.payments.p2wpkh({
                pubkey: child.publicKey,
                network: network,
              }),
              network: network,
            }).address; // base58

            logger.info("entropy: " + entropy);
            logger.info("mnemonic: " + mnemonic);
            logger.info("seed: " + seed.toString("hex"));
            logger.info("xprivRoot: " + xprivRoot);
            logger.info("privKeyRoot: " + privKeyRoot);
            logger.info("wifRoot: " + wifRoot);
            logger.info("xpubRoot: " + xpubRoot);
            logger.info("pubKeyRoot: " + pubKeyRoot);
            logger.info("pubKeyFingerprintRoot: " + pubKeyFingerprintRoot);

            logger.info("xpriv: " + xpriv);
            logger.info("privKey: " + privKey);
            logger.info("wif: " + wif);
            logger.info("xpub: " + xpub);
            logger.info("pubKey: " + pubKey);
            logger.info("pubKeyHash: " + pubKeyHash);
            logger.info("pubKeyFingerprint: " + pubKeyFingerprint);

            const result = {
              entropy: entropy,
              mnemonic: mnemonic,
              seed: seed.toString("hex"),
              xpriv: xpriv,
              privKey: privKey,
              wif: wif,
              xpub: xpub,
              pubKey: pubKey,
              pubKeyHash: pubKeyHash,
              pubKeyFingerprint: pubKeyFingerprint,
              p2pkh: p2pkh,
              p2wpkh: p2wpkh,
              p2sh: p2sh,
              path: path,
            };

            resolve(result);
          } else {
            return reject({ message: "Invalid mnemonic" });
          }
        }
        // 니모닉x 비밀키o
        else if (privateKey && mnemonic === undefined) {
          const keypair = privateKeyToKeyPair(privateKey);
          const privKey = keypair.privateKey.toString("hex");
          const wif = keypair.toWIF();
          const pubKey = keypair.publicKey.toString("hex");
          const pubKeyHash = bitcoin.crypto
            .hash160(keypair.publicKey)
            .toString("hex");
          const pubKeyFingerprint = bitcoin.crypto
            .hash160(keypair.publicKey)
            .slice(0, 4)
            .toString("hex");
          const p2pkh = bitcoin.payments.p2pkh({
            pubkey: keypair.publicKey,
            network: network,
          }).address; // base58
          const p2wpkh = bitcoin.payments.p2wpkh({
            pubkey: keypair.publicKey,
            network: network,
          }).address; // bech32
          const p2sh = bitcoin.payments.p2sh({
            redeem: bitcoin.payments.p2wpkh({
              pubkey: keypair.publicKey,
              network: network,
            }),
            network: network,
          }).address; // base58

          const result = {
            wif: wif,
            privKey: privKey,
            pubKey: pubKey,
            pubKeyHash: pubKeyHash,
            pubKeyFingerprint: pubKeyFingerprint,
            p2pkh: p2pkh,
            p2wpkh: p2wpkh,
            p2sh: p2sh,
            path: path,
          };
          resolve(result);
        }
      } else {
        return reject({ message: "Unsupported chainId" });
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
