const baobab = require("../../../../../blockchain/klaytn/testnet");

const { logger } = require("../../../../../utils/winston");
const { hexToDecimal } = require("../../../../../utils/converter");

const baobabEstimateGas = (fromAddress, fromPrivateKey, toAddress, value) => {
  return new Promise(async (resolve, reject) => {
    try {
      await baobab.klay.accounts.wallet.add(fromPrivateKey);

      const gasPrice =
        hexToDecimal(await baobab.rpc.klay.getGasPrice()) / 1000000000;
      const estimateGas = 21000;
      const txFee = (gasPrice * estimateGas) / 1000000000;
      await baobab.klay.accounts.wallet.remove(fromAddress);

      resolve({ gasPrice, estimateGas, txFee });
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = baobabEstimateGas;
