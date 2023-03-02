const getCaver = require("../../../getCaver");

const { logger } = require("../../../../utils/winston");
const { hexToDecimal } = require("../../../../utils/converter");

const feeDelegateEstimateGas = (
  chainId,
  abi,
  bytecode,
  fromPrivateKey,
  feePayPrivateKey
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (chainId == "1001" || chainId == "8217") {
        const caver = await getCaver(chainId);
        const sender = await caver.klay.accounts.wallet.add(fromPrivateKey);
        const feePayer = await caver.klay.accounts.wallet.add(feePayPrivateKey);

        const encoded = await caver.abi.encodeContractDeploy(abi, bytecode);
        const rawTx = (
          await caver.klay.accounts.signTransaction(
            {
              type: "FEE_DELEGATED_SMART_CONTRACT_DEPLOY",
              from: sender.address,
              data: encoded,
              gas: 10000000,
              value: caver.utils.toPeb("0", "KLAY"),
            },
            fromPrivateKey
          )
        ).rawTransaction;
        const estimatedGas = await caver.klay.estimateGas(
          { to: feePayer.address, data: rawTx },
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
      }
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = feeDelegateEstimateGas;
