const cmd = require("node-cmd");
const solc = require("solc");
const fs = require("fs");

const { logger } = require("../../../utils/winston");

const compileContract = (name, contract) => {
  return new Promise(async (resolve, reject) => {
    try {
      fs.writeFile(`public/${name}.sol`, contract, async (err) => {
        if (err) {
          logger.error(`Contract create failed`);
          return reject(err);
        } else {
          logger.info(`${name}.sol contract create success`);
          const compile = cmd.runSync("truffle compile");
          logger.info(compile.data);

          fs.readFile(`public/${name}.sol`, "utf8", (err, data) => {
            logger.info(data);
          });

          fs.unlink(`public/${name}.sol`, async (err) => {
            if (err) {
              logger.error(`Contract delete failed`);
              return reject(err);
            } else {
              logger.info(`Contract delete success`);
              resolve(true);
            }
          });
        }
      });
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = compileContract;
