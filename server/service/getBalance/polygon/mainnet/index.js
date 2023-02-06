const provider = require("../../../../blockchain/polygon/mainnet");

const { logger } = require("../../../../utils/winston");

const polygonBalance = (address) => {
  return new Promise(async (resolve, reject) => {
    try {
      const polygon = await provider();
      const ret = await polygon.eth.getBalance(address);
      const balance = await polygon.utils.fromWei(ret);

      resolve(balance);
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = polygonBalance;
