const provider = require("../../../../../blockchain/ethereum/testnet/sepolia");

const { logger } = require("../../../../../utils/winston");

const sepoliaEtherTransfer = (
  fromAddress,
  fromPrivateKey,
  toAddress,
  value
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sepolia = await provider();
      await sepolia.eth.accounts.wallet.add(fromPrivateKey);

      const receipt = await sepolia.eth.sendTransaction({
        from: fromAddress,
        to: toAddress,
        gas: 3000000,
        value: sepolia.utils.toWei(value, "ether"),
      });

      await sepolia.eth.accounts.wallet.remove(fromAddress);

      resolve(receipt);
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = sepoliaEtherTransfer;
