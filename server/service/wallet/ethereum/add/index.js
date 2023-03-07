const bip39 = require("bip39");
const { hdkey } = require("ethereumjs-wallet");

const addWallet = (mnemonic, hdPath) => {
  return new Promise(async (resolve, reject) => {
    try {
      const seed = await bip39.mnemonicToSeed(mnemonic);
      const root = hdkey.fromMasterSeed(seed);
      const wallet = root.derivePath(hdPath).getWallet();

      const address = wallet.getAddressString();
      const publicKey = wallet.getPublicKeyString();
      const privateKey = wallet.getPrivateKeyString();

      const result = {
        address: address,
        privateKey: privateKey,
        publicKey: publicKey,
      };

      resolve(result);
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = addWallet;
