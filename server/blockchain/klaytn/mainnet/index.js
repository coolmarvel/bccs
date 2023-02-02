const Caver = require("caver-js");

const rpcUrl = require("../../../utils/rpc/connect");
const { logger } = require("../../../utils/winston");

const provider = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = await rpcUrl();
      const cypress = new Caver(url);

      resolve(cypress);
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = provider;
