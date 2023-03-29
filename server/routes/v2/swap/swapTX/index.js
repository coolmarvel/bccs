const router = require("express").Router();

const { logger } = require("../../../../utils/winston");

const swap = require("../../../../service/swap/v2");
const swapTx = require("../../../../service/swap/txV2");
const isValidChainId = require("../../../../service/chainId");
const isValidAddress = require("../../../../service/checksum/address");
const isValidPrivateKey = require("../../../../service/checksum/privateKey");

router.post("/tx", async (req, res) => {
  try {
    const { address, privateKey, from, to, amount } = req.body;

    const chainId = Number(await isValidChainId(req));
    await isValidPrivateKey(privateKey);
    await isValidAddress(address);

    // const result = await swapTx(chainId, privateKey, from, to, amount);
    const result = await swap(chainId, privateKey, from, to, amount);

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
 *  /v2/swap/tx:
 *    post:
 *      tags: [V2 (Swap)]
 *      summary:  Token Swap Other Token
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
 *                  example:  "0x2dee005b923e510b129c0544b4d52b182e3778a3"
 *                privateKey:
 *                  example:  "0xf764a1780dda07c3b92a4688501397653435da846af002a6c97b94237400606b"
 *                from:
 *                  example:
 *                    name: "Wrapped Ether"
 *                    address:  "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6"
 *                    symbol: "WETH"
 *                    decimals: 18
 *                    chainId:  5
 *                to:
 *                  example:
 *                    name: "Uniswap"
 *                    address:  "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"
 *                    symbol: "UNI"
 *                    decimals: 18
 *                    chainId:  5
 *                amount:
 *                  type: string
 *                  example:  "1"
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  approveReceipt:
 *                    example:
 *                      blockHash:  "0x6c698707be41d3713b7cefc68009da51515f1f713e868be910b560d0cc60c349"
 *                      blockNumber:  8668071
 *                      contractAddress:  null
 *                      cumulativeGasUsed:  1332221
 *                      effectiveGasPrice:  4126028322
 *                      from: "0x2a4bb4f179cc07ce568e07d8f5f7403b8eb7f79d"
 *                      gasUsed:  46087
 *                      logsBloom:  "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000200000000000000400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000800000020000000000000000000010000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000100000000000010000200000000000000000000080000000000000000000000000000000000"
 *                      status: true
 *                      to: "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6"
 *                      transactionHash:  "0x1a106fc50ae9d986ef6e3454845538f4b94a78930f6ad7290efcad4bf641bbcb"
 *                      transactionIndex: 12
 *                      type: "0x2"
 *                      events:
 *                        Approval:
 *                          address:  "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6"
 *                          blockHash:  "0x6c698707be41d3713b7cefc68009da51515f1f713e868be910b560d0cc60c349"
 *                          blockNumber:  8668071
 *                          logIndex: 24
 *                          removed:  false
 *                          transactionHash:  "0x1a106fc50ae9d986ef6e3454845538f4b94a78930f6ad7290efcad4bf641bbcb"
 *                          transactionIndex: 12
 *                          id: "log_a26bb328"
 *                          returnValues:
 *                            "0":  "0x2a4BB4f179cc07Ce568e07d8f5f7403B8eb7F79d"
 *                            "1":  "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"
 *                            "2":  "1000000000000000000"
 *                            owner:  "0x2a4BB4f179cc07Ce568e07d8f5f7403B8eb7F79d"
 *                            spender:  "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"
 *                            value:  "1000000000000000000"
 *                          event:  "Approval"
 *                          signature:  "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925"
 *                          raw:
 *                            data: "0x0000000000000000000000000000000000000000000000000de0b6b3a7640000"
 *                            topics: ["0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925", "0x0000000000000000000000002a4bb4f179cc07ce568e07d8f5f7403b8eb7f79d", "0x00000000000000000000000068b3465833fb72a70ecdf485e0e4c7bd8665fc45"]
 *                  swapReceipt:
 *                    example:
 *                      blockHash:  "0x2bad5336f2186635502bc752e46edc211acf2d4105119f967108e1d4f5e9374b"
 *                      blockNumber:  8668072
 *                      contractAddress:  null
 *                      cumulativeGasUsed:  636043
 *                      effectiveGasPrice:  4047124878
 *                      from: "0x2a4bb4f179cc07ce568e07d8f5f7403b8eb7f79d"
 *                      gasUsed:  121817
 *                      logs:
 *                        [{address: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6", blockHash: "0x2bad5336f2186635502bc752e46edc211acf2d4105119f967108e1d4f5e9374b",
 *                        blockNumber: 8668072, data: "0x0000000000000000000000000000000000000000000000000de0b6b3a7640000", logIndex: 10, removed: false,
 *                        topics: ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", "0x0000000000000000000000002a4bb4f179cc07ce568e07d8f5f7403b8eb7f79d", "0x00000000000000000000000028cee28a7c4b4022ac92685c07d2f33ab1a0e122"],
 *                        transactionHash: "0x7b79a82927d4e41c8c874aba0429a542af7f95a87d589a467dbf247a88ba400a", transactionIndex: 9, id: "log_e3232f7e"},
 *                        {address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", blockHash: "0x2bad5336f2186635502bc752e46edc211acf2d4105119f967108e1d4f5e9374b",
 *                        blockNumber: 8668072, data: "0x0000000000000000000000000000000000000000000000005245a9249ffb971d", logIndex: 11, removed: false,
 *                        topics: ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", "0x00000000000000000000000028cee28a7c4b4022ac92685c07d2f33ab1a0e122", "0x0000000000000000000000002a4bb4f179cc07ce568e07d8f5f7403b8eb7f79d"],
 *                        transactionHash: "0x7b79a82927d4e41c8c874aba0429a542af7f95a87d589a467dbf247a88ba400a", transactionIndex: 9, id: "log_e192bdad"},
 *                        {address: "0x28cee28a7C4b4022AC92685C07d2f33Ab1A0e122", blockHash: "0x2bad5336f2186635502bc752e46edc211acf2d4105119f967108e1d4f5e9374b",
 *                        blockNumber: 8668072, data: "0x0000000000000000000000000000000000000000000008a6d557edbea1766af100000000000000000000000000000000000000000000017488f202159589ab26", logIndex: 12, removed: false,
 *                        topics: ["0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1"],
 *                        transactionHash: "0x7b79a82927d4e41c8c874aba0429a542af7f95a87d589a467dbf247a88ba400a", transactionIndex: 9, id: "log_6b503e81"},
 *                        {address: "0x28cee28a7C4b4022AC92685C07d2f33Ab1A0e122", blockHash: "0x2bad5336f2186635502bc752e46edc211acf2d4105119f967108e1d4f5e9374b",
 *                        blockNumber: 8668072, data: "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000005245a9249ffb971d0000000000000000000000000000000000000000000000000000000000000000", logIndex: 13, removed: false,
 *                        topics: ["0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822", "0x00000000000000000000000068b3465833fb72a70ecdf485e0e4c7bd8665fc45", "0x0000000000000000000000002a4bb4f179cc07ce568e07d8f5f7403b8eb7f79d"],
 *                        transactionHash: "0x7b79a82927d4e41c8c874aba0429a542af7f95a87d589a467dbf247a88ba400a", transactionIndex: 9, id: "log_e432438a"}]
 *                      logsBloom: "0x00200000000000000000000080000000100000000000000000000000000000000000000000000000000000000000001000000000000000000000020000000000000000000400000000000008100000200000000000000000000000000000000008000000000000000000000000000000000000000000000000000010000000000000000000000000000800000000000000000000000000080000004000800000040000000000000000000010000000000000000000000000000000000000000000004003001000000000000000000000000000000000001000000100000000000000000200000000000000000000080000000000000000000000000000800000"
 *                      status: true
 *                      to: "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45"
 *                      transactionHash:  "0x7b79a82927d4e41c8c874aba0429a542af7f95a87d589a467dbf247a88ba400a"
 *                      transactionIndex: 9
 *                      type: "0x2"
 *                  newBalanceIn:
 *                    type: string
 *                    example:  "0"
 *                  newBalanceOut:
 *                    type: string
 *                    example:  "5.928330459271108381"
 */
