const provider = require("../../../../../blockchain/ethereum/testnet/goerli");

const { logger } = require("../../../../../utils/winston");

const goerliBalance = (address) => {
  return new Promise(async (resolve, reject) => {
    try {
      const goerli = await provider();
      const ret = await goerli.eth.getBalance(address);
      const balance = await goerli.utils.fromWei(ret);

      resolve(balance);
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = goerliBalance;
