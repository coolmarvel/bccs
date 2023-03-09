const router = require("express").Router();

const { logger } = require("../../../../utils/winston");

const isValidChainId = require("../../../../service/chainId");
const isValidAddress = require("../../../../service/checksum/address");
const transferToken = require("../../../../service/customToken/transfer");
const isValidPrivateKey = require("../../../../service/checksum/privateKey");

router.post("/transfer", async (req, res) => {
  try {
    const { fromAddress, fromPrivateKey, toAddress, contractAddress, value } =
      req.body;

    await isValidAddress(toAddress);
    await isValidAddress(fromAddress);
    await isValidPrivateKey(fromPrivateKey);

    const chainId = await isValidChainId(req);

    const receipt = await transferToken(
      chainId,
      fromAddress,
      fromPrivateKey,
      toAddress,
      contractAddress,
      value
    );

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
 *  /v4/token/transfer:
 *    post:
 *      tags: [V4 (Token)]
 *      summary:  custom ERC20 token transfer
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
 *                  receipt:
 *                    type: object
 *                    example:
 *                      blockHash: "0x58a253cd05ca27006139cdb7862ddaf79cf3c78728a0a9908f99b40195dbe39d"
 *                      blockNumber:  116769961
 *                      contractAddress:  null
 *                      effectriveGasPrice: "0x5d21dba00"
 *                      from: "0xee520d6a09d12c75ff9b2f2f0e56f780c48cab9f"
 *                      gas:  "0x927c0"
 *                      gasPrice: "0xba43b7400"
 *                      gasUsed:  48238
 *                      input:  "0xa9059cbb0000000000000000000000002dee005b923e510b129c0544b4d52b182e3778a30000000000000000000000000000000000000000000000000000000000000001"
 *                      logs: [{address: "0x66623e1Bc3c3F3E6A0973e5db138853542bE629c", topics: ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", "0x000000000000000000000000ee520d6a09d12c75ff9b2f2f0e56f780c48cab9f", "0x0000000000000000000000002dee005b923e510b129c0544b4d52b182e3778a3"],
 *                      data: "0x0000000000000000000000000000000000000000000000000000000000000001", blockNumber: 116769961, transactionHash: "0xdf403754fc8c22c5fbff9660d3da83eae5b0611821e8e3861aeec5796c979118", transactionIndex: 0, blockHash: "0x58a253cd05ca27006139cdb7862ddaf79cf3c78728a0a9908f99b40195dbe39d",
 *                      logIndex: 0, id: "log_7256d6f0"}]
 *                      logsBloom:  "0x00000000000000000000000000100000000000200000000000000000000000200000000000000000000000000000040000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000040000000000000000000000000000000800000010000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000"
 *                      nonce:  "0x27"
 *                      senderTxHash: "0xdf403754fc8c22c5fbff9660d3da83eae5b0611821e8e3861aeec5796c979118"
 *                      signatures: [{V: "0x7f5", R: "0x433aa74da88114803ebeecdf241ca61ffc1d285ebfbaebc28a4e909b4c97faf8", S: "0x5fa1d170649d1ed8bbbee646ced4b2590f41f8af5fb37b581d8e233dadc23eaf"}]
 *                      status: true
 *                      to: "0x66623e1bc3c3f3e6a0973e5db138853542be629c"
 *                      transactionHash:  "0xdf403754fc8c22c5fbff9660d3da83eae5b0611821e8e3861aeec5796c979118"
 *                      transactionIndex: 0
 *                      type: "TxTypeSmartContractExecution"
 *                      typeInt:  48
 *                      value:  "0x0"
 */
