const provider = require("../../../../blockchain/polygon/mainnet");

const { logger } = require("../../../../utils/winston");

const polygonMaticTransfer = (
  fromAddress,
  fromPrivateKey,
  toAddress,
  value
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const polygon = await provider();
      await polygon.eth.accounts.wallet.add(fromPrivateKey);

      const receipt = await polygon.eth.sendTransaction({
        from: fromAddress,
        to: toAddress,
        gas: 3000000,
        value: polygon.utils.toWei(value, "ether"),
      });

      await polygon.eth.accounts.wallet.remove(fromAddress);

      resolve(receipt);
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = polygonMaticTransfer;
