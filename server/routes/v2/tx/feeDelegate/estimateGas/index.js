const router = require("express").Router();

const baobab = require("../../../../../blockchain/klaytn/testnet");
const provider = require("../../../../../blockchain/klaytn/mainnet");

const { logger } = require("../../../../../utils/winston");
const { hexToDecimal } = require("../../../../../utils/converter");

const isValidChainId = require("../../../../../service/chainId");

router.get("/estimate", async (req, res) => {
  try {
    const chainId = await isValidChainId(req);

    // 테스트넷 클레이 전송 예상 가스비
    if (chainId == "1001") {
      const gasPrice =
        hexToDecimal(await baobab.rpc.klay.getGasPrice()) / 1000000000;
      // 25;
      const gasUsed = 31000;
      const txFee = (gasPrice * gasUsed) / 1000000000;

      res.send({ gasPrice, gasUsed, txFee });
    }
    // 메인넷 클레이 전송 예상 가스비
    else if (chainId == "8217") {
      const cypress = await provider();

      const gasPrice =
        hexToDecimal(await cypress.rpc.klay.getGasPrice()) / 1000000000;
      // 25;
      const gasUsed = 31000;
      const txFee = (gasPrice * gasUsed) / 1000000000;

      res.send({ gasPrice, gasUsed, txFee });
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
