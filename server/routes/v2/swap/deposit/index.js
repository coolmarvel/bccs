const router = require("express").Router();

const { logger } = require("../../../../utils/winston");

const deposit = require("../../../../service/swap/v2/deposit");
const isValidChainId = require("../../../../service/chainId");
const isValidPrivateKey = require("../../../../service/checksum/privateKey");

router.post("/deposit", async (req, res) => {
  try {
    const { token, privateKey, amount } = req.body;

    await isValidChainId(req);
    await isValidPrivateKey(privateKey);

    const receipt = await deposit(token, privateKey, amount);

    res.send({ receipt });
  } catch (error) {
    logger.error(error.message);
    if (
      error.message.includes("chainId required") ||
      error.message.includes("Not Enough Balance")
    ) {
      res.status(412).send({ message: error.message });
    } else if (error.message.includes("Invalid privateKey")) {
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
 *  /v2/swap/deposit:
 *    post:
 *      tags: [V2 (Swap)]
 *      summary:  ERC20 token Wrap to WERC20 token (Deposit)
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
 *                      blockHash:  "0x06b221a99b6795ab1455d53dbb1dfa53d2b1537f6a803d2ae02c6a3b46de9b18"
 *                      blockNumber:  8667837
 *                      contractAddress:  null
 *                      cumulativeGasUsed:  914705
 *                      effectiveGasPrice:  4858217609
 *                      from: "0x2a4bb4f179cc07ce568e07d8f5f7403b8eb7f79d"
 *                      gasUsed:  27966
 *                      logsBloom:  "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000400000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000800000000000000000000000000010000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000400000000000000000"
 *                      status: true
 *                      to: "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6"
 *                      transactionHash:  "0x908ff46b6b9627138061abcd1ce59fea6f14577c79412d3f2c729541a1ea8801"
 *                      transactionIndex: 23
 *                      type: "0x2"
 *                      events:
 *                        Deposit:
 *                          address:  "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6"
 *                          blockHash:  "0x06b221a99b6795ab1455d53dbb1dfa53d2b1537f6a803d2ae02c6a3b46de9b18"
 *                          blockNumber:  8667837
 *                          logIndex: 15
 *                          removed:  false
 *                          transactionHash:  "0x908ff46b6b9627138061abcd1ce59fea6f14577c79412d3f2c729541a1ea8801"
 *                          transactionIndex: 23
 *                          id: "log_ad7441b0"
 *                          returnValues:
 *                            "0":  "0x2a4BB4f179cc07Ce568e07d8f5f7403B8eb7F79d"
 *                            "1":  "1000000000000000000"
 *                            dst:  "0x2a4BB4f179cc07Ce568e07d8f5f7403B8eb7F79d"
 *                            wad:  "1000000000000000000"
 *                          event:  "Deposit"
 *                          signature:  "0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c"
 *                          raw:
 *                            data: "0x0000000000000000000000000000000000000000000000000de0b6b3a7640000"
 *                            topics:
 *                              ["0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c","0x0000000000000000000000002a4bb4f179cc07ce568e07d8f5f7403b8eb7f79d"]
 */
