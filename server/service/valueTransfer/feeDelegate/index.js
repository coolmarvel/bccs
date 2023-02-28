const getCaver = require("../../getCaver");

const { logger } = require("../../../utils/winston");

const feeDelegateValueTransfer = (
  chainId,
  fromAddress,
  fromPrivateKey,
  toAddress,
  feePayAddress,
  feePayPrivateKey,
  value
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (chainId == "1001" || chainId == "8217") {
        const caver = await getCaver(chainId);
        await caver.klay.accounts.wallet.add(fromPrivateKey);
        await caver.klay.accounts.wallet.add(feePayPrivateKey);

        const { rawTransaction: senderRawTransaction } =
          await caver.klay.accounts.signTransaction(
            {
              type: "FEE_DELEGATED_VALUE_TRANSFER",
              from: fromAddress,
              to: toAddress,
              gas: 3000000,
              value: caver.utils.toPeb(value, "KLAY"),
            },
            fromPrivateKey
          );

        const receipt = await caver.klay.sendTransaction({
          senderRawTransaction: senderRawTransaction,
          feePayer: feePayAddress,
        });

        await caver.klay.accounts.wallet.remove(fromAddress);
        await caver.klay.accounts.wallet.remove(feePayAddress);

        resolve(receipt);
      } else {
        return reject({ message: "Unsupported chainId" });
      }
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = feeDelegateValueTransfer;
