const ethers = require("ethers");

const { logger } = require("../../../utils/winston");

const getResult = (
  contractIn,
  contractOut,
  tokenIn,
  tokenOut,
  approve,
  address,
  swap
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [newBalanceIn, newBalanceOut] = await Promise.all([
        contractIn.balanceOf(address),
        contractOut.balanceOf(address),
      ]);
      logger.info("Swap completed successfully! ");
      logger.info("Updated balances:");
      logger.info(
        `${tokenIn.symbol}: ${ethers.utils.formatUnits(
          newBalanceIn,
          tokenIn.decimals
        )}`
      );
      logger.info(
        `${tokenOut.symbol}: ${ethers.utils.formatUnits(
          newBalanceOut,
          tokenOut.decimals
        )}`
      );

      const result = {
        approveReceipt: approve,
        swapReceipt: swap,
        newBalanceIn: ethers.utils.formatUnits(newBalanceIn, tokenIn.decimals),
        newBalanceOut: ethers.utils.formatUnits(
          newBalanceOut,
          tokenOut.decimals
        ),
      };
      resolve(result);
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = getResult;
