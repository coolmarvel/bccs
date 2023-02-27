const router = require("express").Router();

const { logger } = require("../../../../../utils/winston");

const isValidChainId = require("../../../../../service/chainId");
const isValidPrivateKey = require("../../../../../service/checksum/privateKey");

const deployContractKlaytn = require("../../../../../service/deployContract/klaytn");
const deployContractMumbai = require("../../../../../service/deployContract/polygon/testnet");

router.post("/deploy", async (req, res) => {
  try {
    const { abi, bytecode, privateKey } = req.body;

    await isValidPrivateKey(privateKey);
    const chainId = await isValidChainId(req);

    // 클레이튼 테스트넷
    if (chainId == "1001") {
      const receipt = await deployContractKlaytn(abi, bytecode, privateKey);

      res.send(receipt);
    }
    // 클레이튼 메인넷
    else if (chainId == "8217") {
      res.send(true);
    }
    // 폴리곤 테스트넷
    else if (chainId == "80001") {
      const receipt = await deployContractMumbai(abi, bytecode, privateKey);

      res.send(receipt);
    }
    // 폴리곤 메인넷
    else if (chainId == "137") {
      res.send(true);
    }
  } catch (error) {
    logger.error(error.message);
    res.send({ message: error.message });
  }
});

module.exports = router;
