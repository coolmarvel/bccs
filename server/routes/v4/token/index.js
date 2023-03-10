const router = require("express").Router();

const importRouter = require("./import");
const transferRouter = require("./transfer");
const estimateRouter = require("./estimateGas");
const getBalanceRouter = require("./getBalance");
const feeDelegateRouter = require("./feeDelegate");

router.use("/", importRouter);
router.use("/", transferRouter);
router.use("/", estimateRouter);
router.use("/", getBalanceRouter);
router.use("/fd", feeDelegateRouter);

module.exports = router;
