const axios = require("axios");
const qs = require("qs");

const { logger } = require("../../../utils/winston");

const getPrice = async (from, to, value) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!from || !to || !value) {
        return reject({ message: "from to value is required" });
      }

      const amount = Number(value * 10 ** from.decimals);
      const params = {
        sellToken: from.address,
        buyToken: to.address,
        sellAmount: amount,
      };
      const response = await axios
        .get(`https://api.0x.org/swap/v1/price?${qs.stringify(params)}`)
        .then((response) => {
          return response.data;
        });
      const toAmount = response.buyAmount / 10 ** to.decimals;
      const estimatedGas = response.estimatedGas;
      const result = {
        toAmount: toAmount,
        estimatedGas: estimatedGas,
      };

      resolve(result);
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = getPrice;
