const { V3_SWAP_ROUTER_ADDRESS } = process.env;

const makeSwap = (web3, route, account) => {
  return new Promise(async (resolve, reject) => {
    try {
      const tx = {
        from: account.address,
        to: V3_SWAP_ROUTER_ADDRESS,
        gas: "600000",
        data: route.methodParameters.calldata,
        value: route.methodParameters.value,
      };
      const receipt = await web3.eth.sendTransaction(tx);

      resolve(receipt);
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = makeSwap;
