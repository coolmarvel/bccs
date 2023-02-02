const baobab = require("../../../../blockchain/klaytn/testnet");

const { logger } = require("../../../../utils/winston");

const baobabBalance = (address) => {
  return new Promise(async (resolve, reject) => {
    try {
      const ret = await baobab.rpc.klay.getBalance(address);
      const balance = await baobab.utils.fromPeb(ret.toString(), "KLAY");

      resolve(balance);
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = baobabBalance;
