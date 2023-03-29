const { Pool } = require("@uniswap/v3-sdk");
const IUniswapV3Pool = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");
const IUniswapV3Factory = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json");

const getPoolState = require("./getPoolState");
const getPoolImmutables = require("./getPoolImmutables");

const { logger } = require("../../../../utils/winston");

const { UNISWAP_FACTORY_ADDRESS } = process.env;

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
        throw `Error: No pool ${tokenIn.symbol}-${tokenOut.symbol}`;

      const poolContract = new web3.eth.Contract(
        IUniswapV3Pool.abi,
        poolAddress
      );
      const [state, immutables] = await Promise.all([
        getPoolState(poolContract),
        getPoolImmutables(poolContract),
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

module.exports = getPool;
