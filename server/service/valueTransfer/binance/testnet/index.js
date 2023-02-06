const provider = require("../../../../blockchain/binance/testnet");

const { logger } = require("../../../../utils/winston");

const bscTestBNBTransfer = (fromAddress, fromPrivateKey, toAddress, value) => {
  return new Promise(async (resolve, reject) => {
    try {
      const bscTest = await provider();
      await bscTest.eth.accounts.wallet.add(fromPrivateKey);

      const receipt = await bscTest.eth.sendTransaction({
        from: fromAddress,
        to: toAddress,
        gas: 3000000,
        value: bscTest.utils.toWei(value, "ether"),
      });

      await bscTest.eth.accounts.wallet.remove(fromAddress);

      resolve(receipt);
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = bscTestBNBTransfer;
