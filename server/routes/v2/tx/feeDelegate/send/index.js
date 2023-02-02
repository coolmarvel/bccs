const router = require("express").Router();

const { logger } = require("../../../../../utils/winston");

const isValidChainId = require("../../../../../service/chainId");
const isValidAddress = require("../../../../../service/checksum/address");
const isValidPrivateKey = require("../../../../../service/checksum/privateKey");
const feeDelegateBaobabKlayTransfer = require("../../../../../service/feeDelegateTx/testnet/valueTransfer");
const feeDelegateCypressKlayTransfer = require("../../../../../service/feeDelegateTx/mainnet/valueTransfer");

router.post("/", async (req, res) => {
  try {
    const {
      value,
      toAddress,
      fromAddress,
      fromPrivateKey,
      feePayAddress,
      feePayPrivateKey,
    } = req.body;

    const chainId = await isValidChainId(req);
    await isValidAddress(toAddress);
    await isValidAddress(fromAddress);
    await isValidAddress(feePayAddress);
    await isValidPrivateKey(fromPrivateKey);
    await isValidPrivateKey(feePayPrivateKey);

    // 테스트넷 클레이 대납 전송
    if (chainId == "1001") {
      const receipt = await feeDelegateBaobabKlayTransfer(
        fromAddress,
        fromPrivateKey,
        toAddress,
        feePayAddress,
        feePayPrivateKey,
        value
      );

      res.send({ receipt });
    }
    // 메인넷 클레이 대납 전송
    else if (chainId == "8217") {
      const receipt = await feeDelegateCypressKlayTransfer(
        fromAddress,
        fromPrivateKey,
        toAddress,
        feePayAddress,
        feePayPrivateKey,
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
