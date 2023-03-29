const { weth9ABI } = require("../../WETH9");
const getWeb3 = require("../../../getWeb3");
const getBalance = require("../getWrapTokenBalance");

const { logger } = require("../../../../utils/winston");

const withdraw = (token, privateKey, amount) => {
  return new Promise(async (resolve, reject) => {
    try {
      const web3 = await getWeb3(token.chainId);
      const account = await web3.eth.accounts.wallet.add(privateKey);
      const balance = await getBalance(token.chainId, token, privateKey);

      if (balance < Number(amount))
        return reject({ message: "Not Enough Balance" });

      const weth9 = new web3.eth.Contract(weth9ABI, token.address);

      const withdrawReceipt = await weth9.methods
        .withdraw(web3.utils.toWei(amount))
        .send({ gas: "600000", from: account.address });

      resolve(withdrawReceipt);
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = withdraw;

// const ethers = require("ethers");
// const { BigNumber } = require("@ethersproject/bignumber");
// const getSigner = require("../../getSigner");
// const getProvider = require("../../getProvider");

// const provider = await getProvider(token.chainId);
// const signer = await getSigner(privateKey, provider);
// const weth9 = new ethers.Contract(token.address, weth9ABI, signer);

// const withdrawTx = await weth9.withdraw(ethers.utils.parseUnits(amount), {
//   gasLimit: BigNumber.from("800000"),
//   gasPrice: ethers.utils.parseUnits("10", "wei"),
// });
// const withdrawReceipt = await withdrawTx.wait();
