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
      const isExisted = await baobab.wallet.isExisted(address);

      if (!isExisted) {
        const keyring = await baobab.wallet.keyring.create(address, privateKey);
        await baobab.wallet.add(keyring);

        const result = await baobab.kct.kip7.deploy(
          {
            name: name,
            symbol: symbol,
            decimals: decimals,
            initialSupply: initialSupply,
          },
          address
        );

        await baobab.wallet.remove(address);

        resolve(result);
      } else if (isExisted) {
        resolve(true);
      }
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = deployKip7Baobab;
