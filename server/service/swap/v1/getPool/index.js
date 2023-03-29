const ethers = require("ethers");
const { Pool } = require("@uniswap/v3-sdk");
const IUniswapV3Pool = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");
const IUniswapV3Factory = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json");

const getPoolState = require("../getPoolState");
const getPoolImmutables = require("../getPoolImmutables");

const { logger } = require("../../../utils/winston");

const { UNISWAP_FACTORY_ADDRESS } = process.env;

const getPool = (provider, tokenIn, tokenOut) => {
  return new Promise(async (resolve, reject) => {
    try {
      const factoryContract = new ethers.Contract(
        UNISWAP_FACTORY_ADDRESS,
        IUniswapV3Factory.abi,
        provider
      );
      const poolAddress = await factoryContract.getPool(
        tokenIn.address,
        tokenOut.address,
        3000
      );
      if (Number(poolAddress).toString() === "0")
        throw `Error: No pool ${tokenIn.symbol}-${tokenOut.symbol}`;
      const poolContract = new ethers.Contract(
        poolAddress,
        IUniswapV3Pool.abi,
        provider
      );

      const [immutables, state] = await Promise.all([
        getPoolImmutables(poolContract),
        getPoolState(poolContract),
      ]);

      const pool = new Pool(
        tokenIn,
        tokenOut,
        immutables.fee,
        state.sqrtPriceX96.toString(),
        state.liquidity.toString(),
        state.tick
      );
      // print token prices in the pool
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
