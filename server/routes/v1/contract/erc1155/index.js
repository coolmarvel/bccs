const router = require("express").Router();

const wizardRouter = require("./wizard");

router.use("/", wizardRouter);

module.exports = router;
