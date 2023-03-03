const router = require("express").Router();

const { logger } = require("../../../../../utils/winston");

const createERC20 = require("../../../../../service/createContract/erc20");

router.post("/wizard", async (req, res) => {
  try {
    const contract = await createERC20(req.body);

    res.send(contract);
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;

/**
 * @swagger
 * paths:
 *  /v1/contract/ft/wizard:
 *    post:
 *      tags: [V1 (ERC20)]
 *      summary:  "ERC20 Contract Generate"
 *      requestBody:
 *        required: true
 *        description:  |
 *          | access           | upgradeable   | info                                                         |
 *          | ---------------- | ------------- | ------------------------------------------------------------ |
 *          | "ownable"        | "uups"        | {securityContact: null, license: null}                       |
 *          | "roles"          | "transparent" | {securityContact: null, license: MIT}                        |
 *          | ""               | null          | {securityContact: marvel97@naver.com, license: COOLMARVEL}   |
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  example:  TestToken
 *                symbol:
 *                  example:  TTK
 *                premint:
 *                  type: string
 *                  example:  "10000"
 *                votes:
 *                  example:  false
 *                permit:
 *                  example:  false
 *                mintable:
 *                  example:  true
 *                burnable:
 *                  example:  true
 *                pausable:
 *                  example:  true
 *                flashmint:
 *                  example:  false
 *                snapshot:
 *                  example:  true
 *                access:
 *                  example:  ownable
 *                upgradeable:
 *                  example:  null
 *                info:
 *                  example:  {securityContact: marvel97@naver.com,license: COOLMARVEL}
 *      responses:
 *        200:
 *          description:  contract generate success
 *          content:
 *            text/html:
 *              schema:
 */