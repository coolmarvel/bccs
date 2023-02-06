const router = require("express").Router();

const { logger } = require("../../../../../utils/winston");

const isValidChainId = require("../../../../../service/chainId");
const isValidAddress = require("../../../../../service/checksum/address");
const isValidPrivateKey = require("../../../../../service/checksum/privateKey");
const baobabKlayTansfer = require("../../../../../service/valueTransfer/klaytn/testnet");
const cypressKlayTransfer = require("../../../../../service/valueTransfer/klaytn/mainnet");
const bscTestBNBTransfer = require("../../../../../service/valueTransfer/binance/testnet");
const bscMainBNBTransfer = require("../../../../../service/valueTransfer/binance/mainnet");
const mumbaiMaticTransfer = require("../../../../../service/valueTransfer/polygon/testnet");
const polygonMaticTransfer = require("../../../../../service/valueTransfer/polygon/mainnet");
const ethereumEtherTransfer = require("../../../../../service/valueTransfer/ethereum/mainnet/");
const goerliEtherTransfer = require("../../../../../service/valueTransfer/ethereum/testnet/goerli");
const sepoliaEtherTransfer = require("../../../../../service/valueTransfer/ethereum/testnet/sepolia");

router.post("/", async (req, res) => {
  try {
    const { fromAddress, fromPrivateKey, toAddress, value } = req.body;

    const chainId = await isValidChainId(req);
    await isValidPrivateKey(fromPrivateKey);
    await isValidAddress(fromAddress);
    await isValidAddress(toAddress);

    // 클레이튼 테스트넷 클레이 전송
    if (chainId == "1001") {
      const receipt = await baobabKlayTansfer(
        fromAddress,
        fromPrivateKey,
        toAddress,
        value
      );
      res.send({ receipt });
    }
    // 클레이튼 메인넷 클레이 전송
    else if (chainId == "8217") {
      const receipt = await cypressKlayTransfer(
        fromAddress,
        fromPrivateKey,
        toAddress,
        value
      );
      res.send({ receipt });
    }
    // 폴리곤 테스트넷 메틱 전송
    else if (chainId == "80001") {
      const receipt = await mumbaiMaticTransfer(
        fromAddress,
        fromPrivateKey,
        toAddress,
        value
      );
      res.send({ receipt });
    }
    // 폴리곤 메인넷 메틱 전송
    else if (chainId == "137") {
      const receipt = await polygonMaticTransfer(
        fromAddress,
        fromPrivateKey,
        toAddress,
        value
      );
      res.send({ receipt });
    }
    // 이더리움 괴를리 테스트넷 이더 전송
    else if (chainId == "5") {
      const receipt = await goerliEtherTransfer(
        fromAddress,
        fromPrivateKey,
        toAddress,
        value
      );
      res.send({ receipt });
    }
    // 이더리움 세폴리아 테스트넷 이더 전송
    else if (chainId == "11155111") {
      const receipt = await sepoliaEtherTransfer(
        fromAddress,
        fromPrivateKey,
        toAddress,
        value
      );
      res.send({ receipt });
    }
    // 이더리움 메인넷 이더 전송
    else if (chainId == "1") {
      const receipt = await ethereumEtherTransfer(
        fromAddress,
        fromPrivateKey,
        toAddress,
        value
      );
      res.send({ receipt });
    }
    // 바이낸스 테스트넷 비엔비 전송
    else if (chainId == "97") {
      const receipt = await bscTestBNBTransfer(
        fromAddress,
        fromPrivateKey,
        toAddress,
        value
      );
      res.send({ receipt });
    }
    // 바이낸스 메인넷 비엔비 전송
    else if (chainId == "56") {
      const receipt = await bscMainBNBTransfer(
        fromAddress,
        fromPrivateKey,
        toAddress,
        value
      );
      res.send({ receipt });
    }
  } catch (error) {
    logger.error(error.message);
    res.send({ message: error.message });
  }
});

module.exports = router;
