const router = require("express").Router();

const { logger } = require("../../../../../utils/winston");

const isValidChainId = require("../../../../../service/chainId");
const valueTransfer = require("../../../../../service/valueTransfer");
const isValidAddress = require("../../../../../service/checksum/address");
const isValidPrivateKey = require("../../../../../service/checksum/privateKey");

router.post("/send", async (req, res) => {
  try {
    const { fromAddress, fromPrivateKey, toAddress, value } = req.body;

    const chainId = await isValidChainId(req);
    await isValidPrivateKey(fromPrivateKey);
    await isValidAddress(fromAddress);
    await isValidAddress(toAddress);

    const receipt = await valueTransfer(
      chainId,
      fromAddress,
      fromPrivateKey,
      toAddress,
      value
    );
    res.send({ receipt });
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
 *  /v2/tx/value/send:
 *    post:
 *      tags: [V2 (TX)]
 *      summary:  balance transfer to other address
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
 *                  receipt:
 *                    example:
 *                      {blockHash: "0x09157524f082ef10de9ff4236ff5fb1773781f44bac3fd49ac8d2cfa974914d3",blockNumber: 116252094,
 *                      contractAddress: null, effectiveGasPrice: "0x5d21dba00", from: "0x2dee005b923e510b129c0544b4d52b182e3778a3",
 *                      gas: "0x2dc5c0", gasPrice: "0xba43b7400", gasUsed: 21000, logs: [], logsBloom: "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
 *                      nonce: "0x14", senderTxHash: "0xe3d65eae20d4d548428a2508f5b8a9a1367f77d81e6222bdf3cf63fee0d70e96",
 *                      signatures: [{V: "0x7f5", R: "0x8dda16b03126ea857c3e63a8ce62043fc3cbe052113c5a6edb2607f1a4bb1bf2",S: "0x1d3083f73821bfb3544b356a690311daaec57363bc97fb886c6d20027c0676cc"}],
 *                      status: true, to: "0xee520d6a09d12c75ff9b2f2f0e56f780c48cab9f", transactionHash: "0xe3d65eae20d4d548428a2508f5b8a9a1367f77d81e6222bdf3cf63fee0d70e96",
 *                      transactionIndex: 0, type: "TxTypeValueTransfer", typeInt: 8, value: "0xde0b6b3a7640000"}
 */