const ethers = require("ethers");
const { BigNumber } = require("@ethersproject/bignumber");

const { weth9ABI } = require("../WETH9");
const getSigner = require("../../getSigner");
const getBalance = require("../../getBalance");
const getProvider = require("../../getProvider");

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

const deposit = (token, privateKey, amount) => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = await getProvider(token.chainId);
      const signer = await getSigner(privateKey, provider);
      const balance = await getBalance(token.chainId, signer.address);
      if (balance < Number(amount))
        return reject({ message: "Not Enough Balance" });

      const weth9 = new ethers.Contract(token.address, weth9ABI, signer);

      const wrapTx = await weth9.deposit({
        value: ethers.utils.parseUnits(amount),
        gasLimit: BigNumber.from("800000"),
        // gasPrice: ethers.utils.parseUnits("10", "gwei"),
        gasPrice: (await signer.getGasPrice()).toString(),
      });
      const wrapReceipt = await wrapTx.wait();
      resolve(wrapReceipt);

      // // 이더리움
      // if (chainId == "1") {
      //   const weth9 = new ethers.Contract(
      //     ETHEREUM_WETH_ADDRESS,
      //     weth9ABI,
      //     signer
      //   );
      //   const weth9Balance = await weth9.balanceOf(signer.address);

      //   const wrapTx = await weth9.deposit({
      //     value: ethers.utils.parseUnits(amount),
      //     gasLimit: BigNumber.from("800000"),
      //     gasPrice: ethers.utils.parseUnits("10", "gwei"),
      //   });
      //   const wrapReceipt = await wrapTx.wait();
      //   resolve(wrapReceipt);
      // }
      // // 롭스텐
      // else if (chainId == "3") {
      //   const weth9 = new ethers.Contract(
      //     ROPSTEM_WETH_ADDRESS,
      //     weth9ABI,
      //     signer
      //   );
      //   const weth9Balance = await weth9.balanceOf(signer.address);

      //   const wrapTx = await weth9.deposit({
      //     value: ethers.utils.parseUnits(amount),
      //     gasLimit: BigNumber.from("800000"),
      //     gasPrice: ethers.utils.parseUnits("10", "gwei"),
      //   });
      //   const wrapReceipt = await wrapTx.wait();
      //   resolve(wrapReceipt);
      // }
      // // 링크비
      // else if (chainId == "4") {
      //   const weth9 = new ethers.Contract(
      //     RINKEBY_WETH_ADDRESS,
      //     weth9ABI,
      //     signer
      //   );
      //   const weth9Balance = await weth9.balanceOf(signer.address);

      //   const wrapTx = await weth9.deposit({
      //     value: ethers.utils.parseUnits(amount),
      //     gasLimit: BigNumber.from("800000"),
      //     gasPrice: ethers.utils.parseUnits("10", "gwei"),
      //   });
      //   const wrapReceipt = await wrapTx.wait();
      //   resolve(wrapReceipt);
      // }
      // // 괴를리
      // else if (chainId == "5") {
      //   const weth9 = new ethers.Contract(
      //     GOERLI_WETH_ADDRESS,
      //     weth9ABI,
      //     signer
      //   );
      //   const weth9Balance = await weth9.balanceOf(signer.address);

      //   const wrapTx = await weth9.deposit({
      //     value: ethers.utils.parseUnits(amount),
      //     gasLimit: BigNumber.from("800000"),
      //     gasPrice: ethers.utils.parseUnits("10", "gwei"),
      //   });
      //   const wrapReceipt = await wrapTx.wait();
      //   resolve(wrapReceipt);
      // }
      // // 코반
      // else if (chainId == "42") {
      //   const weth9 = new ethers.Contract(KOVAN_WETH_ADDRESS, weth9ABI, signer);
      //   const weth9Balance = await weth9.balanceOf(signer.address);

      //   const wrapTx = await weth9.deposit({
      //     value: ethers.utils.parseUnits(amount),
      //     gasLimit: BigNumber.from("800000"),
      //     gasPrice: ethers.utils.parseUnits("10", "gwei"),
      //   });
      //   const wrapReceipt = await wrapTx.wait();
      //   resolve(wrapReceipt);
      // }
      // // 옵티미즘
      // else if (chainId == "10") {
      //   const weth9 = new ethers.Contract(
      //     OPTIMISM_WETH_ADDRESS,
      //     weth9ABI,
      //     signer
      //   );
      //   const weth9Balance = await weth9.balanceOf(signer.address);

      //   const wrapTx = await weth9.deposit({
      //     value: ethers.utils.parseUnits(amount),
      //     gasLimit: BigNumber.from("800000"),
      //     gasPrice: ethers.utils.parseUnits("10", "gwei"),
      //   });
      //   const wrapReceipt = await wrapTx.wait();
      //   resolve(wrapReceipt);
      // }
      // // 옵티미스틱 코반
      // else if (chainId == "69") {
      //   const weth9 = new ethers.Contract(
      //     OPTIMISTIC_KOVAN_WETH_ADDRESS,
      //     weth9ABI,
      //     signer
      //   );
      //   const weth9Balance = await weth9.balanceOf(signer.address);

      //   const wrapTx = await weth9.deposit({
      //     value: ethers.utils.parseUnits(amount),
      //     gasLimit: BigNumber.from("800000"),
      //     gasPrice: ethers.utils.parseUnits("10", "gwei"),
      //   });
      //   const wrapReceipt = await wrapTx.wait();
      //   resolve(wrapReceipt);
      // }
      // // 아르빗럼 원 메인넷
      // else if (chainId == "42161") {
      //   const weth9 = new ethers.Contract(
      //     ARBITRUM_ONE_WETH_ADDRESS,
      //     weth9ABI,
      //     signer
      //   );
      //   const weth9Balance = await weth9.balanceOf(signer.address);

      //   const wrapTx = await weth9.deposit({
      //     value: ethers.utils.parseUnits(amount),
      //     gasLimit: BigNumber.from("800000"),
      //     gasPrice: ethers.utils.parseUnits("10", "gwei"),
      //   });
      //   const wrapReceipt = await wrapTx.wait();
      //   resolve(wrapReceipt);
      // }
      // // 아르빗럼 링크비 테스트넷
      // else if (chainId == "421611") {
      //   const weth9 = new ethers.Contract(
      //     ARBITRUM_RINKEBY_ADDRESS,
      //     weth9ABI,
      //     signer
      //   );
      //   const weth9Balance = await weth9.balanceOf(signer.address);

      //   const wrapTx = await weth9.deposit({
      //     value: ethers.utils.parseUnits(amount),
      //     gasLimit: BigNumber.from("800000"),
      //     gasPrice: ethers.utils.parseUnits("10", "gwei"),
      //   });
      //   const wrapReceipt = await wrapTx.wait();
      //   resolve(wrapReceipt);
      // }
      // // 폴리곤 메인넷
      // else if (chainId == "137") {
      //   const weth9 = new ethers.Contract(
      //     POLYGON_WETH_ADDRESS,
      //     weth9ABI,
      //     signer
      //   );
      //   const weth9Balance = await weth9.balanceOf(signer.address);

      //   const wrapTx = await weth9.deposit({
      //     value: ethers.utils.parseUnits(amount),
      //     gasLimit: BigNumber.from("800000"),
      //     gasPrice: ethers.utils.parseUnits("10", "gwei"),
      //   });
      //   const wrapReceipt = await wrapTx.wait();
      //   resolve(wrapReceipt);
      // }
      // // 폴리곤 테스트넷
      // else if (chainId == "80001") {
      //   const weth9 = new ethers.Contract(
      //     POLYGON_MUMBAI_WETH_ADDRESS,
      //     weth9ABI,
      //     signer
      //   );
      //   const weth9Balance = await weth9.balanceOf(signer.address);

      //   const wrapTx = await weth9.deposit({
      //     value: ethers.utils.parseUnits(amount),
      //     gasLimit: BigNumber.from("800000"),
      //     gasPrice: ethers.utils.parseUnits("10", "gwei"),
      //   });
      //   const wrapReceipt = await wrapTx.wait();
      //   resolve(wrapReceipt);
      // } else {
      //   return reject({ message: "Unsupported chainId" });
      // }
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = deposit;

//   const approvalTx = await signer.sendTransaction({
//     to: WETH9_ADDRESS,
//     value: ethers.utils.parseEther(amount),
//     gasLimit: BigNumber.from("800000"),
//     gasPrice: ethers.utils.parseUnits("10", "gwei"),
//   });
//   const approvalReceipt = await approvalTx.wait();
