const router = require("express").Router();

const { logger } = require("../../../../utils/winston");

const createWallet = require("../../../../service/wallet/ethereum/create");

router.post("/create", async (req, res) => {
  try {
    const { mnemonic } = req.body;

    const result = await createWallet(mnemonic);

    res.send(result);
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;

/**
 * @swagger
 * paths:
 *  /v2/account/create:
 *    post:
 *      tags: [V2 (Account)]
 *      summary:  BIP44 wallet create
 *      requestBody:
 *        description:  |
 *          | mnemonic         | password      |
 *          | ---------------- | ------------- |
 *          | optional         | optional      |
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                mnemonic:
 *                  example: grant baby depart bottom viable satoshi exclude inject visual public surface glare
 *                password:
 *                  example: Dream1004!@
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  address:
 *                    example:  "0x2dee005b923e510b129c0544b4d52b182e3778a3"
 *                  privateKey:
 *                    example:  "0xf764a1780dda07c3b92a4688501397653435da846af002a6c97b94237400606b"
 *                  publicKey:
 *                    example:  "0xa9f4b0dbe1b7ba1608d442a0ce65a5afa3a6c59b3882cff0225cc1101657ddbf8e0acbd9eb4a92daed5ffdbac1bc631bbc1f175233d6ea6baebd980decd12ab2"
 *                  menmonic:
 *                    example:  grant baby depart bottom viable satoshi exclude inject visual public surface glare
 *                  password:
 *                    example:  Dream1004!@
 *                  keystore:
 *                    type: object
 *                    example:
 *                      {version: 3,id: "ff3ff10a-c738-419e-b571-a268255a0398",address: "0x2dee005b923e510b129c0544b4d52b182e3778a3",
 *                      crypto: {ciphertext: "84296a3db286b06446839aa2cff59cc9ea109b198293c79302f288a59ec91006",
 *                      cipherparams: {iv: "bc7c7fa5a60fbca8ff523fd9de50f0c1"}, cipher: "aes-128-ctr",kdf: "scrypt",
 *                      kdfparams: {dklen: 32, salt: "9d2e4480cca8b8c08c5a691f5bd3916c85d2dddda7ba16b806e390a329098435",n: 4096,r: 8,p: 1},
 *                      mac: "8b33ea1b6306a0c3c073e44d185b482e7baa8e74b374370faad0b75c132134c1"}}
 */
