const provider = require("../../../../../blockchain/klaytn/mainnet");

const { logger } = require("../../../../../utils/winston");
const { hexToDecimal } = require("../../../../../utils/converter");

const cypressEstimateGas = (fromAddress, fromPrivateKey, toAddress, value) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cypress = await provider();
      await cypress.klay.accounts.wallet.add(fromPrivateKey);

      const gasPrice =
        hexToDecimal(await cypress.rpc.klay.getGasPrice()) / 1000000000;
      const signedTx = await cypress.klay.accounts.signTransaction({
        type: "VALUE_TRANSFER",
        from: fromAddress,
        to: toAddress,
        gas: 300000,
        value: cypress.utils.toPeb(value, "KLAY"),
      });
      const estimateGas = hexToDecimal(
        await cypress.rpc.klay.estimateGas({
          to: toAddress,
          input: signedTx.messageHash,
        })
      );
      const txFee = (gasPrice * estimateGas) / 1000000000;
      await cypress.klay.accounts.wallet.remove(fromAddress);

      resolve({ gasPrice, estimateGas, txFee });
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = cypressEstimateGas;
