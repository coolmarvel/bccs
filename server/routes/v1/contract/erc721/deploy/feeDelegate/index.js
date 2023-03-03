const router = require("express").Router();

const { logger } = require("../../../../../../utils/winston");

const isValidChainId = require("../../../../../../service/chainId");
const isValidPrivateKey = require("../../../../../../service/checksum/privateKey");
const deployContractFeeDelegate = require("../../../../../../service/deployContract/feeDelegate");

router.post("/deploy", async (req, res) => {
  try {
    const { abi, bytecode, fromPrivateKey, feePayPrivateKey } = req.body;

    const chainId = await isValidChainId(req);
    await isValidPrivateKey(feePayPrivateKey);
    await isValidPrivateKey(fromPrivateKey);

    const receipt = await deployContractFeeDelegate(
      chainId,
      abi,
      bytecode,
      fromPrivateKey,
      feePayPrivateKey
    );

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

module.exports = router;

/**
 * @swagger
 * paths:
 *  /v1/contract/nft/fd/deploy:
 *    post:
 *      tags: [V1 (ERC721)]
 *      summary:  "ERC721 Contract FeeDelegate Deploy's gas estimate"
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
 *                fromPrivateKey:
 *                  example: 0xf76...06b
 *                feePayPrivateKey:
 *                  example: 0xf76...06b
 *                abi:
 *                  type: array
 *                  example:  [...]
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
 *                      feePayer: 0xee5...b9f, feePayerSignatures:  [{V: 0x...,R: 0x...,S: 0x...}],
 *                      from: 0xee5...b9f, gas: 10000000, gasPrice: 50000000000, gasUsed: 6523894,
 *                      humanReadable: false, input: 0x610...033,logs: [...], logsBloom: 0x000...000,
 *                      nonce: 0x10, senderTxHash: 0xb33...9a7, signatures: [...], status: true,
 *                      to: null, transactionHash: 0xb33...9a7, transactionIndex: 0, type: TxTypeSmartContractDeploy,
 *                      typeInt: 40, value: 0x0}
 */