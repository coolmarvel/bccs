const token = artifacts.require("Token");
const factory = artifacts.require("Factory");
const exchange = artifacts.require("Exchange");

module.exports = async (deployer) => {
  try {
    await deployer.deploy(factory);
    const tokenA = await deployer.deploy(token, "TokenA", "TKNA");
    const tokenB = await deployer.deploy(token, "TokenB", "TKNB");
    const exchangeA = await deployer.deploy(exchange, tokenA.address);
    const exchangeB = await deployer.deploy(exchange, tokenB.address);
  } catch (error) {
    console.error(error);
  }
};
