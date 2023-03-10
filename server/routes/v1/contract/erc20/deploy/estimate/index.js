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
 *  /v1/contract/ft/deploy/estimate:
 *    post:
 *      tags: [V1 (ERC20)]
 *      summary: "ERC20 Contract Deploy's gas estimate"
 *      parameters:
 *        - in: header
 *          name: x-chain-id
 *          schema:
 *            type: string
 *      requestBody:
 *        required: true
 *        description:
 *          abi = jsoninterface
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
 *                    example: 2535300
 *                  txFee:
 *                    example: 0.126765
 *        400:
 *          description:  잘못된 비밀키 기입시
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    example:  "Invalid privateKey"
 */

/**
 * @swagger
 * paths:
 *  /v1/contract/ft/deploy/fd/estimate:
 *    post:
 *      tags: [V1 (ERC20)]
 *      summary: "ERC20 Contract FeeDelegate Deploy's gas estimate"
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
 *                    example: 2535300
 *                  txFee:
 *                    example: 0.12689
 *        400:
 *          description:  잘못된 비밀키 기입시
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    example:  "Invalid privateKey"
 */
