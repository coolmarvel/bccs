const getCaver = require("../../getCaver");

const { logger } = require("../../../utils/winston");
const { hexToDecimal } = require("../../../utils/converter");

const deployContractFeeDelegate = (
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
          await caver.klay.accounts.signTransaction({
            type: "FEE_DELEGATED_SMART_CONTRACT_DEPLOY",
            from: sender.address,
            data: encoded,
            gas: 10000000,
            value: caver.utils.toPeb("0", "KLAY"),
          })
        ).rawTransaction;
        const receipt = await caver.klay
          .sendTransaction({
            senderRawTransaction: rawTx,
            feePayer: feePayer.address,
          })
          .then((response) => {
            const result = response;
            result.gas = hexToDecimal(result.gas);
            result.gasPrice = hexToDecimal(result.gasPrice);
            return result;
          });

        await caver.klay.accounts.wallet.remove(sender.address);
        await caver.klay.accounts.wallet.remove(feePayer.address);

        resolve(receipt);
      }
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = deployContractFeeDelegate;
