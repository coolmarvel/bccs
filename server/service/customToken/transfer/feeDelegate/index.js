const getCaver = require("../../../getCaver");

const abi = require("../../../../utils/data/ERC20/abi");
const { logger } = require("../../../../utils/winston");

const feeDelegateTokenTransfer = (
  chainId,
  fromAddress,
  fromPrivateKey,
  toAddress,
  feePayAddress,
  feePayPrivateKey,
  contractAddress,
  value
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (chainId == "1001" || chainId == "8217") {
        const caver = await getCaver(chainId);
        await caver.klay.accounts.wallet.add(fromPrivateKey);
        await caver.klay.accounts.wallet.add(feePayPrivateKey);

        const isContract = await caver.klay.isContractAccount(contractAddress);
        if (!isContract) return reject({ message: "Invalid contractAddress" });

        const contract = new caver.klay.Contract(abi, contractAddress);

        const balance = await contract.methods.balanceOf(fromAddress);
        if (balance < value) return reject({ message: "Not enough balance" });

        const tx = contract.methods.transfer(toAddress, value);
        const txABI = tx.encodeABI();
        const { rawTransaction: senderRawTransaction } =
          await caver.klay.accounts.signTransaction(
            {
              type: "FEE_DELEGATED_SMART_CONTRACT_EXECUTION",
              from: fromAddress,
              to: contractAddress,
              gas: "600000",
              data: txABI,
              value: caver.utils.toPeb("0", "KLAY"),
            },
            fromPrivateKey
          );
        const receipt = await caver.klay.sendTransaction({
          senderRawTransaction: senderRawTransaction,
          feePayer: feePayAddress,
        });

        await caver.klay.accounts.wallet.remove(fromAddress);
        await caver.klay.accounts.wallet.remove(feePayAddress);
        resolve(receipt);
      }
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = feeDelegateTokenTransfer;
