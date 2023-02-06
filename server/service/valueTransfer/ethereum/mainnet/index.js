const provider = require("../../../../blockchain/ethereum/mainnet");

const { logger } = require("../../../../utils/winston");

const ethereumEtherTransfer = (
  fromAddress,
  fromPrivateKey,
  toAddress,
  value
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const ethereum = await provider();
      await ethereum.eth.accounts.wallet.add(fromPrivateKey);

      const receipt = await ethereum.eth.sendTransaction({
        from: fromAddress,
        to: toAddress,
        gas: 3000000,
        value: ethereum.utils.toWei(value, "ether"),
      });

      await ethereum.eth.accounts.wallet.remove(fromAddress);

      resolve(receipt);
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = ethereumEtherTransfer;
