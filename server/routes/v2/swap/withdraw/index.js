const router = require("express").Router();

const { logger } = require("../../../../utils/winston");

const withdraw = require("../../../../service/swap/withdraw");
const isValidChainId = require("../../../../service/chainId");
const isValidPrivateKey = require("../../../../service/checksum/privateKey");

router.post("/withdraw", async (req, res) => {
  try {
    const { token, privateKey, amount } = req.body;

    await isValidChainId(req);
    await isValidPrivateKey(privateKey);

    const receipt = await withdraw(token, privateKey, amount);

    res.send({ receipt });
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;

/**
 * @swagger
 * paths:
 *  /v2/swap/withdraw:
 *    post:
 *      tags: [V2 (Swap)]
 *      summary:  WERC20 Token UnWrap to ERC20 Token (Withdraw)
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
 *                    address: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6"
 *                    symbol: "WETH"
 *                    decimals: 18
 *                    chainId:  5
 *                privateKey:
 *                  example : "0xf764a1780dda07c3b92a4688501397653435da846af002a6c97b94237400606b"
 *                amount:
 *                  type: string
 *                  example: "1"
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  receipt:
 *                    example:
 *                      blockHash:  "0x45f91b16c73ee013a14551e014e036d0cf831e32d5c4f862b1635a78dea36a52"
 *                      blockNumber:  8667875
 *                      contractAddress:  null
 *                      cumulativeGasUsed:  1559526
 *                      effectiveGasPrice:  4948605236
 *                      from: "0x2a4bb4f179cc07ce568e07d8f5f7403b8eb7f79d"
 *                      gasUsed:  30541
 *                      logsBloom:  "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000400000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000010000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000002000000000000000200000000000000000000000000000000000000000000000000000000"
 *                      status: true
 *                      to: "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6"
 *                      transactionHash:  "0x850f56fdd8cf41bdc6780658c151a720996a90a1d6c1f03d28272dbbbf033a77"
 *                      transactionIndex: 31
 *                      type: "0x2"
 *                      events:
 *                        Withdrawal:
 *                          address:  "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6"
 *                          blockHash:  "0x45f91b16c73ee013a14551e014e036d0cf831e32d5c4f862b1635a78dea36a52"
 *                          blockNumber:  8667875
 *                          logIndex: 13
 *                          removed:  false
 *                          transactionHash:  "0x850f56fdd8cf41bdc6780658c151a720996a90a1d6c1f03d28272dbbbf033a77"
 *                          transactionIndex: 31
 *                          id: "log_f4aaf21b"
 *                          returnValues:
 *                            "0":  "0x2a4BB4f179cc07Ce568e07d8f5f7403B8eb7F79d"
 *                            "1":  "2000391607930294920"
 *                            src:  "0x2a4BB4f179cc07Ce568e07d8f5f7403B8eb7F79d"
 *                            wad:  "2000391607930294920"
 *                          event:  "Withdrawal"
 *                          signature:  "0x7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65"
 *                          raw:
 *                            data: "0x0000000000000000000000000000000000000000000000001bc2d191a25b9288"
 *                            topics: ["0x7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65", "0x0000000000000000000000002a4bb4f179cc07ce568e07d8f5f7403b8eb7f79d"]
 */