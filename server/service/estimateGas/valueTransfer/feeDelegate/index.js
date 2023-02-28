const getCaver = require("../../../getCaver");

const { logger } = require("../../../../utils/winston");
const { hexToDecimal } = require("../../../../utils/converter");

const feeDelegateEstimateGas = (
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

        const rawTx = (
          await caver.klay.accounts.signTransaction(
            {
              type: "FEE_DELEGATED_VALUE_TRANSFER",
              from: fromAddress,
              to: toAddress,
              gas: 3000000,
              value: caver.utils.toPeb(value, "KLAY"),
            },
            fromPrivateKey
          )
        ).rawTransaction;
        const estimatedGas = await caver.klay.estimateGas(
          { to: toAddress, data: rawTx },
          feePayPrivateKey
        );
        const gasPrice =
          hexToDecimal(await caver.rpc.klay.getGasPrice()) / 1000000000;
        const txFee = (gasPrice * estimatedGas) / 1000000000;

        const result = {
          gasPrice: gasPrice,
          estimatedGas: estimatedGas,
          txFee: txFee,
        };
        resolve(result);
      } else {
        return reject({ message: "Unsupported chainId" });
      }
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = feeDelegateEstimateGas;
