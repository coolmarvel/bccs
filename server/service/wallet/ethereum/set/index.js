const { logger } = require("../../../../utils/winston");

const getCaver = require("../../../getCaver");
const isValidPrivateKey = require("../../../checksum/privateKey");

const setWallet = (privateKey, keystore, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const caver = await getCaver("1001");
      // 비밀키로 지갑등록할 때
      if (privateKey && keystore === undefined && password === undefined) {
        const publicKey = await isValidPrivateKey(privateKey);
        const account = await caver.klay.accounts.privateKeyToAccount(
          privateKey
        );
        const address = account.address;

        const result = {
          address: address,
          privateKey: privateKey,
          publicKey: publicKey,
        };
        resolve(result);
      } 
      // 키스토어 및 비밀번호로 지갑등록할 때
      else if (keystore && password && privateKey === undefined) {
        const account = await caver.klay.accounts.decrypt(keystore, password);
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
