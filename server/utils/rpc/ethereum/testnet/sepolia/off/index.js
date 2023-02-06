const fs = require("fs");

const dataBuffer = fs.readFileSync(
  "utils/rpc/ethereum/testnet/sepolia/rpcUrl.json"
);
const dataJSON = dataBuffer.toString();
const json = JSON.parse(dataJSON);

const { logger } = require("../../../../../winston");

const updateStatusOff = () => {
  return new Promise(async (resolve, reject) => {
    try {
      for (const key in json) {
        if (json[key].status === "on") {
          console.log("키값:" + key + " 데이터값:" + json[key].rpc);

          json[key].status = "off";
          const jsonData = JSON.stringify(json);
          fs.writeFileSync(
            "utils/rpc/ethereum/testnet/sepolia/rpcUrl.json",
            jsonData
          );
        }
        break;
      }

      resolve(true);
    } catch (error) {
      logger.error(error);
      return reject(error);
    }
  });
};

module.exports = updateStatusOff;
