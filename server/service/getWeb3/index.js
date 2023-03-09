const Web3 = require("web3");
const axios = require("axios");

const { logger } = require("../../utils/winston");
const { INFURA_KEY } = process.env;

const getWeb3 = async (chainId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = await axios
        .get(`https://chainid.network/chains.json`)
        .then((response) => {
          let result;
          response.data.map((v, i) => {
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
      const web3 = new Web3(new Web3.providers.HttpProvider(url));

      resolve(web3);
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = getWeb3;

// const rpcURL = require("../rpcURL/url");
// const url = await rpcURL(chainId);
