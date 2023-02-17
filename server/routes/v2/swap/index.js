const router = require("express").Router();

const { logger } = require("../../../utils/winston");

const ganache = require("../../../blockchain/ganache");
// const tokenJson = require("../../../../build/test/contracts/Token.json");
// const tokenAbi = tokenJson.abi;
// const tokenAddress = tokenJson.networks["5777"].address;
// const tokenInstance = new ganache.eth.Contract(tokenAbi, tokenAddress);

// const exchangeJson = require("../../../../build/test/contracts/Exchange.json");
// const exchangeAbi = exchangeJson.abi;
// const exchangeAddress = exchangeJson.networks["5777"].address;
// const exchangeInstance = new ganache.eth.Contract(exchangeAbi, exchangeAddress);

// const FactoryJson = require("../../../../build/test/contracts/Factory.json");
// const FactoryAbi = FactoryJson.abi;
// const FactoryAddress = FactoryJson.networks["5777"].address;
// const factoryInstance = new ganache.eth.Contract(FactoryAbi, FactoryAddress);

router.post("/", async (req, res) => {
  try {
    const { privateKey } = req.body;

    const accounts = await ganache.eth.accounts.wallet.add(privateKey);

    // approve transaction
    // const approveData = tokenInstance.methods.approve(
    //   exchangeAddress,
    //   ganache.utils.toWei("2", "ether")
    // );
    // const approveABI = approveData.encodeABI();
    // const signedApproveTx = await ganache.eth.accounts.signTransaction(
    //   {
    //     from: accounts.address,
    //     to: tokenAddress,
    //     gas: 2000000,
    //     data: approveABI,
    //   },
    //   accounts.privateKey
    // );
    // await ganache.eth
    //   .sendSignedTransaction(signedApproveTx.rawTransaction)
    //   .on("receipt", console.log);

    // addLiquidity transaction
    // const addLiquidityData = exchangeInstance.methods.addLiquidity(
    //   ganache.utils.toWei("2", "ether")
    // );
    // const addLiquidityABI = addLiquidityData.encodeABI();
    // const signedAddLiquidityTx = await ganache.eth.accounts.signTransaction(
    //   {
    //     from: accounts.address,
    //     to: exchangeAddress,
    //     gas: 2000000,
    //     data: addLiquidityABI,
    //     value: ganache.utils.toWei("1", "ether"),
    //   },
    //   accounts.privateKey
    // );
    // await ganache.eth
    //   .sendSignedTransaction(signedAddLiquidityTx.rawTransaction)
    //   .on("receipt", console.log);

    // const exchangeBalance = ganache.utils.fromWei(
    //   await ganache.eth.getBalance(exchangeAddress)
    // );
    // const getReserve = ganache.utils.fromWei(
    //   await exchangeInstance.methods.getReserve().call()
    // );
    // const ownerBalance = await tokenInstance.methods
    //   .balanceOf(accounts.address)
    //   .call();
    // const tokensOut = ganache.utils.fromWei(
    //   await exchangeInstance.methods
    //     .getTokenAmount(ganache.utils.toWei("1", "ether"))
    //     .call()
    // );
    // const ethOut = ganache.utils.fromWei(
    //   await exchangeInstance.methods
    //     .getEthAmount(ganache.utils.toWei("2", "ether"))
    //     .call()
    // );
    // console.log(exchangeBalance);
    // console.log(getReserve);
    // console.log(ownerBalance);
    // console.log(tokensOut);
    // console.log(ethOut);

    // token to eth swap transaction
    // const tokenToEthSwapData = exchangeInstance.methods.tokenToEthSwap(
    //   ganache.utils.toWei("2", "ether"),
    //   ganache.utils.toWei("0.9", "ether")
    // );
    // const tokenToEthSwapABI = tokenToEthSwapData.encodeABI();
    // const signedTokenToEthSwap = await ganache.eth.accounts.signTransaction(
    //   {
    //     from: accounts.address,
    //     to: exchangeAddress,
    //     gas: 2000000,
    //     data: tokenToEthSwapABI,
    //     value: ganache.utils.toWei("1", "ether"),
    //   },
    //   accounts.privateKey
    // );
    // const tokenToEthSwapReceipt = await ganache.eth
    //   .sendSignedTransaction(signedTokenToEthSwap.rawTransaction)
    //   .on("receipt", console.log);

    // res.send({
    //   ownerBalance,
    //   exchangeBalance,
    //   getReserve,
    //   tokensOut,
    //   ethOut,
    //   tokenToEthSwapReceipt,
    // });
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
