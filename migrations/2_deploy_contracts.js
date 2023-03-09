const NonFungibleToken = artifacts.require("NonFungibleToken");
const FungibleToken = artifacts.require("FungibleToken");
const MultiToken = artifacts.require("MultiToken");

module.exports = async (deployer) => {
  try {
    await deployer.deploy(MultiToken);
    await deployer.deploy(FungibleToken);
    await deployer.deploy(NonFungibleToken);
  } catch (error) {
    console.error(error);
  }
};
