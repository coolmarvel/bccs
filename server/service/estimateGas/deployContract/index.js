const getWeb3 = require("../../getWeb3");
const getCaver = require("../../getCaver");

const { logger } = require("../../../utils/winston");
const { hexToDecimal } = require("../../../utils/converter");

const estimateGas = (chainId, abi, bytecode, privateKey) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (chainId == "1001" || chainId == "8217") {
        const caver = await getCaver(chainId);
        const account = await caver.klay.accounts.wallet.add(privateKey);

        const encoded = await caver.abi.encodeContractDeploy(abi, bytecode);
        const rawTx = (
          await caver.klay.accounts.signTransaction(
            {
              type: "SMART_CONTRACT_DEPLOY",
              from: account.address,
              data: encoded,
              gas: 100000000,
              value: caver.utils.toPeb("0", "KLAY"),
            },
            privateKey
          )
        ).rawTransaction;
        const estimatedGas = await caver.klay.estimateGas({
          to: account.address,
          data: rawTx,
        });
        const gasPrice =
          hexToDecimal(await caver.rpc.klay.getGasPrice()) / 1000000000;
        const txFee = (gasPrice * estimatedGas) / 1000000000;

        await caver.klay.accounts.wallet.remove(account.address);

        const result = {
          gasPrice: gasPrice,
          estimatedGas: estimatedGas,
          txFee: txFee,
        };
        resolve(result);
      } else {
        const web3 = await getWeb3(chainId);

        resolve(true);
      }
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = estimateGas;
