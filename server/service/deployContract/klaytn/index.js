const baobab = require("../../../blockchain/klaytn/testnet");

const { logger } = require("../../../utils/winston");
const { hexToDecimal } = require("../../../utils/converter");

const contractDeploy = (abi, bytecode, privateKey) => {
  return new Promise(async (resolve, reject) => {
    try {
      const account = await baobab.klay.accounts.wallet.add(privateKey);

      const encoded = await baobab.abi.encodeContractDeploy(abi, bytecode);
      const receipt = await baobab.klay
        .sendTransaction({
          type: "SMART_CONTRACT_DEPLOY",
          from: account.address,
          data: encoded,
          gas: 100000000,
          value: baobab.utils.toPeb("0", "KLAY"),
        })
        .then((response) => {
          const result = response;
          result.gas = hexToDecimal(result.gas);
          result.gasPrice = hexToDecimal(result.gasPrice);

          return result;
        });

      await baobab.klay.accounts.wallet.remove(account.address);

      resolve(receipt);
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = contractDeploy;
