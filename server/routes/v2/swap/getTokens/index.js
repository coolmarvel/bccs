const router = require("express").Router();
const axios = require("axios");

const { logger } = require("../../../../utils/winston");

const isValidChainId = require("../../../../service/chainId");

router.post("/tokens", async (req, res) => {
  try {
    const { symbol } = req.body;
    const chainId = await isValidChainId(req);

    const token = await axios
      // .get("https://tokens.coingecko.com/uniswap/all.json")
      .get("https://gateway.ipfs.io/ipns/tokens.uniswap.org")
      .then((response) => {
        let result;
        response.data.tokens.map((v) => {
          if (v.chainId == chainId && v.symbol == symbol.toUpperCase()) {
            result = {
              name: v.name,
              address: v.address,
              symbol: v.symbol,
              decimals: v.decimals,
              chainId: v.chainId,
            };
          }
        });
        return result;
      });
    res.send({ token });
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;


/**
 * @swagger
 * paths:
 *  /v2/swap/tokens:
 *    post:
 *      tags: [V2 (Swap)]
 *      summary:  Each Blockchain ERC20 Token Search
 *      parameters:
 *        - in: header
 *          name: x-chain-id
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                symbol:
 *                  example:  "WETH"
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  token:
 *                    type: object
 *                    example:
 *                      {name: "Wrapped Ether", address: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
 *                      symbol: "WETH", decimals: 18, chainId: 5}
 */