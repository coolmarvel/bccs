const axios = require("axios");

const getCaver = require("../getCaver");
const getWeb3 = require("../getWeb3");

const { logger } = require("../../utils/winston");
const { hexToDecimal } = require("../../utils/converter");

const scan = (chainId, address) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (chainId == "1001" || chainId == "8217") {
        const caver = await getCaver(chainId);

        const txCount = await caver.klay.getTransactionCount(address);
        logger.info("txCount: " + txCount);

        const result = await axios
          .get(
            `https://api-baobab-v3.scope.klaytn.com/v2/accounts/${address}/txs?page=2`
          )
          .then((response) => response.data);

        resolve(result);
      } else {
        const web3 = await getWeb3(chainId);

        resolve(true);
      }
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = scan;
