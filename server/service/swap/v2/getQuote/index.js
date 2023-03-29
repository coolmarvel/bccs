const { Web3Provider } = require("@ethersproject/providers");
const { AlphaRouter } = require("@uniswap/smart-order-router");
const { Percent, TradeType, CurrencyAmount } = require("@uniswap/sdk-core");
const QuoterABI = require("@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json");

const { logger } = require("../../../../utils/winston");

const { UNISWAP_QUOTER_ADDRESS } = process.env;

const getQuote = (web3, pool, amount, amountIn, tokenIn, tokenOut, address) => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = new Web3Provider(web3.currentProvider);
      const quoterContract = new web3.eth.Contract(
        QuoterABI.abi,
        UNISWAP_QUOTER_ADDRESS
      );
      const quotedAmountOut = await quoterContract.methods
        .quoteExactInputSingle(
          tokenIn.address,
          tokenOut.address,
          pool.fee,
          amountIn,
          0
        )
        .call();
      logger.info(
        `You'll get approximately ${web3.utils.fromWei(quotedAmountOut)} ${
          tokenOut.symbol
        } for ${amount} ${tokenIn.symbol}`
      );
      const inAmount = CurrencyAmount.fromRawAmount(tokenIn, amountIn);

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
          deadline: Math.floor(Date.now() / 1000 + 60), // add 1800 seconds – 1 mins deadline
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
      return reject(error);
    }
  });
};

module.exports = getQuote;
