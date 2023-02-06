const fs = require("fs");

const dataBuffer = fs.readFileSync("utils/rpc/ethereum/mainnet/rpcUrl.json");
const dataJSON = dataBuffer.toString();
const json = JSON.parse(dataJSON);

const { logger } = require("../../../../winston");

const updateStatusOn = () => {
  return new Promise(async (resolve, reject) => {
    try {
      for (const key in json) {
        console.log("키값:" + key + " 데이터값:" + json[key].rpc);

        json[key].status = "on";
        const jsonData = JSON.stringify(json);
        fs.writeFileSync("utils/rpc/ethereum/mainnet/rpcUrl.json", jsonData);
      }

      resolve(true);
    } catch (error) {
      logger.error(error);
      return reject(error);
    }
  });
};

module.exports = updateStatusOn;
