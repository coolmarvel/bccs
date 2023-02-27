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
