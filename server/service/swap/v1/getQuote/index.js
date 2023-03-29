const ethers = require("ethers");
const { AlphaRouter } = require("@uniswap/smart-order-router");
const { Percent, TradeType, CurrencyAmount } = require("@uniswap/sdk-core");
const QuoterABI = require("@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json");

const { logger } = require("../../../../utils/winston");

const { UNISWAP_QUOTER_ADDRESS } = process.env;

const getQuote = async (
  provider,
  address,
  tokenIn,
  tokenOut,
  amountIn,
  amount,
  pool
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const quoterContract = new ethers.Contract(
        UNISWAP_QUOTER_ADDRESS,
        QuoterABI.abi,
        provider
      );
      const quotedAmountOut =
        await quoterContract.callStatic.quoteExactInputSingle(
          tokenIn.address,
          tokenOut.address,
          pool.fee,
          amountIn,
          0
        );
      logger.info(
        `You'll get approximately ${ethers.utils.formatUnits(
          quotedAmountOut,
          tokenOut.decimals
        )} ${tokenOut.symbol} for ${amount} ${tokenIn.symbol}`
      );

      const inAmount = CurrencyAmount.fromRawAmount(
        tokenIn,
        amountIn.toString()
      );
      const router = new AlphaRouter({
        chainId: tokenIn.chainId,
        provider: provider,
      });
      const route = await router.route(
        inAmount,
        tokenOut,
        TradeType.EXACT_INPUT,
        {
          recipient: address,
          slippageTolerance: new Percent(5, 100), // Big slippage – for a test
          deadline: Math.floor(Date.now() / 1000 + 1800), // add 1800 seconds – 30 mins deadline
        },
        { maxSwapsPerPath: 1 }
      );
      if (route == null || route.methodParameters === undefined)
        throw "No route loaded";
      logger.info(`You'll get ${route.quote.toFixed()} of ${tokenOut.symbol}`);
      logger.info(`Gas Adjusted Quote: ${route.quoteGasAdjusted.toFixed()}`);
      logger.info(
        `Gas Used Quote Token: ${route.estimatedGasUsedQuoteToken.toFixed()}`
      );
      logger.info(`Gas Used USD: ${route.estimatedGasUsedUSD.toFixed()}`);
      logger.info(`Gas Used: ${route.estimatedGasUsed.toString()}`);
      logger.info(`Gas Price Wei: ${route.gasPriceWei}`);

      resolve(route);
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = getQuote;

// const axios = require("axios");
// const qs = require("qs");

// if (!from || !to || !value || !address) {
//   return reject({ message: "params are required" });
// }

// const amount = Number(value * 10 ** from.decimals);
// const params = {
//   buyToken: from.address,
//   sellToken: to.address,
//   sellAmount: amount,
//   takerAddress: address,
//   skipValidation: true,
// };
// const result = await axios
//   .get(`https://api.0x.org/swap/v1/quote?${qs.stringify(params)}`)
//   .then((response) => {
//     return response.data;
//   });
