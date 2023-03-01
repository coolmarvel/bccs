const getWeb3 = require("../getWeb3");
const getCaver = require("../getCaver");

const { logger } = require("../../utils/winston");
const { hexToDecimal } = require("../../utils/converter");

const deployContract = (chainId, abi, bytecode, privateKey) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (chainId == "1001" || chainId == "8217") {
        const caver = await getCaver(chainId);
        const account = await caver.klay.accounts.wallet.add(privateKey);

        const encoded = await caver.abi.encodeContractDeploy(abi, bytecode);
        const receipt = await caver.klay
          .sendTransaction({
            type: "SMART_CONTRACT_DEPLOY",
            from: account.address,
            data: encoded,
            gas: 100000000,
            value: caver.utils.toPeb("0", "KLAY"),
          })
          .then((response) => {
            const result = response;
            result.gas = hexToDecimal(result.gas);
            result.gasPrice = hexToDecimal(result.gasPrice);
            return result;
          });

        await caver.klay.accounts.wallet.remove(account.address);

        resolve(receipt);
      } else {
        const web3 = await getWeb3(chainId);
        const account = await web3.eth.accounts.wallet.add(privateKey);

        const tx = {
          from: account.address,
          data: bytecode,
          gas: 10000000,
          value: web3.utils.toWei("0", "ether"),
        };
        const rawTx = (await web3.eth.accounts.signTransaction(tx, privateKey))
          .rawTransaction;
        const receipt = await web3.eth.sendSignedTransaction(rawTx);

        await web3.eth.accounts.wallet.remove(account.address);

        resolve(receipt);
      }
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};

module.exports = deployContract;
