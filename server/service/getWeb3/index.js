const Web3 = require("web3");

const rpcURL = require("../rpcURL/url");

const { logger } = require("../../utils/winston");

const getWeb3 = async (chainId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = await rpcURL(chainId);
      const web3 = new Web3(new Web3.providers.HttpProvider(url));

      resolve(web3);
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = getWeb3;
