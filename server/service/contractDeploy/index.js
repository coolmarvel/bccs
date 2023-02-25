const baobab = require("../../blockchain/klaytn/testnet");

const { logger } = require("../../utils/winston");
const { hexToDecimal } = require("../../utils/converter");
const kip7bytecode = require("../../utils/data/kip7/bytecode");
const kip7jsoninterface = require("../../utils/data/kip7/abi");

const contractDeploy = (name, symbol, privateKey) => {
  return new Promise(async (resolve, reject) => {
    try {
      const account = await baobab.klay.accounts.wallet.add(privateKey);

      const jsonInterface = kip7jsoninterface;
      const hexstring = kip7bytecode;
      const abi = await baobab.abi.encodeContractDeploy(
        jsonInterface,
        hexstring,
        name,
        symbol
      );
      const contract = await baobab.transaction.smartContractDeploy.create({
        from: account.address,
        input: abi,
        gas: 300000,
      });
      const receipt = await baobab.klay
        .sendTransaction({
          type: "SMART_CONTRACT_DEPLOY",
          from: account.address,
          data: abi,
          gas: 3000000,
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
