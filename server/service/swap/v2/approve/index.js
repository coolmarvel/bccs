const { V3_SWAP_ROUTER_ADDRESS } = process.env;

const approveSwap = (account, amountIn, contractIn) => {
  return new Promise(async (resolve, reject) => {
    try {
      const receipt = await contractIn.methods
        .approve(V3_SWAP_ROUTER_ADDRESS, amountIn)
        .send({ from: account.address, gas: "600000" });

      if (receipt.status === 0) throw new Error("Approve transaction failed");

      resolve(receipt);
    } catch (error) {
      return reject(error);
    }
  });
};
module.exports = approveSwap;
