const router = require("express").Router();

const { logger } = require("../../../../../utils/winston");

const isValidChainId = require("../../../../../service/chainId");
const deployContract = require("../../../../../service/deployContract");
const isValidPrivateKey = require("../../../../../service/checksum/privateKey");

router.post("/deploy", async (req, res) => {
  try {
    const { abi, bytecode, privateKey } = req.body;

    await isValidPrivateKey(privateKey);
    const chainId = await isValidChainId(req);

    const receipt = await deployContract(chainId, abi, bytecode, privateKey);

    res.send({ receipt });
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes("Invalid PrivateKey")) {
      res.status(400).send({ message: error.message });
    } else if (error.message.includes("chainId required")) {
      res.status(412).send({ message: error.message });
    } else if (error.message.includes("Unsupported chainId")) {
      res.status(416).send({ message: error.message });
    } else {
      res.status(404).send({ message: error.message });
    }
  }
});

const fdRouter = require("./feeDelegate");
const estimateRouter = require("./estimate");

router.use("/fd", fdRouter);
router.use("/deploy", estimateRouter);

module.exports = router;

/**
 * @swagger
 * paths:
 *  /v1/contract/mt/deploy:
 *    post:
 *      tags: [V1 (ERC1155)]
 *      summary: "ERC1155 Contract Deploy"
 *      parameters:
 *        - in: header
 *          name: x-chain-id
 *          schema:
 *            type: string
 *      requestBody:
 *        required: true
 *        description:  |
 *          | privateKey       | abi            | bytecode     |
 *          | ---------------- | -------------- | ------------ |
 *          | wallet privateKey| JSON Interface | compile first|
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                privateKey:
 *                  example: 0xf76...06b
 *                abi:
 *                  type: array
 *                  example: 
 *                    [...]
 *                bytecode:
 *                  type: string
 *      responses:
 *        200:
 *          description: deploy success
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  receipt:
 *                    type: object
 *                    example:
 *                      {blockHash: 0x9de...ab6,blockNumber: 116157701,codeFormat: 0x0,
 *                      contractAddress: 0xFD4...23A, effectiveGasPrice: 0x5d21dba00,
 *                      from: 0xee5...b9f, gas: 10000000, gasPrice: 50000000000, gasUsed: 6523894,
 *                      humanReadable: false, input: 0x610...033,logs: [...], logsBloom: 0x000...000,
 *                      nonce: 0x10, senderTxHash: 0xb33...9a7, signatures: [...], status: true,
 *                      to: null, transactionHash: 0xb33...9a7, transactionIndex: 0, type: TxTypeSmartContractDeploy,
 *                      typeInt: 40, value: 0x0}            
 */