const router = require("express").Router();

const wizardRouter = require("./wizard");
const deployRouter = require("./deploy");
const compileRouter = require("./compile");

router.use("/", wizardRouter);
router.use("/", deployRouter);
router.use("/", compileRouter);

module.exports = router;
