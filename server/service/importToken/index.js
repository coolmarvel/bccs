const getWeb3 = require("../getWeb3");
const getCaver = require("../getCaver");

const { logger } = require("../../utils/winston");
const abi = require("../../utils/data/kip7/abi");

const importToken = (chainId, contractAddress, address) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (chainId == "1001" || chainId == "8217") {
        const caver = await getCaver("1001");
        const isContractAccount = await caver.klay.isContractAccount(
          contractAddress
        );
        logger.info("isContractAddress: " + isContractAccount);

        if (isContractAccount) {
          const contract = new caver.klay.Contract(abi, contractAddress);

          const symbol = await contract.methods.symbol().call();
          const decimals = await contract.methods.decimals().call();
          const balance = await contract.methods.balanceOf(address).call();

          logger.info("symbol: " + symbol);
          logger.info("decimal: " + decimals);
          logger.info("balance: " + balance);

          const result = {
            chainId: chainId,
            symbol: symbol,
            decimals: decimals,
            balance: balance,
            address: address,
            contractAddress: contractAddress,
          };
          resolve(result);
        } else {
          return reject({ message: "Invalid contractAddress" });
        }
      } else {
        const web3 = await getWeb3(chainId);

        const contract = new web3.eth.Contract(abi, contractAddress);

        const symbol = await contract.methods.symbol().call();
        const decimals = await contract.methods.decimals().call();
        const balance = await contract.methods.balanceOf(address).call();

        logger.info("symbol: " + symbol);
        logger.info("decimal: " + decimals);
        logger.info("balance: " + balance);

        const result = {
          chainId: chainId,
          symbol: symbol,
          decimals: decimals,
          balance: balance,
          address: address,
          contractAddress: contractAddress,
        };
        resolve(result);
      }
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = importToken;
