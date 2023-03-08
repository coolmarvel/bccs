const getWeb3 = require("../getWeb3");
const getCaver = require("../getCaver");

const { logger } = require("../../utils/winston");
const jsoninterface = require("../../utils/data/kip7/abi");

const importToken = (chainId, contractAddress) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (chainId == "1001" || chainId == "8217") {
        const caver = await getCaver("1001");

        const result = await caver.klay.isContractAccount(contractAddress);
      } else {
        const web3 = await getWeb3(chainId);

        const contract = new web3.eth.Contract(jsoninterface, contractAddress);
        logger.info(contract.options.address);

        const symbol = await contract.methods.symbol().call();
        logger.info("symbol: " + symbol);

        const decimal = await contract.methods.decimals().call();
        logger.info("decimal: " + decimal);

        const balance = await contract.methods
          .balanceOf("0xee520d6a09d12c75ff9b2f2f0e56f780c48cab9f")
          .call();
        logger.info("balance: " + balance);
      }

      resolve(true);
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = importToken;
