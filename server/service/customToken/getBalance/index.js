const getWeb3 = require("../../getWeb3");
const getCaver = require("../../getCaver");

const abi = require("../../../utils/data/ERC20/abi");

const getBalance = (chainId, address, contractAddress) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (chainId == "1001" || chainId == "8217") {
        const caver = await getCaver(chainId);

        const contract = new caver.klay.Contract(abi, contractAddress);
        const balance = await contract.methods.balanceOf(address).call();

        resolve(balance);
      } else {
        const web3 = await getWeb3(chainId);

        const contract = new web3.eth.Contract(abi, contractAddress);
        const balance = await contract.methods.balanceOf(address).call();

        resolve(balance);
      }
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = getBalance;
