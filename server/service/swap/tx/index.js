const Web3 = require("web3");
const Bignumber = require("bignumber.js");

const { logger } = require("../../../utils/winston");

const erc20ABI = require("../erc20ABI");

const swapTX = async (from, quote, privateKey) => {
  return new Promise(async (resolve, reject) => {
    try {
      const web3 = new Web3("https://ethereum-sepolia-rpc.allthatnode.com");
      const accounts = await web3.eth.accounts.wallet.add(privateKey);
      const address = accounts.address;
      const fromAddress = from.address;
      const maxApproval = new Bignumber(2).pow(256).minus(1);
      const erc20TokenContract = new web3.eth.Contract(erc20ABI, fromAddress);
      const approveReceipt = await erc20TokenContract.methods
        .approve(quote.allowanceTarget, maxApproval)
        .send({ from: address, gas: 3000000 });
      const swapReceipt = await web3.eth
        .sendTransaction(quote)
        .on("transactionHash", console.log)
        .on("receipt", console.log)
        .on("error", console.error);
      const result = {
        approveReceipt: approveReceipt,
        swapReceipt: swapReceipt,
      };
      resolve(result);
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = swapTX;
