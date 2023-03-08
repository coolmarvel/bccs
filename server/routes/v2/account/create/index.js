const router = require("express").Router();

const { logger } = require("../../../../utils/winston");

const createWallet = require("../../../../service/wallet/ethereum/create");

router.post("/create", async (req, res) => {
  try {
    const { mnemonic } = req.body;

    const wallet = await createWallet(mnemonic);
    const result = {
      hdPath: wallet.hdPath,
      address: wallet.address,
      privateKey: wallet.privateKey,
      publicKey: wallet.publicKey,
      mnemonic: wallet.seedPhrase,
    };
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
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                mnemonic:
 *                  example: grant baby depart bottom viable satoshi exclude inject visual public surface glare
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  hdPath:
 *                    example:  "m/44'/60'/0'/0/0"
 *                  address:
 *                    example:  "0x2dee005b923e510b129c0544b4d52b182e3778a3"
 *                  privateKey:
 *                    example:  "0xf764a1780dda07c3b92a4688501397653435da846af002a6c97b94237400606b"
 *                  publicKey:
 *                    example:  "0xa9f4b0dbe1b7ba1608d442a0ce65a5afa3a6c59b3882cff0225cc1101657ddbf8e0acbd9eb4a92daed5ffdbac1bc631bbc1f175233d6ea6baebd980decd12ab2"
 *                  mnemonic:
 *                    example:  grant baby depart bottom viable satoshi exclude inject visual public surface glare
 */
