const router = require("express").Router();

const { logger } = require("../../../../../utils/winston");

const {
  rmDir,
  getFile,
  getFiles,
} = require("../../../../../service/buildFiles");
const createERC20 = require("../../../../../service/createContract/erc20");
const compileContract = require("../../../../../service/compileContract/erc20");

router.post("/compile", async (req, res) => {
  try {
    const { name } = req.body;
    const contract = await createERC20(req.body);
    await compileContract(name, contract);

    // const abi = await baobab.abi.encodeContractDeploy(
    //   require(`../../../../../build/contracts/${name}.json`).abi,
    //   require(`../../../../../build/contracts/${name}.json`).bytecode
    // );

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
 *  /v1/contract/ft/compile:
 *    post:
 *      tags: [V1 (ERC20)]
 *      summary: "ERC20 Contract Compile"
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
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  result:
 *                    type: array
 *                    example:
 *                      [{contractName: Context},...,{contractName: TestToken}]
 */