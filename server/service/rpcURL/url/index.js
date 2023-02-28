const fs = require("fs");

const { logger } = require("../../../utils/winston");

const rpcURL = (chainId) => {
  return new Promise(async (resolve, reject) => {
    try {
      fs.readFile("utils/rpc/rpcUrl.json", "utf8", async (err, data) => {
        if (err) {
          return reject(err);
        } else {
          let url;
          const json = JSON.parse(data);
          if (json[chainId]) {
            for (const key in json[chainId]) {
              if (json[chainId][key].status === "on") {
                logger.info(
                  "key: " + chainId + " data: " + json[chainId][key].rpc
                );
                const rpc = json[chainId][key].rpc;
                url = rpc;
                break;
              }
            }
            resolve(url);
          }
        }
      });
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = rpcURL;
