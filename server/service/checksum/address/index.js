const getCaver = require("../../getCaver");

const { logger } = require("../../../utils/winston");

const isValidAddress = (address) => {
  return new Promise(async (resolve, reject) => {
    try {
      const caver = await getCaver("1001");
      const result = await caver.utils.isAddress(address);
      logger.info(address + " isValidAddress " + result);

      if (result) {
        resolve(result);
      } else if (!result) {
        logger.error("Invalid Address" + address);
        return reject({ message: "Invalid address" });
      }
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = isValidAddress;
