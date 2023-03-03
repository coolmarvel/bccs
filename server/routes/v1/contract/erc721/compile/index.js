const router = require("express").Router();

const { logger } = require("../../../../../utils/winston");

const {
  rmDir,
  getFile,
  getFiles,
} = require("../../../../../service/buildFiles");
const createERC721 = require("../../../../../service/createContract/erc721");
const compileContract = require("../../../../../service/compileContract/erc721");

router.post("/compile", async (req, res) => {
  try {
    const { name } = req.body;
    const contract = await createERC721(req.body);
    await compileContract(name, contract);

    let result = [];
    const files = await getFiles();
    for (let i = 0; i < files.length; i++) {
      result.push(await getFile(files[i]));
    }

    await rmDir();

    res.send({ result });
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;

/**
 * @swagger
 * paths:
 *  /v1/contract/nft/compile:
 *    post:
 *      tags: [V1 (ERC721)]
 *      summary: "ERC721 Contract Compile"
 *      requestBody:
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
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  result:
 *                    type: array
 *                    example:
 *                      [{contractName: Context},...,{contractName: TestNFT}]
 */