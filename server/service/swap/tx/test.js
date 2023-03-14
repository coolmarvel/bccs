const { Pool } = require("@uniswap/v3-sdk");
const { Token } = require("@uniswap/sdk-core");
const { Web3Provider } = require("@ethersproject/providers");
const { AlphaRouter } = require("@uniswap/smart-order-router");
const { Percent, TradeType, CurrencyAmount } = require("@uniswap/sdk-core");
const QuoterABI = require("@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json");
const IUniswapV3Pool = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");
const IUniswapV3Factory = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json");

const abi = require("../../../utils/data/ERC20/abi");
const { logger } = require("../../../utils/winston");

const getWeb3 = require("../../getWeb3");

const {
  UNISWAP_FACTORY_ADDRESS,
  UNISWAP_QUOTER_ADDRESS,
  V3_SWAP_ROUTER_ADDRESS,
} = process.env;

const swapTx = (chainId, privateKey, from, to, amount) => {
  return new Promise(async (resolve, reject) => {
    try {
      // ============= PART 1 --- connect to blockchain and get token balances
      logger.info("Connecting to blockchain, loading token balances...");

      const web3 = await getWeb3(chainId);
      const account = await web3.eth.accounts.wallet.add(privateKey);

      const contractIn = new web3.eth.Contract(abi, from.address);
      const contractOut = new web3.eth.Contract(abi, to.address);

      const [tokenIn, balanceTokenIn] = await getTokenAndBalance(
        chainId,
        contractIn,
        account.address
      );
      const [tokenOut, balanceTokenOut] = await getTokenAndBalance(
        chainId,
        contractOut,
        account.address
      );
      logger.info(`Wallet ${account.address}'s balances:`);
      logger.info(
        `Input(${tokenIn.symbol}): ${web3.utils.fromWei(balanceTokenIn)}`
      );
      logger.info(
        `Output(${tokenOut.symbol}): ${web3.utils.fromWei(balanceTokenOut)}`
      );

      // ============= PART 2 --- get Uniswap pool for pair TokenIn-TokenOut
      logger.info("Loading pool information...");
      const pool = await getPool(web3, tokenIn, tokenOut);

      // ============= PART 3 --- Giving a quote for user input
      logger.info("Loading up quote for a swap...");
      const amountIn = web3.utils.toWei(amount);

      // ============= PART 4 --- Loading a swap route
      logger.info("Loading a swap route...");
      const route = await getQuote(
        web3,
        pool,
        amount,
        amountIn,
        tokenIn,
        tokenOut,
        account.address
      );

      // ============= PART 5 --- Making actual swap
      logger.info("Approving amount to spend...");
      const approveReceipt = await approveSwap(account, amountIn, contractIn);

      logger.info("Making a swap...");
      const swapReceipt = await makeSwap(web3, route, account);

      // ============= Final part --- printing results
      const result = await getResult(
        contractIn,
        contractOut,
        tokenIn,
        tokenOut,
        account.address,
        approveReceipt,
        swapReceipt,
        web3
      );

      await web3.eth.accounts.wallet.remove(account.address);
      resolve(result);
    } catch (error) {
      return reject(error);
    }
  });
};

const getTokenAndBalance = (chainId, contract, address) => {
  return new Promise(async (resolve, reject) => {
    try {
      let [decimals, symbol, name, balance] = await Promise.all([
        contract.methods.decimals().call(),
        contract.methods.symbol().call(),
        contract.methods.name().call(),
        contract.methods.balanceOf(address).call(),
      ]);
      const contractAddress = contract.options.address;

      resolve([
        new Token(chainId, contractAddress, Number(decimals), symbol, name),
        balance,
      ]);
    } catch (error) {
      return reject(error);
    }
  });
};

const getPoolState = (poolContract) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [liquidity, slot] = await Promise.all([
        poolContract.methods.liquidity().call(),
        poolContract.methods.slot0().call(),
      ]);

      resolve({
        liquidity: liquidity,
        sqrtPriceX96: slot[0],
        tick: Number(slot[1]),
        observationIndex: slot[2],
        observationCardinality: slot[3],
        observationCardinalityNext: slot[4],
        feeProtocol: slot[5],
        unlocked: slot[6],
      });
    } catch (error) {
      return reject(error);
    }
  });
};

const getPoolImmutables = (poolContract) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [factory, token0, token1, fee, tickSpacing, maxLiquidityPerTick] =
        await Promise.all([
          poolContract.methods.factory().call(),
          poolContract.methods.token0().call(),
          poolContract.methods.token1().call(),
          poolContract.methods.fee().call(),
          poolContract.methods.tickSpacing().call(),
          poolContract.methods.maxLiquidityPerTick().call(),
        ]);

      resolve({
        factory: factory,
        token0: token0,
        token1: token1,
        fee: Number(fee),
        tickSpacing: tickSpacing,
        maxLiquidityPerTick: maxLiquidityPerTick,
      });
    } catch (error) {
      return reject(error);
    }
  });
};

const getPool = (web3, tokenIn, tokenOut) => {
  return new Promise(async (resolve, reject) => {
    try {
      const factoryContract = new web3.eth.Contract(
        IUniswapV3Factory.abi,
        UNISWAP_FACTORY_ADDRESS
      );

      const poolAddress = await factoryContract.methods
        .getPool(tokenIn.address, tokenOut.address, 3000)
        .call();

      if (poolAddress === "0")
        throw `Error: No ppol ${tokenIn.symbol}-${tokenOut.symbol}`;

      const poolContract = new web3.eth.Contract(
        IUniswapV3Pool.abi,
        poolAddress
      );

      const [immutables, state] = await Promise.all([
        getPoolImmutables(poolContract),
        getPoolState(poolContract),
      ]);

      const pool = new Pool(
        tokenIn,
        tokenOut,
        immutables.fee,
        state.sqrtPriceX96,
        state.liquidity,
        state.tick
      );

      logger.info("Token prices in pool:");
      logger.info(
        `${pool.token0.symbol} = ${pool.token0Price.toSignificant()} ${
          pool.token1.symbol
        }`
      );
      logger.info(
        `${pool.token1.symbol} = ${pool.token1Price.toSignificant()} ${
          pool.token0.symbol
        }`
      );

      resolve(pool);
    } catch (error) {
      return reject(error);
    }
  });
};

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

const approveSwap = (account, amountIn, contractIn) => {
  return new Promise(async (resolve, reject) => {
    try {
      const receipt = await contractIn.methods
        .approve(V3_SWAP_ROUTER_ADDRESS, amountIn)
        .send({ from: account.address, gas: "600000" });

      if (receipt.status === 0) throw new Error("Approve transaction failed");

      resolve(receipt);
    } catch (error) {
      return reject(error);
    }
  });
};

const makeSwap = (web3, route, account) => {
  return new Promise(async (resolve, reject) => {
    try {
      const tx = {
        from: account.address,
        to: V3_SWAP_ROUTER_ADDRESS,
        gas: "600000",
        data: route.methodParameters.calldata,
        value: route.methodParameters.value,
      };
      const receipt = await web3.eth.sendTransaction(tx);

      resolve(receipt);
    } catch (error) {
      return reject(error);
    }
  });
};

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

module.exports = swapTx;
