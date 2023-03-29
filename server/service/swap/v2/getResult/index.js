const { logger } = require("../../../../utils/winston");

const getResult = (
  contractIn,
  contractOut,
  tokenIn,
  tokenOut,
  address,
  approve,
  swap,
  web3
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [newBalanceIn, newBalanceOut] = await Promise.all([
        contractIn.methods.balanceOf(address).call(),
        contractOut.methods.balanceOf(address).call(),
      ]);

      logger.info("Swap completed successfully! ");
      logger.info("Updated balances:");
      logger.info(`${tokenIn.symbol}: ${web3.utils.fromWei(newBalanceIn)}`);
      logger.info(`${tokenOut.symbol}: ${web3.utils.fromWei(newBalanceOut)}`);

      const result = {
        approveReceipt: approve,
        swapReceipt: swap,
        newBalanceIn: web3.utils.fromWei(newBalanceIn),
        newBalanceOut: web3.utils.fromWei(newBalanceOut),
      };

      resolve(result);
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = getResult;
