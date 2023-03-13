const ethers = require("ethers");
const { BigNumber } = require("@ethersproject/bignumber");

const { weth9ABI } = require("../WETH9");
const getSigner = require("../../getSigner");
const getProvider = require("../../getProvider");

const { logger } = require("../../../utils/winston");

const withdraw = (token, privateKey, amount) => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = await getProvider(token.chainId);
      const signer = await getSigner(privateKey, provider);
      const weth9 = new ethers.Contract(token.address, weth9ABI, signer);

      const withdrawTx = await weth9.withdraw(ethers.utils.parseUnits(amount), {
        gasLimit: BigNumber.from("800000"),
        // gasPrice: ethers.utils.parseUnits("10", "wei"),
        gasPrice: (await signer.getGasPrice()).toString(),
      });
      const withdrawReceipt = await withdrawTx.wait();

      resolve(withdrawReceipt);
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = withdraw;
