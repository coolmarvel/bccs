const provider = require("../../../../blockchain/klaytn/mainnet");

const { logger } = require("../../../../utils/winston");

const feeDelegateCypressKlayTransfer = (
  fromAddress,
  fromPrivateKey,
  toAddress,
  feePayAddress,
  feePayPrivateKey,
  value
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cypress = await provider();

      await cypress.klay.accounts.wallet.add(fromPrivateKey);
      await cypress.klay.accounts.wallet.add(feePayPrivateKey);

      const { rawTransaction: senderRawTransaction } =
        await cypress.klay.accounts.signTransaction(
          {
            type: "FEE_DELEGATED_VALUE_TRANSFER",
            from: fromAddress,
            to: toAddress,
            gas: 3000000,
            value: cypress.utils.toPeb(value, "KLAY"),
          },
          fromPrivateKey
        );

      const receipt = await cypress.klay.sendTransaction({
        senderRawTransaction: senderRawTransaction,
        feePayer: feePayAddress,
      });

      await cypress.klay.accounts.wallet.remove(fromAddress);
      await cypress.klay.accounts.wallet.remove(feePayAddress);

      resolve(receipt);
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = feeDelegateCypressKlayTransfer;
