const baobab = require("../../../../blockchain/klaytn/testnet");

const { logger } = require("../../../../utils/winston");

const baobabKlayTransfer = (fromAddress, fromPrivateKey, toAddress, value) => {
  return new Promise(async (resolve, reject) => {
    try {
      await baobab.klay.accounts.wallet.add(fromPrivateKey);

      const receipt = await baobab.klay.sendTransaction({
        type: "VALUE_TRANSFER",
        from: fromAddress,
        to: toAddress,
        gas: 3000000,
        value: baobab.utils.toPeb(value, "KLAY"),
      });

      await baobab.klay.accounts.wallet.remove(fromAddress);

      resolve(receipt);
    } catch (error) {
      logger.error(error.message);
      await baobab.klay.accounts.wallet.remove(fromAddress);
      return reject(error);
    }
  });
};

module.exports = baobabKlayTransfer;
