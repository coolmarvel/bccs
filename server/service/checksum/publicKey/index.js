const baobab = require("../../../blockchain/klaytn/testnet");
const { logger } = require("../../../utils/winston");

const isValidPublicKey = (publicKey) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await baobab.utils.isValidPublicKey(publicKey);
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
