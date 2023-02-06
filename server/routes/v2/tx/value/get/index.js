const router = require("express").Router();

const { logger } = require("../../../../../utils/winston");

const isValidChainId = require("../../../../../service/chainId");
const isValidAddress = require("../../../../../service/checksum/address");

const baobabBalance = require("../../../../../service/getBalance/klaytn/testnet");
const cypressBalance = require("../../../../../service/getBalance/klaytn/mainnet");
const mumbaiBalance = require("../../../../../service/getBalance/polygon/testnet");
const polygonBalance = require("../../../../../service/getBalance/polygon/mainnet");
const bscTestBalance = require("../../../../../service/getBalance/binance/testnet");
const bscMainBalance = require("../../../../../service/getBalance/binance/mainnet");
const ethereumBalance = require("../../../../../service/getBalance/ethereum/mainnet");
const goerliBalance = require("../../../../../service/getBalance/ethereum/testnet/goerli");
const sepoliaBalance = require("../../../../../service/getBalance/ethereum/testnet/sepolia");

router.get("/", async (req, res) => {
  try {
    const { address } = req.body;

    const chainId = await isValidChainId(req);
    await isValidAddress(address);

    // 클레이튼 테스트넷 클레이 조회
    if (chainId == "1001") {
      const balance = await baobabBalance(address);
      res.send({ balance });
    }
    // 클레이튼 메인넷 클레이 조회
    else if (chainId == "8217") {
      const balance = await cypressBalance(address);
      res.send({ balance });
    }
    // 폴리곤 테스트넷 메틱 조회
    else if (chainId == "80001") {
      const balance = await mumbaiBalance(address);
      res.send({ balance });
    }
    // 폴리곤 메인넷 메틱 조회
    else if (chainId == "137") {
      const balance = await polygonBalance(address);

      res.send({ balance });
    }
    // 이더리움 괴를리 테스트넷 이더 조회
    else if (chainId == "5") {
      const balance = await goerliBalance(address);
      res.send({ balance });
    }
    // 이더리움 세폴리아 테스트넷 이더 조회
    else if (chainId == "11155111") {
      const balance = await sepoliaBalance(address);
      res.send({ balance });
    }
    // 이더리움 메인넷 이더 조회
    else if (chainId == "1") {
      const balance = await ethereumBalance(address);
      res.send({ balance });
    }
    // 바이낸스 테스트넷 비앤비 조회
    else if (chainId == "97") {
      const balance = await bscTestBalance(address);
      res.send({ balance });
    }
    // 바이낸스 메인넷 비앤비 조회
    else if (chainId == "56") {
      const balance = await bscMainBalance(address);
      res.send({ balance });
    }
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes("Invalid address")) {
      res.status(400).send({ message: error.message });
    } else if (error.message.includes("chainId required")) {
      res.status(403).send({ message: error.message });
    } else {
      res.status(404).send({ message: error.message });
    }
  }
});

module.exports = router;
