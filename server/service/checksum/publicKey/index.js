const getCaver = require("../../getCaver");
const { logger } = require("../../../utils/winston");

const isValidPublicKey = (publicKey) => {
  return new Promise(async (resolve, reject) => {
    try {
      const caver = await getCaver("1001");
      const result = await caver.utils.isValidPublicKey(publicKey);
      logger.info(publicKey + " isValidPublicKey " + result);

      if (result) {
        resolve(true);
      } else if (!result) {
        logger.error("Invalid PublicKey " + publicKey);
        return reject({ message: "Invalid publicKey" });
      }
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = isValidPublicKey;
