const { weth9ABI } = require("../../WETH9");
const getWeb3 = require("../../../getWeb3");
const getBalance = require("../../../getBalance");

const { logger } = require("../../../../utils/winston");

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

// const ethers = require("ethers");
// const { BigNumber } = require("@ethersproject/bignumber");
// const getSigner = require("../../getSigner");
// const getProvider = require("../../getProvider");

// const {
//   ETHEREUM_WETH_ADDRESS,
//   ROPSTEM_WETH_ADDRESS,
//   RINKEBY_WETH_ADDRESS,
//   GOERLI_WETH_ADDRESS,
//   KOVAN_WETH_ADDRESS,
//   OPTIMISM_WETH_ADDRESS,
//   OPTIMISTIC_KOVAN_WETH_ADDRESS,
//   ARBITRUM_ONE_WETH_ADDRESS,
//   ARBITRUM_RINKEBY_ADDRESS,
//   POLYGON_WETH_ADDRESS,
//   POLYGON_MUMBAI_WETH_ADDRESS,
// } = process.env;

// const provider = await getProvider(token.chainId);
// const signer = await getSigner(privateKey, provider);
// const balance = await getBalance(token.chainId, signer.address);

// if (balance < Number(amount))
//   return reject({ message: "Not Enough Balance" });

// const weth9 = new ethers.Contract(token.address, weth9ABI, signer);

// const wrapTx = await weth9.deposit({
//   value: ethers.utils.parseUnits(amount),
//   gasLimit: BigNumber.from("800000"),
//   gasPrice: ethers.utils.parseUnits("10", "gwei"),
// });
// const wrapReceipt = await wrapTx.wait();

//   const approvalTx = await signer.sendTransaction({
//     to: WETH9_ADDRESS,
//     value: ethers.utils.parseEther(amount),
//     gasLimit: BigNumber.from("800000"),
//     gasPrice: ethers.utils.parseUnits("10", "gwei"),
//   });
//   const approvalReceipt = await approvalTx.wait();
