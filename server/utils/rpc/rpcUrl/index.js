const fs = require("fs");

const { logger } = require("../../winston");

const dataBuffer = fs.readFileSync("utils/rpc/rpcUrl.json");
const dataJSON = dataBuffer.toString();
const json = JSON.parse(dataJSON);

const rpcUrl = (chainId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let url;
      if (json[chainId]) {
        for (const key in json[chainId]) {
          if (json[chainId][key].status == "on") {
            logger.info("key: " + chainId + " url: " + json[chainId][key].rpc);
            const rpcUrl = json[chainId][key].rpc;
            url = rpcUrl;
            break;
          }
        }
        resolve(url);
      } else {
        return reject({ message: "Not Supported chainId" });
      }
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = rpcUrl;
