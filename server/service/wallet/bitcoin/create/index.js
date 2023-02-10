const { ECPairFactory } = require("ecpair");
const { BIP32Factory } = require("bip32");
const bitcoin = require("bitcoinjs-lib");
const ecc = require("tiny-secp256k1");
const ECPair = ECPairFactory(ecc);
const bip32 = BIP32Factory(ecc);
const bip39 = require("bip39");

const { logger } = require("../../../../utils/winston");

const createWallet = async (mnemonic, chainId) => {
  return new Promise((resolve, reject) => {
    try {
      const isValidMnemonic = bip39.validateMnemonic(mnemonic);

      // 비트코인 메인넷
      if (chainId == "BTC") {
        const network = bitcoin.networks.bitcoin;
        const path = "m/44'/0'/0'/0/0";

        // 복구키 임의로 생성 후 지갑 생성
        if (mnemonic === undefined) {
          const mnemonic = bip39.generateMnemonic();
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
        }
        // 전달 받은 복구키로 지갑 생성
        else {
          if (isValidMnemonic) {
            const entropy = bip39.mnemonicToEntropy(mnemonic);
            const seed = bip39.mnemonicToSeedSync(mnemonic);
            const root = bip32.fromSeed(seed);
            const xprivMaster = root.toBase58();
            const privKeyMaster = root.privateKey.toString("hex");
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

            console.log(entropy);
            const walletJSON = {
              mnemonic: mnemonic,
              seed: seed,
            };
            resolve(result);
          } else {
            return reject({ message: "Invalid mnemonic" });
          }
        }
      }
      // 비트코인 테스트넷
      else if (chainId == "BTCTEST") {
        const network = bitcoin.networks.testnet;
        const path = "m/44'/1'/0'/0/0";

        // 복구키 임의로 생성 후 지갑 생성
        if (mnemonic === undefined) {
          const mnemonic = bip39.generateMnemonic();
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
        }
        // 전달 받은 복구키로 지갑 생성
        else {
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

        // 복구키 임의로 생성 후 지갑 생성
        if (mnemonic === undefined) {
          const mnemonic = bip39.generateMnemonic();
          const seed = bip39.mnemonicToSeedSync(mnemonic);
          const root = bip32.fromSeed(seed);
          const child = root.derivePath(path);
          const p2pkh = bitcoin.payments.p2pkh({
            pubkey: child.publicKey,
            network: LITECOIN,
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
        }
        // 전달 받은 복구키로 지갑 생성
        else {
          if (isValidMnemonic) {
            const seed = bip39.mnemonicToSeedSync(mnemonic);
            const root = bip32.fromSeed(seed, LITECOIN);
            const child = root.derivePath(path);
            const p2pkh = bitcoin.payments.p2pkh({
              pubkey: child.publicKey,
              network: LITECOIN,
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
          }
        }
      }
      // REGTEST
      else if (chainId == "REGTEST") {
        const network = bitcoin.networks.regtest;
        const path = "m/44'/1'/0'/0/0";

        // 복구키 임의로 생성 후 지갑 생성
        if (mnemonic === undefined) {
          const mnemonic = bip39.generateMnemonic();
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
        }
        // 전달 받은 복구키로 지갑 생성
        else {
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
        }
      } else {
        return reject({ message: "Not supported chainId" });
      }
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = createWallet;
