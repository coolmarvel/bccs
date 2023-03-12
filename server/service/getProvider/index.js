const ethers = require("ethers");
const axios = require("axios");

const { logger } = require("../../utils/winston");
const { INFURA_KEY } = process.env;

const getProvider = async (chainId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = await axios
        .get(`https://chainid.network/chains.json`)
        .then((response) => {
          let result;
          response.data.map((v) => {
            if (v.chainId == Number(chainId)) {
              if (v.rpc[0].includes("INFURA_API_KEY")) {
                result = v.rpc[0].replace("${INFURA_API_KEY}", `${INFURA_KEY}`);
              } else {
                result = v.rpc[0];
              }
            }
          });
          return result;
        });
      logger.info(`chainId: ${chainId} URL: ${url}`);
      const provider = new ethers.providers.JsonRpcProvider(url, chainId);

      resolve(provider);
    } catch (error) {
      logger.error(error.message);
      return reject(error.message);
    }
  });
};

module.exports = getProvider;
