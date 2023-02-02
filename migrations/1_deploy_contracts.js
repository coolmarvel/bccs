const saleDreamMT = artifacts.require("SaleDreamMT");
const dreamToken = artifacts.require("DreamToken");
const dreamNft = artifacts.require("DreamNFT");
const dreamMT = artifacts.require("DreamMT");
const lib = artifacts.require("Lib");

module.exports = async (deployer) => {
  try {
    await deployer.deploy(lib);
    await deployer.deploy(dreamToken);
    await deployer.deploy(dreamNft, dreamToken.address);
    await deployer.deploy(dreamMT, "http://localhost:8080"); // 임시 URI
    await deployer.deploy(saleDreamMT, dreamMT.address);
  } catch (error) {
    console.error(error);
  }
};
