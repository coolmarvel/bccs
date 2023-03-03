const router = require("express").Router();

const { logger } = require("../../../../../utils/winston");

const isValidChainId = require("../../../../../service/chainId");
const isValidAddress = require("../../../../../service/checksum/address");
const isValidPrivateKey = require("../../../../../service/checksum/privateKey");

const estimateGas = require("../../../../../service/estimateGas/valueTransfer");

router.post("/estimate", async (req, res) => {
  try {
    const { fromAddress, fromPrivateKey, toAddress, value } = req.body;

    const chainId = await isValidChainId(req);
    await isValidPrivateKey(fromPrivateKey);
    await isValidAddress(fromAddress);
    await isValidAddress(toAddress);

    const result = await estimateGas(
      chainId,
      fromAddress,
      fromPrivateKey,
      toAddress,
      value
    );

    res.send(result);
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes("chainId required")) {
      res.status(412).send({ message: error.message });
    } else if (
      error.message.includes("Invalid address") ||
      error.message.includes("Invalid privateKey")
    ) {
      res.status(400).send({ message: error.message });
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
 *  /v2/tx/value/estimate:
 *    post:
 *      tags: [V2 (TX)]
 *      summary:  balance transfer estimateGas
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
 *                value:
 *                  type: string
 *                  example:  "1"
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
 *                    example:  34800
 *                  txFee:
 *                    example:  0.00174
 */