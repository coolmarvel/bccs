const router = require("express").Router();

const bip39 = require("bip39");

const { logger } = require("../../../../utils/winston");

router.post("/mnemonic", (req, res) => {
  try {
    const mnemonic = bip39.generateMnemonic();
    logger.info("mnemonic: " + mnemonic);

    res.send({ mnemonic });
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;

/**
 * @swagger
 * paths:
 *  /v2/account/mnemonic:
 *    post:
 *      tags: [V2 (Account)]
 *      summary: generate 12phrase mnemonic
 *      responses:
 *        200:
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  mnemonic:
 *                    type: string
 *                    example:  rival autumn exist dwarf world island duty credit dumb bullet trade north
 */
