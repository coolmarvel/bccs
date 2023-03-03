const router = require("express").Router();

const { logger } = require("../../../../../utils/winston");

const createERC721 = require("../../../../../service/createContract/erc721");

router.post("/wizard", async (req, res) => {
  try {
    const contract = await createERC721(req.body);

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
 *  /v1/contract/nft/wizard:
 *    post:
 *      tags: [V1 (ERC721)]
 *      summary:  "ERC721 Contract Generate"
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
 *                  example: TestNFT
 *                symbol:
 *                  example: TNT
 *                baseUri:
 *                  example: http://localhost:8080
 *                votes:
 *                  example: false
 *                permit:
 *                  example: false
 *                mintable:
 *                  example: true
 *                burnable:
 *                  example: true
 *                pausable:
 *                  example: true
 *                uriStorage:
 *                  example: true
 *                incremental:
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
