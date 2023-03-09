const router = require("express").Router();

const importRouter = require("./import");
const transferRouter = require("./transfer");
const estimateRouter = require("./estimateGas");

router.use("/", importRouter);
router.use("/", transferRouter);
router.use("/", estimateRouter);

module.exports = router;
