const getPoolImmutables = (poolContract) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [factory, token0, token1, fee, tickSpacing, maxLiquidityPerTick] =
        await Promise.all([
          poolContract.factory(),
          poolContract.token0(),
          poolContract.token1(),
          poolContract.fee(),
          poolContract.tickSpacing(),
          poolContract.maxLiquidityPerTick(),
        ]);

      resolve({
        factory: factory,
        token0: token0,
        token1: token1,
        fee: fee,
        tickSpacing: tickSpacing,
        maxLiquidityPerTick: maxLiquidityPerTick,
      });
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = getPoolImmutables;
