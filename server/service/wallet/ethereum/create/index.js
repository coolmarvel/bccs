const { hdkey } = require("ethereumjs-wallet");
const bip39 = require("bip39");

const { logger } = require("../../../../utils/winston");

const createWallet = (mnemonic) => {
  return new Promise(async (resolve, reject) => {
    try {
      // 니모닉 없을 때 (니모닉 임의 생성)
      if (mnemonic === undefined) {
        const mnemonic = bip39.generateMnemonic();
        const seed = await bip39.mnemonicToSeed(mnemonic);
        const root = hdkey.fromMasterSeed(seed);
        const wallet = root.derivePath("m/44'/60'/0'/0/0").getWallet();

        const address = wallet.getAddressString();
        const publicKey = wallet.getPublicKeyString();
        const privateKey = wallet.getPrivateKeyString();

        const result = {
          hdPath: "m/44'/60'/0'/0/0",
          address: address,
          privateKey: privateKey,
          publicKey: publicKey,
          seedPhrase: mnemonic,
        };

        resolve(result);
      }
      // 니모닉 있을 때
      else if (mnemonic) {
        const seed = await bip39.mnemonicToSeed(mnemonic);
        const root = hdkey.fromMasterSeed(seed);
        const wallet = root.derivePath("m/44'/60'/0'/0/0").getWallet();

        const address = wallet.getAddressString();
        const publicKey = wallet.getPublicKeyString();
        const privateKey = wallet.getPrivateKeyString();

        const result = {
          hdPath: "m/44'/60'/0'/0/0",
          address: address,
          privateKey: privateKey,
          publicKey: publicKey,
          seedPhrase: mnemonic,
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
