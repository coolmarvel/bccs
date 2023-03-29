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

module.exports = getPoolState;
