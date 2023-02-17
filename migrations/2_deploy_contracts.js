const token = artifacts.require("Token");
const factory = artifacts.require("Factory");
const exchange = artifacts.require("Exchange");

module.exports = async (deployer) => {
  try {
    await deployer.deploy(factory);
    const tokenA = await deployer.deploy(token, "TokenA", "TKNA");
    const exchangeA = await deployer.deploy(exchange, tokenA.address);
  } catch (error) {
    console.error(error);
  }
};
