const getWeb3 = require("../getWeb3");
const getCaver = require("../getCaver");

const { logger } = require("../../utils/winston");

const getBalance = async (chainId, address) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (chainId == "1001" || chainId == "8217") {
        const caver = await getCaver(chainId);

        const ret = await caver.rpc.klay.getBalance(address);
        const balance = await caver.utils.fromPeb(ret.toString(), "KLAY");

        resolve(balance);
      } else {
        const web3 = await getWeb3(chainId);

        const ret = await web3.eth.getBalance(address);
        const balance = await web3.utils.fromWei(ret);

        resolve(balance);
      }
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = getBalance;
