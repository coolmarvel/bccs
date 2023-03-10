const getWeb3 = require("../../getWeb3");
const getCaver = require("../../getCaver");

const abi = require("../../../utils/data/ERC20/abi");
const { logger } = require("../../../utils/winston");

const transferToken = (
  chainId,
  fromAddress,
  fromPrivateKey,
  toAddress,
  contractAddress,
  value
) => {
  return new Promise(async (resolve, reject) => {
    try {
      // 클레이튼 테스트넷, 메인넷
      if (chainId == "1001" || chainId == "8217") {
        const caver = await getCaver(chainId);
        await caver.klay.accounts.wallet.add(fromPrivateKey);

        const isContractAccount = await caver.klay.isContractAccount(
          contractAddress
        );
        logger.info("isContractAddress: " + isContractAccount);

        if (isContractAccount) {
          const contract = new caver.klay.Contract(abi, contractAddress);
          const balance = await contract.methods.balanceOf(fromAddress).call();

          if (balance < value) return reject({ message: "Not enough balance" });

          const transferTx = contract.methods.transfer(toAddress, value);
          const transferABI = transferTx.encodeABI();

          const receipt = await caver.klay.sendTransaction(
            {
              type: "SMART_CONTRACT_EXECUTION",
              from: fromAddress,
              to: contractAddress,
              gas: "600000",
              data: transferABI,
              value: caver.utils.toPeb("0", "KLAY"),
            },
            fromPrivateKey
          );
          // const receipt = await contract.methods
          //   .transfer(toAddress, value)
          //   .send({ gas: "600000", from: fromAddress });

          await caver.klay.accounts.wallet.remove(fromAddress);
          resolve(receipt);
        } else {
          return reject({ message: "Invalid contractAddress" });
        }
      }
      // 이더리움 계열 네트워크
      else {
        const web3 = await getWeb3(chainId);
        await web3.eth.accounts.wallet.add(fromPrivateKey);

        const contract = new web3.eth.Contract(abi, contractAddress);
        const balance = await contract.methods.balanceOf(fromAddress).call();
        if (balance < value) return reject({ message: "Not enough balance" });

        const encoded = contract.methods.transfer(toAddress, value).encodeABI();
        const receipt = await web3.eth.sendTransaction({
          from: fromAddress,
          to: contractAddress,
          data: encoded,
          gas: "600000",
          value: web3.uitls.toWei("0", "ether"),
        });

        await web3.eth.accounts.wallet.remove(fromAddress);
        resolve(receipt);
      }
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = transferToken;
