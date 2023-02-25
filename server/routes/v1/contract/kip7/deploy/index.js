const router = require("express").Router();

const baobab = require("../../../../../blockchain/klaytn/testnet");

const { logger } = require("../../../../../utils/winston");

const isValidChainId = require("../../../../../service/chainId");
const isValidAddress = require("../../../../../service/checksum/address");
const isValidPrivateKey = require("../../../../../service/checksum/privateKey");
const deployKip7Baobab = require("../../../../../service/deployContract/testnet/kip7");

const contractDeploy = require("../../../../../service/contractDeploy");

router.post("/", async (req, res) => {
  try {
    const { address, privateKey, name, symbol, decimals, initialSupply } =
      req.body;

    await isValidChainId(req);
    await isValidAddress(address);
    await isValidPrivateKey(privateKey);

    const receipt = await contractDeploy(name, symbol, privateKey);
    res.send(receipt);
  } catch (error) {
    logger.error(error.message);
    res.send({ message: error.message });
  }
});

module.exports = router;
