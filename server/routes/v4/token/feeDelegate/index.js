const router = require("express").Router();

const transferRouter = require("./transfer");
const estimateGasRouter = require("./estimateGas");

router.use("/", transferRouter);
router.use("/", estimateGasRouter);

module.exports = router;
