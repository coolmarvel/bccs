const getWeb3 = require("../getWeb3");
const getCaver = require("../getCaver");

const { logger } = require("../../utils/winston");

const valueTransfer = async (
  chainId,
  fromAddress,
  fromPrivateKey,
  toAddress,
  value
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (chainId == "1001" || chainId == "8217") {
        const caver = await getCaver(chainId);
        const account = await caver.klay.accounts.wallet.add(fromPrivateKey);

        const receipt = await caver.klay.sendTransaction({
          type: "VALUE_TRANSFER",
          from: account.address,
          to: toAddress,
          gas: 3000000,
          value: caver.utils.toPeb(value, "KLAY"),
        });

        await caver.klay.accounts.wallet.remove(account.address);
        resolve(receipt);

        resolve(true);
      } else {
        const web3 = await getWeb3(chainId);
        const account = await web3.eth.accounts.wallet.add(fromPrivateKey);

        const receipt = await web3.eth.sendTransaction({
          from: fromAddress,
          to: toAddress,
          gas: 3000000,
          value: web3.utils.toWei(value, "ether"),
        });

        await web3.eth.accounts.wallet.remove(account.address);
        resolve(receipt);
      }
    } catch (error) {
      logger.error(error.message);
      return reject(error);
    }
  });
};
module.exports = valueTransfer;
