const baobab = require("../../blockchain/klaytn/testnet");

const { logger } = require("../../utils/winston");
const kip7jsoninterface = require("../../utils/data/kip7/abi");
const kip7bytecode = require("../../utils/data/kip7/bytecode");

const contractDeploy = (name, symbol) => {
  return new Promise(async (resolve, reject) => {
    try {
      const jsonInterface = kip7jsoninterface;
      const hexstring = kip7bytecode;

      const abi = await baobab.abi.encodeContractDeploy(
        jsonInterface,
        hexstring,
        name,
        symbol
      );

      const receipt = await baobab.transaction.smartContractDeploy.create({
        from: "0xadc565Bb88aA72aa14b98Cb6196f216900614b3c",
        input: abi,
        gas: 300000,
      });

      resolve({ abi, receipt });
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = contractDeploy;
