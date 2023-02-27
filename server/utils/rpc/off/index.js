const fs = require("fs");

const dataBuffer = fs.readFileSync("utils/rpc/rpcUrl.json");
const dataJSON = dataBuffer.toString();
const json = JSON.parse(dataJSON);

const { logger } = require("../../winston");

const updateStatusOff = (chainId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (json[chainId]) {
        for (const key in json[chainId]) {
          if (json[chainId][key].status == "on") {
            logger.info("key: " + chainId + " url: " + json[chainId][key].rpc);
            json[chainId].status = "off";
            const jsonData = JSON.stringify(json);
            fs.writeFileSync("utils/rpc/rpcUrl.json", jsonData);
            break;
          }
        }
        resolve(true);
      } else {
        return reject({ message: "RPC URL UPDATE FAILED" });
      }
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = updateStatusOff;
