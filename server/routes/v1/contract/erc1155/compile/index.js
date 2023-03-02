const router = require("express").Router();

const { logger } = require("../../../../../utils/winston");

const {
  rmDir,
  getFile,
  getFiles,
} = require("../../../../../service/buildFiles");
const createERC1155 = require("../../../../../service/createContract/erc1155");
const compileContract = require("../../../../../service/compileContract/erc1155");

router.post("/compile", async (req, res) => {
  try {
    const { name } = req.body;
    const contract = await createERC1155(req.body);
    await compileContract(name, contract);

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
