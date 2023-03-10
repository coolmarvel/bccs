const router = require("express").Router();

const UNISWAP_ABI = require("../../../../utils/data/uniswap/v2/");
const { logger } = require("../../../../utils/winston");

const swapTX = require("../../../../service/swap/tx");
const getQuote = require("../../../../service/swap/getQuote");

router.post("/tx", async (req, res) => {
  try {
    const { from, to, value, address, privateKey, contractAddress } = req.body;

    // const quote = await getQuote(from, to, value, address);
    // const receipt = await swapTX(from, quote, privateKey);
    // res.send(receipt);

    const YOUR_ETHEREUM_ADDRESS = "0x2a4BB4f179cc07Ce568e07d8f5f7403B8eb7F79d";

    const Web3 = require("web3");
    const {
      ChainId,
      Token,
      WETH,
      Fetcher,
      Route,
      Trade,
      TokenAmount,
      TradeType,
    } = require("@uniswap/sdk");

    // Connect to the Ethereum network
    const web3 = new Web3(
      new Web3.providers.HttpProvider(
        "https://goerli.infura.io/v3/bb93cba8bc9e4f918a8fd1418663c5f1"
      )
    );

    // Define the Uniswap v2 contract address
    const uniswapAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

    // Define the Ethereum addresses of the tokens you want to swap
    // const tokenAddress = "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2"; // Maker (MKR) token
    const tokenAddress = contractAddress;
    const wethAddress = WETH[5].address;
    logger.info(tokenAddress);
    logger.info(wethAddress);

    // Load the tokens you want to swap
    const [token, weth] = await Promise.all([
      Fetcher.fetchTokenData(5, tokenAddress),
      Fetcher.fetchTokenData(5, wethAddress),
    ]);

    // Calculate the Uniswap v2 exchange route
    const pair = await Fetcher.fetchPairData(token, weth);
    const route = new Route([pair], weth);

    // Define the amount of tokens to swap
    const amountIn = "1000000000000000000"; // 1 MKR
    const tokenAmount = new TokenAmount(token, amountIn);

    // Calculate the minimum amount of ETH to receive
    const trade = new Trade(route, tokenAmount, TradeType.EXACT_INPUT);
    const amountOutMin = trade.minimumAmountOut(0.01).raw; // Minimum 0.01 ETH

    // Approve the Uniswap v2 contract to spend your tokens
    const uniswapContract = new web3.eth.Contract(UNISWAP_ABI, uniswapAddress);
    const approveTx = await token.approve(uniswapAddress, amountIn, {
      from: YOUR_ETHEREUM_ADDRESS,
    });
    await web3.eth.waitForTransaction(approveTx.transactionHash);

    // Swap the tokens for ETH
    const swapTx = await uniswapContract.methods
      .swapExactTokensForETH(
        amountIn,
        amountOutMin,
        [tokenAddress, wethAddress],
        YOUR_ETHEREUM_ADDRESS,
        Date.now() + 1000 * 60 * 10 // Deadline: 10 minutes from now
      )
      .send({ from: YOUR_ETHEREUM_ADDRESS });

    console.log(
      `Swapped ${amountIn} ${token.symbol} for ${swapTx.events["0"].args[1]} ETH`
    );

    res.send({ tx });
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
