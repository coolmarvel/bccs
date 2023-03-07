const router = require("express").Router();

const { logger } = require("../../../../utils/winston");

const importWallet = require("../../../../service/wallet/ethereum/import");

router.post("/import", async (req, res) => {
  try {
    const { privateKey, keystore, password } = req.body;

    const result = await importWallet(privateKey, keystore, password);

    res.send(result);
  } catch (error) {
    logger.error(error.message);
    if (error.message.includes("Invalid privateKey")) {
      res.status(400).send({ message: error.message });
    } else if (error.message.includes("Key derivation failed")) {
      res.status(400).send({ message: error.message });
    } else {
      res.status(404).send({ message: error.message });
    }
  }
});

module.exports = router;

/**
 * @swagger
 * paths:
 *  /v2/account/set:
 *    post:
 *      tags: [V2 (Account)]
 *      summary:  BIP44 wallet set from keystore & password
 *      requestBody:
 *        description: |
 *          | privateKey로 등록할시 | 키스토어랑 비밀번호로 진행할시 아래의 예시처럼 |
 *          | ---------------- | ------------- |
 *          | { "privateKey": "0xf764a1780dda07c3b92a4688501397653435da846af002a6c97b94237400606b" } | |
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                keystore:
 *                  example:
 *                    {version: 3,id: "d415c0de-abe9-43b9-8c51-2112d680fa79",address: "0x2dee005b923e510b129c0544b4d52b182e3778a3",
 *                    crypto: {ciphertext: "3f6d798d13e15d6fae6eb65e089759e93bb29ec43a8db9cbb810038772f1b7c0", cipherparams: {iv: "aed1d5162457f9b3f73aef0826515752"},
 *                    cipher: "aes-128-ctr",kdf: "scrypt", kdfparams: {dklen: 32, salt: "f977c308728a9ebb6a675d566dbe81728fd4a27f630beaa0dab7cc65807f6f63",n: 4096, r: 8,p: 1},
 *                    mac: "da5e8eb7bedd8316f50dca9bc138168abe9ee33220cb2c680077cec57d18fba0"}}
 *                password:
 *                  example:  Dream1004!@
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                properties:
 *                  address:
 *                    example:  "0x2dee005b923e510b129c0544b4d52b182e3778a3"
 *                  privateKey:
 *                    example:  "0xf764a1780dda07c3b92a4688501397653435da846af002a6c97b94237400606b"
 *                  publicKey:
 *                    example:  "0xa9f4b0dbe1b7ba1608d442a0ce65a5afa3a6c59b3882cff0225cc1101657ddbf8e0acbd9eb4a92daed5ffdbac1bc631bbc1f175233d6ea6baebd980decd12ab2"
 */

// /**
//  * @swagger
//  * paths:
//  *  /v2/account/set:
//  *    post:
//  *      tags: [V2 (Account)]
//  *      summary:  BIP44 wallet set from privateKey
//  *      requestBody:
//  *        description:  privateKey
//  *        content:
//  *          application/json:
//  *            schema:
//  *              type: object
//  *              properties:
//  *                privateKey:
//  *                  example: "0xf764a1780dda07c3b92a4688501397653435da846af002a6c97b94237400606b"
//  *      responses:
//  *        200:
//  *          content:
//  *            application/json:
//  *              schema:
//  *                properties:
//  *                  address:
//  *                    example:  "0x2dee005b923e510b129c0544b4d52b182e3778a3"
//  *                  privateKey:
//  *                    example:  "0xf764a1780dda07c3b92a4688501397653435da846af002a6c97b94237400606b"
//  *                  publicKey:
//  *                    example:  "0xa9f4b0dbe1b7ba1608d442a0ce65a5afa3a6c59b3882cff0225cc1101657ddbf8e0acbd9eb4a92daed5ffdbac1bc631bbc1f175233d6ea6baebd980decd12ab2"
//  */
