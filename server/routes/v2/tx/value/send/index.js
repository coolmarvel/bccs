const router = require("express").Router();

const { logger } = require("../../../../../utils/winston");

const isValidChainId = require("../../../../../service/chainId");
const isValidAddress = require("../../../../../service/checksum/address");
const isValidPrivateKey = require("../../../../../service/checksum/privateKey");
const baobabKlayTansfer = require("../../../../../service/valueTransfer/klaytn/testnet");
const cypressKlayTransfer = require("../../../../../service/valueTransfer/klaytn/mainnet");

router.post("/", async (req, res) => {
  try {
    const { fromAddress, fromPrivateKey, toAddress, value } = req.body;

    const chainId = await isValidChainId(req);
    await isValidPrivateKey(fromPrivateKey);
    await isValidAddress(fromAddress);
    await isValidAddress(toAddress);

    // 테스트넷 클레이 전송
    if (chainId == "1001") {
      const receipt = await baobabKlayTansfer(
        fromAddress,
        fromPrivateKey,
        toAddress,
        value
      );

      res.send({ receipt });
    }
    // 메인넷 클레이 전송
    else if (chainId == "8217") {
      const receipt = await cypressKlayTransfer(
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
