const axios = require("axios");

const { logger } = require("../../utils/winston");

const isValidChainId = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const chainId = req.headers["x-chain-id"];

      const chains = await axios
        .get(`https://chainid.network/chains.json`)
        .then((response) => {
          let result;
          response.data.map((v, i) => {
            if (v.chainId == Number(chainId)) {
              result = v.chainId;
            }
          });

          return result;
        });

      if (chains === undefined) {
        return reject({ message: "Unsupported chainId" });
      } else if (chains) {
        resolve(chains);
      }
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = isValidChainId;

// const chainIdList = require("./chainIdList");

// if (chainIdList.includes(chainId)) {
//   resolve(chainId);
// } else if (chainId === null || chainId === undefined) {
//   return reject({ message: "chainId required" });
// } else {
//   return reject({ message: "Unsupported chainId" });
// }
