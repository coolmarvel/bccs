const { logger } = require("../../utils/winston");

const chainIdList = require("./chainIdList");

const isValidChainId = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const chainId = req.headers["x-chain-id"];

      if (chainIdList.includes(chainId)) {
        resolve(chainId);
      } else if (chainId === null || chainId === undefined) {
        return reject({ message: "chainId required" });
      } else {
        return reject({ message: "Unsupported chainId" });
      }
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = isValidChainId;
