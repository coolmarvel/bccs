const Caver = require("caver-js");

const rpcURL = require("../rpcURL/url");

const { logger } = require("../../utils/winston");

const getCaver = async (chainId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = await rpcURL(chainId);
      const caver = new Caver(url);

      resolve(caver);
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = getCaver;
