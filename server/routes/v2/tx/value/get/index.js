const router = require("express").Router();

const { logger } = require("../../../../../utils/winston");

const isValidChainId = require("../../../../../service/chainId");
const isValidAddress = require("../../../../../service/checksum/address");
const baobabBalance = require("../../../../../service/getBalance/klaytn/testnet");
const cypressBalance = require("../../../../../service/getBalance/klaytn/mainnet");

router.get("/", async (req, res) => {
  try {
    const { address } = req.body;

    const chainId = await isValidChainId(req);
    await isValidAddress(address);

    // 테스트넷 클레이 조회
    if (chainId == "1001") {
      const balance = await baobabBalance(address);

      res.send({ balance });
    }
    // 메인넷 클레이 조회
    else if (chainId == "8217") {
      const balance = await cypressBalance(address);

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
