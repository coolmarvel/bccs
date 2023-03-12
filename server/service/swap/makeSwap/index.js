const { BigNumber } = require("@ethersproject/bignumber");

const { V3_SWAP_ROUTER_ADDRESS } = process.env;

const makeSwap = (signer, route, address) => {
  return new Promise(async (resolve, reject) => {
    try {
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

      resolve(receipt);
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = makeSwap;
