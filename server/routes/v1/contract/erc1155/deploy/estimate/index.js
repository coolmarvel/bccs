const router = require("express").Router();

const { logger } = require("../../../../../../utils/winston");

const isValidChainId = require("../../../../../../service/chainId");
const isValidPrivateKey = require("../../../../../../service/checksum/privateKey");
const estimateGas = require("../../../../../../service/estimateGas/deployContract");

router.post("/estimate", async (req, res) => {
  try {
    const { privateKey, abi, bytecode } = req.body;

    const chainId = await isValidChainId(req);
    await isValidPrivateKey(privateKey);

    const result = await estimateGas(chainId, abi, bytecode, privateKey);
    res.send(result);
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

const fdRouter = require("./feeDelegate");

router.use("/fd", fdRouter);

module.exports = router;

/**
 * @swagger
 * paths:
 *  /v1/contract/mt/deploy/estimate:
 *    post:
 *      tags: [V1 (ERC1155)]
 *      summary: "ERC1155 Contract Deploy's gas estimate"
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
 *                  example: [...]
 *                bytecode:
 *                  type: string
 *      responses:
 *        200:
 *          description: estimateGas success
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  gas:
 *                    example: 50
 *                  estimatedGas:
 *                    example: 1682600
 *                  txFee:
 *                    example: 0.08413
 */

/**
 * @swagger
 * paths:
 *  /v1/contract/mt/deploy/fd/estimate:
 *    post:
 *      tags: [V1 (ERC1155)]
 *      summary: "ERC1155 Contract FeeDelegate Deploy's gas estimate"
 *      parameters:
 *        - in: header
 *          name: x-chain-id
 *          schema:
 *            type: string
 *      requestBody:
 *        required: true
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
 *                  example: [...]
 *                bytecode:
 *                  type: string
 *      responses:
 *        200:
 *          description: estimateGas success
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  gas:
 *                    example: 50
 *                  estimatedGas:
 *                    example: 1685100
 *                  txFee:
 *                    example: 0.084255
 */
