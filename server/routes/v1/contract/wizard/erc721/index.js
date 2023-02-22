const router = require("express").Router();

const { logger } = require("../../../../../utils/winston");

const createERC721 = require("../../../../../service/createContract/erc721");

router.post("/erc721", async (req, res) => {
  try {
    const contract = await createERC721(req.body);

    res.send(contract);
  } catch (error) {
    logger.error(error.message);
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
