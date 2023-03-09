const router = require("express").Router();

const { logger } = require("../../../../utils/winston");

const isValidChainId = require("../../../../service/chainId");
const importToken = require("../../../../service/customToken/import");
const isValidAddress = require("../../../../service/checksum/address");

router.post("/import", async (req, res) => {
  try {
    const { address, contractAddress } = req.body;

    await isValidAddress(address);
    const chainId = await isValidChainId(req);

    const result = await importToken(chainId, contractAddress, address);

    res.send(result);
  } catch (error) {
    logger.error(error.message);
    if (
      error.message.includes("Returned values aren't valid") ||
      error.message.includes("the capitalization checksum test failed")
    ) {
      res.status(400).send({ message: "Invalid contractAddress" });
    } else if (error.message.includes("Invalid address")) {
      res.status(400).send({ message: "Invalid address" });
    } else if (error.message.includes("chainId required")) {
      res.status(412).send({ message: "chainId required" });
    } else if (error.message.includes("Unsupported chainId")) {
      res.status(416).send({ message: "Unsupported chainId" });
    } else {
      res.status(404).send({ message: error.message });
    }
  }
});

module.exports = router;

/**
 * @swagger
 * paths:
 *  /v4/token/import:
 *    post:
 *      tags: [V4 (Token)]
 *      summary:  custom ERC20 token import
 *      paramters:
 *        - in: header
 *          name: x-chain-id
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                address:
 *                  example: "0xee520d6A09D12c75ff9b2F2F0E56F780c48cab9F"
 *                contractAddress:
 *                  example:  "0x66623e1Bc3c3F3E6A0973e5db138853542bE629c"
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  chainId:
 *                    example: 1001
 *                  symbol:
 *                    example:  "TTK"
 *                  decimals:
 *                    example:  "18"
 *                  balance:
 *                    example:  "999999999999996"
 *                  address:
 *                    example:  "0xee520d6A09D12c75ff9b2F2F0E56F780c48cab9F"
 *                  contractAddress:
 *                    example:  "0x66623e1Bc3c3F3E6A0973e5db138853542bE629c"
 */
