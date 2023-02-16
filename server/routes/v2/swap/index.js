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
    //   ganache.utils.toWei("200")
    // );
    // const approveABI = approveData.encodeABI();
    // const signedApproveTx = await ganache.eth.accounts.signTransaction(
    //   {
    //     from: accounts.address,
    //     to: tokenAddress,
    //     gas: 2000000,
    //     data: approveABI,
    //   },
    //   privateKey
    // );
    // console.log("signedApproveTx", signedApproveTx);
    // const approveReceipt = await ganache.eth
    //   .sendSignedTransaction(signedApproveTx.rawTransaction)
    //   .on("approveReceipt", console.log);

    // addLiquidity transaction
    // const addLiquidityData = exchangeInstance.methods.addLiquidity(
    //   ganache.utils.toWei("200")
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
    //   privateKey
    // );
    // const addLiquidityReceipt = await ganache.eth
    //   .sendSignedTransaction(signedAddLiquidityTx.rawTransaction)
    //   .on("approveReceipt", console.log);

    const exchangeBalance = await ganache.eth.getBalance(exchangeAddress);
    const getReserve = await exchangeInstance.methods.getReserve().call();
    const ownerBalance = await tokenInstance.methods
      .balanceOf(accounts.address)
      .call();

    res.send({ ownerBalance, exchangeBalance, getReserve });
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
