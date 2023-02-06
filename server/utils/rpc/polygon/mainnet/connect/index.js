const fs = require("fs");

const dataBuffer = fs.readFileSync("utils/rpc/polygon/mainnet/rpcUrl.json");
const dataJSON = dataBuffer.toString();
const json = JSON.parse(dataJSON);

const { logger } = require("../../../../winston");

const rpcUrl = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let url;
      for (const key in json) {
        if (json[key].status === "on") {
          logger.info("키값: " + key + " 데이터값: " + json[key].rpc);
          const rpcUrl = json[key].rpc;
          url = rpcUrl;
          break;
        }
      }

      resolve(url);
    } catch (error) {
      logger.error(error);
      return reject(error);
    }
  });
};

module.exports = rpcUrl;
