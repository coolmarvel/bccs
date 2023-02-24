const baobab = require("../../../../blockchain/klaytn/testnet");

const { logger } = require("../../../../utils/winston");

const deployKip7Baobab = (
  address,
  privateKey,
  name,
  symbol,
  decimals,
  initialSupply
) => {
  return new Promise(async (resolve, reject) => {
    try {
      await baobab.klay.accounts.wallet.add(privateKey);

      resolve(true);
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = deployKip7Baobab;
