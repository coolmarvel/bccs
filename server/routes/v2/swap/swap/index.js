const router = require("express").Router();

const abi = require("../../../../utils/data/ERC20/abi");
const { logger } = require("../../../../utils/winston");

const getWeb3 = require("../../../../service/getWeb3");
const isValidChainId = require("../../../../service/chainId");
const isValidAddress = require("../../../../service/checksum/address");
const isValidPrivateKey = require("../../../../service/checksum/privateKey");

router.post("/swap", async (req, res) => {
  try {
    const { address, privateKey, fromToken, toToken, amount } = req.body;

    const chainId = await isValidChainId(req);
    await isValidPrivateKey(privateKey);
    await isValidAddress(address);

    const web3 = await getWeb3(chainId);
    await web3.eth.accounts.wallet.add(privateKey);

    const contractIn = new web3.eth.Contract(abi, fromToken);
    const contractOut = new web3.eth.Contract(abi, toToken);

    const decimals = await con;

    await web3.eth.accounts.wallet.remove(address);
    res.send({ message: true });
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
