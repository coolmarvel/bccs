const provider = require("../../../../../blockchain/polygon/testnet");

const { logger } = require("../../../../../utils/winston");

const mumbaiEstimateGas = (fromAddress, fromPrivateKey, toAddress, value) => {
  return new Promise(async (resolve, reject) => {
    try {
      const mumbai = await provider();

      await mumbai.eth.accounts.wallet.add(fromPrivateKey);
      const gasPrice = (await mumbai.eth.getGasPrice()) / 1000000000;
      const estimateGas = await mumbai.eth.estimateGas({
        to: toAddress,
        gas: 3000000,
        value: mumbai.utils.toWei(value, "ether"),
      });
      await mumbai.eth.accounts.wallet.remove(fromAddress);

      const txFee = (gasPrice * estimateGas) / 1000000000;
      resolve({ gasPrice, estimateGas, txFee });
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = mumbaiEstimateGas;
