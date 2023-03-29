const getWeb3 = require("../../getWeb3");

const abi = require("../../../utils/data/ERC20/abi");
const { logger } = require("../../../utils/winston");

const makeSwap = require("./make");
const getPool = require("./getPool");
const getQuote = require("./getQuote");
const approveSwap = require("./approve");
const getTokenAndBalance = require("./getTokenAndBalance");

const swap = (chainId, privateKey, from, to, amount) => {
  return new Promise(async (resolve, reject) => {
    try {
      // ============= PART 1 --- connect to blockchain and get token balances
      logger.info("Connecting to blockchain, loading token balances...");

      const web3 = await getWeb3(chainId);
      const account = await web3.eth.accounts.wallet.add(privateKey);

      const contractIn = new web3.eth.Contract(abi, from.address);
      const contractOut = new web3.eth.Contract(abi, to.address);

      logger.info(`Wallet ${account.address}'s balances:`);
      const [tokenIn, balanceTokenIn] = await getTokenAndBalance(
        web3,
        chainId,
        contractIn,
        account.address
      );
      const [tokenOut, balanceTokenOut] = await getTokenAndBalance(
        web3,
        chainId,
        contractOut,
        account.address
      );

      // ============= PART 2 --- get Uniswap pool for pair TokenIn-TokenOut
      logger.info("Loading pool information...");
      const pool = await getPool(web3, tokenIn, tokenOut);

      // ============= PART 3 --- Giving a quote for user input
      logger.info("Loading up quote for a swap...");
      const amountIn = web3.utils.toWei(amount);

      // ============= PART 4 --- Loading a swap route
      logger.info("Loading a swap route...");
      const route = await getQuote(
        web3,
        pool,
        amount,
        amountIn,
        tokenIn,
        tokenOut,
        account.address
      );

      // ============= PART 5 --- Making actual swap
      logger.info("Approving amount to spend...");
      const approveReceipt = await approveSwap(account, amountIn, contractIn);

      logger.info("Making a swap...");
      const swapReceipt = await makeSwap(web3, route, account);

      // ============= Final part --- printing results
      const result = await getResult(
        contractIn,
        contractOut,
        tokenIn,
        tokenOut,
        account.address,
        approveReceipt,
        swapReceipt,
        web3
      );

      await web3.eth.accounts.wallet.remove(account.address);

      resolve(result);
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = swap;
