const provider = require("../../../../../blockchain/ethereum/testnet/sepolia");

const { logger } = require("../../../../../utils/winston");

const sepoliaBalance = (address) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sepolia = await provider();
      const ret = await sepolia.eth.getBalance(address);
      const balance = await sepolia.utils.fromWei(ret);

      resolve(balance);
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = sepoliaBalance;
