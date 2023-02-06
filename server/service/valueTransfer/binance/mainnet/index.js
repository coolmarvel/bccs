const provider = require("../../../../blockchain/binance/mainnet");

const { logger } = require("../../../../utils/winston");

const bscMainBNBTransfer = (fromAddress, fromPrivateKey, toAddress, value) => {
  return new Promise(async (resolve, reject) => {
    try {
      const bscMain = await provider();
      await bscMain.eth.accounts.wallet.add(fromPrivateKey);

      const receipt = await bscMain.eth.sendTransaction({
        from: fromAddress,
        to: toAddress,
        gas: 3000000,
        value: bscMain.utils.toWei(value, "ether"),
      });

      await bscMain.eth.accounts.wallet.remove(fromAddress);

      resolve(receipt);
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = bscMainBNBTransfer;
