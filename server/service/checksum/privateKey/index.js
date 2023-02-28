const getCaver = require("../../getCaver");
const { logger } = require("../../../utils/winston");

const isValidPrivateKey = (privateKey) => {
  return new Promise(async (resolve, reject) => {
    try {
      const caver = await getCaver("1001");
      const result = await caver.utils.isValidPrivateKey(privateKey);
      logger.info(privateKey + " isValidPrivateKey " + result);

      if (result) {
        const publicKey = await caver.klay.accounts.privateKeyToPublicKey(
          privateKey
        );

        resolve(publicKey);
      } else if (!result) {
        logger.error("Invalid PrivateKey " + privateKey);
        return reject({ message: "Invalid privateKey" });
      }
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = isValidPrivateKey;
