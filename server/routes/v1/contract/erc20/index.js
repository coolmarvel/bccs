const router = require("express").Router();

const compileRouter = require("./compile");
const deployRouter = require("./deploy");
const wizardRouter = require("./wizard");

router.use("/", compileRouter);
router.use("/", deployRouter);
router.use("/", wizardRouter);

module.exports = router;
