const router = require("express").Router();
const fs = require("fs");

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

    res.send(result);
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
