const provider = require("../../../../blockchain/binance/testnet");

const { logger } = require("../../../../utils/winston");

const bscTestBalance = (address) => {
  return new Promise(async (resolve, reject) => {
    try {
      const bscTest = await provider();
      const ret = await bscTest.eth.getBalance(address);
      const balance = await bscTest.utils.fromWei(ret);

      resolve(balance);
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = bscTestBalance;
