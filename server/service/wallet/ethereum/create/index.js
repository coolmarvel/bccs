const { hdkey } = require("ethereumjs-wallet");
const crypto = require("crypto");
const { v4 } = require("uuid");
const bip39 = require("bip39");

const getCaver = require("../../../getCaver");

const { logger } = require("../../../../utils/winston");

const createWallet = (mnemonic, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const caver = await getCaver("1001");

      const uuid = v4();
      const sha256_hex = crypto.createHash("sha256").update(uuid).digest("hex");

      // 니모닉 없을 때 (니모닉 및 비밀번호 임의 생성)
      if (mnemonic === undefined) {
        const mnemonic = bip39.generateMnemonic();
        const seed = await bip39.mnemonicToSeed(mnemonic);
        const root = hdkey.fromMasterSeed(seed);
        const wallet = root.derivePath("m/44'/60'/0'/0/0").getWallet();

        const address = wallet.getAddressString();
        const privateKey = wallet.getPrivateKeyString();
        const publicKey = await caver.klay.accounts.privateKeyToPublicKey(
          privateKey
        );
        const keystore = await caver.klay.accounts.encryptV3(
          privateKey,
          sha256_hex
        );

        const result = {
          address: address,
          privateKey: privateKey,
          publicKey: publicKey,
          seedPhrase: mnemonic,
          pwd: sha256_hex,
          keystore: keystore,
        };

        resolve(result);
      }
      // 니모닉 있고 비밀번호 없을 때 (비밀번호 임의 생성)
      else if (mnemonic && password === undefined) {
        const seed = await bip39.mnemonicToSeed(mnemonic);
        const root = hdkey.fromMasterSeed(seed);
        const wallet = root.derivePath("m/44'/60'/0'/0/0").getWallet();

        const address = wallet.getAddressString();
        const privateKey = wallet.getPrivateKeyString();
        const publicKey = await caver.klay.accounts.privateKeyToPublicKey(
          privateKey
        );
        const keystore = await caver.klay.accounts.encryptV3(
          privateKey,
          sha256_hex
        );

        const result = {
          address: address,
          privateKey: privateKey,
          publicKey: publicKey,
          seedPhrase: mnemonic,
          pwd: sha256_hex,
          keystore: keystore,
        };

        resolve(result);
      }
      // 니모닉 및 비밀번호 둘 다 있을 때
      else if (mnemonic && password) {
        const seed = await bip39.mnemonicToSeed(mnemonic);
        const root = hdkey.fromMasterSeed(seed);
        const wallet = root.derivePath("m/44'/60'/0'/0/0").getWallet();

        const address = wallet.getAddressString();
        const privateKey = wallet.getPrivateKeyString();
        const publicKey = await caver.klay.accounts.privateKeyToPublicKey(
          privateKey
        );
        const keystore = await caver.klay.accounts.encryptV3(
          privateKey,
          password
        );

        const result = {
          address: address,
          privateKey: privateKey,
          publicKey: publicKey,
          seedPhrase: mnemonic,
          pwd: password,
          keystore: keystore,
        };

        resolve(result);
      }
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = createWallet;
