const router = require("express").Router();

const { logger } = require("../../../../../utils/winston");

const createERC1155 = require("../../../../../service/createContract/erc1155");

router.post("/wizard", async (req, res) => {
  try {
    const contract = await createERC1155(req.body);

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
 *  /v1/contract/mt/wizard:
 *    post:
 *      tags: [V1 (ERC1155)]
 *      summary:  "ERC1155 Contract Generate"
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
 *                  example: TestMT
 *                uri:
 *                  example: http://localhost:8080
 *                updateableUri:
 *                  example:  true
 *                supply:
 *                  example: true
 *                mintable:
 *                  example: true
 *                burnable:
 *                  example: true
 *                pausable:
 *                  example: true
 *                access:
 *                  type: string
 *                  example: ownable
 *                upgradeable:
 *                  type: string
 *                  example: null
 *                info:
 *                  type: object
 *                  example: {securityContract: marvel97@naver.com, license: coolmarvel}
 *      responses:
 *        200:
 *          description:  contract generate success
 *          content:
 *            text/html:
 *              schema:
 */