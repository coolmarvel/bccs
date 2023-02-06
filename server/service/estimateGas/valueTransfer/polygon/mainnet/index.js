const provider = require("../../../../../blockchain/polygon/mainnet");

const { logger } = require("../../../../../utils/winston");

const polygonEstimateGas = (fromAddress, fromPrivateKey, toAddress, value) => {
  return new Promise(async (resolve, reject) => {
    try {
      const polygon = await provider();

      await polygon.eth.accounts.wallet.add(fromPrivateKey);
      const gasPrice = (await polygon.eth.getGasPrice()) / 1000000000;
      const estimateGas = await polygon.eth.estimateGas({
        to: toAddress,
        gas: 3000000,
        value: polygon.utils.toWei(value, "ether"),
      });
      await polygon.eth.accounts.wallet.remove(fromAddress);

      const txFee = (gasPrice * estimateGas) / 1000000000;
      resolve({ gasPrice, estimateGas, txFee });
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = polygonEstimateGas;
