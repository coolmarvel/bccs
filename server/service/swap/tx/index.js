// uniswap and web3 modules
const ethers = require("ethers");

const abi = require("../../../utils/data/ERC20/abi");
const { logger } = require("../../../utils/winston");

const getPool = require("../getPool");
const getQuote = require("../getQuote");
const makeSwap = require("../makeSwap");
const getResult = require("../getResult");
const getSigner = require("../../getSigner");
const approveSwap = require("../approveSwap");
const getProvider = require("../../getProvider");
const getTokenAndBalance = require("../getTokenAndBalance");

const swapTx = async (
  chainId,
  address,
  privateKey,
  fromToken,
  toToken,
  amount
) => {
  return new Promise(async (resolve, reject) => {
    try {
      // ============= PART 1 --- connect to blockchain and get token balances
      logger.info("Connecting to blockchain, loading token balances...");

      // Ethers.js provider to access blockchain
      // As we're using Alchemy, it is JsonRpcProvider
      // In case of React app + MetaMask it should be initialized as "new ethers.providers.Web3Provider(window.ethereum);"

      const provider = await getProvider(chainId);
      const signer = await getSigner(privateKey, provider);

      // In case of React + Metamask it should be initialized as "provider.getSigner();"
      // as we already have signer provided by Metamask
      // const signer = wallet.provider.getSigner(wallet.address);

      // create token contracts and related objects
      logger.info(`Wallet ${address}'s balances:`);
      const contractIn = new ethers.Contract(fromToken, abi, signer);
      const contractOut = new ethers.Contract(toToken, abi, signer);

      const [tokenIn, balanceTokenIn] = await getTokenAndBalance(
        chainId,
        contractIn,
        address
      );
      const [tokenOut, balanceTokenOut] = await getTokenAndBalance(
        chainId,
        contractOut,
        address
      );

      logger.info(
        `Input: ${tokenIn.symbol} (${tokenIn.name}): ${ethers.utils.formatUnits(
          balanceTokenIn,
          tokenIn.decimals
        )}`
      );
      logger.info(
        `Output: ${tokenOut.symbol} (${
          tokenOut.name
        }): ${ethers.utils.formatUnits(balanceTokenOut, tokenOut.decimals)}`
      );

      // ============= PART 2 --- get Uniswap pool for pair TokenIn-TokenOut
      logger.info("Loading pool information...");
      const pool = await getPool(provider, tokenIn, tokenOut);

      // ============= PART 3 --- Giving a quote for user input
      logger.info("Loading up quote for a swap...");
      const amountIn = ethers.utils.parseUnits(amount, tokenIn.decimals);

      // ============= PART 4 --- Loading a swap route
      logger.info("Loading a swap route...");
      const route = await getQuote(
        provider,
        address,
        tokenIn,
        tokenOut,
        amountIn,
        amount,
        pool
      );

      // ============= PART 5 --- Making actual swap
      logger.info("Approving amount to spend...");
      const approveReceipt = await approveSwap(
        chainId,
        provider,
        signer,
        address,
        contractIn,
        amountIn
      );

      logger.info("Making a swap...");
      const receipt = await makeSwap(signer, route, address);

      // ============= Final part --- printing results
      const result = await getResult(
        contractIn,
        contractOut,
        tokenIn,
        tokenOut,
        approveReceipt,
        address,
        receipt
      );

      resolve(result);
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = swapTx;
