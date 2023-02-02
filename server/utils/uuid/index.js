const { v4 } = require("uuid");

const { logger } = require("../winston");

const uuid = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const tokens = v4().split("-");
      
      resolve(tokens[2] + tokens[1] + tokens[0] + tokens[3] + tokens[4]);
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = uuid;
