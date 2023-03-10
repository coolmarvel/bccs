const router = require("express").Router();

const { logger } = require("../../../../utils/winston");

const isValidChainId = require("../../../../service/chainId");
const isValidAddress = require("../../../../service/checksum/address");
const isValidPrivateKey = require("../../../../service/checksum/privateKey");
const estimatedGas = require("../../../../service/estimateGas/tokenTransfer");

router.post("/estimate", async (req, res) => {
  try {
    const { fromAddress, fromPrivateKey, toAddress, contractAddress, value } =
      req.body;

    await isValidAddress(toAddress);
    await isValidAddress(fromAddress);
    await isValidPrivateKey(fromPrivateKey);

    const chainId = await isValidChainId(req);

    const result = await estimatedGas(
      chainId,
      fromAddress,
      fromPrivateKey,
      toAddress,
      contractAddress,
      value
    );

    res.send(result);
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;

/**
 * @swagger
 * paths:
 *  /v4/token/estimate:
 *    post:
 *      tags: [V4 (Token)]
 *      summary:  customr ERC20 Token transfer estimateGas
 *      parameters:
 *        - in: header
 *          name: x-chain-id
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                fromAddress:
 *                  example:  "0x2dee005b923e510b129c0544b4d52b182e3778a3"
 *                fromPrivateKey:
 *                  example:  "0xf764a1780dda07c3b92a4688501397653435da846af002a6c97b94237400606b"
 *                toAddress:
 *                  example:  "0xee520d6A09D12c75ff9b2F2F0E56F780c48cab9F"
 *                contractAddress:
 *                  example:  "0x66623e1Bc3c3F3E6A0973e5db138853542bE629c"
 *                value:
 *                  example:  1
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  gasPrice:
 *                    example:  50
 *                  estimatedGas: 
 *                    example:  48238
 *                  txFee:
 *                    example:  0.0024119
 */
