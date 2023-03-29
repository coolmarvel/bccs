const { weth9ABI } = require("../../WETH9");
const getWeb3 = require("../../../getWeb3");
const getBalance = require("../../../getBalance");

const deposit = (token, privateKey, amount) => {
  return new Promise(async (resolve, reject) => {
    try {
      const web3 = await getWeb3(token.chainId);
      const account = await web3.eth.accounts.wallet.add(privateKey);
      const balance = await getBalance(token.chainId, account.address);

      if (balance < Number(amount))
        return reject({ message: "Not Enough Balance" });

      const weth9 = new web3.eth.Contract(weth9ABI, token.address);

      const wrapReceipt = await weth9.methods.deposit().send({
        gas: "600000",
        from: account.address,
        value: web3.utils.toWei(amount),
      });

      await web3.eth.accounts.wallet.remove(account.address);

      resolve(wrapReceipt);
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = deposit;
