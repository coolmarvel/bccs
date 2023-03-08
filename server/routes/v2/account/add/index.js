const router = require("express").Router();

const { logger } = require("../../../../utils/winston");

const addWallet = require("../../../../service/wallet/ethereum/add");

router.post("/add", async (req, res) => {
  try {
    const { mnemonic, hdPath } = req.body;

    const result = await addWallet(mnemonic, hdPath);

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
 *  /v2/account/add:
 *    post:
 *      tags: [V2 (Account)]
 *      summary: BIP44 wallet Derivate add
 *      requestBody:
 *        description:  |
 *          | mnemonic         | hdPath        |
 *          | ---------------- | ------------- |
 *          | required         | required      |
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                mnemonic:
 *                  example: "grant baby depart bottom viable satoshi exclude inject visual public surface glare"
 *                hdPath:
 *                  example: "m/44'/60'/0'/0/1"
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  address:
 *                    example: "0xd6c8d84b80d3e4d63f9dbc729db0d76101237667"
 *                  privateKey:
 *                    example: "0x238911af6dc4da1eea9e0c62824cedd5d65b6c1977367227a42985aeec977cd8"
 *                  publicKey:
 *                    example: "0xa204e9b72fb529c5c34761cdf0adb769e4306114208c1d017d7ef6e657b7e50a99cf49494f67fb2fa26eb878e7b123b78e400915daa5ee027490ac260e941d7f"
 */