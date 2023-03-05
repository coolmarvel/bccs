const axios = require("axios");
const qs = require("qs");

const { logger } = require("../../../utils/winston");

const getQuote = async (from, to, value, address) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!from || !to || !value || !address) {
        return reject({ message: "params are required" });
      }

      const amount = Number(value * 10 ** from.decimals);
      const params = {
        buyToken: from.address,
        sellToken: to.address,
        sellAmount: amount,
        takerAddress: address,
        skipValidation: true,
      };
      const result = await axios
        .get(`https://api.0x.org/swap/v1/quote?${qs.stringify(params)}`)
        .then((response) => {
          return response.data;
        });
      // const response = await fetch(
      //   `https://api.0x.org/swap/v1/quote?${qs.stringify(params)}`
      // );
      // const result = await response.json();

      resolve(result);
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = getQuote;
