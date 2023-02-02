const provider = require("../../../../blockchain/klaytn/mainnet");

const { logger } = require("../../../../utils/winston");

const cypressKlayTransfer = (fromAddress, fromPrivateKey, toAddress, value) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cypress = await provider();

      await cypress.klay.accounts.wallet.add(fromPrivateKey);

      const receipt = await cypress.klay.sendTransaction({
        type: "VALUE_TRANSFER",
        from: fromAddress,
        to: toAddress,
        gas: 3000000,
        value: cypress.utils.toPeb(value, "KLAY"),
      });

      await cypress.klay.accounts.wallet.remove(fromAddress);

      resolve(receipt);
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = cypressKlayTransfer;
