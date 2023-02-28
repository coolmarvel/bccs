const getWeb3 = require("../../getWeb3");
const getCaver = require("../../getCaver");

const { logger } = require("../../../utils/winston");
const { hexToDecimal } = require("../../../utils/converter");

const estimateGas = (
  chainId,
  fromAddress,
  fromPrivateKey,
  toAddress,
  value
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (chainId == "1001" || chainId == "8217") {
        const caver = await getCaver(chainId);
        const account = await caver.klay.accounts.wallet.add(fromPrivateKey);

        const rawTx = (
          await caver.klay.accounts.signTransaction(
            {
              type: "VALUE_TRANSFER",
              from: fromAddress,
              to: toAddress,
              gas: 3000000,
              value: caver.utils.toPeb(value, "KLAY"),
            },
            fromPrivateKey
          )
        ).rawTransaction;
        const estimatedGas = await caver.klay.estimateGas({
          to: toAddress,
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
        const account = await web3.eth.accounts.wallet.add(fromPrivateKey);

        const rawTx = (
          await web3.eth.accounts.signTransaction(
            {
              to: toAddress,
              gas: 10000000,
              value: web3.utils.toWei(value, "ether"),
            },
            fromPrivateKey
          )
        ).rawTransaction;
        const estimatedGas = await web3.eth.estimateGas({
          to: toAddress,
          data: rawTx,
        });
        const gasPrice = await web3.eth.getGasPrice();
        const txFee = await web3.utils.fromWei(
          (estimatedGas * parseInt(gasPrice)).toString(),
          "ether"
        );
        const result = {
          gasPrice: parseInt(gasPrice),
          estimatedGas: estimatedGas,
          txFee: parseFloat(txFee),
        };

        resolve(result);
      }
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = estimateGas;
