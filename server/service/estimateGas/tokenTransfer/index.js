const getWeb3 = require("../../getWeb3");
const getCaver = require("../../getCaver");

const abi = require("../../../utils/data/ERC20/abi");

const estimateGas = (
  chainId,
  fromAddress,
  fromPrivateKey,
  toAddress,
  contractAddress,
  value
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (chainId == "1001" || chainId == "8217") {
        const caver = await getCaver(chainId);
        await caver.klay.accounts.wallet.add(fromPrivateKey);

        const contract = new caver.klay.Contract(abi, contractAddress);
        const estimatedGas = await contract.methods
          .transfer(toAddress, value)
          .estimateGas({ gas: "600000", from: fromAddress });
        const gasPrice = (await caver.rpc.klay.getGasPrice()) / 1000000000;
        const txFee = (gasPrice * estimatedGas) / 1000000000;

        const result = {
          gasPrice: gasPrice,
          estimatedGas: estimatedGas,
          txFee: txFee,
        };

        await caver.klay.accounts.wallet.remove(fromAddress);
        resolve(result);
      } else {
        const web3 = await getWeb3(chainId);
        resolve();
      }
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = estimateGas;
