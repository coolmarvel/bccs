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

module.exports = getPoolImmutables;
