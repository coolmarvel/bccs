const provider = require("../../../../blockchain/ethereum/mainnet");

const { logger } = require("../../../../utils/winston");

const ethereumBalance = (address) => {
  return new Promise(async (resolve, reject) => {
    try {
      const ethereum = await provider();
      const ret = await ethereum.eth.getBalance(address);
      const balance = await ethereum.utils.fromWei(ret);

      resolve(balance);
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = ethereumBalance;
