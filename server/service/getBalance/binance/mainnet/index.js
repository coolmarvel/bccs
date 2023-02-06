const provider = require("../../../../blockchain/binance/mainnet");

const { logger } = require("../../../../utils/winston");

const bscMainBalance = (address) => {
  return new Promise(async (resolve, reject) => {
    try {
      const bscMain = await provider();
      const ret = await bscMain.eth.getBalance(address);
      const balance = await bscMain.utils.fromWei(ret);

      resolve(balance);
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = bscMainBalance;
