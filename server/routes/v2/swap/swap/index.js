const router = require("express").Router();

const abi = require("../../../../utils/data/ERC20/abi");
const { logger } = require("../../../../utils/winston");

const getWeb3 = require("../../../../service/getWeb3");
const isValidChainId = require("../../../../service/chainId");
const isValidAddress = require("../../../../service/checksum/address");
const isValidPrivateKey = require("../../../../service/checksum/privateKey");

// command-line utilities
const ethers = require("ethers");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

// uniswap and web3 modules
const {
  Token,
  Percent,
  TradeType,
  CurrencyAmount,
} = require("@uniswap/sdk-core");
const { Pool } = require("@uniswap/v3-sdk");
const { BigNumber } = require("@ethersproject/bignumber");
const { AlphaRouter } = require("@uniswap/smart-order-router");
const QuoterABI = require("@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json");
const IUniswapV3Pool = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");
const IUniswapV3Factory = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json");

router.post("/swap", async (req, res) => {
  try {
    const { address, privateKey, fromToken, toToken, amount } = req.body;

    const chainId = parseInt(await isValidChainId(req));
    await isValidPrivateKey(privateKey);
    await isValidAddress(address);

    const provider = new ethers.providers.JsonRpcProvider(
      "https://goerli.infura.io/v3/9d4c5b0d33a24161b25ca891e93fcb8e",
      chainId
    );
    const signer = new ethers.Wallet(privateKey, provider);

    const contractIn = new ethers.Contract(fromToken, abi, signer);
    const contractOut = new ethers.Contract(toToken, abi, signer);

    const getTokenAndBalance = async (contract) => {
      let [decimals, symbol, name, balance] = await Promise.all([
        contract.decimals(),
        contract.symbol(),
        contract.name(),
        contract.balanceOf(address),
      ]);

      return [
        new Token(chainId, contract.address, decimals, symbol, name),
        balance,
      ];
    };

    const [tokenIn, balanceTokenIn] = await getTokenAndBalance(contractIn);
    const [tokenOut, balanceTokenOut] = await getTokenAndBalance(contractOut);

    const UNISWAP_FACTORY_ADDRESS =
      "0x1F98431c8aD98523631AE4a59f267346ea31F984";
    const factoryContract = new ethers.Contract(
      UNISWAP_FACTORY_ADDRESS,
      IUniswapV3Factory.abi,
      provider
    );

    // loading pool smart contract address
    const poolAddress = await factoryContract.getPool(
      tokenIn.address,
      tokenOut.address,
      3000
    ); // commission - 3%

    if (Number(poolAddress).toString() === "0")
      // there is no such pool for provided In-Out tokens.
      throw `Error: No pool ${tokenIn.symbol}-${tokenOut.symbol}`;

    const poolContract = new ethers.Contract(
      poolAddress,
      IUniswapV3Pool.abi,
      provider
    );

    const getPoolState = async function () {
      const [liquidity, slot] = await Promise.all([
        poolContract.liquidity(),
        poolContract.slot0(),
      ]);

      return {
        liquidity: liquidity,
        sqrtPriceX96: slot[0],
        tick: slot[1],
        observationIndex: slot[2],
        observationCardinality: slot[3],
        observationCardinalityNext: slot[4],
        feeProtocol: slot[5],
        unlocked: slot[6],
      };
    };

    const getPoolImmutables = async function () {
      const [factory, token0, token1, fee, tickSpacing, maxLiquidityPerTick] =
        await Promise.all([
          poolContract.factory(),
          poolContract.token0(),
          poolContract.token1(),
          poolContract.fee(),
          poolContract.tickSpacing(),
          poolContract.maxLiquidityPerTick(),
        ]);

      return {
        factory: factory,
        token0: token0,
        token1: token1,
        fee: fee,
        tickSpacing: tickSpacing,
        maxLiquidityPerTick: maxLiquidityPerTick,
      };
    };

    // loading immutable pool parameters and its current state (variable parameters)
    const [immutables, state] = await Promise.all([
      getPoolImmutables(),
      getPoolState(),
    ]);

    const pool = new Pool(
      tokenIn,
      tokenOut,
      immutables.fee,
      state.sqrtPriceX96.toString(),
      state.liquidity.toString(),
      state.tick
    );

    const amountIn = ethers.utils.parseUnits(amount, tokenIn.decimals);

    const UNISWAP_QUOTER_ADDRESS = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6";
    const quoterContract = new ethers.Contract(
      UNISWAP_QUOTER_ADDRESS,
      QuoterABI.abi,
      provider
    );

    const quotedAmountOut =
      await quoterContract.callStatic.quoteExactInputSingle(
        tokenIn.address,
        tokenOut.address,
        pool.fee,
        amountIn,
        0
      );

    const inAmount = CurrencyAmount.fromRawAmount(tokenIn, amountIn.toString());

    const alphaRouter = new AlphaRouter({
      chainId: tokenIn.chainId,
      provider: provider,
    });

    const route = await alphaRouter.route(
      inAmount,
      tokenOut,
      TradeType.EXACT_INPUT,
      {
        recipient: address,
        slippageTolerance: new Percent(5, 100), // Big slippage – for a test
        deadline: Math.floor(Date.now() / 1000 + 1800), // add 1800 seconds – 30 mins deadline
      },
      { maxSwapsPerPath: 1 }
    );

    if (route == null || route.methodParameters === undefined)
      throw "No route loaded";

    const V3_SWAP_ROUTER_ADDRESS = "0x4648a43B2C14Da09FdF82B161150d3F634f40491"; // here we just create a transaction object (not sending it to blockchain).
    const approveTxUnsigned = await contractIn.populateTransaction.approve(
      V3_SWAP_ROUTER_ADDRESS,
      amountIn
    );
    // by default chainid is not set https://ethereum.stackexchange.com/questions/94412/valueerror-code-32000-message-only-replay-protected-eip-155-transac
    approveTxUnsigned.chainId = chainId;
    // estimate gas required to make approve call (not sending it to blockchain either)
    approveTxUnsigned.gasLimit = await contractIn.estimateGas.approve(
      V3_SWAP_ROUTER_ADDRESS,
      amountIn
    );
    // suggested gas price (increase if you want faster execution)
    approveTxUnsigned.gasPrice = await provider.getGasPrice();
    // nonce is the same as number previous transactions
    approveTxUnsigned.nonce = await provider.getTransactionCount(address);

    // sign transaction by our signer
    const approveTxSigned = await signer.signTransaction(approveTxUnsigned);
    // submit transaction to blockchain
    const submittedTx = await provider.sendTransaction(approveTxSigned);
    // wait till transaction completes
    const approveReceipt = await submittedTx.wait();
    if (approveReceipt.status === 0)
      throw new Error("Approve transaction failed");

    const value = BigNumber.from(route.methodParameters.value);
    const transaction = {
      data: route.methodParameters.calldata,
      to: V3_SWAP_ROUTER_ADDRESS,
      value: value,
      from: address,
      gasPrice: route.gasPriceWei,

      // route.estimatedGasUsed might be too low!
      // most of swaps I tested fit into 300,000 but for some complex swaps this gas is not enough.
      // Loot at etherscan/polygonscan past results.
      gasLimit: BigNumber.from("800000"),
    };

    const tx = await signer.sendTransaction(transaction);
    const receipt = await tx.wait();
    if (receipt.status === 0) {
      throw new Error("Swap transaction failed");
    }

    const [newBalanceIn, newBalanceOut] = await Promise.all([
      contractIn.balanceOf(address),
      contractOut.balanceOf(address),
    ]);

    res.send({ newBalanceIn, newBalanceOut });
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
