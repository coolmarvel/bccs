const provider = require("../../../../blockchain/polygon/testnet");

const { logger } = require("../../../../utils/winston");

const deployContract = (abi, bytecode, privateKey) => {
  return new Promise(async (resolve, reject) => {
    try {
      const mumbai = await provider();
      const account = await mumbai.eth.accounts.wallet.add(privateKey);

      const tx = {
        from: account.address,
        data: bytecode,
        gas: 10000000,
        value: mumbai.utils.toWei("0", "ether"),
      };
      const signedTx = await mumbai.eth.accounts.signTransaction(
        tx,
        privateKey
      );
      const receipt = await mumbai.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );

      await mumbai.eth.accounts.wallet.remove(account.address);

      resolve(receipt);
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = deployContract;

//   const contract = new mumbai.eth.Contract(abi);
//   const receipt = await contract
//     .deploy({ data: bytecode })
//     .send({ from: account.address, gas: 10000000 })
//     .then((response) => {
//       logger.info(response);
//       return response;
//     });
