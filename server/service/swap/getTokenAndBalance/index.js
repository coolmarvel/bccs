const { Token } = require("@uniswap/sdk-core");

const getTokenAndBalance = (chainId, contract, address) => {
  return new Promise(async (resolve, reject) => {
    try {
      let [decimals, symbol, name, balance] = await Promise.all([
        contract.decimals(),
        contract.symbol(),
        contract.name(),
        contract.balanceOf(address),
      ]);

      const token = new Token(
        chainId,
        contract.address,
        decimals,
        symbol,
        name
      );

      resolve([token, balance]);
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = getTokenAndBalance;
