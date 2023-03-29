const { Token } = require("@uniswap/sdk-core");
const { logger } = require("../../../../utils/winston");

const getTokenAndBalance = (web3, chainId, contract, address) => {
  return new Promise(async (resolve, reject) => {
    try {
      let [decimals, symbol, name, balance] = await Promise.all([
        contract.methods.decimals().call(),
        contract.methods.symbol().call(),
        contract.methods.name().call(),
        contract.methods.balanceOf(address).call(),
      ]);
      const contractAddress = contract.options.address;
      const token = new Token(
        chainId,
        contractAddress,
        Number(decimals),
        symbol,
        name
      );
      logger.info(`${token.symbol}: ${web3.utils.fromWei(balance)}`);

      resolve([token, balance]);
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = getTokenAndBalance;
