const router = require("express").Router();

const sendRouter = require("./send");
const estimateGasRouter = require("./estimateGas");

router.use("/value", sendRouter);
router.use("/value", estimateGasRouter);

module.exports = router;
