const provider = require("../../../../blockchain/klaytn/mainnet");

const { logger } = require("../../../../utils/winston");

const cypressBalance = (address) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cypress = await provider();

      const ret = await cypress.rpc.klay.getBalance(address);
      const balance = await cypress.utils.fromPeb(ret.toString(), "KLAY");

      resolve(balance);
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = cypressBalance;
