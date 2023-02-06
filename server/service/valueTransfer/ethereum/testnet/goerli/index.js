const provider = require("../../../../../blockchain/ethereum/testnet/goerli");

const { logger } = require("../../../../../utils/winston");

const goerliEtherTransfer = (fromAddress, fromPrivateKey, toAddress, value) => {
  return new Promise(async (resolve, reject) => {
    try {
      const goerli = await provider();
      await goerli.eth.accounts.wallet.add(fromPrivateKey);

      const receipt = await goerli.eth.sendTransaction({
        from: fromAddress,
        to: toAddress,
        gas: 3000000,
        value: goerli.utils.toWei(value, "ether"),
      });

      await goerli.eth.accounts.wallet.remove(fromAddress);

      resolve(receipt);
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = goerliEtherTransfer;
