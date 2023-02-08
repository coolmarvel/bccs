const baobab = require("../../../../blockchain/klaytn/testnet");

const { logger } = require("../../../../utils/winston");

const isValidPrivateKey = require("../../../checksum/privateKey");

const setWallet = (privateKey, keystore, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (privateKey && keystore === undefined && password === undefined) {
        console.log("up");
        const publicKey = await isValidPrivateKey(privateKey);
        const account = await baobab.klay.accounts.privateKeyToAccount(
          privateKey
        );
        const address = account.address;

        const result = {
          address: address,
          privateKey: privateKey,
          publicKey: publicKey,
        };
        resolve(result);
      } else if (keystore && password && privateKey === undefined) {
        console.log("down");
        const account = await baobab.klay.accounts.decrypt(keystore, password);
        const address = account.address;
        const private = account.privateKey;
        const publicKey = await isValidPrivateKey(private);

        const result = {
          address: address,
          privateKey: private,
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

module.exports = setWallet;
