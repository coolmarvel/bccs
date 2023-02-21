const Web3 = require("web3");
const Bignumber = require("bignumber.js");

const { logger } = require("../../../utils/winston");

const erc20ABI = require("../erc20ABI");

const swapTX = async (from, to, quote, privateKey) => {
  return new Promise(async (resolve, reject) => {
    try {
      const web3 = new Web3(Web3.givenProvider);
      const accounts = await web3.eth.accounts.wallet.add(privateKey);
      const address = accounts.address;
      const fromAddress = from.address;
      const maxApproval = new Bignumber(2).pow(256).minus(1);
      logger.info("approval amount: " + maxApproval);

      const erc20TokenContract = new web3.eth.Contract(erc20ABI, fromAddress);
      logger.info("setup ERC20TokenContract: ", +erc20TokenContract);

      const approveReceipt = await erc20TokenContract.methods
        .approve(quote.allowanceTarget, maxApproval)
        .send({ from: address })
        .then((response) => {
          logger.info("approveReceipt: " + response);
        });

      const swapReceipt = await web3.eth.sendTransaction(quote);
      logger.info("swapReceipt: " + swapReceipt);

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
