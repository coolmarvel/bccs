const getCaver = require("../../../getCaver");

const exportWallet = (privateKey, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const caver = await getCaver("1001");

      const keystore = await caver.klay.accounts.encryptV3(
        privateKey,
        password
      );

      resolve(keystore);
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = exportWallet;
