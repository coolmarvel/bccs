const router = require("express").Router();

const bscTestProvider = require("../../../../../blockchain/binance/testnet");

const { logger } = require("../../../../../utils/winston");

const isValidChainId = require("../../../../../service/chainId");
const isValidAddress = require("../../../../../service/checksum/address");
const isValidPrivateKey = require("../../../../../service/checksum/privateKey");

const baobabEstimateGas = require("../../../../../service/estimateGas/valueTransfer/klaytn/testnet");
const cypressEstimateGas = require("../../../../../service/estimateGas/valueTransfer/klaytn/mainnet");
const mumbaiEstimateGas = require("../../../../../service/estimateGas/valueTransfer/polygon/testnet");
const polygonEstimateGas = require("../../../../../service/estimateGas/valueTransfer/polygon/mainnet");

router.get("/estimate", async (req, res) => {
  try {
    const { fromAddress, fromPrivateKey, toAddress, value } = req.body;

    const chainId = await isValidChainId(req);
    await isValidPrivateKey(fromPrivateKey);
    await isValidAddress(fromAddress);
    await isValidAddress(toAddress);

    // 클레이튼 테스트넷 클레이 전송 예상 가스비
    if (chainId == "1001") {
      const { gasPrice, estimateGas, txFee } = await baobabEstimateGas(
        fromAddress,
        fromPrivateKey,
        toAddress,
        value
      );
      res.send({ gasPrice, estimateGas, txFee });
    }
    // 클레이튼 메인넷 클레이 전송 예상 가스비
    else if (chainId == "8217") {
      const { gasPrice, estimateGas, txFee } = await cypressEstimateGas(
        fromAddress,
        fromPrivateKey,
        toAddress,
        value
      );
      res.send({ gasPrice, estimateGas, txFee });
    }
    // 폴리곤 테스트넷 메틱 전송 예상 가스비
    else if (chainId == "80001") {
      const { gasPrice, estimateGas, txFee } = await mumbaiEstimateGas(
        fromAddress,
        fromPrivateKey,
        toAddress,
        value
      );
      res.send({ gasPrice, estimateGas, txFee });
    }
    // 폴리곤 메인넷 메틱 전송 예상 가스비
    else if (chainId == "137") {
      const { gasPrice, estimateGas, txFee } = await polygonEstimateGas(
        fromAddress,
        fromPrivateKey,
        toAddress,
        value
      );
      res.send({ gasPrice, estimateGas, txFee });
    }
    // 바이낸스 테스트넷 비엔비 전송 예상 가스비
    else if (chainId == "97") {
      const bscTest = await bscTestProvider();
      await bscTest.eth.accounts.wallet.add(
        "0xa58f34a8853bde661ca77ad884faf3d355ebb1a54dc9ccab007f89e4b33cda8e"
      );
      const gasPrice = (await bscTest.eth.getGasPrice()) / 1000000000;
      const estimateGas = await bscTest.eth.estimateGas({
        to: "0x2dee005b923e510b129c0544b4d52b182e3778a3",
        gas: 3000000,
        value: bscTest.utils.toWei("1", "ether"),
      });
      await bscTest.eth.accounts.wallet.remove(
        "0xadc565Bb88aA72aa14b98Cb6196f216900614b3c"
      );
      const txFee = (gasPrice * estimateGas) / 1000000000;

      res.send({ gasPrice, gasUsed: estimateGas, txFee });
    }
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes("chainId required")) {
      res.status(403).send({ message: error.message });
    } else {
      res.status(404).send({ message: error.message });
    }
  }
});

module.exports = router;
