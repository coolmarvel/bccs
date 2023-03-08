const axios = require("axios");

const { logger } = require("../../../utils/winston");

const addNetwork = (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const chains = await axios
        .get(`https://chainid.network/chains.json`)
        .then((response) => {
          let result;
          response.data.map((v, i) => {
            if (v.rpc.includes(url)) {
              result = v;
            }
          });

          return result;
        });

      if (chains) {
        resolve(chains);
      } else {
        logger.error("Invalid RPC URL: " + url);
        return reject({ message: "Invalid RPC URL" });
      }
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = addNetwork;
