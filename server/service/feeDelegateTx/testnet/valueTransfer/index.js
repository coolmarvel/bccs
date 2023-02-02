const baobab = require("../../../../blockchain/klaytn/testnet");

const { logger } = require("../../../../utils/winston");

const feeDelegateBaobabKlayTransfer = (
  fromAddress,
  fromPrivateKey,
  toAddress,
  feePayAddress,
  feePayPrivateKey,
  value
) => {
  return new Promise(async (resolve, reject) => {
    try {
      await baobab.klay.accounts.wallet.add(fromPrivateKey);
      await baobab.klay.accounts.wallet.add(feePayPrivateKey);

      const { rawTransaction: senderRawTransaction } =
        await baobab.klay.accounts.signTransaction(
          {
            type: "FEE_DELEGATED_VALUE_TRANSFER",
            from: fromAddress,
            to: toAddress,
            gas: 3000000,
            value: baobab.utils.toPeb(value, "KLAY"),
          },
          fromPrivateKey
        );

      const receipt = await baobab.klay.sendTransaction({
        senderRawTransaction: senderRawTransaction,
        feePayer: feePayAddress,
      });

      await baobab.klay.accounts.wallet.remove(fromAddress);
      await baobab.klay.accounts.wallet.remove(feePayAddress);

      resolve(receipt);
    } catch (error) {
      logger.error(error.message);
      await baobab.klay.accounts.wallet.remove(fromAddress);
      await baobab.klay.accounts.wallet.remove(feePayAddress);
      return reject(error);
    }
  });
};

module.exports = feeDelegateBaobabKlayTransfer;
