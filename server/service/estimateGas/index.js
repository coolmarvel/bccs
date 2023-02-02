const baobab = require("../../blockchain/klaytn/testnet");

const { logger } = require("../../utils/winston");

const estimateGas = (from, to, value) => {
  return new Promise(async (resolve, reject) => {
    try {
      const test = await baobab.klay.abi.encodeFunctionCall(
        {
          name: "VALUE_TRANSFER",
          type: "function",
          inputs: [
            { type: "string", name: "from" },
            { type: "string", name: "to" },
            { type: "uint256", name: "gas" },
            { type: "string", name: "value" },
          ],
        },
        [from, to, 3000000, baobab.utils.toPeb(value, "KLAY")]
      );

      const jest = await baobab.klay.estimateGas({
        to: to,
        data: test,
      });

      const a = 21000 * 750;
      console.log(a);
      const b = a / 1000000000;
      console.log(b);

      resolve({ test, jest });
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = estimateGas;
