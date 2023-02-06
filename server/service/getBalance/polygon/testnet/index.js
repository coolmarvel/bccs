const provider = require("../../../../blockchain/polygon/testnet");

const { logger } = require("../../../../utils/winston");

const mumbaiBalance = (address) => {
  return new Promise(async (resolve, reject) => {
    try {
      const mumbai = await provider();
      const ret = await mumbai.eth.getBalance(address);
      const balance = await mumbai.utils.fromWei(ret);

      resolve(balance);
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = mumbaiBalance;
