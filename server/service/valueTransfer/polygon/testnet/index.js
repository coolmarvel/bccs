const provider = require("../../../../blockchain/polygon/testnet");

const { logger } = require("../../../../utils/winston");

const mumbaiMaticTransfer = (fromAddress, fromPrivateKey, toAddress, value) => {
  return new Promise(async (resolve, reject) => {
    try {
      const mumbai = await provider();
      await mumbai.eth.accounts.wallet.add(fromPrivateKey);

      const receipt = await mumbai.eth.sendTransaction({
        from: fromAddress,
        to: toAddress,
        gas: 3000000,
        value: mumbai.utils.toWei(value, "ether"),
      });

      await mumbai.eth.accounts.wallet.remove(fromAddress);

      resolve(receipt);
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = mumbaiMaticTransfer;
