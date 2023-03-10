const getCaver = require("../../../getCaver");

const abi = require("../../../../utils/data/ERC20/abi");

const estimateGas = (
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

        const isContract = await caver.klay.isContractAccount(contractAddress);
        if (!isContract) return reject({ message: "Invalid contractAddress" });

        const contract = new caver.klay.Contract(abi, contractAddress);
        const encode = contract.methods.transfer(toAddress, value).encodeABI();
        const rawTx = (
          await caver.klay.accounts.signTransaction(
            {
              type: "FEE_DELEGATED_SMART_CONTRACT_EXECUTION",
              from: fromAddress,
              to: contractAddress,
              data: encode,
              gas: "600000",
              value: caver.utils.toPeb("0", "KLAY"),
            },
            fromPrivateKey
          )
        ).rawTransaction;
        const estimatedGas = await caver.klay.estimateGas({
          feePayer: feePayAddress,
          senderRawTranaction: rawTx,
        });
        const gasPrice = (await caver.klay.getGasPrice()) / 1000000000;
        const txFee = (gasPrice * estimatedGas) / 1000000000;

        const result = {
          gasPrice: gasPrice,
          estimatedGas: estimatedGas,
          txFee: txFee,
        };
        resolve(result);
      }
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = estimateGas;
