const { logger } = require("../../../../utils/winston");

const { V3_SWAP_ROUTER_ADDRESS } = process.env;

const approveSwap = (
  chainId,
  provider,
  signer,
  address,
  contractIn,
  amountIn
) => {
  return new Promise(async (resolve, reject) => {
    try {
      // here we just create a transaction object (not sending it to blockchain).
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
      logger.info(approveReceipt);
      if (approveReceipt.status === 0)
        throw new Error("Approve transaction failed");

      resolve(approveReceipt);
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = approveSwap;
