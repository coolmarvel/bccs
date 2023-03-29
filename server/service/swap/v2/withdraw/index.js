const { weth9ABI } = require("../../WETH9");
const getBalance = require("../getBalance");
const getWeb3 = require("../../../getWeb3");

const withdraw = (token, privateKey, amount) => {
  return new Promise(async (resolve, reject) => {
    try {
      const web3 = await getWeb3(token.chainId);
      const account = await web3.eth.accounts.wallet.add(privateKey);
      const balance = await getBalance(token.chainId, token, privateKey);

      if (balance < Number(amount))
        return reject({ message: "Not Enough Balance to Withdraw" });

      const weth9 = new web3.eth.Contract(weth9ABI, token.address);
      const withdrawReceipt = await weth9.methods
        .withdraw(web3.utils.toWei(amount))
        .send({ gas: "600000", from: account.address });

      await web3.eth.accounts.wallet.remove(account.address);

      resolve(withdrawReceipt);
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = withdraw;
