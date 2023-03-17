const router = require("express").Router();

const { logger } = require("../../../../utils/winston");

const isValidChainId = require("../../../../service/chainId");
const getBalance = require("../../../../service/swap/getWrapTokenBalance");
const isValidPrivateKey = require("../../../../service/checksum/privateKey");

router.post("/get", async (req, res) => {
  try {
    const { token, privateKey } = req.body;
    const chainId = await isValidChainId(req);
    await isValidPrivateKey(privateKey);

    const balance = await getBalance(chainId, token, privateKey);

    res.send({ balance });
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;

/**
 * @swagger
 * paths:
 *  /v2/swap/get:
 *    post:
 *      tags: [V2 (Swap)]
 *      summary:  Wrap ERC20 Token getBalance
 *      parameters:
 *        - in: header
 *          name: x-chain-id
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  example:
 *                    name: "Wrapped Ether"
 *                    address:  ""
 *                    symbol: "WETH"
 *                    decimals: 18
 *                    chainId:  5
 *                privateKey:
 *                  example:  "0xf764a1780dda07c3b92a4688501397653435da846af002a6c97b94237400606b"
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  balance: 
 *                    type: string 
 *                    example: "1.2"
 */
