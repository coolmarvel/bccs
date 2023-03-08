const router = require("express").Router();

const { logger } = require("../../../utils/winston");

const scanTX = require("../../../service/scanTX");
const isValidChainId = require("../../../service/chainId");
const isValidAddress = require("../../../service/checksum/address");

router.post("/", async (req, res) => {
  try {
    const { address, page } = req.body;

    const chainId = await isValidChainId(req);
    await isValidAddress(address);

    const result = await scanTX(chainId, address, page);

    res.send({ result });
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;

/**
 * @swagger
 * paths:
 *  /v2/scan:
 *    post:
 *      tags: [V2 (SCAN)]
 *      summary:  account's transaction scan
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
 *                page:
 *                  example:  1
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  result:
 *                    example:
 *                      [{txHash: "0x966eef0f0d685c3cf8d9d8cc6a44b3152ee64d099708818d290fc2da1458fd67",
 *                      fromAddress: "0xf90675a56a03f836204d66c0f923e00500ddc90a", toAddress: "0xee520d6a09d12c75ff9b2f2f0e56f780c48cab9f",
 *                      createdAt: 1678061316, amount: "150", txFee: "0.0001128", gasPrice: "5.371712886", methodName: "Transfer"},
 *                      ...]
 */
