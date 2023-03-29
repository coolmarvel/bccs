const { weth9ABI } = require("../../WETH9");
const getWeb3 = require("../../../getWeb3");

const getBalance = (chainId, token, privateKey) => {
  return new Promise(async (resolve, reject) => {
    try {
      const web3 = await getWeb3(chainId);
      const account = await web3.eth.accounts.wallet.add(privateKey);

      const weth9 = new web3.eth.Contract(weth9ABI, token.address);
      const balance = await weth9.methods.balanceOf(account.address).call();

      await web3.eth.accounts.wallet.remove(account.address);
      resolve(web3.utils.fromWei(balance, "ether"));
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = getBalance;
