const MultiSigWallet = artifacts.require("MultiSigWallet");

module.exports = async (deployer) => {
  try {
    // 2 of 3 multisig
    await deployer.deploy(
      MultiSigWallet,
      ["ADDRESS_1", "ADDRESS_2", "ADDRESS_3"],
      2
    );
  } catch (error) {
    console.error(error);
  }
};
