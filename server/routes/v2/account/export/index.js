const router = require("express").Router();

const { logger } = require("../../../../utils/winston");

const isValidPrivateKey = require("../../../../service/checksum/privateKey");
const exportWallet = require("../../../../service/wallet/ethereum/export");

router.post("/export", async (req, res) => {
  try {
    const { privateKey, password } = req.body;

    await isValidPrivateKey(privateKey);

    const keystore = await exportWallet(privateKey, password);

    res.send({ password, keystore });
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;

/**
 * @swagger
 * paths:
 *  /v2/account/export:
 *    post:
 *      tags: [V2 (Account)]
 *      summary: encrypted account keystore export by password
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                privateKey:
 *                  example: "0xf764a1780dda07c3b92a4688501397653435da846af002a6c97b94237400606b"
 *                password:
 *                  example: coolmarvel
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  password: 
 *                    example: coolmarvel
 *                  keystore:
 *                    example:
 *                      {version: 3, id: "84421537-5bdf-4162-9be3-0ac35214d399", address: "0x2dee005b923e510b129c0544b4d52b182e3778a3",
 *                      crypto: {ciphertext: "c1520ebbfcfb5dfd25a609c1c1441d019001cac9c4dfdd71811476702687499b", cipherparams: {iv: "ea21ab7935201ccdb516914cc3619177"},
 *                      cipher: "aes-128-ctr", kdf: "scrypt", kdfparmas: {dklen: 32, salt: "0bf1dba3ee40dce588bb956ecab755218d6d3f756d762149d93028fe27186c6b",
 *                      n: 4096, r: 8, p: 1}}, mac: "14a9a752e684f525668aa65e7e84fa6b29627f7f00784b030c9e835cd8abdeff"}
 */