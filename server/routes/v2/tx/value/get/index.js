const router = require("express").Router();

const { logger } = require("../../../../../utils/winston");

const getBalance = require("../../../../../service/getBalance");
const isValidChainId = require("../../../../../service/chainId");
const isValidAddress = require("../../../../../service/checksum/address");

router.post("/get", async (req, res) => {
  try {
    const { address } = req.body;

    const chainId = await isValidChainId(req);
    await isValidAddress(address);

    const balance = await getBalance(chainId, address);

    res.send({ balance });
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes("Invalid address")) {
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
 *  /v2/tx/value/get:
 *    post:
 *      tags: [V2 (TX)]
 *      summary:  accounts's balance refer
 *      parameters:
 *        - in: header
 *          name: x-chain-id
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                address:
 *                  example:  "0xee520d6A09D12c75ff9b2F2F0E56F780c48cab9F"
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  balance:
 *                    type: string
 *                    example: "1205.441829575"
 */