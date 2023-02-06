const Web3 = require("web3");

const rpcUrl = require("../../../utils/rpc/ethereum/mainnet/connect");
const { logger } = require("../../../utils/winston");

const provider = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = await rpcUrl();
      const ethereum = new Web3(new Web3.providers.HttpProvider(url));

      resolve(ethereum);
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = provider;
